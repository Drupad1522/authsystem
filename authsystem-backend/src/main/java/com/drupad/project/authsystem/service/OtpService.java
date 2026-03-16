package com.drupad.project.authsystem.service;

import com.drupad.project.authsystem.entity.UserOtp;
import com.drupad.project.authsystem.entity.Users;
import com.drupad.project.authsystem.exception.OtpException;
import com.drupad.project.authsystem.repository.UserOtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Optional;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private static final int    OTP_EXPIRY_MINUTES = 10;
    private static final int    MAX_ATTEMPTS       = 3;
    private static final long   LOCK_DURATION_MS   = 5L * 60 * 1000; // 5 minutes
    private static final int    OTP_LENGTH         = 6;

    private final UserOtpRepository otpRepository;
    private final EmailService      emailService;

    // ── Generate and send OTP ─────────────────────────────────
    public void generateAndSend(Users user, UserOtp.OtpType otpType, String purpose) {

        // Invalidate any existing unused OTPs of the same type
        otpRepository
            .findTopByUserIdAndOtpTypeAndOtpUsedFalseOrderByCreatedAtDesc(
                user.getUserId(), otpType)
            .ifPresent(existing -> {
                existing.setOtpUsed(true);
                otpRepository.save(existing);
            });

        // Generate new 6-digit OTP
        String otp = generateOtp();

        // Save to DB
        UserOtp userOtp = new UserOtp();
        userOtp.setUserId(user.getUserId());
        userOtp.setOtpCode(otp);
        userOtp.setOtpType(otpType);
        userOtp.setOtpExpiresAt(System.currentTimeMillis() + (OTP_EXPIRY_MINUTES * 60 * 1000L));
        userOtp.setOtpUsed(false);
        userOtp.setOtpAttempts(0);
        otpRepository.save(userOtp);

        // Send email (async — non-blocking)
        emailService.sendOtpEmail(user.getUserMail(), user.getUserName(), otp, purpose);
    }

    // ── Verify OTP ────────────────────────────────────────────
    public void verify(String userId, String inputOtp, UserOtp.OtpType otpType) {

        UserOtp userOtp = otpRepository
            .findTopByUserIdAndOtpTypeAndOtpUsedFalseOrderByCreatedAtDesc(userId, otpType)
            .orElseThrow(() -> new OtpException("No active OTP found. Please request a new one."));

        // Check if locked due to max attempts
        if (userOtp.getOtpAttempts() >= MAX_ATTEMPTS) {
            long lockExpiry = userOtp.getModifiedAt() + LOCK_DURATION_MS;
            if (System.currentTimeMillis() < lockExpiry) {
                long remaining = (lockExpiry - System.currentTimeMillis()) / 1000;
                throw new OtpException(
                    "Too many incorrect attempts. Please retry after " + remaining + " seconds.");
            } else {
                // Lock period passed — invalidate and ask to regenerate
                userOtp.setOtpUsed(true);
                otpRepository.save(userOtp);
                throw new OtpException("OTP expired due to too many attempts. Please request a new one.");
            }
        }

        // Check expiry
        if (System.currentTimeMillis() > userOtp.getOtpExpiresAt()) {
            userOtp.setOtpUsed(true);
            otpRepository.save(userOtp);
            throw new OtpException("OTP has expired. Please request a new one.");
        }

        // Check code match
        if (!userOtp.getOtpCode().equals(inputOtp)) {
            otpRepository.incrementAttempts(userOtp.getOtpId());
            int remaining = MAX_ATTEMPTS - (userOtp.getOtpAttempts() + 1);
            if (remaining <= 0) {
                throw new OtpException("Incorrect OTP. Maximum attempts reached. Please retry after 5 minutes.");
            }
            throw new OtpException("Incorrect OTP. " + remaining + " attempt(s) remaining.");
        }

        // ✅ Valid — mark as used
        otpRepository.markAsUsed(userOtp.getOtpId());
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
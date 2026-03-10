package com.drupad.project.authsystem.service;

import com.drupad.project.authsystem.config.JwtUtil;
import com.drupad.project.authsystem.dto.*;
import com.drupad.project.authsystem.dto.ApiResponse;
import com.drupad.project.authsystem.dto.LoginResponse;
import com.drupad.project.authsystem.dto.OtpVerifyRequest;
import com.drupad.project.authsystem.dto.SignupRequest;
import com.drupad.project.authsystem.dto.UserResponse;
import com.drupad.project.authsystem.entity.UserLogin;
import com.drupad.project.authsystem.entity.UserOtp;
import com.drupad.project.authsystem.entity.Users;
import com.drupad.project.authsystem.exception.AuthException;
import com.drupad.project.authsystem.exception.UserNotFoundException;
import com.drupad.project.authsystem.repository.UserLoginRepository;
import com.drupad.project.authsystem.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsersRepository     usersRepository;
    private final UserLoginRepository userLoginRepository;
    private final PasswordEncoder     passwordEncoder;
    private final JwtUtil             jwtUtil;
    private final OtpService          otpService;

    // ── SIGNUP ────────────────────────────────────────────────
    @Transactional
    public ApiResponse<UserResponse> signup(SignupRequest request) {

        // 1. Confirm passwords match
        if (!request.userPassword().equals(request.confirmPassword())) {
            throw new AuthException("Passwords do not match.");
        }

        // 2. Check for duplicate email
        if (usersRepository.existsByUserMail(request.userMail())) {
            throw new AuthException("An account with this email already exists.");
        }

        // 3. Save Users record
        Users user = new Users();
        user.setUserName(request.userName());
        user.setUserMail(request.userMail());
        user.setUserPhoneCode(request.userPhoneCode());
        user.setUserPhoneNo(request.userPhoneNo());
        usersRepository.save(user);

        // 4. Save UserLogin record
        UserLogin userLogin = new UserLogin();
        userLogin.setUserId(user.getUserId());
        userLogin.setUserPassword(passwordEncoder.encode(request.userPassword()));
        userLogin.setIsActive(true);
        userLogin.setIsEmailVerified(true);
        userLoginRepository.save(userLogin);

//        // 5. Send email verification OTP
//        otpService.generateAndSend(user, UserOtp.OtpType.EMAIL_VERIFICATION, "Email Verification");
//
//        log.info("New user registered: {}", user.getUserMail());

        return ApiResponse.success(
            "Account created successfully. Please verify your email — an OTP has been sent to " + user.getUserMail(),
            toUserResponse(user, userLogin)
        );
    }

    // ── LOGIN ─────────────────────────────────────────────────
    public ApiResponse<LoginResponse> login(com.drupad.project.authsystem.dto.LoginRequest request) {

        // 1. Find user by email
        Users user = usersRepository.findByUserMail(request.userMail())
                .orElseThrow(() -> new AuthException("Invalid email or password."));

        // 2. Find login record
        UserLogin userLogin = userLoginRepository.findByUserId(user.getUserId())
                .orElseThrow(() -> new AuthException("Invalid email or password."));

        // 3. Check account is active
        if (!userLogin.getIsActive()) {
            throw new AuthException("Your account has been disabled. Please contact support.");
        }

        // 4. Check email is verified
        if (!Boolean.TRUE.equals(userLogin.getIsEmailVerified())) {
            throw new AuthException("EMAIL_NOT_VERIFIED:" + user.getUserId());
            // Frontend reads this prefix and redirects to email verification page
        }

        // 5. Validate password
        if (!passwordEncoder.matches(request.userPassword(), userLogin.getUserPassword())) {
            throw new AuthException("Invalid email or password.");
        }

        // 6. Update last login
        userLoginRepository.updateLastLogin(user.getUserId(), System.currentTimeMillis());

        // 7. Generate JWT
        String token = jwtUtil.generateToken(user.getUserId(), user.getUserMail());

        log.info("User logged in: {}", user.getUserMail());

        return ApiResponse.success(
            "Login successful.",
            new LoginResponse(token, jwtUtil.getExpiration(), toUserResponse(user, userLogin))
        );
    }

    // ── RESEND VERIFICATION OTP ───────────────────────────────
    public ApiResponse<Void> resendVerificationOtp(String userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        UserLogin userLogin = userLoginRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        if (Boolean.TRUE.equals(userLogin.getIsEmailVerified())) {
            throw new AuthException("Email is already verified.");
        }

        otpService.generateAndSend(user, UserOtp.OtpType.EMAIL_VERIFICATION, "Email Verification");

        return ApiResponse.success("A new OTP has been sent to " + user.getUserMail());
    }

    // ── VERIFY EMAIL OTP ──────────────────────────────────────
    @Transactional
    public ApiResponse<LoginResponse> verifyEmailOtp(String userId, OtpVerifyRequest request) {

        // 1. Verify OTP (throws OtpException on failure)
        otpService.verify(userId, request.otpCode(), UserOtp.OtpType.EMAIL_VERIFICATION);

        // 2. Mark email as verified
        userLoginRepository.updateEmailVerified(userId, true);

        // 3. Load user and generate JWT so they land on home page immediately
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        UserLogin userLogin = userLoginRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        userLoginRepository.updateLastLogin(userId, System.currentTimeMillis());

        String token = jwtUtil.generateToken(user.getUserId(), user.getUserMail());

        log.info("Email verified for user: {}", user.getUserMail());

        return ApiResponse.success(
            "Email verified successfully. Welcome!",
            new LoginResponse(token, jwtUtil.getExpiration(), toUserResponse(user, userLogin))
        );
    }

    // ── HELPER ────────────────────────────────────────────────
    private UserResponse toUserResponse(Users user, UserLogin userLogin) {
        return new UserResponse(
            user.getUserId(),
            user.getUserName(),
            user.getUserMail(),
            user.getUserPhoneCode(),
            user.getUserPhoneNo(),
            userLogin.getIsEmailVerified(),
            user.getCreatedAt(),
            user.getModifiedAt()
        );
    }
}
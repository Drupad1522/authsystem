package com.drupad.project.authsystem.repository;

import com.drupad.project.authsystem.entity.UserOtp;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
public interface UserOtpRepository extends JpaRepository<UserOtp,String> {
    // Get the latest unused OTP for a user by type
    Optional<UserOtp> findTopByUserIdAndOtpTypeAndOtpUsedFalseOrderByCreatedAtDesc(
            String userId,
            UserOtp.OtpType otpType
    );

    // Mark OTP as used after successful verification
    @Modifying
    @Transactional
    @Query("UPDATE UserOtp o SET o.otpUsed = true WHERE o.otpId = :otpId")
    void markAsUsed(@Param("otpId") String otpId);

    // Increment attempt counter on each wrong OTP entry
    @Modifying
    @Transactional
    @Query("UPDATE UserOtp o SET o.otpAttempts = o.otpAttempts + 1 WHERE o.otpId = :otpId")
    void incrementAttempts(@Param("otpId") String otpId);

    // Delete all OTPs for a user — cleanup after password change
    @Modifying
    @Transactional
    void deleteAllByUserId(String userId);

    // Delete all expired OTPs — for scheduled cleanup job (future use)
    @Modifying
    @Transactional
    @Query("DELETE FROM UserOtp o WHERE o.otpExpiresAt < :now AND o.otpUsed = false")
    void deleteAllExpired(@Param("now") Long now);
}

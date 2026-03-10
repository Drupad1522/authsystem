package com.drupad.project.authsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
public record ChangePasswordRequest(

        @NotBlank(message = "OTP is required")
        String otpCode,

        @NotBlank(message = "New password is required")
        @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must be 8+ characters with at least one uppercase, one digit, and one special character"
        )
        String newPassword,

        @NotBlank(message = "Confirm password is required")
        String confirmPassword

) {}
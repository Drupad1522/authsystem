package com.drupad.project.authsystem.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
public record OtpVerifyRequest(

        @NotBlank(message = "OTP is required")
        String otpCode

) {}
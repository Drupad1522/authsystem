package com.drupad.project.authsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
public record LoginRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        String userMail,

        @NotBlank(message = "Password is required")
        String userPassword

) {}
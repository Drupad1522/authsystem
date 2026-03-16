package com.drupad.project.authsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
public record UpdateUserRequest(

        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        String userName,

        @NotBlank(message = "Phone code is required")
        @Pattern(regexp = "^\\+\\d{1,4}$", message = "Enter a valid country code e.g. +91")
        String userPhoneCode,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^\\d{7,15}$", message = "Enter a valid phone number")
        String userPhoneNo

) {}
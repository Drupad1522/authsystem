package com.drupad.project.authsystem.dto;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
public record LoginResponse(

        String token,
        String tokenType,
        Long expiresIn,
        UserResponse user

) {
    // Convenience constructor — tokenType always "Bearer"
    public LoginResponse(String token, Long expiresIn, UserResponse user) {
        this(token, "Bearer", expiresIn, user);
    }
}
package com.drupad.project.authsystem.dto;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
public record ApiResponse<T>(

        boolean success,
        String message,
        T data

) {
    // Success with data
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    // Success without data
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }

    // Failure
    public static <T> ApiResponse<T> failure(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
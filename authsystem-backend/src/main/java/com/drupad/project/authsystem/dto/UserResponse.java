package com.drupad.project.authsystem.dto;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
public record UserResponse(

        String userId,
        String userName,
        String userMail,
        String userPhoneCode,
        String userPhoneNo,
        Boolean isEmailVerified,
        Long createdAt,
        Long modifiedAt

) {}
package com.drupad.project.authsystem.controller;

import com.drupad.project.authsystem.dto.*;
import com.drupad.project.authsystem.dto.ApiResponse;
import com.drupad.project.authsystem.dto.LoginResponse;
import com.drupad.project.authsystem.dto.OtpVerifyRequest;
import com.drupad.project.authsystem.dto.SignupRequest;
import com.drupad.project.authsystem.dto.UserResponse;
import com.drupad.project.authsystem.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Signup, Login, and Email Verification endpoints")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a new user account")
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserResponse>> signup(
            @Valid @RequestBody SignupRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.signup(request));
    }

    @Operation(summary = "Login with email and password")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody com.drupad.project.authsystem.dto.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Verify email using OTP — call after signup or resend")
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<LoginResponse>> verifyEmail(
            @PathVariable String userId,
            @Valid @RequestBody OtpVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyEmailOtp(userId, request));
    }

    @Operation(summary = "Resend email verification OTP")
    @PostMapping("/resend-otp/{userId}")
    public ResponseEntity<ApiResponse<Void>> resendOtp(
            @PathVariable String userId) {
        return ResponseEntity.ok(authService.resendVerificationOtp(userId));
    }
}
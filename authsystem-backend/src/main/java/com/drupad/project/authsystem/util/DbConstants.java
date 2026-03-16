package com.drupad.project.authsystem.util;
/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */

public class DbConstants {
    // ── Table Names ───────────────────────────────────────────
    public static final String TABLE_USERS            = "users";
    public static final String TABLE_USER_LOGIN       = "user_login";

    // ── users table columns ───────────────────────────────────
    public static final String COLUMN_USER_ID         = "user_id";
    public static final String COLUMN_USER_NAME       = "user_name";
    public static final String COLUMN_USER_MAIL       = "user_mail";
    public static final String COLUMN_USER_PHONE_NO   = "user_phone_no";
    public static final String COLUMN_USER_PHONE_CODE = "user_phone_code";
    public static final String COLUMN_CREATED_AT      = "created_at";
    public static final String COLUMN_MODIFIED_AT     = "modified_at";

    // ── user_login table columns ──────────────────────────────
    public static final String COLUMN_USER_PASSWORD   = "user_password";
    public static final String COLUMN_IS_ACTIVE       = "is_active";
    public static final String COLUMN_LAST_LOGIN      = "last_login";
    public static final String COLUMN_IS_EMAIL_VERIFIED ="is_email_verified";

    // ── user_otp table ────────────────────────────────────────
    public static final String TABLE_USER_OTP          = "user_otp";
    public static final String COLUMN_OTP_ID           = "otp_id";
    public static final String COLUMN_OTP_CODE         = "otp_code";
    public static final String COLUMN_OTP_TYPE         = "otp_type";
    public static final String COLUMN_OTP_EXPIRES_AT   = "otp_expires_at";
    public static final String COLUMN_OTP_USED         = "otp_used";
    public static final String COLUMN_OTP_ATTEMPTS     = "otp_attempts";
}

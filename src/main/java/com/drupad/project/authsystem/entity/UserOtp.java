package com.drupad.project.authsystem.entity;

import com.drupad.project.authsystem.util.DbConstants;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@Table(name = DbConstants.TABLE_USER_OTP)
public class UserOtp extends BaseEntity implements Serializable {

    @Id
    @Column(name = DbConstants.COLUMN_OTP_ID, nullable = false, updatable = false)
    private String otpId;

    @Column(name = DbConstants.COLUMN_USER_ID, nullable = false, updatable = false)
    private String userId;

    @Column(name = DbConstants.COLUMN_OTP_CODE, nullable = false)
    private String otpCode;

    @Enumerated(EnumType.STRING)
    @Column(name = DbConstants.COLUMN_OTP_TYPE, nullable = false)
    private OtpType otpType;

    @Column(name = DbConstants.COLUMN_OTP_EXPIRES_AT, nullable = false)
    private Long otpExpiresAt;

    @Column(name = DbConstants.COLUMN_OTP_USED, nullable = false)
    private Boolean otpUsed = false;

    @Column(name = DbConstants.COLUMN_OTP_ATTEMPTS, nullable = false)
    private Integer otpAttempts = 0;

    // ── FK to Users ───────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = DbConstants.COLUMN_USER_ID,
        referencedColumnName = DbConstants.COLUMN_USER_ID,
        insertable = false,
        updatable = false
    )
    @ToString.Exclude
    private Users user;

    @Override
    public void setId(String id) {
        this.otpId = id;
    }

    @Override
    public String getId() {
        return this.otpId;
    }

    // ── OTP Type Enum ─────────────────────────────────────────
    public enum OtpType {
        PASSWORD_CHANGE,
        EMAIL_VERIFICATION,   // future use
        TWO_FACTOR_AUTH       // future use
    }
}
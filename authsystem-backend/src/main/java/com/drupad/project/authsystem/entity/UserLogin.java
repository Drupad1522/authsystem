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
@Table(name = DbConstants.TABLE_USER_LOGIN)
public class UserLogin extends BaseEntity implements Serializable {

    @Id
    @Column(name = DbConstants.COLUMN_USER_ID, nullable = false, updatable = false)
    private String userId;

    @Column(name = DbConstants.COLUMN_USER_PASSWORD, nullable = false)
    private String userPassword;

    @Column(name = DbConstants.COLUMN_IS_ACTIVE, nullable = false)
    private Boolean isActive = true;

    @Column(name = DbConstants.COLUMN_LAST_LOGIN)
    private Long lastLogin;

    @Column(name=DbConstants.COLUMN_IS_EMAIL_VERIFIED)
    private Boolean isEmailVerified;

    // ── FK relationship to Users ──────────────────────────────
    @OneToOne(fetch = FetchType.LAZY)
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
        this.userId = id;
    }

    @Override
    public String getId() {
        return this.userId;
    }
}
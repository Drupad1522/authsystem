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
@Table(name = DbConstants.TABLE_USERS)
public class Users extends BaseEntity implements Serializable {

    @Id
    @Column(name = DbConstants.COLUMN_USER_ID, nullable = false, updatable = false)
    private String userId;

    @Column(name = DbConstants.COLUMN_USER_NAME, nullable = false)
    private String userName;

    @Column(name = DbConstants.COLUMN_USER_MAIL, nullable = false, unique = true)
    private String userMail;

    @Column(name = DbConstants.COLUMN_USER_PHONE_CODE, nullable = false, length = 5)
    private String userPhoneCode;

    @Column(name = DbConstants.COLUMN_USER_PHONE_NO, nullable = false, length = 15)
    private String userPhoneNo;

    // ── BaseEntity provides: userId(getId), createdAt, modifiedAt ──

    @Override
    public void setId(String id) {
        this.userId = id;
    }

    @Override
    public String getId() {
        return this.userId;
    }
}
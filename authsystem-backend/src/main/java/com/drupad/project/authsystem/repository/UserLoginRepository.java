package com.drupad.project.authsystem.repository;

import com.drupad.project.authsystem.entity.UserLogin;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
public interface UserLoginRepository extends JpaRepository<UserLogin,String> {
    // Find login record by userId
    Optional<UserLogin> findByUserId(String userId);

    // Update last login timestamp
    @Modifying
    @Transactional
    @Query("UPDATE UserLogin u SET u.lastLogin = :lastLogin WHERE u.userId = :userId")
    void updateLastLogin(@Param("userId") String userId,
                         @Param("lastLogin") Long lastLogin);

    // Update isActive status — for account enable/disable
    @Modifying
    @Transactional
    @Query("UPDATE UserLogin u SET u.isActive = :isActive WHERE u.userId = :userId")
    void updateIsActive(@Param("userId") String userId,
                        @Param("isActive") Boolean isActive);

    // Update password — used after OTP verification
    @Modifying
    @Transactional
    @Query("UPDATE UserLogin u SET u.userPassword = :password WHERE u.userId = :userId")
    void updatePassword(@Param("userId") String userId,
                        @Param("password") String password);

    // Update email verified flag
    @Modifying
    @Transactional
    @Query("UPDATE UserLogin u SET u.isEmailVerified = :verified WHERE u.userId = :userId")
    void updateEmailVerified(@Param("userId") String userId,
                             @Param("verified") Boolean verified);
}

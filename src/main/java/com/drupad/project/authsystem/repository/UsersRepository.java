package com.drupad.project.authsystem.repository;

import com.drupad.project.authsystem.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
public interface UsersRepository extends JpaRepository<Users ,String> {
    // Find by email — used during login and signup duplicate check
    Optional<Users> findByUserMail(String userMail);

    // Check if email already exists — used during signup validation
    boolean existsByUserMail(String userMail);

    // Find by phone — future use
    Optional<Users> findByUserPhoneNo(String userPhoneNo);
}

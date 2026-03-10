package com.drupad.project.authsystem.repository;

import com.drupad.project.authsystem.entity.UserLogin;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
public interface UserLoginRepository extends JpaRepository<UserLogin,String> {
}

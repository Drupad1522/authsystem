package com.drupad.project.authsystem.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * @author Drupad S
 * @version 1.0
 * @since 2026-03-10
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendOtpEmail(String toEmail, String userName, String otp, String purpose) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your OTP Code — " + purpose);
            helper.setText(buildOtpEmailBody(userName, otp, purpose), true);
            mailSender.send(message);
            log.info("OTP email sent to {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildOtpEmailBody(String userName, String otp, String purpose) {
        return """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                    <h2 style="color: #1A5276;">Auth System</h2>
                    <p>Hello <strong>%s</strong>,</p>
                    <p>Your OTP for <strong>%s</strong> is:</p>
                    <div style="font-size: 32px; font-weight: bold; color: #1A5276;
                                letter-spacing: 8px; padding: 16px; background: #EAF2FB;
                                text-align: center; border-radius: 8px;">
                        %s
                    </div>
                    <p style="color: #888; margin-top: 16px;">
                        This OTP is valid for <strong>10 minutes</strong>
                        and can only be used <strong>once</strong>.
                    </p>
                    <p style="color: #c0392b;">
                        Do not share this OTP with anyone.
                    </p>
                </div>
                """.formatted(userName, purpose, otp);
    }
}
import { useState, useEffect, useRef } from "react";
import {
  Box, Card, CardContent, Button, Typography,
  Alert, CircularProgress, Link,
} from "@mui/material";
import { MarkEmailReadOutlined } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp } from "../api/authApi";
import AuthLayout from "../components/AuthLayout";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get state passed from signup or forgot password pages
  const { email, purpose = "EMAIL_VERIFICATION", userName = "" } = location.state || {};

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) navigate("/login");
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last char
    setOtp(newOtp);
    setError("");
    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleSubmit();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      setOtp(pasted.split(""));
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ email, otpCode: otpCode, purpose });
      setSuccess("Verified successfully! Redirecting...");
      setTimeout(() => {
        if (purpose === "EMAIL_VERIFICATION") navigate("/login");
        else navigate("/login"); // after password reset also go to login
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid or expired OTP.";
      setError(msg);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    try {
      await resendOtp({ email, purpose });
      setSuccess("OTP resent to your email!");
      setCountdown(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend OTP.";
      setError(msg);
    } finally {
      setResendLoading(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : "";

  return (
    <AuthLayout>
      <Card
        sx={{
          width: "100%", maxWidth: 440,
          background: "rgba(13,27,42,0.95)",
          border: "1px solid rgba(0,198,255,0.12)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          animation: "fadeUp 0.5s ease forwards",
          "@keyframes fadeUp": {
            from: { opacity: 0, transform: "translateY(24px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 52, height: 52, borderRadius: "14px",
                background: "linear-gradient(135deg, #00C6FF, #0072FF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(0,198,255,0.3)",
              }}
            >
              <MarkEmailReadOutlined sx={{ color: "#fff", fontSize: 26 }} />
            </Box>
            <Typography variant="h5" sx={{ color: "#E8F4FD", mb: 0.5 }}>
              {userName ? `Welcome, ${userName}!` : "Verify Your Email"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#7FA8C9", lineHeight: 1.6 }}>
              An OTP has been sent to your Email ID
            </Typography>
            <Typography variant="body2" sx={{ color: "#00C6FF", fontWeight: 600, mt: 0.5 }}>
              {maskedEmail}
            </Typography>
            <Typography variant="body2" sx={{ color: "#7FA8C9", mt: 0.5 }}>
              Enter OTP here
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: "0.85rem" }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2, fontSize: "0.85rem" }}>
              {success}
            </Alert>
          )}

          {/* OTP Input Boxes */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1.5, mb: 3 }}
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <Box
                key={index}
                component="input"
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                sx={{
                  width: 52, height: 60,
                  textAlign: "center", fontSize: "1.6rem", fontWeight: 700,
                  fontFamily: "'Syne', sans-serif",
                  background: "rgba(255,255,255,0.04)",
                  border: digit
                    ? "2px solid #00C6FF"
                    : "2px solid rgba(0,198,255,0.2)",
                  borderRadius: "12px",
                  color: "#E8F4FD",
                  outline: "none",
                  caretColor: "#00C6FF",
                  transition: "all 0.2s ease",
                  "&:focus": {
                    border: "2px solid #00C6FF",
                    background: "rgba(0,198,255,0.06)",
                    boxShadow: "0 0 0 3px rgba(0,198,255,0.12)",
                  },
                }}
              />
            ))}
          </Box>

          {/* Confirm Button */}
          <Button
            fullWidth variant="contained" onClick={handleSubmit} disabled={loading}
            sx={{
              py: 1.4, borderRadius: 2,
              background: "linear-gradient(135deg, #00C6FF, #0072FF)",
              boxShadow: "0 8px 24px rgba(0,198,255,0.25)",
              "&:hover": { background: "linear-gradient(135deg, #00D4FF, #0080FF)" },
              "&:disabled": { background: "rgba(0,198,255,0.2)" },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Confirm"}
          </Button>

          {/* Resend + Countdown */}
          <Box sx={{ textAlign: "center", mt: 2.5 }}>
            {countdown > 0 ? (
              <Typography variant="body2" sx={{ color: "#7FA8C9" }}>
                Resend OTP in{" "}
                <Box component="span" sx={{ color: "#00C6FF", fontWeight: 600 }}>
                  {countdown}s
                </Box>
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ color: "#7FA8C9" }}>
                Didn't receive?{" "}
                <Link
                  onClick={!resendLoading ? handleResend : undefined}
                  sx={{
                    color: "#00C6FF", cursor: "pointer", fontWeight: 600,
                    textDecoration: "none", "&:hover": { textDecoration: "underline" },
                    opacity: resendLoading ? 0.5 : 1,
                  }}
                >
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </Link>
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default OtpPage;
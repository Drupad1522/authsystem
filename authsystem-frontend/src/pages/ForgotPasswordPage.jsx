import { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Link, Alert, CircularProgress,
} from "@mui/material";
import { LockResetOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import AuthLayout from "../components/AuthLayout";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) { setError("Please enter your email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address."); return;
    }
    setLoading(true);
    try {
      await forgotPassword({ email });
      // Go to OTP page with forgot password purpose
      navigate("/verify", { state: { email, purpose: "FORGOT_PASSWORD" } });
    } catch (err) {
      const msg = err.response?.data?.message || "Email not found. Please check and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 52, height: 52, borderRadius: "14px",
                background: "linear-gradient(135deg, #00C6FF, #0072FF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 8px 24px rgba(0,198,255,0.3)",
              }}
            >
              <LockResetOutlined sx={{ color: "#fff", fontSize: 26 }} />
            </Box>
            <Typography variant="h5" sx={{ color: "#E8F4FD", mb: 0.5 }}>
              Reset Password
            </Typography>
            <Typography variant="body2" sx={{ color: "#7FA8C9", lineHeight: 1.6 }}>
              Enter your registered email address. We'll send an OTP to reset your password.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: "0.85rem" }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Email ID" type="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            fullWidth size="medium"
            InputProps={{ sx: { borderRadius: 2, background: "rgba(255,255,255,0.03)" } }}
          />

          <Button
            fullWidth variant="contained" onClick={handleSubmit} disabled={loading}
            sx={{
              mt: 3, py: 1.4, borderRadius: 2,
              background: "linear-gradient(135deg, #00C6FF, #0072FF)",
              boxShadow: "0 8px 24px rgba(0,198,255,0.25)",
              "&:hover": { background: "linear-gradient(135deg, #00D4FF, #0080FF)" },
              "&:disabled": { background: "rgba(0,198,255,0.2)" },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Send OTP"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center", color: "#7FA8C9", mt: 2.5 }}>
            Remember your password?{" "}
            <Link
              onClick={() => navigate("/login")}
              sx={{ color: "#00C6FF", cursor: "pointer", fontWeight: 600,
                    textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Back to Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
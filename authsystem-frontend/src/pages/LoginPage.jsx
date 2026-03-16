import { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Link, Alert, InputAdornment, IconButton, CircularProgress, Divider,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import AuthLayout from "../components/AuthLayout";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await login(form);
      const token = res.data?.token || res.data?.accessToken;
      if (token) localStorage.setItem("token", token);
      localStorage.setItem("userName", res.data?.userName || res.data?.name || form.email);
      navigate("/home");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <AuthLayout>
      <Card
        sx={{
          width: "100%", maxWidth: 440,
          background: "rgba(13,27,42,0.95)",
          border: "1px solid rgba(0,198,255,0.12)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,198,255,0.05)",
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
              <LockOutlined sx={{ color: "#fff", fontSize: 26 }} />
            </Box>
            <Typography variant="h5" sx={{ color: "#E8F4FD", mb: 0.5 }}>
              AuthSystem
            </Typography>
            <Typography variant="body2" sx={{ color: "#7FA8C9" }}>
              Sign in to your account
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: "0.85rem" }}>
              {error}
            </Alert>
          )}

          {/* Fields */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email ID" name="email" type="email"
              value={form.email} onChange={handleChange} onKeyDown={handleKeyDown}
              fullWidth size="medium" autoComplete="email"
              InputProps={{ sx: { borderRadius: 2, background: "rgba(255,255,255,0.03)" } }}
            />
            <TextField
              label="Password" name="password"
              type={showPassword ? "text" : "password"}
              value={form.password} onChange={handleChange} onKeyDown={handleKeyDown}
              fullWidth size="medium"
              InputProps={{
                sx: { borderRadius: 2, background: "rgba(255,255,255,0.03)" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff sx={{ color: "#7FA8C9" }} /> : <Visibility sx={{ color: "#7FA8C9" }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Forgot Password */}
          <Box sx={{ textAlign: "right", mt: 1 }}>
            <Link
              onClick={() => navigate("/forgot-password")}
              sx={{ color: "#00C6FF", cursor: "pointer", fontSize: "0.85rem", textDecoration: "none",
                    "&:hover": { textDecoration: "underline" } }}
            >
              Forgot Password?
            </Link>
          </Box>

          {/* Login Button */}
          <Button
            fullWidth variant="contained" onClick={handleSubmit} disabled={loading}
            sx={{
              mt: 2.5, py: 1.4, borderRadius: 2,
              background: "linear-gradient(135deg, #00C6FF, #0072FF)",
              boxShadow: "0 8px 24px rgba(0,198,255,0.25)",
              "&:hover": { background: "linear-gradient(135deg, #00D4FF, #0080FF)", boxShadow: "0 12px 32px rgba(0,198,255,0.35)" },
              "&:disabled": { background: "rgba(0,198,255,0.2)" },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Login"}
          </Button>

          <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.07)" }} />

          {/* Register Link */}
          <Typography variant="body2" sx={{ textAlign: "center", color: "#7FA8C9" }}>
            New user?{" "}
            <Link
              onClick={() => navigate("/signup")}
              sx={{ color: "#00C6FF", cursor: "pointer", fontWeight: 600, textDecoration: "none",
                    "&:hover": { textDecoration: "underline" } }}
            >
              Register here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
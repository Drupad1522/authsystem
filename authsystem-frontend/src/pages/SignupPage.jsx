import { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Link, Alert, InputAdornment, IconButton, CircularProgress,
  MenuItem, Select, FormControl, InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff, PersonAddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";
import AuthLayout from "../components/AuthLayout";

const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+971", label: "🇦🇪 +971" },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", countryCode: "+91",
    phoneNumber: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.name || !form.email || !form.phoneNumber || !form.password || !form.confirmPassword)
      return "Please fill in all fields.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Please enter a valid email address.";
    if (form.password.length < 8)
      return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    try {
      await signup({
        userName: form.name,
        userMail: form.email,
        userPhoneCode :form.countryCode ,
        userPhoneNo: form.phoneNumber,
        userPassword: form.password,
        confirmPassword :form.confirmPassword
      });
      // Pass email to OTP page for verification
      navigate("/verify", { state: { email: form.email, purpose: "EMAIL_VERIFICATION", userName: form.name } });
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card
        sx={{
          width: "100%", maxWidth: 480,
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
              <PersonAddOutlined sx={{ color: "#fff", fontSize: 26 }} />
            </Box>
            <Typography variant="h5" sx={{ color: "#E8F4FD", mb: 0.5 }}>
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: "#7FA8C9" }}>
              User Registration Form
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: "0.85rem" }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Name */}
            <TextField
              label="Full Name" name="name" value={form.name}
              onChange={handleChange} fullWidth size="medium"
              InputProps={{ sx: { borderRadius: 2, background: "rgba(255,255,255,0.03)" } }}
            />

            {/* Email */}
            <TextField
              label="Email" name="email" type="email" value={form.email}
              onChange={handleChange} fullWidth size="medium"
              InputProps={{ sx: { borderRadius: 2, background: "rgba(255,255,255,0.03)" } }}
            />

            {/* Phone Code + Number */}
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Code</InputLabel>
                <Select
                  name="countryCode" value={form.countryCode}
                  onChange={handleChange} label="Code"
                  sx={{ borderRadius: 2, background: "rgba(255,255,255,0.03)" }}
                >
                  {COUNTRY_CODES.map((c) => (
                    <MenuItem key={c.code} value={c.code}>{c.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Phone Number" name="phoneNumber" value={form.phoneNumber}
                onChange={handleChange} fullWidth size="medium" type="tel"
                InputProps={{ sx: { borderRadius: 2, background: "rgba(255,255,255,0.03)" } }}
              />
            </Box>

            {/* Password */}
            <TextField
              label="Password" name="password"
              type={showPassword ? "text" : "password"}
              value={form.password} onChange={handleChange} fullWidth
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

            {/* Confirm Password */}
            <TextField
              label="Confirm Password" name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword} onChange={handleChange} fullWidth
              InputProps={{
                sx: { borderRadius: 2, background: "rgba(255,255,255,0.03)" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small">
                      {showConfirm ? <VisibilityOff sx={{ color: "#7FA8C9" }} /> : <Visibility sx={{ color: "#7FA8C9" }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Signup Button */}
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
            {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Sign Up"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center", color: "#7FA8C9", mt: 2.5 }}>
            Already have an account?{" "}
            <Link
              onClick={() => navigate("/login")}
              sx={{ color: "#00C6FF", cursor: "pointer", fontWeight: 600, textDecoration: "none",
                    "&:hover": { textDecoration: "underline" } }}
            >
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
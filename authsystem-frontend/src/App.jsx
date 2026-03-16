import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OtpPage from "./pages/OtpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00C6FF" },
    secondary: { main: "#0072FF" },
    background: { default: "#050A14", paper: "#0D1B2A" },
    text: { primary: "#E8F4FD", secondary: "#7FA8C9" },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h4: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
    h5: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
    h6: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#1A3A5C" },
            "&:hover fieldset": { borderColor: "#00C6FF" },
            "&.Mui-focused fieldset": { borderColor: "#00C6FF" },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#00C6FF" },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
          letterSpacing: "0.5px",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify" element={<OtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
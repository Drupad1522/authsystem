import { Box, Typography, Button, Card, CardContent, Chip } from "@mui/material";
import { LogoutOutlined, VerifiedUserOutlined, ShieldOutlined, VpnKeyOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #050A14 0%, #0A1628 50%, #050A14 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""', position: "absolute",
          width: "700px", height: "700px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,198,255,0.06) 0%, transparent 70%)",
          top: "-200px", right: "-200px", pointerEvents: "none",
        },
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Navbar */}
      <Box
        sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          px: { xs: 3, md: 6 }, py: 2.5,
          borderBottom: "1px solid rgba(0,198,255,0.08)",
          backdropFilter: "blur(20px)",
          background: "rgba(5,10,20,0.8)",
          position: "sticky", top: 0, zIndex: 10,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: "10px",
              background: "linear-gradient(135deg, #00C6FF, #0072FF)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ShieldOutlined sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ color: "#E8F4FD", fontFamily: "'Syne', sans-serif" }}>
            AuthSystem
          </Typography>
        </Box>

        <Button
          onClick={handleLogout} variant="outlined" startIcon={<LogoutOutlined />}
          sx={{
            color: "#7FA8C9", borderColor: "rgba(0,198,255,0.2)", borderRadius: 2,
            textTransform: "none", fontWeight: 500,
            "&:hover": { borderColor: "#00C6FF", color: "#00C6FF", background: "rgba(0,198,255,0.05)" },
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: 800, margin: "0 auto",
          px: { xs: 3, md: 4 }, py: { xs: 6, md: 10 },
          animation: "fadeUp 0.6s ease forwards",
          "@keyframes fadeUp": {
            from: { opacity: 0, transform: "translateY(24px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {/* Welcome */}
        <Chip
          label="✓ Authenticated"
          sx={{
            background: "rgba(0,198,255,0.1)", color: "#00C6FF",
            border: "1px solid rgba(0,198,255,0.2)", mb: 3,
            fontWeight: 600, fontSize: "0.8rem",
          }}
        />
        <Typography
          variant="h4"
          sx={{
            color: "#E8F4FD", mb: 1,
            fontSize: { xs: "1.8rem", md: "2.4rem" },
          }}
        >
          Welcome,{" "}
          <Box component="span" sx={{ color: "#00C6FF" }}>
            {userName}
          </Box>{" "}
          👋
        </Typography>
        <Typography variant="body1" sx={{ color: "#7FA8C9", mb: 6, maxWidth: 520, lineHeight: 1.7 }}>
          This system will authenticate users and provide JWT-based secure access.
          You are now successfully signed in.
        </Typography>

        {/* Info Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
          {[
            { icon: <VerifiedUserOutlined />, title: "Email Verified", desc: "Your email address has been successfully verified." },
            { icon: <VpnKeyOutlined />, title: "JWT Secured", desc: "Session is secured with a JSON Web Token." },
            { icon: <ShieldOutlined />, title: "Protected Access", desc: "All routes are protected with auth middleware." },
          ].map((item, i) => (
            <Card
              key={i}
              sx={{
                background: "rgba(13,27,42,0.8)",
                border: "1px solid rgba(0,198,255,0.1)",
                borderRadius: 3,
                transition: "all 0.2s ease",
                animation: `fadeUp 0.5s ease ${i * 0.1 + 0.2}s both`,
                "&:hover": {
                  border: "1px solid rgba(0,198,255,0.25)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ color: "#00C6FF", mb: 1.5 }}>{item.icon}</Box>
                <Typography variant="subtitle1" sx={{ color: "#E8F4FD", fontWeight: 600, mb: 0.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#7FA8C9", lineHeight: 1.6 }}>
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
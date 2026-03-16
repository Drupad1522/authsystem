import { Box } from "@mui/material";

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #050A14 0%, #0A1628 50%, #050A14 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,198,255,0.07) 0%, transparent 70%)",
          top: "-100px",
          right: "-100px",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,114,255,0.06) 0%, transparent 70%)",
          bottom: "-80px",
          left: "-80px",
          pointerEvents: "none",
        },
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      {children}
    </Box>
  );
};

export default AuthLayout;
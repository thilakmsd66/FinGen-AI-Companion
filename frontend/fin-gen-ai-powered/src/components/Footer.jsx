import React from "react";
import { Box, Typography, Divider } from "@mui/material";
 
const Footer = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1200,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background: "rgba(238, 81, 8, 0.85)",
        borderTop: "1px solid rgba(255,255,255,0.15)",
        color: "#fff",
      }}
    >
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
 
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={3}
        py={1}
        flexWrap="wrap"
      >
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          © {new Date().getFullYear()} FinGen AI — Developed by{" "}
          <strong>Thilak Suvarna</strong>
        </Typography>
 
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Facing issues? Contact Helpdesk: <strong>+91 9XXXXXXXXX</strong>
        </Typography>
      </Box>
    </Box>
  );
};
 
export default Footer;
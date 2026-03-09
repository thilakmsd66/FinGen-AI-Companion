import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip
} from "@mui/material";
import { motion } from "framer-motion";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MapIcon from "@mui/icons-material/Map";
import ChatIcon from "@mui/icons-material/Chat";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import axios from "axios";

/* =========================
   STAT CARD
========================= */
const StatCard = ({ title, value, subtitle, icon, gradient }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 200 }}
  >
    <Card
      sx={{
        height: "100%",
        color: "#fff",
        background: gradient,
        borderRadius: 3,
        boxShadow: 6
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
        </Box>

        <Typography variant="h4" mt={2} fontWeight={700}>
          {value}
        </Typography>

        <Typography variant="body2" mt={1} sx={{ opacity: 0.9 }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

/* =========================
   HOME
========================= */
const Home = () => {
  const [stats, setStats] = useState({
    attempted: 0,
    average_score: 0,
    coverage: 0,
    improvement: 0
  });

  /* =========================
     LOAD ANALYTICS
  ========================= */
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8001/analytics/overview")
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <Box p={3}>
      {/* =========================
          HERO SECTION
      ========================= */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          color: "#fff",
          boxShadow: 6
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          👋 Welcome to FinGen
        </Typography>

        <Typography variant="h6" mt={1} sx={{ opacity: 0.9 }}>
          Your AI-powered ASM L2 Learning & Knowledge Companion
        </Typography>

        <Box mt={3} display="flex" gap={1} flexWrap="wrap">
          <Chip icon={<SchoolIcon />} label="Knowledge Hub" color="primary" />
          <Chip icon={<ChatIcon />} label="AI Chat" color="success" />
          <Chip icon={<MapIcon />} label="RoadMap" color="info" />
          <Chip icon={<AssignmentIcon />} label="Assessments" color="warning" />
          <Chip icon={<BarChartIcon />} label="Analytics" color="secondary" />
        </Box>
      </Paper>

      {/* =========================
          STATS SECTION
      ========================= */}
      <Typography variant="h5" mb={2} fontWeight={600}>
        Learning & Performance Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Assessments Attempted"
            value={stats.attempted}
            subtitle="Last 30 days"
            icon={<SchoolIcon />}
            gradient="linear-gradient(135deg, #667eea, #764ba2)"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Average Score"
            value={`${stats.average_score} / 10`}
            subtitle="Overall performance"
            icon={<AutoGraphIcon />}
            gradient="linear-gradient(135deg, #43cea2, #185a9d)"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Knowledge Coverage"
            value={`${stats.coverage}%`}
            subtitle="Across ASM domains"
            icon={<PsychologyIcon />}
            gradient="linear-gradient(135deg, #f7971e, #ffd200)"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Improvement Trend"
            value={`${stats.improvement}%`}
            subtitle="Compared to last period"
            icon={<TrendingUpIcon />}
            gradient="linear-gradient(135deg, #ff512f, #dd2476)"
          />
        </Grid>
      </Grid>

      {/* =========================
          FOOTER NOTE
      ========================= */}
      <Paper
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 3,
          background: "#f5f7fa"
        }}
      >
        <Typography variant="body1">
          💡 <strong>Tip:</strong> Use the <b>AI Chat</b> after each assessment
          to understand gaps and improve faster.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home;

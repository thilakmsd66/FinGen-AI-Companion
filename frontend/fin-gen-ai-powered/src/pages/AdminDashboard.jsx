import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
  Stack,
  Chip,
  CircularProgress
} from "@mui/material";
import { motion } from "framer-motion";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import { fetchAdminAnalytics } from "../services/api";

/* ================= GLASS STYLE ================= */

const glassCard = {
  borderRadius: 4,
  background: "rgba(25, 30, 45, 0.65)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
  color: "#fff"
};

/* ================= COMPONENT ================= */

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await fetchAdminAnalytics();
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        height="70vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight={700} mb={1}>
        🛡️ Admin Analytics Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        User-wise assessment performance & learning insights
      </Typography>

      {/* TOP STATS */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={glassCard}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "#1e88e5" }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5">{data.total_users}</Typography>
                  <Typography variant="body2">
                    Total Users
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={glassCard}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "#43a047" }}>
                  <AssessmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5">{data.total_attempts}</Typography>
                  <Typography variant="body2">
                    Assessments Taken
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={glassCard}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "#fbc02d" }}>
                  <StarIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    {data.average_score} / 10
                  </Typography>
                  <Typography variant="body2">
                    Overall Average Score
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* USER-WISE DETAILS */}
      <Typography variant="h5" mb={2}>
        👤 User Performance Details
      </Typography>

      <Grid container spacing={3}>
        {data.users.map((u, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card sx={glassCard}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "#3949ab" }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{u.name}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {u.email}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

                  <Typography variant="body2">
                    Attempts: <strong>{u.attempts}</strong>
                  </Typography>

                  <Typography variant="body2">
                    Average Score:{" "}
                    <strong>{u.average_score} / 10</strong>
                  </Typography>

                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Recent Scores
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {u.recent_scores.map((s, i) => (
                        <Chip
                          key={i}
                          label={s}
                          color={
                            s >= 8
                              ? "success"
                              : s >= 5
                              ? "warning"
                              : "error"
                          }
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { Grid, Card, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { fetchAnalyticsOverview } from "../services/api";

const StatCard = ({ title, value, subtitle }) => (
  <motion.div whileHover={{ scale: 1.04 }}>
    <Card sx={{ p: 3, boxShadow: 3 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>

      <Typography variant="h4" fontWeight="bold" mt={1}>
        {value}
      </Typography>

      <Typography variant="body2" color="text.secondary" mt={1}>
        {subtitle}
      </Typography>
    </Card>
  </motion.div>
);

const OverviewCards = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalyticsOverview().then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Assessments Attempted"
          value={data.attempted}
          subtitle="Last 30 days"
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <StatCard
          title="Average Score"
          value={`${data.average_score} / 10`}
          subtitle="Overall performance"
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <StatCard
          title="Knowledge Coverage"
          value={`${data.coverage}%`}
          subtitle="Custody, Cash, CA, Reporting"
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <StatCard
          title="Improvement Trend"
          value={`${data.improvement > 0 ? "+" : ""}${data.improvement}%`}
          subtitle="Compared to last month"
        />
      </Grid>
    </Grid>
  );
};

export default OverviewCards;

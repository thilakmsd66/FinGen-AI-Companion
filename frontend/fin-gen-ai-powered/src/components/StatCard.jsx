import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function StatCard({ title, value }) {
  return (
    <Grid item xs={12} md={4}>
      <Card>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="h4">{value}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

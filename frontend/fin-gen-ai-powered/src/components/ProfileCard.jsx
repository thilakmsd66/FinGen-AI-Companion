import { Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function ProfileCard() {
  const { user } = useAuth();

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">Employee Profile</Typography>
        <Typography>Name: {user.name}</Typography>
        <Typography>Role: {user.role}</Typography>
        <Typography>Employee ID: {user.employeeId}</Typography>
        <Typography>Department: {user.department}</Typography>
        <Typography>Location: {user.location}</Typography>
      </CardContent>
    </Card>
  );
}

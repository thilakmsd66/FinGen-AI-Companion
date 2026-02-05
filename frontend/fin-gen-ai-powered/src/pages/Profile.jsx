import React from "react";
import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <Box p={3} maxWidth={500} mx="auto">
      <Card>
        <CardContent sx={{ textAlign: "center" }}>
          <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}>
            {user.name[0]}
          </Avatar>

          <Typography variant="h5">{user.name}</Typography>
          <Typography color="text.secondary">{user.email}</Typography>

          <Typography mt={2}>
            Role: <strong>{user.role.toUpperCase()}</strong>
          </Typography>

          <Typography mt={1}>
            Status: Active ASM Support Engineer
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;

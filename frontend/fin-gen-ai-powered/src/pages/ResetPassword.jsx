import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async () => {
    if (!password || !confirm) {
      setError("All fields are required");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);
      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Reset failed");
    }
  };

  if (!token) {
    return <Alert severity="error">Invalid reset link</Alert>;
  }

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h4" mb={2}>
        Reset Password
      </Typography>

      <TextField
        fullWidth
        label="New Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        margin="normal"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleReset}
      >
        Set New Password
      </Button>
    </Box>
  );
};

export default ResetPassword;

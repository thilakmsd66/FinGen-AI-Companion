import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";
import { registerUser } from "../services/api";   // ✅ CORRECT
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    try {
      await registerUser(form);   // ✅ FIX HERE
      setSuccess("Account created successfully. Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <Box maxWidth={450} mx="auto" mt={8} p={4}>
      <Typography variant="h4" textAlign="center" mb={2}>
        Create Account
      </Typography>

      <TextField
        fullWidth
        label="Full Name"
        name="name"
        margin="normal"
        value={form.name}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        margin="normal"
        value={form.email}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        margin="normal"
        value={form.password}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        select
        label="Role"
        name="role"
        margin="normal"
        value={form.role}
        onChange={handleChange}
      >
        <MenuItem value="user">ASM Support Engineer</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        onClick={handleRegister}
      >
        CREATE ACCOUNT
      </Button>

      <Button
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => navigate("/login")}
      >
        Back to Login
      </Button>
    </Box>
  );
};

export default Register;

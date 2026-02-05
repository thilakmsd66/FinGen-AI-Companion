import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // 🔴 IMPORTANT
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h4" mb={2}>
        Login
      </Typography>

      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          type="submit"   // 🔴 IMPORTANT
        >
          Login
        </Button>
      </form>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Link component="button" onClick={() => navigate("/forgot-password")}>
          Forgot password?
        </Link>

        <Link component="button" onClick={() => navigate("/register")}>
          Create account
        </Link>
      </Box>
    </Box>
  );
};

export default Login;

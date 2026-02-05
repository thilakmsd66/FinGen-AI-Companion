import { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box } from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8001/auth/forgot-password", { email });
      setMsg(res.data.message);
    } catch {
      setMsg("Email not registered");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
      <Typography variant="h6">Forgot Password</Typography>
      <TextField fullWidth label="Email" onChange={e => setEmail(e.target.value)} />
      <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={submit}>
        Send Reset Link
      </Button>
      <Typography sx={{ mt: 2 }}>{msg}</Typography>
    </Box>
  );
}

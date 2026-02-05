import { Box, Typography } from "@mui/material";

export default function ChatBubble({ text, sender }) {
  return (
    <Box
      alignSelf={sender === "user" ? "flex-end" : "flex-start"}
      bgcolor={sender === "user" ? "#1976d2" : "#e0e0e0"}
      color={sender === "user" ? "white" : "black"}
      p={1.5}
      mb={1}
      borderRadius={2}
      maxWidth="70%"
    >
      <Typography>{text}</Typography>
    </Box>
  );
}

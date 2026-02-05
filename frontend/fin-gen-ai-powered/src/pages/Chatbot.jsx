import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Switch,
  FormControlLabel,
  Chip
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { motion } from "framer-motion";
import { sendChatMessage } from "../services/api";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const CONTEXT_LIMIT = 6;

/* ================= GLASS STYLES ================= */
const glassBubble = {
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 8px 32px rgba(31,38,135,0.25)"
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ================= SPEECH TO TEXT ================= */
  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (e) => {
      sendMessage(e.results[0][0].transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  /* ================= TEXT TO SPEECH ================= */
  const speak = (text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const history = updated
        .slice(-CONTEXT_LIMIT)
        .map((m) => m.content);

      const res = await sendChatMessage(text, history);

      const botMsg = {
        role: "bot",
        content: res.data.answer,
        sources: res.data.sources || []
      };

      setMessages((prev) => [...prev, botMsg]);
      speak(res.data.answer);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ AI service unavailable." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      height="85vh"
      display="flex"
      flexDirection="column"
      sx={{
        background:
          "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        borderRadius: 4,
        p: 2
      }}
    >
      {/* ================= HEADER ================= */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" color="#fff" fontWeight={600}>
          🤖 FinGen – Conversational AI Companion
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={voiceEnabled}
              onChange={() => setVoiceEnabled(!voiceEnabled)}
            />
          }
          label={<VolumeUpIcon sx={{ color: "#fff" }} />}
        />
      </Box>

      {/* ================= CHAT AREA ================= */}
      <Box
        flex={1}
        overflow="auto"
        sx={{
          p: 2,
          borderRadius: 3,
          background: "rgba(255,255,255,0.12)"
        }}
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Box
              display="flex"
              justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
              mb={2}
            >
              {msg.role === "bot" && (
                <Avatar sx={{ bgcolor: "#1e88e5", mr: 1 }}>
                  <SmartToyIcon />
                </Avatar>
              )}

              <Box
                sx={{
                  ...glassBubble,
                  p: 2,
                  maxWidth: "70%",
                  borderRadius: 3,
                  background:
                    msg.role === "user"
                      ? "rgba(30,136,229,0.35)"
                      : "rgba(255,255,255,0.3)",
                  color: msg.role === "user" ? "#fff" : "#000"
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>

                {msg.sources?.length > 0 && (
                  <Box mt={1}>
                    <Typography variant="caption">
                      Sources
                    </Typography>
                    <Box mt={0.5} display="flex" gap={0.5} flexWrap="wrap">
                      {msg.sources.map((s, idx) => (
                        <Chip
                          key={idx}
                          label={s}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {msg.role === "user" && (
                <Avatar sx={{ bgcolor: "#43a047", ml: 1 }}>
                  <PersonIcon />
                </Avatar>
              )}
            </Box>
          </motion.div>
        ))}

        {loading && (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={18} />
            <Typography color="#fff">
              AI analyzing knowledge base…
            </Typography>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* ================= INPUT ================= */}
      <Box display="flex" gap={1} mt={2}>
        <TextField
          fullWidth
          placeholder="Ask anything from the knowledge base…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          sx={{
            background: "rgba(255,255,255,0.9)",
            borderRadius: 2
          }}
        />

        <IconButton
          onClick={() => recognitionRef.current?.start()}
          sx={{
            background: listening
              ? "rgba(244,67,54,0.3)"
              : "rgba(255,255,255,0.7)",
            animation: listening ? "pulse 1s infinite" : "none"
          }}
        >
          <MicIcon color={listening ? "error" : "primary"} />
        </IconButton>

        <IconButton onClick={() => sendMessage(input)}>
          <SendIcon sx={{ color: "#fff" }} />
        </IconButton>
      </Box>

      {/* ================= PULSE ================= */}
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(244,67,54,0.6); }
            70% { box-shadow: 0 0 0 12px rgba(244,67,54,0); }
            100% { box-shadow: 0 0 0 0 rgba(244,67,54,0); }
          }
        `}
      </style>
    </Box>
  );
};

export default Chatbot;

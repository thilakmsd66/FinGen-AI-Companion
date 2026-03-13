import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Stack,
  MenuItem
} from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";
import {
  getAssessmentQuestion,
  submitAssessment
} from "../services/api";

/* ================= SCORE UTILS ================= */

const scoreColor = (score) => {
  if (score <= 3) return "#ef5350";
  if (score <= 6) return "#ffa726";
  if (score <= 8) return "#42a5f5";
  return "#66bb6a";
};

/* ================= TOPIC LIST ================= */

const topics = [
  "Custody",
  "Cash",
  "Corporate Actions",
  "Reporting",
  "Incident Management"
];

/* ================= GLASS CARD STYLE ================= */

const glassCard = {
  background: "rgba(20,25,35,0.85)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  borderRadius: 4,
  border: "1px solid rgba(255,255,255,0.15)",
  boxShadow: "0 25px 50px rgba(0,0,0,0.65)",
  color: "#ffffff"
};

/* ================= MARKDOWN STYLES ================= */

const markdownStyles = {
  "& ol": { paddingLeft: "1.4rem", marginTop: "0.5rem" },
  "& ul": { paddingLeft: "1.4rem", marginTop: "0.5rem" },
  "& li": { marginBottom: "0.4rem" },
  "& strong": { fontWeight: 700 }
};

/* ================= COMPONENT ================= */

const Assessment = () => {

  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===== FETCH QUESTION ===== */

  const fetchQuestion = async () => {

    if (!topic) {
      alert("Please select a topic first");
      return;
    }

    setLoading(true);
    setResult(null);
    setAnswer("");
    setQuestion("");

    try {
      const res = await getAssessmentQuestion(topic);
      setQuestion(res.data.question);
      setTopic(res.data.topic);
    } finally {
      setLoading(false);
    }
  };

  /* ===== SUBMIT ANSWER ===== */

  const handleSubmit = async () => {

    if (!answer.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await submitAssessment(question, answer, topic);
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)"
      }}
    >
      <Box maxWidth={900} mx="auto">

        {/* HEADER */}

        <Typography
          variant="h4"
          fontWeight={800}
          mb={4}
          sx={{ color: "#fff" }}
        >
          🧠 ASM L2 Knowledge Assessment
        </Typography>

        {/* TOPIC + BUTTON ROW */}

        <Stack direction="row" spacing={2} alignItems="center" mb={3}>

          <TextField
            select
            label="Select Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{
              width: 260,
              label: { color: "#b0bec5" },
              "& .MuiOutlinedInput-root": {
                background: "rgba(255,255,255,0.08)",
                borderRadius: 3,
                color: "#fff"
              }
            }}
          >
            {topics.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            startIcon={<QuizIcon />}
            onClick={fetchQuestion}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.2,
              fontWeight: 600,
              background: "linear-gradient(135deg,#42a5f5,#1e88e5)",
              boxShadow: "0 8px 20px rgba(66,165,245,0.35)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(66,165,245,0.5)"
              }
            }}
          >
            Get Question
          </Button>

        </Stack>

        {loading && <LinearProgress sx={{ mt: 2 }} />}

        {/* QUESTION */}

        {question && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card sx={{ ...glassCard, mt: 3 }}>
              <CardContent sx={markdownStyles}>

                <Stack direction="row" spacing={1} alignItems="center" mb={2}>

                  <Typography variant="h6" fontWeight={700}>
                    Question
                  </Typography>

                  <Chip
                    label={topic}
                    size="small"
                    sx={{
                      background: "#42a5f5",
                      color: "#fff",
                      fontWeight: 600
                    }}
                  />

                </Stack>

                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {question}
                </ReactMarkdown>

              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ANSWER */}

        {question && (
          <>
            <TextField
              fullWidth
              label="Your Answer"
              multiline
              rows={5}
              sx={{
                mt: 3,
                input: { color: "#fff" },
                textarea: { color: "#fff" },
                label: { color: "#b0bec5" },
                "& .MuiOutlinedInput-root": {
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 3
                }
              }}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <Button
              variant="contained"
              startIcon={<SendIcon />}
              sx={{
                mt: 3,
                borderRadius: 3,
                px: 4,
                py: 1.2,
                fontWeight: 600,
                background: "linear-gradient(135deg,#66bb6a,#43a047)",
                boxShadow: "0 8px 20px rgba(102,187,106,0.35)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(102,187,106,0.5)"
                }
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit Answer
            </Button>
          </>
        )}

        {/* RESULT */}

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card sx={{ ...glassCard, mt: 4 }}>
              <CardContent sx={markdownStyles}>

                <Typography variant="h5" fontWeight={700}>
                  AI Evaluation Result
                </Typography>

                {/* SCORE BAR */}

                <Box
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.15)",
                    overflow: "hidden",
                    mt: 2
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score * 10}%` }}
                    transition={{ duration: 1 }}
                    style={{
                      height: "100%",
                      background: scoreColor(result.score)
                    }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  mt={2}
                  sx={{ color: scoreColor(result.score) }}
                >
                  Score: {result.score} / 10 — {result.category}
                </Typography>

                {/* FEEDBACK */}

                <Box mt={3}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Feedback
                  </Typography>

                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.feedback}
                  </ReactMarkdown>
                </Box>

                {/* EXPECTED POINTS */}

                {result.expected_points?.length > 0 && (
                  <Box mt={3}>
                    <Typography variant="subtitle2">
                      Expected Key Points
                    </Typography>

                    {result.expected_points.map((p, i) => (
                      <Chip
                        key={i}
                        label={p}
                        sx={{
                          mr: 1,
                          mt: 1,
                          background: "rgba(255,255,255,0.15)",
                          color: "#fff"
                        }}
                      />
                    ))}
                  </Box>
                )}

              </CardContent>
            </Card>
          </motion.div>
        )}

      </Box>
    </Box>
  );
};

export default Assessment;
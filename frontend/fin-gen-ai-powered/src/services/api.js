import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8001",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= AUTH ================= */

export const registerUser = (data) => API.post("/register", data);

export const loginUser = (data) => API.post("/login", data);

export const forgotPassword = (email) =>
  API.post("/auth/forgot-password", { email });

export const resetPassword = (token, newPassword) =>
  API.post("/auth/reset-password", {
    token,
    new_password: newPassword,
  });

/* ================= CHAT ================= */

export const sendChatMessage = (question, history = []) =>
  API.post("/chat", {
    question,
    history,
  });

/* ================= ASSESSMENT ================= */

export const getAssessmentQuestion = (topic) =>
  API.get(`/assessment/question?topic=${topic}`);

export const submitAssessment = (question, answer, topic) =>
  API.post("/assess", { question, answer, topic });

/* ================= KNOWLEDGE HUB ================= */

export const fetchKnowledgeDocs = () =>
  API.get("/knowledge/list");

export const uploadKnowledgeDoc = (file) => {

  const formData = new FormData();
  formData.append("file", file);

  return API.post("/knowledge/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteKnowledgeDoc = (filename) =>
  API.delete(`/knowledge/delete/${filename}`);

export const readKnowledgeDoc = (filename) =>
  API.get(`/knowledge/read/${filename}`);

/* ================= ANALYTICS ================= */

export const fetchAnalyticsOverview = () =>
  API.get("/analytics/overview");

export default API;
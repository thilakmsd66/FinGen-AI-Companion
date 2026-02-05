import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8001", // adjust if backend port differs
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
    history, // must be array of strings
  });

/* ================= ASSESSMENT ================= */

export const getAssessmentQuestion = () =>
  API.get("/assessment/question");

export const submitAssessment = (question, answer) =>
  API.post("/assess", { question, answer });

/* ================= KNOWLEDGE HUB ================= */

// ✅ LIST DOCUMENTS
export const fetchKnowledgeDocs = () =>
  API.get("/knowledge/list");

// ✅ UPLOAD DOCUMENT
export const uploadKnowledgeDoc = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/knowledge/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ DELETE DOCUMENT
export const deleteKnowledgeDoc = (filename) =>
  API.delete(`/knowledge/delete/${filename}`);

// ✅ READ DOCUMENT CONTENT
export const readKnowledgeDoc = (filename) =>
  API.get(`/knowledge/read/${filename}`);

/* ================= ANALYTICS ================= */

export const fetchAnalyticsOverview = () =>
  API.get("/analytics/overview");


export default API;

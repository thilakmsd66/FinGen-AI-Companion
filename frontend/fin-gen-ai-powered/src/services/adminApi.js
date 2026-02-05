import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8004/admin",
});

export const getPendingKnowledge = () =>
  API.get("/pending");

export const approveKnowledge = (filename) =>
  API.post(`/approve/${filename}`);

export const rejectKnowledge = (filename) =>
  API.delete(`/reject/${filename}`);

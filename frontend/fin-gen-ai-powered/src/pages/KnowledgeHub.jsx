import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Button,
  Drawer,
  Divider,
  Tooltip,
  Chip,
  TextField,
  InputAdornment
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import { motion } from "framer-motion";

import {
  fetchKnowledgeDocs,
  uploadKnowledgeDoc,
  deleteKnowledgeDoc,
  readKnowledgeDoc
} from "../services/api";

import { useAuth } from "../context/AuthContext";

/* =========================
   CATEGORY HELPERS
========================= */

const getCategory = (filename) => {
  const name = filename.toLowerCase();

  if (name.includes("custody")) return "Custody";
  if (name.includes("cash") || name.includes("fx")) return "Cash & FX";
  if (name.includes("corporate") || name.includes("ca")) return "Corporate Actions";
  if (name.includes("nav") || name.includes("report")) return "Reporting";
  if (name.includes("incident")) return "Incident Management";
  if (name.includes("config")) return "Configuration";
  if (name.includes("runbook")) return "Runbook";

  return "General";
};

const categoryAccent = {
  Custody: "#42a5f5",
  "Cash & FX": "#66bb6a",
  "Corporate Actions": "#ab47bc",
  Reporting: "#ffa726",
  "Incident Management": "#ef5350",
  Configuration: "#26c6da",
  Runbook: "#5c6bc0",
  General: "#90a4ae"
};

/* =========================
   COMPONENT
========================= */

const KnowledgeHub = () => {

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState("");
  const [content, setContent] = useState("");

  /* =========================
     LOAD DOCUMENTS
  ========================= */

  const loadDocs = async () => {
    const res = await fetchKnowledgeDocs();
    setDocs(res.data.documents || []);
  };

  useEffect(() => {
    loadDocs();
  }, []);

  /* =========================
     SEARCH FILTER
  ========================= */

  const filteredDocs = docs.filter((doc) => {

    const category = getCategory(doc).toLowerCase();
    const name = doc.toLowerCase();
    const query = search.toLowerCase();

    return name.includes(query) || category.includes(query);
  });

  /* =========================
     PREVIEW DOCUMENT
  ========================= */

  const openPreview = async (doc) => {

    setActiveDoc(doc);
    setPreviewOpen(true);

    const res = await readKnowledgeDoc(doc);

    setContent(res.data.content || "No preview available.");
  };

  /* =========================
     UPLOAD
  ========================= */

  const handleUpload = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    await uploadKnowledgeDoc(file);

    loadDocs();
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (doc) => {

    if (!window.confirm(`Delete ${doc}?`)) return;

    await deleteKnowledgeDoc(doc);

    loadDocs();
  };

  return (

    <Box
      p={3}
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
      }}
    >

      {/* HEADER */}

      <Box display="flex" justifyContent="space-between" mb={4}>

        <Box>

          <Typography variant="h4" fontWeight={700} color="#fff">
            📚 Knowledge Hub
          </Typography>

          <Typography variant="subtitle1" sx={{ color: "#b0bec5" }}>
            Centralized Production Support Knowledge Base
          </Typography>

        </Box>

        {isAdmin && (

          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg,#42a5f5,#1e88e5)"
            }}
          >
            Upload
            <input hidden type="file" onChange={handleUpload} />
          </Button>

        )}

      </Box>

      {/* SEARCH BAR */}

      <Box mb={4} maxWidth={500}>

        <TextField
          fullWidth
          placeholder="Search documents or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}

          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#90caf9" }} />
              </InputAdornment>
            )
          }}

          sx={{
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.08)",
              borderRadius: 3,
              color: "#fff",
              backdropFilter: "blur(10px)"
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.2)"
            },

            input: { color: "#fff" }
          }}
        />

      </Box>

      {/* DOCUMENT GRID */}

      <Grid container spacing={3}>

        {filteredDocs.map((doc, idx) => {

          const category = getCategory(doc);
          const accent = categoryAccent[category];

          return (

            <Grid item xs={12} sm={6} md={4} key={doc}>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >

                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    cursor: "pointer",
                    background: "rgba(20,25,35,0.85)",
                    backdropFilter: "blur(14px)",
                    border: `1px solid ${accent}55`,
                    boxShadow: "0 20px 45px rgba(0,0,0,0.6)",
                    color: "#fff",
                    position: "relative"
                  }}
                  onClick={() => openPreview(doc)}
                >

                  <CardContent>

                    <Box display="flex" alignItems="center" gap={1}>

                      <DescriptionIcon sx={{ color: accent }} />

                      <Typography
                        variant="h6"
                        noWrap
                        fontWeight={700}
                        sx={{
                          color: "#fff",
                          textShadow: "0 2px 6px rgba(0,0,0,0.6)"
                        }}
                      >
                        {doc}
                      </Typography>

                    </Box>

                    <Chip
                      label={category}
                      size="small"
                      sx={{
                        mt: 2,
                        color: "#fff",
                        background: accent,
                        fontWeight: 500
                      }}
                    />

                    {isAdmin && (

                      <Tooltip title="Delete document">

                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            color: "#fff",
                            background: "rgba(255,255,255,0.15)"
                          }}
                          onClick={(e) => {

                            e.stopPropagation();
                            handleDelete(doc);

                          }}
                        >
                          <DeleteIcon />
                        </IconButton>

                      </Tooltip>

                    )}

                  </CardContent>

                </Card>

              </motion.div>

            </Grid>

          );
        })}

      </Grid>

      {/* NO RESULTS */}

      {filteredDocs.length === 0 && (

        <Typography mt={4} color="#b0bec5">
          No documents found.
        </Typography>

      )}

      {/* PREVIEW DRAWER */}

      <Drawer
        anchor="right"
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}

        PaperProps={{
          sx: {
            width: "45%",
            background: "rgba(15,20,30,0.96)",
            backdropFilter: "blur(18px)",
            color: "#fff"
          }
        }}
      >

        <Box p={3}>

          <Box display="flex" justifyContent="space-between">

            <Typography variant="h6" fontWeight={700}>
              📄 {activeDoc}
            </Typography>

            <IconButton
              sx={{ color: "#fff" }}
              onClick={() => setPreviewOpen(false)}
            >
              <CloseIcon />
            </IconButton>

          </Box>

          <Divider
            sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }}
          />

          <Box
            sx={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: 14,
              background: "rgba(255,255,255,0.08)",
              p: 2,
              borderRadius: 3,
              maxHeight: "80vh",
              overflowY: "auto"
            }}
          >
            {content}
          </Box>

        </Box>

      </Drawer>

    </Box>
  );
};

export default KnowledgeHub;
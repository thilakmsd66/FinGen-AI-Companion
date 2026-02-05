import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { KnowledgeProvider } from "./context/KnowledgeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <KnowledgeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </KnowledgeProvider>
    </AuthProvider>
  </React.StrictMode>
);

import React, { createContext, useContext, useState } from "react";

const KnowledgeContext = createContext();

export const KnowledgeProvider = ({ children }) => {
  const [selectedDocs, setSelectedDocs] = useState([]);

  return (
    <KnowledgeContext.Provider value={{ selectedDocs, setSelectedDocs }}>
      {children}
    </KnowledgeContext.Provider>
  );
};

export const useKnowledge = () => {
  const context = useContext(KnowledgeContext);
  if (!context) {
    throw new Error("useKnowledge must be used within a KnowledgeProvider");
  }
  return context;
};
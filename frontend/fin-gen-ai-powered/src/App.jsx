import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import KnowledgeHub from "./pages/KnowledgeHub";
import Chatbot from "./pages/Chatbot";
import Assessment from "./pages/Assessment";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import Roadmap from "./pages/RoadMap";


function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}

      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/knowledgehub"
          element={user ? <KnowledgeHub /> : <Navigate to="/login" />}
        />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route
          path="/chatbot"
          element={user ? <Chatbot /> : <Navigate to="/login" />}
        />

        <Route
          path="/assessment"
          element={user ? <Assessment /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route 
          path="/footer"
          element={<Footer />}
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

        
      </Routes>
    </>
  );
}

export default App;

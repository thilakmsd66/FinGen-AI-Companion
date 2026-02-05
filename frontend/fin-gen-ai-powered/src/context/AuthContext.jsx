import React, { createContext, useContext, useState } from "react";
import {
  loginUser,
  registerUser,
  forgotPassword
} from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("fingen_user")) || null
  );

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    setUser(res.data.user);
    localStorage.setItem("fingen_user", JSON.stringify(res.data.user));
  };

  const register = async (payload) => {
    await registerUser(payload);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fingen_user");
  };

  const forgot = async (email) => {
    return await forgotPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        forgot,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

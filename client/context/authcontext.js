"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import socket from "../lib/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      socket.connect();
      socket.emit("join", JSON.parse(savedUser).id);
      if (JSON.parse(savedUser).role === "admin") {
        socket.emit("joinAdmin");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    socket.connect();
    socket.emit("join", data.user.id);
    if (data.user.role === "admin") socket.emit("joinAdmin");
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    socket.connect();
    socket.emit("join", data.user.id);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    socket.disconnect();
    router.push("/login");
  };

  const updateProfile = async (updatedData) => {
    const { data } = await api.put("/auth/profile", updatedData);
    const updatedUser = data.user;
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  };

  const deleteAccount = async (password) => {
    await api.delete("/auth/profile", { data: { password } });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    socket.disconnect();
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
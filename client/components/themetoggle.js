"use client";
import { useTheme } from "../context/themecontext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      style={{
        background: "var(--toggle-bg)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        width: "38px",
        height: "38px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "var(--toggle-color)",
        transition: "all 0.3s ease",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "var(--bg-card-hover)";
        e.currentTarget.style.borderColor = "var(--border-hover)";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "var(--toggle-bg)";
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {theme === "dark"
        ? <Sun size={17} />
        : <Moon size={17} />}
    </button>
  );
}
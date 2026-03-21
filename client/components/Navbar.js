"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/authcontext";
import ThemeToggle from "./themetoggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      background: scrolled ? "var(--nav-bg)" : "transparent",
      backdropFilter:"blur(20px)",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition:"all 0.3s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap');
        .nav-link { font-family:'Outfit',sans-serif; font-size:14px; color:var(--text-secondary); transition:color 0.2s; font-weight:500; text-decoration:none; }
        .nav-link:hover { color:var(--text-primary); }
        .gradient-text { background:linear-gradient(135deg,#0ea5e9,#8b5cf6,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .nav-logout { font-family:'Outfit',sans-serif; font-size:14px; padding:9px 22px; border-radius:8px; border:1px solid var(--border); background:var(--toggle-bg); color:var(--text-secondary); font-weight:500; cursor:pointer; transition:all 0.2s; }
        .nav-logout:hover { background:var(--bg-card-hover); color:var(--text-primary); }
      `}</style>

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"0 40px", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"22px", fontWeight:"700", color:"var(--text-primary)", letterSpacing:"-0.5px", textDecoration:"none" }}>
          Campus<span className="gradient-text">Portal</span>
        </Link>

        <div style={{ display:"flex", alignItems:"center", gap:"28px" }}>
          <Link href="#features" className="nav-link">Features</Link>
          <Link href="#how-it-works" className="nav-link">How it works</Link>
          <ThemeToggle />

          {user ? (
            <>
              <Link href={user.role==="admin"?"/admin":"/dashboard"} style={{ fontFamily:"'Outfit',sans-serif", fontSize:"14px", color:"#0ea5e9", fontWeight:"600", textDecoration:"none" }}>
                Dashboard
              </Link>
              <button onClick={logout} className="nav-logout">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">Sign in</Link>
              <Link href="/register" style={{ fontFamily:"'Outfit',sans-serif", fontSize:"14px", padding:"10px 24px", borderRadius:"8px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", color:"#fff", fontWeight:"600", display:"inline-block", transition:"all 0.2s", boxShadow:"0 4px 16px rgba(99,102,241,0.3)", textDecoration:"none" }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
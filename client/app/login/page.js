"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authcontext";
import Link from "next/link";
import { ArrowRight, Mail, Lock, AlertCircle } from "lucide-react";
import ThemeToggle from "../../components/themetoggle";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const user = await login(form.email, form.password);
      if (user.role === "admin") router.push("/admin");
      else router.push("/dashboard");
    } catch { setError("Invalid email or password. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", position:"relative", overflow:"hidden", fontFamily:"'Outfit',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap');
        @keyframes aurora-shift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(4%,-4%) scale(1.06)} 66%{transform:translate(-3%,3%) scale(0.97)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradient-anim { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

        .login-card { animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; background:var(--bg-card); backdrop-filter:blur(24px); border:1px solid var(--border); border-radius:24px; box-shadow:var(--shadow); }

        .input-wrap { position:relative; }
        .input-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; transition:color 0.2s; }
        .aurora-input { width:100%; padding:14px 16px 14px 46px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:12px; font-size:15px; font-family:'Outfit',sans-serif; color:var(--text-primary); outline:none; transition:all 0.3s ease; }
        .aurora-input::placeholder { color:var(--text-muted); }
        .aurora-input:focus { border-color:rgba(99,102,241,0.6); background:rgba(99,102,241,0.06); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
        .input-wrap:focus-within .input-icon { color:#6366f1; }

        .btn-aurora { width:100%; padding:16px; background:linear-gradient(135deg,#0ea5e9,#6366f1,#8b5cf6); background-size:200% 200%; animation:gradient-anim 4s ease infinite; color:#fff; font-family:'Outfit',sans-serif; font-weight:600; font-size:15px; border:none; border-radius:12px; cursor:pointer; transition:all 0.3s ease; display:flex; align-items:center; justify-content:center; gap:8px; }
        .btn-aurora:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 16px 40px rgba(99,102,241,0.4); }
        .btn-aurora:disabled { opacity:0.6; cursor:not-allowed; }

        .gradient-text { background:linear-gradient(135deg,#0ea5e9,#8b5cf6,#ec4899); background-size:200% 200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:gradient-anim 5s ease infinite; }

        .divider { display:flex; align-items:center; gap:16px; color:var(--text-muted); font-size:12px; font-family:'Outfit',sans-serif; }
        .divider::before, .divider::after { content:''; flex:1; height:1px; background:var(--border); }

        .noise { position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:var(--noise-opacity); background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size:200px 200px; }
      `}</style>

      <div className="noise" />

      {/* Theme toggle top right */}
      <div style={{ position:"fixed", top:"20px", right:"24px", zIndex:100 }}>
        <ThemeToggle />
      </div>

      {/* Aurora orbs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:"600px", height:"600px", top:"-20%", left:"-15%", borderRadius:"50%", background:`radial-gradient(circle, var(--orb-1) 0%, transparent 70%)`, filter:"blur(60px)", animation:"aurora-shift 12s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:"500px", height:"500px", bottom:"-15%", right:"-10%", borderRadius:"50%", background:`radial-gradient(circle, var(--orb-2) 0%, transparent 70%)`, filter:"blur(60px)", animation:"aurora-shift 15s ease-in-out infinite reverse" }} />
      </div>

      <div style={{ width:"100%", maxWidth:"440px", position:"relative", zIndex:1 }}>
        <div style={{ marginBottom:"32px", textAlign:"center" }}>
          <Link href="/" style={{ fontFamily:"'Outfit',sans-serif", fontSize:"13px", color:"var(--text-muted)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"6px" }}>
            ← Back to Home
          </Link>
        </div>

        <div className="login-card" style={{ padding:"48px 44px" }}>
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"28px", fontWeight:"700", color:"var(--text-primary)", marginBottom:"10px" }}>
              Campus<span className="gradient-text">Portal</span>
            </div>
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"22px", fontWeight:"600", color:"var(--text-primary)", marginBottom:"8px" }}>Welcome back</h1>
            <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:"14px", color:"var(--text-secondary)", fontWeight:"300" }}>Sign in to your campus account</p>
          </div>

          <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
            <div>
              <label style={{ fontFamily:"'Outfit',sans-serif", fontSize:"13px", color:"var(--text-secondary)", fontWeight:"500", display:"block", marginBottom:"10px" }}>Email Address</label>
              <div className="input-wrap">
                <Mail size={16} className="input-icon" />
                <input type="email" placeholder="name@university.edu" className="aurora-input"
                  value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
              </div>
            </div>

            <div>
              <label style={{ fontFamily:"'Outfit',sans-serif", fontSize:"13px", color:"var(--text-secondary)", fontWeight:"500", display:"block", marginBottom:"10px" }}>Password</label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input type="password" placeholder="••••••••" className="aurora-input"
                  value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
              </div>
              <div style={{ textAlign:"right", marginTop:"8px" }}>
                <Link href="/forgot-password" style={{ fontFamily:"'Outfit',sans-serif", fontSize:"13px", color:"#818cf8", fontWeight:"500", textDecoration:"none" }}>Forgot password?</Link>
              </div>
            </div>

            {error && (
              <div style={{ display:"flex", alignItems:"center", gap:"10px", color:"#f87171", fontSize:"13px", background:"rgba(248,113,113,0.08)", padding:"12px 16px", borderRadius:"10px", border:"1px solid rgba(248,113,113,0.2)", fontFamily:"'Outfit',sans-serif" }}>
                <AlertCircle size={16} style={{ flexShrink:0 }} /> {error}
              </div>
            )}

            <button type="submit" className="btn-aurora" disabled={loading}>
              {loading
                ? <><div style={{ width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} /> Verifying...</>
                : <>Sign In <ArrowRight size={16}/></>}
            </button>
          </form>

          <div style={{ marginTop:"28px" }} className="divider">OR</div>
          <div style={{ marginTop:"24px", textAlign:"center", fontFamily:"'Outfit',sans-serif", fontSize:"14px", color:"var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color:"#818cf8", fontWeight:"600", textDecoration:"none" }}>Create one free</Link>
          </div>
        </div>

        <div style={{ marginTop:"24px", textAlign:"center", fontFamily:"'Outfit',sans-serif", fontSize:"12px", color:"var(--text-muted)" }}>
          Secured by CampusPortal · All data encrypted
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
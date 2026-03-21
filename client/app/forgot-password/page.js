"use client";

import { useState } from "react";
import Link from "next/link";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import ThemeToggle from "../../components/themetoggle";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const sendOTP = async (e) => {
    e.preventDefault(); setError("");
    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email!"); setStep(2);
    } catch (err) { setError(err.response?.data?.message || "Failed to send OTP"); }
    finally { setLoading(false); }
  };

  const resetPassword = async (e) => {
    e.preventDefault(); setError("");
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    try {
      setLoading(true);
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setDone(true); toast.success("Password reset successfully!");
    } catch (err) { setError(err.response?.data?.message || "Failed to reset password"); }
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

        .card { animation:fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; background:var(--bg-card); backdrop-filter:blur(24px); border:1px solid var(--border); border-radius:24px; box-shadow:var(--shadow); }

        .gradient-text { background:linear-gradient(135deg,#0ea5e9,#8b5cf6,#ec4899); background-size:200% 200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:gradient-anim 5s ease infinite; }

        .aurora-input { width:100%; padding:14px 16px 14px 46px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:12px; font-size:15px; font-family:'Outfit',sans-serif; color:var(--text-primary); outline:none; transition:all 0.3s ease; }
        .aurora-input::placeholder { color:var(--text-muted); }
        .aurora-input:focus { border-color:rgba(99,102,241,0.6); background:rgba(99,102,241,0.06); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }

        .otp-input { width:100%; padding:18px 16px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:12px; font-size:28px; font-family:'Clash Display',sans-serif; font-weight:700; color:var(--text-primary); outline:none; transition:all 0.3s ease; text-align:center; letter-spacing:12px; }
        .otp-input::placeholder { color:var(--text-muted); font-size:20px; letter-spacing:4px; }
        .otp-input:focus { border-color:rgba(99,102,241,0.6); background:rgba(99,102,241,0.06); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }

        .input-wrap { position:relative; }
        .input-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; transition:color 0.2s; }
        .input-wrap:focus-within .input-icon { color:#818cf8; }

        .btn-aurora { width:100%; padding:16px; background:linear-gradient(135deg,#0ea5e9,#6366f1,#8b5cf6); background-size:200% 200%; animation:gradient-anim 4s ease infinite; color:#fff; font-family:'Outfit',sans-serif; font-weight:600; font-size:15px; border:none; border-radius:12px; cursor:pointer; transition:all 0.3s ease; display:flex; align-items:center; justify-content:center; gap:8px; }
        .btn-aurora:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 16px 40px rgba(99,102,241,0.4); }
        .btn-aurora:disabled { opacity:0.6; cursor:not-allowed; }

        .noise { position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:var(--noise-opacity); background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size:200px 200px; }
      `}</style>

      <div className="noise" />
      <div style={{ position:"fixed", top:"20px", right:"24px", zIndex:100 }}><ThemeToggle /></div>

      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:"600px", height:"600px", top:"-20%", left:"-15%", borderRadius:"50%", background:`radial-gradient(circle, var(--orb-1) 0%, transparent 70%)`, filter:"blur(60px)", animation:"aurora-shift 12s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:"500px", height:"500px", bottom:"-15%", right:"-10%", borderRadius:"50%", background:`radial-gradient(circle, var(--orb-2) 0%, transparent 70%)`, filter:"blur(60px)", animation:"aurora-shift 15s ease-in-out infinite reverse" }} />
      </div>

      <div style={{ width:"100%", maxWidth:"440px", position:"relative", zIndex:1 }}>
        <div style={{ marginBottom:"28px", textAlign:"center" }}>
          <Link href="/login" style={{ fontFamily:"'Outfit',sans-serif", fontSize:"13px", color:"var(--text-muted)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"6px" }}>
            <ArrowLeft size={14}/> Back to Login
          </Link>
        </div>

        <div className="card" style={{ padding:"48px 44px" }}>
          {done ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ width:"72px", height:"72px", borderRadius:"20px", background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.2)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
                <CheckCircle size={32} color="#34d399" />
              </div>
              <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"24px", fontWeight:"700", color:"var(--text-primary)", marginBottom:"12px" }}>Password Reset!</h2>
              <p style={{ fontSize:"14px", color:"var(--text-secondary)", marginBottom:"32px", lineHeight:"1.7" }}>Your password has been updated. You can now sign in with your new password.</p>
              <Link href="/login" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", color:"#fff", padding:"14px 32px", borderRadius:"12px", fontFamily:"'Outfit',sans-serif", fontWeight:"600", fontSize:"14px", textDecoration:"none" }}>
                Go to Login <ArrowRight size={16}/>
              </Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign:"center", marginBottom:"36px" }}>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"26px", fontWeight:"700", color:"var(--text-primary)", marginBottom:"10px" }}>
                  Campus<span className="gradient-text">Portal</span>
                </div>
                <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"22px", fontWeight:"600", color:"var(--text-primary)", marginBottom:"8px" }}>
                  {step===1 ? "Forgot Password?" : "Enter OTP"}
                </h1>
                <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:"14px", color:"var(--text-secondary)", fontWeight:"300" }}>
                  {step===1 ? "Enter your registered email and we'll send you an OTP" : `OTP sent to ${email}`}
                </p>
              </div>

              <div style={{ display:"flex", gap:"8px", marginBottom:"32px" }}>
                {[1,2].map(s => (
                  <div key={s} style={{ flex:1, height:"3px", borderRadius:"2px", background: step>=s ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "var(--border)", transition:"all 0.3s" }} />
                ))}
              </div>

              {step===1 && (
                <form onSubmit={sendOTP} style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
                  <div>
                    <label style={{ fontFamily:"'Outfit',sans-serif", fontSize:"13px", color:"var(--text-secondary)", fontWeight:"500", display:"block", marginBottom:"10px" }}>Email Address</label>
                    <div className="input-wrap">
                      <Mail size={16} className="input-icon" />
                      <input type="email" className="aurora-input" placeholder="name@university.edu"
                        value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  {error && (
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", color:"#f87171", fontSize:"13px", background:"rgba(248,113,113,0.08)", padding:"12px 16px", borderRadius:"10px", border:"1px solid rgba(248,113,113,0.2)" }}>
                      <AlertCircle size={16} style={{ flexShrink:0 }}/> {error}
                    </div>
                  )}
                  <button type="submit" className="btn-aurora" disabled={loading}>
                    {loading ? <><div style={{ width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/> Sending OTP...</> : <>Send OTP <ArrowRight size={16}/></>}
                  </button>
                </form>
              )}

              {step===2 && (
                <form onSubmit={resetPassword} style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
                  <div>
                    <label style={{ fontFamily:"'Outfit',sans-serif", fontSize:"13px", color:"var(--text-secondary)", fontWeight:"500", display:"block", marginBottom:"10px" }}>
                      6-Digit OTP <span style={{ color:"var(--text-muted)", fontWeight:"400" }}>(check your email)</span>
                    </label>
                    <input className="otp-input" placeholder="• • • • • •" maxLength={6}
                      value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,""))} required />
                  </div>
                  <div>
                    <label style={{ fontFamily:"'Outfit',sans-serif", fontSize:"13px", color:"var(--text-secondary)", fontWeight:"500", display:"block", marginBottom:"10px" }}>New Password</label>
                    <div className="input-wrap">
                      <Lock size={16} className="input-icon" />
                      <input type="password" className="aurora-input" placeholder="Min. 6 characters"
                        value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontFamily:"'Outfit',sans-serif", fontSize:"13px", color:"var(--text-secondary)", fontWeight:"500", display:"block", marginBottom:"10px" }}>Confirm Password</label>
                    <div className="input-wrap">
                      <Lock size={16} className="input-icon" />
                      <input type="password" className="aurora-input" placeholder="Repeat new password"
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    </div>
                  </div>
                  {newPassword && confirmPassword && (
                    <div style={{ fontSize:"13px", color:newPassword===confirmPassword?"#34d399":"#f87171", display:"flex", alignItems:"center", gap:"6px" }}>
                      <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:newPassword===confirmPassword?"#34d399":"#f87171" }} />
                      {newPassword===confirmPassword ? "Passwords match" : "Passwords do not match"}
                    </div>
                  )}
                  {error && (
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", color:"#f87171", fontSize:"13px", background:"rgba(248,113,113,0.08)", padding:"12px 16px", borderRadius:"10px", border:"1px solid rgba(248,113,113,0.2)" }}>
                      <AlertCircle size={16} style={{ flexShrink:0 }}/> {error}
                    </div>
                  )}
                  <button type="submit" className="btn-aurora" disabled={loading||(newPassword&&confirmPassword&&newPassword!==confirmPassword)}>
                    {loading ? <><div style={{ width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/> Resetting...</> : <>Reset Password <ArrowRight size={16}/></>}
                  </button>
                  <button type="button" onClick={() => { setStep(1); setOtp(""); setError(""); }}
                    style={{ background:"none", border:"none", color:"var(--text-muted)", fontFamily:"'Outfit',sans-serif", fontSize:"13px", cursor:"pointer", textAlign:"center" }}>
                    ← Use a different email
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <div style={{ marginTop:"24px", textAlign:"center", fontFamily:"'Outfit',sans-serif", fontSize:"14px", color:"var(--text-muted)" }}>
          Remember your password?{" "}
          <Link href="/login" style={{ color:"#818cf8", fontWeight:"600", textDecoration:"none" }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
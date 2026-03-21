"use client";

import { useState } from "react";
import { useAuth } from "../../context/authcontext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, User, Mail, Phone, Hash, BookOpen, Lock, Save, Shield } from "lucide-react";
import ThemeToggle from "../../components/themetoggle";

export default function ProfilePage() {
  const { user, updateProfile, deleteAccount } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    department: user?.department || "",
    studentId: user?.studentId || "",
  });

  const [passwords, setPasswords] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await updateProfile(form);
      toast.success("Profile updated successfully!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to update profile"); }
    finally { setSavingProfile(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (passwords.newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    try {
      setSavingPassword(true);
      await updateProfile({ currentPassword:passwords.currentPassword, newPassword:passwords.newPassword });
      toast.success("Password changed successfully!");
      setPasswords({ currentPassword:"", newPassword:"", confirmPassword:"" });
    } catch (err) { toast.error(err.response?.data?.message || "Failed to change password"); }
    finally { setSavingPassword(false); }
  };

  if (!user) { router.push("/login"); return null; }

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", color:"var(--text-primary)", fontFamily:"'Outfit',sans-serif", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap');
        @keyframes aurora-shift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(3%,-3%) scale(1.05)} 66%{transform:translate(-2%,2%) scale(0.98)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradient-anim { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes modal-in { from{opacity:0;transform:scale(0.96) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }

        .gradient-text { background:linear-gradient(135deg,#0ea5e9,#8b5cf6,#ec4899); background-size:200% 200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:gradient-anim 5s ease infinite; }

        .card { background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:32px; animation:fadeUp 0.5s ease both; }

        .input-wrap { position:relative; }
        .input-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; transition:color 0.2s; }
        .aurora-input { width:100%; padding:13px 16px 13px 44px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:10px; font-size:14px; font-family:'Outfit',sans-serif; color:var(--text-primary); outline:none; transition:all 0.2s; }
        .aurora-input::placeholder { color:var(--text-muted); }
        .aurora-input:focus { border-color:rgba(99,102,241,0.5); background:rgba(99,102,241,0.05); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
        .aurora-input:disabled { opacity:0.4; cursor:not-allowed; }
        .input-wrap:focus-within .input-icon { color:#818cf8; }

        .btn-aurora { background:linear-gradient(135deg,#0ea5e9,#6366f1,#8b5cf6); background-size:200% 200%; animation:gradient-anim 4s ease infinite; color:#fff; font-family:'Outfit',sans-serif; font-weight:600; font-size:14px; border:none; border-radius:10px; cursor:pointer; transition:all 0.3s; display:inline-flex; align-items:center; gap:8px; padding:13px 28px; }
        .btn-aurora:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 32px rgba(99,102,241,0.4); }
        .btn-aurora:disabled { opacity:0.6; cursor:not-allowed; }

        .btn-ghost { background:var(--toggle-bg); color:var(--text-secondary); font-family:'Outfit',sans-serif; font-weight:500; font-size:13px; border:1px solid var(--border); border-radius:8px; cursor:pointer; transition:all 0.2s; padding:9px 18px; display:inline-flex; align-items:center; gap:6px; text-decoration:none; }
        .btn-ghost:hover { background:var(--bg-card-hover); color:var(--text-primary); }

        .label { font-size:12px; color:var(--text-muted); font-weight:600; letter-spacing:1px; text-transform:uppercase; display:block; margin-bottom:10px; }

        .noise { position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:var(--noise-opacity); background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size:200px 200px; }

        .avatar { width:72px; height:72px; border-radius:20px; background:linear-gradient(135deg,#0ea5e9,#6366f1,#8b5cf6); display:flex; align-items:center; justify-content:center; font-family:'Clash Display',sans-serif; font-size:28px; font-weight:700; color:#fff; flex-shrink:0; }
      `}</style>

      <div className="noise"/>

      {/* Orbs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
        <div style={{ position:"absolute", width:"500px", height:"500px", top:"-10%", left:"-5%", borderRadius:"50%", background:`radial-gradient(circle, var(--orb-1) 0%, transparent 70%)`, filter:"blur(70px)", animation:"aurora-shift 14s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", width:"400px", height:"400px", bottom:"-10%", right:"-5%", borderRadius:"50%", background:`radial-gradient(circle, var(--orb-2) 0%, transparent 70%)`, filter:"blur(60px)", animation:"aurora-shift 11s ease-in-out infinite reverse" }}/>
      </div>

      {/* Navbar */}
      <nav style={{ background:"var(--nav-bg)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:"800px", margin:"0 auto", padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/" style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"22px", fontWeight:"700", color:"var(--text-primary)", textDecoration:"none" }}>
            Campus<span className="gradient-text">Portal</span>
          </Link>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <ThemeToggle/>
            <Link href={user.role==="admin"?"/admin":"/dashboard"} className="btn-ghost">
              <ArrowLeft size={14}/> Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:"800px", margin:"0 auto", padding:"40px 32px", position:"relative", zIndex:1 }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:"24px", marginBottom:"40px", animation:"fadeUp 0.5s ease both" }}>
          <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h1 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"32px", fontWeight:"700", letterSpacing:"-1px", lineHeight:1.1 }}>{user.name}</h1>
            <p style={{ fontSize:"14px", color:"var(--text-secondary)", marginTop:"6px" }}>
              {user.email} · <span style={{ color:user.role==="admin"?"#c084fc":"#818cf8", fontWeight:"600", textTransform:"capitalize" }}>{user.role}</span>
            </p>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="card" style={{ marginBottom:"24px", animationDelay:"0.1s" }}>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"20px", fontWeight:"700", letterSpacing:"-0.5px", marginBottom:"28px", display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"rgba(129,140,248,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <User size={16} color="#818cf8"/>
            </div>
            Personal Information
          </h2>

          <form onSubmit={handleProfileSave}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginBottom:"24px" }}>
              <div style={{ gridColumn:"1/-1" }}>
                <label className="label">Full Name</label>
                <div className="input-wrap">
                  <User size={16} className="input-icon"/>
                  <input className="aurora-input" placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required/>
                </div>
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <label className="label">Email Address <span style={{ color:"var(--text-muted)", textTransform:"none", letterSpacing:0, fontWeight:"400" }}>(cannot be changed)</span></label>
                <div className="input-wrap">
                  <Mail size={16} className="input-icon"/>
                  <input className="aurora-input" value={user.email} disabled/>
                </div>
              </div>
              <div>
                <label className="label">Phone Number</label>
                <div className="input-wrap">
                  <Phone size={16} className="input-icon"/>
                  <input className="aurora-input" placeholder="+91 9876543210" type="tel" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}/>
                </div>
              </div>
              {user.role === "student" && (
                <>
                  <div>
                    <label className="label">Department</label>
                    <div className="input-wrap">
                      <BookOpen size={16} className="input-icon"/>
                      <input className="aurora-input" placeholder="e.g. Computer Science" value={form.department} onChange={e => setForm({...form, department:e.target.value})}/>
                    </div>
                  </div>
                  <div style={{ gridColumn:"1/-1" }}>
                    <label className="label">Student ID</label>
                    <div className="input-wrap">
                      <Hash size={16} className="input-icon"/>
                      <input className="aurora-input" placeholder="e.g. STU12345" value={form.studentId} onChange={e => setForm({...form, studentId:e.target.value})}/>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <button type="submit" className="btn-aurora" disabled={savingProfile}>
                {savingProfile
                  ? <><div style={{ width:"14px", height:"14px", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/> Saving...</>
                  : <><Save size={15}/> Save Changes</>}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card" style={{ marginBottom:"24px", animationDelay:"0.2s" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"28px" }}>
            <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"20px", fontWeight:"700", letterSpacing:"-0.5px", display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"rgba(192,132,252,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Shield size={16} color="#c084fc"/>
              </div>
              Change Password
            </h2>
            <Link href="/forgot-password" style={{ fontFamily:"'Outfit',sans-serif", fontSize:"13px", color:"#818cf8", fontWeight:"500", textDecoration:"none" }}>Forgot password?</Link>
          </div>

          <form onSubmit={handlePasswordSave}>
            <div style={{ display:"flex", flexDirection:"column", gap:"20px", marginBottom:"24px" }}>
              <div>
                <label className="label">Current Password</label>
                <div className="input-wrap">
                  <Lock size={16} className="input-icon"/>
                  <input type="password" className="aurora-input" placeholder="Enter current password" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword:e.target.value})} required/>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                <div>
                  <label className="label">New Password</label>
                  <div className="input-wrap">
                    <Lock size={16} className="input-icon"/>
                    <input type="password" className="aurora-input" placeholder="Min. 6 characters" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword:e.target.value})} required/>
                  </div>
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <div className="input-wrap">
                    <Lock size={16} className="input-icon"/>
                    <input type="password" className="aurora-input" placeholder="Repeat new password" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword:e.target.value})} required/>
                  </div>
                </div>
              </div>
              {passwords.newPassword && passwords.confirmPassword && (
                <div style={{ fontSize:"13px", color:passwords.newPassword===passwords.confirmPassword?"#34d399":"#f87171", display:"flex", alignItems:"center", gap:"6px" }}>
                  <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:passwords.newPassword===passwords.confirmPassword?"#34d399":"#f87171" }}/>
                  {passwords.newPassword===passwords.confirmPassword ? "Passwords match" : "Passwords do not match"}
                </div>
              )}
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <button type="submit" className="btn-aurora" disabled={savingPassword||(passwords.newPassword&&passwords.confirmPassword&&passwords.newPassword!==passwords.confirmPassword)}
                style={{ background:"linear-gradient(135deg,#8b5cf6,#c084fc,#ec4899)" }}>
                {savingPassword
                  ? <><div style={{ width:"14px", height:"14px", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/> Updating...</>
                  : <><Shield size={15}/> Update Password</>}
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div style={{ marginTop:"24px", padding:"28px 32px", background:"rgba(248,113,113,0.04)", border:"1px solid rgba(248,113,113,0.15)", borderRadius:"20px", animation:"fadeUp 0.5s ease 0.4s both" }}>
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"18px", fontWeight:"700", color:"#f87171", marginBottom:"8px", display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"rgba(248,113,113,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>⚠️</div>
            Danger Zone
          </h2>
          <p style={{ fontSize:"14px", color:"var(--text-secondary)", marginBottom:"20px", lineHeight:"1.6" }}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button onClick={() => setShowDeleteModal(true)}
            style={{ background:"rgba(248,113,113,0.1)", color:"#f87171", border:"1px solid rgba(248,113,113,0.3)", padding:"11px 24px", borderRadius:"10px", fontFamily:"'Outfit',sans-serif", fontWeight:"600", fontSize:"14px", cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e => { e.target.style.background="rgba(248,113,113,0.2)"; e.target.style.borderColor="rgba(248,113,113,0.5)"; }}
            onMouseLeave={e => { e.target.style.background="rgba(248,113,113,0.1)"; e.target.style.borderColor="rgba(248,113,113,0.3)"; }}>
            Delete My Account
          </button>
        </div>

        {/* Account Info */}
        <div style={{ marginTop:"24px", padding:"20px 24px", background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", animation:"fadeUp 0.5s ease 0.5s both" }}>
          <div style={{ fontSize:"13px", color:"var(--text-muted)" }}>All data encrypted and secured</div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#34d399" }}/>
            <span style={{ fontSize:"13px", color:"var(--text-muted)" }}>Account active</span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
          <div style={{ background:"var(--bg-2)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:"24px", padding:"40px", width:"100%", maxWidth:"440px", boxShadow:"0 40px 80px rgba(0,0,0,0.6)", animation:"modal-in 0.3s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div style={{ width:"56px", height:"56px", borderRadius:"16px", background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", margin:"0 auto 24px" }}>🗑️</div>
            <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"22px", fontWeight:"700", color:"var(--text-primary)", textAlign:"center", marginBottom:"12px", letterSpacing:"-0.5px" }}>Delete Account</h2>
            <p style={{ fontSize:"14px", color:"var(--text-secondary)", textAlign:"center", lineHeight:"1.7", marginBottom:"28px" }}>
              This will permanently delete your account and all your requests.{" "}
              <span style={{ color:"#f87171", fontWeight:"600" }}>This cannot be undone.</span>
            </p>
            <div style={{ marginBottom:"20px" }}>
              <label className="label">Enter your password to confirm</label>
              <div style={{ position:"relative" }}>
                <Lock size={15} style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)", pointerEvents:"none" }}/>
                <input type="password" placeholder="Your account password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)}
                  style={{ width:"100%", padding:"13px 16px 13px 44px", background:"var(--input-bg)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:"10px", fontSize:"14px", fontFamily:"'Outfit',sans-serif", color:"var(--text-primary)", outline:"none", transition:"all 0.2s" }}
                  onFocus={e => e.target.style.borderColor="rgba(248,113,113,0.6)"}
                  onBlur={e => e.target.style.borderColor="rgba(248,113,113,0.2)"}/>
              </div>
            </div>
            <div style={{ display:"flex", gap:"12px" }}>
              <button onClick={() => { setShowDeleteModal(false); setDeletePassword(""); }}
                style={{ flex:1, padding:"13px", background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"10px", color:"var(--text-secondary)", fontFamily:"'Outfit',sans-serif", fontWeight:"500", fontSize:"14px", cursor:"pointer" }}>
                Cancel
              </button>
              <button disabled={!deletePassword||deleting}
                onClick={async () => {
                  try {
                    setDeleting(true);
                    await deleteAccount(deletePassword);
                  } catch (err) {
                    toast.error(err.response?.data?.message || "Failed to delete account");
                    setDeleting(false);
                  }
                }}
                style={{ flex:1, padding:"13px", background:deletePassword?"rgba(248,113,113,0.15)":"var(--bg-card)", border:`1px solid ${deletePassword?"rgba(248,113,113,0.4)":"var(--border)"}`, borderRadius:"10px", color:deletePassword?"#f87171":"var(--text-muted)", fontFamily:"'Outfit',sans-serif", fontWeight:"600", fontSize:"14px", cursor:deletePassword?"pointer":"not-allowed", transition:"all 0.2s" }}>
                {deleting
                  ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                      <div style={{ width:"14px", height:"14px", border:"2px solid rgba(248,113,113,0.3)", borderTopColor:"#f87171", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
                      Deleting...
                    </span>
                  : "Delete Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
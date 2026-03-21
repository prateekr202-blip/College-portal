"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import socket from "../../lib/socket";
import { useAuth } from "../../context/authcontext";
import { useRouter } from "next/navigation";
import { FileText, Clock, CheckCircle, LogOut, Plus, X, Loader, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import ThemeToggle from "../../components/themetoggle";

const REQUEST_TYPES = ["Bonafide Certificate","Transcript","ID Card","Hostel Letter","Migration Certificate","Character Certificate","Fee Receipt","Other"];

const STATUS_COLORS = {
  SUBMITTED: { color:"#818cf8", bg:"rgba(129,140,248,0.1)", border:"rgba(129,140,248,0.2)" },
  UNDER_REVIEW: { color:"#fb923c", bg:"rgba(251,146,60,0.1)", border:"rgba(251,146,60,0.2)" },
  IN_PROGRESS: { color:"#38bdf8", bg:"rgba(56,189,248,0.1)", border:"rgba(56,189,248,0.2)" },
  APPROVED: { color:"#34d399", bg:"rgba(52,211,153,0.1)", border:"rgba(52,211,153,0.2)" },
  REJECTED: { color:"#f87171", bg:"rgba(248,113,113,0.1)", border:"rgba(248,113,113,0.2)" },
  READY_FOR_COLLECTION: { color:"#c084fc", bg:"rgba(192,132,252,0.1)", border:"rgba(192,132,252,0.2)" },
  COMPLETED: { color:"#34d399", bg:"rgba(52,211,153,0.1)", border:"rgba(52,211,153,0.2)" },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({ type:"Bonafide Certificate", description:"", priority:"NORMAL" });

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchRequests();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    socket.on("statusUpdate", (update) => {
      setRequests(prev => prev.map(r => r.requestId === update.requestId ? { ...r, status:update.status } : r));
      toast.success(`Request ${update.requestId} → ${update.status.replace(/_/g," ")}`);
    });
    socket.on("newRemark", (update) => { toast(`💬 New remark on ${update.requestId}`); });
    return () => { socket.off("statusUpdate"); socket.off("newRemark"); };
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get("/requests");
      setRequests(data.requests || []);
    } catch { toast.error("Failed to load requests"); }
    finally { setLoading(false); }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (!form.description) { toast.error("Please fill all fields"); return; }
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("type", form.type);
      formData.append("description", form.description);
      formData.append("priority", form.priority);
      files.forEach(f => formData.append("documents", f));
      const { data } = await api.post("/requests", formData, { headers:{ "Content-Type":"multipart/form-data" } });
      setRequests(prev => [data.request, ...prev]);
      setForm({ type:"Bonafide Certificate", description:"", priority:"NORMAL" });
      setFiles([]); setShowForm(false);
      toast.success("Request submitted!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to submit"); }
    finally { setSubmitting(false); }
  };

  if (!user) return null;
  const pending = requests.filter(r => !["COMPLETED","REJECTED"].includes(r.status)).length;
  const completed = requests.filter(r => r.status === "COMPLETED").length;

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
        @keyframes slide-in { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

        .gradient-text { background:linear-gradient(135deg,#0ea5e9,#8b5cf6,#ec4899); background-size:200% 200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:gradient-anim 5s ease infinite; }

        .stat-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:24px; transition:all 0.3s; }
        .stat-card:hover { background:var(--bg-card-hover); border-color:var(--border-hover); transform:translateY(-2px); }

        .req-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:22px 26px; transition:all 0.3s; animation:fadeUp 0.5s ease both; }
        .req-card:hover { background:var(--bg-card-hover); border-color:var(--border-hover); transform:translateY(-2px); box-shadow:0 12px 32px rgba(0,0,0,0.15); }

        .btn-aurora { background:linear-gradient(135deg,#0ea5e9,#6366f1,#8b5cf6); background-size:200% 200%; animation:gradient-anim 4s ease infinite; color:#fff; font-family:'Outfit',sans-serif; font-weight:600; font-size:14px; border:none; border-radius:10px; cursor:pointer; transition:all 0.3s; display:inline-flex; align-items:center; gap:8px; padding:12px 24px; }
        .btn-aurora:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 32px rgba(99,102,241,0.4); }
        .btn-aurora:disabled { opacity:0.6; cursor:not-allowed; }

        .btn-ghost { background:var(--toggle-bg); color:var(--text-secondary); font-family:'Outfit',sans-serif; font-weight:500; font-size:13px; border:1px solid var(--border); border-radius:8px; cursor:pointer; transition:all 0.2s; padding:8px 18px; display:inline-flex; align-items:center; gap:6px; }
        .btn-ghost:hover { background:var(--bg-card-hover); color:var(--text-primary); border-color:var(--border-hover); }

        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; }
        .modal-card { background:var(--bg-2); border:1px solid var(--border); border-radius:24px; padding:40px; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; animation:modal-in 0.35s cubic-bezier(0.16,1,0.3,1) both; box-shadow:var(--shadow); }

        .form-input { width:100%; padding:13px 16px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:10px; font-size:14px; font-family:'Outfit',sans-serif; color:var(--text-primary); outline:none; transition:all 0.2s; }
        .form-input::placeholder { color:var(--text-muted); }
        .form-input:focus { border-color:rgba(99,102,241,0.5); background:rgba(99,102,241,0.05); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
        select.form-input option { background:var(--bg-2); color:var(--text-primary); }

        .drop-zone { border:2px dashed var(--border); border-radius:12px; padding:28px; text-align:center; cursor:pointer; transition:all 0.2s; background:var(--bg-card); }
        .drop-zone:hover { border-color:rgba(99,102,241,0.4); background:rgba(99,102,241,0.04); }

        .file-chip { display:flex; align-items:center; justify-content:space-between; padding:8px 14px; background:rgba(52,211,153,0.08); border:1px solid rgba(52,211,153,0.2); border-radius:8px; animation:slide-in 0.2s ease both; }

        .noise { position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:var(--noise-opacity); background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size:200px 200px; }

        .profile-btn { display:flex; align-items:center; gap:10px; text-decoration:none; padding:6px 10px; border-radius:10px; transition:all 0.2s; border:1px solid transparent; }
        .profile-btn:hover { background:var(--bg-card); border-color:var(--border); }

        .label { font-size:12px; color:var(--text-muted); font-weight:600; letter-spacing:1px; text-transform:uppercase; display:block; margin-bottom:10px; }
      `}</style>

      <div className="noise" />

      {/* Aurora orbs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
        <div style={{ position:"absolute", width:"500px", height:"500px", top:"-10%", right:"-5%", borderRadius:"50%", background:`radial-gradient(circle, var(--orb-1) 0%, transparent 70%)`, filter:"blur(60px)", animation:"aurora-shift 14s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:"400px", height:"400px", bottom:"0%", left:"-5%", borderRadius:"50%", background:`radial-gradient(circle, var(--orb-3) 0%, transparent 70%)`, filter:"blur(60px)", animation:"aurora-shift 11s ease-in-out infinite reverse" }} />
      </div>

      {/* Navbar */}
      <nav style={{ background:"var(--nav-bg)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/" style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"22px", fontWeight:"700", color:"var(--text-primary)", textDecoration:"none" }}>
            Campus<span className="gradient-text">Portal</span>
          </Link>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <Link href="/profile" className="profile-btn">
              <div style={{ width:"32px", height:"32px", borderRadius:"10px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:"700", color:"#fff", flexShrink:0 }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize:"14px", color:"var(--text-secondary)" }}>
                Welcome, <span style={{ color:"#818cf8", fontWeight:"600" }}>{user.name}</span>
              </span>
            </Link>
            <ThemeToggle />
            <button onClick={logout} className="btn-ghost"><LogOut size={13}/> Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"40px 32px", position:"relative", zIndex:1 }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"32px", flexWrap:"wrap", gap:"16px", animation:"fadeUp 0.5s ease both" }}>
          <div>
            <h1 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:"700", letterSpacing:"-1px", lineHeight:1.1, marginBottom:"8px" }}>My Dashboard</h1>
            <p style={{ fontSize:"14px", color:"var(--text-secondary)", fontWeight:"300" }}>
              {user.studentId && `${user.studentId} · `}{user.department}
            </p>
          </div>
          <button className="btn-aurora" onClick={() => setShowForm(true)}>
            <Plus size={16}/> New Request
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px", marginBottom:"36px", animation:"fadeUp 0.5s ease 0.1s both" }}>
          {[
            { label:"Total Requests", val:requests.length, icon:FileText, color:"#818cf8" },
            { label:"In Progress", val:pending, icon:Clock, color:"#fb923c" },
            { label:"Completed", val:completed, icon:CheckCircle, color:"#34d399" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
                <span style={{ fontSize:"12px", color:"var(--text-muted)", fontWeight:"500", letterSpacing:"0.5px" }}>{s.label.toUpperCase()}</span>
                <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:`${s.color}15`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <s.icon size={16} color={s.color}/>
                </div>
              </div>
              <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"40px", fontWeight:"700", color:s.color, letterSpacing:"-1px" }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* New Request Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowForm(false)}>
            <div className="modal-card">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"28px" }}>
                <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"24px", fontWeight:"700", letterSpacing:"-0.5px", color:"var(--text-primary)" }}>New Request</h2>
                <button onClick={() => { setShowForm(false); setFiles([]); }} style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"8px", width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--text-secondary)" }}>
                  <X size={16}/>
                </button>
              </div>

              <form onSubmit={submitRequest} style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
                <div>
                  <label className="label">Request Type</label>
                  <select className="form-input" value={form.type} onChange={e => setForm({...form, type:e.target.value})}>
                    {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea className="form-input" rows={4} placeholder="Describe your request in detail..." value={form.description} onChange={e => setForm({...form, description:e.target.value})} style={{ resize:"vertical" }}/>
                </div>

                <div>
                  <label className="label">Priority</label>
                  <div style={{ display:"flex", gap:"10px" }}>
                    {["LOW","NORMAL","HIGH"].map(p => (
                      <button key={p} type="button" onClick={() => setForm({...form, priority:p})}
                        style={{ flex:1, padding:"11px", borderRadius:"10px", border:"1px solid", cursor:"pointer", fontFamily:"'Outfit',sans-serif", fontSize:"13px", fontWeight:"500", transition:"all 0.2s",
                          borderColor: form.priority===p ? (p==="HIGH"?"rgba(248,113,113,0.5)":p==="LOW"?"rgba(148,163,184,0.5)":"rgba(129,140,248,0.5)") : "var(--border)",
                          background: form.priority===p ? (p==="HIGH"?"rgba(248,113,113,0.1)":p==="LOW"?"rgba(148,163,184,0.08)":"rgba(129,140,248,0.1)") : "var(--bg-card)",
                          color: form.priority===p ? (p==="HIGH"?"#f87171":p==="LOW"?"#94a3b8":"#818cf8") : "var(--text-muted)"
                        }}>
                        {p==="HIGH"?"🔴":p==="LOW"?"🟢":"🟡"} {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Documents <span style={{ color:"var(--text-muted)", fontWeight:"400", textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
                  <div className="drop-zone"
                    onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor="rgba(99,102,241,0.6)"; }}
                    onDragLeave={e => { e.currentTarget.style.borderColor="var(--border)"; }}
                    onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor="var(--border)"; setFiles(Array.from(e.dataTransfer.files)); }}
                    onClick={() => document.getElementById("file-input").click()}>
                    <input id="file-input" type="file" multiple accept=".jpg,.jpeg,.png,.pdf" style={{ display:"none" }} onChange={e => setFiles(Array.from(e.target.files))}/>
                    <FileText size={28} color="rgba(129,140,248,0.4)" style={{ margin:"0 auto 10px" }}/>
                    <p style={{ fontSize:"13px", color:"var(--text-secondary)" }}>Drop files or <span style={{ color:"#818cf8", fontWeight:"600" }}>browse</span></p>
                    <p style={{ fontSize:"11px", color:"var(--text-muted)", marginTop:"4px" }}>PDF, JPG, PNG · Max 5MB</p>
                  </div>
                  {files.length > 0 && (
                    <div style={{ marginTop:"10px", display:"flex", flexDirection:"column", gap:"6px" }}>
                      {files.map((f,i) => (
                        <div key={i} className="file-chip">
                          <span style={{ fontSize:"13px", color:"#34d399" }}>{f.name}</span>
                          <button type="button" onClick={() => setFiles(files.filter((_,idx)=>idx!==i))} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", padding:"2px" }}><X size={13}/></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display:"flex", gap:"12px", justifyContent:"flex-end", paddingTop:"8px" }}>
                  <button type="button" onClick={() => { setShowForm(false); setFiles([]); }} className="btn-ghost">Cancel</button>
                  <button type="submit" className="btn-aurora" disabled={submitting}>
                    {submitting
                      ? <><div style={{ width:"14px", height:"14px", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/> Submitting...</>
                      : <>Submit Request <ArrowRight size={14}/></>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Requests List */}
        <div style={{ animation:"fadeUp 0.5s ease 0.2s both" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px" }}>
            <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"22px", fontWeight:"700", letterSpacing:"-0.5px" }}>Your Requests</h2>
            <span style={{ fontSize:"13px", color:"var(--text-muted)" }}>{requests.length} total</span>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:"80px", color:"var(--text-muted)" }}>
              <div style={{ width:"32px", height:"32px", border:"2px solid var(--border)", borderTopColor:"#818cf8", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }}/>
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 40px", background:"var(--bg-card)", borderRadius:"20px", border:"1px solid var(--border)" }}>
              <FileText size={48} color="rgba(129,140,248,0.3)" style={{ margin:"0 auto 20px" }}/>
              <p style={{ fontSize:"16px", color:"var(--text-secondary)", marginBottom:"8px" }}>No requests yet</p>
              <p style={{ fontSize:"13px", color:"var(--text-muted)" }}>Click "New Request" to get started</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {requests.map((req,i) => {
                const sc = STATUS_COLORS[req.status] || STATUS_COLORS.SUBMITTED;
                return (
                  <div key={req._id} className="req-card" style={{ animationDelay:`${i*0.05}s` }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"16px" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px", flexWrap:"wrap" }}>
                          <span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"17px", fontWeight:"600", letterSpacing:"-0.3px" }}>{req.type}</span>
                          <span style={{ fontSize:"11px", color:"var(--text-muted)", fontFamily:"monospace" }}>{req.requestId}</span>
                          <span style={{ fontSize:"11px", fontWeight:"600", color:req.priority==="HIGH"?"#f87171":req.priority==="LOW"?"#94a3b8":"#fb923c" }}>{req.priority}</span>
                        </div>
                        <p style={{ fontSize:"13px", color:"var(--text-secondary)", lineHeight:"1.6", marginBottom:"12px" }}>{req.description}</p>
                        <span style={{ fontSize:"12px", color:"var(--text-muted)" }}>
                          {new Date(req.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                        </span>
                        {req.remarks?.length > 0 && (
                          <div style={{ marginTop:"12px", padding:"12px 16px", background:"rgba(129,140,248,0.06)", borderRadius:"10px", borderLeft:"3px solid rgba(129,140,248,0.4)" }}>
                            <div style={{ fontSize:"11px", color:"var(--text-muted)", marginBottom:"4px", fontWeight:"600", letterSpacing:"0.5px" }}>LATEST REMARK</div>
                            <div style={{ fontSize:"13px", color:"var(--text-primary)" }}>{req.remarks[req.remarks.length-1].text}</div>
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize:"11px", fontWeight:"600", color:sc.color, background:sc.bg, padding:"5px 14px", borderRadius:"100px", whiteSpace:"nowrap", flexShrink:0, border:`1px solid ${sc.border}` }}>
                        {req.status.replace(/_/g," ")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
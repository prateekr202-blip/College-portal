"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import socket from "../../lib/socket";
import { useAuth } from "../../context/authcontext";
import { useRouter } from "next/navigation";
import { LogOut, Search, CheckCircle, Clock, FileText, BarChart3, MessageSquare, X, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import ThemeToggle from "../../components/themetoggle";

const STATUS_OPTIONS = ["SUBMITTED","UNDER_REVIEW","IN_PROGRESS","APPROVED","REJECTED","READY_FOR_COLLECTION","COMPLETED"];
const REQUEST_TYPES = ["All Types","Bonafide Certificate","Transcript","ID Card","Hostel Letter","Migration Certificate","Character Certificate","Fee Receipt","Other"];

const STATUS_COLORS = {
  SUBMITTED: { color:"#818cf8", bg:"rgba(129,140,248,0.1)", border:"rgba(129,140,248,0.2)" },
  UNDER_REVIEW: { color:"#fb923c", bg:"rgba(251,146,60,0.1)", border:"rgba(251,146,60,0.2)" },
  IN_PROGRESS: { color:"#38bdf8", bg:"rgba(56,189,248,0.1)", border:"rgba(56,189,248,0.2)" },
  APPROVED: { color:"#34d399", bg:"rgba(52,211,153,0.1)", border:"rgba(52,211,153,0.2)" },
  REJECTED: { color:"#f87171", bg:"rgba(248,113,113,0.1)", border:"rgba(248,113,113,0.2)" },
  READY_FOR_COLLECTION: { color:"#c084fc", bg:"rgba(192,132,252,0.1)", border:"rgba(192,132,252,0.2)" },
  COMPLETED: { color:"#34d399", bg:"rgba(52,211,153,0.1)", border:"rgba(52,211,153,0.2)" },
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remark, setRemark] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("requests");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("All Types");

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "admin") { router.push("/dashboard"); return; }
    fetchRequests(); fetchAnalytics();
  }, [user]);

  useEffect(() => {
    socket.on("newRequest", d => { toast(`📋 New request: ${d.requestId}`); fetchRequests(); });
    socket.on("requestUpdated", () => fetchRequests());
    return () => { socket.off("newRequest"); socket.off("requestUpdated"); };
  }, []);

  useEffect(() => { fetchRequests(); }, [filterStatus, filterType]);

  const fetchRequests = async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterType !== "All Types") params.type = filterType;
      if (search) params.search = search;
      const { data } = await api.get("/admin/requests", { params });
      setRequests(data.requests || []);
    } catch { toast.error("Failed to load requests"); }
    finally { setLoading(false); }
  };

  const fetchAnalytics = async () => {
    try { const { data } = await api.get("/admin/analytics"); setAnalytics(data.analytics); }
    catch (err) { console.error(err); }
  };

  const updateStatus = async () => {
    if (!newStatus) { toast.error("Select a status"); return; }
    try {
      setUpdating(true);
      await api.put(`/admin/requests/${selectedRequest._id}/status`, { status:newStatus, remark:remark||undefined });
      toast.success("Status updated!");
      setSelectedRequest(null); setRemark(""); setNewStatus("");
      fetchRequests(); fetchAnalytics();
    } catch { toast.error("Failed to update status"); }
    finally { setUpdating(false); }
  };

  const addRemark = async () => {
    if (!remark.trim()) { toast.error("Enter a remark"); return; }
    try {
      setUpdating(true);
      await api.post(`/admin/requests/${selectedRequest._id}/remark`, { text:remark });
      toast.success("Remark added!"); setRemark(""); fetchRequests();
    } catch { toast.error("Failed to add remark"); }
    finally { setUpdating(false); }
  };

  if (!user) return null;

  const filteredRequests = requests.filter(r =>
    search ? r.requestId?.toLowerCase().includes(search.toLowerCase()) ||
      r.type?.toLowerCase().includes(search.toLowerCase()) ||
      r.student?.name?.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", color:"var(--text-primary)", fontFamily:"'Outfit',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap');
        @keyframes aurora-shift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(3%,-3%) scale(1.05)} 66%{transform:translate(-2%,2%) scale(0.98)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradient-anim { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes panel-in { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }

        .gradient-text { background:linear-gradient(135deg,#0ea5e9,#8b5cf6,#ec4899); background-size:200% 200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:gradient-anim 5s ease infinite; }

        .req-row { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:18px 22px; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:16px; animation:fadeUp 0.4s ease both; }
        .req-row:hover { background:var(--bg-card-hover); border-color:var(--border-hover); transform:translateX(3px); }
        .req-row.selected { background:rgba(129,140,248,0.06); border-color:rgba(129,140,248,0.3); }

        .form-input { width:100%; padding:12px 14px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:10px; font-size:14px; font-family:'Outfit',sans-serif; color:var(--text-primary); outline:none; transition:all 0.2s; }
        .form-input::placeholder { color:var(--text-muted); }
        .form-input:focus { border-color:rgba(129,140,248,0.5); background:rgba(129,140,248,0.05); box-shadow:0 0 0 3px rgba(129,140,248,0.1); }
        select.form-input option { background:var(--bg-2); color:var(--text-primary); }

        .filter-select { padding:9px 14px; background:var(--input-bg); border:1px solid var(--input-border); border-radius:8px; font-size:13px; font-family:'Outfit',sans-serif; color:var(--text-secondary); outline:none; cursor:pointer; transition:border 0.2s; }
        .filter-select:focus { border-color:rgba(129,140,248,0.4); }
        .filter-select option { background:var(--bg-2); color:var(--text-primary); }

        .btn-aurora { background:linear-gradient(135deg,#0ea5e9,#6366f1,#8b5cf6); background-size:200% 200%; animation:gradient-anim 4s ease infinite; color:#fff; font-family:'Outfit',sans-serif; font-weight:600; font-size:13px; border:none; border-radius:10px; cursor:pointer; transition:all 0.3s; display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:11px 22px; }
        .btn-aurora:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(99,102,241,0.35); }
        .btn-aurora:disabled { opacity:0.6; cursor:not-allowed; }

        .btn-ghost { background:var(--toggle-bg); color:var(--text-secondary); font-family:'Outfit',sans-serif; font-weight:500; font-size:13px; border:1px solid var(--border); border-radius:8px; cursor:pointer; transition:all 0.2s; padding:9px 18px; display:inline-flex; align-items:center; gap:6px; }
        .btn-ghost:hover { background:var(--bg-card-hover); color:var(--text-primary); border-color:var(--border-hover); }

        .tab-btn { padding:9px 20px; border-radius:8px; font-size:14px; font-weight:500; cursor:pointer; border:none; font-family:'Outfit',sans-serif; transition:all 0.2s; }
        .tab-btn.active { background:linear-gradient(135deg,rgba(14,165,233,0.15),rgba(99,102,241,0.15)); color:#818cf8; border:1px solid rgba(129,140,248,0.3); }
        .tab-btn.inactive { background:transparent; color:var(--text-muted); border:1px solid transparent; }
        .tab-btn.inactive:hover { color:var(--text-primary); background:var(--bg-card); }

        .stat-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:24px; transition:all 0.3s; }
        .stat-card:hover { background:var(--bg-card-hover); border-color:var(--border-hover); }

        .detail-panel { background:var(--bg-2); border:1px solid var(--border); border-radius:20px; padding:28px; max-height:calc(100vh - 100px); overflow-y:auto; box-shadow:var(--shadow); animation:panel-in 0.3s cubic-bezier(0.16,1,0.3,1) both; }

        .section-label { font-size:10px; color:var(--text-muted); font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px; }

        .analytics-bar { height:6px; border-radius:3px; background:var(--border); overflow:hidden; margin-top:8px; }
        .analytics-bar-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,#6366f1,#8b5cf6); transition:width 0.8s ease; }

        .noise { position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:var(--noise-opacity); background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size:200px 200px; }

        .profile-btn { display:flex; align-items:center; gap:8px; text-decoration:none; padding:6px 10px; border-radius:10px; transition:all 0.2s; border:1px solid transparent; }
        .profile-btn:hover { background:var(--bg-card); border-color:var(--border); }
      `}</style>

      <div className="noise" />

      {/* Orbs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
        <div style={{ position:"absolute", width:"600px", height:"600px", top:"-15%", left:"-10%", borderRadius:"50%", background:`radial-gradient(circle, var(--orb-1) 0%, transparent 70%)`, filter:"blur(70px)", animation:"aurora-shift 16s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:"400px", height:"400px", bottom:"-10%", right:"-5%", borderRadius:"50%", background:`radial-gradient(circle, var(--orb-2) 0%, transparent 70%)`, filter:"blur(60px)", animation:"aurora-shift 12s ease-in-out infinite reverse" }} />
      </div>

      {/* Navbar */}
      <nav style={{ background:"var(--nav-bg)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"28px" }}>
            <Link href="/" style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"22px", fontWeight:"700", color:"var(--text-primary)", textDecoration:"none" }}>
              Campus<span className="gradient-text">Portal</span>
              <span style={{ fontSize:"11px", fontFamily:"'Outfit',sans-serif", color:"var(--text-muted)", marginLeft:"8px", fontWeight:"400", letterSpacing:"1px" }}>ADMIN</span>
            </Link>
            <div style={{ display:"flex", gap:"6px" }}>
              {["requests","analytics"].map(tab => (
                <button key={tab} className={`tab-btn ${activeTab===tab?"active":"inactive"}`} onClick={() => setActiveTab(tab)}>
                  {tab==="requests" ? "Requests" : "Analytics"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <Link href="/profile" className="profile-btn">
              <div style={{ width:"32px", height:"32px", borderRadius:"10px", background:"linear-gradient(135deg,#8b5cf6,#c084fc)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:"700", color:"#fff", flexShrink:0 }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize:"13px", color:"var(--text-secondary)" }}>
                <span style={{ color:"#818cf8", fontWeight:"600" }}>{user.name}</span> · Admin
              </span>
            </Link>
            <ThemeToggle />
            <button onClick={logout} className="btn-ghost"><LogOut size={13}/> Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"32px", position:"relative", zIndex:1 }}>

        {/* REQUESTS TAB */}
        {activeTab === "requests" && (
          <div style={{ display:"grid", gridTemplateColumns:selectedRequest?"1fr 420px":"1fr", gap:"24px", alignItems:"start" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
                <h1 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"32px", fontWeight:"700", letterSpacing:"-1px" }}>
                  All Requests
                  <span style={{ fontSize:"15px", fontFamily:"'Outfit',sans-serif", color:"var(--text-muted)", fontWeight:"400", marginLeft:"12px" }}>{filteredRequests.length} total</span>
                </h1>
              </div>

              {/* Filters */}
              <div style={{ display:"flex", gap:"10px", marginBottom:"20px", flexWrap:"wrap", alignItems:"center" }}>
                <div style={{ position:"relative", flex:1, minWidth:"220px" }}>
                  <Search size={14} style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)" }}/>
                  <input className="form-input" style={{ paddingLeft:"38px" }} placeholder="Search by ID, type, student..."
                    value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==="Enter" && fetchRequests()}/>
                </div>
                <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="">All Statuses</option>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
                </select>
                <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                  {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {(filterStatus || filterType!=="All Types" || search) && (
                  <button className="btn-ghost" onClick={() => { setFilterStatus(""); setFilterType("All Types"); setSearch(""); }}>
                    <X size={12}/> Clear
                  </button>
                )}
              </div>

              {loading ? (
                <div style={{ textAlign:"center", padding:"80px", color:"var(--text-muted)" }}>
                  <div style={{ width:"28px", height:"28px", border:"2px solid var(--border)", borderTopColor:"#818cf8", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }}/>
                  Loading...
                </div>
              ) : filteredRequests.length === 0 ? (
                <div style={{ textAlign:"center", padding:"80px", background:"var(--bg-card)", borderRadius:"16px", border:"1px solid var(--border)" }}>
                  <FileText size={40} color="rgba(129,140,248,0.3)" style={{ margin:"0 auto 16px" }}/>
                  <p style={{ color:"var(--text-muted)" }}>No requests found</p>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {filteredRequests.map((req,i) => {
                    const sc = STATUS_COLORS[req.status] || STATUS_COLORS.SUBMITTED;
                    return (
                      <div key={req._id} className={`req-row ${selectedRequest?._id===req._id?"selected":""}`}
                        style={{ animationDelay:`${i*0.04}s` }}
                        onClick={() => { setSelectedRequest(req); setNewStatus(req.status); }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"4px", flexWrap:"wrap" }}>
                            <span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"16px", fontWeight:"600", letterSpacing:"-0.3px" }}>{req.type}</span>
                            <span style={{ fontSize:"11px", color:"var(--text-muted)", fontFamily:"monospace" }}>{req.requestId}</span>
                            <span style={{ fontSize:"11px", fontWeight:"600", color:req.priority==="HIGH"?"#f87171":req.priority==="LOW"?"#94a3b8":"#fb923c" }}>{req.priority}</span>
                          </div>
                          <div style={{ fontSize:"13px", color:"var(--text-secondary)" }}>
                            {req.student?.name} · {req.student?.department} · {req.student?.studentId}
                          </div>
                          <div style={{ fontSize:"12px", color:"var(--text-muted)", marginTop:"3px" }}>
                            {new Date(req.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                            {req.remarks?.length > 0 && ` · ${req.remarks.length} remark${req.remarks.length>1?"s":""}`}
                          </div>
                        </div>
                        <span style={{ fontSize:"11px", fontWeight:"600", color:sc.color, background:sc.bg, padding:"5px 14px", borderRadius:"100px", whiteSpace:"nowrap", flexShrink:0, border:`1px solid ${sc.border}` }}>
                          {req.status.replace(/_/g," ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selectedRequest && (
              <div style={{ position:"sticky", top:"80px" }}>
                <div className="detail-panel">
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"24px" }}>
                    <div>
                      <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"20px", fontWeight:"700", letterSpacing:"-0.5px" }}>{selectedRequest.type}</div>
                      <div style={{ fontSize:"12px", color:"var(--text-muted)", marginTop:"2px", fontFamily:"monospace" }}>{selectedRequest.requestId}</div>
                    </div>
                    <button onClick={() => setSelectedRequest(null)} style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"8px", width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--text-secondary)" }}>
                      <X size={15}/>
                    </button>
                  </div>

                  <div style={{ padding:"16px", background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"12px", marginBottom:"20px" }}>
                    <div className="section-label">Student</div>
                    <div style={{ fontSize:"15px", fontWeight:"600", marginBottom:"4px" }}>{selectedRequest.student?.name}</div>
                    <div style={{ fontSize:"13px", color:"var(--text-secondary)" }}>{selectedRequest.student?.email}</div>
                    <div style={{ fontSize:"13px", color:"var(--text-secondary)" }}>{selectedRequest.student?.department} · {selectedRequest.student?.studentId}</div>
                  </div>

                  <div style={{ marginBottom:"20px" }}>
                    <div className="section-label">Description</div>
                    <p style={{ fontSize:"14px", color:"var(--text-secondary)", lineHeight:"1.65" }}>{selectedRequest.description}</p>
                  </div>

                  {selectedRequest.documents?.length > 0 && (
                    <div style={{ marginBottom:"20px" }}>
                      <div className="section-label">Documents</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                        {selectedRequest.documents.map((doc,i) => (
                          <a key={i} href={doc.url} target="_blank" rel="noreferrer"
                            style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", background:"rgba(52,211,153,0.06)", borderRadius:"10px", border:"1px solid rgba(52,211,153,0.15)", textDecoration:"none" }}>
                            <FileText size={14} color="#34d399"/>
                            <span style={{ fontSize:"13px", color:"#34d399", fontWeight:"500" }}>{doc.name||`Document ${i+1}`}</span>
                            <ArrowRight size={12} color="#34d399" style={{ marginLeft:"auto" }}/>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRequest.statusHistory?.length > 0 && (
                    <div style={{ marginBottom:"20px" }}>
                      <div className="section-label">Status History</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                        {selectedRequest.statusHistory.map((h,i) => {
                          const sc = STATUS_COLORS[h.status]||STATUS_COLORS.SUBMITTED;
                          return (
                            <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"13px" }}>
                              <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:sc.color, flexShrink:0 }}/>
                              <span style={{ color:"var(--text-primary)", fontWeight:"500" }}>{h.status.replace(/_/g," ")}</span>
                              <span style={{ color:"var(--text-muted)", marginLeft:"auto" }}>{new Date(h.changedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedRequest.remarks?.length > 0 && (
                    <div style={{ marginBottom:"20px" }}>
                      <div className="section-label">Remarks</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                        {selectedRequest.remarks.map((r,i) => (
                          <div key={i} style={{ padding:"12px 14px", background:"rgba(129,140,248,0.06)", borderRadius:"10px", borderLeft:"3px solid rgba(129,140,248,0.4)" }}>
                            <div style={{ fontSize:"13px", color:"var(--text-primary)" }}>{r.text}</div>
                            <div style={{ fontSize:"11px", color:"var(--text-muted)", marginTop:"4px" }}>{r.by} · {new Date(r.timestamp).toLocaleDateString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ borderTop:"1px solid var(--border)", paddingTop:"20px" }}>
                    <div className="section-label">Update Request</div>
                    <select className="form-input" style={{ marginBottom:"10px" }} value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
                    </select>
                    <textarea className="form-input" rows={3} placeholder="Add a remark (optional)..."
                      value={remark} onChange={e => setRemark(e.target.value)} style={{ marginBottom:"12px", resize:"vertical" }}/>
                    <div style={{ display:"flex", gap:"10px" }}>
                      <button className="btn-aurora" onClick={updateStatus} disabled={updating} style={{ flex:1 }}>
                        {updating
                          ? <><div style={{ width:"13px", height:"13px", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/> Updating...</>
                          : "Update Status"}
                      </button>
                      <button className="btn-ghost" onClick={addRemark} disabled={updating}>
                        <MessageSquare size={13}/> Remark
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && analytics && (
          <div style={{ animation:"fadeUp 0.5s ease both" }}>
            <h1 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"32px", fontWeight:"700", letterSpacing:"-1px", marginBottom:"32px" }}>
              Analytics <span className="gradient-text">Overview</span>
            </h1>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"16px", marginBottom:"32px" }}>
              {[
                { label:"Total", val:analytics.totalRequests, icon:FileText, color:"#818cf8" },
                { label:"Pending", val:analytics.pending, icon:Clock, color:"#fb923c" },
                { label:"Under Review", val:analytics.underReview, icon:BarChart3, color:"#38bdf8" },
                { label:"Completed", val:analytics.completed, icon:CheckCircle, color:"#34d399" },
                { label:"Rejected", val:analytics.rejected, icon:X, color:"#f87171" },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
                    <span style={{ fontSize:"11px", color:"var(--text-muted)", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase" }}>{s.label}</span>
                    <div style={{ width:"30px", height:"30px", borderRadius:"8px", background:`${s.color}12`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <s.icon size={14} color={s.color}/>
                    </div>
                  </div>
                  <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"40px", fontWeight:"700", color:s.color, letterSpacing:"-1px" }}>{s.val}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px" }}>
              <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"16px", padding:"28px" }}>
                <div style={{ fontSize:"14px", fontWeight:"600", color:"var(--text-secondary)", marginBottom:"24px" }}>Requests by Type</div>
                {analytics.byType?.map(t => (
                  <div key={t._id} style={{ marginBottom:"16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", marginBottom:"6px" }}>
                      <span style={{ color:"var(--text-secondary)" }}>{t._id}</span>
                      <span style={{ color:"#818cf8", fontWeight:"600" }}>{t.count}</span>
                    </div>
                    <div className="analytics-bar">
                      <div className="analytics-bar-fill" style={{ width:`${(t.count/analytics.totalRequests)*100}%` }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"16px", padding:"28px" }}>
                <div style={{ fontSize:"14px", fontWeight:"600", color:"var(--text-secondary)", marginBottom:"24px" }}>Requests by Status</div>
                {analytics.byStatus?.map(s => {
                  const sc = STATUS_COLORS[s._id]||STATUS_COLORS.SUBMITTED;
                  return (
                    <div key={s._id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                      <span style={{ fontSize:"13px", color:"var(--text-secondary)" }}>{s._id.replace(/_/g," ")}</span>
                      <span style={{ fontSize:"12px", fontWeight:"600", color:sc.color, background:sc.bg, padding:"4px 14px", borderRadius:"100px", border:`1px solid ${sc.border}` }}>{s.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
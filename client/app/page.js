"use client";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { FileText, Clock, Bell, Shield, Zap, BarChart3, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  { icon: FileText, title: "Online Request Submission", desc: "Submit bonafide certificates, transcripts, ID cards and hostel letters without visiting the office.", grad: "linear-gradient(135deg, #0ea5e9, #6366f1)" },
  { icon: Clock, title: "Live Status Tracking", desc: "Follow your request through every stage in real time. Always know exactly what's happening.", grad: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
  { icon: Bell, title: "Instant Notifications", desc: "Get alerted the moment your status changes or administration adds remarks to your case.", grad: "linear-gradient(135deg, #f97316, #eab308)" },
  { icon: Shield, title: "Secure & Auditable", desc: "Every action is timestamped and logged. Full transparency for students and staff.", grad: "linear-gradient(135deg, #10b981, #0ea5e9)" },
  { icon: Zap, title: "Efficient Processing", desc: "Administration handles requests via a powerful panel with filters and management tools.", grad: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { icon: BarChart3, title: "Institutional Analytics", desc: "Track pending requests, processing timelines and document trends across departments.", grad: "linear-gradient(135deg, #ec4899, #f97316)" },
];

const steps = [
  { num: "01", title: "Create your account", desc: "Register using your institutional email and student ID.", color: "#0ea5e9" },
  { num: "02", title: "Submit your request", desc: "Select document type, provide details, and attach files.", color: "#8b5cf6" },
  { num: "03", title: "Track progress live", desc: "Monitor every stage of your request in real time.", color: "#ec4899" },
  { num: "04", title: "Receive your document", desc: "Get notified when ready. No follow-up calls required.", color: "#f97316" },
];

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
        }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(36px)";
      el.style.transition = "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main style={{ background:"var(--bg)", color:"var(--text-primary)", fontFamily:"'Outfit',sans-serif", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }

        @keyframes aurora-shift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(3%,-3%) scale(1.05)} 66%{transform:translate(-2%,2%) scale(0.98)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-12px) rotate(1deg)} }
        @keyframes pulse-glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes gradient-text { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        .hero-badge { animation: fadeUp 0.6s ease both; }
        .hero-h1 { animation: fadeUp 0.7s ease 0.1s both; }
        .hero-p { animation: fadeUp 0.7s ease 0.2s both; }
        .hero-cta { animation: fadeUp 0.7s ease 0.3s both; }
        .hero-stats { animation: fadeUp 0.7s ease 0.4s both; }
        .hero-card { animation: fadeUp 0.8s ease 0.3s both; }

        .aurora-orb { position:absolute; border-radius:50%; filter:blur(80px); animation:aurora-shift 12s ease-in-out infinite; pointer-events:none; }

        .btn-aurora { background:linear-gradient(135deg,#0ea5e9,#6366f1,#8b5cf6); background-size:200% 200%; color:#fff; padding:16px 36px; border-radius:12px; font-family:'Outfit',sans-serif; font-weight:600; font-size:15px; display:inline-flex; align-items:center; gap:10px; border:none; cursor:pointer; transition:all 0.3s ease; position:relative; overflow:hidden; animation:gradient-text 4s ease infinite; }
        .btn-aurora:hover { transform:translateY(-2px); box-shadow:0 16px 40px rgba(99,102,241,0.4); }

        .btn-ghost { background:var(--toggle-bg); color:var(--text-secondary); padding:16px 36px; border-radius:12px; font-family:'Outfit',sans-serif; font-weight:500; font-size:15px; display:inline-flex; align-items:center; gap:10px; border:1px solid var(--border); cursor:pointer; transition:all 0.3s ease; backdrop-filter:blur(8px); }
        .btn-ghost:hover { background:var(--bg-card-hover); border-color:var(--border-hover); transform:translateY(-2px); }

        .feature-card { background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:36px 32px; transition:all 0.4s cubic-bezier(0.16,1,0.3,1); position:relative; overflow:hidden; cursor:default; }
        .feature-card:hover { border-color:var(--border-hover); transform:translateY(-6px); box-shadow:0 24px 64px rgba(0,0,0,0.2); }

        .step-card { display:flex; gap:24px; align-items:flex-start; padding:28px 32px; background:var(--bg-card); border:1px solid var(--border); border-radius:16px; transition:all 0.3s ease; position:relative; overflow:hidden; }
        .step-card:hover { background:var(--bg-card-hover); border-color:var(--border-hover); transform:translateX(6px); }

        .gradient-text { background:linear-gradient(135deg,#0ea5e9 0%,#8b5cf6 50%,#ec4899 100%); background-size:200% 200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:gradient-text 5s ease infinite; }

        .tag { display:inline-flex; align-items:center; gap:8px; background:var(--bg-card); border:1px solid var(--border); color:var(--text-secondary); font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; padding:8px 18px; border-radius:100px; margin-bottom:24px; font-family:'Outfit',sans-serif; }

        .glass-card { background:var(--bg-card); backdrop-filter:blur(20px); border:1px solid var(--border); border-radius:20px; }

        .stat-pill { text-align:center; padding:24px 20px; background:var(--bg-card); border:1px solid var(--border); border-radius:16px; transition:all 0.3s; }
        .stat-pill:hover { background:var(--bg-card-hover); border-color:var(--border-hover); }

        .live-dot { width:7px; height:7px; border-radius:50%; background:#10b981; display:inline-block; animation:pulse-glow 2s ease-in-out infinite; }

        .noise { position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:var(--noise-opacity); background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size:200px 200px; }

        .request-row { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-radius:10px; border:1px solid var(--border); margin-bottom:8px; background:var(--input-bg); transition:all 0.2s; }
        .request-row:last-child { margin-bottom:0; }
        .request-row:hover { background:var(--bg-card-hover); border-color:var(--border-hover); }

        .req-type { font-family:'Outfit',sans-serif; font-size:14px; font-weight:500; color:var(--text-primary); margin-bottom:2px; }
        .req-id { font-family:'Outfit',sans-serif; font-size:11px; color:var(--text-muted); }

        .hero-stat-val { font-family:'Clash Display',sans-serif; font-size:28px; font-weight:600; }
        .hero-stat-label { font-family:'Outfit',sans-serif; font-size:12px; color:var(--text-muted); margin-top:2px; }

        .section-title { font-family:'Clash Display','Outfit',sans-serif; font-weight:700; letter-spacing:-1.5px; line-height:1.1; color:var(--text-primary); }
        .section-desc { font-family:'Outfit',sans-serif; color:var(--text-secondary); line-height:1.75; }

        .feature-title { font-family:'Clash Display','Outfit',sans-serif; font-size:19px; font-weight:600; color:var(--text-primary); margin-bottom:12px; letter-spacing:-0.3px; }
        .feature-desc { font-family:'Outfit',sans-serif; font-size:14px; color:var(--text-secondary); line-height:1.75; }

        .step-title { font-family:'Clash Display','Outfit',sans-serif; font-size:19px; font-weight:600; color:var(--text-primary); margin-bottom:8px; letter-spacing:-0.3px; }
        .step-desc { font-family:'Outfit',sans-serif; font-size:14px; color:var(--text-secondary); line-height:1.7; }

        .footer-border { border-top:1px solid var(--border); }
        .footer-copy { font-family:'Outfit',sans-serif; font-size:13px; color:var(--text-muted); }

        .cta-box { position:relative; padding:80px 60px; border-radius:32px; border:1px solid var(--border); background:var(--bg-card); text-align:center; overflow:hidden; }

        .notify-card { margin-top:16px; padding:16px 18px; border-radius:12px; background:linear-gradient(135deg,rgba(14,165,233,0.1),rgba(99,102,241,0.1)); border:1px solid rgba(99,102,241,0.2); display:flex; align-items:center; gap:14px; }
        .notify-icon { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#0ea5e9,#6366f1); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .notify-title { font-family:'Outfit',sans-serif; font-size:13px; font-weight:500; color:var(--text-primary); }
        .notify-sub { font-family:'Outfit',sans-serif; font-size:11px; color:var(--text-secondary); margin-top:2px; }
      `}</style>

      <div className="noise" />

      {/* Aurora background orbs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        <div className="aurora-orb" style={{ width:"600px", height:"600px", top:"-10%", left:"-10%", background:`radial-gradient(circle, var(--orb-1) 0%, transparent 70%)`, animationDelay:"0s" }}/>
        <div className="aurora-orb" style={{ width:"500px", height:"500px", top:"20%", right:"-5%", background:`radial-gradient(circle, var(--orb-2) 0%, transparent 70%)`, animationDelay:"-4s" }}/>
        <div className="aurora-orb" style={{ width:"400px", height:"400px", bottom:"10%", left:"20%", background:`radial-gradient(circle, var(--orb-3) 0%, transparent 70%)`, animationDelay:"-8s" }}/>
      </div>

      <Navbar />

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"center", maxWidth:"1200px", margin:"0 auto", padding:"120px 40px 80px", position:"relative", zIndex:1 }}>
        <div>
          <div className="hero-badge" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(14,165,233,0.1)", border:"1px solid rgba(14,165,233,0.3)", color:"#38bdf8", fontSize:"13px", fontWeight:"500", padding:"8px 20px", borderRadius:"100px", marginBottom:"32px", fontFamily:"'Outfit',sans-serif" }}>
            <span className="live-dot"/> Portal is live · Accepting requests
          </div>

          <h1 className="hero-h1" style={{ fontFamily:"'Clash Display','Outfit',sans-serif", fontSize:"clamp(48px,5.5vw,76px)", fontWeight:"700", lineHeight:"1.05", letterSpacing:"-2px", marginBottom:"28px", color:"var(--text-primary)" }}>
            Your Campus,<br/>
            <span className="gradient-text">Paperless.</span><br/>
            <span style={{ color:"var(--text-muted)", fontWeight:"400", fontSize:"0.85em" }}>Finally.</span>
          </h1>

          <p className="hero-p" style={{ fontFamily:"'Outfit',sans-serif", fontSize:"17px", color:"var(--text-secondary)", lineHeight:"1.8", maxWidth:"500px", marginBottom:"44px", fontWeight:"300" }}>
            A unified portal for students to submit, track, and receive institutional documents — no queues, no uncertainty, no repeated office visits.
          </p>

          <div className="hero-cta" style={{ display:"flex", gap:"16px", flexWrap:"wrap" }}>
            <Link href="/register" className="btn-aurora">Access the Portal <ArrowRight size={16}/></Link>
            <Link href="/login" className="btn-ghost">Sign In</Link>
          </div>

          <div className="hero-stats" style={{ display:"flex", gap:"40px", marginTop:"56px", paddingTop:"40px", borderTop:"1px solid var(--border)" }}>
            {[
              { val:"100%", label:"Online Process", color:"#0ea5e9" },
              { val:"Live", label:"Status Updates", color:"#8b5cf6" },
              { val:"Zero", label:"Office Queues", color:"#ec4899" },
            ].map(s => (
              <div key={s.label}>
                <div className="hero-stat-val" style={{ color:s.color }}>{s.val}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero right — floating dashboard preview */}
        <div className="hero-card" style={{ position:"relative" }}>
          <div style={{ animation:"float 6s ease-in-out infinite" }}>
            <div className="glass-card" style={{ padding:"28px", boxShadow:"var(--shadow)" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px" }}>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:"12px", fontWeight:"600", color:"var(--text-muted)", letterSpacing:"1.5px", textTransform:"uppercase" }}>Recent Requests</div>
                <div style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", color:"#10b981" }}>
                  <span className="live-dot"/> Live
                </div>
              </div>

              {[
                { id:"REQ00142", type:"Bonafide Certificate", status:"Approved", color:"#10b981", bg:"rgba(16,185,129,0.1)" },
                { id:"REQ00141", type:"Transcript Request", status:"In Progress", color:"#0ea5e9", bg:"rgba(14,165,233,0.1)" },
                { id:"REQ00139", type:"ID Card Reissue", status:"Under Review", color:"#8b5cf6", bg:"rgba(139,92,246,0.1)" },
              ].map(r => (
                <div key={r.id} className="request-row">
                  <div>
                    <div className="req-type">{r.type}</div>
                    <div className="req-id">{r.id}</div>
                  </div>
                  <span style={{ fontSize:"11px", fontWeight:"600", color:r.color, background:r.bg, padding:"4px 12px", borderRadius:"100px", border:`1px solid ${r.color}30` }}>{r.status}</span>
                </div>
              ))}

              <div className="notify-card">
                <div className="notify-icon"><CheckCircle size={18} color="#fff"/></div>
                <div>
                  <div className="notify-title">REQ00142 · Ready for collection</div>
                  <div className="notify-sub">Admin Office · Just now</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ position:"absolute", top:"-20px", right:"-20px", background:"linear-gradient(135deg,#8b5cf6,#ec4899)", borderRadius:"12px", padding:"12px 18px", fontSize:"12px", fontWeight:"600", color:"#fff", fontFamily:"'Outfit',sans-serif", boxShadow:"0 8px 32px rgba(139,92,246,0.4)", animation:"float 4s ease-in-out infinite 1s" }}>
            ✓ Zero office queues
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ padding:"120px 40px", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div className="reveal" style={{ textAlign:"center", marginBottom:"72px" }}>
            <span className="tag">Platform Features</span>
            <h2 className="section-title" style={{ fontSize:"clamp(36px,4vw,56px)" }}>
              Built for how universities<br/><span className="gradient-text">actually work</span>
            </h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:"20px" }}>
            {features.map((f,i) => (
              <div key={f.title} className="feature-card reveal" style={{ transitionDelay:`${i*0.08}s` }}>
                <div style={{ width:"52px", height:"52px", borderRadius:"14px", background:f.grad, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"24px", boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
                  <f.icon size={22} color="#fff"/>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" style={{ padding:"120px 40px", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <div className="reveal" style={{ textAlign:"center", marginBottom:"64px" }}>
            <span className="tag">Student Journey</span>
            <h2 className="section-title" style={{ fontSize:"clamp(36px,4vw,56px)" }}>
              From request to<br/><span className="gradient-text">collection in four steps</span>
            </h2>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            {steps.map((s,i) => (
              <div key={s.num} className="step-card reveal" style={{ transitionDelay:`${i*0.1}s` }}>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"48px", fontWeight:"700", color:s.color, lineHeight:1, minWidth:"52px", opacity:0.6 }}>{s.num}</div>
                <div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
                <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:s.color, flexShrink:0, marginTop:"8px", boxShadow:`0 0 12px ${s.color}` }}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding:"120px 40px", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <div className="reveal cta-box">
            <div style={{ position:"absolute", top:"-30%", left:"-10%", width:"400px", height:"400px", borderRadius:"50%", background:`radial-gradient(circle, var(--orb-1) 0%, transparent 70%)`, pointerEvents:"none" }}/>
            <div style={{ position:"absolute", bottom:"-30%", right:"-10%", width:"350px", height:"350px", borderRadius:"50%", background:`radial-gradient(circle, var(--orb-2) 0%, transparent 70%)`, pointerEvents:"none" }}/>

            <span className="tag" style={{ position:"relative" }}>Get Started</span>
            <h2 className="section-title" style={{ fontSize:"clamp(32px,4vw,54px)", marginBottom:"20px", position:"relative" }}>
              Ready to modernise<br/><span className="gradient-text">campus administration?</span>
            </h2>
            <p className="section-desc" style={{ fontSize:"16px", marginBottom:"44px", fontWeight:"300", position:"relative" }}>
              Join students and administrators already using CampusPortal<br/>to eliminate paperwork and delays.
            </p>
            <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap", position:"relative" }}>
              <Link href="/register" className="btn-aurora">Get Started <ArrowRight size={16}/></Link>
              <Link href="/login" className="btn-ghost">Sign In</Link>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px", marginTop:"60px", position:"relative" }}>
              {[
                { val:"100%", label:"Paperless workflow", color:"#0ea5e9" },
                { val:"Real-time", label:"Status tracking", color:"#8b5cf6" },
                { val:"Secure", label:"Full audit trail", color:"#ec4899" },
              ].map(s => (
                <div key={s.label} className="stat-pill">
                  <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"26px", fontWeight:"600", color:s.color, marginBottom:"6px" }}>{s.val}</div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:"12px", color:"var(--text-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer-border" style={{ padding:"32px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", position:"relative", zIndex:1 }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"20px", fontWeight:"600", color:"var(--text-primary)" }}>
          Campus<span className="gradient-text">Portal</span>
        </div>
        <div className="footer-copy">© 2026 CampusPortal · Administrative Services Management System</div>
      </footer>
    </main>
  );
}
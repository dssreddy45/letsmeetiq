import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  bg: "#F4F6FB",
  surface: "#FFFFFF",
  border: "#E4E8F4",
  borderStrong: "#C8D0E8",
  text: "#0D1225",
  textSub: "#5A6482",
  textMuted: "#9BA3BE",
  accent: "#4F6EF7",
  accentLight: "#EEF1FE",
  teal: "#00BFA5",
  tealLight: "#E6F7F5",
  coral: "#FF5A65",
  coralLight: "#FFF0F1",
  amber: "#F6A623",
  amberLight: "#FFF8EC",
  purple: "#8B5CF6",
  purpleLight: "#F3EFFE",
  green: "#22C55E",
  greenLight: "#EDFBF3",
  sidebar: "#0D1225",
  sidebarText: "#8A93B2",
};

const TEAM = [
  { id: 1, name: "Siri", initials: "SI", color: "#FF5A65", role: "Product Lead" },
  { id: 2, name: "Tanu", initials: "TA", color: "#00BFA5", role: "Backend Dev" },
  { id: 3, name: "Charan", initials: "CH", color: "#4F6EF7", role: "Frontend Dev" },
  { id: 4, name: "Anya", initials: "AN", color: "#22C55E", role: "UX Designer" },
  { id: 5, name: "Tulasi", initials: "TU", color: "#F6A623", role: "QA Engineer" },
  { id: 6, name: "Padma", initials: "PA", color: "#8B5CF6", role: "Tech Writer" },
];

const CALENDAR_MEETINGS = [
  { id: "c1", title: "Q2 Sprint Planning", date: "2025-04-20", time: "10:00", duration: 45, participants: [1,2,3,4], color: "#4F6EF7" },
  { id: "c2", title: "Auth Module Design", date: "2025-04-22", time: "14:00", duration: 60, participants: [1,2,3,5], color: "#00BFA5" },
  { id: "c3", title: "Product Roadmap", date: "2025-04-24", time: "11:00", duration: 90, participants: [1,4,5,6], color: "#8B5CF6" },
  { id: "c4", title: "Design Review", date: "2025-04-25", time: "15:30", duration: 30, participants: [3,4], color: "#F6A623" },
  { id: "c5", title: "All-Hands Sync", date: "2025-04-28", time: "09:00", duration: 60, participants: [1,2,3,4,5,6], color: "#FF5A65" },
  { id: "c6", title: "Investor Call", date: "2025-04-30", time: "13:00", duration: 45, participants: [1,5], color: "#8B5CF6" },
  { id: "c7", title: "Sprint Retro", date: "2025-05-02", time: "16:00", duration: 60, participants: [1,2,3,4,5,6], color: "#4F6EF7" },
];

const IMPORTANT_DATES = [
  { id: 1, label: "v2.0 Launch Deadline", date: "2025-04-30", type: "deadline", icon: "🚀" },
  { id: 2, label: "Q2 OKR Review", date: "2025-04-28", type: "review", icon: "📊" },
  { id: 3, label: "Sprint 12 End", date: "2025-05-02", type: "sprint", icon: "⚡" },
  { id: 4, label: "Q3 Hiring Decision", date: "2025-05-10", type: "decision", icon: "👥" },
];

const NOTIFICATIONS = [
  { id: 1, icon: "🔔", title: "Meeting in 30 min", desc: "Auth Module Design starts at 14:00 today", time: "13:30", read: false, color: "#4F6EF7" },
  { id: 2, icon: "⚠️", title: "Action item overdue", desc: "Review API design PRD — was due Apr 24", time: "09:00", read: false, color: "#FF5A65" },
  { id: 3, icon: "✨", title: "AI summary ready", desc: "Q2 Sprint Planning transcript processed", time: "Yesterday", read: false, color: "#8B5CF6" },
  { id: 4, icon: "📅", title: "Investor Call tomorrow", desc: "Prepare deck before 13:00 on Apr 30", time: "Yesterday", read: true, color: "#F6A623" },
  { id: 5, icon: "✅", title: "Task completed", desc: "Tanu marked backend token service done", time: "2 days ago", read: true, color: "#00BFA5" },
];

const FILES = [
  { id: 1, name: "Q2_Sprint_Plan.pdf", size: "2.4 MB", type: "pdf", uploader: 1, date: "Apr 20", icon: "📄" },
  { id: 2, name: "Auth_Architecture.pptx", size: "5.1 MB", type: "ppt", uploader: 3, date: "Apr 22", icon: "📊" },
  { id: 3, name: "Product_Roadmap_v3.pdf", size: "1.8 MB", type: "pdf", uploader: 1, date: "Apr 18", icon: "📄" },
  { id: 4, name: "Sprint_Velocity.xlsx", size: "0.6 MB", type: "xlsx", uploader: 5, date: "Apr 17", icon: "📈" },
  { id: 5, name: "Design_System.fig", size: "12 MB", type: "fig", uploader: 4, date: "Apr 15", icon: "🎨" },
];

const TASKS = [
  { id: 1, text: "Set up GitHub Actions workflow", assignee: 3, due: "Apr 25", done: false, priority: "high", meeting: "Q2 Sprint Planning" },
  { id: 2, text: "Write sprint retrospective doc", assignee: 2, due: "Apr 22", done: true, priority: "medium", meeting: "Q2 Sprint Planning" },
  { id: 3, text: "Review API design PRD", assignee: 1, due: "Apr 24", done: false, priority: "high", meeting: "Q2 Sprint Planning" },
  { id: 4, text: "Create detailed launch checklist", assignee: 5, due: "Apr 28", done: false, priority: "critical", meeting: "Product Roadmap" },
  { id: 5, text: "Update stakeholder roadmap deck", assignee: 6, due: "Apr 23", done: false, priority: "medium", meeting: "Product Roadmap" },
  { id: 6, text: "Document auth flow diagrams", assignee: 6, due: "Apr 25", done: false, priority: "high", meeting: "Auth Design" },
  { id: 7, text: "Add token expiry to technical spec", assignee: 2, due: "Apr 26", done: false, priority: "low", meeting: "Auth Design" },
];

const NOTES = [
  { id: 1, text: "Move to JWT auth — agreed in last sprint", author: 1, time: "Apr 22, 14:12", pinned: true },
  { id: 2, text: "1hr access tokens + 7-day refresh — Charan's recommendation, approved.", author: 3, time: "Apr 22, 14:30", pinned: true },
  { id: 3, text: "Mobile deprioritized until Q4 per Anya's UX audit", author: 4, time: "Apr 18, 11:45", pinned: false },
];

const LIVE_TRANSCRIPT = [
  { speaker: "Siri", text: "Alright, let's kick off. Today we need to finalize the authentication module design.", time: "0:12" },
  { speaker: "Charan", text: "I've reviewed the current implementation. We should move to JWT-based auth.", time: "0:34" },
  { speaker: "Tanu", text: "Agreed. I can handle the backend token service — ready by Friday.", time: "0:52" },
  { speaker: "Anya", text: "Should we also implement refresh token rotation? That's a security best practice.", time: "1:15" },
  { speaker: "Siri", text: "Yes, let's include that. Padma, can you document the auth flow diagrams?", time: "1:28" },
  { speaker: "Padma", text: "Sure, I'll create the Confluence page by Thursday.", time: "1:41" },
  { speaker: "Tulasi", text: "Open question — what's our token expiry policy? 1 hour or 24 hours?", time: "2:03" },
  { speaker: "Charan", text: "I recommend 1 hour for access tokens, 7 days for refresh.", time: "2:18" },
  { speaker: "Siri", text: "Decision made. Tanu, add that to the technical spec doc as well.", time: "2:30" },
];

const getMember = (id) => TEAM.find((m) => m.id === id);

const Avatar = ({ id, size = 32, style = {} }) => {
  const m = getMember(id);
  if (!m) return null;
  return (
    <div title={m.name} style={{
      width: size, height: size, borderRadius: "50%",
      background: m.color + "22", border: `2px solid ${m.color}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 800, color: m.color, flexShrink: 0, ...style,
    }}>{m.initials}</div>
  );
};

const PriorityTag = ({ priority }) => {
  const map = {
    critical: { bg: "#FFF0F1", color: "#FF5A65", label: "Critical" },
    high: { bg: "#FFF3E6", color: "#E8820C", label: "High" },
    medium: { bg: "#EEF1FE", color: "#4F6EF7", label: "Medium" },
    low: { bg: "#EDFBF3", color: "#22C55E", label: "Low" },
  };
  const s = map[priority] || map.low;
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: 10, fontWeight: 700,
      padding: "2px 8px", borderRadius: 20, letterSpacing: "0.3px", whiteSpace: "nowrap",
    }}>{s.label}</span>
  );
};

const Card = ({ children, style = {}, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#FFFFFF", borderRadius: 16,
        border: `1px solid ${hov && onClick ? "#4F6EF744" : "#E4E8F4"}`,
        boxShadow: hov ? "0 8px 28px rgba(79,110,247,0.09)" : "0 2px 8px rgba(13,18,37,0.05)",
        transition: "all 0.2s", cursor: onClick ? "pointer" : "default", ...style,
      }}>
      {children}
    </div>
  );
};

const SectionHeader = ({ icon, title, badge, action }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: C.text, margin: 0, letterSpacing: "-0.2px" }}>{title}</h3>
      {badge !== undefined && (
        <span style={{ background: C.accentLight, color: C.accent, fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>{badge}</span>
      )}
    </div>
    {action && (
      <button onClick={action.fn} style={{ background: "none", border: "none", color: C.accent, fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "4px 8px", borderRadius: 6 }}>{action.label}</button>
    )}
  </div>
);

// ─── CALENDAR ─────────────────────────────────────────────────────────────
const CalendarSection = () => {
  const [calMode, setCalMode] = useState("month");
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 3, 1));
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let day = 1 - firstDay;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++, day++) week.push(day);
    weeks.push(week);
    if (day > daysInMonth && w >= 3) break;
  }
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const TODAY_D = 22, TODAY_M = 3, TODAY_Y = 2025;
  const isToday = (d) => d === TODAY_D && month === TODAY_M && year === TODAY_Y;
  const getMDay = (d) => {
    if (d < 1 || d > daysInMonth) return [];
    const key = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return CALENDAR_MEETINGS.filter(m => m.date === key);
  };
  const isImportant = (d) => {
    if (d < 1 || d > daysInMonth) return false;
    const key = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return IMPORTANT_DATES.some(id => id.date === key);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const base = new Date(2025, 3, 20);
    base.setDate(20 + i);
    return base;
  });
  const hours = [8,9,10,11,12,13,14,15,16,17];

  return (
    <Card style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>📅</span>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: C.text, margin: 0 }}>Calendar</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", background: C.bg, borderRadius: 8, padding: 3 }}>
            {["month","week"].map(m => (
              <button key={m} onClick={() => setCalMode(m)} style={{
                background: calMode===m ? C.surface : "none", border: "none",
                borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 700,
                color: calMode===m ? C.accent : C.textMuted, cursor: "pointer",
                boxShadow: calMode===m ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s",
              }}>{m==="month"?"Month":"Week"}</button>
            ))}
          </div>
          <button onClick={() => setCurrentMonth(new Date(year,month-1,1))} style={{ background:"none",border:`1px solid ${C.border}`,borderRadius:7,width:28,height:28,cursor:"pointer",color:C.textSub,fontSize:14 }}>‹</button>
          <span style={{ fontSize:12,fontWeight:800,color:C.text,minWidth:90,textAlign:"center" }}>{monthNames[month]} {year}</span>
          <button onClick={() => setCurrentMonth(new Date(year,month+1,1))} style={{ background:"none",border:`1px solid ${C.border}`,borderRadius:7,width:28,height:28,cursor:"pointer",color:C.textSub,fontSize:14 }}>›</button>
        </div>
      </div>

      {calMode === "month" && (
        <>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6 }}>
            {dayNames.map(d => (
              <div key={d} style={{ textAlign:"center",fontSize:10,fontWeight:700,color:C.textMuted,padding:"4px 0",letterSpacing:"0.5px" }}>{d}</div>
            ))}
          </div>
          <div>
            {weeks.map((week,wi) => (
              <div key={wi} style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:2 }}>
                {week.map((d,di) => {
                  const mtgs = getMDay(d);
                  const today = isToday(d);
                  const imp = isImportant(d);
                  const valid = d>=1 && d<=daysInMonth;
                  return (
                    <div key={di} style={{
                      minHeight:68, borderRadius:10, padding:"5px 6px",
                      background: today?C.accentLight : imp?"#FFFBF0" : valid?C.bg:"transparent",
                      border: today?`1.5px solid ${C.accent}` : imp?`1.5px solid ${C.amber}`:`1px solid transparent`,
                      opacity: valid?1:0.25,
                    }}>
                      {valid && <>
                        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3 }}>
                          <span style={{
                            fontSize:11,fontWeight:today?900:500,
                            width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",
                            borderRadius:"50%",background:today?C.accent:"none",
                            color:today?"#fff":imp?C.amber:C.text,
                          }}>{d}</span>
                          {imp && <span style={{ fontSize:8 }}>⭐</span>}
                        </div>
                        <div style={{ display:"flex",flexDirection:"column",gap:1 }}>
                          {mtgs.slice(0,2).map(m => (
                            <div key={m.id} style={{
                              background:m.color+"18",borderLeft:`2px solid ${m.color}`,
                              borderRadius:"0 3px 3px 0",padding:"1px 4px",fontSize:8,fontWeight:700,
                              color:m.color,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                            }}>{m.time} {m.title}</div>
                          ))}
                          {mtgs.length>2 && <div style={{ fontSize:8,color:C.textMuted,paddingLeft:4 }}>+{mtgs.length-2}</div>}
                        </div>
                      </>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}

      {calMode === "week" && (
        <div style={{ overflowX:"auto" }}>
          <div style={{ display:"grid",gridTemplateColumns:"44px repeat(7,1fr)",minWidth:560 }}>
            <div/>
            {weekDays.map((d,i) => {
              const isT = d.getDate()===22;
              return (
                <div key={i} style={{ textAlign:"center",padding:"4px 0 10px",borderBottom:`2px solid ${isT?C.accent:C.border}` }}>
                  <div style={{ fontSize:9,color:C.textMuted,fontWeight:700,letterSpacing:"0.5px" }}>{dayNames[d.getDay()]}</div>
                  <div style={{
                    fontSize:14,fontWeight:900,color:isT?C.accent:C.text,
                    width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",
                    borderRadius:"50%",background:isT?C.accentLight:"none",margin:"2px auto 0",
                  }}>{d.getDate()}</div>
                </div>
              );
            })}
            {hours.map(h => (<>
              <div key={"h"+h} style={{ fontSize:9,color:C.textMuted,paddingRight:6,paddingTop:4,textAlign:"right",height:44 }}>{h}:00</div>
              {weekDays.map((d,di) => {
                const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
                const mtgs = CALENDAR_MEETINGS.filter(m => m.date===key && parseInt(m.time.split(":")[0])===h);
                return (
                  <div key={h+"-"+di} style={{ height:44,borderTop:`1px solid ${C.border}`,padding:"2px 3px" }}>
                    {mtgs.map(m => (
                      <div key={m.id} style={{
                        background:m.color+"18",borderLeft:`2.5px solid ${m.color}`,
                        borderRadius:"0 5px 5px 0",padding:"2px 5px",fontSize:8,fontWeight:700,
                        color:m.color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                        height:"calc(100% - 4px)",
                      }}>{m.title}</div>
                    ))}
                  </div>
                );
              })}
            </>))}
          </div>
        </div>
      )}
    </Card>
  );
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────
const NotificationsPanel = () => {
  const [notes, setNotes] = useState(NOTIFICATIONS);
  const unread = notes.filter(n => !n.read).length;
  return (
    <Card style={{ padding:24 }}>
      <SectionHeader icon="🔔" title="Smart Notifications" badge={unread||undefined}
        action={unread>0?{label:"Mark all read",fn:()=>setNotes(n=>n.map(x=>({...x,read:true})))}:undefined}/>
      <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
        {notes.map(n => (
          <motion.div key={n.id} layout
            onClick={() => setNotes(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}
            style={{
              display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",
              borderRadius:11,background:n.read?C.bg:n.color+"0A",
              border:`1px solid ${n.read?C.border:n.color+"30"}`,cursor:"pointer",transition:"all 0.2s",
            }}>
            <div style={{
              width:34,height:34,borderRadius:9,background:n.color+"18",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0,
            }}>{n.icon}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:1 }}>
                <span style={{ fontSize:12,fontWeight:n.read?500:800,color:C.text }}>{n.title}</span>
                {!n.read && <div style={{ width:6,height:6,borderRadius:"50%",background:n.color,flexShrink:0 }}/>}
              </div>
              <div style={{ fontSize:11,color:C.textSub,lineHeight:1.4 }}>{n.desc}</div>
              <div style={{ fontSize:10,color:C.textMuted,marginTop:2 }}>{n.time}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

// ─── TRANSCRIPTION ────────────────────────────────────────────────────────
const TranscriptionSection = () => {
  const [liveMode,setLiveMode] = useState(false);
  const [idx,setIdx] = useState(0);
  const [transcript,setTranscript] = useState([]);
  const [elapsed,setElapsed] = useState(0);
  const bottomRef = useRef(null);
  const timerRef = useRef(null);
  const spColors = Object.fromEntries(TEAM.map(m=>[m.name,m.color]));

  useEffect(() => {
    if (liveMode && idx < LIVE_TRANSCRIPT.length) {
      const t = setTimeout(() => {
        setTranscript(p => [...p, LIVE_TRANSCRIPT[idx]]);
        setIdx(i=>i+1);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [liveMode,idx]);

  useEffect(() => {
    if (liveMode) {
      timerRef.current = setInterval(()=>setElapsed(e=>e+1),1000);
    } else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [liveMode]);

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [transcript]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <Card style={{ padding:24 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:18 }}>🎙️</span>
          <div>
            <h3 style={{ fontSize:14,fontWeight:800,color:C.text,margin:0 }}>AI Live Transcription</h3>
            {liveMode && (
              <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:1 }}>
                <div style={{ width:7,height:7,borderRadius:"50%",background:C.coral,animation:"livepulse 1.5s infinite" }}/>
                <span style={{ fontSize:10,color:C.coral,fontWeight:800 }}>LIVE · {fmt(elapsed)}</span>
              </div>
            )}
          </div>
        </div>
        {!liveMode ? (
          <button onClick={()=>{setTranscript([]);setIdx(0);setLiveMode(true);}} style={{
            background:C.coral,border:"none",borderRadius:10,padding:"7px 16px",
            color:"#fff",fontWeight:800,fontSize:11,cursor:"pointer",
          }}>● Start Recording</button>
        ) : (
          <button onClick={()=>setLiveMode(false)} style={{
            background:C.coralLight,border:`1.5px solid ${C.coral}`,borderRadius:10,padding:"7px 14px",
            color:C.coral,fontWeight:800,fontSize:11,cursor:"pointer",
          }}>⏹ Stop</button>
        )}
      </div>

      <div style={{
        display:"flex",alignItems:"center",gap:8,padding:"8px 12px",marginBottom:12,
        background:liveMode?C.coralLight:C.bg,borderRadius:10,
        border:`1px solid ${liveMode?C.coral+"40":C.border}`,
      }}>
        <span style={{ fontSize:11,fontWeight:700,color:C.textSub }}>In meeting:</span>
        <div style={{ display:"flex" }}>
          {[1,2,3,5].map((id,i)=>(
            <Avatar key={id} id={id} size={26} style={{ marginLeft:i>0?-6:0,border:`2px solid ${C.surface}` }}/>
          ))}
        </div>
        {liveMode && <span style={{ marginLeft:"auto",fontSize:10,color:C.coral,fontWeight:800 }}>AI transcribing · sub-3s lag</span>}
      </div>

      <div style={{ overflowY:"auto",maxHeight:260,display:"flex",flexDirection:"column",gap:10 }}>
        <AnimatePresence>
          {transcript.map((line,i)=>(
            <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              style={{ display:"flex",gap:10 }}>
              <div style={{
                width:30,height:30,borderRadius:"50%",
                background:(spColors[line.speaker]||C.accent)+"20",
                border:`2px solid ${spColors[line.speaker]||C.accent}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:9,fontWeight:900,color:spColors[line.speaker]||C.accent,flexShrink:0,
              }}>{line.speaker.slice(0,2).toUpperCase()}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",alignItems:"baseline",gap:6,marginBottom:3 }}>
                  <span style={{ fontSize:11,fontWeight:900,color:spColors[line.speaker]||C.accent }}>{line.speaker}</span>
                  <span style={{ fontSize:10,color:C.textMuted }}>{line.time}</span>
                </div>
                <div style={{ fontSize:12,color:C.text,lineHeight:1.55,background:C.bg,borderRadius:"0 9px 9px 9px",padding:"7px 11px" }}>
                  {line.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {liveMode && idx<LIVE_TRANSCRIPT.length && (
          <div style={{ display:"flex",gap:4,padding:"6px 0 0 40px" }}>
            {[0,1,2].map(i=>(
              <motion.div key={i} animate={{opacity:[0.3,1,0.3],y:[0,-3,0]}}
                transition={{duration:1.2,repeat:Infinity,delay:i*0.2}}
                style={{ width:6,height:6,borderRadius:"50%",background:C.accent }}/>
            ))}
          </div>
        )}
        {!liveMode && transcript.length===0 && (
          <div style={{ textAlign:"center",padding:"28px 0",color:C.textMuted }}>
            <div style={{ fontSize:32,marginBottom:8 }}>🎙️</div>
            <div style={{ fontSize:12 }}>Click "Start Recording" to begin live AI transcription</div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
    </Card>
  );
};

// ─── PARTICIPANTS ─────────────────────────────────────────────────────────
const ParticipantsPanel = ({ live=[1,2,3,5] }) => {
  const [speaking,setSpeaking] = useState(2);
  useEffect(() => {
    const iv = setInterval(()=>setSpeaking(live[Math.floor(Math.random()*live.length)]),3000);
    return () => clearInterval(iv);
  },[]);
  return (
    <Card style={{ padding:24 }}>
      <SectionHeader icon="👥" title="Active Participants" badge={live.length}/>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:10,fontWeight:800,color:C.textMuted,letterSpacing:"0.5px",marginBottom:8 }}>IN MEETING NOW</div>
        <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
          {live.map(id=>{
            const m=getMember(id);
            const isSp=speaking===id;
            return (
              <motion.div key={id} animate={isSp?{x:[0,2,0]}:{}} transition={{duration:0.3,repeat:isSp?2:0}}
                style={{
                  display:"flex",alignItems:"center",gap:10,padding:"8px 11px",
                  borderRadius:10,background:isSp?m.color+"0D":C.bg,
                  border:`1px solid ${isSp?m.color+"40":"transparent"}`,transition:"all 0.3s",
                }}>
                <div style={{ position:"relative" }}>
                  <Avatar id={id} size={34}/>
                  <div style={{ position:"absolute",top:0,right:0,width:9,height:9,borderRadius:"50%",background:C.green,border:`2px solid ${C.surface}` }}/>
                  {isSp && <div style={{ position:"absolute",bottom:-1,right:-1,width:12,height:12,borderRadius:"50%",background:m.color,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.surface}`,fontSize:6 }}>🎙</div>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12,fontWeight:800,color:C.text }}>{m.name}</div>
                  <div style={{ fontSize:10,color:isSp?m.color:C.textMuted }}>{isSp?"Speaking...":m.role}</div>
                </div>
                {isSp && (
                  <div style={{ display:"flex",gap:2,alignItems:"flex-end" }}>
                    {[3,5,4,6,3].map((h,i)=>(
                      <motion.div key={i} animate={{height:[h,h+4,h]}} transition={{duration:0.4,repeat:Infinity,delay:i*0.1}}
                        style={{ width:3,borderRadius:2,background:m.color }}/>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      <div>
        <div style={{ fontSize:10,fontWeight:800,color:C.textMuted,letterSpacing:"0.5px",marginBottom:8 }}>NOT IN MEETING</div>
        {TEAM.filter(m=>!live.includes(m.id)).map(m=>(
          <div key={m.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"6px 11px",borderRadius:9,opacity:0.55,marginBottom:4 }}>
            <Avatar id={m.id} size={28}/>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:C.text }}>{m.name}</div>
              <div style={{ fontSize:10,color:C.textMuted }}>{m.role}</div>
            </div>
            <div style={{ marginLeft:"auto",width:7,height:7,borderRadius:"50%",background:C.textMuted }}/>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ─── TASKS & NOTES ────────────────────────────────────────────────────────
const TasksNotesSection = () => {
  const [tasks,setTasks] = useState(TASKS);
  const [notes] = useState(NOTES);
  const [tab,setTab] = useState("tasks");
  const [newTask,setNewTask] = useState("");
  const [filter,setFilter] = useState("all");

  const toggle = id => setTasks(t=>t.map(x=>x.id===id?{...x,done:!x.done}:x));
  const filtered = tasks.filter(t=>{
    if(filter==="done") return t.done;
    if(filter==="pending") return !t.done;
    if(filter==="critical") return t.priority==="critical";
    return true;
  });

  return (
    <Card style={{ padding:24 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <div style={{ display:"flex",gap:3,background:C.bg,borderRadius:9,padding:3 }}>
          {["tasks","notes"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              background:tab===t?C.surface:"none",border:"none",borderRadius:7,padding:"5px 14px",
              fontSize:12,fontWeight:800,color:tab===t?C.accent:C.textMuted,cursor:"pointer",
              boxShadow:tab===t?"0 1px 4px rgba(0,0,0,0.07)":"none",transition:"all 0.15s",
            }}>
              {t==="tasks"?`📋 Tasks (${tasks.filter(x=>!x.done).length})`:`📝 Notes (${notes.length})`}
            </button>
          ))}
        </div>
        {tab==="tasks" && (
          <div style={{ display:"flex",gap:5 }}>
            {["all","pending","critical","done"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{
                background:filter===f?C.accentLight:C.bg,
                border:`1px solid ${filter===f?C.accent+"40":C.border}`,
                borderRadius:6,padding:"3px 9px",fontSize:10,fontWeight:700,
                color:filter===f?C.accent:C.textMuted,cursor:"pointer",
              }}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
            ))}
          </div>
        )}
      </div>

      {tab==="tasks" && (<>
        <div style={{ display:"flex",gap:8,marginBottom:12 }}>
          <input value={newTask} onChange={e=>setNewTask(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&newTask.trim()){setTasks(t=>[...t,{id:Date.now(),text:newTask.trim(),assignee:1,due:"TBD",done:false,priority:"medium",meeting:"Manual"}]);setNewTask("");}}}
            placeholder="Add action item and press Enter..."
            style={{ flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"8px 13px",fontSize:12,color:C.text,outline:"none" }}/>
          <button onClick={()=>{if(newTask.trim()){setTasks(t=>[...t,{id:Date.now(),text:newTask.trim(),assignee:1,due:"TBD",done:false,priority:"medium",meeting:"Manual"}]);setNewTask("");}}}
            style={{ background:C.accent,border:"none",borderRadius:9,padding:"8px 14px",color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer" }}>+ Add</button>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:5,maxHeight:310,overflowY:"auto" }}>
          <AnimatePresence>
            {filtered.map(task=>(
              <motion.div key={task.id} layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                style={{
                  display:"flex",alignItems:"center",gap:9,padding:"9px 12px",
                  borderRadius:9,background:task.done?C.bg:C.surface,
                  border:`1px solid ${C.border}`,opacity:task.done?0.65:1,
                }}>
                <button onClick={()=>toggle(task.id)} style={{
                  width:19,height:19,borderRadius:5,border:`2px solid ${task.done?C.teal:C.borderStrong}`,
                  background:task.done?C.teal:"none",display:"flex",alignItems:"center",justifyContent:"center",
                  cursor:"pointer",flexShrink:0,transition:"all 0.15s",
                }}>{task.done&&<span style={{ color:"#fff",fontSize:10,fontWeight:900 }}>✓</span>}</button>
                <div style={{ flex:1,minWidth:0 }}>
                  <span style={{ fontSize:12,color:C.text,fontWeight:500,textDecoration:task.done?"line-through":"none" }}>{task.text}</span>
                  <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:2 }}>
                    <span style={{ fontSize:10,color:C.textMuted }}>Due {task.due}</span>
                    <span style={{ fontSize:10,color:C.textMuted }}>·</span>
                    <span style={{ fontSize:10,color:C.textMuted }}>{task.meeting}</span>
                  </div>
                </div>
                <PriorityTag priority={task.priority}/>
                <Avatar id={task.assignee} size={24}/>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </>)}

      {tab==="notes" && (
        <div style={{ display:"flex",flexDirection:"column",gap:9,maxHeight:360,overflowY:"auto" }}>
          {notes.map(note=>{
            const m=getMember(note.author);
            return (
              <div key={note.id} style={{
                padding:"13px 15px",borderRadius:11,
                background:note.pinned?C.amberLight:C.bg,
                border:`1px solid ${note.pinned?C.amber+"40":C.border}`,
              }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                    <Avatar id={note.author} size={25}/>
                    <span style={{ fontSize:11,fontWeight:800,color:C.text }}>{m?.name}</span>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                    {note.pinned&&<span style={{ fontSize:9,color:C.amber,fontWeight:800,background:C.amber+"20",padding:"2px 7px",borderRadius:5 }}>📌 Pinned</span>}
                    <span style={{ fontSize:10,color:C.textMuted }}>{note.time}</span>
                  </div>
                </div>
                <p style={{ fontSize:12,color:C.text,lineHeight:1.55,margin:0 }}>{note.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

// ─── IMPORTANT DATES ──────────────────────────────────────────────────────
const ImportantDatesPanel = () => {
  const today = new Date(2025,3,22);
  const daysUntil = s => Math.ceil((new Date(s)-today)/(1000*60*60*24));
  const typeColors = { deadline:C.coral, review:C.accent, sprint:C.purple, decision:C.amber };
  return (
    <Card style={{ padding:24 }}>
      <SectionHeader icon="⭐" title="Important Dates" badge={IMPORTANT_DATES.length}/>
      <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
        {IMPORTANT_DATES.sort((a,b)=>new Date(a.date)-new Date(b.date)).map(d=>{
          const days=daysUntil(d.date);
          const color=typeColors[d.type]||C.accent;
          const urgent=days<=3;
          return (
            <div key={d.id} style={{
              display:"flex",alignItems:"center",gap:11,padding:"11px 13px",
              borderRadius:11,background:urgent?color+"0A":C.bg,
              border:`1px solid ${urgent?color+"30":C.border}`,
            }}>
              <div style={{
                width:38,height:38,borderRadius:9,background:color+"18",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,
              }}>{d.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12,fontWeight:800,color:C.text }}>{d.label}</div>
                <div style={{ fontSize:10,color:C.textSub,marginTop:1 }}>
                  {new Date(d.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                </div>
              </div>
              <div style={{
                padding:"3px 11px",borderRadius:20,fontSize:11,fontWeight:900,
                background:urgent?color:color+"18",color:urgent?"#fff":color,
              }}>
                {days===0?"Today":days<0?"Overdue":`${days}d`}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// ─── FILES ────────────────────────────────────────────────────────────────
const FileAttachments = () => {
  const [files,setFiles] = useState(FILES);
  const [dragging,setDragging] = useState(false);
  const typeColors = { pdf:C.coral, ppt:C.accent, xlsx:C.green, fig:C.purple };
  const typeLabels = { pdf:"PDF", ppt:"PPT", xlsx:"XLS", fig:"FIG" };
  return (
    <Card style={{ padding:24 }}>
      <SectionHeader icon="📎" title="File Attachments" badge={files.length} action={{label:"View all",fn:()=>{}}}/>
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{
          e.preventDefault();setDragging(false);
          const dropped=Array.from(e.dataTransfer.files);
          if(dropped.length>0) setFiles(f=>[...f,...dropped.map((file,i)=>({
            id:Date.now()+i,name:file.name,size:(file.size/1024/1024).toFixed(1)+" MB",
            type:file.name.split(".").pop()?.toLowerCase()||"file",
            uploader:1,date:"Just now",icon:"📄",
          }))]);
        }}
        style={{
          border:`2px dashed ${dragging?C.accent:C.border}`,borderRadius:11,
          padding:"14px 18px",textAlign:"center",marginBottom:14,
          background:dragging?C.accentLight:C.bg,transition:"all 0.2s",cursor:"pointer",
        }}>
        <div style={{ fontSize:20,marginBottom:3 }}>☁️</div>
        <div style={{ fontSize:11,fontWeight:700,color:dragging?C.accent:C.textSub }}>
          Drop files here or <span style={{ color:C.accent,textDecoration:"underline" }}>browse</span>
        </div>
        <div style={{ fontSize:10,color:C.textMuted,marginTop:1 }}>PDF, PPT, XLSX, DOCX, FIG</div>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:5 }}>
        {files.map(f=>{
          const color=typeColors[f.type]||C.textMuted;
          const label=typeLabels[f.type]||f.type.toUpperCase().slice(0,3);
          const m=getMember(f.uploader);
          return (
            <div key={f.id} style={{
              display:"flex",alignItems:"center",gap:11,padding:"9px 11px",
              borderRadius:9,background:C.bg,border:`1px solid ${C.border}`,
              transition:"all 0.15s",cursor:"pointer",
            }}
              onMouseEnter={e=>e.currentTarget.style.background=C.accentLight}
              onMouseLeave={e=>e.currentTarget.style.background=C.bg}>
              <div style={{
                width:34,height:34,borderRadius:7,background:color+"18",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
              }}>
                <span style={{ fontSize:7,fontWeight:900,color,letterSpacing:"0.5px" }}>{label}</span>
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:11,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{f.name}</div>
                <div style={{ fontSize:10,color:C.textMuted }}>{f.size} · {f.date} · {m?.name}</div>
              </div>
              <button style={{ background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:15,padding:4 }}>⤓</button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────
const NAV = [
  {id:"dashboard",icon:"⚡",label:"Dashboard"},
  {id:"calendar",icon:"📅",label:"Calendar"},
  {id:"live",icon:"●",label:"Live Meeting",live:true},
  {id:"tasks",icon:"📋",label:"Tasks & Notes"},
  {id:"files",icon:"📎",label:"Files"},
  {id:"analytics",icon:"📊",label:"Analytics"},
];
const Sidebar = ({view,setView,unread}) => (
  <div style={{
    width:215,background:C.sidebar,display:"flex",flexDirection:"column",
    padding:"0 0 24px",position:"fixed",height:"100vh",zIndex:100,
    boxShadow:"4px 0 20px rgba(0,0,0,0.18)",
  }}>
    <div style={{ padding:"26px 18px 22px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <div style={{
          width:36,height:36,borderRadius:11,
          background:"linear-gradient(135deg, #4F6EF7, #00BFA5)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,
        }}>⚡</div>
        <div>
          <div style={{ fontSize:14,fontWeight:900,color:"#fff",letterSpacing:"-0.5px" }}>LetsMeetIQ</div>
          <div style={{ fontSize:9,color:"#4F6EF7",fontWeight:800,letterSpacing:"0.8px" }}>AI INTELLIGENCE</div>
        </div>
      </div>
    </div>
    <div style={{ flex:1 }}>
      <div style={{ padding:"0 12px 6px",fontSize:9,color:"#3A4060",fontWeight:800,letterSpacing:"1px" }}>NAVIGATION</div>
      {NAV.map(item=>{
        const active=view===item.id;
        return (
          <button key={item.id} onClick={()=>setView(item.id)} style={{
            display:"flex",alignItems:"center",gap:9,padding:"9px 15px",
            width:"100%",border:"none",margin:"1px 0",
            background:active?"rgba(79,110,247,0.15)":"transparent",
            color:active?"#4F6EF7":C.sidebarText,
            fontSize:12,fontWeight:active?800:500,cursor:"pointer",textAlign:"left",
            borderRadius:"0 9px 9px 0",
            borderLeft:active?"3px solid #4F6EF7":"3px solid transparent",
            transition:"all 0.15s",
          }}>
            <span style={{ fontSize:14,opacity:active?1:0.7 }}>{item.icon}</span>
            <span style={{ flex:1 }}>{item.label}</span>
            {item.live&&<span style={{ width:6,height:6,borderRadius:"50%",background:"#FF5A65",animation:"livepulse 1.5s infinite" }}/>}
            {item.id==="dashboard"&&unread>0&&<span style={{ background:"#FF5A65",color:"#fff",fontSize:8,fontWeight:900,padding:"2px 5px",borderRadius:8,minWidth:15,textAlign:"center" }}>{unread}</span>}
          </button>
        );
      })}
    </div>
    <div style={{ padding:"14px 15px 0" }}>
      <div style={{ fontSize:9,color:"#3A4060",fontWeight:800,letterSpacing:"1px",marginBottom:10 }}>TEAM</div>
      {TEAM.map(m=>(
        <div key={m.id} style={{ display:"flex",alignItems:"center",gap:7,marginBottom:7 }}>
          <div style={{
            width:24,height:24,borderRadius:"50%",
            background:m.color+"22",border:`1.5px solid ${m.color}`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:8,fontWeight:900,color:m.color,
          }}>{m.initials}</div>
          <span style={{ fontSize:11,color:C.sidebarText,fontWeight:500 }}>{m.name}</span>
          <div style={{ marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"#22C55E" }}/>
        </div>
      ))}
    </div>
  </div>
);

// ─── DASHBOARD ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const pct = Math.round((TASKS.filter(t=>t.done).length/TASKS.length)*100);
  const stats = [
    {label:"Upcoming Meetings",value:CALENDAR_MEETINGS.filter(m=>m.date>="2025-04-22").length,icon:"📅",color:C.accent,bg:C.accentLight,delta:"2 today"},
    {label:"Open Tasks",value:TASKS.filter(t=>!t.done).length,icon:"📋",color:C.coral,bg:C.coralLight,delta:"3 overdue"},
    {label:"Task Completion",value:`${pct}%`,icon:"✅",color:C.teal,bg:C.tealLight,delta:"+12% this sprint"},
    {label:"Team Members",value:TEAM.length,icon:"👥",color:C.purple,bg:C.purpleLight,delta:"All online"},
  ];
    const now = new Date();

    const formattedDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  return (
    <motion.div key="dashboard" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
      <div style={{ marginBottom:26 }}>
        <h1 style={{ fontSize:36,fontWeight:900,color:C.text,letterSpacing:"-1px",margin:0,lineHeight:1.1 }}>Hey Team 👋</h1>
          <p style={{ color:C.textSub,fontSize:14,marginTop:6,fontWeight:500 }}>
  {formattedDate} · {formattedTime} · You have 2 meetings today
            </p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:15,marginBottom:22 }}>
        {stats.map(s=>(
          <Card key={s.label} style={{ padding:"16px 18px" }}>
            <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10 }}>
              <div style={{ width:38,height:38,borderRadius:11,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17 }}>{s.icon}</div>
              <span style={{ fontSize:10,color:s.color,fontWeight:800,background:s.bg,padding:"2px 7px",borderRadius:7 }}>↗</span>
            </div>
            <div style={{ fontSize:26,fontWeight:900,color:C.text,letterSpacing:"-1px",marginBottom:1 }}>{s.value}</div>
            <div style={{ fontSize:11,color:C.textSub,fontWeight:700 }}>{s.label}</div>
            <div style={{ fontSize:10,color:s.color,marginTop:3,fontWeight:700 }}>{s.delta}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1.55fr 1fr",gap:18,marginBottom:18 }}>
        <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
          <CalendarSection/>
          <TranscriptionSection/>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
          <NotificationsPanel/>
          <ParticipantsPanel/>
          <ImportantDatesPanel/>
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>
        <TasksNotesSection/>
        <FileAttachments/>
      </div>
    </motion.div>
  );
};

// ─── ANALYTICS ────────────────────────────────────────────────────────────
const Analytics = () => (
  <motion.div key="analytics" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
    <div style={{ marginBottom:24 }}>
      <h1 style={{ fontSize:36,fontWeight:900,color:C.text,letterSpacing:"-1px",margin:0,lineHeight:1.1 }}>Analytics</h1>
      <p style={{ color:C.textSub,fontSize:14,marginTop:6,fontWeight:500 }}>Meeting intelligence insights for your team</p>
    </div>
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>
      <Card style={{ padding:22 }}>
        <SectionHeader icon="📊" title="Task Completion by Member"/>
        {TEAM.map(m=>{
          const mine=TASKS.filter(t=>t.assignee===m.id);
          const done=mine.filter(t=>t.done).length;
          const pct=mine.length?Math.round((done/mine.length)*100):0;
          return (
            <div key={m.id} style={{ marginBottom:12 }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4 }}>
                <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                  <Avatar id={m.id} size={22}/>
                  <span style={{ fontSize:12,fontWeight:700,color:C.text }}>{m.name}</span>
                </div>
                <span style={{ fontSize:11,color:C.textSub }}>{done}/{mine.length}</span>
              </div>
              <div style={{ height:7,background:C.bg,borderRadius:4,overflow:"hidden" }}>
                <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8}}
                  style={{ height:"100%",background:m.color,borderRadius:4 }}/>
              </div>
            </div>
          );
        })}
      </Card>
      <Card style={{ padding:22 }}>
        <SectionHeader icon="🎯" title="Task Priority Breakdown"/>
        {["critical","high","medium","low"].map(p=>{
          const count=TASKS.filter(t=>t.priority===p).length;
          const pct=Math.round((count/TASKS.length)*100);
          const colors={critical:C.coral,high:C.amber,medium:C.accent,low:C.teal};
          return (
            <div key={p} style={{ marginBottom:11 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                <PriorityTag priority={p}/>
                <span style={{ fontSize:11,color:C.textSub }}>{count} tasks · {pct}%</span>
              </div>
              <div style={{ height:7,background:C.bg,borderRadius:4,overflow:"hidden" }}>
                <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8}}
                  style={{ height:"100%",background:colors[p],borderRadius:4 }}/>
              </div>
            </div>
          );
        })}
      </Card>
      <Card style={{ padding:22 }}>
        <SectionHeader icon="📈" title="Meeting Overview"/>
        {[
          {label:"Total Scheduled",value:CALENDAR_MEETINGS.length,icon:"📅"},
          {label:"This Week",value:3,icon:"📆"},
          {label:"Total Participants",value:TEAM.length,icon:"👥"},
          {label:"Avg Duration",value:"57 min",icon:"⏱"},
          {label:"Important Dates",value:IMPORTANT_DATES.length,icon:"⭐"},
          {label:"File Attachments",value:FILES.length,icon:"📎"},
        ].map(s=>(
          <div key={s.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`,fontSize:12 }}>
            <div style={{ display:"flex",alignItems:"center",gap:7 }}>
              <span style={{ fontSize:14 }}>{s.icon}</span>
              <span style={{ color:C.textSub }}>{s.label}</span>
            </div>
            <span style={{ fontWeight:900,color:C.text,fontSize:14 }}>{s.value}</span>
          </div>
        ))}
      </Card>
      <Card style={{ padding:22 }}>
        <SectionHeader icon="👤" title="Team Participation"/>
        {TEAM.map(m=>{
          const count=CALENDAR_MEETINGS.filter(meet=>meet.participants.includes(m.id)).length;
          const pct=Math.round((count/CALENDAR_MEETINGS.length)*100);
          return (
            <div key={m.id} style={{ display:"flex",alignItems:"center",gap:9,marginBottom:11 }}>
              <Avatar id={m.id} size={30}/>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:2 }}>
                  <span style={{ fontSize:12,fontWeight:700,color:C.text }}>{m.name}</span>
                  <span style={{ fontSize:10,color:C.textSub }}>{count}/{CALENDAR_MEETINGS.length}</span>
                </div>
                <div style={{ height:5,background:C.bg,borderRadius:3,overflow:"hidden" }}>
                  <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8}}
                    style={{ height:"100%",background:m.color,borderRadius:3 }}/>
                </div>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  </motion.div>
);

// ─── APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view,setView] = useState("dashboard");
  const unread = NOTIFICATIONS.filter(n=>!n.read).length;

  const renderView = () => {
    switch(view) {
      case "dashboard": return <Dashboard/>;
      case "calendar": return (
        <motion.div key="cal" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
          <div style={{ marginBottom:22 }}>
            <h1 style={{ fontSize:36,fontWeight:900,color:C.text,margin:0,letterSpacing:"-1px",lineHeight:1.1 }}>Calendar</h1>
            <p style={{ color:C.textSub,fontSize:14,marginTop:6,fontWeight:500 }}>Scheduled meetings and important dates</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:18 }}>
            <CalendarSection/>
            <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
              <ImportantDatesPanel/>
              <NotificationsPanel/>
            </div>
          </div>
        </motion.div>
      );
      case "live": return (
        <motion.div key="live" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
          <div style={{ marginBottom:22 }}>
            <h1 style={{ fontSize:36,fontWeight:900,color:C.text,margin:0,letterSpacing:"-1px",lineHeight:1.1 }}>Live Meeting</h1>
            <p style={{ color:C.textSub,fontSize:14,marginTop:6,fontWeight:500 }}>Real-time AI transcription and participant tracking</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:18 }}>
            <TranscriptionSection/>
            <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
              <ParticipantsPanel/>
              <TasksNotesSection/>
            </div>
          </div>
        </motion.div>
      );
      case "tasks": return (
        <motion.div key="tasks" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
          <div style={{ marginBottom:22 }}>
            <h1 style={{ fontSize:36,fontWeight:900,color:C.text,margin:0,letterSpacing:"-1px",lineHeight:1.1 }}>Tasks & Notes</h1>
            <p style={{ color:C.textSub,fontSize:14,marginTop:6,fontWeight:500 }}>Action items and meeting notes</p>
          </div>
          <TasksNotesSection/>
        </motion.div>
      );
      case "files": return (
        <motion.div key="files" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
          <div style={{ marginBottom:22 }}>
            <h1 style={{ fontSize:36,fontWeight:900,color:C.text,margin:0,letterSpacing:"-1px",lineHeight:1.1 }}>File Attachments</h1>
            <p style={{ color:C.textSub,fontSize:14,marginTop:6,fontWeight:500 }}>Meeting documents and shared files</p>
          </div>
          <FileAttachments/>
        </motion.div>
      );
      case "analytics": return <Analytics/>;
      default: return <Dashboard/>;
    }
  };

  return (
    <div style={{
      minHeight:"100vh",background:C.bg,
      fontFamily:"'Nunito','DM Sans','Segoe UI',sans-serif",
      color:C.text,display:"flex",
    }}>
      <Sidebar view={view} setView={setView} unread={unread}/>
      <div style={{ marginLeft:215,flex:1,padding:"28px 32px",minWidth:0 }}>
        <AnimatePresence mode="wait">{renderView()}</AnimatePresence>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input{outline:none;font-family:inherit;}
        input::placeholder{color:#9BA3BE;}
        button{font-family:inherit;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#C8D0E8;border-radius:4px;}
        @keyframes livepulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.75);}}
      `}</style>
    </div>
  );
}

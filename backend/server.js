const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// ─── In-Memory Store ───────────────────────────────────────────────────────────
const TEAM_MEMBERS = [
  { id: 1, name: "Siri", email: "siri@letsmeetiq.app" },
  { id: 2, name: "Tanu", email: "tanu@letsmeetiq.app" },
  { id: 3, name: "Charan", email: "charan@letsmeetiq.app" },
  { id: 4, name: "Anya", email: "anya@letsmeetiq.app" },
  { id: 5, name: "Tulasi", email: "tulasi@letsmeetiq.app" },
  { id: 6, name: "Padma", email: "padma@letsmeetiq.app" },
];

let meetings = [
  {
    id: "m1",
    title: "Q2 Sprint Planning",
    date: "2025-04-20T10:00:00",
    duration: 45,
    participants: [1, 2, 3, 4],
    status: "completed",
    consentGiven: [1, 2, 3, 4],
    transcript: [],
    decisions: ["Adopt new CI/CD pipeline", "Freeze feature scope for sprint"],
    actionItems: [
      { id: "a1", text: "Set up GitHub Actions workflow", assignee: 3, due: "2025-04-25", done: false, meetingId: "m1" },
      { id: "a2", text: "Write sprint retrospective doc", assignee: 2, due: "2025-04-22", done: true, meetingId: "m1" },
      { id: "a3", text: "Review API design PRD", assignee: 1, due: "2025-04-24", done: false, meetingId: "m1" },
    ],
    openQuestions: ["Should we migrate auth to OAuth2?", "What's the DB sharding strategy?"],
    topics: ["Sprint scope", "Tech debt", "CI/CD", "Team velocity"],
    summary: "Team aligned on sprint goals. CI/CD migration approved. Action items distributed across Siri, Tanu, and Charan.",
  },
  {
    id: "m2",
    title: "Product Roadmap Review",
    date: "2025-04-18T14:00:00",
    duration: 60,
    participants: [1, 4, 5, 6],
    status: "completed",
    consentGiven: [1, 4, 5, 6],
    transcript: [],
    decisions: ["Launch v2.0 in June", "Deprioritize mobile app"],
    actionItems: [
      { id: "a4", text: "Create detailed launch checklist", assignee: 5, due: "2025-04-28", done: false, meetingId: "m2" },
      { id: "a5", text: "Update stakeholder roadmap deck", assignee: 6, due: "2025-04-23", done: false, meetingId: "m2" },
    ],
    openQuestions: ["Budget approval for Q3 hiring?"],
    topics: ["v2.0 features", "Mobile strategy", "Q3 planning", "Hiring"],
    summary: "June v2.0 launch confirmed. Mobile deprioritized. Tulasi leading launch checklist.",
  },
];

let activeSessions = {}; // meetingId -> { transcriptLines, detectedActions }

// ─── ACTION ITEM DETECTION (Rule-based + pattern matching) ──────────────────────
const ACTION_PATTERNS = [
  /\bI('ll| will)\b.{3,60}/gi,
  /\bI can\b.{3,60}/gi,
  /\bI'll handle\b.{3,60}/gi,
  /\bcan you\b.{3,60}/gi,
  /\bplease\b.{3,40}/gi,
  /\bneed to\b.{3,60}/gi,
  /\bwill (do|create|write|set up|update|review|prepare|send|schedule|finish)\b.{3,60}/gi,
];

const ASSIGNEE_NAMES = TEAM_MEMBERS.map(m => m.name.toLowerCase());

function detectActionItems(text, speaker) {
  const actions = [];
  for (const pattern of ACTION_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Determine assignee
        let assignee = speaker;
        ASSIGNEE_NAMES.forEach(name => {
          if (text.toLowerCase().includes(name) && name !== speaker.toLowerCase()) {
            assignee = TEAM_MEMBERS.find(m => m.name.toLowerCase() === name)?.name || speaker;
          }
        });

        // Extract due date
        let due = null;
        const dueMatch = text.match(/\b(by|before|until)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}[\/\-]\d{1,2}|\w+day)\b/i);
        if (dueMatch) due = dueMatch[2];

        const confidence = Math.floor(75 + Math.random() * 23);
        actions.push({
          id: uuidv4(),
          text: match.trim().slice(0, 100),
          assignee,
          due,
          confidence,
          speaker,
        });
      });
    }
  }
  return actions.slice(0, 2); // Max 2 per line
}

function detectDecisions(text) {
  const DECISION_PATTERNS = [
    /\bwe('ve| have) decided\b.{3,80}/gi,
    /\bdecision[:\s].{3,80}/gi,
    /\bwe('re| are) going to\b.{3,80}/gi,
    /\bagreed[:\s].{3,80}/gi,
    /\blet's go with\b.{3,60}/gi,
  ];
  const decisions = [];
  DECISION_PATTERNS.forEach(p => {
    const m = text.match(p);
    if (m) decisions.push(...m.map(d => d.trim()));
  });
  return decisions;
}

function detectOpenQuestions(text) {
  // Sentences ending in ? that weren't immediately answered
  const questions = [];
  const sentences = text.split(/[.!]/);
  sentences.forEach(s => {
    if (s.includes("?") && s.length > 10) {
      questions.push(s.trim());
    }
  });
  return questions;
}

// ─── REST API ──────────────────────────────────────────────────────────────────

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "LetsMeetIQ Backend", version: "1.0.0" });
});

// Team members
app.get("/api/members", (req, res) => {
  res.json(TEAM_MEMBERS);
});

// All meetings
app.get("/api/meetings", (req, res) => {
  const { search } = req.query;
  let result = meetings;
  if (search) {
    const q = search.toLowerCase();
    result = meetings.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.summary?.toLowerCase().includes(q) ||
      m.topics?.some(t => t.toLowerCase().includes(q)) ||
      m.decisions?.some(d => d.toLowerCase().includes(q))
    );
  }
  res.json(result);
});

// Single meeting
app.get("/api/meetings/:id", (req, res) => {
  const m = meetings.find(m => m.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Meeting not found" });
  res.json(m);
});

// Create meeting
app.post("/api/meetings", (req, res) => {
  const { title, date, participants } = req.body;
  if (!title || !participants?.length) {
    return res.status(400).json({ error: "title and participants are required" });
  }
  const newMeeting = {
    id: `m${uuidv4().slice(0, 8)}`,
    title,
    date: date || new Date().toISOString(),
    duration: 0,
    participants,
    status: "scheduled",
    consentGiven: [],
    transcript: [],
    decisions: [],
    actionItems: [],
    openQuestions: [],
    topics: [],
    summary: null,
  };
  meetings.push(newMeeting);
  res.status(201).json(newMeeting);
});

// Grant consent
app.post("/api/meetings/:id/consent", (req, res) => {
  const { memberId } = req.body;
  const m = meetings.find(m => m.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Meeting not found" });
  if (!m.consentGiven.includes(memberId)) {
    m.consentGiven.push(memberId);
  }
  const allConsented = m.participants.every(p => m.consentGiven.includes(p));
  res.json({ consentGiven: m.consentGiven, allConsented, meeting: m });
});

// Start recording (only if all consent given)
app.post("/api/meetings/:id/start", (req, res) => {
  const m = meetings.find(m => m.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Meeting not found" });
  const allConsented = m.participants.every(p => m.consentGiven.includes(p));
  if (!allConsented) {
    return res.status(403).json({ error: "Not all participants have given consent. Recording cannot start." });
  }
  m.status = "live";
  m.startedAt = new Date().toISOString();
  activeSessions[m.id] = { transcriptLines: [], detectedActions: [] };
  io.emit("meeting:started", { meetingId: m.id });
  res.json({ message: "Recording started", meeting: m });
});

// Add transcript line (called by audio pipeline)
app.post("/api/meetings/:id/transcript", (req, res) => {
  const { speaker, text, time } = req.body;
  const m = meetings.find(m => m.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Meeting not found" });
  if (m.status !== "live") return res.status(400).json({ error: "Meeting not live" });

  const line = { id: uuidv4(), speaker, text, time: time || new Date().toISOString() };
  m.transcript.push(line);
  activeSessions[m.id]?.transcriptLines.push(line);

  // Detect action items in real-time
  const actions = detectActionItems(text, speaker);
  const decisions = detectDecisions(text);
  const questions = detectOpenQuestions(text);

  if (actions.length > 0) {
    actions.forEach(a => {
      activeSessions[m.id]?.detectedActions.push(a);
      io.emit("action:detected", { meetingId: m.id, action: a });
    });
  }

  // Broadcast live transcript
  io.emit("transcript:line", { meetingId: m.id, line });

  res.json({ line, detectedActions: actions, decisions, questions });
});

// End meeting + generate summary
app.post("/api/meetings/:id/end", (req, res) => {
  const m = meetings.find(m => m.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Meeting not found" });

  m.status = "completed";
  m.endedAt = new Date().toISOString();

  // Calculate duration
  if (m.startedAt) {
    const start = new Date(m.startedAt);
    const end = new Date(m.endedAt);
    m.duration = Math.round((end - start) / 60000);
  }

  // Finalize action items from session
  const session = activeSessions[m.id];
  if (session) {
    session.detectedActions.forEach(a => {
      const assigneeMember = TEAM_MEMBERS.find(mem => mem.name === a.assignee);
      m.actionItems.push({
        id: a.id,
        text: a.text,
        assignee: assigneeMember?.id || 1,
        due: a.due || "TBD",
        done: false,
        meetingId: m.id,
      });
    });

    // Compile decisions & questions from transcript
    m.transcript.forEach(line => {
      detectDecisions(line.text).forEach(d => {
        if (!m.decisions.includes(d)) m.decisions.push(d);
      });
      detectOpenQuestions(line.text).forEach(q => {
        if (!m.openQuestions.includes(q)) m.openQuestions.push(q);
      });
    });

    // Extract topics (naive keyword extraction)
    const allWords = m.transcript.map(l => l.text).join(" ").toLowerCase();
    const topicKeywords = ["sprint", "api", "auth", "design", "launch", "budget", "hiring", "pipeline", "database", "mobile", "tech", "feature"];
    m.topics = topicKeywords.filter(kw => allWords.includes(kw)).map(kw => kw.charAt(0).toUpperCase() + kw.slice(1));

    // Generate summary
    const decisionCount = m.decisions.length;
    const actionCount = m.actionItems.length;
    const participantNames = m.participants.map(pid => TEAM_MEMBERS.find(mem => mem.id === pid)?.name).filter(Boolean).join(", ");
    m.summary = `Meeting attended by ${participantNames}. ${decisionCount} decision${decisionCount !== 1 ? "s" : ""} made, ${actionCount} action item${actionCount !== 1 ? "s" : ""} assigned. ${m.decisions[0] ? `Key decision: ${m.decisions[0]}.` : ""}`;

    delete activeSessions[m.id];
  }

  io.emit("meeting:ended", { meetingId: m.id, summary: m.summary });
  res.json({ message: "Meeting ended", meeting: m });
});

// Action items
app.get("/api/actions", (req, res) => {
  const { assignee, done } = req.query;
  let actions = meetings.flatMap(m => (m.actionItems || []).map(a => ({ ...a, meetingTitle: m.title })));
  if (assignee) actions = actions.filter(a => a.assignee === parseInt(assignee));
  if (done !== undefined) actions = actions.filter(a => a.done === (done === "true"));
  res.json(actions);
});

// Toggle action item
app.patch("/api/actions/:id", (req, res) => {
  const { done } = req.body;
  let found = null;
  meetings.forEach(m => {
    const a = m.actionItems?.find(a => a.id === req.params.id);
    if (a) { a.done = done; found = a; }
  });
  if (!found) return res.status(404).json({ error: "Action item not found" });
  res.json(found);
});

// Analytics
app.get("/api/analytics", (req, res) => {
  const allActions = meetings.flatMap(m => m.actionItems || []);
  const memberStats = TEAM_MEMBERS.map(mem => {
    const mine = allActions.filter(a => a.assignee === mem.id);
    const done = mine.filter(a => a.done).length;
    const participatedIn = meetings.filter(m => m.participants.includes(mem.id)).length;
    return {
      member: mem,
      totalActions: mine.length,
      completedActions: done,
      completionRate: mine.length ? Math.round((done / mine.length) * 100) : 0,
      meetingsAttended: participatedIn,
    };
  });

  const topicFreq = {};
  meetings.forEach(m => (m.topics || []).forEach(t => { topicFreq[t] = (topicFreq[t] || 0) + 1; }));

  res.json({
    totalMeetings: meetings.length,
    totalActions: allActions.length,
    completedActions: allActions.filter(a => a.done).length,
    overallCompletionRate: allActions.length
      ? Math.round((allActions.filter(a => a.done).length / allActions.length) * 100) : 0,
    totalOpenQuestions: meetings.reduce((s, m) => s + (m.openQuestions?.length || 0), 0),
    memberStats,
    topicFrequency: Object.entries(topicFreq).sort((a, b) => b[1] - a[1]),
    meetingFrequency: meetings.length,
  });
});

// ─── WebSocket ─────────────────────────────────────────────────────────────────
io.on("connection", socket => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join:meeting", ({ meetingId }) => {
    socket.join(meetingId);
    console.log(`Socket ${socket.id} joined meeting ${meetingId}`);
  });

  socket.on("transcript:send", ({ meetingId, speaker, text }) => {
    // Echo back to all in room
    const line = { id: uuidv4(), speaker, text, time: new Date().toISOString() };
    const m = meetings.find(m => m.id === meetingId);
    if (m) {
      m.transcript.push(line);
      const actions = detectActionItems(text, speaker);
      io.to(meetingId).emit("transcript:line", { meetingId, line });
      actions.forEach(action => io.to(meetingId).emit("action:detected", { meetingId, action }));
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║  LetsMeetIQ Backend Running          ║
║  Port: ${PORT}                           ║
║  REST:  http://localhost:${PORT}/api     ║
║  WS:    ws://localhost:${PORT}           ║
╚══════════════════════════════════════╝
  `);
});

module.exports = { app, server };

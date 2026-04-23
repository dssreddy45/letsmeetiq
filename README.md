# ⚡ LetsMeetIQ — AI Meeting Intelligence Platform

> Real-time meeting transcription, speaker identification, action item detection, and structured post-meeting summaries.

**Team:** Siri · Tanu · Charan · Anya · Tulasi · Padma

---

## 📁 Project Structure

```
letsmeetiq/
├── backend/
│   ├── server.js          # Express + Socket.IO backend
│   └── package.json
└── frontend/
    ├── src/
    │   ├── main.jsx       # React entry point
    │   └── App.jsx        # Full application UI
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js** v18+ ([download](https://nodejs.org))
- **npm** v9+

---

### Step 1 — Start the Backend

```bash
cd letsmeetiq/backend
npm install
npm start
```

Backend runs at: **http://localhost:4000**

---

### Step 2 — Start the Frontend

Open a **second terminal**:

```bash
cd letsmeetiq/frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

Open your browser to → **http://localhost:3000**

---

## 🖥️ App Features

| Feature | Description |
|---|---|
| **Dashboard** | Overview stats, recent meetings, pending action items |
| **New Meeting** | Schedule meeting, select participants (Siri/Tanu/Charan/Anya/Tulasi/Padma), get consent |
| **Live Meeting** | Real-time transcript with speaker labels, action item detection panel |
| **Post-Meeting Summary** | AI-structured summary: decisions, action items, open questions, topics |
| **Meeting Library** | Searchable archive of all past meetings |
| **Action Tracker** | Cross-meeting action item table with completion toggle |
| **Analytics** | Completion rates per member, topic frequency, participation stats |

---

## 🔌 API Reference

### Meetings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/meetings` | List all meetings (supports `?search=`) |
| GET | `/api/meetings/:id` | Get single meeting |
| POST | `/api/meetings` | Create meeting `{ title, date, participants: [1,2,3] }` |
| POST | `/api/meetings/:id/consent` | Grant consent `{ memberId: 1 }` |
| POST | `/api/meetings/:id/start` | Start recording (all consent required) |
| POST | `/api/meetings/:id/transcript` | Add transcript line `{ speaker, text }` |
| POST | `/api/meetings/:id/end` | End meeting, generate summary |

### Actions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/actions` | All action items (supports `?assignee=1&done=false`) |
| PATCH | `/api/actions/:id` | Update action `{ done: true }` |

### Analytics & Team
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics` | Full analytics data |
| GET | `/api/members` | Team members list |
| GET | `/api/health` | Health check |

### WebSocket Events (Socket.IO)
| Event | Direction | Payload |
|---|---|---|
| `join:meeting` | Client → Server | `{ meetingId }` |
| `transcript:send` | Client → Server | `{ meetingId, speaker, text }` |
| `transcript:line` | Server → Client | `{ meetingId, line }` |
| `action:detected` | Server → Client | `{ meetingId, action }` |
| `meeting:started` | Server → All | `{ meetingId }` |
| `meeting:ended` | Server → All | `{ meetingId, summary }` |

---

## 🌐 Deploy to Production

### Option A — Deploy to Railway (Recommended, Free Tier)

#### Backend on Railway:
1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select `letsmeetiq/backend` as root directory
4. Railway auto-detects Node.js and sets start command to `npm start`
5. Copy the generated URL (e.g. `https://letsmeetiq-backend.railway.app`)

#### Frontend on Vercel:
1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set **Root Directory** to `letsmeetiq/frontend`
3. Framework: **Vite**
4. Add environment variable:
   ```
   VITE_API_URL=https://letsmeetiq-backend.railway.app
   ```
5. Deploy → get URL like `https://letsmeetiq.vercel.app`

---

### Option B — Deploy with Docker

#### Backend Dockerfile
Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 4000
CMD ["node", "server.js"]
```

#### Frontend Dockerfile
Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml (root level)
```yaml
version: "3.8"
services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - PORT=4000

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

Run with:
```bash
docker-compose up --build
```

---

### Option C — Deploy to Render (Free Tier)

**Backend:**
1. New Web Service → Connect GitHub repo
2. Root: `letsmeetiq/backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Environment: `PORT=4000`

**Frontend:**
1. New Static Site → Connect GitHub repo
2. Root: `letsmeetiq/frontend`
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`

---

## 🔧 Architecture

```
Browser (React + Framer Motion)
        │
        ├── REST API calls ──────────→ Express.js (port 4000)
        │                                    │
        └── WebSocket (Socket.IO) ──────────→ Real-time events
                                             │
                                    In-memory store (meetings, actions)
                                             │
                                    Action Item Detection Engine
                                    (Pattern matching on transcript lines)
```

### AI Detection Engines

**Action Item Detection:** Uses regex pattern matching on transcript lines to identify:
- Commitment phrases ("I'll", "I will", "I can handle", "will create")
- Assignee extraction from context
- Due date extraction ("by Friday", "before Monday")
- Confidence scoring

**Decision Detection:** Identifies:
- "We've decided", "Decision:", "We're going to", "Agreed:", "Let's go with"

**Open Question Detection:** Flags questions not followed by a clear resolution.

**Summary Generation:** Post-meeting synthesis of participants, decisions, and action count.

---

## 🔐 Consent Management

Recording will **not start** unless every participant in the meeting has explicitly given consent via the `/api/meetings/:id/consent` endpoint or the UI consent screen. This is enforced server-side.

---

## 👥 Team Members (Pre-configured)

| ID | Name | Email |
|---|---|---|
| 1 | Siri | siri@letsmeetiq.app |
| 2 | Tanu | tanu@letsmeetiq.app |
| 3 | Charan | charan@letsmeetiq.app |
| 4 | Anya | anya@letsmeetiq.app |
| 5 | Tulasi | tulasi@letsmeetiq.app |
| 6 | Padma | padma@letsmeetiq.app |

---

## 📋 Test the API Manually

```bash
# Health check
curl http://localhost:4000/api/health

# Get all meetings
curl http://localhost:4000/api/meetings

# Create a meeting
curl -X POST http://localhost:4000/api/meetings \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Meeting","participants":[1,2,3]}'

# Grant consent (replace MEETING_ID)
curl -X POST http://localhost:4000/api/meetings/MEETING_ID/consent \
  -H "Content-Type: application/json" \
  -d '{"memberId":1}'

# Get analytics
curl http://localhost:4000/api/analytics
```

---

Built for Project BHR6 — LetsMeetIQ v1.0

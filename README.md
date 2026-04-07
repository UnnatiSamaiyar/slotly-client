
# 🚀 Slotly — Modern Scheduling & Booking App (Next.js + FastAPI)

Slotly is a **Calendly-like scheduling platform** built using:

| Component | Technology |
|----------|------------|
| Frontend | **Next.js (App Router, TypeScript, TailwindCSS)** |
| Backend API | **FastAPI (Python)** |
| Auth | NextAuth / JWT |
| Database | PostgreSQL |
| Queue & Background Jobs | Redis + Celery (for emails, reminders) |

This architecture is **decoupled**, meaning Frontend and Backend are separate repositories and communicate via REST API.

---

## ✅ Features (MVP)

- User registration & login (JWT-based authentication)
- Create / delete / manage scheduling events
- Generate booking link for public users
- Book slots based on availability
- API-first backend (FastAPI)
- Frontend & backend run independently

---

## 📁 Project Structure (Two Repos)

```
slotly/
├── client   →  Next.js App (UI + NextAuth)
└── server   →  FastAPI Backend (API + DB + Redis queue)
```

---

# 🟦 FRONTEND (Next.js App Router)

### ✅ Setup

```bash
cd client
npm install
```

### ✅ Start Development Server

```bash
npm run dev
```

Frontend will run at:

👉  https://slotly.io/

### ✅ Environment Variables

Create `.env.local` inside `/client`

```
NEXT_PUBLIC_API_URL= https://api.slotly.io
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL= https://slotly.io
```

> ⚠️ `NEXT_PUBLIC_API_URL` must match your FastAPI server.

---

# 🟩 BACKEND (FastAPI + PostgreSQL + Redis + Celery)

### ✅ Setup Python Virtual Environment (Windows PowerShell)

```sh
cd server
uv venv .venv
.venv\Scripts\activate
```

OR (pip alternative):

```sh
python -m venv .venv
.venv\Scripts\activate
```

### ✅ Install dependencies

Using uv:

```sh
uv add fastapi uvicorn[standard] python-dotenv sqlalchemy psycopg2 alembic redis celery
```

or using pip:

```sh
pip install fastapi uvicorn python-dotenv sqlalchemy psycopg2 alembic redis celery
```

---

### ✅ Start Backend

```
uvicorn server.main:app --reload --port 8000
```

Backend API docs:

👉  https://api.slotly.io/docs

---

### ✅ Environment Variables (`server/.env`)

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/slotly
REDIS_URL=redis://localhost:6379
JWT_SECRET=some_long_secret_key
```

---

# 🔥 API Example (Frontend → Backend)

```ts
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

---

# 🧪 Background Jobs (Email, Reminders)

Start Celery worker:

```sh
celery -A server.worker worker --loglevel=info
```

---

# 🐳 Docker (Optional)

Coming soon — docker-compose setup with:

- Next.js
- FastAPI
- Redis
- PostgreSQL

---

# ✅ Deployment

| Component | Platform |
|----------|----------|
| Frontend (Next.js) | Vercel |
| Backend (FastAPI) | Railway / Render |
| PostgreSQL | Neon / Supabase |
| Redis | Upstash |

---

# 🧑‍💻 Contributing

1. Fork repo
2. Create branch `feature-xyz`
3. Commit changes
4. Push
5. Create Pull Request

---

# 📞 Support

For discussions or support, message repo owner.


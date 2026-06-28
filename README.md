# TaskFlow — MERN Stack Task Tracker

A full-stack task management app built with **MongoDB, Express.js, React, and Node.js**.

---

## Features

- **Full CRUD** — Create, Read, Update, Delete tasks
- **Form validation** — Client-side + server-side with clear error messages
- **REST API** — 6 endpoints (GET, POST, PUT, DELETE, PATCH)
- **MongoDB integration** — Mongoose ODM with schema validation
- **Dynamic updates** — No page refresh needed; React state management
- **Responsive UI** — Works on mobile, tablet, and desktop
- **Filters & Search** — Filter by status, priority, real-time search, sort options
- **Quick status toggle** — Change task status inline via dropdown
- **Priority indicators** — Color-coded left border (red/yellow/green)
- **Due date tracking** — Overdue and today badges
- **Stats dashboard** — Live counts for all status buckets

---

## Project Structure

```
task-tracker/
├── backend/
│   ├── controllers/taskController.js   # CRUD logic
│   ├── models/Task.js                  # Mongoose schema
│   ├── routes/taskRoutes.js            # Express routes
│   ├── server.js                       # Entry point
│   ├── .env.example                    # Env vars template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/tasks.js                # Axios API layer
    │   ├── hooks/useTasks.js           # State management hook
    │   ├── components/
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskForm.jsx
    │   │   ├── Filters.jsx
    │   │   ├── Stats.jsx
    │   │   └── EmptyState.jsx
    │   ├── App.jsx
    │   └── index.css
    └── package.json
```

---

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (supports ?status, ?priority, ?search, ?sort) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/status` | Quick status update |
| GET | `/api/health` | Health check |

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier) OR local MongoDB

### 1. Clone and setup backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI in .env
npm run dev     # runs on http://localhost:5000
```

### 2. Setup frontend

```bash
cd frontend
npm install
# Create .env file:
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev     # runs on http://localhost:5173
```

---

## Deployment Guide

### Step 1 — MongoDB Atlas (Database)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) → Create free account
2. Create a **Free Tier** cluster (M0)
3. Under **Database Access** → Add a user with password
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all)
5. Click **Connect** → **Drivers** → Copy the connection string
6. Replace `<password>` with your actual password

### Step 2 — Backend on Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo, select the `backend` folder as root
4. Settings:
   - **Build command:** `npm install`
   - **Start command:** `node server.js`
5. Add **Environment Variables:**
   ```
   MONGO_URI = mongodb+srv://...
   FRONTEND_URL = https://your-app.vercel.app
   PORT = 5000
   ```
6. Deploy → Copy your Render URL (e.g. `https://task-tracker-api.onrender.com`)

### Step 3 — Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Add **Environment Variable:**
   ```
   VITE_API_URL = https://task-tracker-api.onrender.com/api
   ```
4. Deploy → Your app is live!

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Axios, react-hot-toast, lucide-react |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB + Mongoose ODM |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Task Schema

```js
{
  title:       String  (required, 2-100 chars)
  description: String  (optional, max 500 chars)
  status:      enum    ['todo', 'in-progress', 'done']
  priority:    enum    ['low', 'medium', 'high']
  dueDate:     Date    (optional)
  createdAt:   Date    (auto)
  updatedAt:   Date    (auto)
}
```

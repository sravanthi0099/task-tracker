# TaskFlow — MERN Task Tracker

> Full-stack task management app built with MongoDB, Express.js, React.js, and Node.js.
> Submission for **COLL-EDGE CONNECT** Full Stack Developer Intern assignment.

---

## ✨ Features

### Mandatory
- ✅ **Full CRUD** — Create, View, Update & Delete tasks
- ✅ **Form validation** — Client + server side
- ✅ **REST APIs** — Clean Express.js endpoints
- ✅ **MongoDB integration** — Mongoose with indexed queries
- ✅ **Responsive UI** — Works on mobile and desktop
- ✅ **Dynamic updates** — No page refresh needed

### Bonus
- ✅ **JWT Authentication** — Register/Login with secure tokens
- ✅ **Filter tasks** — By status, priority, or search query
- ✅ **Sort tasks** — By date, title, priority, due date
- ✅ **Tags** — Add labels to tasks
- ✅ **Due dates** — With overdue/today alerts
- ✅ **Status cycling** — Click the status dot to progress tasks
- ✅ **Dashboard stats** — Live counters per status
- ✅ **Environment variables** — `.env` for all secrets
- ✅ **Reusable components** — TaskCard, TaskModal, FilterBar, StatsBar, ConfirmDialog

---

## 🗂️ Project Structure

```
task-tracker/
├── backend/
│   ├── models/
│   │   ├── Task.js          # Task schema
│   │   └── User.js          # User schema with bcrypt
│   ├── routes/
│   │   ├── auth.js          # /api/auth/* endpoints
│   │   └── tasks.js         # /api/tasks/* endpoints
│   ├── middleware/
│   │   └── auth.js          # JWT protect middleware
│   ├── server.js            # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskModal.jsx
    │   │   ├── FilterBar.jsx
    │   │   ├── StatsBar.jsx
    │   │   └── ConfirmDialog.jsx
    │   ├── pages/
    │   │   ├── AuthPage.jsx
    │   │   └── Dashboard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   └── useTasks.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Tasks (all require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get tasks (filter/sort/search) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/status` | Quick status update |

#### Query params for GET /api/tasks:
- `status` — `todo` / `in-progress` / `completed`
- `priority` — `low` / `medium` / `high`
- `search` — text search in title, description, tags
- `sortBy` — `createdAt` / `updatedAt` / `dueDate` / `title` / `priority`
- `sortOrder` — `asc` / `desc`

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works fine)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd task-tracker
npm run install:all
```

### 2. Configure backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/tasktracker
JWT_SECRET=pick_a_long_random_string_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Configure frontend

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm start
```

App runs at **http://localhost:3000**

---

## ☁️ Deployment

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo, set **Root Directory** to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables:
   - `MONGODB_URI` — your Atlas URI
   - `JWT_SECRET` — a strong random string
   - `NODE_ENV` — `production`
   - `CLIENT_URL` — your Vercel frontend URL

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL` — your Render backend URL + `/api`
4. Deploy

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, react-hot-toast, date-fns, axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator (server), custom (client) |
| Deployment | Vercel (FE) + Render (BE) + MongoDB Atlas |

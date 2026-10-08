# BB84 QKD Simulator — Vercel & Railway Deployment Guide

This guide provides the complete, step-by-step instructions for deploying the **BB84 Quantum Key Distribution (QKD) Simulator** using **Vercel (Frontend)** and **Railway (Backend)**.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (Vercel)                     │
│         React 18 + Vite + Tailwind CSS + TypeScript     │
│             https://your-app.vercel.app                 │
└────────────────────────────┬────────────────────────────┘
                             │ HTTPS / REST JSON API
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Railway)                     │
│               Python 3 + FastAPI + Uvicorn              │
│          https://your-backend.up.railway.app            │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Step 1: Deploy Backend to Railway

### 1.1 Push to GitHub
Ensure your repository is pushed to GitHub (see [Git Setup](#-git-setup--pushing-to-github) below).

### 1.2 Create New Project on Railway
1. Log in to [railway.app](https://railway.app).
2. Click **"New Project"** $\rightarrow$ **"Deploy from GitHub repo"**.
3. Select your `bb84-qkd-simulator` repository.

### 1.3 Configure Root Directory & Build Settings
1. In the Railway dashboard, click on your service $\rightarrow$ **Settings**.
2. Set **Root Directory** to: `backend`.
3. Railway will automatically detect:
   - **Build System**: Nixpacks / Python
   - **Requirements**: `backend/requirements.txt`
   - **Start Command**: `web: uvicorn main:app --host 0.0.0.0 --port $PORT` (from `backend/Procfile`)

### 1.4 Generate Public Domain
1. In service **Settings** $\rightarrow$ scroll to **Networking** / **Public Networking**.
2. Click **"Generate Domain"**.
3. Copy your live backend URL (e.g., `https://bb84-backend-production.up.railway.app`).
4. Test the health check in your browser:
   `https://your-backend.up.railway.app/` $\rightarrow$ `{"status": "online"}`.

---

## ⚡ Step 2: Deploy Frontend to Vercel

### 2.1 Import Project into Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **"Add New..."** $\rightarrow$ **"Project"**.
3. Select your GitHub repository.

### 2.2 Configure Project Settings
1. **Framework Preset**: `Vite` (Auto-detected).
2. **Root Directory**: Click *Edit* and select **`frontend`**.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 2.3 Set Environment Variable
Under **Environment Variables**, add:
- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://your-backend.up.railway.app` *(paste your Railway URL from Step 1)*

### 2.4 Deploy
Click **"Deploy"**. Vercel will build and launch your application with global edge distribution at `https://your-project.vercel.app`.

---

## 🔄 Step 3: Verify Full-Stack Connection

1. Open your live Vercel URL.
2. Open the browser Developer Tools (**Console** & **Network** tabs).
3. Click **"▶ Run Simulation"**.
4. In the console log and network requests, you will see successful `POST` calls to:
   `https://your-backend.up.railway.app/api/simulate` returning the complete quantum state payload.

---

## 💻 Local Development Commands

To run both services locally on your computer:

### Terminal 1: Backend
```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn main:app --reload --port 8000
```
- API URL: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/docs`

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```
- Web UI: `http://localhost:3000`

---

## 🐙 Git Setup & Pushing to GitHub

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all files
git add .

# 3. Commit changes
git commit -m "Configure frontend (Vercel) and backend (Railway) structure"

# 4. Set main branch
git branch -M main

# 5. Link to your GitHub remote repository (replace with your GitHub URL)
git remote add origin https://github.com/<your-username>/bb84-qkd-simulator.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 🛠️ Troubleshooting Matrix

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **CORS Error** | Frontend origin blocked by backend | `backend/main.py` is configured with `allow_origins=["*"]`. Ensure Railway service is active. |
| **404 on page refresh** | Single Page Application (SPA) routing | `frontend/vercel.json` contains `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`. |
| **Railway Port Error** | Hardcoded port in backend | `backend/Procfile` uses `--port $PORT` which automatically binds to Railway's dynamic port. |
| **Offline fallback** | Backend sleeping or unreachable | `frontend/src/lib/api.ts` automatically executes client-side fallback simulation seamlessly if backend is offline. |

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).

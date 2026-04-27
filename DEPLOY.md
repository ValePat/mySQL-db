# Deployment Guide

This guide explains how to deploy the React Jobs project for free using **MongoDB Atlas**, **Render**, and **Vercel**.

## 1. Database: MongoDB Atlas (Free)
1.  **Sign Up:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  **Create Cluster:** Select the **M0 Free** tier.
3.  **Network Access:** Go to "Network Access" and click **Add IP Address**. Choose "Allow Access from Anywhere" (0.0.0.0/0) so Render can connect.
4.  **Database User:** Create a user with a password.
5.  **Connection String:** Click **Connect** -> **Drivers**. Copy the connection string. It should look like:
    `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

## 2. Backend: Render (Free)
1.  **Sign Up:** Connect your GitHub account to [Render](https://render.com/).
2.  **New Web Service:** Select your repository.
3.  **Configure:**
    *   **Name:** `react-jobs-api`
    *   **Root Directory:** `srv`
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node authSrv.js` (Note: In this project, `authSrv.js` imports `app.js` which contains both auth and jobs routes).
4.  **Environment Variables:** Add the following:
    *   `DB_URI`: Your MongoDB connection string.
    *   `ACCESS_TOKEN_SECRET`: A random long string.
    *   `REFRESH_TOKEN_SECRET`: Another random long string.
    *   `PORT`: `3000`
5.  **Wait for Deploy:** Copy the URL provided by Render (e.g., `https://react-jobs-api.onrender.com`).

## 3. Frontend: Vercel (Free)
1.  **Sign Up:** Connect your GitHub account to [Vercel](https://vercel.com/).
2.  **New Project:** Select your repository.
3.  **Configure:**
    *   **Root Directory:** `ui`
    *   **Framework Preset:** `Vite`
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
4.  **Rewrite Rules:** To keep the `/api` calls working, create a `vercel.json` file in your `ui/` folder before deploying (see "Code Changes" below).

---

## 4. Necessary Code Changes

### A. CORS Configuration
Update `srv/src/app.js` to allow your Vercel URL.
```javascript
// srv/src/app.js
app.use(cors({
  origin: 'https://your-frontend-name.vercel.app', // REPLACE WITH YOUR VERCEL URL
  credentials: true
}));
```

### B. Vercel Proxy
Create `ui/vercel.json` to route frontend API calls to Render.
```json
{
  "rewrites": [
    {
      "source": "/api/jobs/:path*",
      "destination": "https://your-backend-name.onrender.com/jobs/:path*"
    },
    {
      "source": "/api/auth/:path*",
      "destination": "https://your-backend-name.onrender.com/auth/:path*"
    }
  ]
}
```

## Summary of URLs
| Service | Provider | URL Example |
| :--- | :--- | :--- |
| **Frontend** | Vercel | `https://react-jobs.vercel.app` |
| **Backend** | Render | `https://react-jobs-api.onrender.com` |
| **Database** | MongoDB Atlas | `mongodb+srv://...` |

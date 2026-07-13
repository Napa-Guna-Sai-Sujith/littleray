# Deployment Guide: Next.js on Vercel/Render & Neon Database

This guide explains how to deploy your Next.js application on **Vercel** or **Render** and connect it to your serverless **Neon** PostgreSQL database.

---

## Step 1: Push Code to GitHub
We have already pushed your working code to your repository:
[Napa-Guna-Sai-Sujith/littleray](https://github.com/Napa-Guna-Sai-Sujith/littleray)

Every time you make changes locally and push them to this repository, your hosting service (Vercel or Render) will automatically detect them and trigger a new deployment.

---

## Step 2: Option A — Deploy Frontend to Vercel (Recommended)

1. Go to [Vercel](https://vercel.com) and sign in using your **GitHub** account.
2. Click the **Add New...** button and select **Project**.
3. Import the `Napa-Guna-Sai-Sujith/littleray` repository from the list.
4. In the **Configure Project** screen, expand the **Environment Variables** section.
5. Add the following environment variables:

   | Name | Value | Description |
   |------|-------|-------------|
   | `DATABASE_URL` | `postgresql://neondb_owner:...` | The full connection string (use `sslmode=verify-full` as configured). |
   | `JWT_SECRET` | *(Any secure random string)* | Secret string used to sign session cookies. |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Replace this with your actual Vercel deployment URL or custom domain. |

6. Click **Deploy**. Vercel will build and publish your Next.js application in about 1-2 minutes.

---

## Step 3: Option B — Deploy Website as a Web Service on Render

If you prefer to host the entire Next.js website on Render as a **Web Service**:

1. Log in to [Render](https://render.com).
2. Click the **New +** button and select **Web Service**.
3. Connect your **GitHub** account and select the `Napa-Guna-Sai-Sujith/littleray` repository.
4. Configure the Web Service settings:
   - **Name**: `littleray` (or your choice)
   - **Language/Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
5. Click **Advanced** to add **Environment Variables**:
   - Add `DATABASE_URL` with your database connection string (either your Neon connection string or Render PostgreSQL string).
   - Add `JWT_SECRET` with a secure random string.
   - Add `NEXT_PUBLIC_SITE_URL`:
     > [!TIP]
     > **How to get the URL before deploying:** 
     > On Render, your default URL will be `https://<web-service-name>.onrender.com` (using the Name you typed in Step 4). For example, if you name your service `littleray-interiors`, your URL will be `https://littleray-interiors.onrender.com`.
     > If you are unsure, you can temporarily add `https://localhost:3000` as a placeholder, let the first deploy finish, copy the generated URL from your Render dashboard, update this variable in Settings, and click **Clear Cache and Deploy** to redeploy.
6. Click **Create Web Service**. Render will install dependencies, build the Next.js production build, and launch the server.

---

## Step 4: Database Hosting (Neon vs Render)

You currently have your database running on **Neon** (`aws.neon.tech`). Neon is ideal for serverless Next.js apps because:
- It automatically scales down when inactive (saving cost).
- It handles heavy concurrent connections from serverless functions.

### If you want to move your Database to Render:
If you specifically want to host your database on **Render**:
1. Log in to [Render](https://render.com).
2. Click **New +** and select **PostgreSQL**.
3. Create the database and copy the **External Connection String**.
4. Run migrations locally to set up tables:
   ```bash
   # Temporarily swap DATABASE_URL in .env to the Render string, then run:
   npx drizzle-kit push --force
   npm run seed
   ```
5. Update the `DATABASE_URL` environment variable inside your Vercel or Render environment settings to point to the new Render connection string.

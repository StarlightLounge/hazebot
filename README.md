# HazeBot Web Dashboard

This is a premium [Next.js](https://nextjs.org/) web application built for the HazeBot Discord community. It features a stunning dark-mode interface, glassmorphism UI elements, and a fully functional Discord OAuth2 authentication system.

## 🚀 Getting Started Locally

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔐 Discord Authentication Setup

To enable real Discord logins, you need to configure your environment variables:
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Create an application and navigate to the **OAuth2** tab.
3. Add a redirect URI: `http://localhost:3000/api/auth/callback/discord` (For production, use your Vercel URL, e.g., `https://your-site.vercel.app/api/auth/callback/discord`).
4. Copy your `Client ID` and `Client Secret`.
5. Rename the `.env.local` file in this repository (or create one) and add:

```env
DISCORD_CLIENT_ID="your_client_id"
DISCORD_CLIENT_SECRET="your_client_secret"
NEXTAUTH_SECRET="a_random_secure_string_here"
NEXTAUTH_URL="http://localhost:3000"
```

## 🌍 Deploying to Vercel & GitHub

The recommended way to host this application is through Vercel, using GitHub as your backup and source control.

### Step 1: Push to GitHub (Your Backup)
1. Create a new empty repository on your [GitHub](https://github.com/) account.
2. In your terminal, inside the `hazebot-app` folder, run:
```bash
git add .
git commit -m "Initial HazeBot App setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```
*Now your code is safely backed up on GitHub!*

### Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com/) and sign in with your GitHub account.
2. Click **"Add New..." > "Project"**.
3. Import the GitHub repository you just created.
4. Before clicking Deploy, expand the **Environment Variables** section and add your Discord credentials:
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (Set this to your production URL, e.g., `https://hazebot.vercel.app`)
5. Click **Deploy**.

Vercel will now automatically build and update your live website every time you push new changes to GitHub!

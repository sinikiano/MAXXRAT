# MAXXRAT Web Panel - Vercel Deployment Guide

## 🚀 Deploy to Vercel

This guide will help you deploy the MAXXRAT Web Panel to Vercel for free hosting.

### Method 1: Deploy from GitHub (Recommended)

1. **Connect your GitHub repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Import Project"
   - Search for and select your `MAXXRAT` repository

2. **Configure the project:**
   - **Framework Preset:** Select "Other" or leave as auto-detect
   - **Root Directory:** Leave empty (deploys from root)
   - **Build Command:** Leave empty (static site)
   - **Output Directory:** Leave empty

3. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `https://your-project-name.vercel.app`

### Method 2: Deploy using Vercel CLI

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Deploy from project root:**

   ```bash
   cd /path/to/your/maxxrat/project
   vercel --prod
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Select your team
   - The CLI will automatically detect the configuration

### Method 3: Manual Upload

1. **Compress the WEB PANEL folder:**
   - Create a ZIP file of the `WEB PANEL` directory
   - Name it `maxxrat-web-panel.zip`

2. **Upload to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Drag and drop your ZIP file
   - Configure as static site

## 📋 Configuration Files

The following files have been created for Vercel deployment:

- `vercel.json` - Vercel configuration with routing and security headers
- `package.json` - Project metadata and scripts

## 🔒 Security Features

The deployment includes:

- Content Security Policy headers
- XSS protection
- Frame options protection
- Referrer policy configuration

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## 🔧 Environment Variables

If you need to configure Supabase credentials:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add your Supabase URL and API keys

## 📊 Monitoring

Monitor your deployment:

- View analytics in Vercel dashboard
- Check deployment logs for errors
- Monitor performance metrics

## 🆘 Troubleshooting

**Common Issues:**

- **404 Errors:** Check that all file paths are correct
- **Assets not loading:** Ensure relative paths are used
- **Build failures:** Check Vercel deployment logs

**Support:**

- Vercel Documentation: <https://vercel.com/docs>
- MAXXRAT Issues: Create an issue in the GitHub repository

---

**Note:** This deployment is for the web panel only. The Android application and server components require separate deployment.

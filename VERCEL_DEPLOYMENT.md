# Vercel Deployment Guide

This guide will help you deploy the RocketRoll UI application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your repository pushed to GitHub, GitLab, or Bitbucket
- Environment variables ready (see below)

## Deployment Steps

### 1. Connect Your Repository

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Vite configuration

### 2. Configure Environment Variables

In your Vercel project settings, add the following environment variables:

#### Required Environment Variables:

- `VITE_API_BASE_URL` - Your API base URL (e.g., `https://api.yourdomain.com` or `http://localhost:3000` for development)
- `VITE_GOOGLE_MAPS_API_KEY` - Your Google Maps API key

#### Optional Environment Variables:

- `VITE_PORT` - Development server port (only needed for local development, not for Vercel deployment)

### 3. Build Configuration

Vercel will automatically detect the Vite framework and use:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

The `vercel.json` file in the project root provides additional configuration for SPA routing.

### 4. Deploy

1. After connecting the repository and setting environment variables, click "Deploy"
2. Vercel will build and deploy your application
3. You'll get a preview URL (e.g., `your-project.vercel.app`)

## Environment-Specific Configuration

### Production Environment

For production, set these in Vercel's Environment Variables:

```
VITE_API_BASE_URL=https://api.yourproductiondomain.com
VITE_GOOGLE_MAPS_API_KEY=your_production_google_maps_api_key
```

### Preview/Development Environments

You can override variables for preview deployments in Vercel's dashboard under:
**Settings → Environment Variables**

## Important Notes

1. **Environment Variables**: All environment variables prefixed with `VITE_` are exposed to the client-side code. Never put sensitive secrets in `VITE_*` variables.

2. **API CORS**: Make sure your backend API allows requests from your Vercel domain. Update CORS settings to include:
   - `https://your-project.vercel.app`
   - `https://your-project-git-branch.vercel.app` (for preview deployments)

3. **Google Maps API**: Update your Google Maps API key restrictions in Google Cloud Console to allow:
   - `https://*.vercel.app/*` (for all Vercel deployments)
   - Or specific domains: `https://your-project.vercel.app/*`

4. **Build-Time Variables**: Environment variables are embedded at build time. After changing environment variables in Vercel, you need to redeploy for changes to take effect.

5. **SPA Routing**: The `vercel.json` configuration ensures all routes are handled by your React app (required for React Router).

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node.js 18.x by default)
- Check build logs in Vercel dashboard

### API Calls Fail

- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS settings on your backend API
- Ensure API is accessible from Vercel's servers

### Google Maps Not Loading

- Verify `VITE_GOOGLE_MAPS_API_KEY` is set correctly
- Check API key restrictions in Google Cloud Console
- Ensure Maps JavaScript API and Places API are enabled

### Routing Issues

- Ensure `vercel.json` includes the rewrites configuration
- Check that React Router is configured correctly

## Custom Domain

To use a custom domain:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update Google Maps API key restrictions to include your custom domain

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Every push to your main/master branch
- **Preview**: Every push to other branches and pull requests

Each deployment gets its own unique URL for testing.


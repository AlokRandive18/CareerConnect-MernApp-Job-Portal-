# Render Backend Deployment Guide

Your backend deployment configuration is ready. Follow these steps to deploy on Render:

## Quick Deploy (2 minutes)

1. **Go to Render**: https://render.com/
2. **Sign in with GitHub** (or create account if new)
3. **Click "New +"** → **"Blueprint"**
4. **Paste your repository URL**:
   ```
   https://github.com/AlokRandive18/CareerConnect-MernApp-Job-Portal-
   ```
5. **Render will auto-detect** `render.yaml` and show the service config
6. **Click "Create Resources"** and wait (~3-5 minutes for deployment)

## Pre-configured Environment Variables

The `render.yaml` file already includes:
- ✅ **NODE_ENV**: `production`
- ✅ **MONGODB_URI**: Your MongoDB Atlas connection string (from `.env`)
- ✅ **JWT_SECRET**: Secure random token generated for production
- ✅ **PORT**: 10000 (Render will assign dynamically)
- ✅ **CORS_ORIGIN**: https://careerconnect-alokrandive18.netlify.app

## After Deployment

Once Render shows your service is live, you'll get a URL like:
```
https://careerconnect-backend.onrender.com
```

### Update Frontend with Backend URL

1. Go to **Netlify Dashboard**: https://app.netlify.com/projects/careerconnect-alokrandive18/settings/deploys
2. Navigate to **Build & deploy** → **Environment**
3. **Update the environment variable**:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://careerconnect-backend.onrender.com/api`
4. Click **Save** and **Trigger deploy**

### Test the Connection

Once both frontend and backend are deployed and reconnected:
- Visit: https://careerconnect-alokrandive18.netlify.app
- Login/Register to test the full stack
- Upload a resume in AI Job Suggester to verify backend API calls

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection timeout | Ensure MongoDB Atlas allows Render IP in Network Access (set to `0.0.0.0/0` for testing) |
| Deployment fails | Check Render logs in dashboard; ensure `render.yaml` is in repo root |
| Frontend can't reach backend | Verify `VITE_API_BASE_URL` is set on Netlify and includes `/api` suffix |
| 502 Bad Gateway | Backend may still be starting (free tier is slow); wait 30s and refresh |

## Environment Variables Reference

If you need to update any variable later in Render:

| Key | Current Value |
|-----|---------------|
| NODE_ENV | production |
| MONGODB_URI | mongodb+srv://alok_db_user:Alok6807@cluster0.bkv6xsp.mongodb.net/mernapp?retryWrites=true&w=majority&appName=Cluster0 |
| JWT_SECRET | mJmQwuFlApsSjRIHAFrM5fvTp3wFQM/H4TggsuYetHI= |
| CORS_ORIGIN | https://careerconnect-alokrandive18.netlify.app |
| PORT | 10000 |

---

**Status**: ✅ Ready to deploy on Render

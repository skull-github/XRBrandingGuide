# Deployment Instructions

## Repository Information
- **Correct Repository**: https://github.com/skull-github/XRBrandingGuide
- **Latest Commit**: db6c3e8
- **Branch**: main

## Vercel Configuration
- **Framework**: Vite
- **Root Directory**: ./
- **Build Command**: npm run build
- **Output Directory**: dist
- **Install Command**: npm install

## Files Structure (Root Level)
✅ package.json - Dependencies and scripts
✅ index.html - Entry point  
✅ src/ - React app source code
✅ vite.config.js - Vite configuration
✅ vercel.json - Deployment settings
✅ dist/ - Build output (after npm run build)

## Issue Resolution
If Vercel shows wrong repository (iamdavidsantana/xr-branding-guide):
1. Delete the Vercel project completely
2. Create new project from scratch
3. Import from skull-github/XRBrandingGuide
4. Ensure branch is set to 'main'

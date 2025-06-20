# MLB XR Branding Guide v1.6

A comprehensive branding guide application for MLB teams, featuring interactive color swatches, logos, player rosters, and MLB.TV assets.

## 🚀 Live Demo
- **Production**: `https://your-app-name.vercel.app` (update after deployment)
- **Preview**: Automatic preview deployments for each commit

## ✨ Features
- Interactive team cards with collapsible content
- Baseball-themed sound effects and tooltips
- Live MLB roster integration
- Color swatch click-to-copy functionality
- Comprehensive asset galleries (logos, wordmarks, MLB.TV)
- Responsive design with smooth animations
- All-Stars sections (AL/NL)

## 🛠 Tech Stack
- **Frontend**: React 19, Vite 6
- **Styling**: CSS-in-JS with inline styles
- **Data**: MLB Stats API, MLB Branding JSON API
- **Deployment**: Vercel (auto-deploy from GitHub)
- **Desktop**: Electron (optional)

## 📦 Deployment

### Automatic Deployment (Vercel + GitHub)
1. Push changes to `main` branch
2. Vercel automatically builds and deploys
3. Live site updates within minutes

### Manual Local Build
```bash
npm install
npm run build
npm run preview
```

## 🔧 Development
```bash
npm install
npm run dev
```
Open [http://localhost:5174](http://localhost:5174)

## 📊 Data Sources
- **Team Branding**: `https://storage.mobile.mlbinfra.com/atbatconfig/branding.json`
- **Player Rosters**: `https://statsapi.mlb.com/api/v1/teams/[TEAM_ID]/roster/Active`
- **Team Images**: MLB Static Image CDN

## 🎨 UI/UX Features
- Left-aligned content layout
- Consistent white text on dark backgrounds
- Circular color swatches with hover effects
- Interactive tooltips with dynamic positioning
- Baseball-themed audio feedback
- Smooth reveal/hide animations

## 📱 Responsive Design
- Mobile-friendly responsive layout
- Optimized for desktop and tablet viewing
- Touch-friendly interactive elements

## 🔐 Environment
- No API keys required (uses public MLB APIs)
- CORS-enabled endpoints
- Production-ready build configuration

## 📄 License
Internal use only. All MLB trademarks and content are property of Major League Baseball.

---

## Previous Version Documentation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5174`

### Building for Production
```bash
npm run build
```

### Electron Desktop App
Run in Electron development mode:
```bash
npm run electron:dev
```

Build Electron app for distribution:
```bash
npm run electron:package
```

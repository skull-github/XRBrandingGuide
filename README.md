# MLB XR Branding Guide

MLB API driven branding assets for Extended Reality applications. A comprehensive React-based tool for accessing official MLB team branding, colors, logos, and game data.

<!-- Auto-deployment test - webhook configured -->

## 🎯 **Project Overview**

The MLB XR Branding Guide is a modern React application that provides developers with easy access to official MLB branding assets, team data, and live game information. Built specifically for Extended Reality (XR) applications, it features a clean interface for browsing team assets, colors, and real-time game data.

### **✨ Key Features**
- **Official MLB spot colors** for all 30 teams
- **Live game carousel** with logo-vs-logo design
- **Team-specific branding assets** (logos, wordmarks, colors)
- **Real-time game data** and schedules
- **Player roster information** and statistics
- **Responsive design** optimized for all devices
- **Secure deployment workflow** with password protection

## 🏗️ **Technical Architecture**

### **📦 Core Dependencies**

#### **Production (3 dependencies)**
```json
{
  "react": "^19.1.0",           // Core React framework (latest)
  "react-dom": "^19.1.0",       // React DOM renderer
  "papaparse": "^5.5.3"         // CSV parsing for Google Sheets data
}
```

#### **Development (9 dependencies)**
```json
{
  "vite": "^6.3.5",                          // Modern build tool
  "@vitejs/plugin-react": "^4.4.1",          // Vite React integration
  "eslint": "^9.25.0",                       // Code linting
  "@eslint/js": "^9.25.0",                   // ESLint core rules
  "eslint-plugin-react-hooks": "^5.2.0",     // React Hooks linting
  "eslint-plugin-react-refresh": "^0.4.19",  // Fast Refresh linting
  "globals": "^16.0.0",                      // Global variables
  "@types/react": "^19.1.2",                 // TypeScript React types
  "@types/react-dom": "^19.1.2"              // TypeScript React DOM types
}
```

### **🌐 External APIs & Services**

#### **MLB Official APIs**
1. **MLB Stats API** (`statsapi.mlb.com`)
   - Team rosters and player data
   - Game schedules and live scores
   - Season statistics and metrics

2. **MLB Image CDN** (`img.mlbstatic.com`)
   - Official team logos (spot, cap, wordmarks)
   - Player photos (headshots, action shots)
   - Responsive image optimization

3. **MLB Mobile Infrastructure** (`storage.mobile.mlbinfra.com`)
   - Complete branding configuration
   - MLB.TV assets and backgrounds

4. **Google Sheets Integration**
   - Team metadata and configuration
   - CSV export for dynamic data updates

### **📁 Custom Module System**

#### **Utilities (`src/utils/`)**
- **`spotColorMapping.js`** - Official MLB team spot colors (hex values)
- **`teamColorReference.js`** - Comprehensive team color reference
- **`teamUtils.js`** - Team organization and division logic
- **`audio.js`** - Web Audio API integration for UI sounds
- **`spotColorTest.js`** - Color mapping validation utility

#### **Components (`src/components/`)**
- **`MLBSchedule.jsx`** - Live games schedule with spotlight design
- **`GameCarousel.jsx`** - Team-specific horizontal game carousel
- **`AnchorMenu.js`** - Division-based team navigation
- **`UI/CommonComponents.js`** - Reusable UI components

#### **Hooks (`src/hooks/`)**
- **`useTeamData.js`** - Custom hooks for team data and spot colors

#### **Data Assets**
- **`team-extras.json`** - Additional team metadata
- **Configuration files** - Various JSON configurations

### **🎨 Styling & UI Architecture**

- **No CSS Framework** - Pure CSS with strategic inline styles
- **Dark Theme** - Custom MLB-inspired color palette
- **System Fonts** - Native font stack (system-ui, Avenir, Helvetica)
- **Responsive Design** - Mobile-first approach
- **Component-Scoped Styles** - Mix of CSS classes and React inline styles

### **🚀 Build & Deployment**

#### **Build System**
- **Vite** - Modern, fast bundler with HMR
- **Code Splitting** - Separate chunks for vendor and utilities
- **Output Directory** - `dist/` for production builds
- **Source Maps** - Disabled for production

#### **Deployment Platform**
- **Vercel** - Serverless deployment platform
- **SPA Configuration** - Single-page app routing
- **Automatic Deployments** - Git-based workflow

### **🔧 Development Workflow**

#### **Branch Strategy**
- **MAIN** - Default development branch (daily work)
- **STABLE** - Production branch (password-protected)

#### **Deployment Scripts**
```bash
./deploy-main.sh      # Quick deploy to main (no password)
./deploy-stable.sh    # Secure deploy to stable (password: 3333)
```

#### **Code Quality**
- **ESLint** - JavaScript/React linting
- **React Hooks Rules** - Hook usage validation
- **Fast Refresh** - Hot module replacement

### **🎵 Audio System**
- **Web Audio API** - Native browser audio capabilities
- **Interactive Sounds** - Hover and click feedback
- **User Gesture Activation** - Proper audio context management

### **📊 Performance Features**
- **Lazy Loading** - Components loaded on demand
- **Image Optimization** - MLB CDN with responsive sizing
- **Memoization** - React hooks for performance
- **Minimal Dependencies** - Lean dependency tree

## 🎯 **Project Stats**

- **Total Dependencies**: 12 (3 production + 9 development)
- **External APIs**: 4 (MLB Stats, Images, Mobile, Google)
- **Custom Modules**: 10+ utilities, components, and hooks
- **Configuration Files**: 5 (Vite, Vercel, ESLint, Package, Git)
- **Architecture**: Modern React SPA with minimal footprint

## 🔐 **Security Features**

- **Password-Protected Deployments** - Stable branch security
- **Environment Separation** - Development vs production workflows
- **Secure API Integration** - Proper error handling and validation

## 📱 **Browser Compatibility**

- **Modern Browsers** - Chrome, Firefox, Safari, Edge
- **Mobile Responsive** - iOS and Android optimization
- **Web Audio API** - Enhanced with graceful fallbacks

---

**Built with ⚾ for the MLB XR ecosystem**

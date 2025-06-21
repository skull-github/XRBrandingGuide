# MLB XR Branding Guide

MLB API driven branding assets for Extended Reality applications. A comprehensive React-based tool for accessing official MLB team branding, colors, logos, and game data.

<!-- Auto-deployment test - webhook configured -->

## 🎯 **Project Overview**

The MLB XR Branding Guide is a modern React application that provides developers with easy access to official MLB branding assets, team data, and live game information. Built specifically for Extended Reality (XR) applications, it features a clean interface for browsing team assets, colors, and real-time game data.

### **✨ Key Features**
- **Official MLB spot colors** for all 30 teams (official hex values)
- **Live game carousel** with horizontal logo-vs-logo design
- **Team-specific branding assets** (logos, wordmarks, colors)
- **Real-time game data** and schedules
- **Player roster information** and statistics
- **Responsive design** optimized for all devices
- **Secure deployment workflow** with password protection
- **TeamGameCarousel component** with modern UI design

## 🚀 **Quick Start**

### **Development**
```bash
npm install
npm run dev
```

### **Build**
```bash
npm run build
npm run preview
```

### **Deploy**
```bash
./deploy-main.sh      # Quick deploy to main (no password)
./deploy-stable.sh    # Secure deploy to stable (password: 3333)
```

### **📚 Documentation Site**
```bash
# View interactive documentation
open docs/index.html

# Auto-sync documentation with README
cd docs && npm run sync

# Serve documentation locally
cd docs && npm run serve
# Visit http://localhost:8080

# Deploy documentation
cd docs && ./deploy-docs.sh
```

## 🏗️ **Development Workflow & Branch Strategy**

### **🔄 Branch Strategy**

#### **MAIN Branch (Default Working Branch)**
- ✅ **Primary development branch**
- ✅ **Always work here by default**
- ✅ **All new features and changes**
- ✅ **Quick iterations and testing**

#### **STABLE Branch (Production Branch)**
- 🔐 **Password-protected deployments only**
- 🎯 **Stable, tested features only**
- 📦 **Production-ready releases**

### **🚀 Deployment Scripts**

#### **Quick Deploy to Main** (`./deploy-main.sh`)
```bash
./deploy-main.sh
```
- **No password required**
- **Fast deployment for development**
- **Use this for regular development pushes**

#### **Secure Deploy to Stable** (`./deploy-stable.sh`)
```bash
./deploy-stable.sh
```
- **Password required**: `3333`
- **Final confirmation required**: `yes`
- **Use this for production releases only**

### **📋 Recommended Daily Workflow**

#### **Daily Development:**
1. **Work on MAIN branch** (default)
2. **Make changes and commit**
3. **Push to main**: `./deploy-main.sh`
4. **Continue development`

#### **Production Release:**
1. **Ensure all changes are on MAIN**
2. **Test thoroughly**
3. **Deploy to stable**: `./deploy-stable.sh`
4. **Enter password**: `3333`
5. **Confirm deployment**: `yes`

### **🛡️ Security Features**
- **Stable branch**: Protected with password "3333"
- **Main branch**: Open for development
- **All deployments**: Logged with timestamps
- **Environment Separation** - Development vs production workflows
- **Secure API Integration** - Proper error handling and validation

## 🎨 **MLB Team Spot Colors**

### **Official Spot Color Mapping**

The application uses official MLB team spot colors (primary brand colors used behind logos). These are different from secondary colors and ensure consistent branding throughout the application.

#### **Usage Examples**

```javascript
import { getTeamSpotColor } from './src/utils/spotColorMapping';

// Get spot color for a team
const yankeeSpotColor = getTeamSpotColor(147); // Returns: #132448
const dodgerSpotColor = getTeamSpotColor(119); // Returns: #005A9C
```

#### **React Hook Integration**

```javascript
import { useTeamSpotColor } from './src/hooks/useTeamData';

function TeamComponent({ teamId }) {
  const spotColor = useTeamSpotColor(teamId);
  
  return (
    <div style={{ backgroundColor: spotColor }}>
      Team content with official spot color background
    </div>
  );
}
```

#### **All Available Functions**

```javascript
import { 
  getTeamSpotColor, 
  getAllTeamSpotColors, 
  hasTeamSpotColor 
} from './src/utils/spotColorMapping';

// Get spot color for a specific team
getTeamSpotColor(147); // #132448

// Check if a team has a spot color defined
hasTeamSpotColor(147); // true
hasTeamSpotColor(999); // false

// Get all teams with their spot colors
getAllTeamSpotColors(); // Array of {teamId, spotColor} objects
```

### **Complete Spot Color Reference**

#### **American League East**
- **110: Baltimore Orioles** - `#df4601` (Orange)
- **111: Boston Red Sox** - `#0d2b56` (Navy)
- **147: New York Yankees** - `#132448` (Navy)
- **139: Tampa Bay Rays** - `#8fbce6` (Light Blue)
- **141: Toronto Blue Jays** - `#134a8e` (Blue)

#### **American League Central**
- **145: Chicago White Sox** - `#333333` (Gray)
- **114: Cleveland Guardians** - `#002b5c` (Navy)
- **116: Detroit Tigers** - `#0c2c56` (Navy)
- **118: Kansas City Royals** - `#004687` (Blue)
- **142: Minnesota Twins** - `#002b5c` (Navy)

#### **American League West**
- **117: Houston Astros** - `#eb6e1f` (Orange)
- **108: Los Angeles Angels** - `#862633` (Red)
- **133: Oakland Athletics** - `#003831` (Green)
- **136: Seattle Mariners** - `#0c2c56` (Navy)
- **140: Texas Rangers** - `#003278` (Blue)

#### **National League East**
- **144: Atlanta Braves** - `#0c2340` (Navy)
- **146: Miami Marlins** - `#00a3e0` (Blue)
- **121: New York Mets** - `#002d72` (Navy)
- **143: Philadelphia Phillies** - `#e81828` (Red)
- **120: Washington Nationals** - `#ab0003` (Red)

#### **National League Central**
- **112: Chicago Cubs** - `#0e3386` (Blue)
- **113: Cincinnati Reds** - `#c6011f` (Red)
- **158: Milwaukee Brewers** - `#13294b` (Navy)
- **134: Pittsburgh Pirates** - `#333333` (Gray)
- **138: St. Louis Cardinals** - `#be0a14` (Red)

#### **National League West**
- **109: Arizona Diamondbacks** - `#aa182c` (Red)
- **115: Colorado Rockies** - `#33006f` (Purple)
- **119: Los Angeles Dodgers** - `#005a9c` (Blue)
- **135: San Diego Padres** - `#ffc425` (Yellow)
- **137: San Francisco Giants** - `#fd5a1e` (Orange)

#### **Additional Teams**
- **159: Team 159** - `#bc0022` (Red)
- **160: Team 160** - `#041e42` (Navy)

### **Important Spot Color Notes**

1. **Spot Colors vs Secondary Colors**: These are the official spot colors, not the secondary colors from the BigData API. The spot color is the primary brand color used behind team logos and in branded elements.

2. **Future Reference**: This mapping should be used throughout the application instead of trying to extract colors from images or using secondary colors from the API.

3. **Consistency**: All components using team colors should use this mapping to ensure consistent branding across the application.

4. **Testing**: Run the test utilities in `src/utils/spotColorTest.js` to validate the mapping after any changes.

### **Components Updated for Spot Colors**

The following components have been updated to use the official spot color mapping:

- `/src/components/MLBSchedule.jsx` - Schedule cards now use official spot colors
- `/src/components/AnchorMenu.js` - Team buttons use official spot colors  
- `/src/hooks/useTeamData.js` - React hooks now use the mapping
- `/src/App.jsx` - Main app components use the mapping
- `/src/components/GameCarousel.jsx` - Team game carousel uses spot colors

This ensures consistent, official MLB branding throughout the entire application.

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

## 🔗 **MLB API Endpoints & JSON Index**

### **MLB Branding API**
Team branding, colors, logos, wordmarks, MLB.TV assets, and All-Star teams.
- `https://storage.mobile.mlbinfra.com/atbatconfig/branding.json` - Complete branding data

### **MLB Stats API**
Player statistics, team rosters, game data, and advanced metrics.
- `https://statsapi.mlb.com/api/v1/teams` - All teams list
- `https://statsapi.mlb.com/api/v1/teams/[TEAM_ID]/roster/Active` - Active team roster
- `https://statsapi.mlb.com/api/v1/people/[PLAYER_ID]` - Player details
- `https://statsapi.mlb.com/api/v1/people/[PLAYER_ID]/stats?stats=season&group=hitting&season=[YEAR]` - Season hitting stats
- `https://statsapi.mlb.com/api/v1/people/[PLAYER_ID]/stats?stats=statcast&group=hitting&season=[YEAR]` - Statcast metrics
- `https://statsapi.mlb.com/api/v1/people/[PLAYER_ID]/stats?stats=metricAverages&group=hitting&season=[YEAR]&metrics=launchSpeed,distance,launchAngle` - Advanced hitting metrics
- `https://statsapi.mlb.com/api/v1/people/[PLAYER_ID]/stats?stats=season&group=pitching&season=[YEAR]` - Season pitching stats

### **MLB Schedule API**
Game schedules, live game data, and calendar information.
- `https://statsapi.mlb.com/api/v1/schedule?sportId=1&startDate=[DATE]&endDate=[DATE]` - Games by date range
- `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=[TEAM_ID]&startDate=[DATE]&endDate=[DATE]` - Team schedule
- `https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&startDate=[DATE]&endDate=[DATE]&teamId=[TEAM_ID]&hydrate=linescore,team` - Live game context
- `https://statsapi.mlb.com/api/v1/game/[GAME_PK]/linescore` - Live game score
- `https://statsapi.mlb.com/api/v1/game/[GAME_PK]/playByPlay` - Play-by-play data

### **MLB Image CDN**
Player photos, team logos, and branded assets with dynamic sizing and formats.

**Player Images:**
- `https://img.mlbstatic.com/mlb-photos/image/upload/w_[WIDTH],q_auto/v1/people/[PLAYER_ID]/headshot/silo/current` - Player headshot
- `https://img.mlbstatic.com/mlb-photos/image/upload/h_1080,w_1920,c_auto,g_auto:subject/v1/people/[PLAYER_ID]/action/hero/current` - Player action shot
- `https://img.mlbstatic.com/mlb-photos/image/upload/w_720,f_png,q_auto/v1/people/[PLAYER_ID]/pressbox/current` - Pressbox photo

**Team Logos:**
- `https://img.mlbstatic.com/mlb-photos/image/upload/w_[WIDTH],f_png,q_auto/v1/team/[TEAM_ID]/logo/spot/current` - Team spot logo
- `https://img.mlbstatic.com/mlb-photos/image/upload/w_[WIDTH],f_png,q_auto/v1/team/[TEAM_ID]/logo/cap/dark/current` - Cap logo dark
- `https://img.mlbstatic.com/mlb-photos/image/upload/w_[WIDTH],f_png,q_auto/v1/team/[TEAM_ID]/logo/cap/light/current` - Cap logo light
- `https://img.mlbstatic.com/mlb-photos/image/upload/w_[WIDTH],f_png,q_auto/v1/team/[TEAM_ID]/fill/spot` - Team fill color

**Team Backgrounds:**
- `https://img.mlbstatic.com/mlb-photos/image/upload/w_1280,f_png,q_auto/v1/team/[TEAM_ID]/action/hero/current` - Team hero background

### **MLB Standings API**
League standings, division records, and playoff positioning.
- `https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=[YEAR]` - League standings
- `https://statsapi.mlb.com/api/v1/standings/regularSeason?leagueId=103&season=[YEAR]` - AL standings
- `https://statsapi.mlb.com/api/v1/standings/regularSeason?leagueId=104&season=[YEAR]` - NL standings
- `https://statsapi.mlb.com/api/v1/standings/wildCard?leagueId=103,104&season=[YEAR]` - Wild card standings

### **MLB Venues API**
Stadium information, venue details, and ballpark data.
- `https://statsapi.mlb.com/api/v1/venues` - All venues list
- `https://statsapi.mlb.com/api/v1/venues/[VENUE_ID]` - Specific venue details

### **Common Parameters**
- **[TEAM_ID]**: Team ID (e.g., 147 for Yankees, 119 for Dodgers)
- **[PLAYER_ID]**: Player ID (e.g., 545361 for Mike Trout)
- **[GAME_PK]**: Game primary key from schedule API
- **[DATE]**: Date in YYYY-MM-DD format
- **[YEAR]**: Season year (e.g., 2025)
- **[WIDTH]**: Image width in pixels
- **[VENUE_ID]**: Venue ID from venues API

### **📁 Custom Module System**

#### **Utilities (`src/utils/`)**
- **`spotColorMapping.js`** - Official MLB team spot colors (hex values)
- **`teamColorReference.js`** - Comprehensive team color reference
- **`teamUtils.js`** - Team organization and division logic
- **`audio.js`** - Web Audio API integration for UI sounds
- **`spotColorTest.js`** - Color mapping validation utility

#### **Components (`src/components/`)**
- **`MLBSchedule.jsx`** - Live games schedule with spotlight design and official spot colors
- **`GameCarousel.jsx`** - Team-specific horizontal game carousel (logo-vs-logo design)
- **`AnchorMenu.js`** - Division-based team navigation with spot color integration
- **`UI/CommonComponents.js`** - Reusable UI components

#### **Hooks (`src/hooks/`)**
- **`useTeamData.js`** - Custom hooks for team data and official spot colors integration

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

## 📦 **Deployment Configuration**

### **Repository Information**
- **Repository**: https://github.com/skull-github/XRBrandingGuide
- **Branch**: main
- **Latest Updates**: Consolidated README with all documentation

### **Vercel Configuration**
- **Framework**: Vite
- **Root Directory**: ./
- **Build Command**: npm run build
- **Output Directory**: dist
- **Install Command**: npm install

### **Files Structure (Root Level)**
```
✅ package.json        # Dependencies and scripts
✅ index.html          # Entry point  
✅ src/                # React app source code
✅ vite.config.js      # Vite configuration
✅ vercel.json         # Deployment settings
✅ dist/               # Build output (after npm run build)
✅ deploy-main.sh      # Main branch deployment script
✅ deploy-stable.sh    # Stable branch deployment script (password-protected)
```

### **Deployment Issue Resolution**
If Vercel shows wrong repository (iamdavidsantana/xr-branding-guide):
1. Delete the Vercel project completely
2. Create new project from scratch
3. Import from skull-github/XRBrandingGuide
4. Ensure branch is set to 'main'

## 🎯 **Recent Project Updates**

### **✅ Recently Completed Features:**
- **Official MLB spot colors** for all teams (hex values mapped)
- **Horizontal carousel layout** (logo-vs-logo design)
- **TeamGameCarousel component** replacing vertical layout
- **Secure deployment system** with password protection
- **Consolidated documentation** - All README files merged into one
- **MAIN branch workflow** - Set as default working branch
- **Schedule card improvements** - Changed "VIEWING" to "LIVE" status
- **Complete spot color integration** - All components updated

### **🎨 Current Team Section Layout:**
- **Live Game Context**: Horizontal carousel with logo-vs-logo cards
- **Upcoming Games**: Clean vertical list format
- **Official spot colors** used throughout all team displays
- **Responsive design** for all screen sizes

### **🛡️ Security & Workflow:**
- **Password-protected stable deployments** (password: "3333")
- **Main branch** for daily development (no password)
- **All deployments logged** with timestamps
- **Secure API integration** with proper error handling

### **🎵 Audio System**
- **Web Audio API** - Native browser audio capabilities
- **Interactive Sounds** - Hover and click feedback
- **User Gesture Activation** - Proper audio context management

### **📊 Performance Features**
- **Lazy Loading** - Components loaded on demand
- **Image Optimization** - MLB CDN with responsive sizing
- **Memoization** - React hooks for performance
- **Minimal Dependencies** - Lean dependency tree

## 📊 **Project Stats & Summary**

- **Total Dependencies**: 12 (3 production + 9 development)
- **External APIs**: 4 (MLB Stats, Images, Mobile, Google)
- **Custom Modules**: 10+ utilities, components, and hooks
- **Configuration Files**: 5 (Vite, Vercel, ESLint, Package, Git)
- **Architecture**: Modern React SPA with minimal footprint
- **Team Spot Colors**: 32 official MLB team colors mapped
- **Deployment Scripts**: 2 (main + stable with password)
- **Documentation**: Interactive HTML site with auto-sync from README
- **Documentation Features**: Responsive design, team color viewer, offline support

## 📚 **Interactive Documentation**

This project includes a comprehensive interactive documentation site that automatically syncs with this README:

### **Features**
- **📱 Responsive Design** - Works on all devices
- **🎨 Interactive Team Colors** - Clickable team color cards with details
- **🔍 Smooth Navigation** - Sidebar with smooth scrolling
- **🌙 Dark Theme** - MLB-inspired design
- **🔄 Auto-Sync** - Updates when README changes
- **⚡ Fast & Accessible** - Optimized performance
- **📱 PWA Ready** - Offline functionality

### **Access Documentation**
- **Local**: Open `docs/index.html` in your browser
- **Live Server**: `cd docs && npm run serve` then visit http://localhost:8080
- **Auto-Sync**: `cd docs && npm run watch` for live README updates

### **Deploy Documentation**
```bash
cd docs && ./deploy-docs.sh  # Auto-sync and commit to git
```

The documentation site can be hosted on any static hosting platform (Vercel, Netlify, GitHub Pages, etc.).

## 🎨 **Typography Scale & Style Guide**

The MLB XR Branding Guide uses a consistent typography system optimized for both XR applications and web interfaces. Web sizes are 50% of the original XR sizes for better readability.

### **Typography Breakdown**

| Style | XR Size | Web Size | Weight | Use Case | CSS Class |
|-------|---------|----------|---------|----------|-----------|
| **Score** | 140px | 70px | Bold | Key metrics, scores, large numbers | `.text-score` |
| **Marquee** | 96px | 48px | Bold | Main headlines, hero text | `.text-marquee` |
| **Display** | 76px | 38px | Semibold | Primary section headers | `.text-display` |
| **Title** | 58px | 29px | Semibold | Subsection headers | `.text-title` |
| **Headline** | 48px | 24px | Semibold | Component headers | `.text-headline` |
| **SubHeadline** | 38px | 19px | Medium | Minor headers, labels | `.text-subheadline` |
| **Body** | 34px | 17px | Regular | Main content text | `.text-body` |
| **Body Bold** | 34px | 17px | Bold | Emphasized content | `.text-body-bold` |
| **System** | 30px | 15px | Medium | UI elements, buttons | `.text-system` |
| **Legal** | 26px | 13px | Regular | Fine print, disclaimers | `.text-legal` |

### **Font Specifications**
- **Primary Font**: MLB HEX Franklin (woff2/otf available in assets)
- **Fallback**: Inter, system-ui, -apple-system, sans-serif
- **Weights Available**: Light (300), Regular (400), Medium (500), Semibold (600), Bold (700), Extrabold (800), Black (900)
- **Line Height**: Ranges from 1.1 (Score) to 1.5 (Body) for optimal readability
- **Letter Spacing**: Tighter on larger sizes (-0.02em), normal on body text

### **Responsive Behavior**
- **Desktop**: Full web sizes (50% of XR)
- **Tablet**: 75% of web sizes
- **Mobile**: 60% of web sizes

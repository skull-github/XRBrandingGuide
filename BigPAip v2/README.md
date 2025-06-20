# MLB XR Branding Guide

**Version:** v1.01  
**Created by MLB VR and Gaming**  
**INTERNAL USE ONLY**

This web app lets you input a Google Sheets URL and displays MLB team data, logos, spot colors, wordmarks, and live roster/player headshots in a table.

## Features
- Paste a public Google Sheets URL to load team data.
- Automatically saves and reloads the last used sheet URL.
- Auto-loads the sheet on app start if a URL is present.
- Displays columns for:
  - Team Logo Default ™
  - Logo Spot
  - Spot Color (with hex value)
  - Team Wordmark Logo - Light
  - Team Wordmark Logo - Dark
  - Roster (dropdown of active players)
  - Headshot Silo (shows headshot for selected player)
- All table cells are left-justified.

## Usage

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
3. Open your browser to the local address shown in the terminal (e.g., http://localhost:5173).
4. Paste a public Google Sheets URL (must be shared as "Anyone with the link can view").
5. The app will remember and auto-load your last used URL on future visits.
6. Explore team logos, spot colors, wordmarks, and interact with live rosters and player headshots.

**Note:**
- The Google Sheet must have a column for Team ID (used for MLB API lookups).
- The app fetches live roster/player data from the MLB API.

## More Information

- [Project README (this file)](./README.md)
- [MLB Milestones API JSON Structure](./mlb-milestones-json-info.js)

---

### MLB Milestones API JSON Structure

The app uses the MLB milestones API:
https://statsapi.mlb.com/api/v1/milestones?hydrate=person,team&limit=100

Key fields in the JSON response:
- `milestoneAchievementId`: Unique ID for the milestone achievement
- `player`: Player info (id, name, etc.)
- `team`: Team info (id, name, etc.)
- `milestoneRule`: Type of milestone, statistic, etc.
- `achievementStatus`: Status (e.g., achieved, in_progress)
- `achievementValue`/`currentValue`: Numeric values
- `dateAchieved`: Date milestone was achieved (if any)

See [mlb-milestones-json-info.js](./mlb-milestones-json-info.js) for a sample structure and more details.

---

## Desktop App (Electron)

You can run this app as a standalone desktop application using Electron.

### To launch as a desktop app:

1. Install dependencies (if you haven't):
   ```sh
   npm install
   ```
2. Build the app:
   ```sh
   npm run build
   ```
3. Start the Electron app:
   ```sh
   npm run electron:start
   ```

This will open the app in a native window. No terminal is required for users once packaged (see below).

### Packaging for distribution
To create a distributable `.app` or `.exe`, use a tool like [electron-builder](https://www.electron.build/) or [electron-forge](https://www.electronforge.io/). See their docs for packaging instructions.

---
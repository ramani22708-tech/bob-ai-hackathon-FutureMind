# ⚙️ Setup Guide — GridWise AI

**IBM BoB AI Innovation Hackathon 2026**

---

## Prerequisites

| Requirement | Version | Check |
|---|---|---|
| Node.js | v18 or later | `node --version` |
| npm | v9 or later | `npm --version` |
| Git | Any recent version | `git --version` |
| Browser | Chrome, Firefox, or Edge (latest) | — |

> ✅ **No API keys, environment variables, or paid services required.**
> The entire application runs locally in your browser.

---

## Installation

### Step 1 — Clone the repository

```bash
git clone https://github.com/ramani22708-tech/bob-ai-hackathon-FutureMind.git
cd bob-ai-hackathon-FutureMind
```

### Step 2 — Install dependencies

```bash
npm install
```

This installs: React 18, Vite 4, Recharts 2.8, and their dependencies (~150MB in node_modules).

### Step 3 — Start the development server

```bash
npm run dev
```

### Step 4 — Open in your browser

```
http://localhost:5173
```

The application loads immediately with simulated data — no configuration needed.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |

---

## Windows-Specific Instructions

If you are on Windows and `npm` is not recognised:

```powershell
# Option 1 — Use Command Prompt (cmd) instead of PowerShell
cd "C:\Users\YourName\path\to\bob-ai-hackathon-FutureMind"
npm run dev

# Option 2 — Fix PowerShell execution policy
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
npm run dev

# Option 3 — Call node directly
& "C:\Program Files\nodejs\node.exe" ".\node_modules\vite\bin\vite.js"
```

---

## Project Structure After Install

```
bob-ai-hackathon-FutureMind/
├── src/              Application source code (React)
├── docs/             Documentation
├── demo/             Screenshots and demo artifacts
├── presentation/     Hackathon slide deck
├── dist/             Production build output (after npm run build)
├── node_modules/     Installed packages (auto-generated, not in git)
├── package.json      Project metadata and scripts
├── vite.config.js    Vite build configuration
└── index.html        HTML entry point
```

---

## Running the Demo

Once the app is running at `http://localhost:5173`:

1. Click **"▶ Start Demo Mode"** in the sidebar (bottom-left)
2. A floating panel appears with Step 1 of 10
3. Click **"Next →"** to advance through all 10 demo steps
4. The app automatically navigates pages and triggers scenarios
5. Click **"✅ Finish"** or **"✕"** to exit Demo Mode

### Manual Demo Scenarios

On the **Data Simulation** page:
- **🔴 Demand Spike (+28%)** — Simulates a critical demand surge
- **☀️ Solar Underperformance (−60%)** — Simulates solar fleet degradation
- **💨 Wind Underperformance (−45%)** — Simulates low wind event
- **🔒 Grid Constraint** — Toggles transmission constraint
- **✅ Reset All** — Returns to normal operating conditions

---

## Building for Production

```bash
npm run build
```

Output is in `dist/` — a static site that can be deployed to:
- **Vercel:** Connect GitHub repo → auto-deploys
- **GitHub Pages:** `npx gh-pages -d dist`
- **Netlify:** Drag and drop `dist/` folder
- **Any static web server:** Copy `dist/` contents

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `npm: command not found` | Install Node.js from https://nodejs.org |
| Port 5173 already in use | Vite will automatically try 5174, 5175, etc. |
| White screen on load | Check browser console (F12) for errors |
| Charts not rendering | Ensure `node_modules` is installed (`npm install`) |
| LF/CRLF warnings in git | Normal on Windows — not an error |

---

## No Configuration Required

GridWise AI has no `.env` file, no API credentials, and no database connections.
All data is generated programmatically using a seeded random number generator.
The application is fully self-contained and runs offline.

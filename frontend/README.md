# FUSE — FinacPlus Unified Software Engine

Frontend-only deliverable for the FinacPlus DevOps case study. This is a
single-page, scroll-driven technical experience that walks through the
CI/CD pipeline (GitHub → Jenkins → pytest → Docker → Kind/Kubernetes →
FastAPI) that ships the FinacPlus API.

**Scope:** frontend only. No Docker, Kubernetes, Jenkins, CI/CD wiring,
backend changes, or infrastructure are implemented here — see "Phase 2
handoff" below.

## Stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Lucide React (icons)

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

```bash
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

## Project structure

```
frontend/
├── src/
│   ├── components/     # reusable UI: Nav, TerminalWindow, cards, diagram, etc.
│   ├── sections/        # one file per page section (Hero, Pipeline, Architecture, ...)
│   ├── data/             # static content — pipeline stages, delivery log, evidence
│   ├── services/         # api.js — the single boundary to the FastAPI backend
│   ├── hooks/            # useScrollProgress, useActiveSection, useReducedMotion
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example
└── README.md
```

## API integration point

`src/services/api.js` is the **only** file that talks to the FinacPlus
FastAPI backend. It reads `VITE_API_BASE_URL` (see `.env.example`,
defaults to `http://localhost:8000`) and calls:

- `GET /health`
- `GET /api/accounts`
- `GET /api/accounts/{account_id}`

Each function tries the real endpoint first (2.5s timeout) and falls back
to static, clearly-labeled mock data matching the real response shape if
the backend isn't reachable — so the UI runs fully standalone today, and
nothing outside `api.js` needs to change once the backend is live. The
Application section shows a `live` / `static demo data` badge on every
response so it's obvious which one served the request.

## Assumptions made

- The backend is not running in this environment, so the Application
  section runs entirely on the mock data layer by default.
- All Jenkins/kubectl/docker console output shown in the Delivery section
  is static, illustrative evidence, not a live feed — this is called out
  directly in the section copy per the project brief.
- Font stack: JetBrains Mono for technical/monospace text, Inter Tight
  for display headings, Inter for body copy (loaded via Google Fonts in
  `index.html`; swap for self-hosted fonts later if required).

## Phase 2 handoff — frontend dockerization

This package is structured so the next step is straightforward:

1. Add `frontend/Dockerfile` (multi-stage: `npm run build`, then serve
   `dist/` with a static server such as nginx).
2. `docker build` / `docker run` to verify the container serves the site.
3. Point `VITE_API_BASE_URL` at the real backend service address (build
   arg or runtime env, depending on the chosen serving strategy) —
   `src/services/api.js` needs no code changes for this.
4. Add the frontend to the existing Kubernetes manifests as its own
   Deployment/Service.
5. Add a "frontend" stage to the existing Jenkinsfile alongside the
   current backend stages.

Nothing in this repository touches the Jenkinsfile, Dockerfile,
Kubernetes manifests, or backend code — those remain untouched for a
separate integration pass.

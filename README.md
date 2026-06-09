# ResumeIQ AI

A premium, dark-mode-first **Resume Intelligence SaaS dashboard** inspired by Linear, Stripe, Ashby, and Vercel. Upload a PDF resume and receive an executive-level AI analysis with ATS scoring, skills radar, keyword gap analysis, and actionable recommendations.

> **Built with:** React 19 · Vite · Tailwind CSS v4 · Zustand · Express · OpenAI GPT-4o-mini

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **📤 Premium Resume Upload** | Large drag-and-drop zone with visual feedback, file validation, and trust badges |
| **🧠 AI-Powered Analysis** | GPT-4o-mini evaluates scores, ATS compatibility, hiring readiness, skills, keywords, strengths, and improvements |
| **📊 Skills Radar Chart** | SVG radar chart visualizing 6 dimensions (Technical, Experience, Education, Formatting, Keywords, Achievements) |
| **🎯 ATS Breakdown** | 5 sub-scores: Formatting, Keyword Optimization, Section Completeness, Readability, Achievement Focus |
| **🔍 Keyword Gap Analysis** | Categorized missing keywords with importance levels and industry benchmark coverage |
| **🏆 Executive Score Cards** | Large animated score rings for Overall Score and ATS Compatibility |
| **📄 Resume Preview** | Collapsible panel showing parsed info (name, email, skills, education) and extracted text |
| **📑 PDF Export** | Download a premium-formatted report with cover page, scores, and all analysis sections |
| **📜 Analysis History** | Last 20 analyses saved to localStorage with quick-reload from dropdown |
| **🌙 Dark Mode First** | Premium dark theme by default with one-click light mode toggle, persisted |
| **⚡ Real-time Feedback** | Animated loading states with status messages, toast notifications, error handling |

---

## 🏗️ Architecture

```
resume-analyzer/
├── backend/                          # Express API server
│   ├── src/
│   │   ├── index.js                  # Server entry, CORS, rate limiting
│   │   ├── routes/
│   │   │   └── analyze.js            # POST /api/analyze endpoint
│   │   ├── services/
│   │   │   ├── openai.js             # GPT-4o-mini integration (rich schema)
│   │   │   └── pdfExtractor.js       # Server-side PDF text extraction
│   │   └── middleware/
│   │       └── upload.js             # Multer config (in-memory, PDF only)
│   ├── .env.example
│   └── package.json
│
├── frontend/                         # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx                   # Root: routes Upload/Loading/Dashboard
│   │   ├── main.jsx                  # Entry point
│   │   ├── index.css                 # Premium dark-first theme + animations
│   │   ├── components/
│   │   │   ├── PremiumHeader.jsx     # Linear-inspired nav bar
│   │   │   ├── UploadPage.jsx        # Premium drag-and-drop upload
│   │   │   ├── LoadingScreen.jsx     # Animated loading with status messages
│   │   │   ├── Dashboard.jsx         # Analysis dashboard orchestrator
│   │   │   ├── HeroSection.jsx       # Score rings, hiring readiness, quick stats
│   │   │   ├── AnalysisGrid.jsx      # 2-column grid layout
│   │   │   ├── SectionCard.jsx       # Reusable section card
│   │   │   ├── SkillsRadar.jsx       # SVG radar chart
│   │   │   ├── ATSBreakdown.jsx      # Horizontal bar scores
│   │   │   ├── ResumePreview.jsx     # Parsed info + text preview
│   │   │   └── ExportSection.jsx     # PDF export with summary
│   │   ├── store/
│   │   │   └── useResumeStore.js     # Zustand store (persisted, UUID-based)
│   │   ├── services/
│   │   │   ├── api.js                # POST /api/analyze
│   │   │   └── pdfParser.js          # Client-side PDF text extraction
│   │   └── utils/
│   │       └── pdfExport.js          # jsPDF report generator
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🎨 Design System

### Philosophy

Modern B2B SaaS — minimalistic, clean spacing, large visual hierarchy, premium feel without excessive gradients.

### Color Palette

Dark mode is the **default** experience.

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--color-bg` | `#0A0A0A` | `#F8FAFC` | Page background |
| `--color-surface` | `#111111` | `#FFFFFF` | Card / container surfaces |
| `--color-surface-hover` | `#1A1A1A` | `#F1F5F9` | Card hover state |
| `--color-surface-elevated` | `#1C1C1C` | `#FFFFFF` | Elevated elements |
| `--color-border` | `#222222` | `#E2E8F0` | Borders and dividers |
| `--color-primary` | `#6366F1` | `#4F46E5` | Primary actions, highlights |
| `--color-primary-glow` | `rgba(99,102,241,0.15)` | `rgba(79,70,229,0.1)` | Primary glow effect |
| `--color-success` | `#22C55E` | `#16A34A` | Success states |
| `--color-warning` | `#F59E0B` | `#D97706` | Warning states |
| `--color-danger` | `#EF4444` | `#DC2626` | Error states |
| `--color-text` | `#F1F5F9` | `#0F172A` | Primary text |
| `--color-text-secondary` | `#94A3B8` | `#475569` | Secondary text |
| `--color-text-tertiary` | `#64748B` | `#94A3B8` | Muted text |

### Typography

- **Font:** Inter (system-ui fallback)
- **Scale:** 10px–48px with clean hierarchy
- **Weights:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Corner Radius

- Cards: 16px (`rounded-2xl`)
- Buttons: 12px (`rounded-xl`)
- Badges/Tags: 8px (`rounded-lg`)
- Icons: 8–12px

### Effects

- **Glass:** `backdrop-filter: blur(16px)` on sticky header
- **Glow:** `box-shadow` with `--color-primary-glow` on primary buttons
- **Card Hover:** Subtle border + background shift
- **Stagger:** Children animate in sequence (80ms delay increments)
- **Score Rings:** SVG circles with `stroke-dasharray` animation

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ (v20 recommended)
- **npm** v9+
- **OpenAI API key** ([get one](https://platform.openai.com/api-keys))

### 1. Clone & Install

```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure

```bash
cd ../backend
cp .env.example .env
```

Edit `.env`:

```env
OPENAI_API_KEY=sk-your-actual-key-here
PORT=3001
NODE_ENV=development
RATE_LIMIT_MAX=20
```

### 3. Run

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Use

1. Drag & drop a PDF resume (or click to browse)
2. Click **Analyze Resume**
3. View the executive dashboard with scores, radar chart, ATS breakdown, and recommendations
4. Click **Export PDF** to download the report
5. Access past analyses from the **History** dropdown in the header

---

## 📡 API Reference

### `POST /api/analyze`

Upload a PDF resume for AI analysis.

**Request:** `multipart/form-data` with field `resume` (PDF, max 10 MB)

**Response** includes full analysis object with:
- `parsed_info` — extracted name, email, phone, skills, experience
- `summary` — executive summary
- `overall_score`, `ats_compatibility_score`, `hiring_readiness`
- `ats_breakdown` — 5 sub-scores
- `skills_identified[]` — with category, proficiency, market demand
- `missing_keywords[]` — with category, importance, reason
- `keyword_gap_analysis` — strong/weak categories, benchmark coverage
- `skills_radar` — 6-dimension radar data
- `strengths[]`, `areas_for_improvement[]`, `recommendations[]`

### `GET /api/health`

Health check endpoint.

---

## 🛠️ Tech Stack

### Frontend
| Library | Purpose |
|---------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| Tailwind CSS v4 | Utility-first CSS |
| Zustand | State management (localStorage persisted) |
| react-dropzone | Drag-and-drop file upload |
| pdfjs-dist | Client-side PDF text extraction |
| jsPDF | Report export |
| react-hot-toast | Toast notifications |
| react-icons | Icon library (Feather Icons) |

### Backend
| Library | Purpose |
|---------|---------|
| Express 4 | HTTP server |
| OpenAI SDK | GPT-4o-mini integration |
| Multer | Multipart file upload |
| pdf-parse | Server-side PDF parsing |
| express-rate-limit | Rate limiting (20 req/15min) |
| cors | Cross-origin requests |

---

## 📸 UI Sections

| Section | Components |
|---------|-----------|
| **Navigation** | PremiumHeader — logo, history dropdown, settings, theme toggle, new analysis |
| **Upload** | UploadPage — drag-and-drop zone, file validation, analyze button, trust badges |
| **Loading** | LoadingScreen — animated dots, rotating status messages |
| **Hero** | HeroSection — large score rings, hiring readiness badge, quick stats |
| **Skills Radar** | SkillsRadar — SVG hex chart with 6 dimensions, data fill, labels |
| **ATS Breakdown** | ATSBreakdown — horizontal bars with color-coded scores |
| **Analysis Cards** | SectionCard — reusable list cards with icons, badges, counters |
| **Resume Preview** | ResumePreview — collapsible parsed info, skills tags, raw text |
| **Export** | ExportSection — download button with score summary |

---

## 🔮 Future Roadmap

- [ ] OCR support for scanned/image-based PDFs
- [ ] Job description matching (paste a JD for comparison)
- [ ] AI resume rewriter with one-click suggestions
- [ ] Cover letter generator
- [ ] LinkedIn profile review integration
- [ ] Interview question generator based on resume gaps
- [ ] User accounts with cloud-synced history (Supabase)
- [ ] Multi-language support
- [ ] Recruiter portal with candidate comparison

---

## 📄 License

MIT

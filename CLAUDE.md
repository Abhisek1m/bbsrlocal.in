# BBSRLocal.in — Claude Code Project Constants

## Project
Hyperlocal city guide for Bhubaneswar / Odisha. Static multi-page site, no build step.
- Domain: `bbsrlocal.in` (Netlify)
- Subdomains: `travel.bbsrlocal.in` (same Netlify, `/travel/` subfolder), `toys.bbsrlocal.in` (separate repo)

## File Structure
```
e:\AIapps\BBSRDIr\
├── index.html              ← home page
├── netlify.toml
├── assets/
│   ├── css/
│   │   ├── shared.css      ← nav, footer, tokens, reveal — loaded on every page
│   │   └── home.css        ← home-only styles
│   ├── js/
│   │   ├── data.js         ← PLACES array + CATS (load FIRST)
│   │   ├── directory.js    ← render, filter, cardHTML (load SECOND)
│   │   └── utils.js        ← boot, IntersectionObserver (load LAST)
│   └── images/
└── travel/
    └── index.html          ← coming-soon page, CSS path: ../assets/css/shared.css
```

## JS Load Order (critical)
`data.js` → `directory.js` → `utils.js`  — never change this order.

## CSS Design Tokens (shared.css :root)
- Vermilion: `#C0392B` | Marigold: `#F39C12` | Near-black: `#1A1A2E`
- Fonts: Unbounded (headings), Schibsted Grotesk (body), JetBrains Mono (mono), Noto Sans Oriya

## PLACES Object Shape (data.js)
`{n, cat, area, r, rc, o, c, closed[], hrs, d, q, k}`
- `o`/`c` = open/close as decimal hours (6.5 = 6:30 AM); `o:0, c:24` = 24-hour
- `closed[]` = day numbers closed (0=Sun … 6=Sat)

## Pending Before Go-Live
- [ ] Replace WhatsApp placeholder `919999999999` with real number (index.html ×3, travel/index.html ×3)
- [ ] DNS: add CNAME `travel.bbsrlocal.in → <netlify-site>.netlify.app` at registrar
- [ ] Deploy to Netlify

## Netlify Config (netlify.toml)
- `publish = "."`
- `travel.bbsrlocal.in/*` → `/travel/:splat` (200 rewrite)
- www → apex (301 redirect)
- `/assets/*` → immutable cache; `/*.html` → must-revalidate

## Future Subprojects (separate repos, separate deploys)
- **toys.bbsrlocal.in** — Medusa v2 backend (Railway/Render + PostgreSQL) + Next.js storefront (Vercel) + Razorpay
- **travel.bbsrlocal.in full** — Next.js + Sanity CMS, tour package schema, WhatsApp inquiry flow

## Session Handoff
Full context for new sessions: `.claude/session-2026-06-16.md`
Load it with: `/read .claude/session-2026-06-16.md`

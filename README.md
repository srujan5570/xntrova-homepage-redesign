# Xntrova Technologies — Homepage Redesign (Assessment)

Bespoke, dark-editorial concept redesign for **Xntrova Technologies** (digital marketing agency, Delhi NCR).
Art direction: bone-paper + near-black + electric lime, Clash Display / Satoshi / JetBrains Mono,
bento services grid, kinetic tickers, ghost typography, and a live ROI calculator.

## How to run (no build, no dependencies)

```bash
cd redesign-homepage
python -m http.server 3000
# open http://localhost:3000
```

Or with Node:

```bash
npx -y serve -l 3000 redesign-homepage
```

Just open `index.html` also works, but a local server is recommended.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Semantic, SEO-friendly markup (single `<h1>`, proper heading order, meta + OG tags, JSON-LD LocalBusiness schema) |
| `styles.css` | Mobile-first CSS, CSS variables, Clash Display + Satoshi + JetBrains Mono (async-loaded with system fallbacks), neo-brutalist bento cards, pure-CSS art, no frameworks |
| `script.js` | Vanilla JS: mobile menu, scrollspy, reveal animations, counters, slider, filters, FAQ, form validation |

## Sections (as per brief)

Header/Nav · Hero (with lead form) · Services · About · Why Choose Us (+ stats) · Process · Portfolio/Case studies (filterable) · Testimonials (slider) · FAQ · CTA band · Contact/Lead form · Footer

## Major changes vs the existing site

1. **Conversion-first hero** — old hero was a headline + link. New hero pairs the value proposition ("marketing that measurably grows revenue") with an inline **free-audit lead form**, trust ticks, and mini-stats, so visitors can convert without scrolling.
2. **Clearer information hierarchy** — one idea per section, scannable cards, sticky nav with scrollspy so users always know where they are.
3. **Proof everywhere** — animated stat band (500+ clients, 120+ projects, +250% growth), 6 quantified case-study cards with filters, 5 real testimonials in an auto-playing slider, FAQ that pre-handles objections.
4. **Faster & lighter** — zero external dependencies (no framework/CDN/fonts), inline SVG icons, system font stack. Total page ≈ 60 KB (HTML+CSS+JS) before images.
5. **Mobile-first responsive** — hamburger drawer menu, stacked layouts under 1020 px / 640 px breakpoints, sticky tap-to-call CTA thinking, touch-friendly slider.
6. **Trust & transparency** — "senior-only team, revenue-first reporting, month-to-month plans, you own everything" messaging directly answers the biggest agency-selection anxieties.

## Functionality implemented

- Sticky header with scroll shadow + active-link highlighting
- Mobile drawer menu (backdrop, Escape, link-tap and resize-to-desktop close)
- Rotating "now growing" client ticker in the hero
- **Live ROI calculator** (traffic × conversion × deal value → leads + pipeline in ₹ L/Cr)
- Smooth scrolling with header offset
- Scroll-reveal animations (respects `prefers-reduced-motion`)
- Animated stat counters
- Testimonial carousel (buttons + dots + autoplay + swipe)
- Portfolio category filter (All / SEO / PPC / Social / Web)
- Single-open FAQ accordion
- Two validated lead forms (inline errors, success state, no backend — ready to wire to any API/CRM)
- Back-to-top + WhatsApp float, dynamic footer year

## Technical decisions (for the interview discussion)

- **Plain HTML/CSS/JS, no dependencies** — matches the brief ("no unnecessary dependencies"), fastest load, easiest to explain line-by-line, runs anywhere.
- **Reusable patterns, not copy-paste** — CSS variables + `.card` / `.btn` / `.field` component classes; one `wireForm()` function drives both forms; one IntersectionObserver pattern drives reveal + counters + scrollspy.
- **SEO & a11y** — semantic landmarks, skip link, labels on every input, aria states on menu/slider/FAQ, alt/aria-hidden on decorative art, JSON-LD schema.
- **Performance** — no render-blocking third parties, minimal JS (~8 KB), CSS mobile-first so phones download nothing extra.

## Submission checklist

- [x] Complete source code (this folder)
- [ ] GitHub repository — push this folder as-is
- [ ] Live URL — deploy via Vercel/Netlify/GitHub Pages (static, no config needed)
- [x] This explanation of changes

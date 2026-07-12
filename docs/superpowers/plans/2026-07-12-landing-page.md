# RealtyReceptionAI Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `index.html` + `css/styles.css` + `js/main.js` — a static, responsive, fully interactive marketing landing page for RealtyReceptionAI, reproducing the approved design (see spec) with no build step.

**Architecture:** Single-page static site. One markup tree, one stylesheet with a `@media (max-width: 900px)` block for the mobile layout, one script file with small independent modules (nav scroll/menu, phone demo state machine, tabs, stat counters) each attached via `DOMContentLoaded`.

**Tech Stack:** Plain HTML5, CSS3 (flexbox/grid, custom properties), vanilla JS (ES2020+, no dependencies). Google Fonts (Newsreader, Nunito Sans) loaded via `<link>`.

## Global Constraints

- No build step, no npm, no framework. Files are opened directly / served as static files.
- Fonts: `Newsreader` (var `--font-serif`, headings/display numerals) + `Nunito Sans` (var `--font-sans`, body/UI) — the DC source's default pairing. Loaded from `https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Nunito+Sans:wght@400;600;700;800&display=swap` with the matching `preconnect` links.
- All copy, colors, spacing values, and mock data (names, property address, stats, etc.) must match the reference files verbatim — no invented content. Reference files (already committed):
  - `docs/superpowers/reference/cluely-header-desktop.dc.html` — desktop design, ≥901px
  - `docs/superpowers/reference/cluely-header-mobile.dc.html` — mobile design, ≤900px
- Breakpoint: `@media (max-width: 900px)`.
- All "Book a Meeting" / "Book a free personalized demo" / "Book a call" CTAs link to `https://calendly.com/andre-devilladesign/free-20-minute-chat` with `target="_blank" rel="noopener"`.
- Footer email stays `mailto:hello@realtyreceptionai.com`.
- Nav items with no built page (`FAQ`, `Blog`, mobile menu's `Features`/`Pricing`) are `href="#"`. `How it works` (mobile menu) and `How it works`/`Navigate` footer link point to `#how-we-work`.
- Final CTA section uses the "Gradient ring" variant (desktop reference lines 476-486; mobile reference lines 305-315) — the only variant the mobile design implements and the DC source's default.
- Images: `assets/mountain-tall-1.jpg` (hero background, already in repo), `assets/how-we-work-a.jpg` (how-we-work section, already in repo) — both already sized/compressed for web, do not regenerate.
- Every interactive element must be keyboard/semantic-friendly where trivial (use `<button>` for the hamburger and phone "Try it yourself"/end-call controls, `<a href>` for real links) but do not add features (e.g. full ARIA live-region announcements) beyond what's in the design — YAGNI.

## File & Class Contract

```
index.html
css/styles.css
js/main.js
assets/mountain-tall-1.jpg   (exists)
assets/how-we-work-a.jpg     (exists)
```

Every task below uses this class naming scheme — reuse exactly, do not invent alternatives:

| Section | Root class | Notes |
|---|---|---|
| Nav | `.nav`, `.nav__inner`, `.nav__logo`, `.nav__link`, `.nav__cta` | `.nav` is the fixed outer wrapper; `.nav__inner` is the pill that condenses on scroll. `.nav.is-condensed` toggles condensed state (desktop). |
| Mobile nav | `.mnav`, `.mnav__toggle`, `.mnav__menu`, `.mnav__menu.is-open` | Only rendered/visible ≤900px. |
| Hero | `.hero`, `.hero__title`, `.hero__subtitle`, `.hero__cta`, `.hero__demo-heading` | |
| Phone demo | `.phone`, `.phone__screen`, `.phone__status`, `.phone__caller`, `.phone__avatar`, `.phone__controls`, `.phone__end-call`, `.phone__track`, `.phone__knob`, `.phone__lock`, `.phone__hint` | State controlled by `data-phase="locked\|ringing\|live"` on `.phone__screen`. |
| Education section | `.calls-section`, `.call-card`, `.call-card--answer`, `.call-card--book`, `.waveform`, `.waveform__bar`, `.tabs`, `.tab`, `.tab.is-active`, `.tab-panel`, `.tab-panel.is-active` | |
| Stats | `.stats`, `.stat`, `.stat__value`, `.stat__caption` | |
| How-we-work | `.how-we-work`, `.how-we-work__image`, `.steps`, `.step`, `.step__marker`, `.step__body` | |
| Final CTA | `.cta-final`, `.cta-final__inner` | |
| Footer | `.footer`, `.footer__brand`, `.footer__col`, `.footer__bottom` | |

JS module contract (all in `js/main.js`, no build step so plain functions/IIFEs, not ES modules):
- `initNavScroll()` — desktop scroll-condense behavior on `.nav__inner`
- `initMobileMenu()` — hamburger toggle on `.mnav__toggle` / `.mnav__menu`
- `initPhoneDemo()` — state machine on `.phone`
- `initTabs()` — tab switching in `.calls-section`
- `initStatCounters()` — `IntersectionObserver`-triggered count-up on `.stats`
- Pure helper functions (must be independently callable, no DOM access — these are the only pieces covered by automated tests): `formatCallTime(seconds)`, `easeOutCubic(t)`, `dragAnswerThreshold(dragPx, maxDragPx)` (returns boolean: should the call answer)

---

### Task 1: Project scaffold, fonts, reset, and hero background

**Files:**
- Create: `index.html` (skeleton only — `<head>`, empty `<body>` with section comments)
- Create: `css/styles.css` (reset + fonts + CSS custom properties + `.hero` background)
- Create: `js/main.js` (empty — just a `document.addEventListener('DOMContentLoaded', () => {})` stub)

**Interfaces:**
- Produces: the `:root` custom properties every later task's CSS relies on: `--font-serif`, `--font-sans`, `--blue-primary: #2f6fe0`, `--blue-light: #6ea2f6`, `--ink: #161a1e`, `--ink-soft: #5a636e`, `--surface-soft: #eef1f5`, `--surface-navy: #0e1b30`.

- [ ] **Step 1: Create `index.html` skeleton**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RealtyReceptionAI — #1 AI Receptionist for Realtors</title>
<meta name="description" content="RealtyReceptionAI answers, screens, and books showings for realtors 24/7 — no missed calls, no missed leads.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Nunito+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
</head>
<body>
<!-- NAV -->
<!-- HERO -->
<!-- EDUCATION SECTION -->
<!-- HOW WE WORK SECTION -->
<!-- FINAL CTA -->
<!-- FOOTER -->
<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `css/styles.css` with reset, custom properties, and hero background**

```css
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: var(--font-sans); }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
button { font: inherit; cursor: pointer; }

:root {
  --font-serif: 'Newsreader', Georgia, serif;
  --font-sans: 'Nunito Sans', system-ui, sans-serif;
  --blue-primary: #2f6fe0;
  --blue-mid: #3f8bf5;
  --blue-light: #6ea2f6;
  --ink: #161a1e;
  --ink-soft: #5a636e;
  --surface-soft: #eef1f5;
  --surface-navy: #0e1b30;
}

.hero {
  position: relative;
  width: 100%;
  min-height: 900px;
  overflow: hidden;
  background: #2c8bf1 url('../assets/mountain-tall-1.jpg') center bottom / 122% auto no-repeat;
}

@keyframes ringShake {
  0%, 100% { transform: rotate(0); }
  18% { transform: rotate(-11deg); }
  36% { transform: rotate(10deg); }
  54% { transform: rotate(-7deg); }
  72% { transform: rotate(5deg); }
}
@keyframes phKnobPulse {
  0% { box-shadow: 0 0 0 0 rgba(52,199,89,.45); }
  70% { box-shadow: 0 0 0 18px rgba(52,199,89,0); }
  100% { box-shadow: 0 0 0 0 rgba(52,199,89,0); }
}
@keyframes phChev {
  0% { opacity: .2; } 50% { opacity: .9; } 100% { opacity: .2; }
}
@keyframes phTapCursor {
  0% { transform: translateX(-14px) translateY(70px) scale(1); }
  22% { transform: translateX(-14px) translateY(-73px) scale(1); }
  34% { transform: translateX(-14px) translateY(-73px) scale(.8); }
  44% { transform: translateX(-14px) translateY(-73px) scale(1); }
  56% { transform: translateX(-14px) translateY(-73px) scale(.8); }
  66% { transform: translateX(-14px) translateY(-73px) scale(1); }
  67% { transform: translateX(-14px) translateY(70px) scale(1); }
  100% { transform: translateX(-14px) translateY(70px) scale(1); }
}
@keyframes phSwipeCursor {
  0% { transform: translateX(0) scale(1); opacity: .5; }
  15% { transform: translateX(0) scale(.85); opacity: 1; }
  80% { transform: translateX(150px) scale(.85); opacity: 1; }
  100% { transform: translateX(150px) scale(1); opacity: 0; }
}
```

Values (colors, `min-height:900px`, `122% auto` background-size) are taken from `docs/superpowers/reference/cluely-header-desktop.dc.html` lines 15-26 (keyframes) and line 48 (hero background declaration).

- [ ] **Step 3: Create `js/main.js` stub**

```js
document.addEventListener('DOMContentLoaded', () => {
  // section initializers are added in later tasks
});
```

- [ ] **Step 4: Verify in browser**

Open `index.html` directly in a browser (double-click or `file://` path). Expected: a full-viewport-tall blue section with the mountain-sunrise photo as its background, no console errors. No text/nav yet — that's expected at this step.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "Scaffold static site with fonts, reset, and hero background"
```

---

### Task 2: Nav (desktop + mobile) and hero text/CTA

**Files:**
- Modify: `index.html` (replace `<!-- NAV -->` and `<!-- HERO -->` comments)
- Modify: `css/styles.css` (append nav + mobile nav + hero text styles)
- Modify: `js/main.js` (add `initNavScroll`, `initMobileMenu`)

**Interfaces:**
- Consumes: `:root` custom properties from Task 1.
- Produces: `.nav`/`.nav__inner`/`.nav__cta` elements that Task 3+ do not touch; `initNavScroll()` and `initMobileMenu()` functions called from the `DOMContentLoaded` listener.

- [ ] **Step 1: Add nav + hero text markup to `index.html`**

Desktop nav content/copy: `docs/superpowers/reference/cluely-header-desktop.dc.html` lines 30-47 (logo SVG, "RealtyReceptionAI" wordmark, FAQ/Mobile/Blog links, "Book a Meeting" CTA with calendar icon SVG).
Mobile nav + slide-down menu content/copy: `docs/superpowers/reference/cluely-header-mobile.dc.html` lines 26-52 (hamburger button, menu items: How it works/Features/Pricing/Book a Meeting).
Hero heading/subhead/CTA copy: desktop reference lines 58-66 ("#1 AI receptionist<br>for realtors", subhead paragraph, CTA button) — copy is identical between desktop/mobile reference files, only sizing differs (handled in CSS, not markup).

Structure both nav variants into the page (CSS will show/hide by breakpoint — do not use JS to swap markup):

```html
<header class="nav">
  <nav class="nav__inner">
    <a href="#" class="nav__logo">
      <svg width="30" height="30" viewBox="0 0 64 64" fill="none"><path d="M32 8 L54 24 V44 a4 4 0 0 1-4 4 H36 l-8 9 v-9 H14 a4 4 0 0 1-4-4 V24 Z" fill="rgba(255,255,255,.16)" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><circle cx="24" cy="34" r="3" fill="#fff"/><circle cx="32" cy="34" r="3" fill="#fff"/><circle cx="40" cy="34" r="3" fill="#fff"/></svg>
      <span>RealtyReception<span class="nav__logo-ai">AI</span></span>
    </a>
    <a href="#" class="nav__link nav__link--faq">FAQ</a>
    <a href="#" class="nav__link">Mobile</a>
    <a href="#" class="nav__link">Blog</a>
    <a href="https://calendly.com/andre-devilladesign/free-20-minute-chat" target="_blank" rel="noopener" class="nav__cta">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>
      Book a Meeting
    </a>
  </nav>
</header>

<div class="mnav">
  <div class="mnav__bar">
    <a href="#" class="mnav__logo">
      <svg width="24" height="24" viewBox="0 0 64 64" fill="none"><path d="M32 8 L54 24 V44 a4 4 0 0 1-4 4 H36 l-8 9 v-9 H14 a4 4 0 0 1-4-4 V24 Z" fill="rgba(255,255,255,.16)" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><circle cx="24" cy="34" r="3" fill="#fff"/><circle cx="32" cy="34" r="3" fill="#fff"/><circle cx="40" cy="34" r="3" fill="#fff"/></svg>
      <span>RealtyReception<span class="nav__logo-ai">AI</span></span>
    </a>
    <button type="button" class="mnav__toggle" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="mnav__menu">
    <a href="#how-we-work" class="mnav__item">How it works</a>
    <a href="#" class="mnav__item">Features</a>
    <a href="#" class="mnav__item">Pricing</a>
    <a href="https://calendly.com/andre-devilladesign/free-20-minute-chat" target="_blank" rel="noopener" class="mnav__item mnav__item--cta">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>
      Book a Meeting
    </a>
  </div>
</div>

<section class="hero">
  <div class="hero__spacer"></div>
  <div class="hero__content">
    <h1 class="hero__title">#1 AI receptionist<br>for realtors</h1>
    <p class="hero__subtitle">While you're showing homes, your phone is ringing. Our AI answers, screens, and books the appointment before the caller moves to the next agent.</p>
    <a href="https://calendly.com/andre-devilladesign/free-20-minute-chat" target="_blank" rel="noopener" class="hero__cta">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>
      Book a Meeting
    </a>
    <div class="hero__demo-heading">
      <h2>Try it for yourself</h2>
      <p>Select "Try it yourself", then drag the green button across to answer →</p>
    </div>
    <!-- .phone markup added in Task 3 -->
  </div>
  <div class="hero__fade"></div>
</section>
```

- [ ] **Step 2: Add nav/hero CSS to `css/styles.css`**

Desktop nav: fixed, transparent, centered `max-width:1400px`; `.nav__cta` uses gradient `linear-gradient(180deg,#3f8bf5,#2f6fe0)`. Mobile nav (`.mnav`): fixed dark bar (`background:#0e1b30`), hamburger + slide-down `.mnav__menu` panel (`background:rgba(14,27,48,.92)`, `backdrop-filter:blur(20px)`). Exact values: desktop reference lines 30-47, mobile reference lines 26-52.

```css
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 30; display: flex; justify-content: center; padding: 26px 40px 0; transition: padding .38s cubic-bezier(.4,0,.2,1); }
.nav__inner { display: flex; align-items: center; gap: 44px; width: 100%; max-width: 1400px; border-radius: 0; background: transparent; transition: max-width .38s cubic-bezier(.4,0,.2,1), padding .38s cubic-bezier(.4,0,.2,1), border-radius .38s cubic-bezier(.4,0,.2,1), background .38s ease, box-shadow .38s ease, backdrop-filter .38s ease; }
.nav__logo { display: flex; align-items: center; gap: 9px; font-weight: 800; font-size: 26px; letter-spacing: -.01em; color: #fff; margin-right: 8px; }
.nav__logo-ai { margin-left: 6px; }
.nav__link { font-weight: 700; font-size: 17px; color: #fff; }
.nav__link:hover { opacity: .85; }
.nav__link--faq { padding: 9px 15px; border: 1.5px solid rgba(255,255,255,.9); border-radius: 9px; text-decoration: underline; text-underline-offset: 3px; }
.nav__cta { margin-left: auto; transform: translate(-30px,-8px); display: inline-flex; align-items: center; gap: 11px; padding: 14px 25px; background: linear-gradient(180deg,#3f8bf5,#2f6fe0); color: #fff; font-weight: 800; font-size: 20px; border-radius: 13px; box-shadow: 0 8px 20px rgba(47,111,224,.35), inset 0 1px 0 rgba(255,255,255,.3); transition: transform .38s cubic-bezier(.4,0,.2,1); }
.hero__spacer { height: 84px; }

.mnav { display: none; }

.hero__content { position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 60px 24px 0; }
.hero__title { font-family: var(--font-serif); font-weight: 400; font-size: 104px; line-height: 1.02; letter-spacing: -.01em; color: #fff; margin: 0; text-shadow: 0 1px 24px rgba(60,110,170,.18); }
.hero__subtitle { font-weight: 700; font-size: 26px; line-height: 1.4; color: #fff; max-width: 720px; margin: 44px auto 0; text-shadow: 0 1px 12px rgba(60,110,170,.2); }
.hero__cta { position: relative; z-index: 3; display: inline-flex; align-items: center; gap: 12px; margin-top: 52px; padding: 18px 32px; background: linear-gradient(180deg,#3f8bf5,#2f6fe0); color: #fff; font-weight: 800; font-size: 20px; border-radius: 12px; box-shadow: 0 12px 30px rgba(47,111,224,.4), inset 0 1px 0 rgba(255,255,255,.3); }
.hero__demo-heading { text-align: center; margin-top: 120px; }
.hero__demo-heading h2 { font-family: var(--font-serif); font-weight: 400; font-size: 60px; line-height: 1.05; letter-spacing: -.01em; color: #fff; margin: 0; text-shadow: 0 1px 18px rgba(60,110,170,.2); }
.hero__demo-heading p { font-weight: 700; font-size: 18px; color: rgba(255,255,255,.9); margin: 14px 0 0; text-shadow: 0 1px 10px rgba(60,110,170,.2); }
.hero__fade { position: absolute; left: 0; right: 0; bottom: 0; height: 220px; background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.5) 55%, #ffffff 100%); pointer-events: none; z-index: 2; }
```

- [ ] **Step 3: Implement `initNavScroll()` in `js/main.js`**

Ports the DC `_onScroll` handler (desktop reference lines 620-636). Interpolates padding/max-width/border-radius/background/box-shadow/backdrop-filter/CTA offset by scroll position 0→320px.

```js
function initNavScroll() {
  const nav = document.querySelector('.nav');
  const inner = document.querySelector('.nav__inner');
  const cta = document.querySelector('.nav__cta');
  if (!nav || !inner) return;
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const p = Math.min(1, y / 320);
    nav.style.padding = (26 - 12 * p) + 'px 40px 0';
    inner.style.maxWidth = (1400 - 250 * p) + 'px';
    inner.style.borderRadius = (999 * p) + 'px';
    inner.style.padding = p > 0.02 ? '10px 14px 10px 26px' : '0';
    inner.style.gap = (44 - 16 * p) + 'px';
    inner.style.background = 'rgba(59,105,190,' + (0.7 * p).toFixed(3) + ')';
    inner.style.boxShadow = p > 0.02 ? ('0 14px 38px rgba(8,16,34,' + (0.42 * p).toFixed(3) + ')') : 'none';
    inner.style.backdropFilter = p > 0.02 ? ('blur(' + (22 * p).toFixed(1) + 'px)') : 'none';
    inner.style.webkitBackdropFilter = inner.style.backdropFilter;
    if (cta) cta.style.transform = 'translate(' + (-30 + 30 * p) + 'px,' + (-8 + 8 * p) + 'px)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
```

- [ ] **Step 4: Implement `initMobileMenu()` in `js/main.js`**

Ports DC `toggleMenu` (mobile reference lines 358, ~419-421).

```js
function initMobileMenu() {
  const toggle = document.querySelector('.mnav__toggle');
  const menu = document.querySelector('.mnav__menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}
```

Add corresponding CSS (append to `css/styles.css`):

```css
@media (max-width: 900px) {
  .nav { display: none; }
  .mnav { display: block; }
  .mnav__bar { position: fixed; top: 0; left: 0; right: 0; z-index: 30; display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: #0e1b30; box-shadow: 0 8px 24px rgba(8,16,34,.28); }
  .mnav__logo { display: flex; align-items: center; gap: 7px; font-weight: 800; font-size: 19px; letter-spacing: -.01em; color: #fff; }
  .mnav__toggle { display: flex; flex-direction: column; justify-content: center; gap: 5px; width: 42px; height: 42px; padding: 0 10px; border: none; background: rgba(255,255,255,.16); border-radius: 11px; }
  .mnav__toggle span { height: 2px; background: #fff; border-radius: 2px; }
  .mnav__menu { position: fixed; top: 64px; left: 0; right: 0; z-index: 29; padding: 0 18px; transform: translateY(-12px); opacity: 0; pointer-events: none; transition: transform .32s cubic-bezier(.4,0,.2,1), opacity .32s ease; display: flex; flex-direction: column; gap: 4px; background: rgba(14,27,48,.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 18px; margin: 0 18px; padding: 16px; box-shadow: 0 20px 50px rgba(8,16,34,.4); }
  .mnav__menu.is-open { transform: translateY(0); opacity: 1; pointer-events: auto; }
  .mnav__item { padding: 13px 14px; border-radius: 11px; font-weight: 700; font-size: 17px; color: #eaf1fb; }
  .mnav__item--cta { margin-top: 6px; display: flex; align-items: center; justify-content: center; gap: 9px; padding: 15px; background: linear-gradient(180deg,#3f8bf5,#2f6fe0); color: #fff; border-radius: 12px; }

  .hero { background-size: 165% auto; padding-bottom: 40px; }
  .hero__spacer { height: 88px; background: #0e1b30; }
  .hero__content { padding: 34px 22px 0; }
  .hero__title { font-size: 46px; line-height: 1.03; }
  .hero__subtitle { font-size: 17px; line-height: 1.45; margin-top: 22px; }
  .hero__cta { margin-top: 30px; padding: 16px 28px; font-size: 18px; }
  .hero__demo-heading { margin-top: 70px; }
  .hero__demo-heading h2 { font-size: 32px; }
}
```

(`background-size:165% auto` and `padding-bottom:40px` from mobile reference line 26; nav bar values from mobile reference lines 29-52; hero heading sizes are a reasonable scale-down consistent with the mobile reference's proportions — the mobile `.dc.html` doesn't restate hero heading sizes verbatim since it's a from-scratch section, so use mobile reference lines 63-64 exactly: `font-size:46px` title, `font-size:17px` subtitle.)

- [ ] **Step 5: Wire initializers into `js/main.js`**

```js
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
});
```

- [ ] **Step 6: Verify in browser**

At desktop width: nav is transparent at top, condenses into a rounded blurred pill with a dark-blue tint after scrolling ~320px. Hero heading/subhead/CTA render centered over the mountain photo. At ≤900px width (resize browser or devtools device toolbar): dark fixed nav bar with hamburger shows instead; tapping it slides down the menu; tapping again closes it.

- [ ] **Step 7: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "Add desktop and mobile nav, hero heading/CTA, scroll and menu interactivity"
```

---

### Task 3: Interactive iPhone demo

**Files:**
- Modify: `index.html` (add `.phone` markup inside `.hero__content`, after `.hero__demo-heading`)
- Modify: `css/styles.css` (append phone styles, desktop + mobile scale override)
- Modify: `js/main.js` (add `initPhoneDemo()`, pure helpers `formatCallTime`, `dragAnswerThreshold`)
- Test: `js/main.test.mjs` (Node-run assertions for the two pure helpers)

**Interfaces:**
- Consumes: nothing beyond DOM structure it owns.
- Produces: `formatCallTime(seconds)` → `"MM:SS"` string; `dragAnswerThreshold(dragPx, maxDragPx)` → boolean, used by `initPhoneDemo()`'s pointerup handler.

- [ ] **Step 1: Write the failing test for the pure helpers**

```js
// js/main.test.mjs
import assert from 'node:assert/strict';
import { formatCallTime, dragAnswerThreshold, easeOutCubic } from './main.js';

assert.equal(formatCallTime(0), '00:00');
assert.equal(formatCallTime(26), '00:26');
assert.equal(formatCallTime(65), '01:05');
assert.equal(formatCallTime(600), '10:00');

assert.equal(dragAnswerThreshold(0, 244), false);
assert.equal(dragAnswerThreshold(200, 244), true);   // 200/244 = .82, at threshold
assert.equal(dragAnswerThreshold(199, 244), false);  // just under .82
assert.equal(dragAnswerThreshold(244, 244), true);   // full drag

assert.ok(Math.abs(easeOutCubic(0) - 0) < 1e-9);
assert.ok(Math.abs(easeOutCubic(1) - 1) < 1e-9);
assert.ok(easeOutCubic(0.5) > 0.5); // ease-out: past the midpoint early

console.log('main.test.mjs: all assertions passed');
```

`js/main.js` must export these three via `export function` so the test file (`type: module`, run standalone with `node`) can import them, while still working as a plain `<script src="js/main.js">` — top-level `export` statements are a syntax error in a non-module script tag, so **Step 3 below loads it as `<script type="module" src="js/main.js">`** (update the `<script>` tag in `index.html`).

- [ ] **Step 2: Run test to verify it fails**

Run: `node js/main.test.mjs`
Expected: FAIL — `formatCallTime`/`dragAnswerThreshold`/`easeOutCubic` are not exported yet (or don't exist), Node throws `SyntaxError` or `TypeError: formatCallTime is not a function`.

- [ ] **Step 3: Update `index.html` script tag to a module**

```html
<script type="module" src="js/main.js"></script>
```

- [ ] **Step 4: Add phone markup to `index.html`**

Structure/copy from desktop reference lines 82-179 (status bar icons, avatar, controls grid, drag track, lock overlay, hint cursors). Convert the DC `sc-if` blocks into three plain always-present containers toggled by CSS via `[data-phase]` on `.phone__screen`, plus a separate `.phone__lock` overlay toggled by a `.phone--started` class on `.phone`:

```html
<div class="phone">
  <div class="phone__blur-bg"></div>
  <div class="phone__glow-bg"></div>
  <div class="phone__body">
    <div class="phone__screen" data-phase="ringing">
      <div class="phone__notch"></div>
      <div class="phone__status-bar">
        <span>9:41</span>
        <span class="phone__status-icons">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="#fff"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
          <svg width="16" height="11" viewBox="0 0 16 12" fill="#fff"><path d="M8 2.6c2 0 3.9.8 5.3 2.1l1.2-1.3C12.8 1.7 10.5.8 8 .8S3.2 1.7 1.5 3.4l1.2 1.3C4.1 3.4 6 2.6 8 2.6Zm0 3.2c1.1 0 2.1.4 2.9 1.2l1.2-1.3C11 4.7 9.6 4.1 8 4.1s-3 .6-4.1 1.6l1.2 1.3C5.9 6.2 6.9 5.8 8 5.8Zm0 3.1 1.7-1.8c-.4-.5-1-.8-1.7-.8s-1.3.3-1.7.8L8 8.9Z"/></svg>
          <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="1" y="1" width="21" height="10" rx="3" stroke="#fff" stroke-opacity=".5"/><rect x="2.5" y="2.5" width="18" height="7" rx="1.5" fill="#fff"/><rect x="23" y="4" width="2" height="4" rx="1" fill="#fff" fill-opacity=".5"/></svg>
        </span>
      </div>
      <div class="phone__caller">
        <div class="phone__avatar">A</div>
        <div class="phone__caller-name">Ava · AI Receptionist</div>
        <div class="phone__status-line">incoming call…</div>
      </div>

      <div class="phone__controls">
        <!-- 6 buttons: mute, keypad, audio, add call, FaceTime, contacts — copy verbatim from desktop reference lines 95-121, each as .phone__control-btn with an .phone__control-icon circle + label span -->
      </div>
      <button type="button" class="phone__end-call" aria-label="End call">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" style="transform:rotate(135deg)"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2Z"/></svg>
      </button>

      <div class="phone__track">
        <div class="phone__track-label">
          slide to answer
          <span class="phone__chev" style="animation-delay:0s">›</span>
          <span class="phone__chev" style="animation-delay:.15s">›</span>
        </div>
        <button type="button" class="phone__knob" aria-label="Slide to answer">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2Z"/></svg>
        </button>
      </div>

      <div class="phone__home-indicator"></div>

      <div class="phone__lock">
        <div class="phone__lock-card">
          <span class="phone__lock-badge">● Live demo</span>
          <h3>Talk to Ava like a real caller</h3>
          <p>Answer the call, then ask what a buyer would ask a realtor — "Is 128 Maple Ave still available?", "Can I tour it this weekend?", "What's the price?"</p>
          <button type="button" class="phone__lock-start">Try it yourself →</button>
        </div>
        <div class="phone__tap-hint">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#fff" style="filter:drop-shadow(0 3px 6px rgba(0,0,0,.45))"><path d="M6 3l14 8-6 1.4L11 20 6 3z"/></svg>
        </div>
      </div>
      <div class="phone__swipe-hint">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="#fff" style="filter:drop-shadow(0 3px 6px rgba(0,0,0,.45))"><path d="M6 3l14 8-6 1.4L11 20 6 3z"/></svg>
      </div>
    </div>
  </div>
</div>
```

Fill in the 6 `.phone__control-btn` entries verbatim (icon paths + labels: mute, keypad, audio, add call, FaceTime, contacts) from desktop reference lines 95-121 — each button is `<div class="phone__control-btn"><div class="phone__control-icon">[svg]</div><span>[label]</span></div>`.

- [ ] **Step 5: Add phone CSS to `css/styles.css`**

State visibility is driven entirely by attribute/class selectors so JS only ever toggles `data-phase` and two classes (`.phone--started`, `.phone__knob.is-dragging`):

```css
.phone { position: relative; margin-top: 44px; margin-bottom: 60px; display: flex; justify-content: center; }
.phone__blur-bg { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 346px; height: 660px; border-radius: 58px; background: rgba(255,255,255,.14); backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px); box-shadow: 0 30px 80px rgba(30,50,90,.25); z-index: 0; }
.phone__glow-bg { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 470px; height: 640px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,255,255,.45), rgba(255,255,255,0)); filter: blur(48px); z-index: 0; }
.phone__body { position: relative; z-index: 1; width: 300px; height: 614px; border-radius: 52px; background: #0a0a0c; padding: 12px; box-shadow: 0 40px 90px rgba(30,50,90,.35), 0 0 0 3px rgba(255,255,255,.14); }
.phone__screen { position: relative; width: 100%; height: 100%; border-radius: 42px; overflow: hidden; background: linear-gradient(180deg,#4a4038 0%,#3a3230 45%,#2b3550 100%); color: #fff; font-family: -apple-system, var(--font-sans); }
.phone__notch { position: absolute; top: 11px; left: 50%; transform: translateX(-50%); width: 90px; height: 22px; background: #0a0a0c; border-radius: 16px; z-index: 3; }
.phone__status-bar { display: flex; align-items: center; justify-content: space-between; padding: 15px 26px 0; font-size: 14px; font-weight: 600; }
.phone__status-icons { display: flex; align-items: center; gap: 5px; transform: translateX(9px); }
.phone__caller { text-align: center; margin-top: 46px; }
.phone__avatar { width: 92px; height: 92px; margin: 0 auto; border-radius: 50%; background: linear-gradient(155deg,#6ea2f6,#3f78e6); display: flex; align-items: center; justify-content: center; font-family: var(--font-serif); font-size: 38px; font-weight: 500; box-shadow: 0 10px 26px rgba(20,40,90,.4); }
.phone__screen[data-phase="ringing"] .phone__avatar { animation: ringShake 1.1s ease-in-out infinite; }
.phone__caller-name { font-size: 22px; font-weight: 500; letter-spacing: -.01em; margin-top: 16px; }
.phone__status-line { font-size: 17px; color: rgba(255,255,255,.7); margin-top: 6px; }

.phone__controls { position: absolute; bottom: 118px; left: 0; right: 0; display: none; grid-template-columns: repeat(3,1fr); row-gap: 38px; justify-items: center; padding: 0 20px; }
.phone__control-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.phone__control-icon { width: 66px; height: 66px; border-radius: 50%; background: rgba(255,255,255,.18); display: flex; align-items: center; justify-content: center; }
.phone__control-btn span { font-size: 13px; }
.phone__end-call { position: absolute; bottom: 44px; left: 50%; transform: translateX(-50%); width: 66px; height: 66px; border-radius: 50%; background: #f5382e; border: none; display: none; align-items: center; justify-content: center; box-shadow: 0 6px 18px rgba(245,56,46,.4); }

.phone__track { position: absolute; bottom: 52px; left: 22px; right: 22px; height: 70px; border-radius: 999px; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.22); overflow: hidden; display: none; }
.phone__track-label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 7px; font-size: 15px; font-weight: 600; color: rgba(255,255,255,.85); padding-left: 62px; pointer-events: none; }
.phone__chev { animation: phChev 1.2s ease-in-out infinite; }
.phone__knob { position: absolute; top: 4px; left: 4px; width: 62px; height: 62px; border-radius: 50%; background: #34c759; border: none; display: flex; align-items: center; justify-content: center; cursor: grab; touch-action: none; transform: translateX(0px); transition: transform .32s cubic-bezier(.34,1.4,.5,1); animation: phKnobPulse 1.8s ease-out infinite; }
.phone__knob.is-dragging { transition: none; }

.phone__home-indicator { position: absolute; bottom: 9px; left: 50%; transform: translateX(-50%); width: 130px; height: 5px; border-radius: 3px; background: rgba(255,255,255,.85); }

.phone__lock { position: absolute; inset: 0; border-radius: 42px; background: rgba(18,35,63,.34); backdrop-filter: blur(9px); -webkit-backdrop-filter: blur(9px); display: flex; align-items: center; justify-content: center; padding: 18px; z-index: 6; }
.phone__lock-card { width: 100%; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.28); border-radius: 24px; box-shadow: 0 24px 60px rgba(12,30,70,.4); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); padding: 26px 22px; text-align: center; color: #fff; }
.phone__lock-badge { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #bcd8fb; background: rgba(255,255,255,.14); padding: 5px 12px; border-radius: 999px; }
.phone__lock-card h3 { font-family: var(--font-serif); font-weight: 500; font-size: 24px; line-height: 1.12; margin: 14px 0 0; }
.phone__lock-card p { font-size: 14px; line-height: 1.55; color: rgba(230,240,255,.86); margin: 11px 0 0; }
.phone__lock-start { margin-top: 20px; width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 14px; border: none; border-radius: 13px; background: linear-gradient(180deg,#3f8bf5,#2f6fe0); color: #fff; font-family: var(--font-sans); font-weight: 800; font-size: 15px; box-shadow: 0 12px 30px rgba(47,111,224,.45); }
.phone__tap-hint { position: absolute; left: 50%; bottom: 64px; transform: translateX(-14px); z-index: 8; pointer-events: none; animation: phTapCursor 2.4s ease-in-out infinite; }
.phone__swipe-hint { position: absolute; left: 34px; bottom: 64px; z-index: 8; pointer-events: none; display: none; animation: phSwipeCursor 1.9s ease-in-out infinite; }

/* phase visibility */
.phone__screen[data-phase="ringing"] .phone__track { display: block; }
.phone__screen[data-phase="live"] .phone__controls,
.phone__screen[data-phase="live"] .phone__end-call { display: flex; }
.phone:not(.phone--started) .phone__lock { display: flex; }
.phone.phone--started .phone__lock { display: none; }
.phone.phone--started.phone--drag-zero .phone__swipe-hint { display: block; }
```

Mobile override (append inside the existing `@media (max-width: 900px)` block from Task 2), matching mobile reference lines 55-58 (`transform:scale(.87)`, container `height:534px`):

```css
  .phone-wrap { transform: scale(.87); transform-origin: top center; }
  .hero__phone-outer { margin-top: 70px; height: 534px; display: flex; justify-content: center; align-items: flex-start; }
```

Wrap `.phone` in `<div class="hero__phone-outer"><div class="phone-wrap">...</div></div>` in `index.html` (Step 4) to support this scale wrapper — update Step 4's markup accordingly (outer two wrapper divs added around the existing `.phone` root).

- [ ] **Step 6: Implement pure helpers + `initPhoneDemo()` in `js/main.js`**

```js
export function formatCallTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

export function dragAnswerThreshold(dragPx, maxDragPx) {
  if (maxDragPx <= 0) return false;
  return dragPx >= maxDragPx * 0.82;
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function initPhoneDemo() {
  const phone = document.querySelector('.phone');
  if (!phone) return;
  const screen = phone.querySelector('.phone__screen');
  const track = phone.querySelector('.phone__track');
  const knob = phone.querySelector('.phone__knob');
  const statusLine = phone.querySelector('.phone__status-line');
  const startBtn = phone.querySelector('.phone__lock-start');
  const endBtn = phone.querySelector('.phone__end-call');

  let drag = 0, dragging = false, startX = 0, timerId = null, seconds = 0;

  const maxDrag = () => track ? track.clientWidth - 62 - 8 : 252;

  const setDrag = (px) => {
    drag = Math.max(0, Math.min(maxDrag(), px));
    knob.style.transform = 'translateX(' + drag + 'px)';
    phone.classList.toggle('phone--drag-zero', drag === 0 && !dragging);
  };

  const reset = () => {
    clearInterval(timerId);
    screen.dataset.phase = 'ringing';
    statusLine.textContent = 'incoming call…';
    setDrag(0);
  };

  const answer = () => {
    screen.dataset.phase = 'live';
    seconds = 0;
    statusLine.textContent = formatCallTime(seconds);
    clearInterval(timerId);
    timerId = setInterval(() => {
      seconds += 1;
      statusLine.textContent = formatCallTime(seconds);
    }, 1000);
  };

  startBtn.addEventListener('click', () => {
    phone.classList.add('phone--started');
    reset();
  });

  endBtn.addEventListener('click', reset);

  knob.addEventListener('pointerdown', (e) => {
    if (!phone.classList.contains('phone--started') || screen.dataset.phase !== 'ringing') return;
    e.preventDefault();
    startX = e.clientX - drag;
    dragging = true;
    knob.classList.add('is-dragging');

    const onMove = (ev) => setDrag(ev.clientX - startX);
    const onUp = () => {
      dragging = false;
      knob.classList.remove('is-dragging');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (dragAnswerThreshold(drag, maxDrag())) {
        setDrag(maxDrag());
        answer();
      } else {
        setDrag(0);
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  });
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `node js/main.test.mjs`
Expected: `main.test.mjs: all assertions passed` printed, exit code 0.

- [ ] **Step 8: Wire `initPhoneDemo()` into the `DOMContentLoaded` listener**

```js
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
  initPhoneDemo();
});
```

- [ ] **Step 9: Verify in browser**

Phone shows the lock overlay ("Talk to Ava like a real caller" / "Try it yourself →"). Click it: overlay disappears, "slide to answer" track appears, avatar shakes, status line says "incoming call…". Drag the green knob most of the way across (or click-drag past ~82%): call becomes live — controls grid + red end-call button appear, status line starts counting up (`00:00`, `00:01`, …). Click the red end-call button: returns to the ringing/slide-to-answer state. Dragging less than 82% and releasing snaps the knob back to the start.

- [ ] **Step 10: Commit**

```bash
git add index.html css/styles.css js/main.js js/main.test.mjs
git commit -m "Add interactive iPhone demo: lock, slide-to-answer drag, live call state"
```

---

### Task 4: "How your AI receptionist handles every call" section (cards, tabs, waveform, stats)

**Files:**
- Modify: `index.html` (replace `<!-- EDUCATION SECTION -->` comment)
- Modify: `css/styles.css` (append section styles + mobile overrides)
- Modify: `js/main.js` (add `initTabs()`, `initStatCounters()`, waveform bar generation)
- Test: append to `js/main.test.mjs`

**Interfaces:**
- Consumes: `easeOutCubic` from Task 3.
- Produces: `generateWaveformBars(count)` (pure, returns `Array<{h:number,o:number}>`), `initTabs()`, `initStatCounters()`.

- [ ] **Step 1: Write the failing test for `generateWaveformBars`**

Append to `js/main.test.mjs`:

```js
import { generateWaveformBars } from './main.js';

const bars = generateWaveformBars(46);
assert.equal(bars.length, 46);
bars.forEach(b => {
  assert.ok(b.h >= 8 && b.h <= 100, `bar height ${b.h} out of expected range`);
  assert.ok(b.o >= 0 && b.o <= 1, `bar opacity ${b.o} out of expected range`);
});
console.log('generateWaveformBars: all assertions passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node js/main.test.mjs`
Expected: FAIL — `generateWaveformBars is not a function`.

- [ ] **Step 3: Add section markup to `index.html`**

Content/copy source: desktop reference lines 180-374 (heading, both cards' headings/paragraphs, live-call timer/waveform, tab bar, all 4 tab panel contents verbatim — transcript lines, caller info grid, "sent to agent" email mock, recap — calendar week-grid mock, stats row).

```html
<section class="calls-section" id="how-it-handles-calls">
  <div class="calls-section__inner">
    <h2 class="calls-section__heading">How your AI receptionist handles every call</h2>
    <div class="calls-section__cards">

      <article class="call-card call-card--answer">
        <h3>Ava <span class="call-card__pill call-card__pill--answer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2f6fe0" stroke-width="2" stroke-linecap="round"><path d="M4 12v0M8 8v8M12 5v14M16 8v8M20 12v0"/></svg>answers</span> every call, instantly</h3>
        <p>She picks up on the first ring, greets the caller, and captures why they're calling — in real time, then sends all the relevant call information straight to you.</p>

        <div class="call-card__timer">
          <div class="call-card__timer-value">00:26</div>
          <div class="call-card__timer-label"><span class="call-card__live-dot"></span>Live call</div>
        </div>

        <div class="waveform" id="waveform"></div>

        <div class="call-card__panel">
          <div class="tabs" role="tablist">
            <button type="button" class="tab is-active" data-tab="transcription">✦ Transcription</button>
            <button type="button" class="tab" data-tab="info">Caller info</button>
            <button type="button" class="tab" data-tab="sent">Sent to agent</button>
            <button type="button" class="tab" data-tab="recap">Recap</button>
          </div>
          <div class="tab-content">
            <div class="tab-panel is-active" data-panel="transcription">
              <!-- 5 message bubbles verbatim from desktop reference lines 235-242 -->
            </div>
            <div class="tab-panel" data-panel="info">
              <!-- caller info grid verbatim from desktop reference lines 245-253 -->
            </div>
            <div class="tab-panel" data-panel="sent">
              <!-- sent-to-agent email mock verbatim from desktop reference lines 256-269 -->
            </div>
            <div class="tab-panel" data-panel="recap">
              <!-- recap verbatim from desktop reference lines 272-282 -->
            </div>
          </div>
        </div>
      </article>

      <article class="call-card call-card--book">
        <h3>Then Ava <span class="call-card__pill call-card__pill--book"><svg width="18" height="18" viewBox="0 0 24 24" fill="#2f6fe0"><path d="M12 2l2.2 6.6H21l-5.4 4 2.1 6.4L12 15.6 6.3 19l2.1-6.4-5.4-4h6.8z"/></svg>books</span> the showing</h3>
        <p>She screens the lead, checks your calendar, and locks in a showing before they call the next agent.</p>
        <!-- desktop week-calendar mock verbatim from desktop reference lines 292-361, class .calendar / .calendar__* -->
      </article>

    </div>

    <div class="stats" id="stats">
      <div class="stat"><div class="stat__value" data-target="78" data-decimals="0" data-suffix="%">78%</div><p class="stat__caption">Of buyers go with the first agent who responds.</p></div>
      <div class="stat"><div class="stat__value" data-target="2" data-decimals="0" data-prefix="&lt;" data-suffix="s">&lt;2s</div><p class="stat__caption">Average answer time — 24/7, every call picked up.</p></div>
      <div class="stat"><div class="stat__value" data-target="99.9" data-decimals="1" data-suffix="%">99.9%</div><p class="stat__caption">Uptime guaranteed on your AI receptionist.</p></div>
    </div>
  </div>
</section>
```

For the mobile agenda-style calendar (replacing the desktop week grid ≤900px), add a second markup block `.calendar-mobile` (content verbatim from mobile reference lines 197-208) and toggle visibility with CSS (`.calendar { display:block } .calendar-mobile { display:none }` desktop; swapped ≤900px) — do not use JS to swap calendar markup.

- [ ] **Step 4: Add section CSS to `css/styles.css`**

Card gradients/shadows/radii, tab bar, tab panel `min-height:252px`, waveform bar styling (`width:4px`, `border-radius:2px`, `background:#fff`), stats 3-column grid with `2px` gap dividers — all values verbatim from desktop reference lines 180-374. Mobile overrides (stacked single-column cards, `flex:1 1 0` waveform bars, single-day agenda calendar, stacked stats) from mobile reference lines 123-247, appended inside the existing `@media (max-width: 900px)` block.

Key selectors needed by JS (Step 5): `.tab.is-active`, `.tab-panel.is-active`, `.stat__value` (read via `data-target`/`data-decimals`/`data-prefix`/`data-suffix`), `#waveform` (bar container), `#stats` (IntersectionObserver root).

- [ ] **Step 5: Implement `generateWaveformBars`, `initTabs`, `initStatCounters` in `js/main.js`**

```js
export function generateWaveformBars(count) {
  const bars = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const env = t < 0.5 ? (0.55 + 0.45 * Math.sin(t * Math.PI * 3)) : Math.max(0.12, 1 - (t - 0.5) * 1.85);
    const v = 0.6 + 0.4 * Math.abs(Math.sin(i * 1.7));
    const h = Math.round(8 + env * v * 80);
    const o = t < 0.5 ? 0.92 : Math.max(0.26, 0.92 - (t - 0.5) * 1.25);
    bars.push({ h, o: Math.round(o * 100) / 100 });
  }
  return bars;
}

function renderWaveform() {
  const el = document.getElementById('waveform');
  if (!el) return;
  el.innerHTML = generateWaveformBars(46).map(
    bar => `<span class="waveform__bar" style="height:${bar.h}px;opacity:${bar.o}"></span>`
  ).join('');
}

export function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('is-active', t === tab));
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === target));
    });
  });
}

export function initStatCounters() {
  const root = document.getElementById('stats');
  const values = document.querySelectorAll('.stat__value');
  if (!root || !values.length) return;

  const format = (el, v) => (el.dataset.prefix || '') + v.toFixed(Number(el.dataset.decimals)) + (el.dataset.suffix || '');
  values.forEach(el => { el.textContent = format(el, 0); });

  const run = () => {
    const dur = 1400, start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = easeOutCubic(p);
      values.forEach(el => { el.textContent = format(el, Number(el.dataset.target) * eased); });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) { run(); return; }
  const io = new IntersectionObserver((entries, obs) => {
    if (entries.some(en => en.isIntersecting)) { obs.disconnect(); run(); }
  }, { threshold: 0.4 });
  io.observe(root);
}
```

Add `renderWaveform` to the exports used internally (no export needed — only called from the `DOMContentLoaded` listener alongside the others):

```js
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
  initPhoneDemo();
  renderWaveform();
  initTabs();
  initStatCounters();
});
```

- [ ] **Step 6: Run test to verify it passes**

Run: `node js/main.test.mjs`
Expected: both `generateWaveformBars` and earlier assertions pass, exit code 0.

- [ ] **Step 7: Verify in browser**

Section renders two cards (blue "Ava answers" card with a 46-bar waveform, light "Then Ava books" card with a week calendar). Clicking each of the 4 tabs swaps the panel content and highlights the active tab. Scrolling the stats row into view animates 78%, <2s, 99.9% counting up from 0 once, then stays put on further scroll.

- [ ] **Step 8: Commit**

```bash
git add index.html css/styles.css js/main.js js/main.test.mjs
git commit -m "Add call-handling section: cards, waveform, tabs, animated stat counters"
```

---

### Task 5: "How we work" section

**Files:**
- Modify: `index.html` (replace `<!-- HOW WE WORK SECTION -->` comment)
- Modify: `css/styles.css` (append section styles + mobile overrides)

**Interfaces:** none (static content, no JS).

- [ ] **Step 1: Add section markup to `index.html`**

Content/copy verbatim from desktop reference lines 375-439 (eyebrow "How we work", heading "From missed calls to booked showings", 4 numbered steps with titles/descriptions). Image element uses the real asset (not the DC placeholder slot):

```html
<section class="how-we-work" id="how-we-work">
  <div class="how-we-work__inner">
    <div class="how-we-work__image">
      <img src="assets/how-we-work-a.jpg" alt="Realtor on a call in a bright modern home">
    </div>
    <div class="how-we-work__content">
      <span class="how-we-work__eyebrow">How we work</span>
      <h2>From missed calls to booked showings</h2>
      <div class="steps">
        <div class="step">
          <div class="step__rail"><div class="step__marker">1</div><div class="step__line"></div></div>
          <div class="step__body"><h3>Initial Discussion</h3><p>A quick call about your listings, your hours, and the calls you keep missing.</p></div>
        </div>
        <div class="step">
          <div class="step__rail"><div class="step__marker">2</div><div class="step__line"></div></div>
          <div class="step__body"><h3>We build your receptionist</h3><p>We train Ava on your properties, calendar, and how you like to talk to leads.</p></div>
        </div>
        <div class="step">
          <div class="step__rail"><div class="step__marker">3</div><div class="step__line"></div></div>
          <div class="step__body"><h3>Go live in days</h3><p>Forward your line and Ava starts answering, screening, and booking — day one.</p></div>
        </div>
        <div class="step step--last">
          <div class="step__rail"><div class="step__marker step__marker--active">4</div></div>
          <div class="step__body step__body--active"><h3>Ongoing partnership</h3><p>We fine-tune how she handles calls and expand coverage as you grow.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add section CSS**

Desktop: `grid-template-columns: minmax(0,560px) 1fr`, image `aspect-ratio:3/4` `border-radius:30px`, step rail/marker/line styling — all values verbatim from desktop reference lines 375-439. Mobile: single column, image `aspect-ratio:4/5`, from mobile reference lines 249-303, inside the `@media (max-width: 900px)` block.

```css
.how-we-work { width: 100%; background: linear-gradient(180deg,#f4f6fa 0%,#f4f6fa 85%,#ffffff 100%); padding: 96px 40px 110px; }
.how-we-work__inner { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: minmax(0,560px) 1fr; gap: 64px; align-items: center; }
.how-we-work__image { position: relative; width: 100%; aspect-ratio: 3/4; border-radius: 30px; overflow: hidden; box-shadow: 0 30px 70px rgba(40,60,100,.16); }
.how-we-work__image img { width: 100%; height: 100%; object-fit: cover; }
.how-we-work__eyebrow { display: inline-flex; align-items: center; gap: 8px; color: #2f6fe0; font-weight: 800; font-size: 14px; letter-spacing: .08em; text-transform: uppercase; }
.how-we-work__content h2 { font-family: var(--font-serif); font-weight: 500; font-size: 64px; line-height: 1.06; letter-spacing: -.015em; color: var(--ink); margin: 14px 0 44px; text-wrap: balance; }
.step { display: flex; gap: 22px; }
.step__rail { display: flex; flex-direction: column; align-items: center; flex: none; }
.step__marker { width: 46px; height: 46px; border-radius: 50%; background: #fff; border: 1.5px solid rgba(20,30,50,.14); display: flex; align-items: center; justify-content: center; font-family: var(--font-serif); font-size: 20px; color: var(--ink-soft); }
.step__marker--active { background: #2f6fe0; border: none; color: #fff; box-shadow: 0 8px 20px rgba(47,111,224,.4); }
.step__line { flex: 1; width: 2px; background: rgba(20,30,50,.12); margin: 6px 0; }
.step__body { flex: 1; background: #fff; border: 1px solid rgba(20,30,50,.07); border-radius: 18px; padding: 22px 26px; box-shadow: 0 14px 34px rgba(40,60,100,.06); margin-bottom: 20px; }
.step__body--active { background: #eef3fd; border-color: rgba(47,111,224,.25); box-shadow: 0 14px 34px rgba(47,111,224,.1); margin-bottom: 0; }
.step__body h3 { font-size: 23px; font-weight: 800; letter-spacing: -.01em; color: var(--ink); margin: 0; }
.step__body p { font-size: 16.5px; line-height: 1.5; color: var(--ink-soft); margin: 8px 0 0; }

@media (max-width: 900px) {
  .how-we-work { padding: 56px 20px 64px; }
  .how-we-work__inner { grid-template-columns: 1fr; gap: 0; }
  .how-we-work__image { aspect-ratio: 4/5; margin-bottom: 34px; }
  .how-we-work__content h2 { font-size: 40px; margin: 12px 0 32px; }
}
```

- [ ] **Step 3: Verify in browser**

Section shows the real-estate lifestyle photo on the left (desktop) with the 4-step numbered timeline on the right; step 4 has a highlighted blue marker/card and no connecting line below it. At ≤900px, image stacks above the steps.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "Add how-we-work section: photo and 4-step timeline"
```

---

### Task 6: Final CTA and footer

**Files:**
- Modify: `index.html` (replace `<!-- FINAL CTA -->` and `<!-- FOOTER -->` comments)
- Modify: `css/styles.css` (append styles + mobile overrides)

**Interfaces:** none (static content, no JS).

- [ ] **Step 1: Add final CTA markup to `index.html`**

"Gradient ring" variant only (per Global Constraints) — content verbatim from desktop reference lines 476-486:

```html
<section class="cta-final">
  <div class="cta-final__ring">
    <div class="cta-final__inner">
      <h2>Meet your AI receptionist.</h2>
      <p>Book a free personalized demo — see exactly how your receptionist would sound for your business.</p>
      <a href="https://calendly.com/andre-devilladesign/free-20-minute-chat" target="_blank" rel="noopener" class="cta-final__btn">Book a free personalized demo →</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add footer markup to `index.html`**

Content verbatim from desktop reference lines 496-540 (brand blurb, Navigate column, Contact column, bottom bar):

```html
<footer class="footer">
  <div class="footer__inner">
    <div class="footer__grid">
      <div class="footer__brand">
        <a href="#" class="footer__logo">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none"><path d="M32 8 L54 24 V44 a4 4 0 0 1-4 4 H36 l-8 9 v-9 H14 a4 4 0 0 1-4-4 V24 Z" fill="rgba(255,255,255,.16)" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><circle cx="24" cy="34" r="3" fill="#fff"/><circle cx="32" cy="34" r="3" fill="#fff"/><circle cx="40" cy="34" r="3" fill="#fff"/></svg>
          <span>RealtyReception<span class="nav__logo-ai">AI</span></span>
        </a>
        <p>An AI receptionist built around how realtors actually work. Answer every call, screen every lead, and book showings — 24/7, automatically.</p>
      </div>
      <div class="footer__col">
        <div class="footer__col-title">Navigate</div>
        <a href="#how-we-work">How it works</a>
        <a href="#">Features</a>
        <a href="https://calendly.com/andre-devilladesign/free-20-minute-chat" target="_blank" rel="noopener">Book a free demo</a>
      </div>
      <div class="footer__col">
        <div class="footer__col-title">Contact</div>
        <a href="mailto:hello@realtyreceptionai.com">hello@realtyreceptionai.com</a>
        <a href="https://calendly.com/andre-devilladesign/free-20-minute-chat" target="_blank" rel="noopener">Book a call</a>
        <span>United States · Remote</span>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© 2026 RealtyReceptionAI. All rights reserved.</span>
      <div class="footer__legal"><a href="#">Privacy</a><a href="#">Terms</a></div>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Add CSS**

Values verbatim from desktop reference lines 440-540 (gradient ring colors `linear-gradient(135deg,#7ba9f7 0%,#2f6fe0 50%,#12233f 100%)` outer + `linear-gradient(180deg,#eaf3ff 0%,#bcd8fb 42%,#7fb0f2 78%,#5b93ec 100%)` inner; footer `background:#0e1b30`, 3-column grid `1.4fr 1fr 1fr`). Mobile overrides from mobile reference lines 305-354 (single-column footer, `padding:24px 20px 56px` CTA section).

```css
.cta-final { width: 100%; background: #ffffff; padding: 40px 40px 96px; }
.cta-final__ring { max-width: 1440px; margin: 0 auto; border-radius: 34px; padding: 2px; background: linear-gradient(135deg,#7ba9f7 0%,#2f6fe0 50%,#12233f 100%); box-shadow: 0 24px 60px rgba(47,111,224,.18); }
.cta-final__inner { border-radius: 32px; background: linear-gradient(180deg,#eaf3ff 0%,#bcd8fb 42%,#7fb0f2 78%,#5b93ec 100%); padding: 86px 40px; text-align: center; }
.cta-final__inner h2 { font-family: var(--font-serif); font-weight: 400; font-size: 60px; line-height: 1.05; letter-spacing: -.015em; color: #12233f; margin: 0; text-wrap: balance; }
.cta-final__inner p { font-size: 20px; line-height: 1.5; color: rgba(18,35,63,.72); margin: 20px 0 0; text-wrap: balance; }
.cta-final__btn { display: inline-flex; align-items: center; gap: 10px; margin-top: 38px; padding: 19px 40px; border-radius: 999px; background: linear-gradient(180deg,#3f8bf5,#2f6fe0); color: #fff; font-size: 16px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; box-shadow: 0 14px 40px rgba(47,111,224,.4); }

.footer { width: 100%; background: #0e1b30; padding: 80px 40px 46px; }
.footer__inner { max-width: 1440px; margin: 0 auto; }
.footer__grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 56px; }
.footer__logo { display: inline-flex; align-items: center; gap: 10px; font-weight: 800; font-size: 24px; letter-spacing: -.01em; color: #fff; }
.footer__brand p { font-size: 16px; line-height: 1.6; color: rgba(200,214,238,.72); margin: 22px 0 0; max-width: 360px; }
.footer__col-title { font-size: 12.5px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #6ea2f6; }
.footer__col { display: flex; flex-direction: column; }
.footer__col a, .footer__col span { font-size: 16.5px; color: rgba(214,226,246,.9); margin-top: 20px; }
.footer__col a:first-of-type { margin-top: 20px; }
.footer__col a + a, .footer__col a + span { margin-top: 14px; }
.footer__col a[href^="mailto"], .footer__col a[href^="https://calendly"] { color: #7fb0f2; }
.footer__bottom { margin-top: 64px; padding-top: 26px; border-top: 1px solid rgba(255,255,255,.1); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 14px; font-size: 14px; color: rgba(180,196,224,.6); }
.footer__legal { display: flex; gap: 26px; }
.footer__legal a { color: rgba(180,196,224,.6); }

@media (max-width: 900px) {
  .cta-final { padding: 24px 20px 56px; }
  .cta-final__ring { border-radius: 28px; }
  .cta-final__inner { padding: 52px 24px; border-radius: 26px; }
  .cta-final__inner h2 { font-size: 38px; line-height: 1.08; }
  .cta-final__inner p { font-size: 16px; }
  .cta-final__btn { margin-top: 28px; padding: 16px 26px; font-size: 14px; }

  .footer { padding: 52px 22px 36px; }
  .footer__grid { grid-template-columns: 1fr; gap: 34px; }
  .footer__bottom { flex-direction: column; gap: 12px; }
}
```

- [ ] **Step 4: Verify in browser**

Final CTA renders as a rounded gradient-ring card with "Meet your AI receptionist." heading and pill CTA button. Footer shows brand blurb + Navigate/Contact columns + bottom copyright/legal row, dark navy background. Click every CTA/footer link that should go to Calendly (final CTA button, "Book a free demo", "Book a call", nav "Book a Meeting" ×2) and confirm each opens `https://calendly.com/andre-devilladesign/free-20-minute-chat` in a new tab; confirm the email link opens a mail client via `mailto:`.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css
git commit -m "Add final CTA (gradient ring) and footer"
```

---

### Task 7: Full-page responsive and cross-browser QA pass

**Files:**
- Modify: `css/styles.css` (fix any gaps found — see below)
- Modify: `index.html` (fix any markup issues found)

**Interfaces:** none — this task verifies the whole page built in Tasks 1-6, no new components.

- [ ] **Step 1: Desktop pass**

Open `index.html` at ≥1440px width. Walk the spec's testing checklist:
- Scroll from top to bottom once slowly: nav condenses into a pill smoothly around 320px of scroll and stays condensed; no layout jump when the phone demo section is reached; stats animate once when scrolled into view and don't re-animate on further scrolling.
- Click all 4 call-detail tabs in the blue card; content and active-tab background/color swap correctly every time, including clicking the same tab twice.
- Run the phone demo end-to-end: locked → click "Try it yourself" → ringing (avatar shakes, "slide to answer" visible) → drag knob past 82% → live (timer counts, controls grid shows) → click end call → back to ringing. Also test: drag knob less than 82% and release — snaps back to 0, does not answer.

- [ ] **Step 2: Mobile pass**

Resize to ≤900px (or use browser devtools device toolbar at e.g. 390×844). Re-run the same checklist:
- Hamburger nav toggles the slide-down menu open/closed; menu links present (How it works/Features/Pricing/Book a Meeting).
- Hero, phone demo (scaled via `.phone-wrap`), cards (stacked), agenda-style calendar, stats (stacked), how-we-work (image above steps), final CTA, and footer (stacked) all render without horizontal overflow — verify `document.documentElement.scrollWidth` equals `window.innerWidth` via devtools console (no horizontal scrollbar).

- [ ] **Step 3: Fix any issues found**

There is no prescribed fix here — apply whatever CSS/markup corrections Steps 1-2 surfaced, re-verify the specific broken behavior, and repeat until both passes are clean.

- [ ] **Step 4: Run the full JS test suite one more time**

Run: `node js/main.test.mjs`
Expected: all assertions pass, exit code 0.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "Fix responsive/cross-viewport issues found in QA pass"
```

(Skip this commit if Step 3 found nothing to fix.)

---

## Self-Review Notes

- **Spec coverage:** nav (Task 2), hero + phone demo (Tasks 2-3), education section incl. tabs/stats (Task 4), how-we-work (Task 5), final CTA + footer (Task 6), responsive breakpoint (woven through Tasks 2-6 + verified in Task 7), Calendly links (woven through Tasks 2, 3, 6), real images (Task 5, already in repo from spec work) — all spec sections have a task.
- **Testing:** the only pure-logic pieces (time formatting, drag threshold, easing, waveform generation) have real Node-runnable assertions per Task Structure's TDD requirement; everything else (DOM/CSS/visual) is manually verified in-browser per step, matching the spec's own testing section (no framework for a static marketing page).
- **Type/name consistency checked:** `formatCallTime`, `dragAnswerThreshold`, `easeOutCubic`, `generateWaveformBars`, `initNavScroll`, `initMobileMenu`, `initPhoneDemo`, `initTabs`, `initStatCounters` are named identically everywhere they're defined, exported, tested, and invoked across Tasks 3-4.

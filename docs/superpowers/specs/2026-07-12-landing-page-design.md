# RealtyReceptionAI Landing Page — Design Spec

Date: 2026-07-12

## Purpose

Turn the "Cluely Header.dc.html" design (imported from claude.ai/design project
`38185f54-c423-4bc9-ae8a-1602cf48791f`) into a real, fully functional static
website: `RealtyReceptionAI`, an AI receptionist product for realtors.

The `.dc.html` source is authored in a design-tool-specific templating format
(`<x-dc>`, `sc-if`, `sc-for`, `{{ }}` bindings, a React-like `Component` class)
that depends on a runtime script (`support.js`) not meant for production. This
spec covers reimplementing the same visual design and interactivity as plain
HTML/CSS/JS.

## Scope

In scope: one landing page (`index.html`) covering nav, hero with interactive
phone demo, "how it handles every call" section, "how we work" section, final
CTA, footer — matching both `Cluely Header.dc.html` (desktop) and
`Cluely Header Mobile.dc.html` (≤900px) as a single responsive page.

Out of scope: `Blog.dc.html`, `Phone Demo.dc.html`, and `Cluely Header Phone
Pickup.dc.html` from the same design project — not requested.

## File structure

```
index.html
css/styles.css
js/main.js
assets/
  mountain-tall-1.png     (hero background, pulled from design project)
  how-we-work-a.png       (how-we-work section image, pulled from design project)
```

No build step, no framework. Google Fonts loaded via `<link>` (Newsreader +
Nunito Sans — the DC default font pairing).

## Responsive strategy

Single markup tree, single CSS file. Desktop-first styles matching
`Cluely Header.dc.html`, with a `@media (max-width: 900px)` block overriding
to the mobile design (`Cluely Header Mobile.dc.html`): hamburger nav +
slide-down menu instead of the inline pill nav, stacked (not side-by-side)
cards, agenda-style single-day calendar instead of the week grid, smaller
type scale, scaled-down phone demo.

900px is chosen because the desktop two-card row (`flex: 1 1 440px` each +
26px gap) needs roughly 906px to stay side-by-side before wrapping — below
that the desktop layout would already look cramped.

## Interactivity (ported from the DC `Component` class to vanilla JS)

All behavior below exists today in the DC source's `Component extends
DCLogic` — this is a straight port to plain event listeners / DOM writes,
not new design.

1. **Nav scroll transition (desktop only):** on scroll, nav padding shrinks
   and the inner `<nav>` gains a background/blur/shadow/rounded-pill
   treatment interpolated by scroll position (0 → 320px), same formula as
   the DC `_onScroll` handler.
2. **Mobile hamburger menu:** button toggles a slide-down panel
   (transform/opacity/pointer-events), same as DC `toggleMenu`.
3. **Phone demo state machine:** `locked → ringing → live`.
   - Locked: overlay with "Try it yourself →" button.
   - Ringing: drag the green knob along a track; releasing at ≥82% of max
     drag distance answers the call (same threshold as DC `phOnUp`);
     otherwise it snaps back. Pointer events (`pointerdown`/`pointermove`/
     `pointerup`) drive the drag, matching DC exactly.
   - Live: shows the control grid (mute/keypad/audio/add call/FaceTime/
     contacts) and a running call timer (`MM:SS`, ticking every second);
     tapping the red end-call button resets to ringing.
4. **Call-detail tabs:** four tabs (Transcription / Caller info / Sent to
   agent / Recap) swap panel content and active-tab styling on click, same
   mock data as the source.
5. **Animated stat counters:** the three stats (78%, <2s, 99.9%) count up
   from 0 with an ease-out cubic over 1400ms, triggered once via
   `IntersectionObserver` at 40% visibility — same easing/duration as DC.

## Content & links

- Copy, colors, spacing, and mock data (caller name "Daniel Reyes", property
  "128 Maple Ave", stats, footer text, etc.) are taken verbatim from the DC
  source — no invented content.
- All "Book a Meeting" / "Book a free personalized demo" / "Book a call" CTA
  buttons link to `https://calendly.com/andre-devilladesign/free-20-minute-chat`.
- Footer "hello@realtyreceptionai.com" stays a `mailto:` link as in the
  source.
- Nav items without a corresponding built page (FAQ, Blog, mobile menu's
  "Features"/"Pricing") are `#` placeholders. "How it works" links to the
  in-page `#how-we-work` section anchor.
- Final CTA uses the "Gradient ring" visual variant — the DC source's
  default (`ctaStyle` prop default), and the only variant the mobile design
  implements.

## Assets

`mountain-tall-1.png` and `how-we-work-a.png` from the design project both
exceed the 256KB read cap of the tool used to pull files out of the design
project, so they couldn't be fetched byte-for-byte at build time.
AI-generated stand-ins were used initially (matching subject only), then
replaced with the user's own exports of the original design assets —
`assets/mountain-tall-1.jpg` (896×1200 stylized mountain-sunrise
illustration) and `assets/how-we-work-a.jpg` (896×1200 photo of a realtor
with keys in front of a home), both recompressed to JPEG at the same
dimensions to cut file size without altering content.

## Testing

Manual verification in a browser (no test framework for a static marketing
page):
- Load the page at desktop width and at ≤900px width; confirm layout matches
  each DC source.
- Drag-to-answer at both widths; confirm answer triggers at the 82%
  threshold and snaps back below it.
- Click all four call-detail tabs; confirm content and active-state styling
  swap correctly.
- Scroll to the stats section; confirm counters animate once.
- Scroll the page; confirm the desktop nav condenses into a pill and the
  mobile hamburger menu opens/closes.
- Click all CTA buttons; confirm they open the Calendly link.

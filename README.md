# Base360 — Landing Page

**Every conversation, every channel, every lead — in one system.**

A static, dependency-free marketing landing page for Base360, built from the
landing page creative brief. Frontend only — no backend, no build step, no
frameworks.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## What's on the page

The page is built around the brief's hero example — one TikTok comment handled
end to end by AI:

1. **Hero** — headline, value prop, and an animated unified-inbox mockup
   showing comments, DMs, WhatsApp, calls, and email in one place.
2. **Problem** — comments go unanswered, leads slip through, no single view
   of the customer.
3. **How it works (the hero story)** — an auto-playing 6-step sequence with a
   phone mockup that acts each step out: TikTok comment → public AI reply →
   DM conversation → CRM high-intent lead → AI voice call → email nurture.
   Steps are clickable; playback pauses on hover and only runs while the
   section is on screen.
4. **The four things Base360 does** — unified inbox, AI agents, built-in CRM,
   marketing & subscribers, each with a small illustrative UI vignette.
5. **CTA + footer.**

## Stack & engineering notes

- `index.html` / `styles.css` / `app.js` — plain HTML, CSS custom properties,
  and ~100 lines of vanilla JS (IntersectionObserver reveals + the story
  stepper). No dependencies.
- Fully responsive (desktop → mobile), semantic markup, decorative mockups
  are `aria-hidden`.
- Respects `prefers-reduced-motion`: all animation is disabled and every
  screen state is shown statically.
- Google Fonts (Sora + Inter) with system-font fallbacks; everything else is
  self-contained.

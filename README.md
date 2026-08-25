# Dr. Isaac Fernando Meta, DDS — Practice Website

Trilingual (English / Spanish / Hebrew) marketing site for a dental practice,
built with Vue 3 and Vite. English is the default locale; Hebrew renders
right-to-left.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the production build
```

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Vue 3.5 (`<script setup>`, Composition API) |
| Build | Vite 6 |
| i18n | vue-i18n 11 (`legacy: false`) |
| Styling | Plain CSS with custom-property design tokens, scoped per component |

No CSS framework is used. Every directional rule is written with CSS **logical
properties** (`margin-inline`, `inset-inline-start`, `text-align: start`), so the
Hebrew RTL layout mirrors from `<html dir="rtl">` alone — there is no second
stylesheet to keep in sync.

## Project layout

```
src/
  App.vue                  root: section order, per-locale <title>/meta, JSON-LD
  main.js
  assets/styles/
    tokens.css             design tokens (colour, type, space, shadow, motion)
    base.css               reset, layout helpers, buttons, cards, reduced motion
  components/
    AppIcon.vue            inline-SVG icon set (no icon font, no emoji)
    SiteHeader.vue         sticky nav + mobile panel
    LanguageSwitcher.vue   EN / ES / HE menu, sets <html lang> and dir
    HeroSection.vue
    TrustSection.vue       stats + credentials
    ServicesSection.vue    six treatments
    AboutSection.vue
    ProcessSection.vue     four-step visit timeline
    TestimonialsSection.vue accessible carousel
    FaqSection.vue         native <details> accordion
    ContactSection.vue     WhatsApp, details, hours, validated form
    SiteFooter.vue
    WhatsappFab.vue        floating CTA, appears past the hero
  composables/useReveal.js IntersectionObserver scroll reveal
  data/site.js             contact details — single source of truth
  i18n/
    index.js               locale resolution, persistence, dir switching
    locales/{en,es,he}.json
design-system/isaac-fernando-meta-dds/MASTER.md   design decisions + overrides
```

## Internationalisation

Locale resolution order: saved `localStorage` choice → browser language →
English. Changing locale updates `<html lang>` and `<html dir>`, which is what
drives the RTL mirroring.

All three locale files hold an **identical key structure**, including array
lengths. To verify after editing:

```bash
node -e "const a=require('./src/i18n/locales/en.json'),b=require('./src/i18n/locales/he.json');const k=o=>Object.keys(o).flatMap(x=>typeof o[x]==='object'&&o[x]?[x,...k(o[x]).map(y=>x+'.'+y)]:[x]);const A=k(a),B=k(b);console.log('missing:',A.filter(x=>!B.includes(x)))"
```

Literal `@` in a message must be escaped as `{'@'}` — vue-i18n reads a bare `@`
as a linked-message token.

## Accessibility

Built against WCAG 2.2 AA:

- **Contrast** — all text pairs measured ≥ 4.58:1. The palette's bright
  `#0891B2` / `#059669` fail behind white text (3.68:1 / 3.77:1) and are used
  only for borders, icons and fills; `--color-primary-deep` (5.36:1) and
  `--color-accent-deep` (5.48:1) carry white text.
- **Targets** — every interactive element is ≥ 44×44px, carousel dots included.
- **Keyboard** — visible focus everywhere (never removed), skip link, Escape
  closes menus and returns focus to its trigger, roving focus in the language
  menu, direction-aware arrow keys in the carousel.
- **Carousel** — pause/play control, rotation suspended on hover and focus, all
  slides reachable without dragging, polite live region for slide position, and
  autoplay disabled entirely under `prefers-reduced-motion`.
- **Forms** — visible labels (never placeholder-only), inline errors tied by
  `aria-describedby`, plus a focusable `role="alert"` summary linking to each
  invalid field.
- **Motion** — `prefers-reduced-motion` renders every final state immediately.
- **Icons** — decorative icons are `aria-hidden`; icon-only controls carry a
  real accessible name.

## Deployment (Cloudflare Workers)

The site deploys as a **static-assets-only Worker** — there is no server-side
code, so `wrangler.jsonc` declares no `main`, only an `assets` directory.

```bash
npm run deploy    # build, then wrangler deploy
```

For **Workers Builds** (the GitHub integration), set:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

The build command matters: `wrangler deploy` uploads `./dist`, so it fails with
`Missing entry-point to Worker script or to assets directory` if nothing built
it first.

### Why `wrangler.jsonc` is required, not optional

Without a Wrangler config file, `wrangler deploy` runs auto-config detection,
which calls `checkIfViteConfigUsesCloudflarePlugin` to see whether the project
uses `@cloudflare/vite-plugin`. That check parses `vite.config.js` with a parser
that does not support **`import.meta`**, and the build dies with:

```
✘ [ERROR] Error parsing file: /opt/buildhome/repo/vite.config.js
```

`vite.config.js` uses `import.meta.url` for the `@` alias — the standard
create-vue idiom, and correct because it resolves independently of the working
directory. Rather than weaken it to a cwd-relative path, `wrangler.jsonc`
suppresses the detection pass entirely: with a config file present, Wrangler
never parses the Vite config. This was confirmed by bisecting the config —
`import.meta.url` is the sole trigger; the `node:url` import parses fine.

So: **do not delete `wrangler.jsonc`**, and if you ever see that parse error
again, check that it is still being found from the build's working directory.

## Before going live

These are deliberate placeholders, not oversights:

1. **WhatsApp number** — `src/data/site.js` holds `549115555555`, supplied as a
   stand-in. Note it is one digit short of a complete Argentine mobile number
   (`+54 9 11` + 8 digits), so `wa.me` will reject it until replaced.
2. **Contact form** — has no backend. `onSubmit` simulates a 700 ms round trip
   and shows the success state; wire it to a real endpoint or form service.
3. **Practice details** — address, email, licence number, opening hours, social
   links and the stats in `trust.stats` are sample content.
4. **Testimonials** — sample text. Published reviews must be real and
   attributable.
5. **Imagery** — the hero and portrait are CSS compositions rather than photos,
   so nothing implies a likeness of a real person. Replace with real photography
   (set explicit `width`/`height` to preserve CLS).
6. **Legal pages** — footer legal links currently point at `#contact`.

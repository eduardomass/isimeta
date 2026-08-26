# Isaac F. Meta, DDS, MS — Practice Website

Trilingual (English / Spanish / Hebrew) single-page site for a dental practice in
Palermo, Buenos Aires, focused on dental implants, oral rehabilitation and
cosmetic dentistry. Built with Vue 3 and Vite. English is the default locale;
Hebrew renders right-to-left.

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
    TrustSection.vue       stats, credentials, languages
    ServicesSection.vue    six treatments + periodontal-health note
    AboutSection.vue       clinical, research, teaching record
    ProcessSection.vue     four-step implant treatment path
    TestimonialsSection.vue accessible carousel of real reviews
    FaqSection.vue         native <details> accordion
    ContactSection.vue     WhatsApp, details, hours, form -> WhatsApp
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

### Never use `:global()` with a descendant selector

This one shipped a fully mirrored page, so it is worth stating plainly. Inside a
component's scoped `<style>`, this **looks** correct:

```css
:global([dir='rtl']) .mobile__chevron {
  transform: scaleX(-1);
}
```

but the SFC scoped-CSS transform drops the descendant and emits:

```css
[dir=rtl] { transform: scaleX(-1); }
```

That selector matches `<html>`, so the whole document is mirrored — every glyph
renders backwards in Hebrew. The source reads fine; the bug is only visible in
the built CSS.

Direction-dependent rules therefore live in `src/assets/styles/base.css`, which
is not scoped. Add the `rtl-mirror` utility class to anything that must flip
along the inline axis (forward-pointing chevrons, gradients that fade toward the
reading direction).

`npm run build` runs `scripts/verify-rtl.mjs` as a `postbuild` step, which fails
the build if any rule targets `[dir=rtl]`/`[dir=ltr]` directly or if `:global()`
reappears with a descendant. Both halves of that check are tested against a
deliberately reintroduced regression.

### Bidi isolation (required for Hebrew)

Mirroring the layout is not enough. Inside `dir="rtl"`, the Unicode Bidirectional
Algorithm reorders runs of Latin text and digits that are not isolated, because
the characters separating them (space, hyphen, `+`, `.`) are direction-neutral
and inherit the paragraph's RTL direction:

| Stored | Rendered in Hebrew, unisolated |
| --- | --- |
| `2003–2023` | `2023–2003` |
| `Sarina C.` | `.Sarina C` |
| `+54 9 11 3050-1028` | `1028-3050 11 9 54+` |
| `© 2026 Isaac F. Meta, DDS, MS.` | `.Isaac F. Meta, DDS, MS 2026 ©` |

So **wrap every untranslated value in `<bdi>`** — phone numbers, times, stat
figures, addresses, the doctor's Latin name, the copyright line.

Use `<bdi>` rather than `dir="ltr"`. `<bdi>` defaults to `dir="auto"`, so it
resolves per value: a date range or reviewer name stays LTR, but if
`contact.hours.value` is translated to Hebrew, the same markup renders it RTL.
Hardcoding `dir="ltr"` would break that. `<bdi>` is inline, so the block's own
`text-align: start` still mirrors normally.

Of the Hebrew locale's 13 Latin-only strings, six reorder: `2003–2023` and the
five reviewer names ending in a period. All are wrapped. Rerun the audit after
editing locales or `src/data/site.js`:

```bash
pip install python-bidi
python -c "
import json,unicodedata
from bidi import get_display
he=json.load(open('src/i18n/locales/he.json',encoding='utf-8'))
def w(o,p=''):
    if isinstance(o,str): yield p,o
    elif isinstance(o,dict):
        for k,v in o.items(): yield from w(v,f'{p}.{k}' if p else k)
    elif isinstance(o,list):
        for i,v in enumerate(o): yield from w(v,f'{p}[{i}]')
for p,s in w(he):
    if not any(unicodedata.bidirectional(c) in ('R','AL') for c in s):
        v=get_display(s,base_dir='R')
        if v!=s: print('REORDERS',p,repr(s),'->',repr(v))
"
```

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

## Content provenance

All copy, credentials, treatment descriptions, reviews and contact details come
from the practice's existing site (`C:/Desarr/isi2`), using the `en/` and `es/`
wording directly rather than a re-translation:

| Section | Source page |
| --- | --- |
| Hero, About, Trust (credentials, languages) | `about.html` |
| Treatments (implants, grafting, rehabilitation) | `dental-implants.html` |
| Treatments (veneers, smile design, whitening) | `cosmetic-dentistry.html` |
| Treatment path | `dental-implants.html` — "what treatment involves" |
| Reviews | `reviews.html` |
| FAQ | `faq.html` |
| Contact, hours, address | `contact.html` |

Hebrew is translated from those sources. The practice states consultations are
available in **English and Spanish**; Hebrew is listed at intermediate
proficiency, so the Hebrew locale must not claim clinical consultations in
Hebrew.

### Claims deliberately not made

The earlier placeholder build asserted things the real site does not support.
They were removed rather than carried over:

- **No aggregate rating.** The practice publishes individual reviews but no
  star average, so the hero shows the credential instead of a score.
- **No opening times.** The source says only "by appointment, Monday to
  Friday", so there is no timetable and the JSON-LD carries `openingHours:
  'Mo-Fr'` with no `opens`/`closes`.
- **No patient counts or licence number.** Trust figures are limited to
  verifiable facts: practice founded 2007, Embassy-suggested since 2008, five
  peer-reviewed publications, teaching 2003–2023.
- **No social profiles.** None are listed on the source site, so the footer
  links were removed rather than pointed at generic URLs.

## Still to confirm before launch

1. **Contact form** has no backend. It composes the enquiry and opens WhatsApp
   with the message prefilled, which matches the source site's "Send via
   WhatsApp" behaviour. Nothing is stored.
2. **Imagery.** The hero and About visuals are CSS compositions, not
   photographs, so nothing implies a likeness. Replace with real photography
   (set explicit `width`/`height` to preserve CLS).
3. **Pages not pulled from.** `international-patients.html`,
   `digital-dentistry.html`, `treatments.html` and `index.html` exist in the
   source site and were not used. Digital dentistry in particular is a
   treatment area this build does not mention.
4. **Legal pages.** There are none on the source site, so the footer has no
   privacy/terms links.

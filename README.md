# Molina Strategic Advisory — Website (Phase 1)

A one-page site for Molina Strategic Advisory, built to the approved content
brief. Plain HTML, CSS and JavaScript — no build step, no dependencies, no
framework. Open `index.html` in a browser and it runs.

Bilingual (English / Spanish) with a toggle in the header.

---

## Files

```
msa-website/
├── index.html              Page structure. Text is referenced by key, not written inline.
├── assets/
│   ├── css/styles.css      Design system + all layout.
│   ├── js/content.js       ← ALL SITE COPY LIVES HERE (English + Spanish).
│   ├── js/main.js          Language switch, navigation, scroll behavior, contact form.
│   └── img/
│       ├── logo-mark.svg   Stand-in monogram — replace with the official artwork.
│       └── waleska.jpg     Founder photograph (900x1200).
└── README.md
```

## Editing the copy

Open `assets/js/content.js`. Every visible string appears twice — once under
`en`, once under `es` — with the same key:

```js
'hero.headline': 'Helping growing businesses turn people, processes …',
```

Change the text between the quotes. Do not change the key on the left.
Keep both languages in sync: if you edit an English string, edit its Spanish
counterpart too.

To add a new piece of text, give the element in `index.html` a
`data-i18n="some.key"` attribute, then add `'some.key'` to both `en` and `es`.

## Before launch — the open items

1. **Logo.** Replace `assets/img/logo-mark.svg` with the official monogram
   (`.svg` preferred, `.png` fine). Keep the filename, or update the `src` in
   the header of `index.html`. The current file is an approximation I built
   from the logo image — it is not the real artwork.
2. ~~**Founder photograph.**~~ Done. `assets/img/waleska.jpg` is the supplied
   portrait, resized to 900×1200 and saved at JPEG quality 86 (94 KB). The
   frame crops to 4:5 from the top, which keeps the head and torso in view.
   To swap it later, replace the file at the same path — portrait orientation,
   roughly 4:5, at least 800×1000, and no code change needed.
3. **Contact details.** The footer currently shows a placeholder address,
   `hello@molinastrategicadvisory.com`, and a generic LinkedIn link. Replace
   both in `index.html`, and set `CONTACT_EMAIL` at the top of
   `assets/js/main.js` to the same address.
4. **Contact form delivery.** See below.

## Contact form

The form validates in the browser, then does one of two things:

- **If `FORM_ENDPOINT` in `assets/js/main.js` is empty** (the current state) it
  opens the visitor's email client with the inquiry pre-filled. This works
  everywhere with zero setup, but it is a weaker experience on phones and some
  visitors will abandon it.
- **If `FORM_ENDPOINT` is set to a form service URL** (Formspree, Basin,
  Netlify Forms, or your own handler) the form POSTs the submission as JSON and
  shows a thank-you message in place.

Setting up a real endpoint before launch is strongly recommended — the brief's
stated goal is converting interest into consultations, and mailto loses leads.

## Hosting

Static files, so anything works: Vercel, Netlify, Cloudflare Pages, GitHub
Pages, or traditional hosting. Nothing needs to be compiled — upload the
`msa-website` folder as-is.

## Design notes

The palette is taken directly from the logo:

| Token | Value | Use |
|---|---|---|
| `--navy-900` | `#13243F` | Dark sections, hero, footer |
| `--navy-700` | `#21406E` | Gradients, hover states |
| `--blue-600` | `#2C63A8` | Primary buttons, accents, links |
| `--blue-500` | `#3A7BC8` | Highlights on dark backgrounds |
| `--grey-600` | `#6E7276` | Secondary text (the logo's "Strategic Advisory" grey) |
| `--grey-100` | `#F4F6F9` | Alternating section backgrounds |

Type: **Cinzel** for the wordmark (closest free match to the logo's engraved
serif), **Source Serif 4** for headings, **Inter** for body text. All three
load from Google Fonts with system fallbacks.

All text combinations meet WCAG AA contrast (4.5:1 minimum). The layout is
mobile-first and has no horizontal scroll at 390px. Animation is disabled for
visitors who have reduced-motion turned on.

## Structured for Phase 2

The page is one document with `id`-anchored sections, so any section can be
lifted into its own page later (`/services`, `/diagnostic`, `/about`) without
touching the design system. The nav links would change from `#services` to
`/services` and nothing else moves.

## Deliberately not included

Per the brief: no pricing is published, no package prices are listed, and
nothing claims "ADP Certified" or "ADP Partner" — ADP experience is described
as extensive hands-on experience. The footer carries the professional-boundaries
disclaimer stating MSA does not provide legal or tax advice.

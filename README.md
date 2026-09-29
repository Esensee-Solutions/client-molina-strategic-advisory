# Molina Strategic Advisory — Website (Phase 1)

A one-page site for Molina Strategic Advisory, built to the Design brief
(`docs/brief.md`). Esensee builds and runs it; MSA is Esensee's Founding
Partner. Working rules are in `CLAUDE.md`.

Built with [Astro](https://astro.build), which turns the components below into
plain static HTML at build time. The pages ship almost no JavaScript: one small
script for the menu, scroll effects and the Calendly embed.

Bilingual: English at `/`, Spanish at `/es/`, with a switch in the header.

---

## Running it

Needs Node 22.12 or newer (`.node-version`).

```
npm install
npm run dev        # http://localhost:4321, reloads as you edit
npm run build      # writes the finished site to dist/
npm run preview    # serves dist/ to check the build
npm run check      # the content rules in CLAUDE.md (same as python3 check.py)
```

## Files

```
client-molina-strategic-advisory/
├── CLAUDE.md                 Working rules for anyone (human or AI) changing the site.
├── docs/brief.md             The Design brief. Every change is checked against it.
├── check.py                  Checks the copy against CLAUDE.md's rules. Run before every pull request.
├── build-single-file.py      Flattens a built page into one file for emailing.
├── astro.config.mjs          Domain and languages.
├── wrangler.jsonc            The Cloudflare Worker that serves dist/.
├── .github/workflows/site.yml  Checks, builds, previews and deploys.
├── src/
│   ├── content/site.ts       ← ALL SITE COPY LIVES HERE (English + Spanish).
│   ├── content/legal.ts      Terms and Privacy copy (English + Spanish).
│   ├── settings.ts           Calendly link, email address, LinkedIn.
│   ├── i18n.ts               The languages, t('key') and page addresses.
│   ├── layouts/Layout.astro  <head>, header, footer on every page.
│   ├── components/           Header, Footer, Home (all homepage sections), Legal.
│   ├── pages/                One file per address: index, terms, privacy, and es/ for Spanish.
│   ├── scripts/main.ts       Navigation, scroll behavior, reveal, Calendly embed.
│   └── styles/styles.css     Design system + all layout.
├── public/                   Copied as-is to the site.
│   ├── _redirects            Old .html addresses → the new ones.
│   └── assets/img/
│       ├── logo.png          Header lockup.
│       ├── logo-mark.png     Favicon and Apple touch icon.
│       ├── og-image.jpg      Share card.
│       └── waleska.jpg       Founder photograph (900x1200).
└── README.md
```

## Editing the copy

Open `src/content/site.ts`. Every visible string appears twice — once under
`en`, once under `es` — with the same key:

```js
'hero.headline': 'Helping growing businesses turn people, processes …',
```

Change the text between the quotes. Do not change the key on the left.
Keep both languages in sync: if you edit an English string, edit its Spanish
counterpart too.

Then run `npm run check`. It fails if a key exists in only one language,
if a component refers to a key that has no copy, or if the copy breaks the
brief's never-say list (prices, ADP certification claims, a missing
disclaimer). `npm run build` also fails on a missing key.

To add a new piece of text, write `{t('some.key')}` where it goes in the
component, then add `'some.key'` to both `en` and `es`.

## Languages

Each language has its own addresses: `/`, `/terms/`, `/privacy/` in English and
`/es/`, `/es/terms/`, `/es/privacy/` in Spanish, each with `hreflang` links to
the other so search engines show the right one. The EN / ES switch is an
ordinary link to the same page in the other language, and keeps the section
you were on.

A visitor whose browser is set to Spanish and who arrives from another site
(a search, a link) is sent to the Spanish page. Anyone who picks English on the
switch stays in English. Nothing is stored in the browser.

## Before launch — the open items

1. ~~**Logo.**~~ Done. The official artwork is in place — see *Brand assets*
   below.
2. ~~**Founder photograph.**~~ Done. `public/assets/img/waleska.jpg` is the supplied
   portrait, resized to 900×1200 and saved at JPEG quality 86 (94 KB). The
   frame crops to 4:5 from the top, which keeps the head and torso in view.
   To swap it later, replace the file at the same path — portrait orientation,
   roughly 4:5, at least 800×1000, and no code change needed.
3. ~~**Contact details.**~~ Done. Footer links to Waleska's LinkedIn profile;
   the email address `waleska@molinastrategicadvisory.com` appears in the
   footer and beneath the scheduler.

4. ~~**Calendly link.**~~ Done. The scheduler embeds
   `https://calendly.com/waleska-molinastrategicadvisory/30min`. See *Scheduling* below.

## Scheduling (Calendly)

The contact section embeds a Calendly booking calendar instead of a form, so
enquiries land straight on the calendar with nothing to chase.

The link is one line in `src/settings.ts`:

```ts
export const CALENDLY_URL = 'https://calendly.com/waleska-molinastrategicadvisory/30min';
```

To change it, replace that link. Nothing else needs touching.

If that URL ever contains the word `placeholder`, the page deliberately
does **not** load Calendly — it renders a styled stand-in panel instead. A fake
Calendly URL would otherwise embed a "page not found" screen, which looks
broken when showing the site to MSA or a Customer. Change the URL and the real widget
loads automatically.

The embed passes Calendly's theming parameters (`background_color`,
`text_color`, `primary_color`) so the calendar matches the navy section rather
than dropping a white card into it. On Calendly's free tier these parameters
are ignored and the calendar renders in its default light theme — worth
checking once the real account is connected.

Three meeting types are listed in the stand-in panel (consultation, diagnostic
inquiry, referral partner introduction). Those are placeholders for whatever
Waleska actually sets up in Calendly — edit them under the `sched.m1`–`sched.m3`
keys in `src/content/site.ts`.

Beneath the scheduler there is a plain email link for visitors who would rather
write than book — useful for referral partners, who are often passing along
someone else's details rather than booking for themselves.

## Hosting

`npm run build` writes plain static files to `dist/`; that folder is the whole
site. `public/_redirects` sends the old `terms.html` and `privacy.html`
addresses to the new ones (Cloudflare and Netlify read this file).

The domain is `molinastrategicadvisory.com`, and the page declares it in its
canonical URL and Open Graph tags. If the site ends up on a different domain,
change `site` in `astro.config.mjs`, or search engines will keep
pointing at the wrong address.

### Cloudflare Workers

The site is served by a Cloudflare Worker named `molina-strategic-advisory`
(`wrangler.jsonc`). There is no Worker code: Cloudflare serves the files in
`dist/` as they are and reads `_redirects` from it.

GitHub Actions does the building (`.github/workflows/site.yml`):

- **Every pull request:** `npm run check`, `npm run build`, then a preview
  version is uploaded and its link posted as a comment on the pull request
  (`https://pr-<number>-molina-strategic-advisory.<account>.workers.dev`).
- **Every merge into `main`:** the same checks, then `wrangler deploy` puts it
  live.

It needs two secrets from the `esensee-solutions` organization, shared with
this repository: `CLOUDFLARE_API_TOKEN` (a token with *Workers Scripts: Edit*)
and `CLOUDFLARE_ACCOUNT_ID`. Without them the checks and build still run and
the upload steps are skipped.

To see the Workers version on your machine: `npm run build`, then
`npx wrangler dev` (http://localhost:8787).

Going back to an earlier version: `npx wrangler rollback`, or
**Workers & Pages → molina-strategic-advisory → Deployments** in Cloudflare.

**The domain.** The site is live at `https://molinastrategicadvisory.com`
only: `wrangler.jsonc` sets it as the Worker's custom domain and turns the
`workers.dev` address off (`preview_urls` stays on for pull request previews).
`www` forwards to the bare domain with a Redirect Rule in the Cloudflare
dashboard (**Rules → Redirect Rules**, "Redirect from WWW to root"), which needs
the proxied `www` DNS record to stay. The domain's DNS is on Esensee's
Cloudflare account; email is Hostinger's (the MX and SPF records), so leave
those records alone.


### Share previews

`build-single-file.py` flattens a built page into one portable `.html` file for
emailing or opening without a server:

```
npm run build
python3 build-single-file.py                 # the homepage
python3 build-single-file.py es/             # any other page, by its address
```

The result is a snapshot, not the source — edit the real files, rebuild and
re-run it.
A flattened page is standalone, so its links to the other pages will not
resolve.

## Brand assets

All three were derived from the supplied logo artwork (a 1536×1024 JPEG on a
white background). The white background was removed by flood-filling inward
from the edges, so the white letterform and ring *inside* the monogram stayed
intact — a plain "make white transparent" pass would have punched holes in them.

| File | Size | Used for |
|---|---|---|
| `logo.png` | 520×154 | The full lockup in the header |
| `logo-mark.png` | 256×256 | Favicon and Apple touch icon |
| `og-image.jpg` | 1200×630 | Link previews on LinkedIn, WhatsApp, email |

**The footer does not use the lockup.** The artwork is navy and grey, which is
illegible against the dark footer. The footer keeps a type-only treatment in
white instead. If a white/knockout version of the logo ever exists, it belongs
there — swap it into the `.footer-brand` block in `src/components/Footer.astro`.

The share card was built from the lockup at render time. If the logo changes,
regenerate it rather than editing the JPEG.

## Legal pages

The Terms and Privacy pages are the one exception to the single-page rule.
They are separate files because legal pages need their own URLs — linkable from
the footer, from Calendly, and from an email signature.

They share the design system, the header and footer, and the language toggle.
Their copy lives in `src/content/legal.ts`. `src/components/Legal.astro` builds
each section from its keys (`terms.s3.h`, `.p`, `.p1`, `.l1`…, `.p2`, `.addr`),
so adding a section or paragraph to the copy needs no other change.

### Read this before launch

**This text is not legal advice.** An attorney licensed in Puerto Rico should
review it — local employment and payroll law differs meaningfully from the
mainland, which matters more than usual for a practice that advises on exactly
those subjects.

**On the content:** It is standard boilerplate adapted to how
this specific site behaves — the Calendly embed, nothing stored in the
browser, the absence of tracking cookies. An attorney should review it.

Jurisdiction and address are filled in:

1. ~~**Governing state.**~~ The Terms are governed by the laws of the
   **Commonwealth of Puerto Rico**. Note the wording: Puerto Rico is a
   Commonwealth, not a state, so the clause does not say "State of", and the
   Spanish version uses the official name, *Estado Libre Asociado de Puerto
   Rico*.
2. ~~**Mailing address.**~~ HC 74 Box 6105, Naranjito, PR 00719.

Both pages carry a last-updated date (`legal.date`). Set it to the launch date,
and change it whenever the text is revised.

If analytics are ever added to the site, the Privacy Policy's cookies section
becomes inaccurate and must be updated — it currently states that the site sets
no tracking cookies, which is true today.

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

The homepage is one component (`src/components/Home.astro`) with `id`-anchored
sections, so any section can be lifted into its own component and page later
(`src/pages/services.astro` and `src/pages/es/services.astro`) without touching
the design system. The nav links in `Header.astro` would change from
`#services` to `/services` and nothing else moves.

## Deliberately not included

Per the brief: no pricing is published, no package prices are listed, and
nothing claims "ADP Certified" or "ADP Partner" — ADP experience is described
as extensive hands-on experience. The footer carries the professional-boundaries
disclaimer stating MSA does not provide legal or tax advice.

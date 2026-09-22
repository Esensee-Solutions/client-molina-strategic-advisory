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

1. ~~**Logo.**~~ Done. The official artwork is in place — see *Brand assets*
   below.
2. ~~**Founder photograph.**~~ Done. `assets/img/waleska.jpg` is the supplied
   portrait, resized to 900×1200 and saved at JPEG quality 86 (94 KB). The
   frame crops to 4:5 from the top, which keeps the head and torso in view.
   To swap it later, replace the file at the same path — portrait orientation,
   roughly 4:5, at least 800×1000, and no code change needed.
3. ~~**Contact details.**~~ Done. Footer links to Waleska's LinkedIn profile;
   the email address `waleska@molinastrategicadvisory.com` appears in the
   footer and beneath the scheduler.

4. **Calendly link.** The scheduler is wired but points at a placeholder
   account — the last thing outstanding. See *Scheduling* below.

## Scheduling (Calendly)

The contact section embeds a Calendly booking calendar instead of a form, so
enquiries land straight on the calendar with nothing to chase.

**To go live, change one line.** In `assets/js/main.js`:

```js
var CALENDLY_URL = 'https://calendly.com/placeholder-msa/consultation';
```

Replace it with the real scheduling link. Nothing else needs touching.

While that URL still contains the word `placeholder`, the page deliberately
does **not** load Calendly — it renders a styled stand-in panel instead. A fake
Calendly URL would otherwise embed a "page not found" screen, which looks
broken when showing the site to a client. Change the URL and the real widget
loads automatically.

The embed passes Calendly's theming parameters (`background_color`,
`text_color`, `primary_color`) so the calendar matches the navy section rather
than dropping a white card into it. On Calendly's free tier these parameters
are ignored and the calendar renders in its default light theme — worth
checking once the real account is connected.

Three meeting types are listed in the stand-in panel (consultation, diagnostic
inquiry, referral partner introduction). Those are placeholders for whatever
Waleska actually sets up in Calendly — edit them under the `sched.m1`–`sched.m3`
keys in `assets/js/content.js`.

Beneath the scheduler there is a plain email link for visitors who would rather
write than book — useful for referral partners, who are often passing along
someone else's details rather than booking for themselves.

## Hosting

Static files — nothing to compile. Upload the `msa-website` folder as-is, or
point a host at this directory in the repository.

The domain is `molinastrategicadvisory.com`, and the page declares it in its
canonical URL and Open Graph tags. If the site ends up on a different domain,
update both in the `<head>` of `index.html`, or search engines will keep
pointing at the wrong address.

Recommended: **Vercel**, **Netlify** or **Cloudflare Pages**. All three are free
for a site this size, serve over HTTPS automatically, and connect a custom
domain through DNS records at the registrar. Traditional shared hosting works
too — it is plain HTML.

Whichever host, set it to serve `index.html` at the root.

### Share previews

`build-single-file.py` flattens everything into one portable `.html` file for
emailing or opening without a server:

```
python3 build-single-file.py
```

The result is a snapshot, not the source — edit the real files and re-run it.

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
there — swap it into the `.footer-brand` block in `index.html`.

The share card was built from the lockup at render time. If the logo changes,
regenerate it rather than editing the JPEG.

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

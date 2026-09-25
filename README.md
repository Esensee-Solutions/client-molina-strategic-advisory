# Molina Strategic Advisory — Website (Phase 1)

A one-page site for Molina Strategic Advisory, built to the Design brief
(`docs/brief.md`). Esensee builds and runs it; MSA is Esensee's Founding
Partner. Working rules are in `CLAUDE.md`. Plain HTML, CSS and JavaScript — no build step, no dependencies, no
framework. Open `index.html` in a browser and it runs.

Bilingual (English / Spanish) with a toggle in the header.

---

## Files

```
client-molina-strategic-advisory/
├── CLAUDE.md               Working rules for anyone (human or AI) changing the site.
├── docs/brief.md           The Design brief. Every change is checked against it.
├── build-single-file.py    Flattens a page into one file for emailing.
├── check.py              Checks the copy against CLAUDE.md's rules. Run before every pull request.
├── index.html              The one-page site. Text is referenced by key, not written inline.
├── terms.html              Terms of Use.
├── privacy.html            Privacy Policy.
├── assets/
│   ├── css/styles.css      Design system + all layout.
│   ├── js/content.js       ← ALL SITE COPY LIVES HERE (English + Spanish).
│   ├── js/legal-content.js Terms and Privacy copy (English + Spanish).
│   ├── js/main.js          Language switch, navigation, scroll behavior, Calendly embed.
│   └── img/
│       ├── logo.png        Header lockup.
│       ├── logo-mark.png   Favicon and Apple touch icon.
│       ├── og-image.jpg    Share card.
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

Then run `python3 check.py`. It fails if a key exists in only one language,
if a page refers to a key that has no copy, or if the copy breaks the brief's
never-say list (prices, ADP certification claims, a missing disclaimer).

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
keys in `assets/js/content.js`.

Beneath the scheduler there is a plain email link for visitors who would rather
write than book — useful for referral partners, who are often passing along
someone else's details rather than booking for themselves.

## Hosting

Static files — nothing to compile. Point a host at the repository root, or
upload its files as-is.

The domain is `molinastrategicadvisory.com`, and the page declares it in its
canonical URL and Open Graph tags. If the site ends up on a different domain,
update both in the `<head>` of `index.html`, or search engines will keep
pointing at the wrong address.

The site is not on Esensee's Site kit or Cloudflare Workers setup yet; moving
it to Astro and the Site kit is planned, and waits until Esensee starts it.
Until then any static host works — it is plain HTML.

Whichever host, set it to serve `index.html` at the root.

### Share previews

`build-single-file.py` flattens everything into one portable `.html` file for
emailing or opening without a server:

```
python3 build-single-file.py                 # the homepage
python3 build-single-file.py privacy.html    # any other page
```

The result is a snapshot, not the source — edit the real files and re-run it.
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
there — swap it into the `.footer-brand` block in `index.html`.

The share card was built from the lockup at render time. If the logo changes,
regenerate it rather than editing the JPEG.

## Legal pages

`terms.html` and `privacy.html` are the one exception to the single-page rule.
They are separate files because legal pages need their own URLs — linkable from
the footer, from Calendly, and from an email signature.

They share the design system, the header and footer, and the language toggle.
Their copy lives in `assets/js/legal-content.js`, which merges into the same
translation dictionary; the legal pages load it, the homepage does not.

### Read this before launch

**This text is not legal advice.** An attorney licensed in Puerto Rico should
review it — local employment and payroll law differs meaningfully from the
mainland, which matters more than usual for a practice that advises on exactly
those subjects.

**On the content:** It is standard boilerplate adapted to how
this specific site behaves — the Calendly embed, the language preference stored
in the browser, the absence of tracking cookies. An attorney should review it.

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

The page is one document with `id`-anchored sections, so any section can be
lifted into its own page later (`/services`, `/diagnostic`, `/about`) without
touching the design system. The nav links would change from `#services` to
`/services` and nothing else moves.

## Deliberately not included

Per the brief: no pricing is published, no package prices are listed, and
nothing claims "ADP Certified" or "ADP Partner" — ADP experience is described
as extensive hands-on experience. The footer carries the professional-boundaries
disclaimer stating MSA does not provide legal or tax advice.

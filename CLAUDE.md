# Molina Strategic Advisory

This is the website of Molina Strategic Advisory (MSA), Waleska Molina Oyola's HR, payroll,
operations and sales consulting practice in Puerto Rico. MSA is a trade name (DBA) of Wala Isla
Glow LLC. The site is for `molinastrategicadvisory.com`, in English and Spanish with a toggle.

MSA is Esensee's first **Founding Partner**: Esensee runs its site and email for free, with no
end date, in exchange for promotion (a case study, being listed as its referral partner, a
LinkedIn post, referrals). It is not a Client and never pays.

Read `docs/brief.md` (the Design brief) before changing anything. Every change is checked against it.

## Words

Use these in code, commits and pull requests.

- **Esensee**: the business that builds and runs this site. The owner, working with AI assistants.
- **Founding Partner**: MSA. Never "client", "customer" or "user" for MSA itself.
- **Customer**: a business that hires MSA, or a referral partner (CPA, attorney, insurer) sending one. The people this site is for.
- **Design brief**: `docs/brief.md`. The business, its Customers, the site's one job, and the one detail only this business has.
- **Site kit**: the private package from the `esensee-solutions` organization that Client sites install for the invisible parts (SEO, language switch, contact buttons, forms, build and deploy). This site doesn't use it yet.
- **Update**: a small content change MSA asks for (text, photos, the Calendly link).
- **Change request**: anything bigger than an Update (a new page or section, a new feature).

## How the site works today

- Plain HTML, CSS and JavaScript. No build step, no dependencies, no framework. Open `index.html` in a browser.
- **All copy lives in `assets/js/content.js`** (legal pages: `assets/js/legal-content.js`), under `en` and `es` with the same keys. `index.html` refers to text by `data-i18n` key. Details in `README.md`.
- `terms.html` and `privacy.html` are the only other pages.
- `python3 build-single-file.py` makes a one-file preview to email. It's a snapshot, never the source.
- It isn't on the Site kit or Esensee's Cloudflare Workers setup yet. Moving it to Astro and the Site kit is planned; don't start that unless asked.

## Rules

- **Update or Change request.** If a request is more than text, photos or links, stop and say it's a Change request that Esensee decides on first. Don't build it.
- **The look belongs to this site.** Palette from the logo, Cinzel / Source Serif 4 / Inter, navy sections (see `README.md`). Don't copy another site's design.
- **Both languages together.** Every text change is made in English and Spanish in the same pull request.
- **What the site never says** (from the brief): no prices or package prices, and never "ADP Certified" or "ADP Partner" (it's "extensive hands-on ADP experience"). Keep the footer's no-legal-or-tax-advice disclaimer.
- **Legal pages.** If the site starts setting cookies or tracking, the Privacy Policy must change in the same pull request.
- **Phone first.** No horizontal scroll at 390px. Keep WCAG AA contrast and the reduced-motion setting working.
- **No secrets in the repository.**

## Working

- Work on a branch and open a pull request into `main`.
- Run `python3 check.py` before every pull request. It checks both languages have the same keys, the
  disclaimer, and the never-say list. Then check the change in a browser at phone width, in both languages.

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

- **Astro**, static output. `npm install`, then `npm run dev` to work and `npm run build` to make `dist/`. Node 22.12+.
- **All copy lives in `src/content/site.ts`** (legal pages: `src/content/legal.ts`), under `en` and `es` with the same keys. Components look text up with `t('key')`. Details in `README.md`.
- English is at `/`, Spanish at `/es/`. The pages are home, `terms/` and `privacy/` in each.
- The Calendly link, email and LinkedIn are in `src/settings.ts`.
- `python3 build-single-file.py` makes a one-file preview to email from `dist/`. It's a snapshot, never the source.
- Cloudflare serves `dist/` from the Worker `molina-strategic-advisory` (`wrangler.jsonc`). There is no Worker code.
- It isn't on the Site kit yet. When the Site kit exists, its SEO tags, language switch and deploy replace this site's own; the look stays. Don't start that unless asked.

## From pull request to live

Every change reaches the site the same way. The pull request is the unit of approval.

1. **Pull request.** GitHub Actions (`.github/workflows/site.yml`) checks and builds it, uploads
   it as a preview version and comments its link on the pull request:
   `https://pr-<number>-molina-strategic-advisory.<account>.workers.dev`.
2. **Approval.** Esensee opens the preview link on a phone. For a Change request, Esensee sends
   the link to Waleska and waits for a yes. The link only shows the change; approving is the
   yes, and nothing goes live from it.
3. **Merge into `main`.** GitHub Actions deploys it: the change is live within a minute.

Where "live" is:

- **Today** (the domain isn't connected yet): the Worker's own address,
  `https://molina-strategic-advisory.<account>.workers.dev`.
- **Once `molinastrategicadvisory.com` is connected**: `https://molinastrategicadvisory.com`
  only, with `www` forwarding to it. The pull request that connects the domain uncomments the
  `routes` line in `wrangler.jsonc` and sets `"workers_dev": false`, so the site answers on one
  address. `"preview_urls": true` stays written out, which keeps step 1's preview links working.
- **Going back**: `npx wrangler rollback` returns to the previous version.

Links sent to Waleska or anyone outside Esensee are preview links (for a yes) or
`https://molinastrategicadvisory.com` (once connected).

## Rules

- **Update or Change request.** If a request is more than text, photos or links, stop and say it's a Change request that Esensee decides on first. Don't build it.
- **The look belongs to this site.** Palette from the logo, Cinzel / Source Serif 4 / Inter, navy sections (see `README.md`). Don't copy another site's design.
- **Both languages together.** Every text change is made in English and Spanish in the same pull request.
- **What the site never says** (from the brief): no prices or package prices, and never "ADP Certified" or "ADP Partner" (it's "extensive hands-on ADP experience"). Keep the footer's no-legal-or-tax-advice disclaimer.
- **Legal pages.** If the site starts setting cookies or tracking, including Cloudflare Web Analytics, the Privacy Policy must change in the same pull request.
- **Phone first.** No horizontal scroll at 390px. Keep WCAG AA contrast and the reduced-motion setting working.
- **No secrets in the repository.**

## Working

- Work on a branch and open a pull request into `main`. Merging into `main` puts the site live.
- Run `npm run check` and `npm run build` before every pull request. It checks both languages have the same keys, the
  disclaimer, and the never-say list. Then check the change in a browser at phone width, in both languages.

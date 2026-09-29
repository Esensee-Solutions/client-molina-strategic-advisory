// Copied from Esensee-Solutions/Esensee_Solutions, kit/credit/esensee-credit.js. Change it there
// and copy it back; it moves into the Site kit when this site goes on it.
//
// <esensee-credit>: the Credit, the "made by Esensee" line at the bottom of every Client site's footer.
//
// It takes the look of the footer it sits in (its color and font are inherited), so it never
// brings Esensee's look into a Client's site: the look belongs to the site (docs/adr/0004). It
// signs itself once, the first time the footer scrolls into view, like an artist signing a
// finished painting: a pen traces the Esensee mark bar by bar, the mark fills in, the words write
// on, and a flourish underlines the name. Then it stays
// still. With reduced motion on, it's already signed.
//
// Use it in a Client's footer (the plain link inside is what shows if the script doesn't load):
//
//   <script type="module" src="/esensee-credit.js"></script>
//   <esensee-credit lang="es"><a href="https://esensee-solutions.com/">Built by Esensee Solutions</a></esensee-credit>
//
// Attributes:
//   lang    es | en. Defaults to the page's <html lang>, then Spanish.
//   accent  A color for the mark. Rarely needed: see "The mark's color" below.
//
// The mark's color: it picks up the Client's brand color by itself, from the first of the site's
// CSS variables in BRAND_VARS that's set (on :root or the footer), then <meta name="theme-color">.
// A color too faint against the footer's background (under 3:1, the contrast a logo needs) is
// skipped, and the mark takes the text color instead.
//
// Like the Paused site command, this moves into the Site kit when it exists (docs/adr/0004).

export const SITE = 'https://esensee-solutions.com/';

// The words before "Esensee Solutions": "Built by" in both languages (its link still opens the page's language).
export const LINE = {
  es: 'Built by',
  en: 'Built by',
};

// What screen readers hear.
export const LABEL = {
  es: 'Built by Esensee Solutions (abre esensee-solutions.com)',
  en: 'Built by Esensee Solutions (opens esensee-solutions.com)',
};

export function pickLang(attr, pageLang) {
  for (const l of [attr, pageLang]) {
    const short = String(l || '').slice(0, 2).toLowerCase();
    if (short in LINE) return short;
  }
  return 'es';
}

// The link to Esensee's site, tagged with the Client's domain so a visit can be traced to it.
export function creditHref(lang, host) {
  const url = new URL(lang === 'en' ? 'en/' : '', SITE);
  if (host) {
    url.searchParams.set('utm_source', host.replace(/^www\./, ''));
    url.searchParams.set('utm_medium', 'client-credit');
  }
  return url.href;
}

// The three bars of the Esensee mark (the same shapes as brand/logo/mark-*.svg, in a 1150 × 744 box).
const BARS = [
  '1150,0 1150,204 563,204 238,743 0,743 449,0',
  '1017,270 1017,474 715,474 553,743 315,743 601,270',
  '1150,539 1150,743 640,743 764,539',
];

// Where a Client site keeps its brand color, most likely first.
export const BRAND_VARS = ['--brand', '--brand-color', '--color-brand', '--primary', '--color-primary', '--accent'];

// The contrast a graphic needs against its background (WCAG 1.4.11).
const MIN_CONTRAST = 3;

// "rgb(1, 2, 3)" / "rgba(1, 2, 3, 0.5)" / "rgb(1 2 3 / 50%)" → { r, g, b, a }, as browsers report colors.
export function parseRgb(value) {
  const m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+)(%?))?\s*\)$/.exec(String(value).trim());
  if (!m) return null;
  const a = m[4] === undefined ? 1 : Number(m[4]) / (m[5] ? 100 : 1);
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a };
}

function luminance({ r, g, b }) {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// The first candidate (already resolved to rgb strings) that's solid and stands out from the background.
export function pickAccent(candidates, background) {
  const bg = parseRgb(background);
  for (const c of candidates) {
    const rgb = parseRgb(c);
    if (rgb && rgb.a === 1 && (!bg || contrast(rgb, bg) >= MIN_CONTRAST)) return c;
  }
  return null;
}

// The outline length of each bar, for tracing it with a dash.
const barLength = (p) => {
  const v = p.split(' ').map((q) => q.split(',').map(Number));
  return Math.ceil(v.reduce((sum, a, i) => sum + Math.hypot(v[(i + 1) % v.length][0] - a[0], v[(i + 1) % v.length][1] - a[1]), 0));
};

const CSS = `
  :host { display: inline-block; color: inherit; font: inherit; line-height: 1.4; }
  a {
    display: inline-flex; align-items: center; gap: .55em; color: inherit; text-decoration: none;
    border-radius: 4px; outline-offset: 3px; -webkit-tap-highlight-color: transparent;
  }
  a:focus-visible { outline: 2px solid currentColor; }
  svg { overflow: visible; }
  .mark { width: 1.9em; height: auto; flex: none; }
  polygon { fill: var(--esensee-mark, currentColor); stroke: var(--esensee-mark, currentColor); stroke-width: 20; stroke-linejoin: round; }
  .sig { display: inline-flex; align-items: baseline; white-space: nowrap; }
  .line { opacity: .72; }
  .name { position: relative; font-weight: 600; letter-spacing: .01em; }
  .flourish { position: absolute; left: 0; bottom: -.35em; width: 100%; height: .4em; }
  .flourish path { fill: none; stroke: var(--esensee-mark, currentColor); stroke-width: 1.6; stroke-linecap: round; vector-effect: non-scaling-stroke; }

  @media (prefers-reduced-motion: no-preference) {
    /* Before it's signed: nothing drawn yet. */
    polygon { fill-opacity: 0; stroke-dasharray: var(--len); stroke-dashoffset: var(--len); }
    .text { clip-path: inset(-50% 100% -50% 0); }
    .flourish path { stroke-dasharray: 240; stroke-dashoffset: 240; }

    /* Signing: trace each bar, fill, write the words, underline. */
    :host([data-built]) polygon { animation: trace .7s cubic-bezier(.55,.1,.35,1) forwards, fill .4s ease 1.55s forwards; }
    :host([data-built]) .b2 { animation-delay: .5s, 1.55s; }
    :host([data-built]) .b3 { animation-delay: .95s, 1.55s; }
    :host([data-built]) .text { animation: write .9s cubic-bezier(.3,.6,.4,1) 1.7s forwards; }
    :host([data-built]) .flourish path { animation: trace .7s ease 2.7s forwards; }

    @keyframes trace { to { stroke-dashoffset: 0; } }
    @keyframes fill { to { fill-opacity: 1; } }
    @keyframes write { to { clip-path: inset(-50% -10% -50% 0); } }
  }
`;

// Outside a browser (the tests) there's no HTMLElement; the words and link above still load.
class EsenseeCredit extends (globalThis.HTMLElement ?? class {}) {
  static observedAttributes = ['lang', 'accent'];

  #observer = null;

  connectedCallback() {
    this.#render();
    // Builds the mark the first time the credit is on screen, then stops watching.
    this.#observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      this.dataset.built = '';
      this.#observer.disconnect();
    }, { threshold: 0.6 });
    this.#observer.observe(this);
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this.#render();
  }

  #render() {
    const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
    const lang = pickLang(this.getAttribute('lang'), document.documentElement.lang);
    root.innerHTML = `
      <style>${CSS}</style>
      <a href="${creditHref(lang, location.hostname)}" target="_blank" rel="noopener" aria-label="${LABEL[lang]}">
        <svg class="mark" viewBox="0 0 1150 744" aria-hidden="true">${BARS.map((p, i) => `<polygon class="b${i + 1}" points="${p}" style="--len:${barLength(p)}"/>`).join('')}</svg>
        <span class="sig" aria-hidden="true"><span class="text"><span class="line">${LINE[lang]}</span> <span class="name" translate="no">Esensee Solutions<svg class="flourish" viewBox="0 0 200 8" preserveAspectRatio="none"><path d="M2,5 C40,1 80,8 120,4 S180,2 198,5"/></svg></span></span></span>
      </a>`;
    const mark = this.getAttribute('accent') || this.#brandColor();
    if (mark) this.style.setProperty('--esensee-mark', mark);
    else this.style.removeProperty('--esensee-mark');
  }

  // The site's brand color, if it has one that shows up on this footer (see "The mark's color").
  #brandColor() {
    const style = getComputedStyle(this);
    const found = BRAND_VARS.map((v) => style.getPropertyValue(v).trim());
    found.push(document.querySelector('meta[name="theme-color"]')?.content.trim());
    return pickAccent(found.filter(Boolean).map((c) => this.#toRgb(c)), this.#background());
  }

  // Any CSS color ("#c9647f", "tomato", "hsl(…)") as the browser's rgb(…), or '' if it isn't one.
  #toRgb(color) {
    const probe = document.createElement('i');
    probe.style.color = color;
    if (!probe.style.color) return '';
    this.shadowRoot.append(probe);
    const rgb = getComputedStyle(probe).color;
    probe.remove();
    return rgb;
  }

  // The first solid background behind the credit, going up the page. White if there's none.
  #background() {
    for (let el = this; el; el = el.parentElement || el.getRootNode().host) {
      const bg = getComputedStyle(el).backgroundColor;
      if (parseRgb(bg)?.a > 0) return bg;
    }
    return 'rgb(255, 255, 255)';
  }
}

if (globalThis.customElements && !customElements.get('esensee-credit')) {
  customElements.define('esensee-credit', EsenseeCredit);
}

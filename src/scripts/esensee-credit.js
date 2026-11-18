// Copied from Esensee-Solutions/Esensee_Solutions, kit/credit/esensee-credit.js. Change it there
// and copy it back; it moves into the Site kit when this site goes on it.
//
// <esensee-credit>: the Credit, the "made by Estable" line at the bottom of every Client site's footer.
//
// It takes the look of the footer it sits in (its color and font are inherited), so it never
// brings Estable's look into a Client's site: the look belongs to the site (docs/adr/0004). It
// signs itself once, the first time the footer scrolls into view, like an artist signing a
// finished painting: a pen traces the Estable block row by row (ES, TA, BLE), the letters fill in,
// the full stop drops in, the words write on, and a flourish underlines the name. Then it stays
// still. With reduced motion on, it's already signed.
//
// Use it in a Client's footer (the plain link inside is what shows if the script doesn't load):
//
//   <script type="module" src="/esensee-credit.js"></script>
//   <esensee-credit lang="es"><a href="https://estable.studio/">Built by Estable Studio</a></esensee-credit>
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

export const SITE = 'https://estable.studio/';

// The words before "Estable Studio": "Built by" in both languages (its link still opens the page's language).
export const LINE = {
  es: 'Built by',
  en: 'Built by',
};

// What screen readers hear.
export const LABEL = {
  es: 'Built by Estable Studio (abre estable.studio)',
  en: 'Built by Estable Studio (opens estable.studio)',
};

export function pickLang(attr, pageLang) {
  for (const l of [attr, pageLang]) {
    const short = String(l || '')
      .slice(0, 2)
      .toLowerCase();
    if (short in LINE) return short;
  }
  return 'es';
}

// The link to Estable's site, tagged with the Client's domain so a visit can be traced to it.
export function creditHref(lang, host) {
  const url = new URL(lang === 'en' ? 'en/' : '', SITE);
  if (host) {
    url.searchParams.set('utm_source', host.replace(/^www\./, ''));
    url.searchParams.set('utm_medium', 'client-credit');
  }
  return url.href;
}

// The Estable logo, the block (ES / TA / BLE with a full stop), as in brand/logo/estable-bloque.svg
// (viewBox 8 8 240 240). Each piece is [path, row, evenodd]: the rows are traced one after another;
// evenodd pieces are the A and the B's bowls, whose openings are holes.
const PIECES = [
  [
    'M13 8H27A5 5 0 0 1 32 13V79A5 5 0 0 1 27 84H13A5 5 0 0 1 8 79V13A5 5 0 0 1 13 8ZM13 8H93.32A5 5 0 0 1 98.32 13V19A5 5 0 0 1 93.32 24H13A5 5 0 0 1 8 19V13A5 5 0 0 1 13 8ZM13 38H85.32A5 5 0 0 1 90.32 43V49A5 5 0 0 1 85.32 54H13A5 5 0 0 1 8 49V43A5 5 0 0 1 13 38ZM13 68H93.32A5 5 0 0 1 98.32 73V79A5 5 0 0 1 93.32 84H13A5 5 0 0 1 8 79V73A5 5 0 0 1 13 68ZM126.32 8H243A5 5 0 0 1 248 13V19A5 5 0 0 1 243 24H134.32A6 6 0 0 0 128.32 30V32A6 6 0 0 0 134.32 38H226A22 22 0 0 1 248 60V62A22 22 0 0 1 226 84H109.32A5 5 0 0 1 104.32 79V73A5 5 0 0 1 109.32 68H218A6 6 0 0 0 224 62V60A6 6 0 0 0 218 54H126.32A22 22 0 0 1 104.32 32V30A22 22 0 0 1 126.32 8Z',
    1,
    false,
  ],
  [
    'M13 90H105.63A5 5 0 0 1 110.63 95V101A5 5 0 0 1 105.63 106H13A5 5 0 0 1 8 101V95A5 5 0 0 1 13 90ZM50.32 90H68.32A5 5 0 0 1 73.32 95V161A5 5 0 0 1 68.32 166H50.32A5 5 0 0 1 45.32 161V95A5 5 0 0 1 50.32 90Z',
    2,
    false,
  ],
  [
    'M116.63 161V130A40 40 0 0 1 156.63 90H208A40 40 0 0 1 248 130V161A5 5 0 0 1 243 166H229A5 5 0 0 1 224 161V144H140.63V161A5 5 0 0 1 135.63 166H121.63A5 5 0 0 1 116.63 161ZM151.63 106H213A11 11 0 0 1 224 117V128H140.63V117A11 11 0 0 1 151.63 106Z',
    2,
    true,
  ],
  [
    'M13 172H27A5 5 0 0 1 32 177V243A5 5 0 0 1 27 248H13A5 5 0 0 1 8 243V177A5 5 0 0 1 13 172ZM93.81 172H107.81A5 5 0 0 1 112.81 177V243A5 5 0 0 1 107.81 248H93.81A5 5 0 0 1 88.81 243V177A5 5 0 0 1 93.81 172ZM93.81 232H136.19A5 5 0 0 1 141.19 237V243A5 5 0 0 1 136.19 248H93.81A5 5 0 0 1 88.81 243V237A5 5 0 0 1 93.81 232ZM152.19 172H166.19A5 5 0 0 1 171.19 177V243A5 5 0 0 1 166.19 248H152.19A5 5 0 0 1 147.19 243V177A5 5 0 0 1 152.19 172ZM152.19 172H217A5 5 0 0 1 222 177V183A5 5 0 0 1 217 188H152.19A5 5 0 0 1 147.19 183V177A5 5 0 0 1 152.19 172ZM152.19 202H209A5 5 0 0 1 214 207V213A5 5 0 0 1 209 218H152.19A5 5 0 0 1 147.19 213V207A5 5 0 0 1 152.19 202ZM152.19 232H217A5 5 0 0 1 222 237V243A5 5 0 0 1 217 248H152.19A5 5 0 0 1 147.19 243V237A5 5 0 0 1 152.19 232Z',
    3,
    false,
  ],
  [
    'M13 172H53.81A23 23 0 0 1 76.81 195V195A23 23 0 0 1 53.81 218H8V177A5 5 0 0 1 13 172ZM32 188H45.81A7 7 0 0 1 52.81 195V195A7 7 0 0 1 45.81 202H32V188Z',
    3,
    true,
  ],
  [
    'M8 202H59.81A23 23 0 0 1 82.81 225V225A23 23 0 0 1 59.81 248H13A5 5 0 0 1 8 243V202ZM32 218H51.81A7 7 0 0 1 58.81 225V225A7 7 0 0 1 51.81 232H32V218Z',
    3,
    true,
  ],
];
const STOP = { x: 228.0, y: 228.0, width: 20.0, height: 20.0, rx: 5.0 };

// Where a Client site keeps its brand color, most likely first.
export const BRAND_VARS = ['--brand', '--brand-color', '--color-brand', '--primary', '--color-primary', '--accent'];

// The contrast a graphic needs against its background (WCAG 1.4.11).
const MIN_CONTRAST = 3;

// "rgb(1, 2, 3)" / "rgba(1, 2, 3, 0.5)" / "rgb(1 2 3 / 50%)" → { r, g, b, a }, as browsers report colors.
export function parseRgb(value) {
  const m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+)(%?))?\s*\)$/.exec(
    String(value).trim(),
  );
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

const CSS = `
  :host { display: inline-block; color: inherit; font: inherit; line-height: 1.4; }
  a {
    display: inline-flex; align-items: center; gap: .55em; color: inherit; text-decoration: none;
    border-radius: 4px; outline-offset: 3px; -webkit-tap-highlight-color: transparent;
  }
  a:focus-visible { outline: 2px solid currentColor; }
  svg { overflow: visible; }
  .mark { width: 1.75em; height: 1.75em; flex: none; }
  .mark path, .mark rect { fill: var(--esensee-mark, currentColor); }
  .mark path { stroke: var(--esensee-mark, currentColor); stroke-width: 4; stroke-linejoin: round; stroke-opacity: 0; }
  .sig { display: inline-flex; align-items: baseline; white-space: nowrap; }
  .line { opacity: .72; }
  .name { position: relative; font-weight: 600; letter-spacing: .01em; }
  .flourish { position: absolute; left: 0; bottom: -.35em; width: 100%; height: .4em; }
  .flourish path { fill: none; stroke: var(--esensee-mark, currentColor); stroke-width: 1.6; stroke-linecap: round; vector-effect: non-scaling-stroke; }

  @media (prefers-reduced-motion: no-preference) {
    /* Before it's signed: nothing drawn yet. */
    .mark path { fill-opacity: 0; stroke-opacity: 1; stroke-dasharray: var(--len, 2000); stroke-dashoffset: var(--len, 2000); }
    .mark rect { opacity: 0; transform: translateY(-14px); transform-box: fill-box; }
    .text { clip-path: inset(-50% 100% -50% 0); }
    .flourish path { stroke-dasharray: 240; stroke-dashoffset: 240; }

    /* Signing: trace each row, fill, drop the full stop, write the words, underline. */
    :host([data-built]) .mark path { animation: trace .7s cubic-bezier(.55,.1,.35,1) forwards, fill .4s ease 1.55s forwards; }
    :host([data-built]) .r2 { animation-delay: .45s, 1.55s; }
    :host([data-built]) .r3 { animation-delay: .9s, 1.55s; }
    :host([data-built]) .mark rect { animation: drop .35s cubic-bezier(.3,1.4,.5,1) 1.75s forwards; }
    :host([data-built]) .text { animation: write .9s cubic-bezier(.3,.6,.4,1) 1.7s forwards; }
    :host([data-built]) .flourish path { animation: trace .7s ease 2.7s forwards; }

    @keyframes trace { to { stroke-dashoffset: 0; } }
    @keyframes fill { to { fill-opacity: 1; stroke-opacity: 0; } }
    @keyframes drop { to { opacity: 1; transform: none; } }
    @keyframes write { to { clip-path: inset(-50% -10% -50% 0); } }
  }
`;

// Outside a browser (the tests) there's no HTMLElement; the words and link above still load.
class EstableCredit extends (globalThis.HTMLElement ?? class {}) {
  static observedAttributes = ['lang', 'accent'];

  #observer = null;

  connectedCallback() {
    this.#render();
    // Builds the mark the first time the credit is on screen, then stops watching.
    this.#observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        this.dataset.built = '';
        this.#observer.disconnect();
      },
      { threshold: 0.6 },
    );
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
        <svg class="mark" viewBox="8 8 240 240" aria-hidden="true">${PIECES.map(([d, row, evenodd]) => `<path class="r${row}" d="${d}"${evenodd ? ' fill-rule="evenodd"' : ''}/>`).join('')}<rect x="${STOP.x}" y="${STOP.y}" width="${STOP.width}" height="${STOP.height}" rx="${STOP.rx}"/></svg>
        <span class="sig" aria-hidden="true"><span class="text"><span class="line">${LINE[lang]}</span> <span class="name" translate="no">Estable Studio<svg class="flourish" viewBox="0 0 200 8" preserveAspectRatio="none"><path d="M2,5 C40,1 80,8 120,4 S180,2 198,5"/></svg></span></span></span>
      </a>`;
    // Each piece's outline length, so the pen can trace it with a dash.
    root
      .querySelectorAll('.mark path')
      .forEach((p) => p.style.setProperty('--len', Math.ceil(p.getTotalLength?.() || 2000)));
    const mark = this.getAttribute('accent') || this.#brandColor();
    if (mark) this.style.setProperty('--esensee-mark', mark);
    else this.style.removeProperty('--esensee-mark');
  }

  // The site's brand color, if it has one that shows up on this footer (see "The mark's color").
  #brandColor() {
    const style = getComputedStyle(this);
    const found = BRAND_VARS.map((v) => style.getPropertyValue(v).trim());
    found.push(document.querySelector('meta[name="theme-color"]')?.content.trim());
    return pickAccent(
      found.filter(Boolean).map((c) => this.#toRgb(c)),
      this.#background(),
    );
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
  customElements.define('esensee-credit', EstableCredit);
}

/* ==========================================================================
   Molina Strategic Advisory — behavior
   Navigation, scroll state, reveal and the Calendly embed. Copy is rendered
   into the page at build time, so nothing here translates.
   ========================================================================== */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------ Language */

/* Switching language keeps the section you were reading. */
document.querySelectorAll<HTMLAnchorElement>('.lang-btn').forEach((link) => {
  link.addEventListener('click', () => {
    if (location.hash) link.hash = location.hash;
  });
});

/* ----------------------------------------------------------- Navigation */

const header = document.getElementById('siteHeader')!;
const nav = document.getElementById('siteNav')!;
const navToggle = document.getElementById('navToggle')!;
const scrim = document.createElement('div');
scrim.className = 'nav-scrim';
document.body.appendChild(scrim);

function setNav(open: boolean) {
  nav.classList.toggle('is-open', open);
  scrim.classList.toggle('is-open', open);
  document.body.classList.toggle('nav-open', open);
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
}

navToggle.addEventListener('click', () => {
  setNav(navToggle.getAttribute('aria-expanded') !== 'true');
});
scrim.addEventListener('click', () => setNav(false));

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setNav(false));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) {
    setNav(false);
    navToggle.focus();
  }
});

/* Sticky header shadow */
const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Highlight the section currently in view */
const navLinks = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')!))
  .filter((el): el is Element => el !== null);

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach((section) => spy.observe(section));
}

/* -------------------------------------------------------------- Reveal */

const revealables = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealables.forEach((el) => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealables.forEach((el) => revealObserver.observe(el));
}

/* ---------------------------------------------------------------- Year */

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

/* ---------------------------------------------------------- Scheduling */

/* The page only sets data-url once CALENDLY_URL in src/settings.ts is real;
   until then it shows the stand-in panel and this does nothing. */
const mount = document.getElementById('calendlyMount');
const calendlyUrl = mount?.dataset.url;

if (mount && calendlyUrl) {
  /* Calendly's own theming parameters, so the embed matches the navy section
     rather than dropping a white card into it. */
  const themed = calendlyUrl + (calendlyUrl.includes('?') ? '&' : '?') + [
    'hide_gdpr_banner=1',
    'background_color=13243f',
    'text_color=ffffff',
    'primary_color=2c63a8',
  ].join('&');

  const widget = document.createElement('div');
  widget.className = 'calendly-inline-widget';
  widget.dataset.url = themed;
  widget.style.minWidth = '320px';
  widget.style.height = '680px';
  mount.appendChild(widget);

  const script = document.createElement('script');
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.async = true;
  document.body.appendChild(script);
}

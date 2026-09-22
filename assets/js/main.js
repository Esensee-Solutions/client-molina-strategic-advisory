/* ==========================================================================
   Molina Strategic Advisory — behavior
   Language switching, navigation, scroll state, reveal, contact form.
   No build step, no dependencies.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     SCHEDULING — the one line to change before launch.

     Replace this with the real Calendly link, e.g.
       'https://calendly.com/waleska-msa/consultation'
     While the URL still contains the word "placeholder", the page renders a
     styled stand-in panel instead of embedding a booking page that does not
     exist. Change the URL and the real Calendly widget loads automatically.
     --------------------------------------------------------------------- */
  var CALENDLY_URL = 'https://calendly.com/placeholder-msa/consultation';

  var STORAGE_KEY = 'msa-lang';
  var CONTENT = window.MSA_CONTENT || { en: {}, es: {} };
  var currentLang = 'en';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- i18n */

  function t(key) {
    var dict = CONTENT[currentLang] || {};
    if (Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
    var fallback = CONTENT.en || {};
    return Object.prototype.hasOwnProperty.call(fallback, key) ? fallback[key] : '';
  }

  function applyLanguage(lang) {
    if (!CONTENT[lang]) lang = 'en';
    currentLang = lang;

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = t(el.getAttribute('data-i18n'));
      if (value) el.textContent = value;
    });

    /* Keys whose copy contains markup (e.g. a line break). */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var value = t(el.getAttribute('data-i18n-html'));
      if (value) el.innerHTML = value;
    });

    var title = t('meta.title');
    if (title) document.title = title;

    var desc = document.querySelector('meta[name="description"]');
    if (desc && t('meta.desc')) desc.setAttribute('content', t('meta.desc'));

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
  }

  function initialLanguage() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    if (stored && CONTENT[stored]) return stored;

    var params = new URLSearchParams(window.location.search);
    var fromUrl = params.get('lang');
    if (fromUrl && CONTENT[fromUrl]) return fromUrl;

    var browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return CONTENT[browser] ? browser : 'en';
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLanguage(btn.getAttribute('data-lang'));
    });
  });

  applyLanguage(initialLanguage());

  /* ----------------------------------------------------------- Navigation */

  var header = document.getElementById('siteHeader');
  var nav = document.getElementById('siteNav');
  var navToggle = document.getElementById('navToggle');
  var scrim = document.createElement('div');
  scrim.className = 'nav-scrim';
  document.body.appendChild(scrim);

  function setNav(open) {
    nav.classList.toggle('is-open', open);
    scrim.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  scrim.addEventListener('click', function () { setNav(false); });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setNav(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setNav(false);
      navToggle.focus();
    }
  });

  /* Sticky header shadow */
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Highlight the section currently in view */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* -------------------------------------------------------------- Reveal */

  var revealables = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------------- Year */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------- Scheduling */

  var mount = document.getElementById('calendlyMount');
  if (!mount) return;

  /* Calendly's own theming parameters, so the embed matches the navy section
     rather than dropping a white card into it. */
  function themedUrl(url) {
    var join = url.indexOf('?') === -1 ? '?' : '&';
    return url + join + [
      'hide_gdpr_banner=1',
      'background_color=13243f',
      'text_color=ffffff',
      'primary_color=2c63a8'
    ].join('&');
  }

  function renderPlaceholder() {
    mount.classList.add('calendly-mount-empty');
    mount.innerHTML =
      '<div class="sched-stand-in">' +
        '<span class="sched-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" ' +
               'stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="4" y="7" width="24" height="21" rx="2"/>' +
            '<path d="M4 13h24M11 4v6M21 4v6"/>' +
            '<path d="M10 19h4M18 19h4M10 24h4"/>' +
          '</svg>' +
        '</span>' +
        '<h4 class="sched-title"></h4>' +
        '<p class="sched-body"></p>' +
        '<ul class="sched-list"><li></li><li></li><li></li></ul>' +
      '</div>';
    paintPlaceholder();
  }

  /* Kept separate so the stand-in re-translates when the language changes. */
  function paintPlaceholder() {
    var box = mount.querySelector('.sched-stand-in');
    if (!box) return;
    box.querySelector('.sched-title').textContent = t('sched.title');
    box.querySelector('.sched-body').textContent = t('sched.body');
    var items = box.querySelectorAll('.sched-list li');
    ['sched.m1', 'sched.m2', 'sched.m3'].forEach(function (key, i) {
      if (items[i]) items[i].textContent = t(key);
    });
  }

  function renderCalendly() {
    var widget = document.createElement('div');
    widget.className = 'calendly-inline-widget';
    widget.setAttribute('data-url', themedUrl(CALENDLY_URL));
    widget.style.minWidth = '320px';
    widget.style.height = '680px';
    mount.appendChild(widget);

    var script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onerror = renderPlaceholder;
    document.body.appendChild(script);
  }

  if (/placeholder/i.test(CALENDLY_URL)) {
    renderPlaceholder();
  } else {
    renderCalendly();
  }

  /* The stand-in is built in JS, so it needs repainting on a language switch. */
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', paintPlaceholder);
  });

})();

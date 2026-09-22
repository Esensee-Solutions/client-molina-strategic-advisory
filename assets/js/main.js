/* ==========================================================================
   Molina Strategic Advisory — behavior
   Language switching, navigation, scroll state, reveal, contact form.
   No build step, no dependencies.
   ========================================================================== */

(function () {
  'use strict';

  /* Set this to a form endpoint (Formspree, Basin, Netlify Forms, your own
     handler) to receive submissions by POST. Left empty, the form falls back
     to opening the visitor's email client with the message pre-filled. */
  var FORM_ENDPOINT = '';
  var CONTACT_EMAIL = 'hello@molinastrategicadvisory.com';

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

  /* -------------------------------------------------------- Contact form */

  var form = document.getElementById('contactForm');
  if (!form) return;

  var status = document.getElementById('formStatus');

  function clearError(field) {
    field.classList.remove('has-error');
    var msg = field.querySelector('.field-error');
    if (msg) msg.remove();
    var input = field.querySelector('input, select, textarea');
    if (input) input.removeAttribute('aria-invalid');
  }

  function showError(input, message) {
    var field = input.closest('.field');
    if (!field) return;
    clearError(field);
    field.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    var msg = document.createElement('p');
    msg.className = 'field-error';
    msg.textContent = message;
    field.appendChild(msg);
  }

  form.querySelectorAll('input, select, textarea').forEach(function (input) {
    input.addEventListener('input', function () {
      var field = input.closest('.field');
      if (field && field.classList.contains('has-error')) clearError(field);
    });
  });

  function validate() {
    var firstInvalid = null;

    form.querySelectorAll('[required]').forEach(function (input) {
      var value = input.value.trim();
      if (!value) {
        showError(input, t('form.err.required'));
        if (!firstInvalid) firstInvalid = input;
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        showError(input, t('form.err.email'));
        if (!firstInvalid) firstInvalid = input;
      }
    });

    return firstInvalid;
  }

  function labelFor(name) {
    var input = form.elements[name];
    if (!input) return name;
    var field = input.closest('.field');
    var label = field && field.querySelector('label');
    return label ? label.textContent : name;
  }

  function readableValue(input) {
    if (input.tagName === 'SELECT' && input.selectedIndex > -1) {
      return input.options[input.selectedIndex].value ? input.options[input.selectedIndex].textContent : '';
    }
    return input.value.trim();
  }

  function collect() {
    var data = {};
    ['name', 'company', 'email', 'phone', 'employees', 'topic', 'message'].forEach(function (key) {
      var input = form.elements[key];
      if (input) data[key] = readableValue(input);
    });
    data.language = currentLang;
    return data;
  }

  function mailtoFallback(data) {
    var lines = ['name', 'company', 'email', 'phone', 'employees', 'topic'].map(function (key) {
      return labelFor(key) + ': ' + (data[key] || '—');
    });
    if (data.message) lines.push('', data.message);

    var subject = 'Website inquiry — ' + (data.company || data.name || 'MSA');
    window.location.href =
      'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    status.classList.remove('is-error');

    var invalid = validate();
    if (invalid) {
      invalid.focus();
      return;
    }

    var data = collect();
    var submitBtn = form.querySelector('button[type="submit"]');

    if (!FORM_ENDPOINT) {
      status.textContent = t('form.mailto');
      mailtoFallback(data);
      return;
    }

    submitBtn.disabled = true;
    status.textContent = t('form.sending');

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        form.reset();
        status.textContent = t('form.sent');
      })
      .catch(function () {
        status.classList.add('is-error');
        status.textContent = t('form.failed');
      })
      .then(function () {
        submitBtn.disabled = false;
      });
  });
})();

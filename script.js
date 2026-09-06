(() => {
  'use strict';
  const doc = document;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.documentElement.classList.add('js');

  if (doc.querySelector('.subpage-hero,.simple-page,.service-page,.section-services')) {
    const legacy = doc.createElement('link');
    legacy.rel = 'stylesheet';
    legacy.href = '/legacy.css';
    doc.head.appendChild(legacy);
  }

  const header = doc.querySelector('[data-header]');
  if (header) {
    let scheduled = false;
    const paint = () => { header.classList.toggle('is-scrolled', scrollY > 20); scheduled = false; };
    const onScroll = () => { if (!scheduled) { requestAnimationFrame(paint); scheduled = true; } };
    paint();
    addEventListener('scroll', onScroll, { passive: true });
  }

  const menu = doc.querySelector('[data-menu-toggle]');
  const nav = doc.querySelector('[data-nav]');
  if (menu && nav) {
    const close = () => {
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Åbn menu');
      nav.classList.remove('is-open');
      doc.body.classList.remove('menu-open');
    };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') === 'true';
      if (open) return close();
      menu.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-label', 'Luk menu');
      nav.classList.add('is-open');
      doc.body.classList.add('menu-open');
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    doc.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    addEventListener('resize', () => { if (innerWidth > 900) close(); }, { passive: true });
  }

  const reveal = [...doc.querySelectorAll('.reveal')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveal.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: .08 });
    reveal.forEach(el => observer.observe(el));
  }

  doc.querySelectorAll('[data-service-image]').forEach(img => {
    const markLoaded = () => img.classList.add('is-loaded');
    if (img.complete && img.naturalWidth > 0) markLoaded();
    else img.addEventListener('load', markLoaded, { once: true });
    img.addEventListener('error', () => img.removeAttribute('src'), { once: true });
  });

  const cards = [...doc.querySelectorAll('[data-service-card]')];
  cards.forEach(card => {
    card.addEventListener('toggle', () => {
      if (!card.open) return;
      cards.forEach(other => { if (other !== card) other.open = false; });
    });
  });

  const serviceSelect = doc.querySelector('[data-service-select]');
  doc.querySelectorAll('[data-service-quote]').forEach(link => {
    link.addEventListener('click', () => {
      if (serviceSelect) {
        serviceSelect.value = link.dataset.serviceQuote || '';
        serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });

  doc.querySelectorAll('.faq-list').forEach(list => {
    list.addEventListener('toggle', event => {
      const opened = event.target;
      if (!(opened instanceof HTMLDetailsElement) || !opened.open) return;
      list.querySelectorAll('details[open]').forEach(d => { if (d !== opened) d.open = false; });
    }, true);
  });

  const form = doc.querySelector('[data-contact-form]');
  if (form) {
    const requestedService = new URLSearchParams(location.search).get('service');
    if (requestedService && serviceSelect && [...serviceSelect.options].some(option => option.value === requestedService)) {
      serviceSelect.value = requestedService;
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const clean = value => String(value || '').trim().replace(/\r?\n/g, '\n');
      const name = clean(data.get('name'));
      const phone = clean(data.get('phone'));
      const email = clean(data.get('email'));
      const service = clean(data.get('service')) || 'Murerarbejde';
      const message = clean(data.get('message'));
      const subject = `Forespørgsel: ${service}${name ? ` – ${name}` : ''}`.slice(0, 150);
      const body = [
        'Hej DME Murerforretning', '', 'Jeg vil gerne høre om følgende opgave:', '', message, '',
        `Opgavetype: ${service}`, `Navn: ${name}`, `Telefon: ${phone || 'Ikke oplyst'}`, `E-mail: ${email}`, '',
        'Jeg vedhæfter eventuelle billeder i denne e-mail.', '', 'Venlig hilsen', name
      ].join('\n').slice(0, 7000);
      location.href = `mailto:info@dmemurer.dk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  doc.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  const video = doc.querySelector('[data-hero-video]');
  if (video && video.querySelector('source[src]')) {
    video.addEventListener('canplay', () => video.classList.add('is-ready'), { once: true });
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
  }
})();

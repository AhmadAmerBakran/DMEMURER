(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  root.classList.add('js');

  const header = doc.querySelector('[data-header]');
  const menuButton = doc.querySelector('[data-menu-toggle]');
  const nav = doc.querySelector('[data-nav]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header state is updated inside requestAnimationFrame to avoid work on every scroll event.
  if (header) {
    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    };
    const requestHeaderUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };
    updateHeader();
    window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
  }

  // Accessible mobile navigation.
  if (menuButton && nav) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Åbn menu');
      nav.classList.remove('is-open');
      doc.body.classList.remove('menu-open');
    };

    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeMenu();
      } else {
        menuButton.setAttribute('aria-expanded', 'true');
        menuButton.setAttribute('aria-label', 'Luk menu');
        nav.classList.add('is-open');
        doc.body.classList.add('menu-open');
      }
    });

    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });

    doc.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    }, { passive: true });
  }

  // Subtle entrance transitions; everything remains readable when reduced motion is preferred.
  const revealItems = [...doc.querySelectorAll('.reveal')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });

    revealItems.forEach(item => revealObserver.observe(item));
  }

  // Keep one FAQ item open at a time within each FAQ group. Native <details> remains fully usable without JS.
  doc.querySelectorAll('.faq-list').forEach(list => {
    list.addEventListener('toggle', event => {
      const opened = event.target;
      if (!(opened instanceof HTMLDetailsElement) || !opened.open) return;
      list.querySelectorAll('details[open]').forEach(detail => {
        if (detail !== opened) detail.open = false;
      });
    }, true);
  });

  // The form deliberately creates an email instead of transmitting or storing personal data on the site.
  const form = doc.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const email = String(data.get('email') || '').trim();
      const service = String(data.get('service') || 'Murerarbejde').trim();
      const message = String(data.get('message') || '').trim();

      const subject = `Forespørgsel: ${service}${name ? ` – ${name}` : ''}`;
      const body = [
        'Hej DME Murerforretning',
        '',
        'Jeg vil gerne høre om følgende opgave:',
        '',
        message,
        '',
        `Opgavetype: ${service}`,
        `Navn: ${name}`,
        `Telefon: ${phone || 'Ikke oplyst'}`,
        `E-mail: ${email}`,
        '',
        'Jeg vedhæfter eventuelle billeder i denne e-mail.',
        '',
        'Venlig hilsen',
        name
      ].join('\n');

      window.location.href = `mailto:info@dmemurer.dk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  // Automatically populate the copyright year without a yearly content edit.
  doc.querySelectorAll('[data-year]').forEach(node => {
    node.textContent = String(new Date().getFullYear());
  });

  // If video sources are added to the banner later, try playback without making video a requirement.
  const heroVideo = doc.querySelector('.hero-video');
  if (heroVideo && heroVideo.querySelector('source[src]')) {
    heroVideo.preload = 'metadata';
    const playAttempt = heroVideo.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.catch(() => {});
    }
  }
})();

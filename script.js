(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  root.classList.add('js');

  // Existing subpages keep their legacy layer. The homepage gets the dedicated god.css layer in index.html.
  if (doc.querySelector('.subpage-hero,.simple-page,.service-page,.section-services')) {
    const legacy = doc.createElement('link');
    legacy.rel = 'stylesheet';
    legacy.href = '/legacy.css';
    doc.head.appendChild(legacy);
  }

  // Header state + scroll progress are painted in one animation frame to avoid scroll jank.
  const header = doc.querySelector('[data-header]');
  const progress = doc.querySelector('[data-scroll-progress]');
  let scrollFrame = 0;

  const paintScrollState = () => {
    if (header) header.classList.toggle('is-scrolled', scrollY > 20);
    if (progress) {
      const max = Math.max(1, doc.documentElement.scrollHeight - innerHeight);
      const ratio = Math.min(1, Math.max(0, scrollY / max));
      progress.style.transform = `scaleX(${ratio})`;
    }
    scrollFrame = 0;
  };

  const scheduleScrollPaint = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(paintScrollState);
  };

  paintScrollState();
  addEventListener('scroll', scheduleScrollPaint, { passive: true });
  addEventListener('resize', scheduleScrollPaint, { passive: true });

  // Mobile navigation.
  const menu = doc.querySelector('[data-menu-toggle]');
  const nav = doc.querySelector('[data-nav]');
  if (menu && nav) {
    const close = () => {
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Åbn menu');
      nav.classList.remove('is-open');
      body.classList.remove('menu-open');
    };

    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') === 'true';
      if (open) return close();
      menu.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-label', 'Luk menu');
      nav.classList.add('is-open');
      body.classList.add('menu-open');
    });

    nav.addEventListener('click', event => {
      if (event.target.closest('a')) close();
    });

    doc.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
    });

    addEventListener('resize', () => {
      if (innerWidth > 960) close();
    }, { passive: true });
  }

  // Staggered reveals. data-reveal-delay is kept tiny and only affects opacity/transform.
  const reveals = [...doc.querySelectorAll('.reveal')];
  reveals.forEach(element => {
    const delay = Number.parseInt(element.dataset.revealDelay || '0', 10);
    if (Number.isFinite(delay) && delay > 0) element.style.setProperty('--reveal-delay', `${Math.min(delay, 600)}ms`);
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(element => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });

    reveals.forEach(element => revealObserver.observe(element));
  }

  // Build-on-scroll scenes. These switch a class once; CSS performs transform-only animation.
  const buildScenes = [...doc.querySelectorAll('[data-build-scene]')];
  const processRail = doc.querySelector('[data-process-rail]');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    buildScenes.forEach(scene => scene.classList.add('is-built'));
    if (processRail) processRail.classList.add('is-drawn');
  } else {
    const buildObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (entry.target.matches('[data-build-scene]')) entry.target.classList.add('is-built');
        if (entry.target.matches('[data-process-rail]')) entry.target.classList.add('is-drawn');
        buildObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    buildScenes.forEach(scene => buildObserver.observe(scene));
    if (processRail) buildObserver.observe(processRail);
  }

  // Hero construction scene gets subtle pointer depth on desktop only.
  const buildStage = doc.querySelector('[data-build-stage]');
  if (buildStage && finePointer && !reducedMotion) {
    let pointerFrame = 0;
    let targetX = 0;
    let targetY = 0;

    const paintPointer = () => {
      buildStage.style.setProperty('--mx', `${targetX}px`);
      buildStage.style.setProperty('--my', `${targetY}px`);
      pointerFrame = 0;
    };

    buildStage.addEventListener('pointermove', event => {
      const rect = buildStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = Math.max(-1, Math.min(1, x * 2)) * 8;
      targetY = Math.max(-1, Math.min(1, y * 2)) * 6;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
    }, { passive: true });

    buildStage.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
    }, { passive: true });
  }

  // Service media placeholders disappear only when a real image loaded successfully.
  doc.querySelectorAll('[data-service-image]').forEach(img => {
    const markLoaded = () => img.classList.add('is-loaded');
    if (img.complete && img.naturalWidth > 0) markLoaded();
    else img.addEventListener('load', markLoaded, { once: true });
    img.addEventListener('error', () => img.removeAttribute('src'), { once: true });
  });

  // Keep only one service expanded at a time.
  const serviceCards = [...doc.querySelectorAll('[data-service-card]')];
  serviceCards.forEach(card => {
    card.addEventListener('toggle', () => {
      if (!card.open) return;
      serviceCards.forEach(other => {
        if (other !== card) other.open = false;
      });
    });
  });

  // Clicking "Få tilbud" in a service preselects that service in the same contact form.
  const serviceSelect = doc.querySelector('[data-service-select]');
  doc.querySelectorAll('[data-service-quote]').forEach(link => {
    link.addEventListener('click', () => {
      if (!serviceSelect) return;
      serviceSelect.value = link.dataset.serviceQuote || '';
      serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // FAQ accordion.
  doc.querySelectorAll('.faq-list').forEach(list => {
    list.addEventListener('toggle', event => {
      const opened = event.target;
      if (!(opened instanceof HTMLDetailsElement) || !opened.open) return;
      list.querySelectorAll('details[open]').forEach(item => {
        if (item !== opened) item.open = false;
      });
    }, true);
  });

  // Active navigation state follows the visible homepage section.
  if (nav && 'IntersectionObserver' in window) {
    const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
    const sectionMap = new Map();

    navLinks.forEach(link => {
      const id = link.getAttribute('href');
      if (!id || id === '#top') return;
      const section = doc.querySelector(id);
      if (section) sectionMap.set(section, link);
    });

    if (sectionMap.size) {
      const sectionObserver = new IntersectionObserver(entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach(link => link.classList.remove('is-active'));
        sectionMap.get(visible.target)?.classList.add('is-active');
      }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.01, 0.2, 0.5] });

      sectionMap.forEach((_, section) => sectionObserver.observe(section));
    }
  }

  // No backend is used: validate locally, sanitize to plain text, and compose a mailto URI.
  const form = doc.querySelector('[data-contact-form]');
  if (form) {
    const requestedService = new URLSearchParams(location.search).get('service');
    if (
      requestedService &&
      serviceSelect &&
      [...serviceSelect.options].some(option => option.value === requestedService)
    ) {
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
      const emailBody = [
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
      ].join('\n').slice(0, 7000);

      location.href = `mailto:info@dmemurer.dk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    });
  }

  // Current year.
  doc.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });

  // Video stays invisible until a real source is enabled and can play; CSS fallback remains behind it.
  const video = doc.querySelector('[data-hero-video]');
  if (video && video.querySelector('source[src]')) {
    const ready = () => video.classList.add('is-ready');
    video.addEventListener('canplay', ready, { once: true });
    video.addEventListener('loadeddata', ready, { once: true });
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
  }
})();

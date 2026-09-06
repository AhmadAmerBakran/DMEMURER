(() => {
  'use strict';

  const dokument = document;
  const side = dokument.body;
  const reduceretBevaegelse = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sparData = Boolean(navigator.connection && navigator.connection.saveData);

  const ydelser = {
    nybyggeri: {
      navn: 'Nybyggeri',
      overlinje: 'Nyt murværk',
      billede: '/assets/images/services/service-nybyggeri.webp',
      alt: 'Nybyggeri og nyt murværk',
      url: '/ydelser/nybyggeri/',
      indledning: 'Nyt murværk skal være gennemtænkt fra første skifte. Vi arbejder med opbygning, proportioner og afslutninger, så konstruktionen bliver både solid og visuelt rolig.',
      punkter: ['Murværk og skalmuring', 'Sokkel- og detaljearbejde', 'Åbninger, hjørner og afslutninger']
    },
    'fliser-klinker': {
      navn: 'Fliser og klinker',
      overlinje: 'Flader og afslutninger',
      billede: '/assets/images/services/service-fliser-klinker.webp',
      alt: 'Fliser og klinker lagt med præcise linjer',
      url: '/ydelser/fliser-klinker/',
      indledning: 'Et skarpt flisearbejde begynder med underlaget. Vi planlægger opmåling, forbandt, skæringer og fuger, så linjerne hænger sammen i hele rummet.',
      punkter: ['Gulv- og vægfliser', 'Klinker og store formater', 'Fuger, kanter og præcise skæringer']
    },
    badevaerelser: {
      navn: 'Badeværelser',
      overlinje: 'Vådrum med præcision',
      billede: '/assets/images/services/service-badevaerelser.webp',
      alt: 'Murerarbejde i badeværelse',
      url: '/ydelser/badevaerelse/',
      indledning: 'Et badeværelse kræver omhu i alle lag. Vi har fokus på korrekt underlag, fald, placeringer og flisearbejde, så funktion og udtryk bliver tænkt sammen.',
      punkter: ['Fliser og klinker i vådrum', 'Fald, underlag og opbygning', 'Nicher, kanter og afslutninger']
    },
    'facader-fuger': {
      navn: 'Facader og fuger',
      overlinje: 'Murværkets yderside',
      billede: '/assets/images/services/service-facader-fuger.webp',
      alt: 'Facade og fuger i murværk',
      url: '/ydelser/facader-fuger/',
      indledning: 'Facaden skal både beskytte huset og passe til dets karakter. Vi tilpasser løsningen til sten, mørtel og eksisterende murværk, så reparationen falder naturligt ind.',
      punkter: ['Omfugning og fugereparation', 'Lokale facadereparationer', 'Udskiftning af beskadigede sten']
    },
    renovering: {
      navn: 'Renovering',
      overlinje: 'Nyt møder eksisterende',
      billede: '/assets/images/services/service-renovering.webp',
      alt: 'Renovering af eksisterende murværk',
      url: '/ydelser/renovering/',
      indledning: 'Ved renovering skal den nye løsning spille sammen med det, der allerede står. Vi vurderer konstruktion, underlag og materialer, før arbejdet bliver tilpasset huset.',
      punkter: ['Indvendigt og udvendigt murerarbejde', 'Ændringer og genetablering', 'Tilpasning til eksisterende konstruktioner']
    },
    tilbygning: {
      navn: 'Tilbygning',
      overlinje: 'Plads med sammenhæng',
      billede: '/assets/images/services/service-tilbygning.webp',
      alt: 'Murværk til tilbygning',
      url: '/ydelser/tilbygning/',
      indledning: 'En tilbygning bør føles som en naturlig del af huset. Vi arbejder med sammenbygning, proportioner og materialevalg, så overgangen mellem nyt og eksisterende bliver overbevisende.',
      punkter: ['Murværk til tilbygninger', 'Sammenbygning med eksisterende murværk', 'Detaljer ved åbninger og overgange']
    },
    reparationer: {
      navn: 'Reparationer',
      overlinje: 'Skader løst ved årsagen',
      billede: '/assets/images/services/service-reparationer.webp',
      alt: 'Reparation af murværk og fuger',
      url: '/ydelser/murvaerk-reparation/',
      indledning: 'En holdbar reparation kræver, at årsagen bliver vurderet først. Revner, løse fuger og beskadigede sten bliver gennemgået, før den rigtige løsning vælges.',
      punkter: ['Revner og lokale skader', 'Udskiftning af sten og fuger', 'Mindre reparationsopgaver']
    }
  };

  const sidehoved = dokument.querySelector('[data-sidehoved]');
  const fremdrift = dokument.querySelector('[data-laese-fremdrift]');

  const opdaterRulning = () => {
    const y = window.scrollY;
    sidehoved?.classList.toggle('er-rullet', y > 24 || side.classList.contains('privatlivsside'));
    if (!fremdrift) return;
    const hoejde = dokument.documentElement.scrollHeight - window.innerHeight;
    fremdrift.style.transform = `scaleX(${hoejde > 0 ? Math.min(y / hoejde, 1) : 0})`;
  };

  const genopretSidevisning = () => requestAnimationFrame(() => requestAnimationFrame(opdaterRulning));

  opdaterRulning();
  addEventListener('scroll', opdaterRulning, { passive: true });
  addEventListener('resize', opdaterRulning, { passive: true });
  addEventListener('pageshow', genopretSidevisning);

  const menuknap = dokument.querySelector('[data-menuknap]');
  const navigation = dokument.querySelector('[data-navigation]');

  const lukMenu = () => {
    navigation?.classList.remove('er-aaben');
    menuknap?.setAttribute('aria-expanded', 'false');
    menuknap?.setAttribute('aria-label', 'Åbn menu');
  };

  menuknap?.addEventListener('click', () => {
    const aaben = !navigation?.classList.contains('er-aaben');
    navigation?.classList.toggle('er-aaben', aaben);
    menuknap.setAttribute('aria-expanded', String(aaben));
    menuknap.setAttribute('aria-label', aaben ? 'Luk menu' : 'Åbn menu');
  });

  navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', lukMenu));
  addEventListener('keydown', event => {
    if (event.key === 'Escape') lukMenu();
  });

  const vises = [...dokument.querySelectorAll('.vises')];
  vises.forEach(element => {
    const forsinkelse = Number(element.dataset.forsinkelse || 0);
    if (forsinkelse) element.style.transitionDelay = `${Math.min(forsinkelse, 500)}ms`;
  });

  if (reduceretBevaegelse || !('IntersectionObserver' in window)) {
    vises.forEach(element => element.classList.add('er-synlig'));
  } else {
    const observatoer = new IntersectionObserver(poster => {
      poster.forEach(post => {
        if (!post.isIntersecting) return;
        post.target.classList.add('er-synlig');
        observatoer.unobserve(post.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    vises.forEach(element => observatoer.observe(element));
  }

  dokument.querySelectorAll('.ydelseskort__medie img').forEach(billede => {
    const markManglende = () => billede.classList.add('billede-mangler');
    billede.addEventListener('error', markManglende, { once: true });
    if (billede.complete && billede.naturalWidth === 0) markManglende();
  });

  const bannerMedie = dokument.querySelector('[data-banner-medie]');
  const bannerVideo = dokument.querySelector('[data-banner-video]');

  if (bannerMedie && bannerVideo) {
    const kilder = [...bannerVideo.querySelectorAll('source[data-src]')];
    const maaAfspille = !reduceretBevaegelse && !sparData && kilder.length > 0;

    if (maaAfspille) {
      kilder.forEach(kilde => {
        kilde.src = kilde.dataset.src;
      });
      bannerVideo.load();

      const visVideo = () => bannerMedie.classList.add('har-video');
      bannerVideo.addEventListener('loadeddata', visVideo, { once: true });
      bannerVideo.addEventListener('canplay', visVideo, { once: true });
      bannerVideo.play().catch(() => {});

      dokument.addEventListener('visibilitychange', () => {
        if (dokument.hidden) bannerVideo.pause();
        else bannerVideo.play().catch(() => {});
      });
    } else {
      bannerVideo.pause();
      bannerVideo.removeAttribute('autoplay');
      bannerMedie.classList.add('video-fravalgt');
    }
  }

  const dialog = dokument.querySelector('[data-ydelsesdialog]');
  const dialogTitel = dialog?.querySelector('[data-dialog-titel]');
  const dialogOverlinje = dialog?.querySelector('[data-dialog-overlinje]');
  const dialogIndledning = dialog?.querySelector('[data-dialog-indledning]');
  const dialogPunkter = dialog?.querySelector('[data-dialog-punkter]');
  const dialogBillede = dialog?.querySelector('[data-dialog-billede]');
  const dialogTilbud = dialog?.querySelector('[data-dialog-tilbud]');
  const dialogLaes = dialog?.querySelector('[data-dialog-laes]');
  let aktivYdelse = '';
  let dialogAabner = null;
  let beholdFokusEfterDialog = false;

  const lukDialog = () => {
    if (dialog?.open) dialog.close();
  };

  const aabnYdelse = (noegle, udloeser) => {
    const ydelse = ydelser[noegle];
    if (!ydelse || !dialog) return;

    aktivYdelse = ydelse.navn;
    dialogAabner = udloeser || dokument.activeElement;
    beholdFokusEfterDialog = false;

    if (dialogTitel) dialogTitel.textContent = ydelse.navn;
    if (dialogOverlinje) dialogOverlinje.textContent = ydelse.overlinje;
    if (dialogIndledning) dialogIndledning.textContent = ydelse.indledning;
    if (dialogLaes) {
      dialogLaes.href = ydelse.url;
      const tekst = dialogLaes.querySelector('span');
      if (tekst) tekst.textContent = `Læs mere om ${ydelse.navn.toLowerCase()}`;
    }
    if (dialogPunkter) {
      dialogPunkter.replaceChildren(...ydelse.punkter.map(tekst => {
        const punkt = dokument.createElement('li');
        punkt.textContent = tekst;
        return punkt;
      }));
    }
    if (dialogBillede) {
      dialogBillede.classList.remove('billede-mangler');
      dialogBillede.alt = ydelse.alt;
      dialogBillede.src = ydelse.billede;
    }

    dialog.showModal();
    side.classList.add('dialog-aaben');
    requestAnimationFrame(() => dialog.querySelector('[data-dialog-luk]')?.focus());
  };

  dokument.querySelectorAll('[data-ydelse]').forEach(kort => {
    kort.addEventListener('click', () => aabnYdelse(kort.dataset.ydelse, kort));
  });

  dialogBillede?.addEventListener('error', () => dialogBillede.classList.add('billede-mangler'));
  dialog?.querySelector('[data-dialog-luk]')?.addEventListener('click', lukDialog);
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) lukDialog();
  });
  dialog?.addEventListener('close', () => {
    side.classList.remove('dialog-aaben');
    if (!beholdFokusEfterDialog && dialogAabner instanceof HTMLElement && dokument.contains(dialogAabner)) {
      dialogAabner.focus({ preventScroll: true });
    }
  });

  const formular = dokument.querySelector('[data-kontaktformular]');
  const ydelsesvalg = formular?.querySelector('[data-ydelsesvalg]');
  const formularstatus = formular?.querySelector('[data-formularstatus]');
  const byggeviser = dokument.querySelector('[data-byggeviser]');
  const kraevedeFelter = formular ? [...formular.querySelectorAll('input[required]:not([type="checkbox"]),select[required],textarea[required],input[type="checkbox"][required]')] : [];

  const feltErUdfyldt = felt => felt.type === 'checkbox'
    ? felt.checked
    : felt.value.trim().length > 0 && felt.validity.valid;

  const opdaterByggeviser = () => {
    if (!byggeviser) return;
    byggeviser.dataset.niveau = String(Math.min(kraevedeFelter.filter(feltErUdfyldt).length, 5));
  };

  const opretTilpassetValg = select => {
    if (!select || select.dataset.tilpasset === 'ja') return null;
    select.dataset.tilpasset = 'ja';
    select.classList.add('valg-original');

    const felt = select.closest('.felt');
    felt?.classList.add('har-valg');

    const navn = felt?.querySelector('.felt__navn');
    if (navn && !navn.id) navn.id = 'opgavetype-navn';

    const valg = dokument.createElement('div');
    valg.className = 'valg';

    const knap = dokument.createElement('button');
    knap.type = 'button';
    knap.className = 'valg__knap';
    knap.setAttribute('aria-haspopup', 'listbox');
    knap.setAttribute('aria-expanded', 'false');
    if (navn?.id) knap.setAttribute('aria-labelledby', navn.id);

    const tekst = dokument.createElement('span');
    const pil = dokument.createElement('i');
    pil.className = 'valg__pil';
    pil.setAttribute('aria-hidden', 'true');
    knap.append(tekst, pil);

    const liste = dokument.createElement('div');
    const listeId = `opgavetype-liste-${Math.random().toString(36).slice(2, 8)}`;
    liste.id = listeId;
    liste.className = 'valg__liste';
    liste.setAttribute('role', 'listbox');
    if (navn?.id) liste.setAttribute('aria-labelledby', navn.id);
    knap.setAttribute('aria-controls', listeId);

    [...select.options].filter(option => option.value !== '').forEach(option => {
      const mulighed = dokument.createElement('button');
      mulighed.type = 'button';
      mulighed.className = 'valg__mulighed';
      mulighed.setAttribute('role', 'option');
      mulighed.dataset.vaerdi = option.value || option.textContent.trim();
      mulighed.textContent = option.textContent.trim();
      liste.append(mulighed);
    });

    valg.append(knap, liste);
    select.insertAdjacentElement('afterend', valg);

    const poster = () => [...liste.querySelectorAll('.valg__mulighed')];

    const synkroniser = () => {
      const valgt = select.options[select.selectedIndex];
      tekst.textContent = valgt?.value ? valgt.textContent.trim() : 'Vælg ydelse';
      knap.classList.toggle('er-tom', !valgt?.value);
      poster().forEach(mulighed => {
        mulighed.setAttribute('aria-selected', String(mulighed.dataset.vaerdi === select.value));
      });
    };

    const luk = ({ fokusKnap = false } = {}) => {
      felt?.classList.remove('valg-aaben');
      knap.setAttribute('aria-expanded', 'false');
      if (fokusKnap) knap.focus();
    };

    const aabn = retning => {
      felt?.classList.add('valg-aaben');
      knap.setAttribute('aria-expanded', 'true');
      const muligheder = poster();
      const valgt = liste.querySelector('[aria-selected="true"]');
      const maal = retning === 'sidste' ? muligheder.at(-1) : (valgt || muligheder[0]);
      requestAnimationFrame(() => maal?.focus());
    };

    knap.addEventListener('click', event => {
      event.preventDefault();
      knap.getAttribute('aria-expanded') === 'true' ? luk() : aabn('valgt');
    });

    knap.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        aabn('første');
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        aabn('sidste');
      } else if (event.key === 'Escape') {
        event.preventDefault();
        luk();
      }
    });

    liste.addEventListener('click', event => {
      const mulighed = event.target.closest('.valg__mulighed');
      if (!mulighed) return;
      select.value = mulighed.dataset.vaerdi;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      synkroniser();
      luk({ fokusKnap: true });
    });

    liste.addEventListener('keydown', event => {
      const muligheder = poster();
      const indeks = muligheder.indexOf(dokument.activeElement);

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        muligheder[(indeks + 1 + muligheder.length) % muligheder.length]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        muligheder[(indeks - 1 + muligheder.length) % muligheder.length]?.focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        muligheder[0]?.focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        muligheder.at(-1)?.focus();
      } else if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') event.preventDefault();
        luk({ fokusKnap: event.key === 'Escape' });
      }
    });

    select.addEventListener('change', synkroniser);
    select.addEventListener('focus', () => knap.focus());
    dokument.addEventListener('pointerdown', event => {
      if (!valg.contains(event.target)) luk();
    });

    synkroniser();
    return { knap, synkroniser, luk };
  };

  const forespurgtYdelse = new URLSearchParams(location.search).get('service');
  if (forespurgtYdelse && ydelsesvalg) {
    const mulighed = [...ydelsesvalg.options].find(option => option.textContent.trim() === forespurgtYdelse.trim());
    if (mulighed) ydelsesvalg.value = mulighed.value || mulighed.textContent;
  }

  const tilpassetValg = opretTilpassetValg(ydelsesvalg);

  const gaTilTilbud = navn => {
    if (!formular || !ydelsesvalg) return;

    const mulighed = [...ydelsesvalg.options].find(option => option.textContent.trim() === navn);
    if (mulighed) {
      ydelsesvalg.value = mulighed.value || mulighed.textContent;
      ydelsesvalg.dispatchEvent(new Event('change', { bubbles: true }));
      tilpassetValg?.synkroniser();
    }

    beholdFokusEfterDialog = true;
    lukDialog();
    formular.scrollIntoView({ behavior: reduceretBevaegelse ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => formular.querySelector('input[name="navn"]')?.focus({ preventScroll: true }), reduceretBevaegelse ? 0 : 550);
    opdaterByggeviser();
  };

  dialogTilbud?.addEventListener('click', () => gaTilTilbud(aktivYdelse));

  formular?.addEventListener('input', event => {
    event.target.closest('.felt')?.classList.remove('har-fejl');
    event.target.closest('.samtykke')?.classList.remove('har-fejl');
    if (formularstatus) formularstatus.textContent = '';
    opdaterByggeviser();
  });

  formular?.addEventListener('change', event => {
    event.target.closest('.felt')?.classList.remove('har-fejl');
    event.target.closest('.samtykke')?.classList.remove('har-fejl');
    if (formularstatus) formularstatus.textContent = '';
    opdaterByggeviser();
  });

  opdaterByggeviser();

  formular?.addEventListener('submit', event => {
    event.preventDefault();

    formular.querySelectorAll('.har-fejl').forEach(felt => felt.classList.remove('har-fejl'));
    const ugyldige = [...formular.querySelectorAll('input,select,textarea')].filter(felt => !felt.validity.valid);

    if (ugyldige.length) {
      ugyldige.forEach(felt => {
        felt.closest('.felt')?.classList.add('har-fejl');
        felt.closest('.samtykke')?.classList.add('har-fejl');
      });
      if (formularstatus) formularstatus.textContent = 'Udfyld venligst de markerede oplysninger, før du går videre.';
      const foerste = ugyldige[0];
      if (foerste === ydelsesvalg && tilpassetValg) tilpassetValg.knap.focus();
      else foerste.focus();
      return;
    }

    const data = new FormData(formular);
    const navn = String(data.get('navn') || '').trim();
    const telefon = String(data.get('telefon') || '').trim();
    const email = String(data.get('email') || '').trim();
    const ydelse = String(data.get('ydelse') || '').trim();
    const besked = String(data.get('besked') || '').trim();

    const emne = `Tilbudsforespørgsel – ${ydelse}`;
    const indhold = [
      'Hej DME Murerforretning,',
      '',
      'Jeg vil gerne høre mere om følgende opgave:',
      '',
      `Navn: ${navn}`,
      `Telefon: ${telefon || 'Ikke oplyst'}`,
      `E-mail: ${email}`,
      `Opgavetype: ${ydelse}`,
      '',
      'Beskrivelse:',
      besked,
      '',
      'Venlig hilsen',
      navn
    ].join('\n');

    if (formularstatus) {
      formularstatus.textContent = 'Din e-mailapp åbnes nu. Hvis der ikke sker noget, kan du skrive direkte til info@dmemurer.dk.';
    }
    location.href = `mailto:info@dmemurer.dk?subject=${encodeURIComponent(emne)}&body=${encodeURIComponent(indhold)}`;
  });

  dokument.querySelectorAll('.spoergsmaal details').forEach(spoergsmaal => {
    spoergsmaal.addEventListener('toggle', () => {
      if (!spoergsmaal.open) return;
      dokument.querySelectorAll('.spoergsmaal details[open]').forEach(andet => {
        if (andet !== spoergsmaal) andet.removeAttribute('open');
      });
    });
  });

  dokument.querySelectorAll('[data-aar]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });
})();
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const menuOverlay = document.querySelector('.menu-overlay');
const heroMedia = document.querySelector('.hero-media');
const talentCarousel = document.querySelector('#talent-carousel');
const talentGrid = talentCarousel?.querySelector('.fashion-grid') || null;
const talentPrev = talentCarousel?.querySelector('[data-talent-nav="prev"]') || null;
const talentNext = talentCarousel?.querySelector('[data-talent-nav="next"]') || null;
let talentAutoTimer = null;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersCoarsePointer = window.matchMedia('(pointer: coarse)');
let scrollTicking = false;

const shouldAnimateHeroOnScroll = () =>
  !!heroMedia &&
  !prefersReducedMotion.matches &&
  !prefersCoarsePointer.matches &&
  window.innerWidth > 980;

const updateScrollEffects = () => {
  scrollTicking = false;
  header?.classList.toggle('scrolled', window.scrollY > 16);

  if (!heroMedia) return;

  if (!shouldAnimateHeroOnScroll()) {
    heroMedia.style.removeProperty('transform');
    return;
  }

  const offset = Math.min(window.scrollY * 0.08, 28);
  heroMedia.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
};

const queueScrollEffects = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(updateScrollEffects);
};

window.addEventListener('scroll', queueScrollEffects, { passive: true });
window.addEventListener('resize', updateScrollEffects);
prefersReducedMotion.addEventListener?.('change', updateScrollEffects);
prefersCoarsePointer.addEventListener?.('change', updateScrollEffects);
updateScrollEffects();

const closeMenu = () => {
  nav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.classList.remove('is-open');
  menuToggle?.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
};

menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    closeMenu();
    return;
  }

  menuToggle.setAttribute('aria-expanded', 'true');
  nav?.classList.add('open');
  menuToggle.classList.add('is-open');
  menuToggle.setAttribute('aria-label', 'Close menu');
  document.body.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
});

menuOverlay?.addEventListener('click', closeMenu);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});


nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

const typeLines = document.querySelectorAll('.type-line');
let typeRunId = 0;

const typeText = (el, text, speed = 55, runId = 0) => {
  el.classList.add('typing');
  let i = 0;
  const step = () => {
    if (runId && runId !== typeRunId) return;
    el.textContent = text.slice(0, i);
    i += 1;
    if (i <= text.length) {
      window.setTimeout(step, speed);
    } else {
      el.classList.remove('typing');
    }
  };
  step();
};

const runTypeAnimation = () => {
  if (!typeLines.length) return;
  const runId = ++typeRunId;
  let delay = 220;
  typeLines.forEach((line) => {
    const text = line.dataset.text || '';
    line.textContent = '';
    window.setTimeout(() => typeText(line, text, 58, runId), delay);
    delay += text.length * 58 + 260;
  });
};

runTypeAnimation();
window.addEventListener('cadsyent:content-applied', runTypeAnimation);

const stopTalentAutoSlide = () => {
  if (!talentAutoTimer) return;
  clearInterval(talentAutoTimer);
  talentAutoTimer = null;
};

const slideTalentsBy = (direction = 1) => {
  if (!talentGrid) return;
  const cards = talentGrid.querySelectorAll('.feature-card');
  if (!cards.length) return;
  const first = cards[0];
  const gap = parseFloat(window.getComputedStyle(talentGrid).gap || '16') || 16;
  const step = first.getBoundingClientRect().width + gap;
  talentGrid.scrollBy({ left: direction * step, behavior: 'smooth' });
};

const refreshTalentSlider = () => {
  if (!talentCarousel || !talentGrid) return;
  const cards = talentGrid.querySelectorAll('.feature-card');
  const shouldSlide = window.innerWidth > 980 && cards.length > 3;
  talentCarousel.classList.toggle('is-slider-active', shouldSlide);

  if (!shouldSlide) {
    stopTalentAutoSlide();
    talentGrid.scrollTo({ left: 0, behavior: 'auto' });
    return;
  }

  stopTalentAutoSlide();
  talentAutoTimer = window.setInterval(() => slideTalentsBy(1), 4200);
};

talentPrev?.addEventListener('click', () => {
  stopTalentAutoSlide();
  slideTalentsBy(-1);
});

talentNext?.addEventListener('click', () => {
  stopTalentAutoSlide();
  slideTalentsBy(1);
});

window.addEventListener('resize', refreshTalentSlider);
window.addEventListener('cadsyent:content-applied', refreshTalentSlider);
refreshTalentSlider();

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const delay = Number(entry.target.dataset.delay || 0);
    window.setTimeout(() => {
      entry.target.classList.add('visible');
    }, delay);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.18 });

revealItems.forEach((item) => revealObserver.observe(item));

const divisionSection = document.querySelector('.divisions');
const divisionItems = Array.from(
  document.querySelectorAll('.divisions .division-item')
);
let activeDivisionItem = null;

const setActiveDivisionItem = (nextItem) => {
  if (activeDivisionItem === nextItem) return;
  activeDivisionItem?.classList.remove('is-scroll-active');
  activeDivisionItem = nextItem || null;
  activeDivisionItem?.classList.add('is-scroll-active');
};

const updateDivisionScrollState = () => {
  if (!divisionSection || !divisionItems.length) {
    setActiveDivisionItem(null);
    return;
  }

  const sectionRect = divisionSection.getBoundingClientRect();
  const isMobileViewport = window.innerWidth <= 900;
  const viewportFocus = window.innerHeight * (isMobileViewport ? 0.42 : 0.48);
  const sectionVisible =
    sectionRect.top < window.innerHeight * 0.85 &&
    sectionRect.bottom > window.innerHeight * 0.2;

  if (!sectionVisible) {
    setActiveDivisionItem(null);
    return;
  }

  let nextItem = null;
  let shortestDistance = Number.POSITIVE_INFINITY;

  divisionItems.forEach((item) => {
    if (!item.classList.contains('has-hover-media')) return;
    const rect = item.getBoundingClientRect();
    const inView = rect.bottom > window.innerHeight * 0.18 && rect.top < window.innerHeight * 0.82;
    if (!inView) return;

    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(itemCenter - viewportFocus);

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nextItem = item;
    }
  });

  if (!nextItem) {
    nextItem = divisionItems.find((item) => item.classList.contains('has-hover-media')) || null;
  }

  setActiveDivisionItem(nextItem);
};

let divisionScrollTicking = false;
const queueDivisionScrollUpdate = () => {
  if (divisionScrollTicking) return;
  divisionScrollTicking = true;
  window.requestAnimationFrame(() => {
    divisionScrollTicking = false;
    updateDivisionScrollState();
  });
};

window.addEventListener('scroll', queueDivisionScrollUpdate, { passive: true });
window.addEventListener('resize', queueDivisionScrollUpdate);
window.addEventListener('load', updateDivisionScrollState);
window.addEventListener('cadsyent:content-applied', updateDivisionScrollState);
updateDivisionScrollState();

const counters = document.querySelectorAll('.counter');
const countObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    const startTime = performance.now();
    const duration = 1300;

    const tick = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = target >= 1000 ? value.toLocaleString() : String(value);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
    observer.unobserve(el);
  });
}, { threshold: 0.4 });

counters.forEach((counter) => countObserver.observe(counter));

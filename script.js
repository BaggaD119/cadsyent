const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const heroMedia = document.querySelector('.hero-media');

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 16);
  if (heroMedia) {
    const offset = Math.min(window.scrollY * 0.08, 28);
    heroMedia.style.transform = `scale(1.04) translateY(${offset}px)`;
  }
});

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

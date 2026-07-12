function initNavScroll() {
  const nav = document.querySelector('.nav');
  const inner = document.querySelector('.nav__inner');
  const cta = document.querySelector('.nav__cta');
  if (!nav || !inner) return;
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const p = Math.min(1, y / 320);
    nav.style.padding = (26 - 12 * p) + 'px 40px 0';
    inner.style.maxWidth = (1400 - 250 * p) + 'px';
    inner.style.borderRadius = (999 * p) + 'px';
    inner.style.padding = p > 0.02 ? '10px 14px 10px 26px' : '0';
    inner.style.gap = (44 - 16 * p) + 'px';
    inner.style.background = 'rgba(59,105,190,' + (0.7 * p).toFixed(3) + ')';
    inner.style.boxShadow = p > 0.02 ? ('0 14px 38px rgba(8,16,34,' + (0.42 * p).toFixed(3) + ')') : 'none';
    inner.style.backdropFilter = p > 0.02 ? ('blur(' + (22 * p).toFixed(1) + 'px)') : 'none';
    inner.style.webkitBackdropFilter = inner.style.backdropFilter;
    if (cta) cta.style.transform = 'translate(' + (-30 + 30 * p) + 'px,' + (-8 + 8 * p) + 'px)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileMenu() {
  const toggle = document.querySelector('.mnav__toggle');
  const menu = document.querySelector('.mnav__menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
});

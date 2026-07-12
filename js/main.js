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

export function formatCallTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

export function dragAnswerThreshold(dragPx, maxDragPx) {
  if (maxDragPx <= 0) return false;
  return dragPx >= maxDragPx * 0.82;
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function initPhoneDemo() {
  const phone = document.querySelector('.phone');
  if (!phone) return;
  const screen = phone.querySelector('.phone__screen');
  const track = phone.querySelector('.phone__track');
  const knob = phone.querySelector('.phone__knob');
  const statusLine = phone.querySelector('.phone__status-line');
  const startBtn = phone.querySelector('.phone__lock-start');
  const endBtn = phone.querySelector('.phone__end-call');

  let drag = 0, dragging = false, startX = 0, timerId = null, seconds = 0;

  const maxDrag = () => track ? track.clientWidth - 62 - 8 : 252;

  const setDrag = (px) => {
    drag = Math.max(0, Math.min(maxDrag(), px));
    knob.style.transform = 'translateX(' + drag + 'px)';
    phone.classList.toggle('phone--drag-zero', drag === 0 && !dragging);
  };

  const reset = () => {
    clearInterval(timerId);
    screen.dataset.phase = 'ringing';
    statusLine.textContent = 'incoming call…';
    setDrag(0);
  };

  const answer = () => {
    screen.dataset.phase = 'live';
    seconds = 0;
    statusLine.textContent = formatCallTime(seconds);
    clearInterval(timerId);
    timerId = setInterval(() => {
      seconds += 1;
      statusLine.textContent = formatCallTime(seconds);
    }, 1000);
  };

  startBtn.addEventListener('click', () => {
    phone.classList.add('phone--started');
    reset();
  });

  endBtn.addEventListener('click', reset);

  knob.addEventListener('pointerdown', (e) => {
    if (!phone.classList.contains('phone--started') || screen.dataset.phase !== 'ringing') return;
    e.preventDefault();
    startX = e.clientX - drag;
    dragging = true;
    knob.classList.add('is-dragging');

    const onMove = (ev) => setDrag(ev.clientX - startX);
    const onUp = () => {
      dragging = false;
      knob.classList.remove('is-dragging');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (dragAnswerThreshold(drag, maxDrag())) {
        setDrag(maxDrag());
        answer();
      } else {
        setDrag(0);
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initMobileMenu();
    initPhoneDemo();
  });
}

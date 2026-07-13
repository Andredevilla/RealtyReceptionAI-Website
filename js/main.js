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

const ELEVENLABS_AGENT_ID = 'agent_3201kxcj87s3fc0tk4cw9pztmp6q';
const ELEVENLABS_SDK_URL = 'https://cdn.jsdelivr.net/npm/@elevenlabs/client@1.15.0/+esm';

export function initPhoneDemo() {
  const phone = document.querySelector('.phone');
  if (!phone) return;
  const screen = phone.querySelector('.phone__screen');
  const track = phone.querySelector('.phone__track');
  const knob = phone.querySelector('.phone__knob');
  const statusLine = phone.querySelector('.phone__status-line');
  const startBtn = phone.querySelector('.phone__lock-start');
  const endBtn = phone.querySelector('.phone__end-call');

  let drag = 0, dragging = false, startX = 0, timerId = null, seconds = 0, conversation = null;

  const maxDrag = () => track ? track.clientWidth - 62 - 8 : 252;

  const setDrag = (px) => {
    drag = Math.max(0, Math.min(maxDrag(), px));
    knob.style.transform = 'translateX(' + drag + 'px)';
    phone.classList.toggle('phone--drag-zero', drag === 0 && !dragging);
  };

  const reset = () => {
    clearInterval(timerId);
    if (conversation) {
      const activeConversation = conversation;
      conversation = null;
      activeConversation.endSession().catch(() => {});
    }
    phone.classList.remove('phone--agent-speaking');
    screen.dataset.phase = 'ringing';
    statusLine.textContent = 'incoming call…';
    setDrag(0);
  };

  const startTimer = () => {
    seconds = 0;
    statusLine.textContent = formatCallTime(seconds);
    clearInterval(timerId);
    timerId = setInterval(() => {
      seconds += 1;
      statusLine.textContent = formatCallTime(seconds);
    }, 1000);
  };

  const answer = async () => {
    screen.dataset.phase = 'connecting';
    statusLine.textContent = 'connecting…';
    try {
      const { Conversation } = await import(/* webpackIgnore: true */ ELEVENLABS_SDK_URL);
      await navigator.mediaDevices.getUserMedia({ audio: true });
      conversation = await Conversation.startSession({
        agentId: ELEVENLABS_AGENT_ID,
        connectionType: 'webrtc',
        onConnect: () => {
          screen.dataset.phase = 'live';
          startTimer();
        },
        onDisconnect: () => { reset(); },
        onModeChange: (mode) => {
          const speaking = (typeof mode === 'string' ? mode : mode && mode.mode) === 'speaking';
          phone.classList.toggle('phone--agent-speaking', speaking);
        },
        onError: (err) => {
          console.error('ElevenLabs conversation error', err);
          statusLine.textContent = 'call failed';
          setTimeout(reset, 1600);
        },
      });
    } catch (err) {
      console.error('Could not start ElevenLabs conversation', err);
      statusLine.textContent = 'mic access needed';
      setTimeout(reset, 1600);
    }
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

export function generateWaveformBars(count) {
  const bars = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const env = t < 0.5 ? (0.55 + 0.45 * Math.sin(t * Math.PI * 3)) : Math.max(0.12, 1 - (t - 0.5) * 1.85);
    const v = 0.6 + 0.4 * Math.abs(Math.sin(i * 1.7));
    const h = Math.round(8 + env * v * 80);
    const o = t < 0.5 ? 0.92 : Math.max(0.26, 0.92 - (t - 0.5) * 1.25);
    bars.push({ h, o: Math.round(o * 100) / 100 });
  }
  return bars;
}

function renderWaveform() {
  const el = document.getElementById('waveform');
  if (!el) return;
  el.innerHTML = generateWaveformBars(46).map(
    bar => `<span class="waveform__bar" style="height:${bar.h}px;opacity:${bar.o}"></span>`
  ).join('');
}

export function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('is-active', t === tab));
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === target));
    });
  });
}

export function initStatCounters() {
  const root = document.getElementById('stats');
  const values = document.querySelectorAll('.stat__value');
  if (!root || !values.length) return;

  const format = (el, v) => (el.dataset.prefix || '') + v.toFixed(Number(el.dataset.decimals)) + (el.dataset.suffix || '');
  values.forEach(el => { el.textContent = format(el, 0); });

  const run = () => {
    const dur = 1400, start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = easeOutCubic(p);
      values.forEach(el => { el.textContent = format(el, Number(el.dataset.target) * eased); });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) { run(); return; }
  const io = new IntersectionObserver((entries, obs) => {
    if (entries.some(en => en.isIntersecting)) { obs.disconnect(); run(); }
  }, { threshold: 0.4 });
  io.observe(root);
}

export function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;
  items.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    question.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      items.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initMobileMenu();
    initPhoneDemo();
    renderWaveform();
    initTabs();
    initStatCounters();
    initFaqAccordion();
  });
}

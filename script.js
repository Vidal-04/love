/* ---- Generate falling petals ---- */
const petalContainer = document.getElementById('petals');
const symbols = ['🌷', '🌸', '❤️', '🌹', '😍'];
for (let i = 0; i < 28; i++) {
  const p = document.createElement('span');
  p.classList.add('petal');
  p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  p.style.left = Math.random() * 100 + 'vw';
  p.style.animationDuration = (8 + Math.random() * 10) + 's';
  p.style.animationDelay = '-' + (Math.random() * 15) + 's';
  p.style.fontSize = (0.9 + Math.random() * 1.2) + 'rem';
  petalContainer.appendChild(p);
}

/* ---- Heartbeat animation ---- */
const heartbeat = document.getElementById('hb');

/* ---- Countdown timer ---- */
let timeInSeconds = 24 * 60 * 60;
const display = document.getElementById('countdown');
const timer = setInterval(() => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  display.innerHTML = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (timeInSeconds <= 0) {
    clearInterval(timer);
    display.innerHTML = 'EXPIRED';
  } else {
    timeInSeconds--;
  }
}, 1000);

/* ---- Escaping Log Out button ---- */
const logoutBtn = document.getElementById('btn-logout');
let btnX = window.innerWidth / 2;
let btnY = window.innerHeight - 80;
let escaping = false;
let escapeTimeout = null;

function placeBtn(x, y) {
  const w = logoutBtn.offsetWidth;
  const h = logoutBtn.offsetHeight;
  const clampX = Math.max(30, Math.min(window.innerWidth - w - 30, x));
  const clampY = Math.max(30, Math.min(window.innerHeight - h - 30, y));
  logoutBtn.style.left = clampX + 'px';
  logoutBtn.style.top = clampY + 'px';
  btnX = clampX;
  btnY = clampY;
}

placeBtn(btnX, btnY);

logoutBtn.addEventListener('click', handleLogout);

document.addEventListener('mousemove', (e) => {
  const rect = logoutBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 200) {
    escaping = true;
    clearTimeout(escapeTimeout);

    const force = Math.max(0, (200 - dist) / 120);
    const speed = 180 * force;
    const angle = Math.atan2(dy, dx);
    const wobble = (Math.random() - 0.5) * 0.8;

    const newX = btnX - Math.cos(angle + wobble) * speed;
    const newY = btnY - Math.sin(angle + wobble) * speed;
    placeBtn(newX, newY);

    escapeTimeout = setTimeout(() => { escaping = false; }, 300);
  }
});

document.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  const rect = logoutBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = t.clientX - cx;
  const dy = t.clientY - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 140) {
    const angle = Math.atan2(dy, dx);
    const wobble = (Math.random() - 0.5) * 0.8;
    placeBtn(btnX - Math.cos(angle + wobble) * 150, btnY - Math.sin(angle + wobble) * 150);
  }
}, { passive: true });

const popupOverlay = document.getElementById('popup');
const popupClose = document.querySelector('.popup-close');
const popupMsg = document.querySelector('.popup-msg');
const popupSub = document.querySelector('.popup-sub');
const popupCounter = document.querySelector('.popup-counter');

const logoutWarnings = [
  {
    msg: 'Please do not do this',
    sub: 'you’ll regret it. you know you will.',
    close: 'ok fine, i’ll stay 🌷'
  },
  {
    msg: 'Seriously, don’t click that again.',
    sub: 'I’m trying to keep this relationship alive.',
    close: 'okay, i’m staying'
  },
  {
    msg: 'One more click and I’m going to get dramatic.',
    sub: 'Please, just let this one be a good decision.',
    close: 'i promise, i’ll stay'
  },
  {
    msg: 'This is getting real. Please stop.',
    sub: 'I don’t want to be that clingy, but also... don’t.',
    close: 'fine, no more'
  },
  {
    msg: 'No way! I won’t stop.',
    sub: 'If you still want out, it is up to you.',
    close: 'I’ll stay... for now'
  },
  {
    msg: 'FINAL WARNING',
    sub: 'Something bad will happen if you click again.',
    close: 'I’ll stay'
  },
  {
    msg: 'SIKE!',
    sub: 'I won’t stop <3!',
    close: 'I’ll stay forever'
  }
];
let logoutClickCount = 0;

function updateLogoutPopup() {
  const index = (logoutClickCount - 1) % logoutWarnings.length;
  const warning = logoutWarnings[index];

  popupMsg.textContent = warning.msg;
  popupSub.textContent = warning.sub;
  popupClose.textContent = warning.close;
  popupCounter.textContent = `Clicked logout ${logoutClickCount} time${logoutClickCount === 1 ? '' : 's'}.`;
}

function handleLogout(e) {
  e.preventDefault();
  logoutClickCount += 1;
  updateLogoutPopup();
  popupOverlay.classList.add('show');
}

function closePopup() {
  popupOverlay.classList.remove('show');
}

popupClose.addEventListener('click', closePopup);
popupOverlay.addEventListener('click', (e) => {
  if (e.target === popupOverlay) closePopup();
});

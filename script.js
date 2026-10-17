(() => {
  'use strict';
  // The invitation gives a Cebu venue: interpret 3 PM in Philippine time.
  const eventTime = Date.parse('2026-10-24T15:00:00+08:00');
  const ids = ['days', 'hours', 'minutes', 'seconds'];
  const timer = document.querySelector('.countdown');
  function updateCountdown() {
    const remaining = Math.max(0, Math.floor((eventTime - Date.now()) / 1000));
    const values = [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60];
    ids.forEach((id, index) => { document.getElementById(id).textContent = String(values[index]).padStart(2, '0'); });
    if (!remaining) {
      timer.setAttribute('aria-label', 'The date of Thersha’s eighteenth debut has arrived.');
      document.getElementById('countdown-title').textContent = 'A beautiful chapter has begun.';
      document.getElementById('countdown-message').textContent = 'Celebrating Thersha and the memories of October 24, 2026.';
    }
    return remaining;
  }
  if (updateCountdown()) {
    const interval = setInterval(() => { if (!updateCountdown()) clearInterval(interval); }, 1000);
  }
  document.getElementById('calendar').addEventListener('click', () => {
    // No end time was supplied, so the calendar file contains a start only.
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thersha Debut//Invitation//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:thersha-debut-20261024@invitation.local', `DTSTAMP:${stamp}`, 'DTSTART:20261024T070000Z', "SUMMARY:Thersha's 18th Debut", 'LOCATION:Lutao Shores\\, Compostela\\, Cebu', "DESCRIPTION:Celebrate Thersha's 18th debut. October 24\\, 2026 at 3:00 PM Philippine time.", 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
    const url = URL.createObjectURL(new Blob([calendar], {type: 'text/calendar;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url; link.download = 'Thersha-18th-Debut.ics';
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.getElementById('calendar-status').textContent = 'Calendar file downloaded. Open it to save the date in your calendar.';
  });
  let loveTimeout;
  document.getElementById('celebrate').addEventListener('click', () => {
    const status = document.getElementById('love-status');
    status.textContent = 'A little love, just for this moment. ♡';
    clearTimeout(loveTimeout);
    loveTimeout = setTimeout(() => { status.textContent = ''; }, 6000);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.querySelector('.heart')) return;
    for (let i = 0; i < 16; i++) {
      const heart = document.createElement('span');
      heart.className = 'heart'; heart.textContent = i % 3 ? '♡' : '✦'; heart.setAttribute('aria-hidden', 'true');
      heart.style.left = `${5 + Math.random() * 90}%`;
      heart.style.setProperty('--drift', `${Math.random() * 120 - 60}px`);
      heart.style.animationDelay = `${i * .04}s`;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 4000);
    }
  });
})();

// Native dialog keeps keyboard focus inside the portrait viewer and supports Escape.
(() => {
  const dialog = document.querySelector('.photo-dialog');
  const image = document.getElementById('viewer-image');
  const caption = document.getElementById('photo-caption');
  const photos = [
    ['images/golden-eighteen.png', 'In her golden era', 'Thersha holding a white bouquet in a red dress, framed by golden light and flowers.'],
    ['images/new-chapter.png', 'A new chapter', 'Thersha smiling behind her white bouquet with gold eighteenth birthday lettering.'],
    ['images/butterfly-bouquet.png', 'Golden butterflies', 'Thersha with a white bouquet decorated with delicate gold butterflies.'],
    ['images/elegant-eighteen.png', 'A moment to bloom', 'Thersha posing beneath a golden arch with a white bouquet.']
  ];
  let current = 0;
  let opener;
  function showPhoto(index) {
    current = (index + photos.length) % photos.length;
    const [src, title, alt] = photos[current];
    image.src = src;
    image.alt = alt;
    caption.textContent = `${current + 1} / ${photos.length} · ${title}`;
  }
  document.querySelectorAll('[data-photo]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      showPhoto(Number(button.dataset.photo));
      dialog.showModal();
    });
  });
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  document.getElementById('photo-prev').addEventListener('click', () => showPhoto(current - 1));
  document.getElementById('photo-next').addEventListener('click', () => showPhoto(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => opener?.focus({preventScroll: true}));
})();

(() => {
  const entry = document.getElementById('invitation-entry');
  const audio = document.getElementById('invitation-music');
  const toggle = document.getElementById('music-toggle');
  const label = document.getElementById('music-label');
  const status = document.getElementById('music-status');
  let opening = false;
  function roseFlourish() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = document.createElement('div');
    layer.className = 'rose-confetti';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 14; i++) {
      const petal = document.createElement('i');
      petal.style.setProperty('--petal-x', `${4 + i * 7}%`);
      petal.style.setProperty('--petal-drift', `${(i % 2 ? 1 : -1) * (25 + i * 4)}px`);
      petal.style.setProperty('--petal-delay', `${i * .065}s`);
      petal.style.setProperty('--petal-turn', `${90 + i * 31}deg`);
      layer.appendChild(petal);
    }
    entry.appendChild(layer);
    setTimeout(() => layer.remove(), 4500);
  }
  audio.volume = .35;
  function syncMusic() {
    const playing = !audio.paused;
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    label.textContent = playing ? 'Music on' : 'Play music';
  }
  async function playMusic() {
    try { await audio.play(); }
    catch { status.textContent = 'Music could not start. Tap Play music to try again.'; }
    syncMusic();
  }
  function reveal(withMusic) {
    if (opening) return;
    opening = true;
    if (withMusic) playMusic();
    roseFlourish();
    document.body.classList.add('invitation-revealing');
    entry.classList.add('entry-opening');
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      entry.close();
      toggle.hidden = false;
      document.body.classList.add('invitation-revealed');
      const title = document.getElementById('title');
      title.tabIndex = -1;
      title.focus({preventScroll:true});
    };
    entry.addEventListener('animationend', event => {
      if (event.target === entry && event.animationName === 'invitation-dissolve') finish();
    });
    setTimeout(finish, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 3200);
  }
  document.getElementById('open-invitation').addEventListener('click', () => reveal(true));
  document.getElementById('open-quietly').addEventListener('click', () => reveal(false));
  entry.addEventListener('cancel', event => { event.preventDefault(); reveal(false); });
  toggle.addEventListener('click', () => { if (audio.paused) playMusic(); else audio.pause(); });
  audio.addEventListener('play', syncMusic);
  audio.addEventListener('pause', syncMusic);
  audio.addEventListener('error', () => { status.textContent = 'Background music is unavailable.'; syncMusic(); });
  entry.showModal();
})();

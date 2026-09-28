/* Shared behaviour for the inner pages: the menu, the sticky masthead, scroll
   reveals, counters and the slow drift on photos and outline lettering. The
   menu and footer drift match index.html's own script. Wrapped in a function
   so nothing here collides with a page's own script. */
(function(){
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

try {
/* ---- hamburger menu and sticky masthead ---- */
const burger = document.getElementById('burger');
const menu   = document.getElementById('menu');

function setMenu(open){
  document.body.classList.toggle('menu-open', open);
  menu.classList.toggle('is-open', open);
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', ()=>setMenu(!menu.classList.contains('is-open')));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>setMenu(false)));
window.addEventListener('resize', ()=>{ if(window.innerWidth > 1180) setMenu(false); });

/* Products and About Us drop down to their pages. Hovering opens them (in
   the CSS); the arrow beside each opens it for touch and keyboard, and it
   closes on a click elsewhere, on Escape, or when focus moves on past it */
const drops = [...menu.querySelectorAll('.menu-drop')].map(el=>({el, btn:el.querySelector('.drop-toggle')}));
function setDrop(d, open){
  d.el.classList.toggle('is-open', open);
  d.btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
drops.forEach(d=>{
  d.btn.addEventListener('click', ()=>{
    const open = !d.el.classList.contains('is-open');
    drops.forEach(o=>{ if(o !== d) setDrop(o, false); });
    setDrop(d, open);
  });
  document.addEventListener('click', e=>{ if(!d.el.contains(e.target)) setDrop(d, false); });
  d.el.addEventListener('focusout', e=>{ if(!d.el.contains(e.relatedTarget)) setDrop(d, false); });
});

document.addEventListener('keydown', e=>{
  if(e.key !== 'Escape') return;
  drops.forEach(d=>{
    if(!d.el.classList.contains('is-open')) return;
    if(d.el.contains(document.activeElement)) d.btn.focus();
    setDrop(d, false);
  });
  if(menu.classList.contains('is-open')) setMenu(false);
});

function onScroll(){ document.body.classList.toggle('is-stuck', window.scrollY > 24); }
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();
} catch (err) { console.error("feature failed:", err); }

try {
/* ---- More projects: an endless carousel, as on the Laser page. Next
   slides the row on by one tile and moves the first to the back, previous
   brings the last to the front and slides it in. With only a few tiles
   the set is repeated (hidden from screen readers and the tab order) until
   the row is twice as wide as the screen, so no gap ever opens at its end.
   This runs before the page's own gallery script, so the copies' photo
   controls work too ---- */
document.querySelectorAll('[data-carousel]').forEach(strip=>{
  const track = strip.querySelector('.more-grid');
  const section = strip.closest('section');
  const originals = [...track.children];
  if(!originals.length) return;
  const wide = Math.max(window.innerWidth, (window.screen && screen.width) || 0) * 2;
  for(let i = 0; i < 8 && track.scrollWidth < wide; i++){
    originals.forEach(o=>{
      const c = o.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('a,button,[tabindex]').forEach(el=>el.setAttribute('tabindex', '-1'));
      track.appendChild(c);
    });
  }

  const EASE = 'transform 620ms cubic-bezier(.3,0,.2,1)';
  let busy = false;
  const step = ()=>track.firstElementChild.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
  // finish once the slide ends, or after a moment if the transition never reports back
  function settle(done){
    let over = false;
    const end = ()=>{ if(over) return; over = true; track.removeEventListener('transitionend', end); done(); busy = false; };
    track.addEventListener('transitionend', end);
    setTimeout(end, 800);
  }
  function next(){
    if(busy) return;
    if(reduced){ track.appendChild(track.firstElementChild); return; }
    busy = true;
    track.style.transition = EASE;
    track.style.transform = 'translateX(' + (-step()) + 'px)';
    settle(()=>{
      track.style.transition = 'none';
      track.appendChild(track.firstElementChild);
      track.style.transform = 'translateX(0)';
    });
  }
  function prev(){
    if(busy) return;
    if(reduced){ track.prepend(track.lastElementChild); return; }
    busy = true;
    track.style.transition = 'none';
    track.prepend(track.lastElementChild);
    track.style.transform = 'translateX(' + (-step()) + 'px)';
    void track.offsetWidth;   // lock that position in before sliding back
    track.style.transition = EASE;
    track.style.transform = 'translateX(0)';
    settle(()=>{});
  }
  const prevBtn = section.querySelector('.more-prev');
  const nextBtn = section.querySelector('.more-next');
  if(prevBtn) prevBtn.addEventListener('click', prev);
  if(nextBtn) nextBtn.addEventListener('click', next);
  // a sideways swipe steps it too, except on a tile's own photos when it has
  // several, where the swipe goes through that project's photos instead
  let x0 = null;
  strip.addEventListener('pointerdown', e=>{
    x0 = e.target.closest('.gal:not([data-photos="1"]) .gal-stage, .gal-bar') ? null : e.clientX;
  });
  strip.addEventListener('pointerup', e=>{
    if(x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if(Math.abs(dx) > 40) (dx < 0 ? next : prev)();
  });
  strip.addEventListener('pointercancel', ()=>{ x0 = null; });

  /* it turns on its own: one tile every few seconds, paused while someone
     is pointing at it or using it, while it's off screen or the tab is
     hidden, and never with reduced motion. A click or swipe restarts the
     wait, so it doesn't move again straight after */
  const EVERY = 3500;
  let timer = null, hovering = false, focused = false, onScreen = false;
  const stop = ()=>{ clearInterval(timer); timer = null; };
  const start = ()=>{
    stop();
    if(reduced || hovering || focused || !onScreen || document.hidden) return;
    timer = setInterval(next, EVERY);
  };
  section.addEventListener('pointerenter', e=>{ if(e.pointerType === 'mouse'){ hovering = true; stop(); } });
  section.addEventListener('pointerleave', e=>{ if(e.pointerType === 'mouse'){ hovering = false; start(); } });
  // only keyboard focus pauses it; a mouse click on an arrow also focuses it
  section.addEventListener('focusin', e=>{ if(e.target.matches(':focus-visible')){ focused = true; stop(); } });
  section.addEventListener('focusout', e=>{ if(!section.contains(e.relatedTarget)){ focused = false; start(); } });
  [prevBtn, nextBtn].forEach(b=>b && b.addEventListener('click', start));
  strip.addEventListener('pointerup', start);
  document.addEventListener('visibilitychange', start);
  if('IntersectionObserver' in window){
    new IntersectionObserver(es=>{ onScreen = es[0].isIntersecting; start(); }, {threshold:.25}).observe(strip);
  } else { onScreen = true; start(); }
});
} catch (err) { console.error("feature failed:", err); }

try {
/* ---- blocks rise into place the first time they reach the screen ---- */
const items = [...document.querySelectorAll('.reveal')];
if(reduced || !('IntersectionObserver' in window)){
  items.forEach(el=>el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
  items.forEach(el=>io.observe(el));
}
} catch (err) { console.error("feature failed:", err); }

try {
/* ---- figures count up when they come into view ---- */
const nums = [...document.querySelectorAll('[data-count]')];
const fmt = el => el.dataset.raw ? n=>String(n) : n=>n.toLocaleString('en-US');   // years carry no thousands separator

function countUp(el){
  const to = parseFloat(el.dataset.count);
  const f = fmt(el);
  const dur = 1600, start = performance.now();
  function tick(now){
    const t = Math.min((now - start) / dur, 1);
    el.textContent = f(Math.round(to * (1 - Math.pow(1 - t, 3))));
    if(t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
if(nums.length && !reduced){
  // the markup holds the real figure for anyone without script; start from 0 here
  nums.forEach(el=>{ el.textContent = fmt(el)(0); });
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ countUp(e.target); io.unobserve(e.target); }
    });
  }, {threshold:.4});
  nums.forEach(n=>io.observe(n));
}
} catch (err) { console.error("feature failed:", err); }

try {
/* ---- drift: anything marked data-drift slides against the scroll ----
   data-drift  how far it travels per pixel its parent sits off centre
   data-slack  the share of its parent's height it overhangs on each side,
               so it never travels far enough to show an edge
   data-ease   how quickly it catches up; the outline words trail far behind */
const drifters = [...document.querySelectorAll('[data-drift]')].map(el=>({
  el,
  host:  el.parentElement,
  depth: parseFloat(el.dataset.drift) || 0,
  slack: parseFloat(el.dataset.slack) || 0,
  ease:  parseFloat(el.dataset.ease)  || .12,
  now: null, goal: 0
}));

if(drifters.length && !reduced){
  let running = false;
  const measure = ()=>{
    const vh = window.innerHeight;
    drifters.forEach(d=>{
      const r = d.host.getBoundingClientRect();
      if(r.bottom < -vh || r.top > vh * 2) return;
      let px = ((r.top + r.height / 2) - vh / 2) * d.depth;
      if(d.slack){ const s = r.height * d.slack; px = Math.max(-s, Math.min(s, px)); }
      d.goal = px;
    });
  };
  const paint = ()=>{
    let moving = false;
    drifters.forEach(d=>{
      if(d.now === null) d.now = d.goal;
      d.now += (d.goal - d.now) * d.ease;
      if(Math.abs(d.goal - d.now) > .1) moving = true; else d.now = d.goal;
      d.el.style.setProperty('--py', d.now.toFixed(1) + 'px');
    });
    if(moving) requestAnimationFrame(paint); else running = false;
  };
  const kick = ()=>{
    measure();
    if(!running){ running = true; requestAnimationFrame(paint); }
  };
  window.addEventListener('scroll', kick, {passive:true});
  window.addEventListener('resize', kick);
  kick();
}
} catch (err) { console.error("feature failed:", err); }
try {
/* ---- logo: is it drawn dark or light? ----
   a CORS copy of the header logo is shrunk onto a canvas and the brightness
   of its solid pixels averaged; the CSS then inverts it on whichever
   background would hide it. If the check can't run, it's taken as dark,
   as logos drawn for a white page are */
const logoImg = document.querySelector('.masthead .logo');
if(logoImg){
  const root = document.documentElement;
  const mark = dark=>root.classList.add(dark ? 'logo-dark' : 'logo-light');
  const probe = new Image();
  probe.crossOrigin = 'anonymous';
  probe.onload = ()=>{
    try {
      const w = 64, h = Math.max(1, Math.round(w * probe.naturalHeight / probe.naturalWidth));
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const x = c.getContext('2d');
      x.drawImage(probe, 0, 0, w, h);
      const d = x.getImageData(0, 0, w, h).data;
      let sum = 0, n = 0;
      for(let i = 0; i < d.length; i += 4){
        if(d[i+3] < 128) continue;
        sum += (.2126*d[i] + .7152*d[i+1] + .0722*d[i+2]) / 255;
        n++;
      }
      mark(n ? sum / n < .5 : true);
    } catch (e) { mark(true); }
  };
  probe.onerror = ()=>mark(true);
  probe.src = logoImg.currentSrc || logoImg.src;
}
} catch (err) { console.error("feature failed:", err); }
})();

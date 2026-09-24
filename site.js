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
window.addEventListener('resize', ()=>{ if(window.innerWidth > 1024) setMenu(false); });
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
});

function onScroll(){ document.body.classList.toggle('is-stuck', window.scrollY > 24); }
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();
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
})();

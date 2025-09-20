// js/main.js
(function(){
  // Mobile nav toggle — FIXED & ENHANCED
const toggles = document.querySelectorAll('[data-nav-toggle]');
const nav = document.getElementById('main-nav'); // 👈 More reliable than querySelector

function setNav(open){
  if (!nav) return;
  nav.classList.toggle('open', open);
  toggles.forEach(t => t.setAttribute('aria-expanded', open ? 'true' : 'false'));
  document.body.style.overflow = open ? 'hidden' : '';
}

if (nav){
  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setNav(!nav.classList.contains('open'));
    });
  });

  // Close when clicking a nav link
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.classList.contains('mobile-close')) {
      setNav(false);
    }
  });

  // Close if click outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !Array.from(toggles).some(t => t.contains(e.target))) {
      setNav(false);
    }
  });
}

  // Highlight active nav link
  const filename = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a=>{
    const href = (a.getAttribute('href') || '').split('/').pop();
    const isIndex = (filename === '' || filename === 'index.html') && href === 'index.html';
    if (href === filename || isIndex) a.classList.add('active');
  });

  // Quote store + badge updates (supports multiple badges)
  const KEY = 'ps_quote';
  const getQuote = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const setQuote = (list) => localStorage.setItem(KEY, JSON.stringify(list));
  function updateBadge(){
    const count = getQuote().length;
    document.querySelectorAll('[data-quote-count]').forEach(el => el.textContent = count);
  }
  updateBadge();

  // Handle "Add to Quote" buttons
  document.body.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-add-quote]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const name = btn.getAttribute('data-name') || id;
    let q = getQuote();
    if (!q.find(x=>x.id===id)){
      q.push({id, name, qty:1});
      setQuote(q);
      updateBadge();
    }
    const old = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.disabled = true;
    setTimeout(()=>{ btn.textContent = old; btn.disabled = false; }, 900);
  });

  // Expose simple API for page scripts
  window.PS = {
    getQuote, setQuote, updateBadge,
    removeFromQuote(id){
      const q = getQuote().filter(x=>x.id!==id);
      setQuote(q); updateBadge();
      return q;
    }
  };

  // Simple form handling (demo-only)
  document.querySelectorAll('form[data-simple-form]').forEach(form=>{
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"], button:not([type])');
      if (btn){ btn.disabled = true; btn.textContent = 'Sending…'; }
      setTimeout(()=>{
        form.reset();
        btn && (btn.disabled=false, btn.textContent='Submit');
        const ok = form.querySelector('.form-success');
        ok && (ok.hidden=false);
      }, 600);
    });
  });
})();
// js/main.js
(function(){
  // Mobile nav toggle
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (toggle && nav){
    toggle.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Highlight active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a=>{
    const href = a.getAttribute('href');
    if (!href) return;
    const isIndex = (path === '' || path === 'index.html') && href.includes('index.html');
    if (href.endsWith(path) || isIndex){
      a.classList.add('active');
    }
  });

  // Simple quote cart in localStorage
  const storageKey = 'ps_quote';
  const getQuote = () => JSON.parse(localStorage.getItem(storageKey) || '[]');
  const setQuote = (list) => localStorage.setItem(storageKey, JSON.stringify(list));
  const updateBadge = () => {
    const el = document.getElementById('quote-count');
    if (el) el.textContent = getQuote().length;
  };
  updateBadge();

  // Handle "Add to Quote" buttons site-wide
  document.body.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-add-quote]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const name = btn.getAttribute('data-name');
    let q = getQuote();
    if (!q.find(x=>x.id===id)){
      q.push({id, name, qty:1});
      setQuote(q);
      updateBadge();
    }
    btn.textContent = 'Added ✓';
    setTimeout(()=>btn.textContent='Add to Quote', 1200);
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

  // Simple form handling (replace with Formspree/Netlify in production)
  document.querySelectorAll('form[data-simple-form]').forEach(form=>{
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
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

// Fix scroll offset for sticky header
if (location.hash) {
  setTimeout(() => {
    const el = document.querySelector(location.hash);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  }, 100);
}
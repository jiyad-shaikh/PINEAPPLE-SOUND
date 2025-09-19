// js/equipment.js
(function(){
  const list = document.getElementById('equipment-list');
  const fCat = document.getElementById('f-cat');
  const fBrand = document.getElementById('f-brand');
  const fSearch = document.getElementById('f-search');

  function normalize(s){ return (s||'').toLowerCase(); }

  function applyFilters(){
    const cat = fCat.value;
    const brand = fBrand.value;
    const q = normalize(fSearch.value);
    const items = list.querySelectorAll('.item');
    items.forEach(el=>{
      const ec = el.dataset.category;
      const eb = el.dataset.brand;
      const en = normalize(el.dataset.name);
      const show =
        (cat==='all' || ec===cat) &&
        (brand==='all' || eb===brand) &&
        (q==='' || en.includes(q));
      el.style.display = show ? '' : 'none';
    });
  }

  [fCat, fBrand, fSearch].forEach(i=>i && i.addEventListener('input', applyFilters));
  applyFilters();
})();
// js/booking.js
(function(){
  const list = document.getElementById('quote-list');
  const empty = document.getElementById('quote-empty');
  const clearBtn = document.getElementById('clear-quote');

  function render(){
    const items = PS.getQuote();
    empty.style.display = items.length ? 'none' : '';
    list.innerHTML = items.map(i=>`
      <li>
        <span>${i.name}</span>
        <span class="remove" data-remove="${i.id}" aria-label="Remove">✕</span>
      </li>
    `).join('');
  }
  render();

  list.addEventListener('click', (e)=>{
    const rm = e.target.closest('[data-remove]');
    if (!rm) return;
    PS.removeFromQuote(rm.getAttribute('data-remove'));
    render();
  });

  clearBtn.addEventListener('click', ()=>{
    PS.setQuote([]); PS.updateBadge(); render();
  });

  // Ensure end date >= start date
  const start = document.getElementById('shoot-start');
  const end = document.getElementById('shoot-end');
  const today = new Date().toISOString().slice(0,10);
  start.min = today; end.min = today;
  function syncDates(){
    if (end.value && start.value && end.value < start.value){
      end.value = start.value;
    }
    end.min = start.value || today;
  }
  start.addEventListener('change', syncDates);
})();
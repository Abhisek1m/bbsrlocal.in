/* =========================================================
   trains-dir.js — filter, render, sort for trains page
   Depends on: trains-data.js (TRAINS, TRAIN_TYPES)
   ========================================================= */

let activeType = '';
let activeDays  = new Set();
let searchQ     = '';
let sortCol     = 'dep';
let sortDir     = 1; // 1 = asc, -1 = desc

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/* ---- time helpers ---- */
function timeToMins(t) {
  if (!t || t === 'SRC' || t === 'DSTN') return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function depSortKey(t) {
  if (t.dep === 'DSTN') return 24 * 60 - 1; // 1439 — last
  const m = timeToMins(t.dep);
  // post-midnight deps that follow late-night arrivals sort as next-day
  if (m !== null && m < 30 && t.arr !== 'SRC') return m + 24 * 60;
  return m ?? 0;
}

function arrSortKey(t) {
  if (t.arr === 'SRC') return -1; // origin — first
  return timeToMins(t.arr) ?? 0;
}

/* ---- filter ---- */
function filterTrains() {
  const q = searchQ.toLowerCase();
  return TRAINS.filter(t => {
    if (q && !t.num.includes(q) && !t.name.toLowerCase().includes(q) &&
        !t.from.toLowerCase().includes(q) && !t.to.toLowerCase().includes(q)) return false;
    if (activeType && t.type !== activeType) return false;
    if (activeDays.size > 0 && ![...activeDays].some(d => t.days.includes(d))) return false;
    return true;
  });
}

/* ---- sort ---- */
function sortTrains(list) {
  return [...list].sort((a, b) => {
    let va, vb;
    if      (sortCol === 'num') { va = parseInt(a.num, 10); vb = parseInt(b.num, 10); }
    else if (sortCol === 'arr') { va = arrSortKey(a);       vb = arrSortKey(b); }
    else                        { va = depSortKey(a);       vb = depSortKey(b); }
    return (va - vb) * sortDir;
  });
}

/* ---- helpers ---- */
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function daysLabel(days) {
  if (days.length === 7) return 'Daily';
  return days.slice().sort((a,b) => a-b).map(d => DAY_NAMES[d]).join(' ');
}

function typeBadgeClass(type) {
  const map = {
    'Vande Bharat':  'badge-vb',
    'Rajdhani':      'badge-raj',
    'Duronto':       'badge-dur',
    'Superfast':     'badge-sf',
    'Shatabdi':      'badge-sht',
    'Jan Shatabdi':  'badge-sht',
    'Garib Rath':    'badge-gr',
  };
  return map[type] || 'badge-other';
}

function typeBadge(type) {
  return `<span class="tbadge ${typeBadgeClass(type)}">${esc(type)}</span>`;
}

function arrDisplay(t) {
  if (t.arr === 'SRC') return '<span class="origin-lbl">Starts here</span>';
  return esc(t.arr);
}

function depDisplay(t) {
  if (t.dep === 'DSTN') return '<span class="origin-lbl">Ends here</span>';
  return esc(t.dep);
}

/* ---- render: table (desktop) ---- */
function renderTable(list) {
  function thBtn(col, label) {
    const sort = sortCol === col ? (sortDir === 1 ? 'ascending' : 'descending') : 'none';
    const arrow = sortCol === col ? (sortDir === 1 ? ' ↑' : ' ↓') : '';
    return `<button class="sort-btn${sortCol===col?' active':''}" data-col="${col}" aria-sort="${sort}">${label}${arrow}</button>`;
  }
  const rows = list.map(t => `
    <tr>
      <td class="col-num mono">${esc(t.num)}</td>
      <td class="col-name">${esc(t.name)}</td>
      <td class="col-type">${typeBadge(t.type)}</td>
      <td class="col-route">${esc(t.from)} → ${esc(t.to)}</td>
      <td class="col-time">${arrDisplay(t)}</td>
      <td class="col-time">${depDisplay(t)}</td>
      <td class="col-days">${daysLabel(t.days)}</td>
    </tr>`).join('');
  return `<div class="table-wrap"><table class="trains-table">
    <thead><tr>
      <th scope="col">${thBtn('num','Train #')}</th>
      <th scope="col">Name</th>
      <th scope="col">Type</th>
      <th scope="col">From → To</th>
      <th scope="col">${thBtn('arr','Arr')}</th>
      <th scope="col">${thBtn('dep','Dep')}</th>
      <th scope="col">Days</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

/* ---- render: cards (mobile) ---- */
function renderCards(list) {
  return `<div class="train-cards">${list.map(t => `
    <article class="train-card">
      <div class="tc-top">
        <span class="tc-num mono">${esc(t.num)}</span>
        ${typeBadge(t.type)}
      </div>
      <h3 class="tc-name">${esc(t.name)}</h3>
      <p class="tc-route">${esc(t.from)} → ${esc(t.to)}</p>
      <div class="tc-times">
        <div class="tc-time"><span class="tc-lbl">Arr</span><span class="tc-val">${arrDisplay(t)}</span></div>
        <div class="tc-time"><span class="tc-lbl">Dep</span><span class="tc-val">${depDisplay(t)}</span></div>
      </div>
      <div class="tc-days">${daysLabel(t.days)}</div>
    </article>`).join('')}</div>`;
}

/* ---- empty state ---- */
function emptyState() {
  return `<div class="empty-state">
    <p>No trains match your filters.</p>
    <button class="btn-clear" onclick="clearFilters()">Clear all filters</button>
  </div>`;
}

/* ---- main render ---- */
function render() {
  const filtered = sortTrains(filterTrains());
  const countEl  = document.getElementById('trainCount');
  if (countEl) countEl.textContent = `Showing ${filtered.length} of ${TRAINS.length} trains`;
  const list = document.getElementById('trainList');
  if (!list) return;
  if (filtered.length === 0) { list.innerHTML = emptyState(); return; }
  list.innerHTML = window.innerWidth < 768 ? renderCards(filtered) : renderTable(filtered);
}

/* ---- clear ---- */
function clearFilters() {
  searchQ    = '';
  activeType = '';
  activeDays.clear();
  const s = document.getElementById('trainSearch');
  if (s) s.value = '';
  const sel = document.getElementById('typeFilter');
  if (sel) sel.value = '';
  document.querySelectorAll('.day-chip').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed','false');
  });
  render();
}

/* ---- init ---- */
function initTrains() {
  const searchEl = document.getElementById('trainSearch');
  if (searchEl) {
    searchEl.addEventListener('input', e => { searchQ = e.target.value.trim(); render(); });
  }

  const typeEl = document.getElementById('typeFilter');
  if (typeEl) {
    TRAIN_TYPES.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      typeEl.appendChild(opt);
    });
    typeEl.addEventListener('change', e => { activeType = e.target.value; render(); });
  }

  document.querySelectorAll('.day-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = parseInt(btn.dataset.day, 10);
      if (activeDays.has(day)) {
        activeDays.delete(day);
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed','false');
      } else {
        activeDays.add(day);
        btn.classList.add('active');
        btn.setAttribute('aria-pressed','true');
      }
      render();
    });
  });

  document.addEventListener('click', e => {
    const btn = e.target.closest('.sort-btn');
    if (!btn) return;
    const col = btn.dataset.col;
    if (sortCol === col) sortDir *= -1;
    else { sortCol = col; sortDir = 1; }
    render();
  });

  window.addEventListener('resize', render);
  render();
}

document.addEventListener('DOMContentLoaded', initTrains);

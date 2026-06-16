/* =========================================================
   directory.js — filter, render, search, surprise
   Depends on: data.js (PLACES, CATS)
   ========================================================= */

let activeCat = "All";
let searchQ   = "";

function isOpen(p) {
  const now = new Date();
  if (p.closed.includes(now.getDay())) return false;
  const h = now.getHours() + now.getMinutes() / 60;
  if (p.o === 0 && p.c === 24) return true;
  return h >= p.o && h < p.c;
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function catEmoji(cat) {
  const map = {
    'Temples & Heritage': '🛕', 'Nature & Parks': '🌿',
    'Restaurants': '🍽️', 'Cafes': '☕', 'Nightlife': '🪩',
    'Family & Kids': '🎪', 'Shopping': '🛍️', 'Day Trips': '🚌'
  };
  return map[cat] || '📍';
}

function cardHTML(p) {
  const open = isOpen(p);
  const imgHtml = p.img
    ? `<img class="card-img" src="${p.img}" alt="${esc(p.n)}" loading="lazy"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
       <div class="card-img-fallback" style="display:none">${catEmoji(p.cat)}</div>`
    : `<div class="card-img-fallback">${catEmoji(p.cat)}</div>`;
  return `<article class="card">
    ${imgHtml}
    <div class="card-top">
      <span class="cat">${esc(p.cat)}</span>
      <span class="open-badge ${open ? "open" : "closed"}">${open ? "● OPEN" : "● CLOSED"}</span>
    </div>
    <h3>${esc(p.n)}</h3>
    <span class="area">📍 ${esc(p.area)}</span>
    <p>${esc(p.d)}</p>
    <div class="card-meta">
      <span class="chip star">★ ${p.r}${p.rc ? " · " + p.rc : ""}</span>
      <span class="chip">${esc(p.hrs)}</span>
    </div>
    <a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.q)}" target="_blank" rel="noopener">Open in Maps →</a>
  </article>`;
}

function normalizeQuery(s) {
  return s.replace(/biriyani/g, "biryani");
}

function render() {
  const q    = normalizeQuery(searchQ.toLowerCase());
  const grid = document.getElementById("dirGrid");
  const list = PLACES.filter(p => {
    const catOK = activeCat === "All" || p.cat === activeCat;
    if (q === "open") return catOK && isOpen(p);
    const text = normalizeQuery((p.n + " " + p.cat + " " + p.area + " " + p.d + " " + p.k).toLowerCase());
    return catOK && (!q || text.includes(q));
  });
  grid.innerHTML = list.map(cardHTML).join("");
  document.getElementById("dirCount").textContent =
    `${list.length} / ${PLACES.length} places` +
    (activeCat !== "All" ? ` · ${activeCat}` : "") +
    (q ? ` · "${q}"` : "");
  document.getElementById("noResults").classList.toggle("show", list.length === 0);
  document.getElementById("statOpen").textContent = PLACES.filter(isOpen).length;
}

function buildFilters() {
  document.getElementById("filterRow").innerHTML = CATS.map(c =>
    `<button class="fchip${c === activeCat ? " active" : ""}" onclick="setCat('${c}')">${c}</button>`
  ).join("");
}

function setCat(c) { activeCat = c; buildFilters(); render(); }

function heroGo() {
  searchQ   = document.getElementById("heroSearch").value.trim();
  activeCat = "All";
  buildFilters();
  render();
  document.getElementById("directory").scrollIntoView({ behavior: "smooth" });
}

function quick(cat) {
  searchQ = "";
  document.getElementById("heroSearch").value = "";
  setCat(cat);
  document.getElementById("directory").scrollIntoView({ behavior: "smooth" });
}

function quickSearch(q) {
  searchQ   = q;
  activeCat = "All";
  buildFilters();
  render();
  document.getElementById("directory").scrollIntoView({ behavior: "smooth" });
}

function surprise() {
  const pool = activeCat === "All" ? PLACES : PLACES.filter(p => p.cat === activeCat);
  const p    = pool[Math.floor(Math.random() * pool.length)];
  const open = isOpen(p);
  const b    = document.getElementById("surpriseBanner");
  b.innerHTML = `
    <span class="mono">🎲 YOUR PLAN ${open ? "· OPEN RIGHT NOW" : "· OPENS LATER"}</span>
    <h3>${esc(p.n)} <small>· ${esc(p.area)}</small></h3>
    <p>${esc(p.d)}</p>
    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.q)}" target="_blank" rel="noopener">Take me there →</a>
    &nbsp;&nbsp;<a href="#" onclick="surprise();return false;">Roll again ↻</a>`;
  b.classList.add("show");
}

document.addEventListener("keydown", e => {
  if (e.key === "Enter" && document.activeElement === document.getElementById("heroSearch")) heroGo();
});

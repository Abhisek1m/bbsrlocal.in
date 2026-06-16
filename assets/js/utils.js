/* =========================================================
   utils.js — shared init: reveal observer, marquee, stats
   Must load after data.js and directory.js
   ========================================================= */

/* Reveal-on-scroll */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: .1 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* Seamless marquee — duplicate content */
const mt = document.getElementById("marqueeTrack");
if (mt) mt.innerHTML += mt.innerHTML;

/* Boot directory */
document.getElementById("statCount").textContent = PLACES.length;
buildFilters();
render();
setInterval(render, 60000);

/* Hero carousel */
(function initCarousel() {
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const dotsEl  = document.getElementById('carouselDots');
  if (!slides.length || !dotsEl) return;

  let current = 0;
  let timer;

  slides.forEach(function(_, i) {
    const btn = document.createElement('button');
    btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Photo ' + (i + 1));
    btn.setAttribute('role', 'tab');
    btn.onclick = function() { goTo(i); stop(); };
    dotsEl.appendChild(btn);
  });

  function goTo(idx) {
    slides[current].classList.remove('active');
    dotsEl.children[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsEl.children[current].classList.add('active');
  }

  function advance() { goTo(current + 1); }
  function start()   { timer = setInterval(advance, 5000); }
  function stop()    { clearInterval(timer); }

  const inner = document.getElementById('carouselInner');
  inner.addEventListener('mouseenter', stop);
  inner.addEventListener('mouseleave', start);

  start();
})();

/* Boot blog and news */
renderBlog();
fetchNews();

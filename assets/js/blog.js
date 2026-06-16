/* =========================================================
   blog.js — POSTS array + renderBlog()
   To publish a post: prepend a new object to POSTS.
   POSTS[0] is always the featured card.
   ========================================================= */

const POSTS = [
  {
    title: "The 64 Yogini Temple Trail: BBSR's hidden circuit",
    date: "2026-06-16",
    tag: "Heritage",
    excerpt: "Most visitors only see Lingaraj. Here's a walking guide through six lesser-known temples within 2 km of Old Town — each with a story most tourists never hear.",
    img: "https://picsum.photos/seed/yoginitemple/800/500",
    readTime: 4
  },
  {
    title: "Where locals eat Dahibara in 2026",
    date: "2026-06-15",
    tag: "Food",
    excerpt: "Five stalls rated by BBSR's most opinionated food crowd — ranked by curd quality, aludum heat, and the intangible bhaiya energy.",
    img: "https://picsum.photos/seed/dahibarastall/800/500",
    readTime: 3
  },
  {
    title: "Monsoon walks at Ekamra Kanan",
    date: "2026-06-14",
    tag: "Nature",
    excerpt: "The botanical garden is at its most dramatic in July. A guide to the best wet-season trails and what's blooming right now.",
    img: "https://picsum.photos/seed/monsoonwalk/800/500",
    readTime: 2
  }
];

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderBlog() {
  const grid = document.getElementById('blogGrid');
  if (!grid || !POSTS.length) return;

  const featured = POSTS[0];
  const sidebar  = POSTS.slice(1, 3);

  const featuredHTML = `
    <a class="blog-featured reveal" href="#" aria-label="${featured.title}">
      <img class="blog-featured-img" src="${featured.img}" alt="${featured.title}" loading="lazy">
      <div class="blog-featured-body">
        <span class="blog-tag ${featured.tag}">${featured.tag}</span>
        <div class="blog-title-lg">${featured.title}</div>
        <p class="blog-excerpt">${featured.excerpt}</p>
        <div class="blog-meta">${fmtDate(featured.date)} · ${featured.readTime} min read</div>
      </div>
    </a>`;

  const sidebarHTML = `<div class="blog-sidebar">
    ${sidebar.map(p => `
      <a class="blog-small reveal" href="#" aria-label="${p.title}">
        <img class="blog-small-img" src="${p.img}" alt="${p.title}" loading="lazy">
        <div class="blog-small-body">
          <span class="blog-tag ${p.tag}">${p.tag}</span>
          <div class="blog-title-sm">${p.title}</div>
          <div class="blog-meta" style="margin-top:6px">${fmtDate(p.date)} · ${p.readTime} min</div>
        </div>
      </a>`).join('')}
  </div>`;

  grid.innerHTML = featuredHTML + sidebarHTML;
  grid.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });
}

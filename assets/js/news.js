/* =========================================================
   news.js — fetch Google News RSS via rss2json, render ticker
   ========================================================= */

(function() {
  var RSS = 'https://news.google.com/rss/search?q=Bhubaneswar+OR+Odisha&hl=en-IN&gl=IN&ceid=IN:en';
  var API = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(RSS);

  function timeAgo(dateStr) {
    var diff = Date.now() - new Date(dateStr).getTime();
    var h = Math.floor(diff / 3600000);
    if (h < 1)  return 'Just now';
    if (h < 24) return h + 'h ago';
    return Math.floor(h / 24) + 'd ago';
  }

  function safeText(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function renderTicker(items) {
    var grid = document.getElementById('newsGrid');
    if (!grid) return;
    grid.innerHTML = items.slice(0, 6).map(function(item) {
      var source = (item.author) || (item.source && item.source.name) || 'News';
      var age    = timeAgo(item.pubDate);
      return '<a class="news-row" href="' + safeText(item.link) + '" target="_blank" rel="noopener">'
        + '<span class="news-meta">' + safeText(source) + ' · ' + age + '</span>'
        + '<span class="news-headline">' + safeText(item.title) + '</span>'
        + '<span class="news-arrow">→</span>'
        + '</a>';
    }).join('');
  }

  function renderError() {
    var grid = document.getElementById('newsGrid');
    if (!grid) return;
    grid.innerHTML = '<p class="news-error">Could not load latest news — try refreshing</p>';
  }

  window.fetchNews = function() {
    fetch(API)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.status !== 'ok' || !data.items || !data.items.length) throw new Error('empty');
        renderTicker(data.items);
      })
      .catch(renderError);
  };
})();

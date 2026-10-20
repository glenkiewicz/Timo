// zgadujztimo.pl — ożywienie strony: pojawianie się przy przewijaniu,
// liczniki w pasie statystyk, przyklejona nawigacja i FAQ z jednym otwartym
// pytaniem. Bez bibliotek; przy „ogranicz ruch” zostaje sama treść.

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add(reduce ? 'no-motion' : 'motion');

  // Pojawianie się przy przewijaniu. Opóźnienie dla rodzeństwa z data-stagger.
  var items = document.querySelectorAll('[data-reveal]');
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (el, i) {
      el.setAttribute('data-reveal', '');
      el.style.setProperty('--d', (i * 0.09).toFixed(2) + 's');
    });
  });
  items = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Liczniki: 0 → wartość, gdy pas statystyk wjedzie na ekran.
  var counters = document.querySelectorAll('[data-count]');
  function run(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var start = null;
    function tick(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / 1400, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        co.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(run);
  }

  // Nawigacja przykleja się do góry po zjechaniu z pierwszego ekranu.
  var nav = document.querySelector('.nav-wrap');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('stuck', window.scrollY > 140); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // FAQ: otwarcie jednego pytania zamyka pozostałe w tej samej grupie.
  document.querySelectorAll('.faq, .doc').forEach(function (group) {
    group.addEventListener('toggle', function (e) {
      var d = e.target;
      if (d.tagName !== 'DETAILS' || !d.open) return;
      group.querySelectorAll('details[open]').forEach(function (o) { if (o !== d) o.open = false; });
    }, true);
  });
})();

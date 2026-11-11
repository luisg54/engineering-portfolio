(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Fade-in / image reveal */
  var fades = document.querySelectorAll('.fade');
  if (reduceMotion) {
    fades.forEach(function (el) { el.classList.add('in'); });
  } else if (fades.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var siblings = Array.from(e.target.parentElement?.children || []).filter(function (c) {
          return c.classList.contains('fade');
        });
        var i = Math.min(siblings.indexOf(e.target), 4);
        setTimeout(function () { e.target.classList.add('in'); }, i * 80);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    fades.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add('in');
      else obs.observe(el);
    });
  }

  /* Experience accordion */
  window.toggleExp = function (id) {
    var card = document.getElementById(id);
    if (!card) return;
    var open = card.classList.toggle('open');
    var hdr = card.querySelector('.exp-hdr');
    if (hdr) hdr.setAttribute('aria-expanded', open);
  };

  document.querySelectorAll('.exp-card').forEach(function (c) {
    var hdr = c.querySelector('.exp-hdr');
    if (hdr) hdr.setAttribute('aria-expanded', c.classList.contains('open'));
  });

  /* Mobile nav */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
      navToggle.textContent = open ? '✕' : '☰';
    });
    navMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      });
    });
  }

  /* Homepage hero GIFs: freeze to posters under reduced motion (picture + JS fallback) */
  var heroLayers = document.querySelectorAll('.home-hero-layer');
  if (reduceMotion) {
    document.querySelectorAll('.home-hero-motion').forEach(function (img) {
      var poster = img.getAttribute('data-poster');
      if (poster) img.src = poster;
      img.removeAttribute('srcset');
    });
    if (heroLayers.length) {
      heroLayers.forEach(function (layer, i) {
        layer.classList.toggle('is-active', i === 0);
      });
    }
  } else if (heroLayers.length > 1) {
    /* Full-bleed NASA ↔ Roadster timed crossfade */
    var heroIndex = 0;
    heroLayers[0].classList.add('is-active');
    setInterval(function () {
      heroLayers[heroIndex].classList.remove('is-active');
      heroIndex = (heroIndex + 1) % heroLayers.length;
      heroLayers[heroIndex].classList.add('is-active');
    }, 6500);
  } else if (heroLayers.length === 1) {
    heroLayers[0].classList.add('is-active');
  }

  /* CFD / hero videos: respect reduced motion */
  document.querySelectorAll('video[autoplay]').forEach(function (v) {
    if (reduceMotion) {
      v.removeAttribute('autoplay');
      v.pause();
      v.removeAttribute('loop');
    }
  });

  /* Project filters */
  var chips = document.querySelectorAll('.filter-chip');
  var cards = document.querySelectorAll('.proj-card');
  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var cat = chip.dataset.filter;
        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('active', on);
          c.setAttribute('aria-pressed', on);
        });
        cards.forEach(function (card) {
          var show = cat === 'all' || (card.dataset.cat || '').split(' ').includes(cat);
          card.hidden = !show;
          if (show) card.classList.add('in');
        });
      });
    });
  }
})();

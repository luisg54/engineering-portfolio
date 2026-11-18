/* Lightweight theme explorer — ?theme=cool-steel|graphite-hi|shop-light|daylit|current */
(function () {
  'use strict';

  var THEMES = [
    { id: 'cool-steel', label: 'Cool steel' },
    { id: 'graphite-hi', label: 'Graphite hi-C' },
    { id: 'shop-light', label: 'Shop light' },
    { id: 'daylit', label: 'Daylit BP' },
    { id: 'current', label: 'Current' }
  ];

  var params = new URLSearchParams(window.location.search);
  var theme = params.get('theme') || 'cool-steel';
  if (theme === 'current') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }

  /* Stop NASA↔Roadster crossfade while exploring (NASA-only comps) */
  if (theme !== 'current') {
    var overlay = document.querySelector('.home-hero-layer-overlay');
    if (overlay) overlay.remove();
  }

  function buildBar() {
    if (document.querySelector('.theme-proto-bar')) return;
    var bar = document.createElement('nav');
    bar.className = 'theme-proto-bar';
    bar.setAttribute('aria-label', 'Theme prototypes');
    THEMES.forEach(function (t) {
      var a = document.createElement('a');
      var url = new URL(window.location.href);
      if (t.id === 'current') url.searchParams.set('theme', 'current');
      else url.searchParams.set('theme', t.id);
      url.hash = '';
      a.href = url.pathname + url.search + (window.location.hash || '');
      a.textContent = t.label;
      if (t.id === theme) a.setAttribute('aria-current', 'true');
      bar.appendChild(a);
    });
    document.body.appendChild(bar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildBar);
  } else {
    buildBar();
  }
})();

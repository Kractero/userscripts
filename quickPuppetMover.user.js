// ==UserScript==
// @name         Post-Creation Assistant
// @namespace    Kra
// @version      1.0
// @description  Quickly move regions, set flag for new puppets
// @author       Kractero
// @match        https://www.nationstates.net/*
// @downloadURL  https://github.com/Kractero/userscripts/raw/main/quickPuppetMover.user.js
// @updateURL    https://github.com/Kractero/userscripts/raw/main/quickPuppetMover.user.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  document.addEventListener('keydown', (event) => {
    if (window.location.href.includes('card')) return;
    if (event.key === '1') {
      window.location.href =
        'https://www.nationstates.net/region=Herta_space_station';
    }
    if (event.key === '2' && window.location.href.includes('region')) {
      document.querySelector('.danger').click();
    }
    if (event.key === '3') {
      window.location.href = 'https://www.nationstates.net/page=settings';
    }
    if (event.key === '4') {
      document.querySelector('a[href="page=upload_flag"]').click();
    }
    if (event.key === '5') {
      document.getElementById('file').click();
    }
    if (event.key === '6') {
      document.querySelector('.primary').click();
    }
  });
})();

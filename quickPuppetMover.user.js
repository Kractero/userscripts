// ==UserScript==
// @name         Move Puppets
// @namespace    Kractero
// @version      1.0
// @description  Quickly move regions, set flag for new puppets
// @author       Kractero
// @match        https://*.nationstates.net/*
// @exclude      https://*.nationstates.net/page=deck/card=*
// @downloadUrl  https://github.com/Kractero/ns-stuff/raw/master/quickPuppetMover.user.js
// ==/UserScript==

(function () {
  'use strict';
  document.addEventListener('keydown', (event) => {
    if (event.key === '1') {
      window.location.href = 'https://www.nationstates.net/region=herta_space_station';
    }
    if (event.key === '2' && window.location.href.includes('region')) {
      document.querySelector('.danger').click();
    }

    // change flag
    if (event.key === '5') {
      window.location.href = 'https://www.nationstates.net/page=upload_flag';
    }
    if (event.key === '6') {
      document.getElementById('file').click();
    }
    if (event.key === '7') {
      document.querySelector('.primary').click();
    }

    // disable recruitment
    if (event.key === '3') {
      window.location.href = 'https://www.nationstates.net/page=tgsettings';
    }
    if (event.key === '4') {
      document.querySelector('table td input').click();
      document.querySelector('#update_filter').click();
    }
  });
})();
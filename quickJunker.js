// ==UserScript==
// @name         Quick Junker
// @namespace    Kra
// @version      1.0
// @description  Various farming tools
// @author       Kractero
// @match        https://www.nationstates.net/*
// @downloadUrl  https://github.com/Kractero/userscripts/raw/scripts/quickJunker.user.js
// @updateUrl    https://github.com/Kractero/userscripts/raw/scripts/quickJunker.user.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  let currentJunk = 0;
  if (
    window.location.href.includes('nation=') &&
    !window.location.href.includes(
      document.querySelector('#loggedin').getAttribute('data-nname')
    )
  ) {
    return;
  }
  if (window.location.href.includes('/page=deck')) {
    const junks = document.querySelectorAll('.deckcard');
    const giftButtons = document.querySelectorAll(
      '.deckcard-info-cardbuttons :not(.deckcard-junk-button)'
    );
    junks[currentJunk].style.border = 'thick solid #0000FF';
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        if (currentJunk === junks.length - 1) {
          return;
        }
        currentJunk = currentJunk + 1;
        junks.forEach((junk) => {
          junk.style.border = '';
        });
        junks[currentJunk].style.border = 'thick solid #0000FF';
        junks[currentJunk].scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'center',
        });
      }
      if (event.key === 'ArrowLeft') {
        if (currentJunk === 0) {
          return;
        }
        currentJunk = currentJunk - 1;
        junks.forEach((junk) => {
          junk.style.border = '';
        });
        junks[currentJunk].style.border = 'thick solid #0000FF';
        junks[currentJunk].scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'center',
        });
      }
      if (!window.location.href.includes('card')) {
        if (event.key === 'Shift') {
          junks[currentJunk].querySelector('.deckcard-junk-button').click();
        }
      }
      if (!window.location.href.includes('gift')) {
        if (event.key === 'ArrowUp') {
          giftButtons[currentJunk].click();
        }
      }
    });
  }
})();

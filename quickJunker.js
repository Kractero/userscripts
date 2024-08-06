// ==UserScript==
// @name         Quick Junker
// @version      1.0
// @description  Various farming tools
// @author       Kractero
// @match        https://*.nationstates.net/*
// @downloadUrl  https://github.com/Kractero/userscripts/raw/scripts/quickJunker.user.js
// @updateUrl    https://github.com/Kractero/userscripts/raw/scripts/quickJunker.user.js
// @grant        window.close
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
      if (event.code === 'NumpadSubtract') {
        window.close()
      }
      if (event.code === 'NumpadAdd') {
        window.location.href = 'https://www.nationstates.net/page=deck'
      }
      if (event.code === 'Numpad6' || event.code === 'ArrowRight') {
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
      if (event.code === 'Numpad4' || event.code === 'ArrowLeft') {
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
      if (event.code === 'Numpad2' || event.code === 'Digit2') {
        event.preventDefault();
        document.querySelector("#entity_name").value = "Kractero"
      }
      if (!window.location.href.includes('card')) {
        if (event.code === 'Numpad5' || event.code === 'ArrowDown') {
          junks[currentJunk].querySelector('.deckcard-junk-button').click();
        }
      }
      if (!window.location.href.includes('gift')) {
        if (event.code === 'Numpad8' || event.code === 'ArrowUp') {
          giftButtons[currentJunk].click();
        }
      }
    });
  }
})();
// ==UserScript==
// @name             Show All Asks and Bids
// @version          1.0
// @description      Show All Asks and Bids
// @author           Kractero
// @match            https://*.nationstates.net/*page=deck*/card=*
// ==/UserScript==

(function () {
  'use strict';
  document.querySelectorAll('.cardauctionhiddenrow')
    .forEach(element => {
      element.classList.remove('cardauctionhiddenrow');
    });
  document.querySelector('.cardauctionshowmorerow').style.display = 'none';
})();

// ==UserScript==
// @name         Pack Autocloser
// @version      1.2
// @description  Autoclose all packs
// @author       Kractero
// @match        https://*.nationstates.net/*page=deck*
// @grant        window.close
// ==/UserScript==

(function () {
    'use strict';
    let error = document.querySelector(".error")
    if (error) return;
    if (!document.querySelector('.deck-loot-box')) return;
    window.close();
})();

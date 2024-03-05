// ==UserScript==
// @name        Dark Mode Issue Blank Page
// @match       https://*.nationstates.net/*template-overall=none*
// @grant       none
// @version     1.0
// @author      Kractero
// @description Prevent blindness from light mode issue pages flickering
// ==/UserScript==
(function () {
    'use strict';
    document.querySelector('body').style.backgroundColor = 'black';
})();
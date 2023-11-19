// ==UserScript==
// @name         Finder JunkDaJunk Gift Default
// @version      1.0
// @description  Fill in gift to automatically.
// @author       Kractero
// @match        https://www.nationstates.net/*page=deck*/gift=*
// @grant        none
// ==/UserScript==


(function () {
    'use strict';
    let url = new URL(window.location.href)
    document.querySelector("input[name=\"entity_name\"").value = url.searchParams.get("giftto");
    document.querySelector("input[name=\"entity_name\"").focus();
})();
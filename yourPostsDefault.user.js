// ==UserScript==
// @name             Your Posts Default
// @version          1.0
// @description      Forum links on the sidebar link to your posts instead
// @author           Kractero
// @match            https://*.nationstates.net/*
// ==/UserScript==

(function () {
    'use strict';
    Array.from(document.querySelectorAll('.menu a')).map(link => {
        if (link.getAttribute('href') === "https://forum.nationstates.net") link.href = "https://forum.nationstates.net/search.php?search_id=egosearch"
    })
})();
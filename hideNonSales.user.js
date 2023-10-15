// ==UserScript==
// @name			 Hide Non-Sales Transfers
// @author           Kractero
// @match            https://www.nationstates.net/*trades_history=1*
// @version          1.0
// @downloadURL      https://github.com/Kractero/userscripts/raw/main/hideNonSales.user.js
// @updateURL        https://github.com/Kractero/userscripts/raw/main/hideNonSales.user.js
// ==/UserScript==
(function () {
    'use strict';
    const table = document.querySelector(".auctionsrecenttradestable");
    table.querySelectorAll('tr td:last-child').forEach(td => {
        if (td.textContent === "—") {
            //         td.parentElement.style.display = "none";
            td.parentElement.remove();
        }
    });
})();
// ==UserScript==
// @name        View Multiples
// @match       https://*.nationstates.net/*value_deck=1*
// @grant       none
// @version     1.0
// @author      Kractero
// @description View Cards you have multiple of
// ==/UserScript==
(function () {
    'use strict';
    const auctionTables = Array.from(document.querySelector('.auctionslisttable').querySelectorAll('tr'))
    auctionTables.shift()
    auctionTables.forEach(row => {
        // if (Number(row.querySelector('td:last-child').textContent) <= 1) {
        //   row.style.opacity = "5%"
        // }
        let sell = row.querySelector('.cardprice_sell')
        let buy = row.querySelector('.cardprice_buy')
        let value = Number(row.querySelector('td:nth-child(5)').textContent)
        if (sell) sell = Number(sell.textContent)
        if (buy) buy = Number(buy.textContent)
        if (sell && sell < value) {
            row.style.backgroundColor = "antiquewhite"
        } else if (buy && buy > value) {
            row.style.backgroundColor = "yellow"
        } else {
            row.style.opacity = "5%"
        }
    })
})();
// ==UserScript==
// @name        View Bargains
// @match       https://*.nationstates.net/*page=deck/show_market=cards*
// @match       https://*.nationstates.net/*show_market=auctions*
// @grant       none
// @version     1.0
// @author      Kractero
// @description View cards with ask for less than their MV or bid for over their MV.
// ==/UserScript==
(function () {
    'use strict';
    let auctionTables = []
    if (document.querySelector('.auctionstopcardstable')) {
        auctionTables = Array.from(document.querySelector('.auctionstopcardstable').querySelectorAll('tr'))
    } else {
        auctionTables = Array.from(document.querySelector('.auctionslisttable').querySelectorAll('tr'))
    }
    auctionTables.shift()
    auctionTables.forEach((row, i) => {
        let sell = row.querySelector('.cardprice_sell')
        let buy = row.querySelector('.cardprice_buy')
        if (sell) sell = Number(sell.textContent)
        if (buy) buy = Number(buy.textContent)
        if (sell && sell < Number(row.querySelector('td:last-child').textContent)) {
            row.style.backgroundColor = "antiquewhite"
        } else if (buy && buy > Number(row.querySelector('td:last-child').textContent)) {
            row.style.backgroundColor = "yellow"
        } else if (buy >= Number(row.querySelector('td:last-child').textContent)) {
        } else {
            row.style.opacity = "5%"
        }
    })
})();
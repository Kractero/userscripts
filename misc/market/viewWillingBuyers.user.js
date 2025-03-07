// ==UserScript==
// @name        Show only willing buyers
// @match       https://*.nationstates.net/*value_deck=1*
// @grant       none
// @version     1.0
// @author      Kractero
// ==/UserScript==

;(function () {
  'use strict'
  const bids = document.querySelectorAll('.clickabletimes tbody tr td:nth-child(4)')
  Array.from(bids)
    .slice(1)
    .forEach(ele => {
      const cardPriceBuyElement = ele.querySelector('.cardprice_buy')

      if (cardPriceBuyElement) {
        const cardPriceBuy = Number(cardPriceBuyElement.textContent.trim())
        const bidValue = Number(cardPriceBuyElement.closest('td').nextElementSibling.textContent)
        if (cardPriceBuy >= bidValue * 0.8) {
          ele.style.backgroundColor = 'blue'
        } else {
          ele.parentElement.remove()
        }
      } else {
        ele.parentElement.remove()
      }
    })
})()

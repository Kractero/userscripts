// ==UserScript==
// @name        Simple G to Gift
// @match       https://*.nationstates.net/page=deck/card=*
// @grant       none
// @version     1.0
// @author      Kractero
// ==/UserScript==
(function () {
    document.addEventListener('keypress', (event) => {
        if (e.key === "g") {
            document.querySelectorAll('.deckcard-info-cardbuttons button')[1].click()
        }
    })
})
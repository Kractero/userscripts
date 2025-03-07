// ==UserScript==
// @name         Pack Conditional Autocloser
// @version      1.2
// @description  Autoclose packs that don't contain legendaries or cards over certain market value.
// @author       Kractero
// @match        https://*.nationstates.net/*page=deck*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let error = document.querySelector(".error")
    if (error) return;
    const cards = document.querySelectorAll('.deck-loot-box .deckcard-container');
    const legendaries = Array.from(cards).map(card => {
        const season = card.querySelector('.deckcard').getAttribute('data-season')
        let rarity;
        if (season === '4') {
            rarity = card.querySelector('.rarity').textContent
        } else {
            // as a note to self, this is done in case junkButton.dataset is overrode somewhere
            rarity = getComputedStyle(card.querySelector('.deckcard-category'), ':before').getPropertyValue('content');
        }
        if (rarity === 'legendary') {
            return card;
        }
    }).filter(card => card);
    const nonLegendaryCards = Array.from(cards).filter(card => !legendaries.includes(card));
    const values = Array.from(nonLegendaryCards).map(card => {
        const mv = card.querySelector('.deckcard-card-mv');
        if (mv) {
            const marketValue = mv.textContent.split(': ')[1];
            if (parseFloat(marketValue) > 1.50) {
                return card;
            }
        }
    }).filter(card => card);
    if (legendaries.length === 0 && values.length === 0) {
        window.close();
    }
})();

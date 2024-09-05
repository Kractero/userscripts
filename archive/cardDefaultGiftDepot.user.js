// ==UserScript==
// @name         Card Default Gift depot
// @version      0.2
// @namespace    Riem
// @description  Automatically inputs a default value in the Gift fields
// @author       Riemstagrad
// @noframes
// @match        https://*.nationstates.net/*page=deck*/gift=*
// @grant        none
// ==/UserScript==


(function () {
    'use strict';
    // Change values here:
    const card = document.querySelector('.deckcard-container');
    const rarity = getComputedStyle(card.querySelector('.deckcard-category'), ':before').getPropertyValue('content');

    if (rarity === '"LEGENDARY"') document.querySelector("input[name=\"entity_name\"").value = "Kractero";
    if (rarity === '"EPIC"') document.querySelector("input[name=\"entity_name\"").value = "TB Type L";
    if (rarity === '"ULTRA RARE"') document.querySelector("input[name=\"entity_name\"").value = "TB Type S";
    if (rarity === '"RARE"') document.querySelector("input[name=\"entity_name\"").value = "TB Type A";
    if (rarity === '"UNCOMMON"') document.querySelector("input[name=\"entity_name\"").value = "Moon Jelly";
    if (rarity === '"COMMON"') document.querySelector("input[name=\"entity_name\"").value = "Moon Jelly";
    document.querySelector("input[name=\"entity_name\"").focus();

})();
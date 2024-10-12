// ==UserScript==
// @name         Deck Capacity Increase Button
// @description  Adds a button to upgrade deck capacity
// @author       Kractero
// @match        https://www.nationstates.net/*page=deck*
// @grant        GM.getValue
// ==/UserScript==

// to make getting localid easier, you need https://github.com/dithpri/RCES/raw/master/userscripts/auction/localid%20Synchronizer.user.js
// if you need a localid access a card's info page or something else that shows one

(async function () {
    'use strict';

    const nationName = document.body.dataset.nname;
    const localIdStorageKey = `localid:${nationName}`;

    const savedLocalIds = JSON.parse(await GM.getValue(localIdStorageKey, "[]"));
    const activeLocalId = savedLocalIds.length > 0 ? savedLocalIds[0] : null;

    if (!activeLocalId) return;

    function submitDeckUpgradeForm(price) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `https://www.nationstates.net/page=deck?script=DeckCapacityIncreaseButton__by_Kractero__usedBy_${nationName}&userclick=${Date.now()}`;

        const embiggenDeckInput = document.createElement('input');
        embiggenDeckInput.type = 'hidden';
        embiggenDeckInput.name = 'embiggen_deck';
        embiggenDeckInput.value = price;

        const localidInput = document.createElement('input');
        localidInput.type = 'hidden';
        localidInput.name = 'localid';
        localidInput.value = activeLocalId;

        form.appendChild(embiggenDeckInput);
        form.appendChild(localidInput);

        document.body.appendChild(form);
        form.submit();
    }

    const deckInfoParagraph = document.querySelector('#deck-numcards')?.parentElement;

    if (deckInfoParagraph) {
        const upgradeLink = document.createElement('a');
        upgradeLink.href = '#';
        upgradeLink.innerText = 'Increase deck capacity';

        upgradeLink.addEventListener('click', (event) => {
            event.preventDefault();
            const price = prompt("Enter the price to upgrade your deck:");
            if (price) {
                submitDeckUpgradeForm(price);
            } else {
                alert("No price entered. Deck upgrade canceled.");
            }
        });

        deckInfoParagraph.appendChild(document.createTextNode(' '));
        deckInfoParagraph.appendChild(upgradeLink);
    }
})();

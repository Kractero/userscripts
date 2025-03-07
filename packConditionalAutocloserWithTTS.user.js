// ==UserScript==
// @name         Pack Conditional TTS
// @version      1.4
// @description  Autoclose packs that don't contain legendaries or cards over certain market value with TTS voice.
// @author       Kractero
// @match        https://*.nationstates.net/*page=deck*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    if (document.querySelector(".error")) return;
    if (!document.querySelector('.deck-loot-box')) return;
    const cards = document.querySelectorAll('.deck-loot-box .deckcard');
    const season = cards[0].querySelector('.deckcard').getAttribute('data-season')
    const legendaries = Array.from(cards).map(card => {
        let rarity
        if (season === '4') {
          rarity = card.querySelector('.rarity').textContent
        } else {
          rarity = getComputedStyle(card.querySelector('.deckcard-category'), ':before').getPropertyValue('content').replaceAll('"', '').toLowerCase()
        }
        if (rarity === 'legendary') {
            return card;
        }
    }).filter(card => card)
    if (legendaries.length > 0) {
        legendaries.forEach((card) => {
          let name;
          if (season === '4') {
            name = card.querySelector('.title').textContent
          } else {
            name = card.querySelector('.nname').textContent
          }
          let rarity
          if (season === '4') {
            rarity = card.querySelector('.rarity').textContent
          } else {
            rarity = getComputedStyle(card.querySelector('.deckcard-category'), ':before').getPropertyValue('content').replaceAll('"', '').toLowerCase()
          }
          const speech = new SpeechSynthesisUtterance();
          speech.text = `You just pulled Season ${season} ${rarity} ${name}!`;
          speech.voice = speechSynthesis.getVoices()[0];
          window.speechSynthesis.speak(speech);
      });
    }
    const nonLegendaryCards = Array.from(cards).filter(card => !legendaries.includes(card));
    const values = Array.from(nonLegendaryCards).map(card => {
        const mv = card.querySelector('.deckcard-card-mv');
        const askMv = card.querySelector('.deckcard-card-buyers');
        if (mv) {
            const marketValue = mv.textContent.split(': ')[1];
            if (askMv) {
              const askValue = askMv.textContent.split(': ')[1];
              if (parseFloat(marketValue) <= parseFloat(askValue)) {
                return card;
              };
              // else {
              //   if (parseFloat(marketValue) > 10) {
              //     return card;
              //   };
              // };
            } else {
              if (parseFloat(marketValue) > 1.5) {
                return card;
              };
            };
        }
    }).filter(card => card)
    if (values.length > 0) {
        values.forEach((card) => {
          let name;
          if (season === '4') {
            name = card.querySelector('.title').textContent
          } else {
            name = card.querySelector('.nname').textContent
          }
          let rarity
          if (season === '4') {
            rarity = card.querySelector('.rarity').textContent
          } else {
            rarity = getComputedStyle(card.querySelector('.deckcard-category'), ':before').getPropertyValue('content').replaceAll('"', '').toLowerCase()
          }
          const speech = new SpeechSynthesisUtterance();
          speech.text = `You just pulled ${season} ${rarity} ${name}!`;
          speech.voice = speechSynthesis.getVoices()[0];
          window.speechSynthesis.speak(speech);
      });
    }

  // Combine legendaries and values into a single set
// const retainedCards = new Set([...legendaries, ...values]);

// // Remove cards that are not in the retainedCards set
// cards.forEach(card => {
//     if (!retainedCards.has(card)) {
//         card.remove();
//     }
// });
    if (legendaries.length === 0 && values.length === 0) {
        window.close();
    }
})();

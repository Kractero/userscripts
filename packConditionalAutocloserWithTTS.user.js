// ==UserScript==
// @name         Pack Conditional TTS
// @version      1.0
// @description  Autoclose packs that don't contain legendaries or cards over certain market value with TTS voice.
// @author       Kractero
// @match        https://*.nationstates.net/page=deck*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    if (document.querySelector(".error")) return;
    if (!document.querySelector('.deck-loot-box')) return;
    const cards = document.querySelectorAll('.deck-loot-box .deckcard-container');
    const legendaries = Array.from(cards).map(card => {
        const check = card.querySelector('.deckcard-category');
        const rarity = getComputedStyle(check, ':before').getPropertyValue('content');
        if (rarity === '"LEGENDARY"') {
            return card;
        }
    }).filter(card => card)
    if (legendaries.length > 0) {
        legendaries.forEach((card) => {
          const name = card.querySelector('.nname').textContent
          const check = card.querySelector('.deckcard-category');
          const rarity = getComputedStyle(check, ':before').getPropertyValue(
          'content'
          );
          const season = card.querySelector('.deckcard-season').textContent
          const speech = new SpeechSynthesisUtterance();
          speech.text = `You just pulled ${season} ${rarity} ${name}!`;
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
          const name = card.querySelector('.nname').textContent
          const check = card.querySelector('.deckcard-category');
          const rarity = getComputedStyle(check, ':before').getPropertyValue(
          'content'
          );
          const season = card.querySelector('.deckcard-season').textContent
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
    // if (legendaries.length === 0 && values.length === 0) {
    //     window.close();
    // }
})();
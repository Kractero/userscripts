// ==UserScript==
// @name         Pack Conditional Autocloser with Notification
// @version      1.0
// @description  Autoclose packs unless conditions are met, and makes legendary cards bigger and spin and play sound effect to notify
// @author       Kractero
// @match        https://*.nationstates.net/page=deck*
// @downloadURL  https://github.com/Kractero/userscripts/raw/main/legendaryNotify.user.js
// @updateURL    https://github.com/Kractero/userscripts/raw/main/legendaryNotify.user.js
// @grant        window.close
// ==/UserScript==

(function () {
  'use strict';
  if (document.querySelector(".error")) return;
  if (!document.querySelector('.deck-loot-box')) return;
  let notifier = document.createElement('audio');
  notifier.src = 'https://ucarecdn.com/a0661e8c-2134-46dc-9912-d0963bb9c231/';
  let valuesfx = document.createElement('audio');
  valuesfx.src = 'https://ucarecdn.com/c4a98ab4-d71a-4c59-914c-06190281d30d/';
  const cards = document.querySelectorAll('.deck-loot-box .deckcard-container');
  const rarities = Array.from(cards).map((card) => {
    const check = card.querySelector('.deckcard-category');
    const rarity = getComputedStyle(check, ':before').getPropertyValue(
      'content'
    );
    if (rarity === '"LEGENDARY"') {
      return card;
    }
  });
  const nonLegendaryCards = Array.from(cards).filter(
    (card) => !rarities.includes(card)
  );
  const values = Array.from(nonLegendaryCards).map((card) => {
    const mv = card.querySelector('.deckcard-card-mv');
    if (mv) {
      const marketValue = mv.textContent.split(': ')[1];
      if (parseFloat(marketValue) > 1.5) {
        return card;
      }
    }
  });
  let resizes = rarities.filter((card) => card);
  resizes.forEach((card) => {
    card.style.width = '480px';
    card.style.height = '600px';
    let angle = 0;
    setInterval(() => {
      const x = Math.sin((angle * Math.PI) / 180) * 10;
      const y = Math.cos((angle * Math.PI) / 180) * 10;
      card.style.transform = `translate(${x}px, ${y}px)`;
      angle += 10;
    }, 25);
  });
  if (resizes.length > 0) {
    notifier.play();
  }
  let valuables = values.filter((card) => card);
  valuables.forEach((card) => {
    card.style.width = '480px';
    card.style.height = '600px';
    let angle = 0;
    setInterval(() => {
      const x = Math.sin((angle * Math.PI) / 180) * 10;
      const y = Math.cos((angle * Math.PI) / 180) * 10;
      card.style.transform = `translate(${x}px, ${y}px)`;
      angle -= 10;
    }, 25);
  });
  if (valuables.length > 0) {
    valuesfx.play();
  }

  if (resizes.length === 0 && valuables.length === 0) window.close();
})();

// ==UserScript==
// @name         Pack Autocloser with Webhook
// @version      1.2
// @author       Kractero
// @match        https://*.nationstates.net/page=deck/nation=*
// @grant        window.close
// ==/UserScript==

(async function () {
  'use strict';
  const WEBHOOK_URL = "";
  const username = "";
  const nonLegValue = 1.50;
  let error = document.querySelector(".error")
  if (error) return;
  if (!document.querySelector('.deck-loot-box')) return;
  const nationName = document.querySelector('.quietlink').textContent
  const cards = document.querySelectorAll('.deck-loot-box .deckcard-container');
  function canonicalize(str) {
    return str.trim().replace(/\s+/g, '_').toLowerCase();
  }  
  for (let i = 0; i < cards.length; i++) {
      let legFound = false;
      const season = card.querySelector('.deckcard').getAttribute('data-season')
      let rarity;
      let name;
      if (season === '4') {
          rarity = card.querySelector('.rarity').textContent
          name = card.querySelector('.title').textContent  
      } else {
          // as a note to self, this is done in case junkButton.dataset is overrode somewhere
          rarity = getComputedStyle(card.querySelector('.deckcard-category'), ':before').getPropertyValue('content');
          name = card.querySelector('.nname').textContent
      }
      if (rarity === 'legendary') {
          await fetch(WEBHOOK_URL, {
              "method": "POST",
              "headers": {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  username: "Miner",
                  avatar_url: "",
                  content: username ? `<@${username}>` : "@here",
                  embeds: [
                      {
                          title: 'Miner',
                          description: `[${nationName}](https://www.nationstates.net/container=${canonicalize(nationName)}/nation=${canonicalize(nationName)}/page=deck/value_deck=1) has just found Season ${season} ${rarity} ${name}!`,
                      },
                  ],
              })
          });
          legFound = true;
      }
      if (legFound === false) {
          const mv = cards[i].querySelector('.deckcard-card-mv');
          if (mv) {
              const marketValue = mv.textContent.split(': ')[1];
              if (parseFloat(marketValue) > nonLegValue) {
                  await fetch(WEBHOOK_URL, {
                      "method": "POST",
                      "headers": {
                          "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                          username: "Miner",
                          avatar_url: "",
                          content: username ? `<@${username}>` : "@here",
                          embeds: [
                              {
                                  title: 'Miner',
                                  description: `[${nationName}](https://www.nationstates.net/container=${canonicalize(nationName)}/nation=${canonicalize(nationName)}/page=deck/value_deck=1) has just found Season ${season} ${rarity} ${name}, with ${marketValue} value!`,
                              },
                          ],
                      })
                  });
              }
          }
      }
  }
  window.close()
})();

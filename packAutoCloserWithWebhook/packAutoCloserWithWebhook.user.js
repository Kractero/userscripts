// ==UserScript==
// @name         Pack Autocloser with Webhook
// @version      1.0
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
  const cards = document.querySelectorAll('.deck-loot-box .deckcard-container');
  for (let i = 0; i < cards.length; i++) {
      let legFound = false;
      const check = cards[i].querySelector('.deckcard-category');
      const rarity = getComputedStyle(check, ':before').getPropertyValue(
          'content'
      );
      if (rarity === '"LEGENDARY"') {
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
                          description: `[${document.querySelector('.quietlink').textContent}](https://www.nationstates.net/container=${document.querySelector('.quietlink').textContent.replaceAll(' ', '_').toLowerCase()}/nation=${document.querySelector('.quietlink').textContent.replaceAll(' ', '_').toLowerCase()}/page=deck/value_deck=1) has just found ${cards[i].querySelector('.deckcard-season').textContent} ${rarity} ${cards[i].querySelector('.nname').textContent}!`,
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
                                  description: `[${document.querySelector('.quietlink').textContent}](https://www.nationstates.net/container=${document.querySelector('.quietlink').textContent.replaceAll(' ', '_').toLowerCase()}/nation=${document.querySelector('.quietlink').textContent.replaceAll(' ', '_').toLowerCase()}/page=deck/value_deck=1) has just found ${cards[i].querySelector('.deckcard-season').textContent} ${rarity} ${cards[i].querySelector('.nname').textContent}, with ${marketValue} value!`,
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

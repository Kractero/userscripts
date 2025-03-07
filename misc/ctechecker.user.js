// ==UserScript==
// @name         CTE Checker
// @namespace    Kractero
// @version      1.0
// @description  Grays out cte cards on load
// @author       Kractero
// @match        https://*.nationstates.net/*page=deck*
// @grant        none
// ==/UserScript==

async function fetchData() {
  try {
    const cards = Array.from(document.querySelectorAll('.deckcard'))
    const ids = cards.map(card => card.getAttribute('data-cardid'))

    const nationResponse = await fetch('https://kotama.kractero.com/api/cte', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids),
    })
    const nationData = await nationResponse.json()
    cards.forEach(card => {
      const cardId = card.getAttribute('data-cardid')
      if (nationData[cardId]) {
        card.style.opacity = '0.5'
      }
    })
  } catch (error) {
    console.error('Error:', error.message)
  }
}

fetchData()

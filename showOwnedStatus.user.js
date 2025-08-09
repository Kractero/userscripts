// ==UserScript==
// @name        Show Owned Status on DV/Market page
// @match       https://*.nationstates.net/*value_deck=1*
// @match       https://*.nationstates.net/*show_market*
// @grant       none
// @version     1.0
// @author      Kractero
// ==/UserScript==

;(async function () {
  'use strict'

  const currNation = document.querySelector('#loggedin').getAttribute('data-nname')

  const pageTable = document.querySelectorAll('.cardnameblock')
  const names = Array.from(pageTable)
    .map(name => {
      const match = name.getAttribute('href').match(/card=(\d+)\/season=(\d+)/)
      return match ? { id: match[1], season: match[2], element: name } : null
    })
    .filter(Boolean)

  const req = await fetch(
    `https://www.nationstates.net/cgi-bin/api.cgi?q=cards+deck;nationname=${currNation}&userAgent=${currNation} using Show Owned Status on DV/Market page by Kractero`,
    {
      headers: {
        'User-Agent': `${currNation}`,
      },
    }
  )
  const text = await req.text()
  const parser = new DOMParser()
  const documents = parser.parseFromString(text, 'text/xml')

  const deck = Array.from(documents.querySelectorAll('CARDS CARD')).map(card => ({
    id: card.querySelector('CARDID').textContent,
    season: card.querySelector('SEASON').textContent,
  }))

  names.forEach(({ id, season, element }) => {
    const inDeck = deck.some(ask => ask.id === id && ask.season === season)

    if (inDeck) {
      const tdElement = element.parentElement
      if (!tdElement) return
      if (inDeck) {
        tdElement.innerHTML += '<span class="deckcard-token" style="background-color: #4b2e83">OWNED</div>'
      }
    }
  })
})()

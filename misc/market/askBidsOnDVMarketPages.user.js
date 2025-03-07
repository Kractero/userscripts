// ==UserScript==
// @name        Ask/Bid on DV/Market Page
// @namespace   Violentmonkey Scripts
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
    `https://www.nationstates.net/cgi-bin/api.cgi?q=cards+asksbids;nationname=${currNation}&userAgent=${currNation} using Ask/Bid on DV/Market page by Kractero`,
    {
      headers: {
        'User-Agent': `${currNation}`,
      },
    }
  )
  const text = await req.text()
  const parser = new DOMParser()
  const documents = parser.parseFromString(text, 'text/xml')

  const asks = Array.from(documents.querySelectorAll('CARDS ASKS ASK')).map(card => ({
    id: card.querySelector('CARDID').textContent,
    season: card.querySelector('SEASON').textContent,
  }))

  const bids = Array.from(documents.querySelectorAll('CARDS BIDS BID')).map(card => ({
    id: card.querySelector('CARDID').textContent,
    season: card.querySelector('SEASON').textContent,
  }))

  names.forEach(({ id, season, element }) => {
    const hasAsk = asks.some(ask => ask.id === id && ask.season === season)
    const hasBid = bids.some(bid => bid.id === id && bid.season === season)

    if (hasAsk || hasBid) {
      const tdElement = element.closest('p')
      if (!tdElement) return
      if (hasAsk) {
        tdElement.innerHTML += '<span class="deckcard-token" style="background-color: #FF7043">ASK</div>'
      }
      if (hasBid) {
        tdElement.innerHTML += '<span class="deckcard-token" style="background-color: #42A5F5">BID</div>'
      }
    }
  })
})()

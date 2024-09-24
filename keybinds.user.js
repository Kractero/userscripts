// ==UserScript==
// @name         Card Keybinds
// @version      1.0
// @description  Keybinds using hotkeys-js
// @author       Kractero
// @noframes
// @match        https://www.nationstates.net/*
// @require      https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @grant        window.close
// ==/UserScript==

;(function () {
  if (window.location.href.includes('nation=') && !document.querySelector('#loggedin')) {
    return
  }

  ;('use strict')

  const inputs = document.querySelectorAll('input.auctionbid[name="auction_ask"], input.auctionbid[name="auction_bid"]')
  //let ask_match = document.querySelector('#highest_matchable_ask_price > .cardprice_sell')
  let ask_match = document.querySelectorAll('.cardauctionunmatchedrow-bid .cardprice')[
    document.querySelectorAll('.cardauctionunmatchedrow-bid .cardprice').length - 1
  ]
  let bid_match = document.querySelector('#lowest_matchable_bid_price > .cardprice_buy')
  let mv_match = document.querySelector('.deckcard-card-stats tr:nth-child(6) td:last-child')
  ask_match = ask_match ? ask_match.textContent : 0
  bid_match = bid_match ? bid_match.textContent : 0

  hotkeys(`s,shift+s`, function (event, handler) {
    event.preventDefault()
    document.querySelector('th[data-mode="sell"').click()
    if (ask_match && ask_match > 0) {
      document.querySelector('input.auctionbid[name="auction_ask"]').value = ask_match
    }
    const askbox = document.querySelector('input.auctionbid[name="auction_ask"]')
    askbox.focus()
    askbox.select()
  })
  hotkeys(`b`, function (event, handler) {
    event.preventDefault()
    document.querySelector('th[data-mode="buy"').click()
    if (bid_match && bid_match > 0) {
      document.querySelector('input.auctionbid[name="auction_bid"]').value = mv_match
    }
    const bidbox = document.querySelector('input.auctionbid[name="auction_bid"]')
    bidbox.focus()
    bidbox.select()
    document.querySelectorAll('#cardauctionoffertable button')[1].focus()
  })

  hotkeys(`shift+b`, function (event, handler) {
    event.preventDefault()
    document.querySelector('th[data-mode="buy"').click()
    if (bid_match && bid_match > 0) {
      document.querySelector('input.auctionbid[name="auction_bid"]').value = bid_match
    }
    const bidbox = document.querySelector('input.auctionbid[name="auction_bid"]')
    bidbox.focus()
    bidbox.select()
    document.querySelectorAll('#cardauctionoffertable button')[1].focus()
  })

  hotkeys(`y,shift+y`, function (event, handler) {
    event.preventDefault()
    const stuff = document.querySelectorAll('.cardauctionunmatchedrow-ask .cardprice')
    if (stuff.length === 0) return
    for (let i = 0; i < stuff.length; i++) {
      stuff[i].click()
    }
    if (document.querySelector('button[name=remove_ask_price]')) {
      document.querySelector('button[name=remove_ask_price]').click()
    }
  })

  hotkeys(`u,shift+u`, function (event, handler) {
    event.preventDefault()
    const stuff = document.querySelectorAll('.cardauctionunmatchedrow-bid .cardprice')
    if (stuff.length === 0) return
    for (let i = 0; i < stuff.length; i++) {
      stuff[i].click()
    }
    if (document.querySelector('button[name=remove_bid_price]')) {
      document.querySelector('button[name=remove_bid_price]').click()
    }
  })

  hotkeys(`t,num_add`, function (event, handler) {
    event.preventDefault()
    window.open('https://www.nationstates.net/page=deck', '_self')
  })
  hotkeys(`m`, function (event, handler) {
    event.preventDefault()
    window.open('https://www.nationstates.net/page=deck/show_market=auctions', '_self')
  })
  hotkeys(`v`, function (event, handler) {
    event.preventDefault()
    window.open('https://www.nationstates.net/page=deck/value_deck=1', '_self')
  })

  const cards = Array.from(document.querySelectorAll('.deckcard-container'))

  cards.forEach(card => {
    const junkButton = card.querySelector('.deckcard-junk-button')
    const rarity = junkButton?.dataset.rarity
    const marketValueText = card.querySelector('.deckcard-card-mv')?.textContent
    let cardTitle = card.querySelector('.rlink')
    if (cardTitle) cardTitle = cardTitle.textContent
    const marketValue = Number(marketValueText?.replaceAll(/[^0-9.]/g, '')) || NaN
    const isLootBoxPage = window.location.href.includes('open_loot_box')
    const shouldCheckMarketValue = !isNaN(marketValue) || isLootBoxPage
    if (
      ['Ambition', 'Remembrance', 'Archive', 'The Burning Legion'].includes(cardTitle) ||
      (shouldCheckMarketValue ? marketValue >= 5 : false) ||
      rarity === 'LEGENDARY'
    ) {
      junkButton.remove()
    } else {
      junkButton.dataset.rarity = 'uncommon'
    }
  })

  if (cards.length <= 0) return

  let currentCard = 0
  const giftButtons = document.querySelectorAll('.deckcard-info-cardbuttons :not(.deckcard-junk-button)')
  cards[currentCard].style.border = 'thick solid #0000FF'
  const highlightCurrentCard = () => {
    cards.forEach(junk => (junk.style.border = ''))
    cards[currentCard].style.border = 'thick solid #0000FF'
    cards[currentCard].scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
  }

  hotkeys(`l,right,num_6`, function (event, handler) {
    event.preventDefault()
    if (currentCard < cards.length - 1) {
      currentCard += 1
      highlightCurrentCard()
    }
  })

  hotkeys(`h,left,num_4`, function (event, handler) {
    event.preventDefault()
    if (currentCard > 0) {
      currentCard -= 1
      highlightCurrentCard()
    }
  })

  hotkeys(`j,num_5,down`, function (event, handler) {
    event.preventDefault()
    if (!window.location.href.includes('card')) {
      let junkButton = cards[currentCard].querySelector('.deckcard-junk-button')
      if (junkButton) {
        junkButton.click()
        cards[currentCard].style.border = ''
        cards.splice(currentCard, 1)

        if (currentCard >= cards.length) {
          currentCard = cards.length - 1
        }

        highlightCurrentCard()
      }
      while (!junkButton && currentCard < cards.length - 1) {
        currentCard += 1
        junkButton = cards[currentCard]?.querySelector('.deckcard-junk-button')
      }
    }
  })

  if (window.location.href.indexOf('/gift=1') > -1) {
    let url = new URL(window.location.href)
    const giftto = url.searchParams.get('giftto')
    if (giftto) {
      document.querySelector('input[name="entity_name"').value = url.searchParams.get('giftto')
      document.querySelector('input[name="entity_name"').focus()
    } else {
      const default_name = 'Kractero'
      const card = document.querySelector('.deckcard-container')
      const rarity = getComputedStyle(card.querySelector('.deckcard-category'), ':before').getPropertyValue('content')

      if (rarity === '"LEGENDARY"') document.querySelector('input[name="entity_name"').value = 'Kractero'
      if (rarity === '"EPIC"') document.querySelector('input[name="entity_name"').value = 'TB Type L'
      if (rarity === '"ULTRA RARE"') document.querySelector('input[name="entity_name"').value = 'TB Type S'
      if (rarity === '"RARE"') document.querySelector('input[name="entity_name"').value = 'TB Type A'
      if (rarity === '"UNCOMMON"') document.querySelector('input[name="entity_name"').value = 'Moon Jelly'
      if (rarity === '"COMMON"') document.querySelector('input[name="entity_name"').value = 'Moon Jelly'
      document.getElementsByName('send_gift')[0].focus()
    }
  }

  hotkeys(`g,num_8,up`, function (event, handler) {
    event.preventDefault()
    if (window.location.href.includes('deck')) {
      if (cards.length > 1 && window.location.href.includes('open_loot_box')) {
        const url = cards[currentCard].getAttribute('href')
        const newTab = window.open(url, '_blank')
      } else {
        cards[currentCard].querySelector('.deckcard-info-cardbuttons :not(.deckcard-junk-button)').click()
      }
    }
  })

  hotkeys(`2,num_2`, function (event, handler) {
    event.preventDefault()
    if (window.location.href.indexOf('/gift=1') > -1) {
      document.getElementById('entity_name').value = 'Kractero'
      document.getElementsByName('send_gift')[0].focus()
    }
  })

  hotkeys(`3,num_3`, function (event, handler) {
    event.preventDefault()
    if (window.location.href.indexOf('/gift=1') > -1) {
      document.getElementById('entity_name').value = '9001'
      document.getElementsByName('send_gift')[0].focus()
    }
  })

  hotkeys(`num_subtract`, function (event, handler) {
    event.preventDefault()
    window.close()
  })
})()

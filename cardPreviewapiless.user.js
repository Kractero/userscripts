// ==UserScript==
// @name         Card Preview Lite
// @version      1.0
// @description  Preview cards (no api request)
// @author       Kractero
// @match        https://*.nationstates.net/page=upload_flag
// @match				 https://*.nationstates.net/page=deck/card=*
// @grant        none
// ==/UserScript==

const existingContentDiv = document.getElementById('content')
const headinger = document.createElement('h1')
headinger.textContent = 'Preview a Card with a flag'

const input = document.createElement('input')
input.setAttribute('type', 'text')
input.setAttribute('id', 'userInput')
input.placeholder = 'Testlandia'

const button = document.createElement('button')
button.setAttribute('id', 'submitButton')
button.classList.add('button')
button.textContent = 'Submit'

const rarities = ['common', 'uncommon', 'rare', 'ultra-rare', 'epic', 'legendary'];

const dropdown = document.createElement('select');
const defaultOption = document.createElement('option');
defaultOption.value = "";
defaultOption.textContent = "Gacha Rarities";
defaultOption.disabled = true;
defaultOption.selected = true;
dropdown.appendChild(defaultOption);

rarities.forEach(rarity => {
    const option = document.createElement('option');
    option.value = rarity;
    option.textContent = rarity.charAt(0).toUpperCase() + rarity.slice(1);
    dropdown.appendChild(option);
});

function getSelectedRarity() {
  const selectedRarity = dropdown.value;

  if (!selectedRarity) {
    return !window.location.href.includes('upload_flag')
      ? window
          .getComputedStyle(document.querySelector('.deckcard-category'), '::before')
          .getPropertyValue('content')
          .replace('"', '')
          .replace(' ', '-')
          .toLowerCase()
      : ['common', 'uncommon', 'rare', 'ultra-rare', 'epic', 'legendary'][Math.floor(Math.random() * 6)];
  }

  return selectedRarity;
}

const contentDiv = document.createElement('div')

if (window.location.href.includes('upload_flag')) {
  contentDiv.appendChild(headinger)
  contentDiv.appendChild(input)
  contentDiv.appendChild(button)
  existingContentDiv.prepend(contentDiv)
  contentDiv.appendChild(dropdown)
  const previewButton = document.createElement('button')
  previewButton.setAttribute('id', 'previewButton')
  previewButton.classList.add('button')
  previewButton.textContent = 'Preview Flag'
  previewButton.addEventListener('click', () => {
    fetchData(document.querySelector('#previewimage').getAttribute('src'))
  })
  document.querySelector('fieldset').appendChild(previewButton)
} else {
  const buttonDiv = document.createElement('div')
  buttonDiv.setAttribute('id', 'center')
  buttonDiv.style.width = '100%'
  buttonDiv.style.display = 'flex'
  buttonDiv.style.justifyContent = 'center'
  buttonDiv.appendChild(button)
  existingContentDiv.insertBefore(buttonDiv, document.querySelector('#deck-single-card').nextSibling)
}

const stylesheet = document.createElement('link')

stylesheet.rel = 'stylesheet'
stylesheet.type = 'text/css'
stylesheet.href = 'https://www.nationstates.net/deck_v1669164404.css'

const cards = document.createElement('div')
cards.id = 'cards'

document.head.appendChild(stylesheet)

const validBadges = [
  'Founder',
  'Retired Moderator',
  'Easter Egg',
  'Issues Author',
  'Postmaster',
  'Postmaster-General',
  'Historical Resolution Author',
  'General Assembly Resolution Author',
  'Moderator',
  'Site Supporter',
]

async function fetchData(preview) {
  try {
    let nation = document.querySelector('#loggedin')
    if (!nation) {
      return
    }
    nation = nation.getAttribute('data-nname')
    const nationResponse = await fetch(
      `https://www.nationstates.net/nation=${
        input.value
          ? input.value
          : document.querySelector('.nname')
          ? document.querySelector('.nname').textContent
          : nation
      }?script=CardPreview__by_Kractero__usedBy_${nation}&userclick=${Date.now()}`
    )
    const nationHTML = await nationResponse.text()
    const nationDocument = new DOMParser().parseFromString(nationHTML, 'text/html')

    let nationName = nationDocument.querySelector('.newtitlename a')
    if (!nationName) return

    const name = nationName.textContent
    const type = nationDocument.querySelector('.newtitlepretitle').textContent.match(/The (.*?) of/)[1]
    const motto = nationDocument.querySelector('.slogan').textContent
    const category = nationDocument.querySelector('.newtitlecategory').textContent
    const population = "259"
    let flag = preview || nationDocument.querySelector('.newflagbox img').getAttribute('src')
    const demonym = "people"
    const gdp = "300"
    const notable = "Ethereal glass towers, curious magnetic fields, and vivid shifting skies"
    const region = nationDocument.querySelector('#content .rlink').textContent

    const ccbadges = nationDocument.querySelector('#wabadges a')
    const cc = {}
    if (ccbadges) {
      ;(cc.link = ccbadges.href),
        (cc.img = ccbadges.querySelector('img').getAttribute('src').replace('.svg', '.png')),
        (cc.title = ccbadges.querySelector('img').getAttribute('title'))
    }

    const badgeMap = {
      "WA Member": "WA",
      "WA Delegate": "Delegate",
      "Game Moderator": "Game Mod",
      "Game Administrator": "Admin",
      "Issues Editor": "Editor"
    }

    const badges = Array.from(nationDocument.querySelectorAll('#badge_rack .badge div')).map(badge => {
      return {
        class: badge.classList[0],
        name: badgeMap[badge.textContent.trim()] ? badgeMap[badge.textContent.trim()] : badge.textContent,
        icon: badge.querySelector('i'),
      }
    })
    const trophiesCabinet = Array.from(nationDocument.querySelectorAll('#trophycabinet a'))
    const trophies = Array.from(nationDocument.querySelectorAll('.trophyrack > img'))

    const top3trophies = trophiesCabinet.slice(0, 3).map(trophy => ({
      img: trophy.querySelector('img').getAttribute('src'),
      text: trophy.querySelector('img').getAttribute('title'),
      link: trophy.href,
    }))

    const mainBadges = trophies
      .map(trophy => {
        const title = trophy.getAttribute('title')
        const src = trophy.getAttribute('src')
        return {
          title: validBadges.includes(title) || title.includes('Easter Egg') ? title : null,
          src: src,
        }
      })
      .filter(badge => badge)

    const numberOfDigits = population.length
    let formattedPopulation
    if (numberOfDigits >= 5) {
      formattedPopulation = population.slice(0, 2) + '.' + population.slice(2) + ' billion'
    } else if (numberOfDigits === 4) {
      formattedPopulation = population.slice(0, 1) + '.' + population.slice(1) + ' billion'
    } else if (numberOfDigits === 3) {
      formattedPopulation = population.slice(0, 1) + '.' + population.slice(1) + ' million'
    } else if (numberOfDigits === 2) {
      formattedPopulation = population.slice(0, 2) + ' million'
    } else if (numberOfDigits === 1) {
      formattedPopulation = population + ' million'
    }

    const economyDigits = gdp.length
    let econPrefix
    if (economyDigits >= 13) {
      econPrefix = `T`
    } else if (economyDigits >= 10) {
      econPrefix = `B`
    } else if (economyDigits >= 7) {
      econPrefix = `M`
    } else {
      econPrefix = `M`
    }

    let s1rarity = getSelectedRarity();
    let s2rarity = getSelectedRarity();
    let s3rarity = getSelectedRarity();
    let s4rarity = getSelectedRarity();

    const hachteeml = `
        <div class="deckcard-container">
            <div class="deckcard deckcard-season-1" data-cardid="1" data-season="1">
                <figure class="front deckcard-category-${s4rarity}">
                    <div class="deckcard-flag"
                        style="background-image:url(${flag}); height: 180px;">
                    </div>
                    <div class="deckcard-category"></div>
                    <div class="deckcard-title"><a href="nation=${name}" class="nlink nameblock"><span
                                class="nnameblock"><span class="ntype">The ${type} of</span> <span
                                    class="nname">${name}</span></span></a></div>
                    <div class="deckcard-lower">
                        <div class="deckcard-govt">${category}</div>
                        <div class="deckcard-slogan">“${motto}”</div>
                        <div class="deckcard-badges">
                            <div>
                                ${badges
                                  .map(badge => {
                                    return `
                                            <div class="badge">
                                                <div class="${badge.class}">
                                                    ${badge.icon ? `<i class="${badge.icon.classList[0]}"></i>` : ''}
                                                    ${badge.name}
                                                </div>
                                            </div>
                                        `
                                  })
                                  .join('')}
                            </div>
                            ${
                              cc && cc.link
                                ? `<div>
                                <div id="wabadges">
                                    <a class="wabadge" href="${cc.link}">
                                        <img
                                            src="${cc.img}" class="badge"
                                            alt="${cc.title}"
                                            title="${cc.title}">
                                    </a>
                                </div>
                            </div>`
                                : ''
                            }
                            <div class="specialbadges">
                                ${mainBadges
                                  .map(badge => {
                                    return `
                                            <img src="${badge.src}" class="trophy" title="${badge.title}">
                                        `
                                  })
                                  .join('')}
                            </div>
                            <div id="trophycabinet">
                                ${top3trophies
                                  .map(trophy => {
                                    return `
                                            <a href="${trophy.link}">
                                                <img
                                                src="${trophy.img}" class="trophy"
                                                alt="${trophy.text}" title="${trophy.text}">
                                            </a>
                                        `
                                  })
                                  .join('')}
                            </div>
                        </div>
                        <div class="deckcard-desc">${formattedPopulation} ${demonym}. ${
      notable.charAt(0).toUpperCase() + notable.slice(1)
    }</div>
                    </div>
                    <div class="deckcard-stripe">
                        <div class="deckcard-season">SEASON ONE</div>
                        <div class="deckcard-region"><a href="region=${region}" class="rlink">${region}</a></div>
                    </div>
                </figure>
                <figure class="back"></figure>
            </div>
        </div>
        <div class="deckcard-container">
            <div class="deckcard deckcard-season-1 " data-cardid="1" data-season="1">
                <figure class="front deckcard-category-${s1rarity}">
                    <div class="deckcard-flag"
                        style="background-image:url(${flag})">
                    </div>
                    <div class="deckcard-category"></div>
                    <div class="deckcard-title"><a href="nation=${name}" class="nlink nameblock"><span
                                class="nnameblock"><span class="ntype">The ${type} of</span> <span
                                    class="nname">${name}</span></span></a></div>
                    <div class="deckcard-lower">
                        <div class="deckcard-govt">${category}</div>
                        <div class="deckcard-slogan">“${motto}”</div>
                        <div class="deckcard-badges">
                            <div>
                                ${badges
                                  .map(badge => {
                                    return `
                                            <div class="badge">
                                                <div class="${badge.class}">
                                                    ${badge.icon ? `<i class="${badge.icon.classList[0]}"></i>` : ''}
                                                    ${badge.name}
                                                </div>
                                            </div>
                                        `
                                  })
                                  .join('')}
                            </div>
                            ${
                              cc && cc.link
                                ? `<div>
                                <div id="wabadges">
                                    <a class="wabadge" href="${cc.link}">
                                        <img
                                            src="${cc.img}" class="badge"
                                            alt="${cc.title}"
                                            title="${cc.title}">
                                    </a>
                                </div>
                            </div>`
                                : ''
                            }
                            <div class="specialbadges">
                                ${mainBadges
                                  .map(badge => {
                                    return `
                                            <img src="${badge.src}" class="trophy" title="${badge.title}">
                                        `
                                  })
                                  .join('')}
                            </div>
                            <div id="trophycabinet">
                                ${top3trophies
                                  .map(trophy => {
                                    return `
                                            <a href="${trophy.link}">
                                                <img
                                                src="${trophy.img}" class="trophy"
                                                alt="${trophy.text}" title="${trophy.text}">
                                            </a>
                                        `
                                  })
                                  .join('')}
                            </div>
                        </div>
                        <div class="deckcard-desc">${formattedPopulation} ${demonym}. ${
      notable.charAt(0).toUpperCase() + notable.slice(1)
    }</div>
                    </div>
                    <div class="deckcard-stripe">
                        <div class="deckcard-season">SEASON ONE</div>
                        <div class="deckcard-region"><a href="region=${region}" class="rlink">${region}</a></div>
                    </div>
                </figure>
                <figure class="back"></figure>
            </div>
        </div>
        <div class="deckcard-container">
            <div class="deckcard deckcard-season-2 "data-season="2">
                <figure class="front deckcard-category-${s2rarity}">
                    <div class="deckcard-flag" style="background-image:url(${flag})">
                    </div>
                    <div class="deckcard-category"></div>
                    <div class="deckcard-title"><a href="nation=${name}" class="nlink nameblock"><span
                                class="nnameblock"><span class="ntype">The ${type} of</span> <span
                                    class="nname">${name}</span></span></a></div>
                    <div class="deckcard-lower">
                        <div class="deckcard-govt">${category}</div>
                        <div class="deckcard-slogan">“${motto}”</div>
                        <div class="deckcard-badges">
                            <div>
                                ${badges
                                  .map(badge => {
                                    return `
                                            <div class="badge">
                                                <div class="${badge.class}">
                                                    ${badge.icon ? `<i class="${badge.icon.classList[0]}"></i>` : ''}
                                                    ${badge.name}
                                                </div>
                                            </div>
                                        `
                                  })
                                  .join('')}
                            </div>
                            ${
                              cc && cc.link
                                ? `<div>
                                <div id="wabadges">
                                    <a class="wabadge" href="${cc.link}">
                                        <img
                                            src="${cc.img}" class="badge"
                                            alt="${cc.title}"
                                            title="${cc.title}">
                                    </a>
                                </div>
                            </div>`
                                : ''
                            }
                            <div class="specialbadges">
                                ${mainBadges
                                  .map(badge => {
                                    return `
                                            <img src="${badge.src}" class="trophy" title="${badge.title}">
                                        `
                                  })
                                  .join('')}
                            </div>
                            <div id="trophycabinet">
                                ${top3trophies
                                  .map(trophy => {
                                    return `
                                            <a href="${trophy.link}">
                                                <img
                                                src="${trophy.img}" class="trophy"
                                                alt="${trophy.text}" title="${trophy.text}">
                                            </a>
                                        `
                                  })
                                  .join('')}
                            </div>
                        </div>
                        </div>
                        <div class="deckcard-desc"><span class="deckcard-desc-bit">${formattedPopulation.slice(
                          0,
                          4
                        )}<span class="pop-units">b</span><i
                                    class="icon-male"></i></span><span class="deckcard-desc-bit">${gdp.slice(0, 5)}<span
                                    class="pop-units">${econPrefix}</span><i class="icon-industrial-building"></i></span></div>
                    </div>
                    <div class="deckcard-stripe">
                        <div class="deckcard-season">SEASON TWO</div>
                        <div class="deckcard-region"><a href="region=${region}" class="rlink">${region}</a></div>
                    </div>
                </figure>
                <figure class="back"></figure>
            </div>
        </div>
        <div class="deckcard-container">
            <div class="deckcard deckcard-season-3" data-season="3">
                <figure class="front deckcard-category-${s3rarity}">
                    <div class="s3-content">
                        <div class="s3-upper">
                            <div class="s3-flagbox">
                                <div class="s3-flag">
                                    <div class="s3-flag-image"
                                        style="background-image:url(${flag})"></div>
                                </div>
                            </div>
                            <div class="s3-topline">
                                <div class="s3-topbox">
                                    <div class="s3-slogan">
                                    ${motto}
                                    </div>
                                </div>
                            </div>
                            <div class="deckcard-name">
                                <a href="nation=${name}" class="nlink nameblock"><span class="nnameblock"><span
                                            class="ntype">The ${type} of</span> <span
                                            class="nname">${name}</span></span></a>
                            </div>
                        </div>
                        <div class="s3-mid deckcard-badges">
                        ${
                          cc && cc.link
                            ? `<div>
                            <div id="wabadges">
                                <a class="wabadge" href="${cc.link}">
                                    <img
                                        src="${cc.img}" class="badge"
                                        alt="${cc.title}"
                                        title="${cc.title}">
                                </a>
                            </div>
                        </div>`
                            : ''
                        }
                        <div class="role-badges">
                            ${badges
                              .map(badge => {
                                return `
                                        <div class="badge">
                                            <div class="${badge.class}">
                                                ${badge.icon ? `<i class="${badge.icon.classList[0]}"></i>` : ''}
                                                ${badge.name}
                                            </div>
                                        </div>
                                    `
                              })
                              .join('')}
                        </div>
                        <div class="trophies">
                            <div class="specialbadges">
                                ${mainBadges
                                  .map(badge => {
                                    return `
                                            <img src="${badge.src}" class="trophy" title="${badge.title}">
                                        `
                                  })
                                  .join('')}
                            </div>
                            <div id="trophycabinet">
                                ${top3trophies
                                  .map(trophy => {
                                    return `
                                            <a href="${trophy.link}">
                                                <img
                                                src="${trophy.img}" class="trophy"
                                                alt="${trophy.text}" title="${trophy.text}">
                                            </a>
                                        `
                                  })
                                  .join('')}
                            </div>
                        </div>
                        </div>
                        <div class="s3-lower">
                            <div class="deckcard-lower-collection deckcard-govt-collection">
                                <span class="deckcard-desc-bit">${formattedPopulation.slice(
                                  0,
                                  4
                                )}<span class="pop-units">b</span><i
                                        class="icon-male"></i></span><span class="deckcard-desc-bit">${gdp.slice(
                                          0,
                                          5
                                        )}<span
                                        class="pop-units">${econPrefix}</span><i class="icon-industrial-building"></i></span>
                            </div>
                            <div class="deckcard-lower-collection">
                                <div class="deckcard-category"></div>
                                <div class="deckcard-govt">
                                    ${category}
                                </div>
                            </div>
                            <div class="deckcard-stripe">
                                <div class="deckcard-season">SEASON THREE</div>
                                <div class="deckcard-region"><a href="region=${region}" class="rlink">${region}</a></div>
                            </div>
                        </div>
                    </div>
                </figure>
                <figure class="back"></figure>
            </div>
        </div>
        `

    cards.innerHTML = hachteeml
    if (window.location.href.includes('upload_flag')) {
      existingContentDiv.insertBefore(cards, contentDiv.nextSibling)
    } else {
      cards.style.justifyContent = 'center'
      existingContentDiv.insertBefore(cards, document.querySelector('#deck-single-card').nextSibling)
    }

    const stylistic = document.createElement('style')
    stylistic.innerHTML = `
            #content {
                margin-top: 1rem;
                width: 100%;
            }
            #cards {
                display: flex;
                flex-wrap: wrap;
            }
            .deckcard-season-1 {
                overflow: hidden;
            }
        `
    document.getElementsByTagName('head')[0].appendChild(stylistic)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

document.getElementById('submitButton').addEventListener('click', () => fetchData())

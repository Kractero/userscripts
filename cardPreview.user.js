// ==UserScript==
// @name         Card Preview
// @version      1.7
// @description  Preview cards
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

const rarities = ['common', 'uncommon', 'rare', 'ultra-rare', 'epic', 'legendary']

const dropdown = document.createElement('select')
const defaultOption = document.createElement('option')
defaultOption.value = ''
defaultOption.textContent = 'Gacha Rarities'
defaultOption.disabled = true
defaultOption.selected = true
dropdown.appendChild(defaultOption)

rarities.forEach(rarity => {
  const option = document.createElement('option')
  option.value = rarity
  option.textContent = rarity.charAt(0).toUpperCase() + rarity.slice(1)
  dropdown.appendChild(option)
})

function getSelectedRarity() {
  const selectedRarity = dropdown.value

  if (!selectedRarity) {
    return !window.location.href.includes('upload_flag')
      ? window
          .getComputedStyle(document.querySelector('.deckcard-category'), '::before')
          .getPropertyValue('content')
          .replace('"', '')
          .replace(' ', '-')
          .toLowerCase()
      : ['common', 'uncommon', 'rare', 'ultra-rare', 'epic', 'legendary'][Math.floor(Math.random() * 6)]
  }

  return selectedRarity
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

const trophyValues = [
  'LIBERAL',
  'ECONOMY',
  'POLIFREE',
  'POPULATION',
  'WEALTHGAPS',
  'DEATH',
  'COMPASSIONATE',
  'ECO-GOVT',
  'CONSERVATIVE',
  'NUDE',
  'AUTO',
  'CHEESE',
  'BASKET',
  'TECH',
  'PIZZA',
  'FISH',
  'ARMS',
  'AGRICULTURE',
  'SODA',
  'TIMBER',
  'MINING',
  'INSURANCE',
  'FURNITURE',
  'RETAIL',
  'PUBLISHING',
  'GAMBLING',
  'MANUFACTURING',
  'GOVT',
  'WELFARE',
  'HEALTHCARE',
  'POLICE',
  'BUSINESS',
  'DEVOUT',
  'EQUALITY',
  'NICE',
  'RUDE',
  'SMART',
  'STUPID',
  'APATHETIC',
  'HEALTHY',
  'HAPPY',
  'WEATHER',
  'LOWCRIME',
  'SAFE',
  'LIFE',
  'EXTREME',
  'DEFENSE',
  'PEACE',
  'PRO-MARKET',
  'HIGHTAX',
  'LOWTAX',
  'CORRUPT',
  'LEASTCORRUPT',
  'AUTHORITARIAN',
  'REBELYOUTH',
  'CULTURE',
  'EMPLOYED',
  'PUBLICTRANSPORT',
  'TOURISM',
  'ARMED',
  'DRUGS',
  'FAT',
  'GODFORSAKEN',
  'ENVIRONMENT',
  'AVOIDED',
  'INFLUENCE',
  'ENDORSED',
  'AVERAGE',
  'HDI',
  'PRIMITIVE',
  'ADVANCED',
  'INCLUSIVE',
  'INCOME',
  'POORINCOME',
  'RICHINCOME',
  'EDUCATED',
  'GDP',
  'CRIME',
  'AID',
  'BLACKMARKET',
  'STATIONARY',
  'survivors',
  'zombies',
  'dead',
  'percentage zombies',
  'DISPINCOME',
  'DECK',
  'PATRIOTISM',
  'FOODQUALITY',
]

async function fetchData(preview) {
  try {
    let nation = document.querySelector('#loggedin')
    if (!nation) {
      return
    }
    nation = nation.getAttribute('data-nname')

    const nationApiResponse = await fetch(
      `https://www.nationstates.net/cgi-bin/api.cgi?nation=${
        input.value ? input.value : nation
      }&q=name+dbid+notable+gdp+population+flag+category+motto+demonym2plural+type+region+wabadges+wa+census;scale=all;mode=rank+prank&userAgent=CardPreview by Kractero usedBy ${nation}`,
      {
        headers: {
          'User-Agent': `CardPreview by Kractero usedBy ${nation}`,
        },
      }
    )
    const nationXml = await nationApiResponse.text()
    const nationXmlDoc = new DOMParser().parseFromString(nationXml, 'application/xml')

    const name = nationXmlDoc.querySelector('NAME').textContent
    const dbid = nationXmlDoc.querySelector('DBID').textContent
    const type = nationXmlDoc.querySelector('TYPE').textContent
    const motto = nationXmlDoc.querySelector('MOTTO').textContent
    const category = nationXmlDoc.querySelector('CATEGORY').textContent
    const population = nationXmlDoc.querySelector('POPULATION').textContent
    let flag = preview || nationXmlDoc.querySelector('FLAG').textContent.trim()
    const demonym = nationXmlDoc.querySelector('DEMONYM2PLURAL').textContent
    const gdp = nationXmlDoc.querySelector('GDP').textContent
    const notable = nationXmlDoc.querySelector('NOTABLE').textContent
    const region = nationXmlDoc.querySelector('REGION').textContent
    const ccbadges = nationXmlDoc.querySelector('WABADGES')
    const wa = nationXmlDoc.querySelector('UNSTATUS').textContent
    const census = nationXmlDoc.querySelector('CENSUS')

    const cc = {}
    if (ccbadges) {
      Array.from(ccbadges.querySelectorAll('WABADGE')).forEach(ccbadge => {
        const type = ccbadge.getAttribute('type')
        cc.img = `https://www.nationstates.net/images/${type}.png`
        cc.link = `page=WA_past_resolution/id=${ccbadge.textContent}/council=2`
        cc.title = `${name} was ${type}ed by Security Council Resolution # ${ccbadge.textContent}"`
      })
    }

    const badgeMap = {
      'WA Member': 'WA',
      'WA Delegate': 'Delegate',
    }

    let waMembership
    if (wa) {
      waMembership = badgeMap[wa] ? badgeMap[wa] : ''
    }

    const scales = Array.from(census.querySelectorAll('SCALE')).filter(scale => scale.querySelector('RANK').textContent)

    const sortedScales = scales
      .sort((a, b) => {
        const rankA = parseInt(a.querySelector('RANK').textContent)
        const rankB = parseInt(b.querySelector('RANK').textContent)
        return rankA - rankB
      })
      .slice(0, 3)

    const top3trophies = sortedScales.map(scale => {
      const id = parseInt(scale.getAttribute('id'))
      const rank = parseFloat(scale.querySelector('RANK').textContent)
      const prank = parseFloat(scale.querySelector('PRANK').textContent)
      const badgeSuffix = prank <= 1.0 ? '-1' : prank <= 5.0 ? '-5' : prank <= 10.0 ? '-10' : '-unknown'
      return badgeSuffix !== '-unknown' ? {
        img: `https://www.nationstates.net/images/trophies/${trophyValues[id].toLowerCase()}${badgeSuffix}.png`,
        link: `https://www.nationstates.net/nation=${name}/detail=trend/censusid=${id}`,
        text: `${trophyValues[id]} - ${rank}`,
      } : undefined
    }).filter(scale => scale)

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

    let s1rarity = getSelectedRarity()
    let s2rarity = getSelectedRarity()
    let s3rarity = getSelectedRarity()
    let s4rarity = getSelectedRarity()

    const hachteeml = `
        <div class="deckcard-container">
            <div class="deckcard deckcard-season-1" data-cardid="1" data-season="1">
                <figure class="front deckcard-category-${s4rarity}">
                    <div class="deckcard-flag"
                        style="background-image:url(${flag}); height: 180px;">
                        <div class="deckcard-info">
                            <div class="deckcard-info-content">
                                <div class="deckcard-info-cardnumber"><a href="/page=deck/card=${dbid}/season=1">#1</a></div>
                                <div class="deckcard-info-cardlink"><a href="/page=deck/card=${dbid}/season=1">Info</a></div>
                                <div class="deckcard-info-cardbuttons">
                                    <a href="#" class="button deckcard-junk-button danger " data-junkprice="1.00"
                                        data-rarity="${s1rarity}" data-cardid="1" data-season="1">Junk</a>
                                    <a href="/page=deck/card=${dbid}/season=1/gift=1" class="button ">Gift</a>
                                </div>
                            </div>
                        </div>
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
                              ${
                                waMembership
                                  ? `<div class="badge">
                                      <div class="wa_status">
                                        <i class="icon-wa"></i>${waMembership}
                                      </div>
                                    </div>`
                                  : ''
                              }
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
                        <div class="deckcard-info">
                            <div class="deckcard-info-content">
                                <div class="deckcard-info-cardnumber"><a href="/page=deck/card=${dbid}/season=1">#1</a></div>
                                <div class="deckcard-info-cardlink"><a href="/page=deck/card=${dbid}/season=1">Info</a></div>
                                <div class="deckcard-info-cardbuttons">
                                    <a href="#" class="button deckcard-junk-button danger " data-junkprice="1.00"
                                        data-rarity="${s1rarity}" data-cardid="1" data-season="1">Junk</a>
                                    <a href="/page=deck/card=${dbid}/season=1/gift=1" class="button ">Gift</a>
                                </div>
                            </div>
                        </div>
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
                              <div class="badge">
                                  <div class="wa_status">
                                      <i class="icon-wa"></i>
                                      ${waMembership}
                                  </div>
                              </div>
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
            <div class="deckcard deckcard-season-2 " data-cardid="${dbid}" data-season="2">
                <figure class="front deckcard-category-${s2rarity}">
                    <div class="deckcard-flag" style="background-image:url(${flag})">
                        <div class="deckcard-info">
                            <div class="deckcard-info-content">
                                <div class="deckcard-info-cardnumber"><a href="/page=deck/card=${dbid}/season=2">#${dbid}
                                        /2</a></div>
                                <div class="deckcard-info-cardlink"><a href="/page=deck/card=${dbid}/season=2">Info</a></div>
                                <div class="deckcard-info-cardbuttons">
                                    <a href="#" class="button deckcard-junk-button danger " data-junkprice="0.50"
                                        data-rarity="${s2rarity}" data-cardid="${dbid}" data-season="2">Junk</a>
                                    <a href="/page=deck/card=${dbid}/season=2/gift=1" class="button ">Gift</a>
                                </div>
                            </div>
                        </div>
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
                              <div class="badge">
                                  <div class="wa_status">
                                      <i class="icon-wa"></i>
                                      ${waMembership}
                                  </div>
                              </div>
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
            <div class="deckcard deckcard-season-3 " data-cardid="${dbid}" data-season="3">
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
                          <div class="badge">
                              <div class="wa_status">
                                  <i class="icon-wa"></i>
                                  ${waMembership}
                              </div>
                          </div>
                        </div>
                        <div class="trophies">
                            <div class="specialbadges">
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
                        <div class="deckcard-info">
                            <div class="deckcard-info-content">
                                <div class="deckcard-info-cardnumber"><a href="/page=deck/card=${dbid}/season=3">#${dbid} /3</a></div>
                                <div class="deckcard-info-cardlink"><a href="/page=deck/card=${dbid}/season=3">Info</a></div>
                                <div class="deckcard-info-cardbuttons">
                                    <a href="#" class="button deckcard-junk-button danger " data-junkprice="1.00"
                                        data-rarity="${s3rarity}" data-cardid="${dbid}" data-season="3">Junk</a>
                                    <a href="/page=deck/card=${dbid}/season=3/gift=1" class="button ">Gift</a>
                                </div>
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

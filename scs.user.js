// ==UserScript==
// @name        Simple Card Switcher
// @match       https://*.nationstates.net/*generated_by=Hare*
// @grant       window.close
// @version     1.23
// @author      Kractero
// @description Kill me
// ==/UserScript==

const ua = ''
const password = ''

/*
  Multi-password: Provide it by replacing the text within the ` with your username,password.
  You can provide the above password as a fallback.
*/
const puppetsPasswords = `
a,b
c,d
`.trim()

let puppetStruct = {}
if (puppetsPasswords) {
  puppetsPasswords.split('\n').forEach(combo => {
    const [username, password] = combo.split(',').map(s => s.trim())
    if (username && password) {
      puppetStruct[username] = password
    }
  })
}

if (!ua) {
  alert('Set UA in the userscript')
  return
}

;(async () => {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  let switchNation = false

  const url = new URL(window.location.href)
  const searchParams = url.searchParams

  const regex = /(?:container=([^/]+)|nation=([^/]+))/
  const match = url.pathname.match(regex)
  const nation = match ? match[1] || match[2] : null

  if (url.href.includes('generated_by=Hare')) {
    // stop what youre doing on cloudflare inspection boxes
    if (document.querySelector('.cf_inspection_box')) {
      return
    }

    // terminate on creator
    if (window.location.href.includes('Creator')) {
      return
    }

    // if loggedout is present
    if (document.querySelector('#loggedout')) {
      switchNation = true
    }

    // if the nation is logged in (on a non template_none page),
    // but the nation doesn't match the one in the url, switch
    if (document.querySelector('#loggedin')) {
      const loggedNation = document.body.getAttribute('data-nname')
      if (loggedNation !== nation.replaceAll(' ', '_').toLowerCase()) {
        switchNation = true
      }
    }

    // if the url contains gotIssues (for gotIssues) and no issue, switch
    // or auction with template_none
    if (
      (url.href.includes('gotIssues') && url.href.includes('dilemma') && !document.querySelector('.dilemmapaper')) ||
      url.href.includes('Auction')
    ) {
      switchNation = true
      const loggedNation = document.body.getAttribute('data-nname')
      const currentNation = localStorage.getItem('currentNation')
      if ((loggedNation && loggedNation !== nation.replaceAll(' ', '_').toLowerCase()) || currentNation === nation) {
        switchNation = false
      }
    }

    // if the url contains junkdajunk and junk value is zero, there are two reasons:
    // 1) you already junked the card and don't own it anymore
    // 2) you are on the wrong nation
    // Another potential outcome is that you aren't logged into any nation, this will result in 'Whoops, you are logged out!'
    if (
      url.href.toLowerCase().includes('junkdajunk') &&
      (Number(document.body.textContent) === 0 || document.body.textContent.includes('Whoops'))
    ) {
      switchNation = true
      // double checks against the logged nation in local storage
      // if it matches the one in the url, a 0 is assumed to be that you no longer have the card and the page is closed
      if (localStorage.getItem('currentNation') === nation) {
        window.close()
        return
      }
    } else if (url.href.toLowerCase().includes('junkdajunk') && !url.href.toLowerCase().includes('jdj=view')) {
      window.close()
    }

    if (searchParams.has('open_loot_box') && !document.body.textContent.includes('You have no unopened packs')) {
      switchNation = false
      if (document.querySelector('#loggedout')) {
        switchNation = true
      }
    }

    // If the exploding computer happens the local storage nation may get out of sync before an actual switch happens.
    // To check this look at the error message that says X nation is not confronted, if it's not the same as the stored nation, switch
    if (document.querySelector('.error')) {
      const currentNation = localStorage.getItem('currentNation')
      if (!document.querySelector('.error').textContent.includes(currentNation)) {
        switchNation = true
      }
    }

    if (switchNation === true) {
      // for query selecting on other scripts
      const notice = document.createElement('div')
      notice.id = 'switching'
      notice.style.display = 'none'
      document.body.appendChild(notice)

      const nationId = nation.toLowerCase().replace(/ /g, '_')
      const pingUrl = `https://www.nationstates.net/cgi-bin/api.cgi?nation=${nationId}&q=ping`
      const resolvedPassword = puppetStruct[nation] || password

      try {
        const response = await fetch(pingUrl, {
          method: 'GET',
          headers: {
            'User-Agent': `Shitty_Card_Switcher__by_Kractero__usedBy_${ua}`,
            'X-Password': resolvedPassword,
          },
        })

        const ratelimitRemaining = Number(response.headers.get('RateLimit-Remaining')) || 0
        const ratelimitReset = Number(response.headers.get('RateLimit-Reset')) || 30
        const retryAfter = Number(response.headers.get('Retry-After')) || 0

        let waitTime = 0
        if (response.status === 429) {
          waitTime = retryAfter > 0 ? retryAfter : ratelimitReset
          await sleep(waitTime * 1000)
        } else if (ratelimitRemaining > 0) {
          waitTime = ratelimitReset / ratelimitRemaining
          await sleep(waitTime * 1000)
        } else {
          waitTime = ratelimitReset
          await sleep(waitTime * 1000)
        }

        if (!response.ok) {
          console.log(`[${nation}] login failed (${response.status}).`)
          return
        }

        const pin = response.headers.get('x-pin')

        if (pin) {
          document.cookie = `pin=${pin}; domain=www.nationstates.net; path=/; secure`
          localStorage.setItem('currentNation', nation)
          document.addEventListener('keydown', event => {
            if (event.key === 'Enter') window.location.reload()
          })
        } else {
          console.log(`[${nation}] login failed (no PIN in header).`)
        }
      } catch (error) {
        console.log(`network error: ${error.message}`)
        sleep(2000)
      }
    }
  }

  if (searchParams.has('open_loot_box') && document.querySelector('.lootboxbutton')) {
    document.querySelector('.lootboxbutton').focus()
  }
})()

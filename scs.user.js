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

const url = new URL(window.location.href)
const searchParams = url.searchParams
const separator = url.searchParams.toString() ? '&' : '?'

const regex = /(?:container=([^/]+)|nation=([^/]+))/
const match = url.pathname.match(regex)

const nation = match ? match[1] || match[2] : null

handler()

function handler() {
  let switchNation = false

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
    if ((url.href.includes('gotIssues') && url.href.includes('dilemma') && !document.querySelector('.dilemmapaper')) || url.href.includes("Auction")) {
      switchNation = true
      const loggedNation = document.body.getAttribute('data-nname')
      const currentNation = localStorage.getItem("currentNation")
      if ((loggedNation && loggedNation !== nation.replaceAll(' ', '_').toLowerCase()) || currentNation === nation) {
        switchNation = false
      }
    }
    
    // if the url contains junkdajunk and junk value is zero, there are two reasons:
    // 1) you already junked the card and don't own it anymore
    // 2) you are on the wrong nation
    // Another potential outcome is that you aren't logged into any nation, this will result in 'Whoops, you are logged out!'
    if (url.href.toLowerCase().includes('junkdajunk') && (Number(document.body.textContent) === 0 || document.body.textContent.includes('Whoops'))) {
      switchNation = true
      // double checks against the logged nation in local storage
      // if it matches the one in the url, a 0 is assumed to be that you no longer have the card and the page is closed
      if (localStorage.getItem("currentNation") === nation) {
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
      const currentNation = localStorage.getItem("currentNation");
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

      if (document.getElementById('loginbox')) {
        document.querySelector('#loginbox').classList.add('activeloginbox')
        document.querySelector('#loginbox > form input[name=nation]').value = nation
        const resolvedPassword = puppetStruct[nation] || password
        if (!resolvedPassword) {
          alert('Set password in the userscript!')
          return
        }
        document.querySelector('#loginbox > form input[name=password]').value = resolvedPassword
        document.querySelector('#loginbox > form input[name=autologin]').checked = true

        document.addEventListener('keyup', function onKeyUp(event) {
          if (event.key === 'Enter') {
            // set the form action to tell the form to send the login data to the relevant page, this has the benefit of landing back on the right page
            document.querySelector(
              '#loginbox > form'
            ).action = `${url}${separator}script=Shitty_Card_Switcher__by_Kractero__usedBy_${ua}&userclick=${Date.now()}`
            localStorage.setItem("currentNation", nation)
            document.querySelector('#loginbox > form button[name=submit]').click()
            document.removeEventListener('keyup', onKeyUp)
          }
        })
      } else {
        const loginForm = document.createElement('form')
        loginForm.method = 'POST'

        const loggingInInput = document.createElement('input')
        loggingInInput.name = 'logging_in'
        loggingInInput.value = '1'
        loggingInInput.type = 'hidden'

        const nationInput = document.createElement('input')
        nationInput.name = 'nation'
        nationInput.value = nation

        const passwordInput = document.createElement('input')
        passwordInput.name = 'password'
        passwordInput.type = 'password'
        const resolvedPassword = puppetStruct[nation] || password
        if (!resolvedPassword) {
          alert('Set password in the userscript!')
          return
        }
        passwordInput.value = resolvedPassword

        const loggedInInput = document.createElement('input')
        loggedInInput.name = 'autologin'
        loggedInInput.value = 'yes'
        loggedInInput.type = 'checkbox'
        loggedInInput.checked = true
        
        const submitButton = document.createElement('button')
        submitButton.type = 'submit'
        submitButton.value = 'Login'
        submitButton.textContent = 'Login'

        loginForm.append(loggingInInput, nationInput, passwordInput, loggedInInput, submitButton)

        document.addEventListener('keyup', function onKeyUp(event) {
          if (event.key === 'Enter') {
            // set the form action to tell the form to send the login data to the relevant page, this has the benefit of landing back on the right page
            localStorage.setItem("currentNation", nation)
            loginForm.action = `${url}${separator}script=Shitty_Card_Switcher__by_Kractero__usedBy_${ua}&userclick=${Date.now()}`
            loginForm.submit()
            document.removeEventListener('keyup', onKeyUp)
          }
        })

        document.body.prepend(loginForm)
      }
    }
  }

  if (searchParams.has('open_loot_box')) {
    document.querySelector('.lootboxbutton').focus()
  }
}

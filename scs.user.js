// ==UserScript==
// @name        Simple Card Switcher
// @match       https://*.nationstates.net/*generated_by=Hare*
// @grant       window.close
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.27
// @author      Kractero
// @description Kill me
// ==/UserScript==

let ua = GM_getValue('SCS_ua', '')
let password = GM_getValue('SCS_password', '')
let puppets = GM_getValue('SCS_puppets', '')
let puppetStruct = {}

function showSettingsModal() {
  // disable everything when this is open
  document.querySelectorAll('form input[type="submit"], form button').forEach(el => {
    el.disabled = true
    el.classList.add('disabledForSimultaneity')
  })

  // create modal and overlay for the form
  const overlay = document.createElement('div')
  overlay.style = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
    display: flex; justify-content: center; align-items: center; z-index: 9999;
  `
  const modal = document.createElement('div')
  modal.style = `
    background: #fff; padding: 2em; border-radius: 12px; max-width: 400px;
    width: 90%; font-family: sans-serif;
  `

  // create form with html because using js to do it is terrible
  modal.innerHTML = `
    <form target="_top">
      <p>USER AGENT</p>
      <p><input id="SCS_ua" name="ua" size="40" value="${ua}"></p>
      <p>PASSWORD</p>
      <p><input id="SCS_password" name="password" type="password" size="40" value="${password}"></p>
      <p>
        <details>
          <summary>PUPPETS (user,password per line, optional)</summary>
          <textarea id="SCS_puppets" rows="5" style="width:100%">${puppets}</textarea>
        </details>
      </p>
      <p>
        <button id="SCS_submit" class="button icon approve">Save</button>
      </p>
    </form>
  `

  overlay.appendChild(modal)
  document.body.appendChild(overlay)

  // Strip the inputs and force a reload
  document.getElementById('SCS_submit').addEventListener('click', e => {
    e.preventDefault()

    GM_setValue('SCS_ua', document.getElementById('SCS_ua').value.trim())
    GM_setValue('SCS_password', document.getElementById('SCS_password').value.trim())
    GM_setValue('SCS_puppets', document.getElementById('SCS_puppets').value.trim())

    window.location.href = window.location.href
  })
}

if (puppets) {
  puppets.split('\n').forEach(line => {
    const [user, pw] = line.split(',').map(s => s.trim())
    if (user && pw) puppetStruct[user] = pw
  })
}

if (!ua || !password) {
  showSettingsModal()
} else {
  handler()
}

function handler() {
  const url = new URL(window.location.href)
  const searchParams = url.searchParams
  const separator = url.searchParams.toString() ? '&' : '?'

  const regex = /(?:container=([^/]+)|nation=([^/]+))/
  const match = url.pathname.match(regex)

  const nation = match ? match[1] || match[2] : null

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
    if (
      (url.href.includes('gotIssues') && url.href.includes('dilemma') && !document.querySelector('.dilemmapaper')) ||
      url.href.includes('Auction')
    ) {
      switchNation = true
      const loggedNation = document.body.getAttribute('data-nname')
      const currentNation = localStorage.getItem('currentNation')
      if ((loggedNation && loggedNation !== nation.replaceAll(' ', '_').toLowerCase() && !url.href.includes('Auction')) || currentNation === nation) {
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

      if (document.getElementById('loginbox')) {
        const editButton = document.createElement('button')
        editButton.classList.add('button')
        editButton.textContent = 'Edit SCS Credentials'
        editButton.addEventListener('click', showSettingsModal)

        document.querySelector('#loginbox').classList.add('activeloginbox')
        document.querySelector('#loginbox > form input[name=nation]').value = nation
        document.querySelector('#loginbox').prepend(editButton)

        const resolvedPassword = puppetStruct[nation] || password
        document.querySelector('#loginbox > form input[name=password]').value = resolvedPassword
        document.querySelector('#loginbox > form input[name=autologin]').checked = true

        const loginbox = document.getElementById('loginbox')

        document.querySelectorAll('form input[type="submit"], form button').forEach(el => {
          if (!loginbox.contains(el)) {
            el.disabled = true
            el.classList.add('disabledForSimultaneity')
          }
        })

        document.addEventListener(
          'keyup',
          function onKeyUp(event) {
            if (event.key === 'Enter') {
              event.preventDefault()
              event.stopImmediatePropagation()
              // set the form action to tell the form to send the login data to the relevant page, this has the benefit of landing back on the right page
              document.querySelector(
                '#loginbox > form'
              ).action = `${url}${separator}script=Shitty_Card_Switcher__by_Kractero__usedBy_${ua}&userclick=${Date.now()}`
              localStorage.setItem('currentNation', nation)
              document.querySelector('#loginbox > form button[name=submit]').click()
              document.removeEventListener('keyup', onKeyUp)
            }
          },
          { capture: true, once: true }
        )
      } else {
        document.querySelectorAll('form input[type="submit"], form button').forEach(el => (el.disabled = true))
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

        const editButton = document.createElement('button')
        editButton.classList.add('button')
        editButton.textContent = 'Edit SCS Credentials'
        editButton.addEventListener('click', showSettingsModal)

        loginForm.append(loggingInInput, nationInput, passwordInput, loggedInInput, submitButton, editButton)

        document.addEventListener(
          'keyup',
          function onKeyUp(event) {
            if (event.key === 'Enter') {
              event.preventDefault()
              event.stopImmediatePropagation()
              // set the form action to tell the form to send the login data to the relevant page, this has the benefit of landing back on the right page
              localStorage.setItem('currentNation', nation)
              loginForm.action = `${url}${separator}script=Shitty_Card_Switcher__by_Kractero__usedBy_${ua}&userclick=${Date.now()}`
              loginForm.submit()
              document.removeEventListener('keyup', onKeyUp)
            }
          },
          { capture: true, once: true }
        )

        document.body.prepend(loginForm)
      }
    }
  }

  if (searchParams.has('open_loot_box')) {
    document.querySelector('.lootboxbutton').focus()
  }
}

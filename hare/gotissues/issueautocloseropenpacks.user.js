// ==UserScript==
// @name         Issue Autocloser and Open Packs
// @version      1.1
// @match        https://*.nationstates.net/*page=enact_dilemma*
// @exclude      https://*.nationstates.net/*page=show_dilemma*
// @grant        window.close
// @author       Kractero
// ==/UserScript==

;(function () {
    'use strict'
    if (document.querySelector('.error')) {
      document.addEventListener('keyup', function keyup(ev) {
        if (ev.key === 'Enter') {
          window.location.href = `${window.location.href.replace('enact', 'show')}?userclick=${Date.now()}`
        }
  
        document.removeEventListener('keyup', keyup)
      })
      return
    }
    function addStyle(style) {
      'use strict'
      var node = document.createElement('style')
      node.innerHTML = style
      document.getElementsByTagName('head')[0].appendChild(node)
    }
    const pack_open_btn = document.querySelector('.button.lootboxbutton')
    if (pack_open_btn) {
      addStyle('div, h5, p, #banner { display: none; } #main, #content, form p { display: initial;}')
      pack_open_btn.scrollIntoView()
      document.addEventListener('keyup', ev => {
        if (ev.key != 'Enter' || ev.repeat) {
          ev.preventDefault()
          return
        }
        if (pack_open_btn.style.display != 'none') {
          pack_open_btn.style.display = 'none'
          pack_open_btn.click()
        }
      })
    } else {
      window.close()
    }
  })()
  
// ==UserScript==
// @name         Move Puppets / Change Flag
// @version      1.1
// @description  Quickly move regions, set flag for new puppets
// @author       Kractero
// @match        https://*.nationstates.net/*
// @exclude      https://*.nationstates.net/*card=*
// ==/UserScript==

;(function () {
  'use strict'
  const regionName = ''

  document.addEventListener('keydown', event => {
    if (event.key === '1') {
      window.location.href = `https://www.nationstates.net/region=${regionName}`
    }
    if (event.key === '2' && window.location.href.includes('region')) {
      if (document.querySelector('.danger')) {
        const dangerButton = document.querySelector('.danger')
        dangerButton.click()
        dangerButton.disabled = true
      }
    }
    if (event.key === '3') {
      window.location.href = 'https://www.nationstates.net/page=tgsettings'
    }
    if (event.key === '4') {
      document.querySelector('table td input').click()
      document.querySelector('#update_filter').click()
    }
  })
})()

// ==UserScript==
// @name         Move Puppets
// @namespace    Kractero
// @version      1.1
// @description  Quickly move regions, set flag for new puppets
// @author       Kractero
// @match        https://*.nationstates.net/*
// @exclude      https://*.nationstates.net/page=deck/card=*
// @require      https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @downloadUrl  https://github.com/Kractero/ns-stuff/raw/master/quickPuppetMover.user.js
// ==/UserScript==

;(function () {
  'use strict'
  const regionKey = '1'
  const tgKey = '2'
  const settingsKey = '3'
  const waKey = '4'
  const regionName = 'koprulu_sector'
  const regionalPassword = ''

  hotkeys(regionKey, function (event) {
    event.preventDefault()
    if (!window.location.href.includes(`region=${regionName}`)) {
      window.location.href = `https://www.nationstates.net/region=${regionName}`
    }

    if (window.location.href.includes('region') && document.querySelector('button[name="move_region"]')) {
      document.querySelector('.danger').click()
    }

    if (window.location.href.includes('region') && document.querySelector("#content input[type='password']")) {
      document.querySelector("#content input[type='password']").value = regionalPassword
      document.querySelector("#content input[type='submit']").click()
    }
  })

  hotkeys(tgKey, function (event) {
    event.preventDefault()
    if (!window.location.href.includes('tgsettings')) {
      window.location.href = 'https://www.nationstates.net/page=tgsettings'
    } else {
      document.querySelector('table td input').click()
      document.querySelector('#update_filter').click()
    }
  })

  hotkeys(settingsKey, function (event) {
    event.preventDefault()
    if (!window.location.href.includes('upload_flag')) {
      window.location.href = 'https://www.nationstates.net/page=upload_flag'
    } else if (
      document.querySelector('#previewimage').getAttribute('src') !==
      'data:data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
    ) {
      document.querySelector('.primary').click()
    } else {
      document.getElementById('file').click()
    }
  })

  hotkeys(waKey, function (event) {
    event.preventDefault()
    if (!window.location.href.includes('page=un')) {
      window.location.href = 'https://www.nationstates.net/page=un'
    } else {
      document.querySelector('#content form button').click()
    }
  })
})()

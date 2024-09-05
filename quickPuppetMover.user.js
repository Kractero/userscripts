// ==UserScript==
// @name         Move Puppets
// @namespace    Kractero
// @version      1.0
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
  const moveKey = '2'
  const tgKey = '3'
  const settingsKey = '4'
  const regionName = 'herta_space_station'
  const regionalPassword = ''

  hotkeys(regionKey, function (event, handler) {
    event.preventDefault()
    window.location.href = `https://www.nationstates.net/region=${regionName}`
  })

  hotkeys(moveKey, function (event, handler) {
    event.preventDefault()
    if (
      window.location.href.includes('region') &&
      !document.querySelector('#panelregionbar a').getAttribute('href').includes('herta_space_station') &&
      document.querySelector('.danger')
    ) {
      document.querySelector('.danger').click()
    }

    if (window.location.href.includes('region') && document.querySelector("#content input[type='password']")) {
      document.querySelector("#content input[type='password']").value = regionalPassword
      document.querySelector("#content input[type='submit']").click()
    }
  })

  hotkeys(tgKey, function (event, handler) {
    event.preventDefault()
    if (!window.location.href.includes('tgsettings')) {
      window.location.href = 'https://www.nationstates.net/page=tgsettings'
    } else {
      document.querySelector('table td input').click()
      document.querySelector('#update_filter').click()
    }
  })

  // Mousetrap.bind(
  //   [settingsKey],
  //   function (ev) {
  //     noinput_mousetrap(ev)
  //     if (!window.location.href.includes('upload_flag')) {
  //       window.location.href = 'https://www.nationstates.net/page=upload_flag'
  //     } else if (
  //       document.querySelector('#previewimage').getAttribute('src') !==
  //       'data:data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
  //     ) {
  //       document.querySelector('.primary').click()
  //     } else {
  //       console.log(document.querySelector('#previewimage'))
  //       document.getElementById('file').click()
  //     }
  //   },
  //   'keyup'
  // )
})()

// ==UserScript==
// @name         Auto Log
// @version      1.0
// @description  If a container isn't logged in and a corresponding link that requires login is hit, log in
// @match        https://*.nationstates.net/*page=show_dilemma*
// @grant        window.close
// ==/UserScript==

;(function () {
  if (document.querySelector('.mcollapse')) {
    document.head.removeChild(document.head.lastChild)
    document.querySelector(".mcollapse input[type='password']").value = ''
    document.querySelector(".mcollapse input[type='checkbox']").checked = true
    document.querySelector('.mcollapse button').focus()
  }
})()

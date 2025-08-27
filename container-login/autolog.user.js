// ==UserScript==
// @name        Auto Login Helper
// @match       https://*.nationstates.net/*test=1*
// @grant       window.close
// @version     1.2
// @author      Kractero
// ==/UserScript==
(function () {
    'use strict';
    if (!document.getElementById('page_login')) window.close()
    const url = new URL(window.location.href)
    const searchParams = url.searchParams
    const separator = url.searchParams.toString() ? '&' : '?'

    const regex = /(?:container=([^/]+)|nation=([^/]+))/
    const match = url.pathname.match(regex)

    const nation = match ? match[1] || match[2] : null

    if (document.querySelector('#loggedin')) {
      const loggedNation = document.body.getAttribute('data-nname')
      if (loggedNation === nation.replaceAll(' ', '_').toLowerCase()) {
        window.close()
      }
    }
    
    let enpass = document.querySelectorAll('input[type="password"]')[1];
    if (enpass) {
        enpass.value = "";
        if (!enpass.value) {
            alert("You need to set your password at line 15 of the Auto Login Helper (enpass.value) userscript")
            return;
        }
        let check = document.querySelectorAll('input[type="checkbox"]')[1];
        if (check) {
            check.click();
        }
        let button = document.querySelectorAll("button")[1];
        if (button) {
            button.focus();
        }
    }
})();


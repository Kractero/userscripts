// ==UserScript==
// @name        Auto Login Helper
// @match       https://*.nationstates.net/*test=1*
// @match       https://*.nationstates.net/*nation*
// @grant       window.close
// @version     1.3
// @author      Kractero
// ==/UserScript==
(function () {
    'use strict';
    if (!window.location.href.includes('test=1') && document.referrer.includes('test=1')) window.close()
    if (!window.location.href.includes('test=1')) return
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
        
        if (document.querySelector('#loggedin')) {
          let nation = document.querySelectorAll('input[name="nation"]')[1].value;
          document.querySelector('#content form').action = `/test=1`
        } else {
          if (document.querySelector('b')) return
          let nation = document.querySelectorAll('input[name="nation"]')[1].value;
          document.querySelector('#content form').action = `/nation=${nation}?test=1`
        }
    }
})();


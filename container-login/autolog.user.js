// ==UserScript==
// @name        Auto Login Upload Flag
// @namespace   Violentmonkey Scripts
// @match       https://*.nationstates.net/*test=1*
// @match       https://*.nationstates.net/
// @grant       window.close
// @version     1.0
// @author      Kractero
// ==/UserScript==
(function () {
    'use strict';
    if (!document.getElementById('page_login')) return
    let enpass = document.querySelectorAll('input[type="password"]')[1];
    if (enpass) {
        enpass.value = "";
        if (!enpass.value) {
            alert("You need to set your password at line 15 of the Auto Login Upload Flag userscript")
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
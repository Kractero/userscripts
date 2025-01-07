// ==UserScript==
// @name         Nation Creator
// @version      1.2
// @description  Quickly Found Nations
// @author       Kractero
// @match        https://*.nationstates.net/*page=create_nation*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';
    if (document.querySelector('#content input[type="submit"]')) {
        const split = window.location.href.split('?')[0]
        const nation = decodeURIComponent(split.substring(split.lastIndexOf('=') + 1));
        localStorage.setItem('createNation', nation);
        document.querySelector('#content input[type="submit"]').focus()
        return
    }
    if (document.querySelector('#content button[type="submit"]')) {
        document.querySelector('input[name="name"]').value = localStorage.getItem('createNation')

        // Set motto
        document.querySelector('input[name="slogan"]').value = ""

        // Set animal
        document.querySelector('input[name="animal"]').value = ""

        // Set currency
        document.querySelector('input[name="currency"]').value = ""

        // Set email
        document.querySelector('input[name="email"]').value = ""

        // Set password and confirmpassword
        document.querySelector('.settings input[name="password"]').value = ""
        document.querySelector('.settings input[name="confirm_password"]').value = ""

        // Set flag, must be valid flag with file type
        document.getElementById('flag').value = "Albania.svg";

        // Government type, between 100-138
        document.getElementById('type').value = 100;

        document.getElementById('legal').checked = true;
        document.querySelector('#content button[type="submit"]').focus()
    }
})();

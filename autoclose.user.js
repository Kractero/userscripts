// ==UserScript==
// @name         autoclose=1
// @version      0.1
// @match        *://*/*autoclose=1
// @match        https://*.nationstates.net/*page=enact_dilemma*
// @exclude      https://*.nationstates.net/*page=show_dilemma*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nationstates.net//
// @grant        window.close
// ==/UserScript==

// mirror

// @match on autoclose=1 not necessary for gotissues but is for junkdajunk and others
// @match on enact_dilemma as autoclose does not carry over to the issue answered screen
// @exclude on show_dilemma since autoclose should not close the new intermediary screen

(function () {
    'use strict';
    window.close();
})();
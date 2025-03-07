// ==UserScript==
// @name         Issue Autocloser
// @version      1.1
// @match        https://*.nationstates.net/*page=enact_dilemma*
// @exclude      https://*.nationstates.net/*page=show_dilemma*
// @grant        window.close
// @author       Kractero
// ==/UserScript==

(function () {
    'use strict';
    if (document.querySelector('.error')) {
      document.addEventListener("keyup", function keyup (ev) {
          if (ev.key === "Enter") {
            window.location.href = `${window.location.href.replace('enact', 'show')}?userclick=${Date.now()}`
          }
          document.removeEventListener("keyup", keyup)
      });
      return
    };
    window.close();
})();

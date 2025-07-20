// ==UserScript==
// @name        IA Link on IA Census
// @match       https://www.nationstates.net/page=list_nations?censusid=86
// @grant       none
// @version     1.0
// @author      Kractero
// @description When viewing the census, link to the IA Page
// ==/UserScript==

document.querySelectorAll('.nationranks').forEach(link => {
  link.querySelector('.nlink').href = `${link.querySelector('.nlink').href}/page=deck/value_deck=1`
})

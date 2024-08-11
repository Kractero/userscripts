// ==UserScript==
// @name        Gold Badge Counter
// @namespace   Violentmonkey Scripts
// @match       https://www.nationstates.net/nation=*
// @grant       none
// @version     1.0
// @author      -
// @description 8/10/2024, 2:16:31 PM
// ==/UserScript==

let global = document.querySelectorAll('.trophyrack')[0]
let badges = global.querySelectorAll('.trophy');

let onepercent = 0;
badges.forEach(badge => {
  if (badge.getAttribute('src').includes('-1.png')) {
    onepercent = onepercent + 1
  }
})

let p = document.createElement('p')
p.textContent = onepercent

document.querySelector('.trophyline').after(p)
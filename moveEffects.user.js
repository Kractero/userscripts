// ==UserScript==
// @name         Move Effects and Sort
// @version      1.0
// @description  Move issue effects to the top and sort by badge ranks
// @author       Kractero
// @match        https://*.nationstates.net/page=enact_dilemma/*
// @downloadUrl  https://github.com/Kractero/userscripts/raw/main/moveEffects.user.js
// @downloadUrl  https://github.com/Kractero/userscripts/raw/main/moveEffects.user.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const effects = document.querySelector('.wceffects');
  const childrenArray = Array.from(effects.children);
  const dilemma = document.querySelector('.dilemma');
  effects.innerHTML = '';
  childrenArray.sort((a, b) => {
    const regex = /-(\d+)\.png$/;
    const aValue = a.querySelector('.wc-change img');
    const aSrc = parseInt(aValue.getAttribute('src').match(regex)[1]);
    const bValue = b.querySelector('.wc-change img');
    const bSrc = parseInt(bValue.getAttribute('src').match(regex)[1]);
    return aSrc - bSrc;
  });
  childrenArray.forEach((child) => effects.appendChild(child));
  const h5 = document.querySelectorAll('h5')[2];
  dilemma.prepend(effects);
  dilemma.prepend(h5);
  const packFound = document.querySelector('#content > form');
  if (packFound) document.querySelector('#content').prepend(packFound);
})();

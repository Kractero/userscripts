// ==UserScript==
// @name        Hide Subforums From Latest Topics
// @match       https://*.nationstates.net/*
// @version     1.0
// @author      Kractero
// ==/UserScript==
(function () {
    'use strict';

    // 20 is nsg, add others in
    const hide = ["6", "20"];

    Array.from(document.querySelectorAll('.threads a')).forEach(link => {
        hide.forEach(id => {
            if (link.href.includes(`f=${id}`)) {
                link.parentElement.remove();
            }
        });
    });
})();
// ==UserScript==
// @name         NsIssueCompactorRandMod
// @version      1.0
// @description  NsIssueCompactorRand but it text to speeches or plays audio when finding an iframe
// @author       Kractero
// @noframes
// @match        https://www.nationstates.net/*page=show_dilemma*
// @grant        window.close
// @run-at       document-end
// ==/UserScript==

/*
 * Copyright (c) 2019-2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

(function () {
    let keyupListener = function (ev, chosenButtonNumber) {
        if (ev.key !== "Enter" || ev.repeat || issuebtns[chosenButtonNumber].style.display === "none") {
            ev.preventDefault();
            return;
        }
        document.querySelectorAll("button.button.big.icon").forEach(function (el) {
            el.style.display = "none";
        });
        issuebtns[chosenButtonNumber].click();
        document.removeEventListener('keyup', keyupListener)
    };

    function checkForIframe(observer) {
        const iframe = document.querySelector('iframe');
        // let notifier = document.createElement('audio');
        // notifier.volume = 0.3
        // notifier.src = ''
        if (iframe) {
            // observer.disconnect();
            // notifier.play();
            const speech = new SpeechSynthesisUtterance();
            speech.text = `Recaptcha found`;
            speech.voice = speechSynthesis.getVoices()[0];
            window.speechSynthesis.speak(speech);
        }
    }

    const observer = new MutationObserver(() => checkForIframe(observer));
    observer.observe(document.body, { childList: true, subtree: true });

    const issuebtns = document.querySelectorAll("button.button.big.icon.approve");
    if (issuebtns.length > 0) {
        document.querySelector("p.dilemmadismissbox > button.big.icon.remove.danger").disabled = true;
        const chosenButtonNumber = 0;
        issuebtns[chosenButtonNumber].classList.add("rces-chosen");

        if (!window.location.href.includes('template-overall=none')) {
            // wait a second for interactivity for the iframe to fully load idk
            setTimeout(() => {
              document.addEventListener("keyup", (e) => keyupListener(e, chosenButtonNumber));
            }, 1000);
        } else {
            document.addEventListener("keyup", (e) => keyupListener(e, chosenButtonNumber));
        }
    }
})();

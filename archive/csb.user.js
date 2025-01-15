// ==UserScript==
// @name         CSB
// @version      1.5
// @description  try to take over the world!
// @author       Kractero
// @match        https://*.nationstates.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nationstates.net
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Check if mobile device and if not, do nothing
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return

    const animal = "toucan";
    const motto = "The Golden Age will return again";
    const classification = Math.floor(Math.random() * 39 + 100);
    const currency = "dollar";
    const flag = "Scotland.png";
    const econ = Math.floor(Math.random() * 99 + 1);
    const civil = Math.floor(Math.random() * 99 + 1);
    const polit = Math.floor(Math.random() * 99 + 1);
    const password = "passwordingsun"
    const email = ""

    let nation = document.querySelector('#loggedin').getAttribute('data-nname')

    // Get username
    const usernameBox = document.querySelector('input[name="nation"]')
    // Change this for username pre-fill value
    if (usernameBox) usernameBox.value = 'CSBs Puppet -'

    // Get password
    const passwordBox = document.querySelector('input[name="password"]')
    // Change this for password pre-fill value
    if (passwordBox) passwordBox.value = 'password'

    // Taken from keybinds
    const inputs = document.querySelectorAll('input.auctionbid[name="auction_ask"], input.auctionbid[name="auction_bid"]');
    let ask_match = document.querySelector("#highest_matchable_ask_price > .cardprice_sell");
    let bid_match = document.querySelector("#lowest_matchable_bid_price > .cardprice_buy");
    ask_match = ask_match ? ask_match.textContent : 0;
    bid_match = bid_match ? bid_match.textContent : 0;

    // Create a transparent div to hold buttons in the center
    const body = document.querySelector('body')
    const buttonLayer = document.createElement('div')
    buttonLayer.classList.add('layer')
    if (localStorage.getItem('buttonshow') === "true") buttonLayer.classList.add('show')
    const buttonHolderLeft = document.createElement('div')
    const buttonHolderRight = document.createElement('div')
    buttonHolderLeft.classList.add('holder', 'holder-left')
    buttonHolderRight.classList.add('holder', 'holder-right')

    // Creates buttons
    const [logout, issuesButton, deckAndPackButton,
        junkButton, bidButton, reload, createButton,
        hide, gift, manage, back, next] = ['Logout', '', '', 'Junk Card', 'Match Bids', 'Refresh', 'Create Puppet', 'Hide', 'Gift', 'Manage Puppet', 'Back', 'Next'].map((buttonText, i) => {
            let button = document.createElement('button')
            if (buttonText) button.textContent = buttonText
            button.classList.add('cs-button', `button-${i}`)
            return button
        })

    let puppetList = localStorage.getItem('puppetList')
    let dataArray = puppetList && puppetList.length > 0 ? puppetList.split('\n') : [];
    let outputDiv = document.createElement('div');
    outputDiv.classList.add('show')
    outputDiv.id = 'output'

    const modal = document.createElement('div')
    modal.classList = "modal"
    const blur = document.createElement('div')
    blur.classList = "modal-content"
    const confirm = document.createElement('button')
    confirm.textContent = 'Switching puppet'
    blur.appendChild(confirm)
    modal.appendChild(blur)
    function showModal() {
        document.querySelector('.modal').style.display = 'block';
    }

    function generateLinks(item) {
        const link = document.createElement('a');
        link.textContent = item
        link.addEventListener('click', async () => {
            const url = 'https://www.nationstates.net/?nspp-1';
            const formData = new FormData();
            formData.append('logging_in', '1');
            formData.append('nation', item);
            formData.append('password', password);
            formData.append('autologin', 'yes')
            const response = await fetch(`${url}?script=CSBMobile__by_Kractero__usedBy_${item}&userclick=${Date.now()}`, {
                method: 'POST',
                body: formData,
                headers: {
                    "User-Agent": item
                }
            })
            showModal()
            confirm.addEventListener('click', () => {
                window.location.href = response
            })
        })
        link.style.fontSize = "1rem"
        return link
    }
    dataArray.forEach((item) => {
        let link = generateLinks(item)
        outputDiv.appendChild(link);
    });
    const form = document.createElement('form')
    form.classList.add('show')
    form.classList.add('former')
    const submit = document.createElement('button')
    submit.textContent = 'Submit List'
    const input = document.createElement('textarea')
    input.classList.add('puppet-list')
    input.rows = 15
    form.append(input, submit)
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        localStorage.setItem("puppetList", input.value)
        form.classList.toggle('show')
        puppetList = localStorage.getItem('puppetList')
        dataArray = puppetList.split('\n');
        dataArray.forEach((item) => {
            let link = generateLinks(item)
            outputDiv.appendChild(link);
        });
    })

    back.addEventListener('click', () => {
        let currentPageIndex = getCurrentPageIndex()
        if (currentPageIndex === 0) return
        let puppetPageLinks = Array.from(document.querySelectorAll('#output a'))
        puppetPageLinks[currentPageIndex - 1].click()
    })

    next.addEventListener('click', () => {
        let currentPageIndex = getCurrentPageIndex()
        if (currentPageIndex === puppetList.length) return
        let puppetPageLinks = Array.from(document.querySelectorAll('#output a'))
        puppetPageLinks[currentPageIndex + 1].click()
    })

    manage.addEventListener('click', () => form.classList.toggle('show'))

    function getCurrentPageIndex() {
        if (!puppetList || puppetList.length === 0) return
        let puppetText = dataArray.map(puppet => {
            puppet = puppet.replaceAll(' ', '_').toLowerCase()
            return puppet
        })
        const tests = puppetText.filter(puppet => puppet === nation)
        const index = puppetText.indexOf(tests[0]);
        return index
    }

    hide.addEventListener('click', () => {
        buttonLayer.classList.toggle('show')
        const isButtonLayerShown = buttonLayer.classList.contains('show');
        localStorage.setItem('buttonshow', isButtonLayerShown);
    })

    hide.classList.add('special-button')

    const banner = document.getElementById('banner')
    banner.append(hide)

    logout.addEventListener('click', () => {
        document.querySelector('#panel button').click()
    })
    reload.addEventListener('click', () => {
        location.reload()
    })

    // lot from dithpri
    createButton.addEventListener('click', () => {
        const puppetCreationForm = `
<form method="POST" style="display: flex; flex-direction: column; justify-content: center;"
    action="/cgi-bin/build_nation.cgi" id="x-rces-cp-onestep-form" name="form"
    onSubmit="submitForm(form.create_nation,'<i class=\'icon-flag-1\'></i>Creating...');">
    <table>
        <tr>
            <td>
                <label for="x-rces-cp-nation-name">Nation name:</label>
            </td>
            <td>
                <input name="nation" id="x-rces-cp-nation-name" maxlength="40" type="text" value="TEST"
                    style="font-size:150%" autofocus required placeholder="Nation Name...">
            </td>
        </tr>
        <input style="display:none;" type="password" id="x-rces-cp-pass" name="password" value="${password}" required
            placeholder="Password...">
        <input style="display:none;" name="email" type="email" value="${email}" placeholder="E-mail...">
        <tr>
            <td>
                Motto:
            </td>
            <td>
                <input name="slogan" maxlength="55" type="text" value="${motto}" placeholder="Motto..." />
            </td>
        </tr>
        <tr>
            <td>
                Currency:
            </td>
            <td>
                <input name="currency" maxlength="40" type="text" value="${currency}" placeholder="currency...">
            </td>
        </tr>
        <tr>
            <td>
                National Animal:
            </td>
            <td>
                <input name="animal" maxlength="40" type="text" value="${animal}" placeholder="animal...">
            </td>
        </tr>
        <select style="display:none;" id="type" name="type" style="display: none">
            <option value="${classification}">(RANDOM)</option>
        </select>
        <select style="display:none;" id="flag" name="flag" style="display: none">
            <option selected value="${flag}">(RANDOM)</option>
        </select>
        <tr>
            <td>
                Civil/Econ/Polit freedoms
            </td>
            <td>
                <input type="text" name="style" value="${civil}.${econ}.${polit}" readonly>
            </td>
        </tr>
    </table>
    <br>
    <input type="checkbox" name="legal" value="1" id="legal" checked required="required">
    <label for="legal">I agree to the NationStates <a href="/page=legal" class="ttq" id="ttq_2">Terms &amp;
            Conditions</a>.</label>
    <br>
    <input type="hidden" name="name" id="name" value="">
    <input type="hidden" id="x-rces-cp-confirm-pass" name="confirm_password" value="" required
        placeholder="Password...">
    <input type="hidden" name="history" value="">
    <input type="hidden" name="q0" value="">
    <input type="hidden" name="q1" value="">
    <input type="hidden" name="q2" value="">
    <input type="hidden" name="q3" value="">
    <input type="hidden" name="q4" value="">
    <input type="hidden" name="q5" value="">
    <input type="hidden" name="q6" value="">
    <input type="hidden" name="q7" value="">
    <button type="submit" class="button" value="1" name="create_nation"><i class="icon-flag-1"></i> Create
        Nation</button>
    <br>
</form>
`;
        let hook = document.getElementById("content");
        if (hook) {
            hook.innerHTML = puppetCreationForm;
        } else {
            document.body.innerHTML = puppetCreationForm;
        }

        document.getElementById("x-rces-cp-onestep-form").onsubmit = function () {
            document.getElementById("name").value = document.getElementById("x-rces-cp-nation-name").value;
            document.getElementById("x-rces-cp-confirm-pass").value = document.getElementById("x-rces-cp-pass").value;
            return true;
        };
        document.getElementById("x-rces-cp-nation-name").focus();
    })

    const issueslink = document.createElement('a')
    if (window.location.href === "https://www.nationstates.net/page=dilemmas") {
        const issues = document.querySelector('.dillistnpaper')
        if (issues) {
            issueslink.href = issues.href;
            issueslink.textContent = "First Issue"
        }
    } else {
        issueslink.href = 'https://www.nationstates.net/page=dilemmas'
        issueslink.textContent = "Issues Page"
    }
    issuesButton.append(issueslink)

    if (window.location.href.includes('show_dilemma/dilemma=')) {
        const form = document.querySelector('.dilemma');
        const acceptor = document.querySelectorAll('.dilemmaaccept')
        acceptor.forEach(accept => {
            accept.style.display = 'flex'
            accept.style.justifyContent = 'center'
        })
        Array.from(form.children).forEach(child => {
            if (child.nodeName === "P" || child.nodeName === "H5") {
                child.style.display = 'none'
            }
        })
        const options = document.querySelectorAll('.diloptions li');
        Array.from(options).forEach(option => {
            Array.from(option.children).forEach(child => {
                if (!child.classList.contains('dilemmaaccept')) {
                    child.style.display = 'none'
                }
            })
        })
    }

    if (window.location.href.includes('enact_dilemma/dilemma=')) {
        const packFound = document.querySelector('#content > form')
        if (packFound) document.querySelector('#content').prepend(packFound)
    }

    const decklink = document.createElement('a')
    if (window.location.href === "https://www.nationstates.net/page=deck") {
        if (document.querySelector('.lootboxbutton')) {
            decklink.addEventListener('click', () => {
                document.querySelector('.lootboxbutton').click()
            })
            decklink.textContent = 'Open Pack'
        } else {
            decklink.href = 'https://www.nationstates.net/page=deck'
            decklink.textContent = "View Deck"
        }
    } else {
        decklink.href = 'https://www.nationstates.net/page=deck'
        decklink.textContent = "View Deck"
    }
    deckAndPackButton.append(decklink)

    let currentJunk = 0
    if (window.location.href === ("https://www.nationstates.net/page=deck") || window.location.href.includes(`/nation=${nation}/page=deck/`)) {
        junkButton.style.display = 'block'
        gift.style.display = 'block'
        if (!window.location.href.includes("card")) {
            const junks = document.querySelectorAll('.deckcard')
            junks[currentJunk].style.border = "thick solid #0000FF"
            junkButton.addEventListener('click', () => {
                junks[currentJunk].querySelector('.deckcard-junk-button').click()
                if (currentJunk === junks.length - 1) return
                currentJunk = currentJunk + 1
                junks[currentJunk].style.border = "thick solid #0000FF"
                junks[currentJunk].scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                    inline: 'center'
                });
            })
            gift.addEventListener('click', () => {
                junks[currentJunk].querySelector('.deckcard-info-cardbuttons a:last-child').click()
            })
        }
    } else {
        junkButton.style.display = 'none'
        gift.style.display = 'none'
    }

    if (window.location.href.includes('https://www.nationstates.net/page=deck/card')) {
        bidButton.style.display = 'block'
        bidButton.addEventListener('click', () => {
            if (ask_match && ask_match > 0) {
                document.querySelector('input.auctionbid[name="auction_ask"]').value = ask_match;
            }
            if (bid_match && bid_match > 0) {
                document.querySelector('input.auctionbid[name="auction_bid"]').value = bid_match;
            }
        })
    } else {
        bidButton.style.display = 'none'
    }

    buttonHolderLeft.append(createButton, logout, issuesButton, reload, manage, back, next)
    buttonHolderRight.append(deckAndPackButton, junkButton, gift, bidButton)
    buttonLayer.append(buttonHolderLeft, buttonHolderRight, form)
    body.append(modal)
    body.append(buttonLayer, outputDiv)

    document.querySelectorAll('.flipped')
        .forEach(function (element) {
            element.classList.remove('flipped');
        });

    const stylistic = document.createElement('style')
    // change gap between buttons, default button size, default button color
    const buttonGap = '4px'
    const [width, height] = ['10px', '20px']
    const color = '#212121'

    /*
        Changing individual buttons:
        button 0 = logout, button 1 = issues, button 2 = deck, button 3 = junk, button 4 = bid, button 5 = reload
        to change their color or size, find the .button-0 line and copy that and change how you would, and uncomment it
    */

    stylistic.innerHTML = `
    body {
        position: relative;
    }

    @media only screen and (max-width: 600px) {
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 9999;
          }

          .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

        .holder {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: ${buttonGap};
            flex-direction: column;
        }

        .former {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            gap: ${buttonGap};
            flex-direction: column;
            pointer-events: auto;
        }

        .special-button {
            position: fixed;
            top: 0;
            right: 0;
            z-index: 500;
        }

        .holder-left {
            left: 0;
        }

        .holder-right {
            right: 0;
        }

        .layer {
            position: fixed;
            height: 100vh;
            width: 100vw;
            top: 0;
            pointer-events: none;
        }

        .show { display: none; }

        .cs-button {
            pointer-events: auto;
            padding: ${width} ${height};
            border: unset;
            border-radius: 10px;
            color: ${color};
            z-index: 100;
            background: #e8e8e8;
            font-weight: 1000;
            font-size: 12px;
            transition: all 250ms;
            overflow: hidden;
        }

        .cs-button:hover,
        .cs-button:active {
           opacity: 0.85;
         }

        /*.button-0 {
            background: red;
            padding: 15px 25px;
        }
        */

        @media only screen and (min-width: 600px) {
            .cs-button {
                display: none;
            }
        }
    }
    `
    document.getElementsByTagName("head")[0].appendChild(stylistic);
})();
// ==UserScript==
// @name         CSB/mobile test
// @version      1.0
// @description  try to take over the world!
// @author       Kractero
// @match        https://*.nationstates.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nationstates.net
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'

  if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return

  let nation = document.querySelector('#loggedin').getAttribute('data-nname')

  const body = document.querySelector('body')
  const buttonLayer = document.createElement('div')
  buttonLayer.classList.add('layer')
  if (localStorage.getItem('buttonshow') === 'true') buttonLayer.classList.add('show')

  const buttonHolderLeft = document.createElement('div')
  buttonHolderLeft.classList.add('holder', 'holder-left')

  const [issuesButton, hide, manage, back, next] = ['','Hide','Manage Puppet','Back','Next'].map((text, i) => {
    const button = document.createElement('button');
    if (text) button.textContent = text;
    button.classList.add('cs-button', `button-${i}`);
    return button;
  });

  let puppetList = localStorage.getItem('nationList') || '';
  let dataArray = puppetList.split('\n').filter(Boolean);
  const outputDiv = document.createElement('div');
  outputDiv.classList.add('puppetList', 'former', 'show');

  const modal = document.createElement('div')
  modal.classList = 'modal'
  const blur = document.createElement('div')
  blur.classList = 'modal-content'
  const confirm = document.createElement('button')
  confirm.textContent = 'Switching puppet'
  blur.appendChild(confirm)
  modal.appendChild(blur)

  function showModal() {
    document.querySelector('.modal').style.display = 'block'
  }

  function generateLinks(item) {
    const link = document.createElement('a')
    link.textContent = item
    link.addEventListener('click', async () => {
      const url = 'https://www.nationstates.net/?nspp-1'
      const formData = new FormData()
      formData.append('logging_in', '1')
      formData.append('nation', item)
      formData.append('password', localStorage.getItem('puppetPassword'))
      formData.append('autologin', 'yes')
      const response = await fetch(`${url}?script=CSBMobile__by_Kractero__usedBy_${item}&userclick=${Date.now()}`, {
        method: 'POST',
        body: formData,
        headers: {
          'User-Agent': item,
        },
      })
      showModal()
      confirm.addEventListener('click', () => {
        window.location.href = response
      })
    })
    link.style.fontSize = '1rem'
    return link
  }

  dataArray.forEach(item => {
    let link = generateLinks(item)
    outputDiv.appendChild(link)
  })

  const form = document.createElement('form');
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.required = true;
  passwordInput.value = localStorage.getItem('puppetPassword');

  const submit = document.createElement('button');
  submit.textContent = 'Submit List';
  const input = document.createElement('textarea');
  input.classList.add('puppet-list');
  input.rows = 15;
  input.value = puppetList;

  form.append(input, passwordInput, submit)
  form.addEventListener('submit', e => {
    e.preventDefault()
    localStorage.setItem('nationList', input.value)
    puppetList = localStorage.getItem('nationList')
    dataArray = puppetList.split('\n')
    dataArray.forEach(item => {
      let link = generateLinks(item)
      outputDiv.appendChild(link)
    })
    const password = passwordInput.value;
    localStorage.setItem('puppetPassword', password)
    outputDiv.classList.toggle('show')
    form.classList.toggle('show')
  })
  form.classList.add('former', 'show')

  const editButton = document.createElement('button')
  editButton.textContent = 'Edit Storage'
  editButton.addEventListener('click', () => {
    outputDiv.classList.toggle('show')
    form.classList.toggle('show')
  })

  outputDiv.prepend(editButton)

  back.addEventListener('click', () => {
    const currentPageIndex = getCurrentPageIndex();
    if (currentPageIndex > 0) {
      document.querySelectorAll('.puppetList a')[currentPageIndex - 1].click();
    }
  });

  next.addEventListener('click', () => {
    const currentPageIndex = getCurrentPageIndex();
    if (currentPageIndex < puppetList.length) {
      document.querySelectorAll('.puppetList a')[currentPageIndex + 1].click();
    }
  });

  manage.addEventListener('click', () => {
    if (!outputDiv.classList.contains('show') || !form.classList.contains('show')) {
      outputDiv.classList.add('show');
      form.classList.add('show');
    } else {
      outputDiv.classList.toggle('show');
    }
  });

  function getCurrentPageIndex() {
    if (!puppetList || puppetList.length === 0) return
    let puppetText = dataArray.map(puppet => {
      puppet = puppet.replaceAll(' ', '_').toLowerCase()
      return puppet
    })
    const tests = puppetText.filter(puppet => puppet === nation)
    const index = puppetText.indexOf(tests[0])
    return index
  }

  hide.addEventListener('click', () => {
    buttonLayer.classList.toggle('show')
    const isButtonLayerShown = buttonLayer.classList.contains('show')
    localStorage.setItem('buttonshow', isButtonLayerShown)
  })

  hide.classList.add('special-button')

  const banner = document.getElementById('banner')
  banner.append(hide)

  const issueslink = document.createElement('a')
  if (window.location.href === 'https://www.nationstates.net/page=dilemmas') {
    const issues = document.querySelector('.dillistnpaper')
    if (issues) {
      issueslink.href = issues.href
      issueslink.textContent = 'First Issue'
    }
  } else {
    issueslink.href = 'https://www.nationstates.net/page=dilemmas'
    issueslink.textContent = 'Issues Page'
  }
  issuesButton.append(issueslink)

  if (window.location.href.includes('show_dilemma/dilemma=')) {
    const form = document.querySelector('.dilemma')
    const acceptor = document.querySelectorAll('.dilemmaaccept')
    acceptor.forEach(accept => {
      accept.style.display = 'flex'
      accept.style.justifyContent = 'center'
    })
    Array.from(form.children).forEach(child => {
      if (child.nodeName === 'P' || child.nodeName === 'H5') {
        child.style.display = 'none'
      }
    })
    const options = document.querySelectorAll('.diloptions li')
    Array.from(options).forEach(option => {
      Array.from(option.children).forEach(child => {
        if (!child.classList.contains('dilemmaaccept')) {
          child.style.display = 'none'
        }
      })
    })
  }

  buttonHolderLeft.append(issuesButton, manage, back, next)
  buttonLayer.append(buttonHolderLeft, form, outputDiv)
  body.append(modal)
  body.append(buttonLayer)

  document.querySelectorAll('.flipped').forEach(function (element) {
    element.classList.remove('flipped')
  })

  const stylistic = document.createElement('style')
  const buttonGap = '4px'
  const [width, height] = ['10px', '20px']
  const color = '#212121'

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

          .puppetList {
            display: none;
            padding: 1rem;
            flex-direction: column;
            align-items: center;
            position: absolute;
            overflow-y: scroll;
            right: 0;
            height: 50%;
            background: #e8e8e8;
            text-align: center;
            color: black;
          }

          .puppetList a {
            margin-top: 3px;
          }

        .holder {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: ${buttonGap};
            flex-direction: column;
            left: 0;
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


        @media only screen and (min-width: 600px) {
            .cs-button {
                display: none;
            }
        }
    }
    `
  document.getElementsByTagName('head')[0].appendChild(stylistic)
})()

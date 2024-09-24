// ==UserScript==
// @name         Puppet Switcher
// @version      1.0
// @description  Switch puppets
// @author       Kractero
// @match        https://www.nationstates.net/*
// @downloadUrl  https://github.com/Kractero/userscripts/raw/master/puppetSwitcher.user.js
// @require      https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'

  const currentNation = document.querySelector('#loggedin').getAttribute('data-nname')
  localStorage.setItem('currNation', currentNation)

  let itemsPerPage = localStorage.getItem('perPage') ? parseInt(localStorage.getItem('perPage')) : 25
  let list = localStorage.getItem('nationList') ? localStorage.getItem('nationList').split('\n') : []
  const totalPages = Math.ceil(list.length / itemsPerPage)
  let currentPage = localStorage.getItem('page') || 1

  const tab = createTab()
  const form = createForm()
  const outputDiv = createOutputDiv()
  const buttonHolder = createButtonHolder()
  const perPageInput = createPerPageInput()

  const header = document.querySelector('.belspacermain') || document.querySelector('#banner')
  header.style.position = 'relative'
  header.appendChild(tab)

  const tabs = createTabsContainer()
  tabs.append(form, perPageInput, createEditButton(), buttonHolder, outputDiv)
  tab.appendChild(tabs)

  form.addEventListener('submit', saveData)
  perPageInput.addEventListener('input', handlePerPageChange)

  displayItems()

  function createTab() {
    const tab = document.createElement('div')
    const nsHeaderText = document.createElement('a')
    nsHeaderText.textContent = 'Puppets'
    tab.appendChild(nsHeaderText)

    tab.addEventListener('mouseover', () => {
      tabs.style.display = 'flex'
    })
    tab.addEventListener('mouseleave', () => {
      tabs.style.display = 'none'
    })

    if (!document.querySelector('.belspacermain')) {
      tab.style.right = '120px'
      tab.id = 'logoutbox'
    } else {
      tab.classList.add('bel')
    }

    return tab
  }

  function createForm() {
    const form = document.createElement('form')
    form.style.display = list.length ? 'none' : 'flex'
    form.style.flexDirection = 'column'
    form.style.alignItems = 'center'
    form.style.marginBottom = '1rem'

    const textarea = document.createElement('textarea')
    textarea.id = 'inputData'
    textarea.required = true
    textarea.rows = '15'

    const passwordInput = document.createElement('input')
    passwordInput.id = 'password'
    passwordInput.required = true

    const submitButton = document.createElement('button')
    submitButton.textContent = 'Submit'
    submitButton.style.width = '50%'

    form.append(textarea, passwordInput, submitButton)
    return form
  }

  function createOutputDiv() {
    const outputDiv = document.createElement('div')
    outputDiv.id = 'output'
    outputDiv.style.display = 'flex'
    outputDiv.style.flexDirection = 'column'
    outputDiv.style.marginBottom = '1rem'
    outputDiv.style.gap = '0.25rem'

    list.forEach(item => {
      const link = generateLinks(item)
      outputDiv.appendChild(link)
    })

    return outputDiv
  }

  function createButtonHolder() {
    const buttonHolder = document.createElement('div')

    const previousButton = document.createElement('button')
    previousButton.textContent = 'Previous'
    previousButton.addEventListener('click', goToPreviousPage)

    const nextButton = document.createElement('button')
    nextButton.textContent = 'Next'
    nextButton.addEventListener('click', goToNextPage)

    buttonHolder.append(previousButton, nextButton)
    return buttonHolder
  }

  function createTabsContainer() {
    const tabs = document.createElement('div')
    tabs.classList.add('former')
    tabs.style.display = 'none'
    tabs.style.flexDirection = 'column'
    tabs.style.alignItems = 'center'
    tabs.style.position = 'absolute'
    tabs.style.overflow = 'scroll'
    tabs.style.right = '0'
    tabs.style.width = '300px'
    tabs.id = 'loginbox'

    return tabs
  }

  function createPerPageInput() {
    const perPageInput = document.createElement('input')
    perPageInput.style.width = '50px'
    perPageInput.placeholder = itemsPerPage
    return perPageInput
  }

  function createEditButton() {
    const editButton = document.createElement('button')
    editButton.textContent = 'Edit Storage'
    editButton.addEventListener('click', () => {
      form.style.display = 'flex'
      document.getElementById('inputData').value = localStorage.getItem('nationList')
      document.getElementById('password').value = localStorage.getItem('puppetPassword')
      outputDiv.innerHTML = ''
    })
    return editButton
  }

  function handlePerPageChange(e) {
    itemsPerPage = parseInt(e.target.value)
    localStorage.setItem('perPage', itemsPerPage)
    displayItems()
  }

  function generateLinks(nation) {
    const link = document.createElement('a')
    link.textContent = nation
    link.style.fontSize = '1rem'
    link.addEventListener('click', () => switchNation(nation))
    return link
  }

  async function switchNation(nation) {
    const url = 'https://www.nationstates.net/?nspp-1'
    const formData = new FormData()
    formData.append('logging_in', '1')
    formData.append('nation', nation)
    formData.append('password', localStorage.getItem('puppetPassword'))
    formData.append('autologin', 'yes')

    const response = await fetch(
      `${url}?script=PuppetSwitcher__by_Kractero__usedBy_${nation}&userclick=${Date.now()}`,
      {
        method: 'POST',
        body: formData,
      }
    )

    window.location.href = response.url
  }

  async function saveData(event) {
    event.preventDefault()
    const inputData = document.getElementById('inputData').value
    const password = document.getElementById('password').value

    localStorage.setItem('nationList', inputData)
    localStorage.setItem('puppetPassword', password)

    list = inputData.split('\n')
    form.style.display = 'none'
    displayItems()
  }

  function displayItems() {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const fragment = document.createDocumentFragment()

    list.slice(startIndex, endIndex).forEach(item => {
      const link = generateLinks(item)
      fragment.appendChild(link)
    })

    outputDiv.innerHTML = ''
    outputDiv.appendChild(fragment)
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      currentPage--
      localStorage.setItem('page', currentPage)
      displayItems()
    }
  }

  function goToNextPage() {
    if (currentPage < totalPages) {
      currentPage++
      localStorage.setItem('page', currentPage)
      displayItems()
    }
  }

  hotkeys.filter = function (event) {
    var target = event.target || event.srcElement
    var tagName = target.tagName
    return !(
      target.isContentEditable ||
      tagName == 'BUTTON' ||
      tagName == 'INPUT' ||
      tagName == 'SELECT' ||
      tagName == 'TEXTAREA'
    )
  }

  hotkeys('enter', event => {
    if (window.location.href.includes('upload_flag') || window.location.href.includes('card')) return
    event.preventDefault()
    const lootboxButton = document.querySelector('.lootboxbutton')
    if (lootboxButton) {
      lootboxButton.click()
    } else {
      if (!window.location.href.includes('dilemmas'))
        window.location.href = 'https://www.nationstates.net/page=dilemmas'
      if (window.location.href.includes('dilemmas')) {
        const issues = document.querySelectorAll('.dillistnpaper')
        if (issues.length > 0) window.location.href = issues[0].getAttribute('href')
      }
    }
  })

  hotkeys('shift+;', event => {
    event.preventDefault()
    navigatePuppets(-1)
  })

  hotkeys(';', event => {
    event.preventDefault()
    navigatePuppets(1)
  })

  function navigatePuppets(direction) {
    const currentPageIndex = getCurrentPageIndex()
    if ((direction === 1 && currentPageIndex === 24) || (direction === -1 && currentPageIndex === 0)) {
      direction === 1 ? goToNextPage() : goToPreviousPage()
      const puppetLinks = Array.from(document.querySelectorAll('#output a'))
      puppetLinks[0].click()
    } else {
      const puppetLinks = Array.from(document.querySelectorAll('#output a'))
      puppetLinks[currentPageIndex + direction].click()
    }
  }

  function getCurrentPageIndex() {
    const puppetPageLinks = Array.from(document.querySelectorAll('#output a'))
    const puppetText = puppetPageLinks.map(puppet => puppet.textContent.replaceAll(' ', '_').toLowerCase())
    const currentPuppet = puppetText.indexOf(localStorage.getItem('currNation'))
    return currentPuppet >= 0 ? currentPuppet : 0
  }
})()

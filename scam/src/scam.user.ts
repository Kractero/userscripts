// ==UserScript==
// @name        Some Card Assistant Manager
// @match       https://*.nationstates.net/*
// @grant       GM.setValue
// @grant       GM.getValue
// @version     1.03
// @author      Kractero
// @description Some Card Assistant Manager
// ==/UserScript==

;(async function () {
  const loggedin = document.getElementById('loggedin')
  if (!loggedin?.dataset.nname) return
  const links = `
    <div class="bel">
      <div class="belcontent scam">
        <a href="/page=blank/scam" class="bellink"><i class="icon-industrial-building"></i>PUPPETS</a>
      </div>
    </div>
    <div class="bel">
      <div class="belcontent">
        <button id="prev-puppet" class="bellink linkys">PREV</button>
      </div>
    </div>
    <div class="bel">
      <div class="belcontent">
        <button id="next-puppet" class="bellink linkys">NEXT</button>
      </div>
    </div>
  `

  const spacer = document.querySelector('#loginswitcher')
  if (spacer) spacer.insertAdjacentHTML('beforebegin', links)

  let currentIndex = -1

  async function getPuppetData() {
    const savedList: Record<string, string[]> = (await GM.getValue('puppetList', {})) || {}
    const mainNation = (await GM.getValue('mainNation', '')) || ''
    const mainPassword = (await GM.getValue('mainPassword', '')) || ''
    let activeGroup = (await GM.getValue('activeGroup', '')) || ''
    if (!activeGroup || !(activeGroup in savedList)) {
      activeGroup = Object.keys(savedList)[0] || ''
    }
    const nationPasswordMap = new Map()
    const puppetNations: Array<string> = []

    if (activeGroup && savedList[activeGroup]) {
      savedList[activeGroup]?.forEach(line => {
        const parts = line.split(',').map(s => s.trim())
        const nation = parts[0] ? canonicalize(parts[0]) : ''
        if (parts[1]) nationPasswordMap.set(nation, parts[1])
        if (nation) puppetNations.push(nation)
      })
    }

    return { savedList, puppetNations, nationPasswordMap, mainPassword, activeGroup, mainNation }
  }

  async function login(nation: string, password: string, mainNation: string) {
    if (!nation) return
    const loginbox = document.getElementById('loginbox') as HTMLElement
    const loginForm = loginbox.querySelector('form') as HTMLFormElement
    if (window.location.pathname === '/page=blank/scam') {
      loginForm.action = `${window.location.href}?generated_by=SomeCardAssistantManager__author_main_nation_Kractero__usedBy_${mainNation}`
    } else {
      loginForm.action = `${loginForm.action}?generated_by=SomeCardAssistantManager__author_main_nation_Kractero__usedBy_${mainNation}`
    }
    const nationInput = loginForm.querySelector('input[name="nation"]') as HTMLInputElement
    nationInput.value = nation ? nation : ''
    const passwordInput = loginForm.querySelector('input[name="password"]') as HTMLInputElement
    passwordInput.value = password
    HTMLFormElement.prototype.submit.call(loginForm)
  }

  async function loginAtIndex(index: number) {
    const { puppetNations, nationPasswordMap, mainPassword, mainNation } = await getPuppetData()
    if (puppetNations.length === 0) return

    if (index < 0) index = puppetNations.length - 1
    if (index >= puppetNations.length) index = 0
    currentIndex = index

    const nation = puppetNations[index]
    let password = nationPasswordMap.get(nation) || mainPassword || ''
    if (!nation || !password) return

    await login(nation, password, mainNation)
  }

  const prevPuppetBtn = document.getElementById('prev-puppet')
  const nextPuppetBtn = document.getElementById('next-puppet')

  if (prevPuppetBtn) {
    const onPrevClick = async (e: Event) => {
      e.preventDefault()
      prevPuppetBtn.removeEventListener('click', onPrevClick)

      const { puppetNations } = await getPuppetData()
      if (puppetNations.length === 0) return

      if (currentIndex === -1) {
        const loggedin = document.getElementById('loggedin')
        const loggedinNation = loggedin?.dataset?.nname ? canonicalize(loggedin.dataset.nname) : ''
        currentIndex = puppetNations.indexOf(loggedinNation)
        if (currentIndex === -1) currentIndex = 0
      }

      await loginAtIndex(currentIndex - 1)
    }

    prevPuppetBtn.addEventListener('click', onPrevClick)
  }

  if (nextPuppetBtn) {
    const onNextClick = async (e: Event) => {
      e.preventDefault()
      nextPuppetBtn.removeEventListener('click', onNextClick)

      const { puppetNations } = await getPuppetData()
      if (puppetNations.length === 0) return

      if (currentIndex === -1) {
        const loggedin = document.getElementById('loggedin')
        const loggedinNation = loggedin?.dataset?.nname ? canonicalize(loggedin.dataset.nname) : ''
        currentIndex = puppetNations.indexOf(loggedinNation)
      }
      await loginAtIndex(currentIndex + 1)
    }

    nextPuppetBtn.addEventListener('click', onNextClick)
  }

  const scam = document.querySelector('.scam')

  if (scam) {
    const { puppetNations } = await getPuppetData()
    const itemsPerPage = 25
    const totalPages = Math.ceil(puppetNations.length / itemsPerPage)
    let currentPage = await GM.getValue('page', 1)

    const outputDiv = document.createElement('div')
    const loginbox = document.getElementById('loginbox') as HTMLElement

    outputDiv.id = 'outputDiv'
    outputDiv.style.color = 'inherit'
    outputDiv.style.display = 'none'
    outputDiv.style.flexDirection = 'column'
    outputDiv.style.alignItems = 'center'
    outputDiv.style.position = 'absolute'
    outputDiv.style.overflow = 'scroll'
    outputDiv.style.minWidth = '300px'
    outputDiv.style.padding = '9px'
    outputDiv.style.textAlign = 'center'
    outputDiv.style.borderRadius = '8px'
    outputDiv.style.background = 'black'
    outputDiv.style.color = 'white'
    outputDiv.style.right = '6px'
    outputDiv.style.zIndex = '100'
    outputDiv.style.textShadow = 'none'
    outputDiv.style.boxShadow = '0 0 12px black'

    const navDiv = document.createElement('div')
    navDiv.id = 'navDiv'
    navDiv.style.display = 'flex'
    navDiv.style.justifyContent = 'space-between'
    navDiv.style.width = '100%'
    navDiv.style.marginBottom = '0.5rem'

    const prevBtn = document.createElement('button')
    prevBtn.textContent = 'Prev'

    const nextBtn = document.createElement('button')
    nextBtn.textContent = 'Next'

    navDiv.appendChild(prevBtn)
    navDiv.appendChild(nextBtn)
    outputDiv.appendChild(navDiv)

    const nationsContainer = document.createElement('div')
    nationsContainer.style.display = 'flex'
    nationsContainer.style.flexDirection = 'column'
    nationsContainer.style.alignItems = 'center'
    nationsContainer.style.gap = '0.25rem'
    outputDiv.appendChild(nationsContainer)

    function renderPage(page: number) {
      nationsContainer.innerHTML = ''

      const start = (page - 1) * itemsPerPage
      const end = Math.min(start + itemsPerPage, puppetNations.length)
      for (let i = start; i < end; i++) {
        const nation = puppetNations[i]
        if (!nation) break
        const btn = document.createElement('button')
        btn.dataset.nation = nation
        btn.textContent = nation
        btn.className = 'linky'

        const onClick = async (e: Event) => {
          e.preventDefault()
          btn.removeEventListener('click', onClick)
          if (puppetNations.length === 0) return
          currentIndex = puppetNations.indexOf(nation)
          if (currentIndex === -1) currentIndex = 0

          await loginAtIndex(currentIndex)
        }

        btn.addEventListener('click', onClick)
        nationsContainer.appendChild(btn)
      }

      GM.setValue('page', page)
    }

    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--
        renderPage(currentPage)
      }
    })

    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++
        renderPage(currentPage)
      }
    })

    renderPage(currentPage)

    scam.appendChild(outputDiv)

    let isOverScam = false
    let isOverOutput = false

    scam.addEventListener('mouseenter', () => {
      isOverScam = true
      outputDiv.style.display = 'flex'
    })

    scam.addEventListener('mouseleave', () => {
      isOverScam = false
      if (!isOverOutput) {
        outputDiv.style.display = 'none'
      }
    })

    outputDiv.addEventListener('mouseenter', () => {
      isOverOutput = true
      outputDiv.style.display = 'flex'
    })

    outputDiv.addEventListener('mouseleave', () => {
      isOverOutput = false
      if (!isOverScam) {
        outputDiv.style.display = 'none'
      }
    })
  }

  const popoutCSS = `
    #navDiv button {
      padding: 0.25rem 0.25rem;
      margin: 0.25rem 0.25rem;
      width: max-content;
      cursor: pointer;
    }

    .linky {
      all: unset;
      cursor: pointer;
      color: inherit;
      text-decoration: none;
      font-weight: normal;
      transition: color 0.3s ease;
      margin: 3px;
    }

    .linky:hover {
      color: green;
    }
  `

  const styleTag = document.createElement('style')
  styleTag.textContent = popoutCSS
  document.head.appendChild(styleTag)

  if (window.location.pathname === '/page=blank/scam') {
    const { nationPasswordMap } = await getPuppetData()

    const section = document.createElement('main')
    section.className = 'scs-container'
    section.innerHTML = `
      <h2>SCS Puppet Manager</h2>
      <button id="toggleForm">Hide Form</button>
      <div class="scs-form" id="puppetForm">
        <label for="domain">Domain:</label>
        <select id="domain" name="domain">
          <option value="www">www</option>
          <option value="fast">fast</option>
        </select>

        <label for="mainNation">Main Nation:</label>
        <input type="text" id="mainNation" name="mainNation" />

        <label for="mainPassword">Puppet Password:</label>
        <input type="password" id="mainPassword" name="mainPassword" />
        <label for="puppetList">Puppet names:</label>
        <textarea id="puppetList" rows="10" class="scs-textarea" placeholder="nation one\nnation two\nnation three"></textarea>
        <button id="generate">Generate</button>
      </div>
      <div id="scam"></div>
    `

    const content = document.getElementById('content')!
    if (content) content.append(section)

    const form = document.getElementById('puppetForm') as HTMLFormElement
    const toggleFormBtn = document.getElementById('toggleForm') as HTMLButtonElement

    const formHidden = await GM.getValue('formHidden', false)
    toggleFormBtn.addEventListener('click', async () => {
      const hidden = form.style.display === 'none'
      form.style.display = hidden ? 'flex' : 'none'
      toggleFormBtn.textContent = hidden ? 'Hide Form' : 'Show Form'
      await GM.setValue('formHidden', !hidden)
    })

    if (formHidden) {
      form.style.display = 'none'
      toggleFormBtn.textContent = 'Show Form'
    }

    /**
     * Misleading name that doesn't actually generate tables but prepares the table for generation.
     * Updates the puppet list and updates the global nation to password mapping.
     *
     * @param {boolean} load - If true (meant for first loads), false meant for re-generating in place
     * @returns {Promise<Record<string, string[]>>} Parsed puppet groups
     */
    async function generateTable(load: boolean) {
      const puppetListTextarea = document.getElementById('puppetList') as HTMLTextAreaElement

      let puppetGroups: Record<string, string[]> = {}

      if (load) {
        const savedGroupsJson = await GM.getValue('puppetGroups', '')

        if (savedGroupsJson) {
          try {
            puppetGroups = JSON.parse(savedGroupsJson)

            let text = ''
            for (const groupName of Object.keys(puppetGroups)) {
              text += `[${groupName}]\n`
              text += puppetGroups[groupName]?.join('\n') + '\n'
            }
            puppetListTextarea.value = text.trim()
          } catch (error) {
            puppetGroups = parsePuppetGroups(puppetListTextarea.value)
          }
        } else {
          puppetGroups = parsePuppetGroups(puppetListTextarea.value)
        }
      } else {
        puppetGroups = parsePuppetGroups(puppetListTextarea.value)
        await GM.setValue('puppetGroups', JSON.stringify(puppetGroups))
      }

      nationPasswordMap.clear()

      for (const group in puppetGroups) {
        puppetGroups[group]?.forEach(line => {
          const [nationPart, passwordPart] = line.split(',').map(s => s.trim())
          if (passwordPart) {
            nationPasswordMap.set(nationPart ? canonicalize(nationPart) : '', passwordPart)
          }
        })
      }

      if (Object.keys(puppetGroups).length > 0) {
        buildTable(puppetGroups)
        return puppetGroups
      }
    }

    generateTable(true)

    const mainNation = await GM.getValue('mainNation', '')
    const nationInput = document.getElementById('mainNation') as HTMLInputElement
    nationInput.value = mainNation

    const mainPassword = await GM.getValue('mainPassword', '')
    const passwordInput = document.getElementById('mainPassword') as HTMLInputElement
    passwordInput.value = mainPassword

    const generateButton = document.getElementById('generate') as HTMLButtonElement
    generateButton.addEventListener('click', async () => {
      const puppets = await generateTable(false)

      await GM.setValue('puppetList', puppets)
      await GM.setValue('mainNation', nationInput.value.trim())
      await GM.setValue('mainPassword', passwordInput.value.trim())
    })

    async function buildTable(puppetGroups: any) {
      const { activeGroup: storedActiveGroup, mainNation } = await getPuppetData()
      if (!mainNation) {
        alert('Provide Main')
        return
      }
      const groupNames = Object.keys(puppetGroups)
      let sections = ``
      let puppetList: string[] = []

      let activeGroup =
        storedActiveGroup && groupNames.includes(storedActiveGroup) ? storedActiveGroup : groupNames[0] || ''

      groupNames.forEach(groupName => {
        const isActive = groupName === activeGroup
        sections += `<button data-group="${groupName}" class="${isActive ? 'active' : ''}">${groupName}</button>`
      })

      puppetList = activeGroup ? puppetGroups[activeGroup] : []

      let content = `<div id="holder" class="holder">
        <div id="sections">
            ${sections}
          </div>
          <div class="fittingName">
            <input type="text" id="puppetSearch" placeholder="Search puppets...">
            <table border="1" cellspacing="0" cellpadding="5">\n
              <thead>
                <tr>
                  <th>#</th><th>Nation</th><th>Deck</th><th>Value Deck</th><th>Login</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
      `
      content += `</tbody></table>`

      const scamDiv = document.getElementById('scam') as HTMLDivElement
      scamDiv.innerHTML = `
          <div>
            <button id="prevBtn">Prev</button>
            <button id="nextBtn">Next</button>
          </div>
          ${content}
        `

      const sectionsDiv = document.getElementById('sections') as HTMLDivElement

      const domain = (document.getElementById('domain') as HTMLSelectElement).value || 'www'
      const tbody = document.querySelector('tbody') as HTMLTableSectionElement
      function renderRows(puppetList: string[]) {
        puppetList = puppetList.filter(puppet => !puppet.includes('['))
        tbody.innerHTML = ''
        puppetList.forEach((name, i) => {
          const nation = name.includes(',') ? canonicalize(name.split(',')[0] || '') : canonicalize(name)
          const base = `https://${domain}.nationstates.net/container=${nation}/nation=${nation}`
          const row = `
          <tr data-nation="${nation}">
            <td>${i + 1}</td>
            <td><a href="${base}?generated_by=SomeCardAssistantManager__author_main_nation_Kractero__usedBy_${mainNation}" target="_blank">${nation}</a></td>
            <td><a href="${base}/page=deck?generated_by=SomeCardAssistantManager__author_main_nation_Kractero__usedBy_${mainNation}" target="_blank">Deck</a></td>
            <td><a href="${base}/page=deck/value_deck=1?generated_by=SomeCardAssistantManager__author_main_nation_Kractero__usedBy_${mainNation}" target="_blank">Value Deck</a></td>
            <td><button class="login-button" data-nation="${nation}">Login</button></td>
          </tr>`
          tbody.insertAdjacentHTML('beforeend', row)
        })
        const loggedin = document.getElementById('loggedin')
        const loggedinNation = loggedin?.dataset?.nname ? canonicalize(loggedin.dataset.nname) : ''

        const rows: Array<HTMLElement> = Array.from(scamDiv.querySelectorAll('tbody tr'))
        rows.forEach((row, idx) => {
          if (row.dataset.nation === loggedinNation) {
            row.classList.add('highlight')
            currentIndex = idx
          } else row.classList.remove('highlight')
        })

        scamDiv.addEventListener('click', async event => {
          const target = event.target as HTMLElement
          if (target.matches('.login-button')) {
            const allButtons = scamDiv.querySelectorAll('.login-button')
            allButtons.forEach(btn => ((btn as HTMLButtonElement).disabled = true))
            const nation = target.dataset.nation || ''
            let password = mainPassword
            if (!password) password = nationPasswordMap.get(nation)
            try {
              await login(nation, password, mainNation)
            } finally {
              allButtons.forEach(btn => ((btn as HTMLButtonElement).disabled = false))
            }
          }
        })

        const prevButton = document.getElementById('prevBtn') as HTMLButtonElement
        const nextButton = document.getElementById('nextBtn') as HTMLButtonElement

        function onPrevClick() {
          if (rows.length === 0) return
          currentIndex = currentIndex <= 0 ? rows.length - 1 : currentIndex - 1
          const button = rows[currentIndex]?.querySelector('.login-button') as HTMLButtonElement
          if (button) button.click()
          prevButton.removeEventListener('click', onPrevClick)
        }

        function onNextClick() {
          if (rows.length === 0) return
          currentIndex = (currentIndex + 1) % rows.length
          const button = rows[currentIndex]?.querySelector('.login-button') as HTMLButtonElement
          if (button) button.click()
          nextButton.removeEventListener('click', onNextClick)
        }

        prevButton.addEventListener('click', onPrevClick)
        nextButton.addEventListener('click', onNextClick)

        const searchBox = document.getElementById('puppetSearch') as HTMLInputElement

        searchBox.addEventListener('input', () => filterRows(searchBox, rows))
      }

      renderRows(puppetList)

      sectionsDiv.addEventListener('click', async e => {
        const button = e.target as HTMLElement
        if (button.tagName === 'BUTTON' && button.dataset.group) {
          sectionsDiv.querySelectorAll('button').forEach(b => b.classList.remove('active'))
          button.classList.add('active')
          activeGroup = button.dataset.group
          await GM.setValue('activeGroup', activeGroup)
          currentIndex = -1
          const searchBox = document.getElementById('puppetSearch') as HTMLInputElement
          if (searchBox) searchBox.value = ''
          renderRows(puppetGroups[activeGroup])
        }
      })
    }

    const css = `
      .scs-container {
        margin-top: 1rem;
        padding: 0.5rem;
        border: 1px solid;
        border-radius: 8px;
        max-width: 1000px;
      }

      .scs-container h2 {
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }

      .scs-form {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .scs-container input,
      .scs-container textarea,
      .scs-container select {
        width: 100%;
        max-width: 600px;
        padding: 0.6rem 0.8rem;
        font-size: 1rem;
        resize: vertical;
      }

      .scs-container input:focus,
      .scs-container textarea:focus {
        box-shadow: 0 0 4px rgba(26, 115, 232, 0.4);
        outline: none;
      }

      .scs-container button {
        padding: 0.5rem 0.5rem;
        margin: 0.25rem 0.25rem;
        width: max-content;
        cursor: pointer;
      }

      #holder {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
      }

      #sections {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        padding: 0.5em;
        margin-bottom: 1em;
        min-width: 150px;
        border-right: 1px solid #ccc;
      }

      #sections button {
        width: 100%;
        background: none;
        border: none;
        padding: 0.6em 1em;
        text-align: left;
        font-size: 0.95em;
        cursor: pointer;
        border-left: 4px solid transparent;
        border-radius: 0 4px 4px 0;
      }

      #sections button:hover {
        background-color: #32006e;
        color: white;
      }

      #sections button.active {
        background-color: #4b2e83;
        color: #c5b4e3;
        border-left-color: #c5b4e3;
        font-weight: 600;
      }

      #scam {
        margin-top: 2rem;
        overflow-x: auto;
        flex: 1;
        min-width: 0;
      }

      #scam table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 6px;
        overflow: hidden;
        font-size: 0.9rem;
      }

      #scam th,
      #scam td {
        padding: 0.6rem 0.8rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      .login-button {
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      #scam div {
        margin-bottom: 1rem;
      }

      #scam tbody tr.highlight {
        background-color: darkslateblue;
      }

      .fittingName {
        flex: 1;
      }

      #puppetSearch {
        margin-bottom: 1rem;
        width: 100%;
      }

      .linkys {
        all: unset;
      }
    `

    const styleTag = document.createElement('style')
    styleTag.textContent = css
    document.head.appendChild(styleTag)
  }
})()

function canonicalize(str: string) {
  return str.trim().toLowerCase().replaceAll(' ', '_')
}

function filterRows(searchBox: HTMLInputElement, rows: HTMLElement[]) {
  const value = canonicalize(searchBox.value)
  rows.forEach(row => {
    const name = canonicalize(row.dataset.nation || '')
    row.style.display = name.includes(value) ? '' : 'none'
  })
}

/**
 * Parses puppet groups from the provided puppets, groups defined by [GROUPNAME]
 *
 * @param {string} text - Raw text with entries.
 * @returns {Record<string, string[]>} An object that maps group names to associated puppets.
 */
function parsePuppetGroups(text: string): Record<string, string[]> {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)

  const groups: Record<string, string[]> = {}
  let currentGroup = 'Group 1'
  let groupCount = 1

  for (const line of lines) {
    const match = line.match(/^\[(.+?)\]$/)
    if (match) {
      currentGroup = match[1]?.trim() || `Group ${++groupCount}`
      if (!groups[currentGroup]) groups[currentGroup] = []
    } else {
      if (!groups[currentGroup]) groups[currentGroup] = []
      groups[currentGroup]?.push(line)
    }
  }

  return groups
}

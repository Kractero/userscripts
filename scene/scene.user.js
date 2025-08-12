"use strict";
// ==UserScript==
// @name        Scene
// @match       https://*.nationstates.net/*
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM_addStyle
// @grant       GM_addValueChangeListener
// @version     1.0
// @author      Kractero
// @description Puppet manager with groups I guess
// ==/UserScript==
;
(async function () {
    const loggedin = document.getElementById('loggedin');
    if (!loggedin?.dataset.nname)
        return;
    let itemsPerPage = await GM.getValue('itemsPerPage', 25);
    let puppetNations = [];
    let nationPasswordMap = new Map();
    let mainPassword = (await GM.getValue('mainPassword', '')) || '';
    let mainNation = (await GM.getValue('mainNation', '')) || '';
    let savedList = (await GM.getValue('puppetList', {})) || {};
    let activeGroup = (await GM.getValue('activeGroup', '')) || '';
    if (!activeGroup || !(activeGroup in savedList)) {
        activeGroup = Object.keys(savedList)[0] || '';
    }
    const groups = await GM.getValue('puppetGroups', '{}');
    let puppetGroups = JSON.parse(groups);
    nationPasswordMap.clear();
    puppetNations = [];
    if (activeGroup && savedList[activeGroup]) {
        savedList[activeGroup].forEach(line => {
            const parts = line.split(',').map(s => s.trim());
            const nation = parts[0] ? canonicalize(parts[0]) : '';
            if (parts[1])
                nationPasswordMap.set(nation, parts[1]);
            if (nation)
                puppetNations.push(nation);
        });
    }
    const links = `
    <div class="bel">
      <div class="belcontent" id="manageButton">
        <a href="/page=blank/scene" class="bellink"><i class="icon-industrial-building"></i>PUPPETS</a>
      </div>
    </div>
    <div class="bel">
      <div class="belcontent">
        <button id="prevPuppet" class="bellink linkys">PREV</button>
      </div>
    </div>
    <div class="bel">
      <div class="belcontent">
        <button id="nextPuppet" class="bellink linkys">NEXT</button>
      </div>
    </div>
  `;
    const spacer = document.querySelector('#loginswitcher');
    if (spacer)
        spacer.insertAdjacentHTML('beforebegin', links);
    let currentIndex = -1;
    async function login(nation, password, mainNation) {
        if (!nation)
            return;
        const loginbox = document.getElementById('loginbox');
        if (!loginbox)
            return;
        const loginForm = loginbox.querySelector('form');
        if (!loginForm)
            return;
        if (window.location.pathname.includes('/page=blank/scene')) {
            if (!window.location.href.includes('generated_by=SomeCardAssistantManager')) {
                loginForm.action = `${window.location.href}?generated_by=SomeCardAssistantManager__author_main_nation_Kractero__usedBy_${mainNation}`;
            }
            else {
                loginForm.action = `${window.location.href}`;
            }
        }
        else {
            if (!loginForm.action.includes('generated_by=SomeCardAssistantManager')) {
                loginForm.action = `${loginForm.action}?generated_by=SomeCardAssistantManager__author_main_nation_Kractero__usedBy_${mainNation}`;
            }
            else {
                loginForm.action = `${loginForm.action}`;
            }
        }
        const nationInput = loginForm.querySelector('input[name="nation"]');
        if (!nationInput || !(nationInput instanceof HTMLInputElement))
            return;
        nationInput.value = nation ? nation : '';
        const passwordInput = loginForm.querySelector('input[name="password"]');
        if (!passwordInput || !(passwordInput instanceof HTMLInputElement))
            return;
        passwordInput.value = password;
        HTMLFormElement.prototype.submit.call(loginForm);
    }
    async function loginAtIndex(index) {
        if (puppetNations.length === 0)
            return;
        if (index < 0)
            index = puppetNations.length - 1;
        if (index >= puppetNations.length)
            index = 0;
        currentIndex = index;
        const nation = puppetNations[index];
        if (!nation)
            return;
        let password = nationPasswordMap.get(nation) || mainPassword || '';
        if (!password)
            return;
        await login(nation, password, mainNation);
    }
    const prevPuppetBtn = document.getElementById('prevPuppet');
    const nextPuppetBtn = document.getElementById('nextPuppet');
    if (prevPuppetBtn) {
        const onPrevClick = async (e) => {
            e.preventDefault();
            prevPuppetBtn.removeEventListener('click', onPrevClick);
            if (puppetNations.length === 0)
                return;
            if (currentIndex === -1) {
                const loggedin = document.getElementById('loggedin');
                const loggedinNation = loggedin?.dataset?.nname ? canonicalize(loggedin.dataset.nname) : '';
                currentIndex = puppetNations.indexOf(loggedinNation);
                if (currentIndex === -1)
                    currentIndex = 0;
            }
            const page = Math.floor((currentIndex - 1) / itemsPerPage) + 1;
            await GM.setValue('page', page);
            await loginAtIndex(currentIndex - 1);
        };
        prevPuppetBtn.addEventListener('click', onPrevClick);
    }
    if (nextPuppetBtn) {
        const onNextClick = async (e) => {
            e.preventDefault();
            nextPuppetBtn.removeEventListener('click', onNextClick);
            if (puppetNations.length === 0)
                return;
            if (currentIndex === -1) {
                const loggedin = document.getElementById('loggedin');
                const loggedinNation = loggedin?.dataset?.nname ? canonicalize(loggedin.dataset.nname) : '';
                currentIndex = puppetNations.indexOf(loggedinNation);
            }
            const page = Math.floor((currentIndex + 1) / itemsPerPage) + 1;
            await GM.setValue('page', page);
            await loginAtIndex(currentIndex + 1);
        };
        nextPuppetBtn.addEventListener('click', onNextClick);
    }
    const scene = document.querySelector('#manageButton');
    if (scene) {
        let totalPages = Math.ceil(puppetNations.length / itemsPerPage);
        let currentPage = await GM.getValue('page', 1);
        const outputDiv = document.createElement('div');
        Object.assign(outputDiv.style, {
            color: 'white',
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'absolute',
            overflow: 'scroll',
            minWidth: '300px',
            padding: '9px',
            textAlign: 'center',
            borderRadius: '8px',
            background: 'black',
            right: '0',
            zIndex: '100',
            textShadow: 'none',
            boxShadow: '0 0 12px black',
            marginBottom: '6px',
        });
        const navDiv = document.createElement('div');
        navDiv.id = 'navDiv';
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Prev Page';
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next Page';
        const groupSelect = document.createElement('select');
        for (const group of Object.keys(savedList)) {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            if (group === activeGroup) {
                option.selected = true;
            }
            groupSelect.appendChild(option);
        }
        groupSelect.addEventListener('change', async (e) => {
            e.preventDefault();
            const selectedGroup = e.target;
            if (!selectedGroup || !(selectedGroup instanceof HTMLSelectElement))
                return;
            await GM.setValue('activeGroup', selectedGroup.value);
        });
        GM_addValueChangeListener('puppetGroups', (name, oldVal, newVal) => {
            savedList = JSON.parse(newVal);
            updatePuppetNations(savedList, activeGroup);
        });
        GM_addValueChangeListener('activeGroup', (name, oldVal, newVal) => {
            savedList = JSON.parse(newVal);
            updatePuppetNations(savedList, activeGroup);
        });
        navDiv.appendChild(prevBtn);
        navDiv.appendChild(groupSelect);
        navDiv.appendChild(nextBtn);
        outputDiv.appendChild(navDiv);
        const perPageInputLabel = document.createElement('label');
        perPageInputLabel.textContent = 'Items per page';
        const perPageInput = document.createElement('input');
        perPageInput.type = 'number';
        perPageInput.min = '5';
        perPageInput.value = itemsPerPage.toString();
        const perPageButton = document.createElement('button');
        perPageButton.textContent = 'Save';
        const perPageDiv = document.createElement('div');
        perPageDiv.id = 'itemsPerPage';
        perPageDiv.appendChild(perPageInputLabel);
        perPageDiv.appendChild(perPageInput);
        perPageDiv.appendChild(perPageButton);
        perPageButton.addEventListener('click', () => {
            itemsPerPage = parseInt(perPageInput.value, 10);
            if (!isNaN(itemsPerPage) && itemsPerPage > 0) {
                totalPages = Math.ceil(puppetNations.length / itemsPerPage);
                currentPage = 1;
                GM.setValue('itemsPerPage', itemsPerPage);
                renderPage(currentPage);
            }
        });
        outputDiv.appendChild(perPageDiv);
        const nationsContainer = document.createElement('div');
        nationsContainer.id = 'nationContainer';
        outputDiv.appendChild(nationsContainer);
        function updatePuppetNations(savedList, group) {
            puppetNations = savedList[group] ?? [];
            totalPages = Math.ceil(puppetNations.length / itemsPerPage);
            currentPage = 1;
            renderPage(currentPage);
        }
        function renderPage(page) {
            nationsContainer.innerHTML = '';
            const start = (page - 1) * itemsPerPage;
            const end = Math.min(start + itemsPerPage, puppetNations.length);
            for (let i = start; i < end; i++) {
                const nation = puppetNations[i];
                if (!nation)
                    break;
                const btn = document.createElement('button');
                btn.dataset.nation = nation;
                btn.textContent = nation;
                btn.className = 'linky';
                const onClick = async (e) => {
                    e.preventDefault();
                    btn.removeEventListener('click', onClick);
                    if (puppetNations.length === 0)
                        return;
                    currentIndex = puppetNations.indexOf(nation);
                    if (currentIndex === -1)
                        currentIndex = 0;
                    await loginAtIndex(currentIndex);
                };
                btn.addEventListener('click', onClick);
                nationsContainer.appendChild(btn);
            }
            GM.setValue('page', page);
        }
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        });
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
            }
        });
        renderPage(currentPage);
        scene.appendChild(outputDiv);
        const container = scene;
        scene.addEventListener('mouseenter', () => {
            outputDiv.style.display = 'flex';
        });
        scene.addEventListener('mouseleave', (event) => {
            if (!(event instanceof MouseEvent))
                return;
            const toElement = event.relatedTarget;
            if (!toElement || !(toElement instanceof Node) || !container.contains(toElement)) {
                outputDiv.style.display = 'none';
            }
        });
        const css = `
      #itemsPerPage {
        margin: 5px 10px 10px 10px;
      }

      #itemsPerPage input {
        width: 50px;
      }

      #navDiv {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 0.5rem;
      }

      #navDiv button {
        padding: 0.25rem 0.25rem;
        margin: 0.25rem 0.25rem;
        width: max-content;
        cursor: pointer;
      }

      #nationContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
      }

      .linky {
        all: unset;
        cursor: pointer;
        color: inherit;
        text-decoration: none;
        font-weight: normal;
        font-size: 1rem;
      }

      .linky:hover {
        color: green;
      }
    `;
        GM_addStyle(css);
    }
    if (window.location.pathname === '/page=blank/scene') {
        const section = document.createElement('main');
        section.id = 'scsContainer';
        section.innerHTML = `
      <h2>Scene</h2>
      <button id="toggleForm">Hide Form</button>
      <div id="scsForm" id="puppetForm">
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
        <textarea spellcheck="false" id="puppetList" rows="10" id="scsTextarea" placeholder="nation one\nnation two\nnation three"></textarea>
        <button id="generate">Generate</button>
        <p class="error"></p>
      </div>
      <div id="scene"></div>
    `;
        const content = document.getElementById('content');
        if (content)
            content.append(section);
        const form = document.getElementById('puppetForm');
        const toggleFormBtn = document.getElementById('toggleForm');
        const formHidden = await GM.getValue('formHidden', false);
        toggleFormBtn.addEventListener('click', async () => {
            const hidden = form.style.display === 'none';
            form.style.display = hidden ? 'flex' : 'none';
            toggleFormBtn.textContent = hidden ? 'Hide Form' : 'Show Form';
            await GM.setValue('formHidden', !hidden);
        });
        if (formHidden) {
            form.style.display = 'none';
            toggleFormBtn.textContent = 'Show Form';
        }
        const puppetListTextarea = document.getElementById('puppetList');
        if (puppetGroups) {
            try {
                let text = '';
                for (const groupName of Object.keys(puppetGroups)) {
                    text += `[${groupName}]\n`;
                    text += puppetGroups[groupName]?.join('\n') + '\n';
                }
                puppetListTextarea.value = text.trim();
            }
            catch (error) {
                puppetGroups = parsePuppetGroups(puppetListTextarea.value);
            }
        }
        else {
            puppetGroups = parsePuppetGroups(puppetListTextarea.value);
        }
        const nationInput = document.getElementById('mainNation');
        nationInput.value = mainNation;
        const passwordInput = document.getElementById('mainPassword');
        passwordInput.value = mainPassword;
        const generateButton = document.getElementById('generate');
        generateButton.addEventListener('click', buildTable);
        await buildTable();
        async function buildTable() {
            const errorElement = document.querySelector('#content .error');
            if (!errorElement)
                return;
            if (!nationInput.value.trim()) {
                errorElement.textContent = 'Provide a main nation';
                errorElement.style.display = 'block';
                return;
            }
            else {
                errorElement.style.display = 'none';
            }
            await GM.setValue('mainNation', nationInput.value.trim());
            await GM.setValue('mainPassword', passwordInput.value.trim());
            puppetGroups = parsePuppetGroups(puppetListTextarea.value);
            await GM.setValue('puppetGroups', JSON.stringify(puppetGroups));
            nationPasswordMap.clear();
            for (const group in puppetGroups) {
                puppetGroups[group]?.forEach(line => {
                    const [nationPart, passwordPart] = line.split(',').map(s => s.trim());
                    if (passwordPart) {
                        nationPasswordMap.set(nationPart ? canonicalize(nationPart) : '', passwordPart);
                    }
                });
            }
            if (Object.keys(puppetGroups).length === 0)
                return;
            await GM.setValue('puppetList', puppetGroups);
            const groupNames = Object.keys(puppetGroups);
            let sections = ``;
            let puppetList = [];
            let active = activeGroup && groupNames.includes(activeGroup) ? activeGroup : groupNames[0] || '';
            groupNames.forEach(groupName => {
                const isActive = groupName === active;
                sections += `<button data-group="${groupName}" class="${isActive ? 'active' : ''}">${groupName}</button>`;
            });
            puppetList = puppetGroups[active] || [];
            let content = `<div id="holder">
        <div id="sections">
            ${sections}
          </div>
          <div id="fittingName">
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
      `;
            content += `</tbody></table>`;
            const sceneDiv = document.getElementById('scene');
            sceneDiv.innerHTML = `${content}`;
            const sectionsDiv = document.getElementById('sections');
            const domain = document.getElementById('domain').value || 'www';
            const tbody = document.querySelector('tbody');
            function renderRows(puppetList) {
                puppetList = puppetList.filter(puppet => !puppet.includes('['));
                tbody.innerHTML = '';
                puppetList.forEach((name, i) => {
                    const nation = name.includes(',') ? canonicalize(name.split(',')[0] || '') : canonicalize(name);
                    const base = `https://${domain}.nationstates.net/container=${nation}/nation=${nation}`;
                    const row = `
          <tr data-nation="${nation}">
            <td>${i + 1}</td>
            <td><a href="${base}?generated_by=SomeCardAssistantManager__author_main_nation_Kractero__usedBy_${mainNation}" target="_blank">${nation}</a></td>
            <td><a href="${base}/page=deck?generated_by=SomeCardAssistantManager__author_main_nation_Kractero__usedBy_${mainNation}" target="_blank">Deck</a></td>
            <td><a href="${base}/page=deck/value_deck=1?generated_by=SomeCardAssistantManager__author_main_nation_Kractero__usedBy_${mainNation}" target="_blank">Value Deck</a></td>
            <td><button id="loginButton" data-nation="${nation}">Login</button></td>
          </tr>`;
                    tbody.insertAdjacentHTML('beforeend', row);
                });
                const loggedin = document.getElementById('loggedin');
                const loggedinNation = loggedin?.dataset?.nname ? canonicalize(loggedin.dataset.nname) : '';
                const rows = Array.from(sceneDiv.querySelectorAll('tbody tr'));
                rows.forEach((row, idx) => {
                    if (row.dataset.nation === loggedinNation) {
                        row.classList.add('highlight');
                        currentIndex = idx;
                    }
                    else
                        row.classList.remove('highlight');
                });
                sceneDiv.addEventListener('click', async (event) => {
                    const target = event.target;
                    if (target.matches('.loginButton')) {
                        const allButtons = sceneDiv.querySelectorAll('.loginButton');
                        allButtons.forEach(btn => (btn.disabled = true));
                        const nation = target.dataset.nation || '';
                        let password = mainPassword;
                        if (!password)
                            password = nationPasswordMap.get(nation) || '';
                        try {
                            await login(nation, password, mainNation);
                        }
                        finally {
                            allButtons.forEach(btn => (btn.disabled = false));
                        }
                    }
                });
                const searchBox = document.getElementById('puppetSearch');
                searchBox.addEventListener('input', () => {
                    const value = canonicalize(searchBox.value);
                    rows.forEach(row => {
                        const name = canonicalize(row.dataset.nation || '');
                        row.style.display = name.includes(value) ? '' : 'none';
                    });
                });
            }
            renderRows(puppetList);
            sectionsDiv.addEventListener('click', async (e) => {
                const button = e.target;
                if (button instanceof HTMLElement && button.tagName === 'BUTTON' && button.dataset.group) {
                    sectionsDiv.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    button.classList.add('active');
                    activeGroup = button.dataset.group;
                    await GM.setValue('activeGroup', activeGroup);
                    currentIndex = -1;
                    const searchBox = document.getElementById('puppetSearch');
                    if (searchBox)
                        searchBox.value = '';
                    renderRows(puppetGroups[activeGroup] || []);
                }
            });
        }
        const css = `
      #scsContainer {
        margin-top: 1rem;
        padding: 0.5rem;
        border: 1px solid;
        border-radius: 8px;
        max-width: 1000px;
      }

      #scsContainer h2 {
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }

      #scsForm {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      #scsContainer input,
      #scsContainer textarea,
      #scsContainer select {
        width: 100%;
        max-width: 600px;
        padding: 0.6rem 0.8rem;
        font-size: 1rem;
        resize: vertical;
      }

      #scsContainer input:focus,
      #scsContainer textarea:focus {
        box-shadow: 0 0 4px rgba(26, 115, 232, 0.4);
        outline: none;
      }

      #scsContainer button {
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

      #scene {
        margin-top: 2rem;
        overflow-x: auto;
        flex: 1;
        min-width: 0;
      }

      #scene table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 6px;
        overflow: hidden;
        font-size: 0.9rem;
      }

      #scene th,
      #scene td {
        padding: 0.6rem 0.8rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      .loginButton {
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      #scene div {
        margin-bottom: 1rem;
      }

      #scene tbody tr.highlight {
        background-color: darkslateblue;
      }

      #fittingName {
        flex: 1;
      }

      #puppetSearch {
        margin-bottom: 1rem;
        width: 100%;
      }

      .linkys {
        all: unset;
      }

      #content .error {
        display: none;
      }
    `;
        GM_addStyle(css);
    }
})();
function canonicalize(str) {
    return str.trim().toLowerCase().replaceAll(' ', '_');
}
function parsePuppetGroups(text) {
    const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);
    const groups = {};
    let currentGroup = 'Group 1';
    let groupCount = 1;
    for (const line of lines) {
        const match = line.match(/^\[(.+?)\]$/);
        if (match) {
            currentGroup = match[1]?.trim() || `Group ${++groupCount}`;
            if (!groups[currentGroup])
                groups[currentGroup] = [];
        }
        else {
            if (!groups[currentGroup])
                groups[currentGroup] = [];
            groups[currentGroup]?.push(line);
        }
    }
    return groups;
}

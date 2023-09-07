// ==UserScript==
// @name         Puppet Switcher
// @namespace    Kra
// @version      1.0
// @description  Switch between containers
// @author       Kractero
// @match        https://www.nationstates.net/*
// @downloadUrl  https://github.com/Kractero/userscripts/raw/main/puppetSwitcher.user.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  let currentNation = document
    .querySelector('#loggedin')
    .getAttribute('data-nname');
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      currentNation = document
        .querySelector('#loggedin')
        .getAttribute('data-nname');
    }
  });
  const itemsPerPage = 25;
  localStorage.setItem('currNation', currentNation);
  let list = localStorage.getItem('nationList')
    ? localStorage.getItem('nationList')
    : [];
  let dataArray = list.length > 0 ? list.split('\n') : [];
  const totalPages = Math.ceil(dataArray.length / itemsPerPage);
  let currentPage;
  if (localStorage.getItem('page')) {
    currentPage = localStorage.getItem('page');
  } else {
    currentPage = 1;
  }

  const header = document.querySelector('.belspacermain');
  header.style.position = 'relative';

  const tab = document.createElement('div');
  tab.classList.add('bel');

  const tabs = document.createElement('div');
  tabs.classList.add('former');
  tabs.style.display = 'none';
  tabs.style.flexDirection = 'column';
  tabs.style.justifyItems = 'center';
  tabs.style.alignItems = 'center';
  tabs.style.position = 'absolute';
  tabs.style.overflow = 'scroll';
  tabs.style.right = 0;
  tabs.id = 'loginbox';
  tabs.style.width = '300px';

  let form = document.createElement('form');

  let textarea = document.createElement('textarea');
  textarea.id = 'inputData';
  textarea.required = true;
  textarea.rows = '15';
  form.style.justifyItems = 'center';
  if (list) {
    form.style.display = 'none';
  } else {
    form.style.display = 'none';
  }
  form.style.flexDirection = 'column';
  form.style.alignItems = 'center';
  form.style.marginBottom = '1rem';
  form.appendChild(textarea);

  let input = document.createElement('input');
  input.id = 'password';
  input.required = true;

  form.appendChild(input);

  let submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.style.width = '50%';
  form.appendChild(submitButton);

  let clearButton = document.createElement('button');
  clearButton.textContent = 'Clear Storage';
  clearButton.style.width = '50%';

  let editButton = document.createElement('button');
  editButton.textContent = 'Edit Storage';
  editButton.style.width = '50%';

  const previousButton = document.createElement('button');
  previousButton.textContent = 'Previous';
  previousButton.addEventListener('click', goToPreviousPage);

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.addEventListener('click', goToNextPage);
  let currentJunk = 0;

  let outputDiv = document.createElement('div');
  outputDiv.id = 'output';
  outputDiv.style.display = 'flex';
  outputDiv.style.flexDirection = 'column';
  outputDiv.style.marginBottom = '1rem';
  outputDiv.style.gap = '0.25rem';

  dataArray.forEach((item) => {
    let link = generateLinks(item);
    outputDiv.appendChild(link);
  });

  let buttonHolder = document.createElement('div');

  let output = document.createElement('div');
  output.style.marginTop = '1rem';

  let managementButtons = document.createElement('div');
  managementButtons.appendChild(clearButton);
  managementButtons.appendChild(editButton);
  managementButtons.style.display = 'flex';

  let headerText = document.createElement('h1');
  headerText.textContent = 'Your Puppet Manager';
  headerText.style.fontWeight = 500;
  headerText.style.fontSize = '1.875rem';
  headerText.style.lineHeight = '2.25rem';
  headerText.style.color = 'white';
  headerText.style.textShadow = '0px 0px 0px';

  let nsHeaderText = document.createElement('a');
  nsHeaderText.textContent = 'Puppets';

  buttonHolder.appendChild(previousButton);
  buttonHolder.appendChild(nextButton);
  output.appendChild(outputDiv);
  output.appendChild(buttonHolder);
  tabs.appendChild(headerText);
  tabs.appendChild(form);
  tabs.appendChild(managementButtons);
  tabs.appendChild(output);
  tab.appendChild(tabs);
  tab.append(nsHeaderText);
  tab.addEventListener('mouseover', () => {
    tabs.style.display = 'flex';
  });
  tab.addEventListener('mouseleave', () => {
    tabs.style.display = 'none';
  });
  header.appendChild(tab);

  function generateLinks(item) {
    const link = document.createElement('a');
    link.textContent = item;
    link.href = `https://www.nationstates.net/nation=${item}`;
    link.target = '_blank';
    return link;
  }

  async function saveData(event) {
    event.preventDefault();
    const inputData = document.getElementById('inputData').value;
    const passy = document.getElementById('password').value;
    localStorage.setItem('nationList', inputData);
    localStorage.setItem('puppetPassword', passy);
    list = localStorage.getItem('nationList');
    if (list) {
      dataArray = list.split('\n');
      dataArray.forEach((item) => {
        let link = generateLinks(item);
        outputDiv.appendChild(link);
      });
      form.style.display = 'none';
      output.style.display = 'block';
      displayItems();
    }
  }

  form.addEventListener('submit', (e) => {
    saveData(e);
  });

  function displayItems() {
    outputDiv.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = dataArray.slice(startIndex, endIndex);
    itemsToDisplay.forEach((item) => {
      let link = generateLinks(item);
      outputDiv.appendChild(link);
    });
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      currentPage--;
      localStorage.setItem('page', currentPage);
      displayItems();
    }
  }

  function goToNextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      localStorage.setItem('page', currentPage);
      displayItems();
    }
  }

  displayItems();

  clearButton.addEventListener('click', () => {
    localStorage.clear();
    form.style.display = 'flex';
    outputDiv.innerHTML = '';
    output.style.display = 'none';
  });

  editButton.addEventListener('click', () => {
    form.style.display = 'flex';
    list = localStorage.getItem('nationList');
    document.getElementById('inputData').value = list;
    document.getElementById('password').value =
      localStorage.getItem('puppetPassword');
    outputDiv.innerHTML = '';
    output.style.display = 'none';
  });

  function getCurrentPageIndex() {
    let puppetPageLinks = Array.from(document.querySelectorAll('#output a'));
    let puppetText = puppetPageLinks.map((puppet) =>
      puppet.textContent.replaceAll(' ', '_').toLowerCase()
    );
    const tests = puppetText.filter(
      (puppet) => puppet === localStorage.getItem('currNation')
    );
    return puppetText.indexOf(tests[0]);
  }

  if (window.location.href.includes('deck')) {
    const junks = document.querySelectorAll('.deckcard');
    junks.forEach((info) => {
      info.classList.add('show');
    });
    junks[currentJunk].style.border = 'thick solid #0000FF';
  }
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (window.location.href.includes('upload_flag')) {
        return;
      }
      if (document.querySelector('.lootboxbutton')) {
        document.querySelector('.lootboxbutton').click();
        return;
      }
      if (
        document.querySelector('#notificationnumber-issues').textContent !==
          '0' &&
        !window.location.href.includes('dilemmas')
      ) {
        window.location.href = 'https://www.nationstates.net/page=dilemmas';
      }
    }
    if (event.key === ';') {
      if (document.querySelector('.lootboxbutton')) {
        document.querySelector('.lootboxbutton').click();
        return;
      }
      let puppetPageLinks = Array.from(document.querySelectorAll('#output a'));
      let currentPageIndex = getCurrentPageIndex();
      if (currentPageIndex === 0) {
        goToPreviousPage();
        let puppetPageLinks = Array.from(
          outputDiv.querySelectorAll('#output a')
        );
        puppetPageLinks[24].click();
      } else {
        puppetPageLinks[getCurrentPageIndex() - 1].click();
      }
    }
    if (event.key === "'") {
      if (document.querySelector('.lootboxbutton')) {
        document.querySelector('.lootboxbutton').click();
        return;
      }
      let puppetPageLinks = Array.from(document.querySelectorAll('#output a'));
      let currentPageIndex = getCurrentPageIndex();
      if (currentPageIndex === 24) {
        goToNextPage();
        let puppetPageLinks = Array.from(
          outputDiv.querySelectorAll('#output a')
        );
        puppetPageLinks[0].click();
      } else {
        puppetPageLinks[getCurrentPageIndex() + 1].click();
      }
    }
  });
})();

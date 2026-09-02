// ==UserScript==
// @name        Bulk Collection Edit
// @version     1.2
// @match       https://www.nationstates.net/page=deck/collection=*
// @grant       none
// @author      Kractero
// @description Add a form to add multiple cards into a collection at once
// ==/UserScript==

;(function () {
  'use strict'
  const nation = document.querySelector('#loggedin')
  if (!nation) return
  const form = document.querySelector('form[action*="page=deck/collection="]')
  if (!form) return

  const cap = 250
  function countTotal() {
    let total = 0
    for (const line of textarea.value.trim().split('\n')) {
      const [id, season, qty] = line.trim().split(',')
      if (!id || !season) continue
      total += parseInt(qty, 10) || 1
    }
    return total
  }

  const newForm = document.createElement('div')
  newForm.style.cssText = `
    margin-bottom:10px;
    display:flex;
    align-items:center;
  `

  const content = document.createElement('div')
  content.style.cssText = `
    display:flex;
    flex-direction:column;
  `

  const label = document.createElement('label')
  label.textContent = 'Enter cards as cardid,season, quantity (optional, default is 1)'

  const textarea = document.createElement('textarea')
  textarea.rows = 8
  textarea.cols = 40
  textarea.style.cssText = 'margin-top:10px;'

  content.appendChild(label)
  content.appendChild(textarea)

  const saveButton = document.createElement('button')
  saveButton.classList.add('button')
  saveButton.style.cssText = 'height:28px;'
  saveButton.textContent = 'Save'

  const status = document.createElement('span')
  status.style.cssText = 'margin-left:10px;'

  newForm.appendChild(content)
  newForm.appendChild(saveButton)
  newForm.appendChild(status)
  form.parentNode.insertBefore(newForm, form)

  textarea.addEventListener('input', () => {
    const total = countTotal()
    if (total > cap) {
      status.textContent = `Over cap: ${total}/${cap}`
      status.style.color = 'red'
      saveButton.disabled = true
    } else {
      status.textContent = `${total}/${cap}`
      status.style.color = ''
      saveButton.disabled = false
    }
  })

  saveButton.addEventListener('click', async () => {
    const total = countTotal()
    if (total > cap) {
      status.textContent = `Over cap: ${total}/${cap}`
      status.style.color = 'red'
      return
    }
    const cards = textarea.value
      .trim()
      .split('\n')
      .map(line => line.trim().split(','))
      .filter(([id, season]) => id && season)
      .map(([id, season, qty]) => ({ idseason: `${id}:${season}`, qty: qty || '1' }))
    const searchParams = new URLSearchParams()
    searchParams.set('edit', '1')
    searchParams.set('localid', form.querySelector('input[name="localid"]').value)
    searchParams.set('start', '0')
    searchParams.set('collection_name', form.querySelector('input[name="collection_name"]').value)
    searchParams.set('cardslisted', cards.map(card => card.idseason).join(','))
    cards.forEach(({ idseason, qty }) => {
      searchParams.set(`collect_${idseason}`, qty)
      searchParams.set(`selected_${idseason}`, 'on')
    })
    searchParams.set('save_collection', '1')
    const res = await fetch(
      `${location.href}&script=BulkCollectionEdit__by_Kractero__usedBy_${nation}&userclick=${Date.now()}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: searchParams.toString(),
      }
    )
    if (res.ok) location.reload()
  })
})()

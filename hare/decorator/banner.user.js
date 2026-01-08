// ==UserScript==
// @name         Banner Uploader
// @version      1.3
// @description  Banner blobbing
// @author       Kractero
// @match        https://*.nationstates.net/*page=banners*
// @grant        window.close
// ==/UserScript==

;(async function () {
    'use strict'

    const bannerURL = ''

    const openDatabase = () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('HareStorage', 3)

        request.onupgradeneeded = e => {
          const db = e.target.result
          if (!db.objectStoreNames.contains('banners')) {
            db.createObjectStore('banners')
          }
        }

        request.onsuccess = e => {
          resolve(e.target.result)
        }

        request.onerror = e => {
          reject('IndexedDB error: ' + e.target.errorCode)
        }
      })
    }

    const getBannerFromIndexedDB = (db, url) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['banners'], 'readonly')
        const store = transaction.objectStore('banners')
        const request = store.get(url)

        request.onsuccess = e => {
          resolve(e.target.result)
        }

        request.onerror = e => {
          reject('Error retrieving banner from IndexedDB: ' + e.target.errorCode)
        }
      })
    }

    const getBanner = async url => {
      const db = await openDatabase()
      let bannerBlob = await getBannerFromIndexedDB(db, url)

      if (!bannerBlob) {
        console.log(`Fetching and storing banner: ${url}`)
        const response = await fetch(url)
        bannerBlob = await response.blob()
        const transaction = db.transaction(['banners'], 'readwrite')
        const store = transaction.objectStore('banners')
        store.put(bannerBlob, url)
      } else {
        console.log('Banner retrieved from IndexedDB')
      }

      return bannerBlob
    }

    if (!bannerURL) {
      window.alert('Put a banner image link in line 13 please')
      return
    }

    let customBanners = Array.from(document.querySelectorAll('#bannerchoices li[id*="__"]'))

    customBanners = customBanners.filter(banner => {
      const id = banner.id
      const input = document.getElementById(`${id}_Primary`)
      const bannerImg = banner.querySelector(`#${id}_image`)
      return !bannerImg || bannerImg.getAttribute('data-imgsrc').includes('/images/banners/samples')
    })

    customBanners = customBanners.filter(banner => !banner.querySelector('.bannerlocked'))

    if (document.querySelector('.info')) {
      window.close()
      return
    }

    if (customBanners.length === 0) {
      const info = document.createElement('p')
      info.className = 'error'
      info.textContent = 'All custom banner slots filled'
      const form = document.querySelector('#bannerselectform')
      form.parentNode.insertBefore(info, form)
      return
    }

    for (let banner of customBanners) {
      const id = banner.id
      const input = document.getElementById(`${id}_Primary`)

      const bannerImg = banner.querySelector(`#${id}_image`)
      if (bannerImg && !bannerImg.getAttribute('data-imgsrc').includes('/images/banners/samples')) continue

      if (input && input.checked) {
        window.close()
        break
      }

      if (document.querySelector(`#${id} .custombanneruploadbox`)) {
        document.querySelector(`#${id} .custombanneruploadbox`).style.display = 'block'
        const bannerBlob = await getBanner(bannerURL)

        const file = new File([bannerBlob], 'banner.png', { type: bannerBlob.type })

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)

        const fileInput = document.querySelector(`input[name='${id.replace('banner', 'file')}']`)
        fileInput.files = dataTransfer.files

        const loginBox = document.querySelector("#loginbox")
        const isActive = loginBox.classList.contains("activeloginbox") || getComputedStyle(loginBox).display === "block"
        if (!isActive) document.querySelector(`#${id} button[name='uploadbanner']`).focus()
        break
      } else {
        const label = document.querySelector(`label[for='${id}_Primary']`)
        label.click()
        document.querySelector('#savebannersbuttonfloating').style.display = 'block'
        const button = document.querySelector("button[name='make_changes2']")
        const loginBox = document.querySelector("#loginbox")
        const isActive = loginBox.classList.contains("activeloginbox") || getComputedStyle(loginBox).display === "block"
        if (!isActive) button.focus()
        break
      }
    }
  })()

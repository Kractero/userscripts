// ==UserScript==
// @name         Genshin Pack Opening
// @version      1.0
// @description  Open packs with the genshin meteor
// @author       Kractero
// @match        https://*.nationstates.net/page=deck*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const highValueThreshold = 10

    const openDatabase = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('VideoStorage', 1);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('videos')) {
                    db.createObjectStore('videos');
                }
            };

            request.onsuccess = (e) => {
                resolve(e.target.result);
            };

            request.onerror = (e) => {
                reject('IndexedDB error: ' + e.target.errorCode);
            };
        });
    };

    const storeVideo = (db, url, videoBlob) => {
        const transaction = db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');
        store.put(videoBlob, url);
    };

    const getVideoFromIndexedDB = (db, url) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['videos'], 'readonly');
            const store = transaction.objectStore('videos');
            const request = store.get(url);

            request.onsuccess = (e) => {
                resolve(e.target.result);
            };

            request.onerror = (e) => {
                reject('Error retrieving video from IndexedDB: ' + e.target.errorCode);
            };
        });
    };

    const showVideo = async (url) => {
        const db = await openDatabase();
        let videoBlob = await getVideoFromIndexedDB(db, url);

        if (!videoBlob) {
            console.log(`Fetching and storing video: ${url}`);
            const response = await fetch(url);
            videoBlob = await response.blob();
            storeVideo(db, url, videoBlob);
        } else {
            console.log('Video retrieved from IndexedDB')
        }

        const videoURL = URL.createObjectURL(videoBlob);
        vid.src = videoURL;
        videoContainer.style.display = 'block';
        vid.play();

        vid.addEventListener('ended', () => {
            videoContainer.style.display = 'none';
            cards.forEach(card => {
                card.style.visibility = 'visible';
            });
        });
    };

    const cards = document.querySelectorAll('.deck-loot-box .deckcard-container');
    if (cards.length === 0) return;

    const legendaries = Array.from(cards).filter(card => {
        const check = card.querySelector('.deckcard-category');
        const rarity = getComputedStyle(check, ':before').getPropertyValue('content');
        return rarity === '"LEGENDARY"';
    });
    const highValueCards = Array.from(cards).filter(card => {
        const mv = card.querySelector('.deckcard-card-mv');
        return mv && parseFloat(mv.textContent.split(': ')[1]) > highValueThreshold;
    });

    cards.forEach(card => {
        card.style.visibility = 'hidden';
    });

    const videoUrls = {
        legendary: 'https://raw.githubusercontent.com/Kractero/userscripts/master/packopening/5star-single.mp4',
        highValue: 'https://raw.githubusercontent.com/Kractero/userscripts/master/packopening/4star-single.mp4',
        default: 'https://raw.githubusercontent.com/Kractero/userscripts/master/packopening/3star-single.mp4',
    };

    const videoContainer = document.createElement('div');
    videoContainer.style.zIndex = '1000';
    videoContainer.style.display = 'none';
    videoContainer.style.padding = '20px';
    videoContainer.style.borderRadius = '10px';

    const vid = document.createElement('video');
    vid.style.maxWidth = '100%';
    vid.style.maxHeight = '800px';
    vid.controls = false;
    videoContainer.appendChild(vid);

    vid.addEventListener('click', () => {
      vid.currentTime = vid.duration;
      vid.dispatchEvent(new Event('ended'));
    });

    const decklistElement = document.querySelector('.decklist');
    if (decklistElement) {
        decklistElement.parentNode.insertBefore(videoContainer, decklistElement);
    }

    if (legendaries.length > 0) {
        showVideo(videoUrls.legendary);
    } else if (highValueCards.length > 0) {
        showVideo(videoUrls.highValue);
    } else {
        showVideo(videoUrls.default);
    }
})();

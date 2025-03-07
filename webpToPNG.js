// ==UserScript==
// @name         Convert webp to png on upload flag
// @version      1.0
// @description  Automatically convert webp to png
// @author       Kractero
// @match        https://www.nationstates.net/*page=upload_flag*
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

    document.querySelector("input[name='file']").addEventListener('change', async (event) => {
        const input = event.target;
        if (input.type !== 'file' || !input.files[0]) return;

        const file = input.files[0]
        if (file.type === 'image/webp') {
            try {
                const dataURL = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                const image = await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = dataURL;
                });

                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);

                const blob = await new Promise((resolve, reject) => {
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Failed to create PNG blob.'));
                            }
                        },
                        'image/png'
                    );
                });

                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(new File([blob], file.name.replace(/\.webp$/i, '.png'), { type: 'image/png' }))
                input.files = dataTransfer.files
                return
            } catch (error) {
                console.error(`Error converting file: ${file.name}`, error);
                return file;
            }
        } else {
          return
        }
    });

})();

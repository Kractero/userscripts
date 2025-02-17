// ==UserScript==
// @name         Color Picker
// @version      1.2
// @description  Rarities with color picker
// @author       Kractero
// @match        https://*.nationstates.net/*page=deck*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// ==/UserScript==

function GM_addStyle(style) {
  'use strict'
  var node = document.createElement('style')
  node.innerHTML = style
  document.getElementsByTagName('head')[0].appendChild(node)
}

;(async function () {
  'use strict'

  const style = document.createElement('style')

  style.textContent = `
  .color-pair {
    display: flex;
    justify-content: space-between;
    align-items: center; /* Aligns items vertically centered */
    margin-bottom: 10px; /* Spacing between rows */
  }

  .color-pair label {
    margin-right: 10px; /* Optional: adds space between label and input */
  }
`
  document.head.appendChild(style)

  const dialogHTML = `
    <div id="colorPickerDialog" style="display: none; padding: 20px; background: #fff; border: 2px solid #000; z-index: 1000; position: absolute;">
      <h3>Customize Rarity Colors</h3>
      <div class="color-pair">
        <label for="colorCommon">Common:</label>
        <input type="color" id="colorCommon">
      </div>
      <div class="color-pair">
        <label for="colorUncommon">Uncommon:</label>
        <input type="color" id="colorUncommon">
      </div>
      <div class="color-pair">
        <label for="colorRare">Rare:</label>
        <input type="color" id="colorRare">
      </div>
      <div class="color-pair">
        <label for="colorUltraRare">Ultra Rare:</label>
        <input type="color" id="colorUltraRare">
      </div>
      <div class="color-pair">
        <label for="colorEpic">Epic:</label>
        <input type="color" id="colorEpic">
      </div>
      <div class="color-pair">
        <label for="colorLegendary">Legendary:</label>
        <input type="color" id="colorLegendary">
      </div>
      <button id="applyColors">Apply</button>
      <button id="clearColors">Reset</button>
    </div>
  `

  document.body.insertAdjacentHTML('beforeend', dialogHTML)

  const button = document.createElement('a')
  button.style.marginLeft = '16px'
  button.style.fontSize = '18px'
  button.innerHTML = '🎨'
  document.querySelector('#content h1').appendChild(button)

  document.getElementById('colorCommon').value = await GM.getValue('colorCommon', '#422401')
  document.getElementById('colorUncommon').value = await GM.getValue('colorUncommon', '#844f29')
  document.getElementById('colorRare').value = await GM.getValue('colorRare', '#ce765b')
  document.getElementById('colorUltraRare').value = await GM.getValue('colorUltraRare', '#f06161')
  document.getElementById('colorEpic').value = await GM.getValue('colorEpic', '#d71818')
  document.getElementById('colorLegendary').value = await GM.getValue('colorLegendary', '#ab274f')

  if (await GM.getValue('colorCommon')) applyColors()

  button.addEventListener('click', event => {
    const dialog = document.getElementById('colorPickerDialog')
    if (dialog.style.display === 'none' || dialog.style.display === '') {
      dialog.style.display = 'block'

      const buttonRect = event.target.getBoundingClientRect()
      dialog.style.top = `${buttonRect.bottom + window.scrollY}px`
      dialog.style.left = `${buttonRect.left}px`
    } else {
      dialog.style.display = 'none'
    }
  })

  document.addEventListener('click', event => {
    const dialog = document.getElementById('colorPickerDialog')
    if (!dialog.contains(event.target) && !button.contains(event.target)) {
      dialog.style.display = 'none'
    }
  })

  document.getElementById('applyColors').addEventListener('click', function () {
    applyColors()
  })

  document.getElementById('clearColors').addEventListener('click', clearColors)

  function clearColors() {
    GM.deleteValue('colorCommon')
    GM.deleteValue('colorUncommon')
    GM.deleteValue('colorRare')
    GM.deleteValue('colorUltraRare')
    GM.deleteValue('colorEpic')
    GM.deleteValue('colorLegendary')
    location.reload()
  }

  function applyColors() {
    const commonColor = document.getElementById('colorCommon').value || '#422401'
    const uncommonColor = document.getElementById('colorUncommon').value || '#844f29'
    const rareColor = document.getElementById('colorRare').value || '#ce765b'
    const ultraRareColor = document.getElementById('colorUltraRare').value || '#f06161'
    const epicColor = document.getElementById('colorEpic').value || '#d71818'
    const legendaryColor = document.getElementById('colorLegendary').value || '#ab274f'

    GM.setValue('colorCommon', commonColor)
    GM.setValue('colorUncommon', uncommonColor)
    GM.setValue('colorRare', rareColor)
    GM.setValue('colorUltraRare', ultraRareColor)
    GM.setValue('colorEpic', epicColor)
    GM.setValue('colorLegendary', legendaryColor)

    GM_addStyle(`
      /* COMMON */
      .deckcard-category-common {
        background: rgba(${hexToRgb(commonColor)}, 0.1);
      }
      .deckcard-category-common .deckcard-category {
        background: linear-gradient(to top right,rgba(255,255,255,0) 0%, rgb(${hexToRgb(commonColor)}) 100%);
      }
      .deckcard-category-common .deckcard-stripe {
        background: ${commonColor};
      }
      .deckcard-season-2 figure.deckcard-category-common {
        background: linear-gradient(112deg, ${getAdjustedColor(commonColor)} 0%, rgb(${hexToRgb(commonColor)}) 100%);
      }
      .deckcard-season-3 .deckcard-category-common .s3-slogan{
        background: ${commonColor};
      }
      .deckcard-season-3 .deckcard-category-common .deckcard-stripe{
        background: ${commonColor};
      }
      .deckcard-season-3 .deckcard-category-common .deckcard-category{
        background: ${commonColor};
      }
      /* UNCOMMON */
      /* S1 */
      .deckcard-category-uncommon {
      background: rgba(${hexToRgb(uncommonColor)}, 0.1);
      }
      .deckcard-category-uncommon .deckcard-category {
      background: linear-gradient(to top right,rgba(255,255,255,0) 0%, rgb(${hexToRgb(uncommonColor)}) 100%);
      }
      .deckcard-category-uncommon .deckcard-stripe {
        background: ${uncommonColor};
      }
      /* S2 */
      .deckcard-season-2 figure.deckcard-category-uncommon {
      background: linear-gradient(112deg, ${getAdjustedColor(uncommonColor)} 0%, rgb(${hexToRgb(uncommonColor)}) 100%);
      }
      /* S3 */
      .deckcard-season-3 .deckcard-category-uncommon .s3-slogan{
        background: ${uncommonColor};
      }
      .deckcard-season-3 .deckcard-category-uncommon .deckcard-stripe{
        background: ${uncommonColor};
      }
      .deckcard-season-3 .deckcard-category-uncommon .deckcard-category{
        background: ${uncommonColor};
      }
      /* RARE */
      /* S1 */
      .deckcard-category-rare {
        background: rgba(${hexToRgb(rareColor)}, 0.1);
      }
      .deckcard-category-rare .deckcard-category {
        background: linear-gradient(to top right, rgba(255, 255, 255, 0) 0%, rgb(${hexToRgb(rareColor)}) 100%);
      }
      .deckcard-category-rare .deckcard-stripe {
        background: ${rareColor};
      }
      /* S2 */
      .deckcard-season-2 figure.deckcard-category-rare {
        background: linear-gradient(112deg, ${getAdjustedColor(rareColor)} 0%, rgb(${hexToRgb(rareColor)}) 100%);
      }
      /* S3 */
      .deckcard-season-3 .deckcard-category-rare .s3-slogan {
        background: ${rareColor};
      }
      .deckcard-season-3 .deckcard-category-rare .deckcard-stripe {
        background: ${rareColor};
      }
      .deckcard-season-3 .deckcard-category-rare .deckcard-category {
        background: ${rareColor};
      }
      /* ULTRA RARE */
      /* S1 */
      .deckcard-category-ultra-rare {
        background: rgba(${hexToRgb(ultraRareColor)}, 0.1);
      }
      .deckcard-category-ultra-rare .deckcard-category {
        background: linear-gradient(to top right, rgba(255, 255, 255, 0) 0%, rgb(${hexToRgb(ultraRareColor)}) 100%);
      }
      .deckcard-category-ultra-rare .deckcard-stripe {
        background: ${ultraRareColor};
      }
      /* S2 */
      .deckcard-season-2 figure.deckcard-category-ultra-rare {
        background: linear-gradient(112deg, ${getAdjustedColor(ultraRareColor)} 0%, rgb(${hexToRgb(
      ultraRareColor
    )}) 100%);
      }
      /* S3 */
      .deckcard-season-3 .deckcard-category-ultra-rare .s3-slogan {
        background: ${ultraRareColor};
      }
      .deckcard-season-3 .deckcard-category-ultra-rare .deckcard-stripe {
        background: ${ultraRareColor};
      }
      .deckcard-season-3 .deckcard-category-ultra-rare .deckcard-category {
        background: ${ultraRareColor};
      }
      /* EPIC */
      /* S1 */
      .deckcard-category-epic {
        background: rgba(${hexToRgb(epicColor)}, 0.1);
      }
      .deckcard-category-epic .deckcard-category {
        background: linear-gradient(to top right, rgba(255, 255, 255, 0) 0%, rgb(${hexToRgb(epicColor)}) 100%);
      }
      .deckcard-category-epic .deckcard-stripe {
        background: ${epicColor};
      }
      /* S2 */
      .deckcard-season-2 figure.deckcard-category-epic {
        background: linear-gradient(112deg, ${getAdjustedColor(epicColor)} 0%, rgb(${hexToRgb(epicColor)}) 100%);
      }
      /* S3 */
      .deckcard-season-3 .deckcard-category-epic .s3-slogan {
        background: ${epicColor};
      }
      .deckcard-season-3 .deckcard-category-epic .deckcard-stripe {
        background: ${epicColor};
      }
      .deckcard-season-3 .deckcard-category-epic .deckcard-category {
        background: ${epicColor};
      }
      /* LEGENDARY */
      /* S1 */
      .deckcard-category-legendary {
        background: rgba(${hexToRgb(legendaryColor)}, 0.1);
      }
      .deckcard-category-legendary .deckcard-category {
        background: linear-gradient(to top right, rgba(255, 255, 255, 0) 0%, rgb(${hexToRgb(legendaryColor)}) 100%);
      }
      .deckcard-category-legendary .deckcard-stripe {
        background: ${legendaryColor};
      }
      /* S2 */
      .deckcard-season-2 figure.deckcard-category-legendary {
        background: linear-gradient(112deg, ${getAdjustedColor(legendaryColor)} 0%, rgb(${hexToRgb(
      legendaryColor
    )}) 100%);
      }
      /* S3 */
      .deckcard-season-3 .deckcard-category-legendary .s3-slogan {
        background: ${legendaryColor};
      }
      .deckcard-season-3 .deckcard-category-legendary .deckcard-stripe {
        background: ${legendaryColor};
      }
      .deckcard-season-3 .deckcard-category-legendary .deckcard-category {
        background: ${legendaryColor};
      }
      /* S2 stripes */
      .deckcard-season-2 .deckcard-stripe {
      background-color: none;
      background: 0 0;
      }
      /* S2 category (header) */
      .deckcard-season-2 .deckcard-category {
      background: 0 0;
      }

      /* S4 */
      :root {
        --legendary-main: rgba(${hexToRgb(legendaryColor)}, 1);
        --legendary-dark: rgba(${hexToRgb(generateShadowColor(legendaryColor), 1)});
        --legendary-backdrop: rgba(${hexToRgb(generateShadowColor(legendaryColor), 1)}, 0.5);

        --epic-main: rgba(${hexToRgb(epicColor)}, 1);
        --epic-dark: rgba(${hexToRgb(generateShadowColor(epicColor), 1)});
        --epic-backdrop: rgba(${hexToRgb(generateShadowColor(epicColor), 1)}, 0.5);

        --ultra-rare-main: rgba(${hexToRgb(ultraRareColor)}, 1);
        --ultra-rare-dark: rgba(${hexToRgb(generateShadowColor(ultraRareColor), 1)});
        --ultra-rare-backdrop: rgba(${hexToRgb(generateShadowColor(ultraRareColor), 1)}, 0.5);

        --rare-main: rgba(${hexToRgb(rareColor)}, 1);
        --rare-dark: rgba(${hexToRgb(generateShadowColor(rareColor), 1)});
        --rare-backdrop: rgba(${hexToRgb(generateShadowColor(rareColor), 1)}, 0.5);

        --uncommon-main: rgba(${hexToRgb(uncommonColor)}, 1);
        --uncommon-dark: rgba(${hexToRgb(generateShadowColor(uncommonColor), 1)});
        --uncommon-backdrop: rgba(${hexToRgb(generateShadowColor(uncommonColor), 1)}, 0.5);

        --common-main: rgba(${hexToRgb(commonColor)}, 1);
        --common-dark: rgba(${hexToRgb(generateShadowColor(commonColor), 1)});
        --common-backdrop: rgba(${hexToRgb(generateShadowColor(commonColor), 1)}, 0.5);
      }

      .s4-card.legendary a.title {
        color: var(--legendary-b1);
      }

      .s4-card.epic a.title {
        color: var(--epic-b1);
      }

      .s4-card.ultra-rare a.title {
        color: var(--ultra-rare-b1);
      }

      .s4-card.rare a.title {
        color: var(--rare-b1);
      }

      .s4-card.uncommon a.title {
        color: var(--uncommon-b1);
      }

      .s4-card.common a.title {
        color: var(--common-b1);
      }
    `)
  }

  function hexToRgb(hex) {
    var bigint = parseInt(hex.slice(1), 16)
    var r = (bigint >> 16) & 255
    var g = (bigint >> 8) & 255
    var b = bigint & 255
    return r + ',' + g + ',' + b
  }

  function hexToHsl(hex) {
    hex = hex.replace(/^#/, '')
    let bigint = parseInt(hex, 16)
    let r = (bigint >> 16) & 255
    let g = (bigint >> 8) & 255
    let b = bigint & 255

    ;(r /= 255), (g /= 255), (b /= 255)
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b)
    let h,
      s,
      l = (max + min) / 2

    if (max == min) {
      h = s = 0
    } else {
      let d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    h = Math.round(h * 360)
    s = Math.round(s * 100)
    l = Math.round(l * 100)
    return { h, s, l }
  }

  function hslToHex(h, s, l) {
    s /= 100
    l /= 100
    let c = (1 - Math.abs(2 * l - 1)) * s
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    let m = l - c / 2
    let r = 0,
      g = 0,
      b = 0

    if (0 <= h && h < 60) {
      r = c
      g = x
      b = 0
    } else if (60 <= h && h < 120) {
      r = x
      g = c
      b = 0
    } else if (120 <= h && h < 180) {
      r = 0
      g = c
      b = x
    } else if (180 <= h && h < 240) {
      r = 0
      g = x
      b = c
    } else if (240 <= h && h < 300) {
      r = x
      g = 0
      b = c
    } else if (300 <= h && h < 360) {
      r = c
      g = 0
      b = x
    }
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    let rgbToHex = n => n.toString(16).padStart(2, '0')
    return `#${rgbToHex(r)}${rgbToHex(g)}${rgbToHex(b)}`
  }

  function rgbToHsl(r, g, b) {
      r /= 255, g /= 255, b /= 255;
      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
          h = s = 0;
      } else {
          let d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h *= 60;
      }
      return { h, s: s * 100, l: l * 100 };
  }

  function hslToRgb(h, s, l) {
      s /= 100, l /= 100;
      let c = (1 - Math.abs(2 * l - 1)) * s;
      let x = c * (1 - Math.abs((h / 60) % 2 - 1));
      let m = l - c / 2;
      let [r, g, b] = (h < 60) ? [c, x, 0] :
                      (h < 120) ? [x, c, 0] :
                      (h < 180) ? [0, c, x] :
                      (h < 240) ? [0, x, c] :
                      (h < 300) ? [x, 0, c] : [c, 0, x];
      return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }

  function getAdjustedColor(hex) {
    let hsl = hexToHsl(hex)
    hsl.l = Math.min(hsl.l + 20, 100)
    return hslToHex(hsl.h, hsl.s, hsl.l)
  }

  function generateShadowColor(hex) {
      let [r, g, b] = hex.match(/\w\w/g).map(c => parseInt(c, 16));

      let { h, s, l } = rgbToHsl(r, g, b);

      let shadowL = Math.max(l * 0.25, 10);
      let shadowS = Math.max(s * 0.9, 15);

      let [newR, newG, newB] = hslToRgb(h, shadowS, shadowL);

      return `#${((1 << 24) | (newR << 16) | (newG << 8) | newB).toString(16).slice(1)}`;
  }
})()

// ==UserScript==
// @name         Card Preview
// @namespace    Kra
// @version      1.0
// @description  Preview cards
// @author       Kractero
// @match        https://www.nationstates.net/page=upload_flag
// @match				 https://www.nationstates.net/page=deck/card=*
// @grant        none
// ==/UserScript==

const existingContentDiv = document.getElementById("content");
const headinger = document.createElement("h1");
headinger.textContent = "Preview a Card with a flag";

const input = document.createElement("input");
input.setAttribute("type", "text");
input.setAttribute("id", "userInput");
input.placeholder = "Testlandia";

const button = document.createElement("button");
button.setAttribute("id", "submitButton");
button.classList.add("button");
button.textContent = "Submit";

const contentDiv = document.createElement("div");

if (window.location.href.includes("upload_flag")) {
  contentDiv.appendChild(headinger);
  contentDiv.appendChild(input);
  contentDiv.appendChild(button);
  existingContentDiv.prepend(contentDiv);
  const previewButton = document.createElement("button");
  previewButton.setAttribute("id", "previewButton");
  previewButton.classList.add("button");
  previewButton.textContent = "Preview Flag";
  previewButton.addEventListener('click', () => {
    fetchData(document.querySelector("#previewimage").getAttribute("src"));
  });
  document.querySelector('fieldset').appendChild(previewButton);
} else {
  const buttonDiv = document.createElement("div");
  buttonDiv.setAttribute("id", "center");
  buttonDiv.style.width = "100%";
  buttonDiv.style.display = "flex";
  buttonDiv.style.justifyContent = "center";
  buttonDiv.appendChild(button);
  existingContentDiv.insertBefore(
    buttonDiv,
    document.querySelector(".minorinfo")
  );
}

const stylesheet = document.createElement("link");

stylesheet.rel = "stylesheet";
stylesheet.type = "text/css";
stylesheet.href = "https://www.nationstates.net/deck_v1669164404.css";

const cards = document.createElement("div");
cards.id = "cards";

document.head.appendChild(stylesheet);

const validBadges = [
  "Founder",
  "Retired Moderator",
  "Easter Egg",
  "Issues Author",
  "Postmaster",
  "Postmaster-General",
  "Historical Resolution Author",
  "General Assembly Resolution Author",
  "Moderator",
  "Site Supporter",
];

async function fetchData(preview) {
  try {
    let nation = document.querySelector("#loggedin");
    if (!nation) {
      return;
    }
    nation = nation.getAttribute("data-nname");
    const nationResponse = await fetch(
      `https://www.nationstates.net/nation=${input.value ? input.value : document.querySelector(".nname") ? document.querySelector(".nname").textContent : nation
      }?script=CardPreview__by_Kractero__usedBy_${nation}&userclick=${Date.now()}`
    );
    const nationHTML = await nationResponse.text();
    const nationDocument = new DOMParser().parseFromString(
      nationHTML,
      "text/html"
    );

    let nationName = nationDocument.querySelector(".newtitlename a");
    if (nationName) {
      nationName = nationName.textContent;
    } else {
      throw new Error("Invalid nation");
    }

    const nationApiResponse = await fetch(
      `https://www.nationstates.net/cgi-bin/api.cgi?nation=${input.value ? input.value : document.querySelector(".nname") ? document.querySelector(".nname").textContent : nation
      }&q=name+dbid+notable+gdp+population+flag+category+motto+demonym2plural+type+region`,
      {
        headers: {
          "User-Agent": `CardPreview by Kractero usedBy ${nation}`,
        },
      }
    );
    const nationXml = await nationApiResponse.text();
    const nationXmlDoc = new DOMParser().parseFromString(
      nationXml,
      "application/xml"
    );

    const name = nationXmlDoc.querySelector("NAME").textContent;
    const dbid = nationXmlDoc.querySelector("DBID").textContent;
    const type = nationXmlDoc.querySelector("TYPE").textContent;
    const motto = nationXmlDoc.querySelector("MOTTO").textContent;
    const category = nationXmlDoc.querySelector("CATEGORY").textContent;
    const population = nationXmlDoc.querySelector("POPULATION").textContent;
    let flag = preview || nationXmlDoc.querySelector("FLAG").textContent.trim();
    const demonym = nationXmlDoc.querySelector("DEMONYM2PLURAL").textContent;
    const gdp = nationXmlDoc.querySelector("GDP").textContent;
    const notable = nationXmlDoc.querySelector("NOTABLE").textContent;
    const region = nationXmlDoc.querySelector("REGION").textContent;

    const ccbadges = nationDocument.querySelector("#wabadges a");
    const cc = {};
    if (ccbadges) {
      (ccbadges.link = ccbadges.href),
        (ccbadges.img = ccbadges
          .querySelector("img")
          .getAttribute("src")
          .replace(".svg", ".png")),
        (ccbadges.title = ccbadges.querySelector("img").getAttribute("title"));
    }

    const badges = Array.from(
      nationDocument.querySelectorAll("#badge_rack .badge div")
    ).map((badge) => {
      return {
        class: badge.classList[0],
        name: badge.textContent,
        icon: badge.querySelector("i"),
      };
    });
    const trophiesCabinet = Array.from(
      nationDocument.querySelectorAll("#trophycabinet a")
    );
    const trophies = Array.from(
      nationDocument.querySelectorAll(".trophyrack > img")
    );

    const top3trophies = trophiesCabinet.slice(0, 3).map((trophy) => ({
      img: trophy.querySelector("img").getAttribute("src"),
      text: trophy.querySelector("img").getAttribute("title"),
      link: trophy.href,
    }));

    const mainBadges = trophies
      .map((trophy) => {
        const title = trophy.getAttribute("title");
        const src = trophy.getAttribute("src");
        return {
          title:
            validBadges.includes(title) || title.includes("Easter Egg")
              ? title
              : null,
          src: src,
        };
      })
      .filter((badge) => badge);

    const rarities = [
      "common",
      "uncommon",
      "rare",
      "ultra-rare",
      "epic",
      "legendary",
    ];

    const numberOfDigits = population.length;
    let formattedPopulation;
    if (numberOfDigits >= 5) {
      formattedPopulation =
        population.slice(0, 2) + "." + population.slice(2) + " billion";
    } else if (numberOfDigits === 4) {
      formattedPopulation =
        population.slice(0, 1) + "." + population.slice(1) + " billion";
    } else if (numberOfDigits === 3) {
      formattedPopulation =
        population.slice(0, 1) + "." + population.slice(1) + " million";
    } else if (numberOfDigits === 2) {
      formattedPopulation = population.slice(0, 2) + " million";
    } else if (numberOfDigits === 1) {
      formattedPopulation = population + " million";
    }

    const economyDigits = gdp.length;
    let econPrefix;
    if (economyDigits >= 13) {
      econPrefix = `T`;
    } else if (economyDigits >= 10) {
      econPrefix = `B`;
    } else if (economyDigits >= 7) {
      econPrefix = `M`;
    } else {
      econPrefix = `M`;
    }

    let s1rarity = document.querySelector(".deckcard-category", "::before")
      ? window
        .getComputedStyle(
          document.querySelector(".deckcard-category"),
          "::before"
        )
        .getPropertyValue("content")
        .replace('"', "")
        .toLowerCase()
      : rarities[Math.floor(Math.random() * rarities.length)];
    let s2rarity = document.querySelector(".deckcard-category", "::before")
      ? window
        .getComputedStyle(
          document.querySelector(".deckcard-category"),
          "::before"
        )
        .getPropertyValue("content")
        .replace('"', "")
        .toLowerCase()
      : rarities[Math.floor(Math.random() * rarities.length)];
    let s3rarity = document.querySelector(".deckcard-category", "::before")
      ? window
        .getComputedStyle(
          document.querySelector(".deckcard-category"),
          "::before"
        )
        .getPropertyValue("content")
        .replace('"', "")
        .toLowerCase()
      : rarities[Math.floor(Math.random() * rarities.length)];

    const hachteeml = `
        <div class="deckcard-container">
            <div class="deckcard deckcard-season-1 " data-cardid="1" data-season="1"
                style="border: thick solid rgb(0, 0, 255);">
                <figure class="front deckcard-category-${s1rarity}">
                    <div class="deckcard-flag"
                        style="background-image:url(${flag})">
                        <div class="deckcard-info">
                            <div class="deckcard-info-content">
                                <div class="deckcard-info-cardnumber"><a href="/page=deck/card=${dbid}/season=1">#1</a></div>
                                <div class="deckcard-info-cardlink"><a href="/page=deck/card=${dbid}/season=1">Info</a></div>
                                <div class="deckcard-info-cardbuttons">
                                    <a href="#" class="button deckcard-junk-button danger " data-junkprice="1.00"
                                        data-rarity="${s1rarity}" data-cardid="1" data-season="1">Junk</a>
                                    <a href="/page=deck/card=${dbid}/season=1/gift=1" class="button ">Gift</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="deckcard-category"></div>
                    <div class="deckcard-title"><a href="nation=${name}" class="nlink nameblock"><span
                                class="nnameblock"><span class="ntype">The ${type} of</span> <span
                                    class="nname">${name}</span></span></a></div>
                    <div class="deckcard-lower">
                        <div class="deckcard-govt">${category}</div>
                        <div class="deckcard-slogan">“${motto}”</div>
                        <div class="deckcard-badges">
                            <div>
                                ${badges
        .map((badge) => {
          return `
                                            <div class="badge">
                                                <div class="${badge.class}">
                                                    ${badge.icon
              ? `<i class="${badge.icon.classList[0]}"></i>`
              : ""
            }
                                                    ${badge.name}
                                                </div>
                                            </div>
                                        `;
        })
        .join("")}
                            </div>
                            ${cc && cc.link
        ? `<div>
                                <div id="wabadges">
                                    <a class="wabadge" href="${cc.link}">
                                        <img
                                            src="${cc.img}" class="badge"
                                            alt="${cc.title}"
                                            title="${cc.title}">
                                    </a>
                                </div>
                            </div>`
        : ""
      }
                            <div class="specialbadges">
                                ${mainBadges
        .map((badge) => {
          return `
                                            <img src="${badge.src}" class="trophy" title="${badge.title}">
                                        `;
        })
        .join("")}
                            </div>
                            <div id="trophycabinet">
                                ${top3trophies
        .map((trophy) => {
          return `
                                            <a href="${trophy.link}">
                                                <img
                                                src="${trophy.img}" class="trophy"
                                                alt="${trophy.text}" title="${trophy.text}">
                                            </a>
                                        `;
        })
        .join("")}
                            </div>
                        </div>
                        <div class="deckcard-desc">${formattedPopulation} ${demonym}. ${notable.charAt(0).toUpperCase() + notable.slice(1)
      }</div>
                    </div>
                    <div class="deckcard-stripe">
                        <div class="deckcard-season">SEASON ONE</div>
                        <div class="deckcard-region"><a href="region=${region}" class="rlink">${region}</a></div>
                    </div>
                </figure>
                <figure class="back"></figure>
            </div>
        </div>
        <div class="deckcard-container">
            <div class="deckcard deckcard-season-2 " data-cardid="${dbid}" data-season="2">
                <figure class="front deckcard-category-${s2rarity}">
                    <div class="deckcard-flag" style="background-image:url(${flag})">
                        <div class="deckcard-info">
                            <div class="deckcard-info-content">
                                <div class="deckcard-info-cardnumber"><a href="/page=deck/card=${dbid}/season=2">#${dbid}
                                        /2</a></div>
                                <div class="deckcard-info-cardlink"><a href="/page=deck/card=${dbid}/season=2">Info</a></div>
                                <div class="deckcard-info-cardbuttons">
                                    <a href="#" class="button deckcard-junk-button danger " data-junkprice="0.50"
                                        data-rarity="${s2rarity}" data-cardid="${dbid}" data-season="2">Junk</a>
                                    <a href="/page=deck/card=${dbid}/season=2/gift=1" class="button ">Gift</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="deckcard-category"></div>
                    <div class="deckcard-title"><a href="nation=${name}" class="nlink nameblock"><span
                                class="nnameblock"><span class="ntype">The ${type} of</span> <span
                                    class="nname">${name}</span></span></a></div>
                    <div class="deckcard-lower">
                        <div class="deckcard-govt">${category}</div>
                        <div class="deckcard-slogan">“${motto}”</div>
                        <div class="deckcard-badges">
                            <div>
                                ${badges
        .map((badge) => {
          return `
                                            <div class="badge">
                                                <div class="${badge.class}">
                                                    ${badge.icon
              ? `<i class="${badge.icon.classList[0]}"></i>`
              : ""
            }
                                                    ${badge.name}
                                                </div>
                                            </div>
                                        `;
        })
        .join("")}
                            </div>
                            ${cc && cc.link
        ? `<div>
                                <div id="wabadges">
                                    <a class="wabadge" href="${cc.link}">
                                        <img
                                            src="${cc.img}" class="badge"
                                            alt="${cc.title}"
                                            title="${cc.title}">
                                    </a>
                                </div>
                            </div>`
        : ""
      }
                            <div class="specialbadges">
                                ${mainBadges
        .map((badge) => {
          return `
                                            <img src="${badge.src}" class="trophy" title="${badge.title}">
                                        `;
        })
        .join("")}
                            </div>
                            <div id="trophycabinet">
                                ${top3trophies
        .map((trophy) => {
          return `
                                            <a href="${trophy.link}">
                                                <img
                                                src="${trophy.img}" class="trophy"
                                                alt="${trophy.text}" title="${trophy.text}">
                                            </a>
                                        `;
        })
        .join("")}
                            </div>
                        </div>
                        </div>
                        <div class="deckcard-desc"><span class="deckcard-desc-bit">${formattedPopulation.slice(
          0,
          4
        )}<span class="pop-units">b</span><i
                                    class="icon-male"></i></span><span class="deckcard-desc-bit">${gdp.slice(
          0,
          5
        )}<span
                                    class="pop-units">${econPrefix}</span><i class="icon-industrial-building"></i></span></div>
                    </div>
                    <div class="deckcard-stripe">
                        <div class="deckcard-season">SEASON TWO</div>
                        <div class="deckcard-region"><a href="region=${region}" class="rlink">${region}</a></div>
                    </div>
                </figure>
                <figure class="back"></figure>
            </div>
        </div>
        <div class="deckcard-container">
            <div class="deckcard deckcard-season-3 " data-cardid="${dbid}" data-season="3">
                <figure class="front deckcard-category-${s3rarity}">
                    <div class="s3-content">
                        <div class="s3-upper">
                            <div class="s3-flagbox">
                                <div class="s3-flag">
                                    <div class="s3-flag-image"
                                        style="background-image:url(${flag})"></div>
                                </div>
                            </div>
                            <div class="s3-topline">
                                <div class="s3-topbox">
                                    <div class="s3-slogan">
                                    ${motto}
                                    </div>
                                </div>
                            </div>
                            <div class="deckcard-name">
                                <a href="nation=${name}" class="nlink nameblock"><span class="nnameblock"><span
                                            class="ntype">The ${type} of</span> <span
                                            class="nname">${name}</span></span></a>
                            </div>
                        </div>
                        <div class="s3-mid deckcard-badges">
                        ${cc && cc.link
        ? `<div>
                            <div id="wabadges">
                                <a class="wabadge" href="${cc.link}">
                                    <img
                                        src="${cc.img}" class="badge"
                                        alt="${cc.title}"
                                        title="${cc.title}">
                                </a>
                            </div>
                        </div>`
        : ""
      }
                        <div class="role-badges">
                            ${badges
        .map((badge) => {
          return `
                                        <div class="badge">
                                            <div class="${badge.class}">
                                                ${badge.icon
              ? `<i class="${badge.icon.classList[0]}"></i>`
              : ""
            }
                                                ${badge.name}
                                            </div>
                                        </div>
                                    `;
        })
        .join("")}
                        </div>
                        <div class="trophies">
                            <div class="specialbadges">
                                ${mainBadges
        .map((badge) => {
          return `
                                            <img src="${badge.src}" class="trophy" title="${badge.title}">
                                        `;
        })
        .join("")}
                            </div>
                            <div id="trophycabinet">
                                ${top3trophies
        .map((trophy) => {
          return `
                                            <a href="${trophy.link}">
                                                <img
                                                src="${trophy.img}" class="trophy"
                                                alt="${trophy.text}" title="${trophy.text}">
                                            </a>
                                        `;
        })
        .join("")}
                            </div>
                        </div>
                        </div>
                        <div class="s3-lower">
                            <div class="deckcard-lower-collection deckcard-govt-collection">
                                <span class="deckcard-desc-bit">${formattedPopulation.slice(
          0,
          4
        )}<span class="pop-units">b</span><i
                                        class="icon-male"></i></span><span class="deckcard-desc-bit">${gdp.slice(
          0,
          5
        )}<span
                                        class="pop-units">${econPrefix}</span><i class="icon-industrial-building"></i></span>
                            </div>
                            <div class="deckcard-lower-collection">
                                <div class="deckcard-category"></div>
                                <div class="deckcard-govt">
                                    ${category}
                                </div>
                            </div>
                            <div class="deckcard-stripe">
                                <div class="deckcard-season">SEASON THREE</div>
                                <div class="deckcard-region"><a href="region=${region}" class="rlink">${region}</a></div>
                            </div>
                        </div>
                        <div class="deckcard-info">
                            <div class="deckcard-info-content">
                                <div class="deckcard-info-cardnumber"><a href="/page=deck/card=${dbid}/season=3">#${dbid} /3</a></div>
                                <div class="deckcard-info-cardlink"><a href="/page=deck/card=${dbid}/season=3">Info</a></div>
                                <div class="deckcard-info-cardbuttons">
                                    <a href="#" class="button deckcard-junk-button danger " data-junkprice="1.00"
                                        data-rarity="${s3rarity}" data-cardid="${dbid}" data-season="3">Junk</a>
                                    <a href="/page=deck/card=${dbid}/season=3/gift=1" class="button ">Gift</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </figure>
                <figure class="back"></figure>
            </div>
        </div>
        `;

    cards.innerHTML = hachteeml;
    if (window.location.href.includes("upload_flag")) {
      existingContentDiv.insertBefore(cards, contentDiv.nextSibling);
    } else {
      cards.style.justifyContent = "center";
      existingContentDiv.insertBefore(
        cards,
        document.querySelector(".minorinfo")
      );
    }

    const stylistic = document.createElement("style");
    stylistic.innerHTML = `
            #content {
                margin-top: 1rem;
                width: 100%;
            }
            #cards {
                display: flex;
            }
            .deckcard-season-1 {
                overflow: hidden;
            }
        `;
    document.getElementsByTagName("head")[0].appendChild(stylistic);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

document.getElementById("submitButton").addEventListener("click", () => fetchData());

// ==UserScript==
// @name         Puppet Switcher
// @namespace    Kra
// @version      1.0
// @description  Switch puppets
// @author       Kractero
// @match        https://www.nationstates.net/page=blank/preview
// @grant        none
// ==/UserScript==

const label = document.createElement("label");
label.setAttribute("for", "userInput");
label.textContent = "Enter something:";

const input = document.createElement("input");
input.setAttribute("type", "text");
input.setAttribute("id", "userInput");

const button = document.createElement("button");
button.setAttribute("id", "submitButton");
button.textContent = "Submit";

const contentDiv = document.createElement("div");

contentDiv.appendChild(label);
contentDiv.appendChild(input);
contentDiv.appendChild(button);

const existingContentDiv = document.getElementById("content");

existingContentDiv.innerHTML = "";
existingContentDiv.appendChild(contentDiv);

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
    "Site Supporter"
];

async function fetchData() {
    try {
        let nation = document.querySelector('#loggedin')
        if (!nation) return
        nation = nation.getAttribute('data-nname')
        const nationResponse = await fetch(`https://www.nationstates.net/nation=testlandia?script=CardPreview__by_Kractero__usedBy_${nation}&userclick=${Date.now()}`);
        const nationHTML = await nationResponse.text();
        const nationDocument = new DOMParser().parseFromString(nationHTML, "text/html");

        let nationName = nationDocument.querySelector('.newtitlename a');
        if (nationName) {
            nationName = nationName.textContent;
        } else {
            throw new Error("Invalid nation");
        }

        const nationApiResponse = await fetch("https://www.nationstates.net/cgi-bin/api.cgi?nation=testlandia&q=name+notable+gdp+population+flag+category+motto+demonym+type", {
          headers: {
            "User-Agent": `CardPreview by Kractero usedBy ${nation}`,
          },
        });
        const nationXml = await nationApiResponse.text();
        const nationXmlDoc = new DOMParser().parseFromString(nationXml, "application/xml");

        const name = nationXmlDoc.querySelector('NAME').textContent;
        const type = nationXmlDoc.querySelector('TYPE').textContent;
        const motto = nationXmlDoc.querySelector('MOTTO').textContent;
        const category = nationXmlDoc.querySelector('CATEGORY').textContent;
        const population = nationXmlDoc.querySelector('POPULATION').textContent;
        const flag = nationXmlDoc.querySelector('FLAG').textContent.trim();
        const demonym = nationXmlDoc.querySelector('DEMONYM').textContent;
        const gdp = nationXmlDoc.querySelector('GDP').textContent;
        const notable = nationXmlDoc.querySelector('NOTABLE').textContent;

        const badges = Array.from(nationDocument.querySelectorAll('#badge_rack .badge div')).map(badge => badge.classList[0]);
        const trophiesCabinet = Array.from(nationDocument.querySelectorAll('#trophycabinet img'));
        const trophies = Array.from(nationDocument.querySelectorAll('.trophyrack > img'));

        const top3trophies = trophiesCabinet.slice(0, 3).map(trophy => ({
            img: trophy.getAttribute('src'),
            text: trophy.getAttribute('title')
        }));

        const mainBadges = trophies
            .map(trophy => {
                const title = trophy.getAttribute('title');
                return validBadges.includes(title) || title.includes('Easter Egg') ? title : null;
            })
            .filter(badge => badge);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

document.getElementById("submitButton").addEventListener("click", fetchData);

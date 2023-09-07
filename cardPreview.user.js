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
const stylesheet = document.createElement("link");

stylesheet.rel = "stylesheet";
stylesheet.type = "text/css";
stylesheet.href = "https://www.nationstates.net/deck_v1669164404.css";

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

        const hachteeml = `<div class="deckcard-container">
        <div class="deckcard deckcard-season-1 " data-cardid="1" data-season="1" style="border: thick solid rgb(0, 0, 255);">
        <figure class="front deckcard-category-legendary">
        <div class="deckcard-flag" style="background-image:url(/images/cards/s1/uploads/testlandia__643246.png)">
        <div class="deckcard-info">
        <div class="deckcard-info-content">
        <div class="deckcard-info-cardnumber"><a href="/page=deck/card=1/season=1">#1</a></div>
        <div class="deckcard-info-cardlink"><a href="/page=deck/card=1/season=1">Info</a></div>
        <div class="deckcard-info-cardbuttons">
        <a href="#" class="button deckcard-junk-button danger " data-junkprice="1.00" data-rarity="LEGENDARY" data-cardid="1" data-season="1">Junk</a>
        <a href="/page=deck/card=1/season=1/gift=1" class="button ">Gift</a>
        </div>
        </div>
        </div>
        </div>
        <div class="deckcard-category"></div>
        <div class="deckcard-title"><a href="nation=testlandia" class="nlink nameblock"><span class="nnameblock"><span class="ntype">The Hive Mind of</span> <span class="nname">Testlandia</span></span></a></div>
        <div class="deckcard-lower">
        <div class="deckcard-govt">Inoffensive Centrist Democracy</div>
        <div class="deckcard-slogan">“Grr. Arg.”</div>
        <div class="deckcard-badges"><div><div class="badge"><div class="mod_status"><i class="icon-flash"></i> Admin</div></div><div class="badge"><div class="wa_status"><i class="icon-wa"></i> WA</div></div></div><div class="specialbadges"><img src="/images/trophies/founder.png" class="trophy" title="Founder"><img src="/images/trophies/mod.png" class="trophy" title="Moderator"><img src="/images/trophies/eegg3.png" class="trophy" title="Easter Eggs (3)"></div><div id="trophycabinet"><a href="/nation=testlandia/detail=trend?censusid=3"><img src="/images/trophies/population-1.png" class="trophy" alt="Largest Populations: 489th" title="Largest Populations: 489th"></a>
        <a href="/nation=testlandia/detail=trend?censusid=7"><img src="/images/trophies/eco-govt-5.png" class="trophy" alt="Most Eco-Friendly Governments: 3,556th" title="Most Eco-Friendly Governments: 3,556th"></a>
        <a href="/nation=testlandia/detail=trend?censusid=78"><img src="/images/trophies/aid-5.png" class="trophy" alt="Highest Foreign Aid Spending: 3,732nd" title="Highest Foreign Aid Spending: 3,732nd"></a></div></div>
        <div class="deckcard-desc">33.351 billion Testlandians. Museums and concert halls, punitive income tax rates, and devotion to social welfare.</div>
        </div>
        <div class="deckcard-stripe">
        <div class="deckcard-season">SEASON ONE</div>
        <div class="deckcard-region"><a href="region=testregionia" class="rlink">Testregionia</a></div>
        </div>
        </figure>
        <figure class="back"></figure>
        </div>
        </div>`
        const donk = document.createElement('div')
        donk.innerHTML = hachteeml

        existingContentDiv.append(donk)

    } catch (error) {
        console.error("Error:", error.message);
    }
}

document.getElementById("submitButton").addEventListener("click", fetchData);

// ==UserScript==
// @name         Check CTE Button
// @namespace    Kractero
// @version      1.0
// @description  Button to check CTE on a card
// @author       Kractero
// @match.       https://*.nationstates.net/page=deck/card=*
// @grant        none
// ==/UserScript==

const existingContentDiv = document.getElementById("content");

const button = document.createElement("button");
button.setAttribute("id", "cteButton");
button.classList.add("button");
button.textContent = "Check CTE";

const buttonDiv = document.createElement("div");
buttonDiv.setAttribute("id", "center");
buttonDiv.style.width = "100%";
buttonDiv.style.display = "flex";
buttonDiv.style.justifyContent = "center";
buttonDiv.appendChild(button);
existingContentDiv.insertBefore(
  buttonDiv,
  document.querySelector("#deck-single-card")
);

async function fetchData(preview) {
  try {
    let UA = document.querySelector("#loggedin");
    if (!UA) {
      return;
    }
    let nation = document.querySelector(".deckcard-container .nname");
    const nationResponse = await fetch(
      `https://www.nationstates.net/page=boneyard?nation=${nation.textContent}&script=Boneyard_Checker__by_Kractero__usedBy_${UA.textContent}&userclick=${Date.now()}`
    );
    const nationHTML = await nationResponse.text();
    const nationDocument = new DOMParser().parseFromString(
      nationHTML,
      "text/html"
    );
    const msg = nationDocument.querySelector('.error')
    if (!msg) {
      return
    }
    if (!msg.textContent.includes("In Use")) {
      document.querySelector('.deckcard-container').style.opacity = "0.5";
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}
document.getElementById("cteButton").addEventListener("click", () => fetchData());
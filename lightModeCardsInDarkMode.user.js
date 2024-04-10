// ==UserScript==
// @name         Remove Dark Mode Card Styles
// @version      1.0
// @description  Use light mode card styles in rift dark mode.
// @match        https://www.nationstates.net/*page=deck*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const existingStylesheet = document.querySelector('link[href="/deck.dark_v1690092016.css"]');

    if (existingStylesheet) {
        const inlineStyles = `
            .deckcard-season-1 {
                background-color: #fff;
            }

            .numberslug {
                background-color: #2a2a2a;
            }
            .auctionslisttable,
            .auctionstopcardstable,
            .auctiontradestable,
            .auctionsrecenttradestable,
            .auctionstopdeckstable,
            .deckscollectionstable,
            #cardauctiontable {
                background-color: #191919;
                border-top-left-radius: 1em !important;
                border-top-right-radius: 1em !important;
            }
            .auctiontradestable {
                margin-bottom: 25px;
            }
            .auctionslisttable > tbody > tr:first-child > td,
            .auctionsrecenttradestable > tbody > tr:first-child > td,
            .auctionstopcardstable > tbody > tr:first-child > td,
            .auctionstopdeckstable > tbody > tr:first-child > td,
            .deckscollectionstable > tbody > tr:first-child > td,
            .auctiontradestable > tbody > tr:first-child > td,
            .auctionbidstable > tbody > tr:first-child > td,
            table#editcollectiontable > tbody > tr:first-child > td {
                background: #252525 !important;
                color: #d0d0d0 !important;
            }
            .auctionslisttable > tbody > tr:first-child:hover,
            .auctionsrecenttradestable > tbody > tr:first-child:hover,
            .auctionstopcardstable > tbody > tr:first-child:hover,
            .auctionstopdeckstable > tbody > tr:first-child:hover,
            .deckscollectionstable > tbody > tr:first-child:hover,
            .auctiontradestable > tbody > tr:first-child:hover,
            .auctionbidstable > tbody > tr:first-child:hover,
            table#editcollectiontable > tbody > tr:first-child:hover {
                background: 0 0 !important;
            }
            table.shiny.wide.deckcard-card-stats {
                margin-bottom: 1em;
                border-radius: 1em;
            }
            #cardauctionoffertable th:hover {
                background: #2a2a2a;
            }
            #cardauctiontable th {
                background-color: #444;
            }
            .cardauctionmatchedrow {
                background-color: #39390d;
            }
            #cardauctiontable td.auction-self-matched {
                background-color: rgba(255, 255, 0, 0.1);
            }
            #cardauctiontable tbody td,
            .auctionsrecenttradestable {
                border-bottom-color: #888;
            }
            .num-of-rarity-second {
            border-left: none;
            }
            .deckcard-token.deckcard-category-legendary,
            .decklist-section.deckcard-category-legendary,
            .deckcard-filters .deckcard-category-legendary {
                background-color: rgba(255, 215, 0, 0.3);
            }
            .deckcard-token.deckcard-category-epic,
            .decklist-section.deckcard-category-epic,
            .deckcard-filters .deckcard-category-epic {
                background-color: rgba(219, 158, 28, 0.3);
            }
            .deckcard-token.deckcard-category-ultra-rare,
            .decklist-section.deckcard-category-ultra-rare,
            .deckcard-filters .deckcard-category-ultra-rare {
                background-color: rgba(172, 0, 230, 0.3);
            }
            .deckcard-token.deckcard-category-rare,
            .decklist-section.deckcard-category-rare,
            .deckcard-filters .deckcard-category-rare {
                background-color: rgba(0, 142, 193, 0.3);
            }
            .deckcard-token.deckcard-category-uncommon,
            .decklist-section.deckcard-category-uncommon,
            .deckcard-filters .deckcard-category-uncommon {
                background-color: rgba(0, 170, 76, 0.3);
            }
            .deckcard-token.deckcard-category-common,
            .decklist-section.deckcard-category-common,
            .deckcard-filters .deckcard-category-common {
                background-color: rgba(126, 126, 126, 0.3);
            }
            .deckcard-token {
                border: 1px solid #000;
                color: #bababa !important;
            }
            .deckcard-token.deckcard-category-legendary.unselected,
            .deckcard-token.deckcard-category-epic.unselected,
            .deckcard-token.deckcard-category-ultra-rare.unselected,
            .deckcard-token.deckcard-category-rare.unselected,
            .deckcard-token.deckcard-category-uncommon.unselected,
            .deckcard-token.deckcard-category-common.unselected {
                border: 1px solid #000;
                color: #aaa !important;
            }
            .deckcard-token.deckcard-category-legendary.unselected:hover,
            .deckcard-token.deckcard-category-epic.unselected:hover,
            .deckcard-token.deckcard-category-ultra-rare.unselected:hover,
            .deckcard-token.deckcard-category-rare.unselected:hover,
            .deckcard-token.deckcard-category-uncommon.unselected:hover,
            .deckcard-token.deckcard-category-common.unselected:hover,
            .deckcard-filters .deckcard-token.selected {
                border: 1px solid #d0d0d0;
                color: #d0d0d0 !important;
            }
            .deckcard-token.deckcard-owned {
                background-color: #000;
            }
            .deckcard-filters .deckcard-token.deckcard-season-season-1 {
                background-color: #c46060;
                color: #191919 !important;
            }
            .deckcard-filters .deckcard-token.deckcard-season-season-2 {
                background-color: #659ac9;
                color: #191919 !important;
            }
            .deckcard-filters .deckcard-token.deckcard-season-season-3 {
                background-color: #bfa860;
                color: #191919 !important;
            }
            .deckcard-token.deckcard-season-season-1.unselected .num-of-rarity-first,
            .deckcard-token.deckcard-season-season-2.unselected .num-of-rarity-first,
            .deckcard-token.deckcard-season-season-3.unselected .num-of-rarity-first {
                border-right: 1px solid #191919;
            }
            .deckcard-filters .deckcard-token.deckcard-season-season-1:hover,
            .deckcard-filters .deckcard-token.deckcard-season-season-2:hover,
            .deckcard-filters .deckcard-token.deckcard-season-season-3:hover {
                border: 1px solid #d0d0d0;
                color: #000 !important;
            }
            .deckcard-season-list-card-unselected {
                border: 1px solid #000;
                padding: 0.5em 0.5em 0.75em;
            }
            .deckcard-season-list-card-unselected:hover {
                border: 1px solid #d0d0d0;
                border-radius: 3px;
                padding: 0.5em 0.5em 0.75em;
            }
            .deckcard-token.unselected:hover {
                color: #6e6e6e !important;
            }
            #chart-container {
                margin-bottom: 15px;
            }
            .deckcard-card-stats td {
                border-radius: 3px !important;
            }
            .deckcard-card-stats td:nth-child(1) {
                color: #999 !important;
            }
        `;

        const newStyle = document.createElement('style');
        newStyle.innerHTML = inlineStyles;

        existingStylesheet.parentNode.replaceChild(newStyle, existingStylesheet);
    }
})();

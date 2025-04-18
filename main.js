import { Gameboard } from "./js/gameboard.js";

/**
 * @type {Gameboard | undefined}
 */
let gameboard;

window.addEventListener("load", init, false);



async function init() {
    gameboard = new Gameboard();
    const jsonData = await gameboard.loadJSON("./assets/oitavos.json");
    gameboard.createCards(jsonData);
}

/**
 * Aplicações multimédia - Trabalho Prático 1
 * (c) Catarina Cruz, 2025
 */

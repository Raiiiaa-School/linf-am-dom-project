import { Gameboard } from "./js/gameboard.js";

window.addEventListener("load", init, false);

async function init() {
    const gameboard = new Gameboard();
    const jsonData = await gameboard.loadJSON("./assets/oitavos.json");
    gameboard.createCards(jsonData);
    await gameboard.start();
}

/**
 * Aplicações multimédia - Trabalho Prático 1
 * (c) Catarina Cruz, 2025
 */

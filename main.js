import { Gameboard } from "./js/gameboard.js";

/**
 * @type {Gameboard | undefined}
 */
let gameboard;

window.addEventListener("load", init, false);

async function init() {
    gameboard = new Gameboard();
    await gameboard.initialize(); // Usar o método initialize que agora inclui o loadJSON e createCards
}

/**
 * Aplicações multimédia - Trabalho Prático 1
 * (c) Catarina Cruz, 2025
 */
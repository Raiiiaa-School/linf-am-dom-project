import { Gameboard } from "./js/gameboard.js";
import { Timer } from "./js/timer.js";

/**
 * @type {Gameboard | undefined}
 */
let gameboard;
let timer;

window.addEventListener("load", init, false);

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
      if (timer) {
          timer.reset();
          timer.start();
      }
  }
});

async function init() {
    gameboard = new Gameboard();
    const jsonData = await gameboard.loadJSON("./assets/oitavos.json");
    gameboard.createCards(jsonData);

    timer = new Timer(gameboard);
    timer.start();
}

/**
 * Aplicações multimédia - Trabalho Prático 1
 * (c) Catarina Cruz, 2025
 */

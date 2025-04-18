import { CountryFaces, Card } from "./card.js";
import { Sounds } from "./sound.js";
import { Timer } from "./timer.js";

/**
 * Represents a game board with sounds and board properties.
 */
export class Gameboard {
    BOARD_SIZE = 4;
    /**
     * @type {Sounds}
     */
    sounds;
    /**
     * @type {Array<Card>}
     */
    board = [];
    /**
     * @type {Array<Card>}
     */
    facedCards = [];
    /**
     * @type {Timer}
     */
    timer;
    #element;

    constructor() {
        this.sounds = new Sounds();
        this.#element = document.querySelector("#stage");

        this.timer = new Timer (() => {
            this.shuffleCards();
        });
    
        this.timer.start();

        window.addEventListener("keydown", (e) => {
            if (e.code === "Space") {
                this.resetTimer();
            }
        });
    }

    resetTimer() {
        if (this.timer) {
            this.timer.reset();
            this.timer.start();
        }
    }

    createCards(jsonData) {
        for (let i = 0; i < this.BOARD_SIZE * this.BOARD_SIZE; i++) {
            const faces = Object.values(CountryFaces);
            const card = new Card(
                faces[Math.floor(i / 2)],
                this.#element,
                jsonData,
            );
            this.board.push(card);
        }

        
        this.shuffleCards();
    }

    shuffleCards() {
        const positions = [];

        this.board.forEach((card) => {
            if (card.isFace) {
                return;
            }

            let x = 0;
            let y = 0;
            do {
                x = Math.floor(Math.random() * this.BOARD_SIZE);
                y = Math.floor(Math.random() * this.BOARD_SIZE);
            } while (
                positions.some((pos) => pos.x === x && pos.y === y) ||
                this.facedCards.some((card) => card.x === x && card.y === y)
            );

            card.x = x;
            card.y = y;
            positions.push({ x, y });

            card.render();
        });
    }

    async loadJSON(path) {
        try {
            const res = await fetch(path);
            if (!res.ok) {
                throw new Error(
                    `Error fetching the file. Status: ${res.status}`,
                );
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error fetching or parsing JSON: ", error);
        }
    }

    setupAudio() {
        this.sounds.background = document.querySelector("#backgroundSnd");
        this.sounds.success = document.querySelector("#successSnd");
        this.sounds.flip = document.querySelector("#flipSnd");
        this.sounds.hide = document.querySelector("#hideSnd");
        this.sounds.win = document.querySelector("#goalSnd");

        // definições de volume;
        game.sounds.background.volume = 0.05; // o volume varia entre 0 e 1

        // nesta pode-se mexer se for necessário acrescentar ou configurar mais sons
    }
}

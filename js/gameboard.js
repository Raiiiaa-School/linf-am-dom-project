import { CountryFaces, Card } from "./card.js";
import { Sounds } from "./sound.js";
import { Timer } from "./timer.js";

/**
 * Represents a game board with sounds and board properties.
 */
export class Gameboard {
    /**
     * @type {number}
     */
    BOARD_SIZE = 4;
    /**
     * @type {Sounds}
     */
    sounds;
    /**
     * @type {Timer}
     */
    shuffleTimer = new Timer(45000); // 45s
    /**
     * @type {Timer}
     */
    secondsTimer = new Timer(1000, true); // 1s
    /**
     * @type {Array<Card>}
     */
    cards = [];
    /**
     * @type {Array<Card>}
     */
    matchedCards = [];
    /**
     * @type {Array<Card>}
     */
    selectedCards = [];
    /**
     * @type {HTMLDivElement}
     */
    #element;
    /**
     * @type {HTMLProgressElement}
     */
    progressElement;

    constructor() {
        this.sounds = new Sounds();
        this.#element = document.querySelector("#stage");
        this.progressElement = document.querySelector("#time");
        Card.gameboard = this;

        this.shuffleTimer.setOnComplete(() => {
            this.shuffleCards();
            this.progressElement.value = 0;
            this.progressElement.classList.remove("blink");
        });

        this.secondsTimer.setOnComplete(() => {
            this.progressElement.value++;

            if (this.shuffleTimer.getRemaining() <= 5000) {
                this.progressElement.classList.add("blink");
            }
        });
    }

    /**
     * Starts the game.
     */
    start() {
        this.sounds.background.play();
        this.shuffleCards();
        this.progressElement.value = 0;
        this.shuffleTimer.start();
        this.secondsTimer.start();
    }

    /**
     * Creates the cards.
     * @param {Object} jsonData - The JSON data of the cards.
     */
    createCards(jsonData) {
        for (let i = 0; i < this.BOARD_SIZE * this.BOARD_SIZE; i++) {
            const faces = Object.values(CountryFaces);
            const card = new Card(
                faces[Math.floor(i / 2)],
                this.#element,
                jsonData,
            );
            this.cards.push(card);
        }
    }

    /**
     * Checks if the selected cards can be added.
     * @returns {boolean} - True if the selected cards can be added, false otherwise.
     */
    canAddSelectedCard() {
        if (this.selectedCards.length >= 2) {
            console.log("You can't select more than 2 cards");
            return false;
        }
        return true;
    }

    /**
     * Adds a selected card to the game board.
     * @param {Card} card - The card to be added.
     */
    addSelectedCard(card) {
        if (!this.canAddSelectedCard()) {
            return;
        }
        this.selectedCards.push(card);
        this.sounds.flip.play();

        if (this.selectedCards.length !== 2) {
            return;
        }

        this.handleSelectedPair();
    }

    /**
     * Handles the selected pair of cards.
     */
    handleSelectedPair() {
        if (!this.selectedCards.at(0).compare(this.selectedCards.at(-1))) {
            this.handleUnmatchedPair();
            return;
        }

        this.handleMatchedPair();
    }

    /**
     * Handles the unmatched pair of cards.
     */
    handleUnmatchedPair() {
        this.resetGameLoop(1000, false);
    }

    /**
     * Handles the matched pair of cards.
     */
    handleMatchedPair() {
        this.matchedCards.push(this.selectedCards.at(0));
        this.matchedCards.push(this.selectedCards.at(-1));

        this.selectedCards.forEach((card) => {
            card.handleMatch();
        });
        this.resetGameLoop(1000, true);

        if (this.matchedCards.length >= this.cards.length) {
            this.win();
        }
    }

    /**
     * Resets the game loop.
     */
    resetGameLoop(time = 1000, match = false) {
        setTimeout(() => {
            if (!match) {
                this.selectedCards.forEach((card) => {
                    card.showBack();
                });
                this.sounds.hide.play();
            }
            this.selectedCards = [];
        }, time);
    }

    /**
     * Handles the win condition.
     */
    win() {
        this.sounds.win.play();
    }

    /**
     * Shuffles the cards.
     */
    shuffleCards() {
        const positions = [];

        this.cards.forEach((card) => {
            let x = 0;
            let y = 0;
            do {
                x = Math.floor(Math.random() * this.BOARD_SIZE);
                y = Math.floor(Math.random() * this.BOARD_SIZE);
            } while (
                positions.some((pos) => pos.x === x && pos.y === y) ||
                this.matchedCards.some((card) => card.x === x && card.y === y)
            );

            card.x = x;
            card.y = y;
            positions.push({ x, y });

            card.render();
        });
    }

    /**
     * Loads JSON data from a given path.
     * @param {string} path - The path to the JSON file.
     * @returns {Promise<Object>} - A promise that resolves with the JSON data.
     */
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
}

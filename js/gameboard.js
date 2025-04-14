import { CountryFaces, Card } from "./card.js";
import { Sounds } from "./sound.js";

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

    constructor() {
        this.sounds = new Sounds();
        this.#element = document.querySelector("#stage");
        Card.gameboard = this;
    }

    start() {
        this.sounds.background.play();
        this.shuffleCards();
    }

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

    canAddSelectedCard() {
        if (this.selectedCards.length >= 2) {
            console.log("You can't select more than 2 cards");
            return false;
        }
        return true;
    }
    /**
     * @param {Card} card
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

    handleSelectedPair() {
        if (!this.selectedCards.at(0).compare(this.selectedCards.at(-1))) {
            this.handleUnmatchedPair();
            return;
        }

        this.handleMatchedPair();
    }

    handleUnmatchedPair() {
        this.resetGameLoop(1000, false);
    }

    handleMatchedPair() {
        this.matchedCards.push(this.selectedCards.at(0));
        this.matchedCards.push(this.selectedCards.at(-1));

        this.selectedCards.forEach((card) => {
            card.handleMatch();
        });

        this.sounds.success.play();
        this.resetGameLoop(1000, true);

        if (this.matchedCards.length >= this.cards.length) {
            this.win();
        }
    }

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

    win() {
        this.sounds.win.play();
    }

    shuffleCards() {
        const positions = [];

        this.cards.forEach((card) => {
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
                this.matchedCards.some((card) => card.x === x && card.y === y)
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
}

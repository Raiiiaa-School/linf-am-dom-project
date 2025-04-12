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

        this.shuffleCards();
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

        if (this.selectedCards.length !== 2) {
            return;
        }

        this.handleSelectedPair();
    }

    handleSelectedPair() {
        const card1 = this.selectedCards.at(0);
        const card2 = this.selectedCards.at(-1);

        if (!card1.compare(card2)) {
            this.resetGameLoop(1000, false);
            return;
        }

        console.log("They are equal. They stay here");
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);

        this.resetGameLoop(1000, true);
    }

    resetGameLoop(time = 1000, match = false) {
        setTimeout(() => {
            if (!match) {
                this.selectedCards.forEach((card) => {
                    card.showBack();
                });
            }
            this.selectedCards = [];
        }, time);
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

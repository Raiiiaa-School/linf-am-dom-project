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
    shuffleTimer = new Timer(4500, true); // 45s
    /**
     * @type {Timer}
     */
    secondsTimer = new Timer(100, true); // 1s
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
    /**
     * @type {HTMLDivElement}
     */
    overlayElement;

    constructor() {
        this.sounds = new Sounds();
        this.#element = document.querySelector("#stage");
        this.progressElement = document.querySelector("#time");
        this.overlayElement = document.querySelector(".overlay");
        Card.gameboard = this;

        this.shuffleTimer.setOnComplete(async () => {
            this.progressElement.value = 0;
            this.progressElement.classList.remove("blink");
            this.overlayElement.classList.add("hidden");

            await this.shuffleCards();
        });

        this.secondsTimer.setOnComplete(() => {
            this.progressElement.value++;

            if (this.shuffleTimer.getRemaining() <= 5000) {
                this.progressElement.classList.add("blink");
                this.overlayElement.classList.remove("hidden");
            }
        });
    }

    /**
     * Starts the game.
     */
    async start() {
        this.sounds.background.play();
        await this.shuffleCards();
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
     * @returns {Array<{x: number, y: number}>} - An array of new positions for the cards.
     */
    getShuffledCardPositions() {
        const positions = [];
        const availablePositions = [];

        // First, create a list of all possible positions
        for (let x = 0; x < this.BOARD_SIZE; x++) {
            for (let y = 0; y < this.BOARD_SIZE; y++) {
                availablePositions.push({ x, y });
            }
        }

        // Remove positions that are occupied by matched cards
        this.matchedCards.forEach((card) => {
            const index = availablePositions.findIndex(
                (pos) => pos.x === card.x && pos.y === card.y,
            );
            if (index !== -1) {
                availablePositions.splice(index, 1);
            }
            positions.push({ x: card.x, y: card.y }); // Keep matched cards in their positions
        });

        // Shuffle remaining available positions
        for (let i = availablePositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availablePositions[i], availablePositions[j]] = [
                availablePositions[j],
                availablePositions[i],
            ];
        }

        // Assign new positions to unmatched cards
        this.cards.forEach((card, index) => {
            if (availablePositions.length > 0) {
                positions.push(availablePositions.pop());
            }
        });

        return positions;
    }

    /**
     * Animates the cards to the center of the board and then to their new positions.
     * @param {Array<{x: number, y: number}>} newPositions - An array of new positions for the cards.
     * @param {number} animationDelay - Delay (ms) between card movements.
     */
    async animateShuffle(newPositions, animationDelay) {
        // Um pouco de magic numbering aqui :D
        const centerPosition = {
            x:
                this.#element.offsetWidth / 2 -
                this.cards[0].face.width / 2 -
                this.cards[0].face.width / 6,
            y:
                this.#element.offsetHeight / 2 -
                this.cards[0].face.height / 2 -
                this.cards[0].face.height / 6,
        };

        // First animation: Move cards to center one by one
        for (const card of this.cards) {
            card.removeEventListeners();
            await new Promise((resolve) => {
                // Store the original position for later
                card.originalX = card.x;
                card.originalY = card.y;

                // Update card's coordinates to match the center position
                card.x = centerPosition.x / card.face.width;
                card.y = centerPosition.y / card.face.height;

                card.animate((el) => {
                    el.style.left = `${centerPosition.x}px`;
                    el.style.top = `${centerPosition.y}px`;
                });
                setTimeout(resolve, animationDelay);
            });
        }

        await new Promise((resolve) => setTimeout(resolve, animationDelay));

        // Second animation: Move cards to their new positions one by one
        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            const newPos = newPositions[i];

            await new Promise((resolve) => {
                card.x = newPos.x;
                card.y = newPos.y;
                card.animate((el) => {
                    el.style.left = `${newPos.x * card.face.width}px`;
                    el.style.top = `${newPos.y * card.face.height}px`;
                });
                setTimeout(resolve, animationDelay);
            });

            card.addClickListener();
        }
    }

    /**
     * Shuffles the cards with a visual effect.
     * @param {number} animationDelay - Delay (ms) between card movements.
     */
    async shuffleCards(animationDelay = 50) {
        const newPositions = this.getShuffledCardPositions();
        await this.animateShuffle(newPositions, animationDelay);
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

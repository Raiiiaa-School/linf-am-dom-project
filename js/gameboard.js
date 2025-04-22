import { CountryFaces, Card } from "./card.js";
import { Dialog } from "./dialog.js";
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
     * @type {Timer}
     */
    shuffleTimer = new Timer(45000, true); // 45s
    /**
     * @type {Timer}
     */
    secondsTimer = new Timer(1000, true); // 1s

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
     * @type {number}
     */
    moves = 0;
    /**
     * @type {number}
     */
    turnWithoutMatched = 0;
    /**
     * @type {number}
     */
    maxCombo = 0;
    /**
     * @type {number}
     */
    combo = 0;
    /**
     * @type {number}
     */
    gameTime = 0;
    /**
     * @type {number}
     */
    challangeScore = 1000;
    /**
     * @type {number}
     */
    score = 0;
    /**
     * @type {number}
     */
    roundScore = 0;
    /**
     * @type {number}
     */
    highScore = 0;

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
    /**
     * @type {HTMLButtonElement}
     */
    restartButton;

    constructor() {
        this.#element = document.querySelector("#stage");
        this.progressElement = document.querySelector("#time");
        this.overlayElement = document.querySelector(".overlay");

        // Stats Elements
        this.scoreToBeatElement = document.querySelector(".score-to-beat");
        this.restartButton = document.querySelector(".game-buttons .restart");
        this.roundScoreElement = document.querySelector(".score-value");
        this.currentTimeElement = document.querySelector(".time-value");

        window.addEventListener("keydown", (event) => {
            this.onSpaceBar(event);
        });

        this.restartButton.addEventListener("click", () => {
            this.restart();
        });

        this.sounds = new Sounds();
        Card.gameboard = this;

        this.shuffleTimer.setOnComplete(async () => {
            this.progressElement.value = 0;
            this.progressElement.classList.remove("blink");
            this.overlayElement.classList.add("hidden");

            await this.shuffleCards();
        });

        this.secondsTimer.setOnComplete(() => {
            this.progressElement.value++;
            this.gameTime++;
            this.updateTime();

            if (this.shuffleTimer.getRemaining() <= 5000) {
                this.progressElement.classList.add("blink");
                this.overlayElement.classList.remove("hidden");
            }
        });
    }

    /**
     * Starts the game.
     */
    async start(startSound = true) {
        if (startSound) {
            this.sounds.background.play();
        }

        await this.shuffleCards();

        this.resetStats();

        this.shuffleTimer.restart();
        this.secondsTimer.restart();
    }

    restart() {
        this.cards.forEach((card) => {
            card.showBack();
        });

        this.selectedCards = [];
        this.matchedCards = [];

        this.start(false);
    }

    resetStats() {
        this.moves = 0;
        this.turnWithoutMatched = 0;
        this.maxCombo = 0;
        this.combo = 0;
        this.gameTime = 0;
        this.score = 0;
        this.roundScore = 0;
        this.progressElement.value = 0;
    }

    chooseDifficulty(restart = true) {
        this.dialog = new Dialog(document.body)
            .addTitle("Choose the difficulty")
            .addButton("Baby Steps", async (dialog) => {
                this.challangeScore = 1000;
                this.updateChallangeScore();
                dialog.close();
                if (restart) {
                    return this.restart();
                }
                await this.start();
            })
            .addButton("Normal", async (dialog) => {
                this.challangeScore = 2000;
                this.updateChallangeScore();
                dialog.close();
                if (restart) {
                    return this.restart();
                }
                await this.start();
            })
            .addButton("Hard", async (dialog) => {
                this.challangeScore = 3000;
                this.updateChallangeScore();
                dialog.close();
                if (restart) {
                    return this.restart();
                }
                await this.start();
            })
            .addButton("Gamer", async (dialog) => {
                this.challangeScore = 4000;
                this.updateChallangeScore();
                dialog.close();
                if (restart) {
                    return this.restart();
                }
                await this.start();
            })
            .addButton("Dark Souls", async (dialog) => {
                this.challangeScore = 5000;
                this.updateChallangeScore();
                dialog.close();
                if (restart) {
                    return this.restart();
                }
                await this.start();
            })
            .open();
    }

    updateChallangeScore() {
        this.scoreToBeatElement.textContent = this.challangeScore;
    }

    updateTime() {
        this.currentTimeElement.textContent = this.gameTime;
    }

    updateScore(gameFinish = false) {
        this.roundScore = 100;
        if (this.turnWithoutMatched > 0) {
            this.roundScore = Math.floor(
                this.roundScore / this.turnWithoutMatched,
            );
        }
        if (this.combo > 0) {
            this.roundScore = this.combo * this.roundScore;
        }

        if (gameFinish) {
            const MIN_TIME_MULT = 10;
            const MAX_TIME_MULT = 100;
            let timeScore = 100;
            let timeScoreMultiplier = Math.min(
                Math.max(MIN_TIME_MULT, Math.floor(100 / this.gameTime)),
                MAX_TIME_MULT,
            );

            this.roundScore += timeScore * timeScoreMultiplier;
        }

        this.score += this.roundScore;
        this.roundScoreElement.textContent = this.score;

        if (gameFinish && this.score > this.highScore) {
            this.highScore = this.score;
        }
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
        this.moves++;

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
        this.combo = 0;
        this.turnWithoutMatched++;
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

        this.combo++;
        this.turnWithoutMatched = 0;

        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }

        this.resetGameLoop(1000, true);

        if (this.matchedCards.length >= this.cards.length) {
            this.updateScore(true);
            this.win();
            return;
        }
        this.updateScore();
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
        this.shuffleTimer.pause();
        this.secondsTimer.pause();

        const winCondition = this.score >= this.challangeScore;

        const title = winCondition ? "Congratulations!" : "You lost!";

        const message = winCondition
            ? "You beat the challange! You did it! Feel proud of yourself!"
            : "You didn't beat the challange. Try again?";

        const dialog = new Dialog(document.body)
            .addTitle(title)
            .addText(message);

        if (winCondition) {
            dialog.addText(`Total time played: ${this.gameTime} seconds`);
            dialog.addText(`Total moves: ${this.moves}`);
            dialog.addText(`Max Combo: ${this.maxCombo}`);
            dialog.addText(`Your score: ${this.score}`);
            dialog.addText(`High Score: ${this.highScore}`);
        }

        dialog.addButton("Make it harder!", () => {
            this.chooseDifficulty();
            dialog.close();
        });
        dialog.addButton("Restart", (dialog) => {
            this.restart();
            dialog.close();
        });

        dialog.open();
    }

    /**
     * Shuffles the cards.
     * @returns {Array<{x: number, y: number}>} - An array of new positions for the cards.
     */
    getShuffledCardPositions() {
        const positions = new Array(this.BOARD_SIZE * this.BOARD_SIZE);

        if (this.matchedCards.length > 0) {
            this.matchedCards.forEach((card) => {
                const index = this.cards.indexOf(card);
                positions[index] = { x: card.x, y: card.y };
            });
        }

        this.cards.forEach((card, index) => {
            if (card.isMatched) {
                return;
            }

            let x, y;
            do {
                x = Math.floor(Math.random() * this.BOARD_SIZE);
                y = Math.floor(Math.random() * this.BOARD_SIZE);
            } while (positions.some((pos) => pos.x === x && pos.y === y));

            card.x = x;
            card.y = y;

            positions[index] = { x, y };
        });

        return positions;
    }

    /**
     * Animates the cards to the center of the board and then to their new positions.
     * @param {Array<{x: number, y: number}>} newPositions - An array of new positions for the cards.
     * @param {number} animationDelay - Delay (ms) between card movements.
     */
    async animateShuffle(newPositions, animationDelay) {
        if (this.selectedCards.length === 1) {
            this.selectedCards.forEach((card) => {
                card.showBack();
            });
            this.selectedCards = [];
        }

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
                card.originalX = card.x;
                card.originalY = card.y;

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

        const positions = newPositions;
        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            const newPos = positions[i];

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
     * Handles spacebar keydown event.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    onSpaceBar(event) {
        if (event.code === "Space") {
            this.restart();
        }
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

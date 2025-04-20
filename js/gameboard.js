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
    /**
     * @type {boolean}
     */
    canFlip = true;

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

    async initialize() {
        this.setupAudio();
        const jsonData = await this.loadJSON("./assets/oitavos.json");
        this.createCards(jsonData);
        // Adicionar o timer que já está implementado no outro ramo
    }

    createCards(jsonData) {
        for (let i = 0; i < this.BOARD_SIZE * this.BOARD_SIZE; i++) {
            const faces = Object.values(CountryFaces);
            const card = new Card(
                faces[Math.floor(i / 2)],
                this.#element,
                jsonData,
                this.handleCardClick // Passa a função para ser chamada quando é clicada
            );
            this.board.push(card);
        }

        
        this.shuffleCards();
    }

    handleCardClick = (card) => {
        this.sounds.flip.play();

        if (!this.canFlip || card.isFace || this.facedCards.length >= 2 || card.isMatched()) {
            return;
        }

        card.flip();
        this.facedCards.push(card);

        if (this.facedCards.length === 2) {
            this.canFlip = false;
            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }
    }

    checkMatch() {
        if (this.facedCards.length === 2) {
            const [card1, card2] = this.facedCards;
            if (card1.compare(card2)) {
                this.sounds.success.play();
                card1.handleMatch();
                card2.handleMatch();
                this.facedCards = [];
                this.canFlip = true;
                // Lógica de vitória estará no outro ramo da lógica de jogo
            } else {
                this.sounds.hide.play();
                setTimeout(() => {
                    this.unflipCards();
                }, 1500);
            }
        }
    }

    unflipCards() {
        this.facedCards.forEach(card => {
            card.unflipVisual(); // Usar o método público para virar as cartas
        });
        this.facedCards = [];
        this.canFlip = true;
    }

    shuffleCards() {
        this.sounds.hide.play();

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

        this.sounds.background.volume = 0.05;
        this.sounds.flip.volume = 0.5;
        this.sounds.success.volume = 0.5;
        this.sounds.hide.volume = 0.5;
        this.sounds.win.volume = 0.5;
    }
}

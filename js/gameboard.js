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
    /**
     * @type {number}
     */
    matchedPairs = 0;
    /**
     * @type {number}
     */
    totalPairs = (this.BOARD_SIZE * this.BOARD_SIZE) / 2;
    /**
     * @type {boolean}
     */
    audioInitialized = false;

    constructor() {
        this.sounds = new Sounds();
        this.#element = document.querySelector("#stage");

        this.timer = new Timer(() => {
            this.shuffleUnmatchedCards();
        });

        // Iniciar o timer após a primeira interação
        window.addEventListener('click', this.initAudioAndStartGame, { once: true });
        window.addEventListener('keydown', this.initAudioAndStartGame, { once: true });

        window.addEventListener("keydown", (e) => {
            if (e.code === "Space") {
                this.resetGame();
            }
        });
    }

    initAudioAndStartGame = () => {
        if (!this.audioInitialized) {
            this.setupAudio();
            this.timer.start();
            this.audioInitialized = true;
        }
    }

    resetGame() {
        console.log("Restarting the game...");
        this.canFlip = false;
        this.matchedPairs = 0;
        this.board.forEach(card => {
            card.isFace = false;
            card.updateBackFace();
            card.resetMatch();
        });
        this.facedCards = [];
        this.shuffleCards();
        this.timer.reset();
        this.timer.start();
        this.canFlip = true;
    }

    async initialize() {
        const jsonData = await this.loadJSON("./assets/oitavos.json");
        this.createCards(jsonData);
        // O timer e o áudio são iniciados após a interação do usuário
    }

    createCards(jsonData) {
        for (let i = 0; i < this.BOARD_SIZE * this.BOARD_SIZE; i++) {
            const faces = Object.values(CountryFaces);
            const card = new Card(
                faces[Math.floor(i / 2)],
                this.#element,
                jsonData,
                this.handleCardClick
            );
            this.board.push(card);
        }

        this.shuffleCards();
    }

    handleCardClick = (card) => {
        if (this.audioInitialized) {
            this.sounds.flip.play().catch(error => console.error("Erro ao reproduzir som de flip:", error));
        }

        if (!this.canFlip || card.isFace || this.facedCards.length >= 2 || card.isMatched()) {
            return;
        }

        card.updateFace();
        this.facedCards.push(card);

        if (this.facedCards.length === 2) {
            this.canFlip = false;
            this.checkMatch();
        }
    }

    checkMatch() {
        if (this.facedCards.length === 2) {
            const [card1, card2] = this.facedCards;
            if (card1.compare(card2)) {
                if (this.audioInitialized) {
                    this.sounds.success.play().catch(error => console.error("Erro ao reproduzir som de sucesso:", error));
                }
                card1.handleMatch();
                card2.handleMatch();
                this.facedCards = [];
                this.canFlip = true;
                this.matchedPairs++;
                console.log("Matched Pairs", this.matchedPairs);
                console.log("Total Pairs", this.totalPairs);
                if (this.matchedPairs === this.totalPairs) {
                    this.endGame();
                }
            } else {
                if (this.audioInitialized) {
                    this.sounds.hide.play().catch(error => console.error("Erro ao reproduzir som de hide:", error));
                }
                setTimeout(() => {
                    this.unflipCards();
                }, 1000);
            } 
        }
    }

    unflipCards() {
        this.facedCards.forEach(card => {
            card.updateBackFace();
        });
        this.facedCards = [];
        this.canFlip = true;
    }

    shuffleCards() {
        if (this.audioInitialized) {
            this.sounds.hide.play().catch(error => console.error("Erro ao reproduzir som de hide:", error));
        }
        const positions = [];

        this.facedCards.forEach((card) => {
            positions.push({
                x: card.x, y: card.y
            })
        });
        
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
                positions.some((pos) => pos.x === x && pos.y === y)
            );

            card.x = x;
            card.y = y;
            positions.push({ x, y });

            card.render();
        });
    }

    shuffleUnmatchedCards() {
        if (this.audioInitialized) {
            this.sounds.hide.play().catch(error => console.error("Erro ao reproduzir som de hide:", error));
        }
        const unmatchedCards = this.board.filter(card => !card.isMatched() && !card.isFace);
        const positions = [];

        unmatchedCards.forEach((card) => {
            let x = 0;
            let y = 0;
            do {
                x = Math.floor(Math.random() * this.BOARD_SIZE);
                y = Math.floor(Math.random() * this.BOARD_SIZE);
            } while (
                positions.some((pos) => pos.x === x && pos.y === y)
            );

            card.x = x;
            card.y = y;
            positions.push({ x, y });

            card.render();
        });

        this.timer.start();
    }

    endGame() {
        if (this.audioInitialized) {
            this.sounds.win.play().catch(error => console.error("Erro ao reproduzir som de vitória:", error));
        }
        console.log("Game Over! All pairs matched.");
        this.timer.reset();
        this.timer._showOverlay("Vitória!");

        // Adicionar lógica para mostrar mensagem de vitória, overlay, etc.
        // Reiniciar o jogo após um breve delay
        setTimeout(() => {
            this.resetGame();
            this.timer.reset();
        }, 3000); // Reinicia após 3 segundos (ajuste conforme necessário)
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

        if (this.sounds.background) this.sounds.background.volume = 0.05;
        if (this.sounds.flip) this.sounds.flip.volume = 0.5;
        if (this.sounds.success) this.sounds.success.volume = 0.5;
        if (this.sounds.hide) this.sounds.hide.volume = 0.5;
        if (this.sounds.win) this.sounds.win.volume = 0.5;

        if (this.sounds.background) {
            this.sounds.background.play().catch(error => {
                console.error("Erro ao iniciar a música de fundo:", error);
            });
        }
    }
}

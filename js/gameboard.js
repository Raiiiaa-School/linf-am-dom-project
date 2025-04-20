import { CountryFaces, Card } from "./card.js";
import { Sounds } from "./sound.js";

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
     * @type {HTMLDivElement}
     */
    #element;

    constructor() {
        this.sounds = new Sounds();
        this.#element = document.querySelector("#stage");
        this.setupEventListeners();
    }

    async initialize() {
        this.setupAudio(); 
        const jsonData = await this.loadJSON("./assets/oitavos.json");
        this.createCards(jsonData);
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        if (event.key === ' ') {
            this.restartGame();
        }
    }

    restartGame = () => {
        console.log("Restarting the game...");

        // 1. Baralhar todas as cartas
        this.shuffleCards();

        // 2. Esconde todas as cartas após um breve período
        setTimeout(() => {
            this.board.forEach(card => {
                card.isFace = false;
                card.unflipVisual();
                card.resetMatch();
            });
        }, 1500); // Tempo para mostrar brevemente as cartas antes de esconder (opcional)

        // 3. Dá reset do timer e a barra de progresso
        this.resetTimer();

        // 4. Limpar qualquer estado de cartas viradas
        this.facedCards = [];
    }

    createCards(jsonData) {
        for (let i = 0; i < this.BOARD_SIZE * this.BOARD_SIZE; i++) {
            const faces = Object.values(CountryFaces);
            const card = new Card(
                faces[Math.floor(i / 2)],
                this.#element,
                jsonData,
                () => {} // Uma função vazia para o onClick, já que a lógica do clique não está neste ramo
            );
            this.board.push(card);
        }

        this.shuffleCards();
    }

    shuffleCards() {
        const positions = [];

        this.board.forEach((card) => {
            card.isFace = false; // Garante que todas as cartas estejam desviradas antes de embaralhar
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

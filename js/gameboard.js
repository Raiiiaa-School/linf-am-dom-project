import { CountryFaces, Card } from "./card.js";
import { Sounds } from "./sound.js";

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
    /**
     * @type {number}
     */
    remainingCards;
    /**
     * @type {number}
     */
    startTimestamp;
    /**
     * @type {boolean}
     */
    gameActive = false;
    /**
     * @type {Array<Card>}
     */
    flippedCards = [];
    /**
     * @type {number}
     */
    moveCount = 0;

    constructor() {
        this.sounds = new Sounds();
        this.#element = document.querySelector("#stage");
    }

    async loadJSON(path) {
        try {
            const res = await fetch(path);
            if (!res.ok) {
                throw new Error(`Error fetching the file. Status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error fetching or parsing JSON: ", error);
        }
    }

    createCards(jsonData) {
        const faces = Object.values(CountryFaces);
        for (let i = 0; i < this.BOARD_SIZE * this.BOARD_SIZE; i++) {
            const card = new Card(
                faces[Math.floor(i / 2)],
                this.#element,
                jsonData
            );
            this.board.push(card);
        }
        this.shuffleCards();
    }

    shuffleCards() {
        const positions = [];
        this.board.forEach((card) => {
            if (card.isFace) return;

            let x, y;
            do {
                x = Math.floor(Math.random() * this.BOARD_SIZE);
                y = Math.floor(Math.random() * this.BOARD_SIZE);
            } while (
                positions.some((pos) => pos.x === x && pos.y === y) ||
                this.facedCards.some((facedCard) => facedCard.x === x && facedCard.y === y)
            );

            card.x = x;
            card.y = y;
            positions.push({ x, y });
            card.render();
        });
    }

    baralharCartasNaoViradas() {
    // Limpa o array de cartas viradas
    flippedCards.length = 0;

    // Seleciona todas as cartas não encontradas
    const unguessedCards = [...document.querySelectorAll(".carta:not(.certa)")];

    // Adiciona animação e esconde as cartas em uma única etapa
    unguessedCards.forEach(card => {
        card.classList.add("shuffle", "escondida");
    });

    // Aguarda o término da animação antes de reembaralhar
    setTimeout(() => {
        // Remove a classe de animação
        unguessedCards.forEach(card => card.classList.remove("shuffle"));

        // Baralha as posições de fundo das cartas
        const shuffledPositions = shuffleArray(
            unguessedCards.map(card => ({
                x: card.style.backgroundPositionX,
                y: card.style.backgroundPositionY,
            }))
        );

        // Atualiza as posições de fundo e o array game.shuffledCards
        unguessedCards.forEach((card, index) => {
            const { x, y } = shuffledPositions[index];
            card.style.backgroundPositionX = x;
            card.style.backgroundPositionY = y;
            game.shuffledCards[index] = { x, y };
        });

        // Verifica se todas as cartas foram encontradas
        if (unguessedCards.length === 0) {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            win(elapsedTime, moves);
        }
    }, 800); // Duração da animação (0.8s)
}

// Função auxiliar para embaralhar um array
    shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
    startGame() {
        this.remainingCards = this.board.length;
        this.startTimestamp = Date.now();
        this.gameActive = true;
        console.log("Game started!");
    }

    validatePair() {
        const flippedCardDetails = flippedCards.map(card => ({
            element: card,
            backgroundPosition: card.style.backgroundPosition
        }));
    
        // Verifica se as cartas viradas têm a mesma posição de fundo
        if (flippedCardDetails[0].backgroundPosition === flippedCardDetails[1].backgroundPosition) {
            game.sounds.success.play();
    
            flippedCardDetails.forEach(cardDetail => {
                cardDetail.element.classList.add("certa");
            });
    
            flippedCards = []; // Limpa o array de cartas viradas
            unguessedCards -= 2;
    
            console.log("Cards ungessed " + unguessedCards);
    
            // Verifica se todas as cartas foram encontradas
            if (unguessedCards === 0) {
                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                win(elapsedTime, moves);
            }
        } else {
            game.sounds.hide.play();
    
            setTimeout(() => {
                flippedCardDetails.forEach(cardDetail => {
                    cardDetail.element.classList.add("escondida");
                });
    
                flippedCards = []; // Limpa o array de cartas viradas
            }, 500); // Espera meio segundo antes de esconder as cartas
        }
    }

    displayCards() {
        const gameStage = this.#element;
        let cardIndex = 0;

        const cardInterval = setInterval(() => {
            if (cardIndex >= this.board.length) {
                clearInterval(cardInterval);
                setTimeout(() => {
                    this.escondeTodasAsCartas();
                    this.setupGameInteractions();
                }, 1000);
                return;
            }

            const card = this.board[cardIndex];
            const cardElement = document.createElement("div");
            cardElement.classList.add("carta");
            cardElement.style.backgroundPositionX = card.x + "px";
            cardElement.style.backgroundPositionY = card.y + "px";

            const rowPosition = Math.floor(cardIndex / this.BOARD_SIZE);
            const colPosition = cardIndex % this.BOARD_SIZE;
            cardElement.style.top = rowPosition * 100 + "px";
            cardElement.style.left = colPosition * 100 + "px";

            gameStage.appendChild(cardElement);
            cardIndex++;
        }, 500);
    }

    escondeTodasAsCartas() {
        const cards = document.querySelectorAll(".carta");
        cards.forEach((card) => {
            card.style.visibility = "hidden";
        });
    }

    celebrateWin(totalTime, moveCount) {
        console.log(`Vitória! Tempo: ${totalTime} segundos, Movimentos: ${moveCount}`);
    }

    setupGameInteractions() {
        const cardElements = document.querySelectorAll(".carta");
        cardElements.forEach((cardElement) => {
            cardElement.addEventListener("click", (event) => this.handleCardClick(event));
        });
        console.log("Interações das cartas configuradas.");
        this.gameActive = true;

        document.addEventListener("click", (event) => this.initiateGameOnFirstClick(event), { once: true });
        console.log("Cartas escondidas. Jogo pronto para começar.");
    }

    handleCardClick(event) {
        if (!this.gameActive) return;

        const selectedCard = event.currentTarget;
        this.revealCard(selectedCard);
    }

    initiateGameOnFirstClick(event) {
        if (event.target.classList.contains("carta")) {
            this.playBackgroundMusic();
            this.startGameTimer();
        }
    }

    revealCard(card) {
        if (this.flippedCards.length >= 2) return;

        if (card.classList.contains("escondida")) {
            this.flippedCards.push(card);
            this.moveCount++;
        }

        card.classList.remove("escondida");
        this.sounds.flip.play();

        if (this.flippedCards.length === 2) {
            setTimeout(() => this.validatePair(), 500);
        }
    }

    playBackgroundMusic() {
        this.sounds.background.play();
        console.log("Música de fundo iniciada.");
    }

    startGameTimer() {
        console.log("Temporizador do jogo iniciado.");
    }

    setupAudio() {
        this.sounds.background = document.querySelector("#backgroundSnd");
        this.sounds.success = document.querySelector("#successSnd");
        this.sounds.flip = document.querySelector("#flipSnd");
        this.sounds.hide = document.querySelector("#hideSnd");
        this.sounds.win = document.querySelector("#goalSnd");

        this.sounds.background.volume = 0.05;
    }
}
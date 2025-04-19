import { Face } from "./face.js";

export const CountryFaces = Object.freeze({
    GERMANY: "Alemanha.png",
    BELGIUM: "Belgica.png",
    FRANCE: "Franca.png",
    WALES: "Gales.png",
    ICELAND: "Islandia.png",
    ITALY: "Italia.png",
    POLAND: "Polonia.png",
    PORTUGAL: "Portugal.png",
});

export class Card {
    controller = new AbortController();
    /**
     * @type {number}
     */
    x;
    /**
     * @type {number}
     */
    y;
    /**
     * @type {boolean}
     */
    isFace = false;
    /**
     * @type {HTMLDivElement}
     */
    #element;
    /**
     * @type {Face}
     */
    #face;

    /**
     * @param {keyof typeof CountryFaces} face - The face of the card.
     * @param {HTMLElement} parent - Define the parent that to append the card
     */
    constructor(face, parent, jsonData) {
        this.#face = new Face(face, jsonData);
        this.createElement(parent);
    }

    esconderCartas() {
        const cartas = document.querySelectorAll(".carta");
        cartas.forEach((carta) => {
            carta.classList.add("escondida");
        });
    }

    iniciarJogo(){
        const cartasSelecionadas = document.querySelectorAll(".carta");
        cartasSelecionadas.forEach((carta) => {
            cartaSelecionada.addEventListener("click", handleCardClick);
        });

        console.log("Interações das cartas configuradas. Jogo pronto para iniciar.");
    
        gameRunning = true;

        // Iniciar música de fundo e temporizador após a primeira interação do usuário
        document.addEventListener("click", startGameOnFirstInteraction, { once: true })

    }
    concealAllCards() {
        const cardElements = document.querySelectorAll(".carta");
        for (let i = 0; i < cardElements.length; i++) {
            cardElements[i].classList.add("escondida");
        }
    }
    
    
    handleClick() {
        if (!gameActive || this.isFace) return;
    
            this.isFace = true;
            this.element.style.backgroundImage = `url(${this.face.getImage()})`;
            this.gameBoard.revealedCards.push(this);
            this.gameBoard.moveCount++;
        
        if (this.gameBoard.revealedCards.length === 2) {
            this.gameBoard.validatePair();
         }
    }
    
    
    startGameOnFirstInteraction() {
        if(event.target.classList.contains("carta")) {
            playBackgroundMusic();
            iniciarTemporizador();
        }
    }
    flipCard(cartaSelecionada) {
        console.log(`Carta virada: ${cartaSelecionada}`);
    }
    
// Ativa a música de fundo
    playBackgroundMusic() {
    game.audio.background.loop = true;
    game.audio.background.play();

    }
    // Inicia o temporizador
    iniciarTemporizador() {
        
        const progressElement = document.getElementById("time");
        let elapsedTime = 0;
        const totalDuration = parseInt(progressElement.max, 10); // 45 segundos

    // Reinicia a barra de progresso:
    if (intervalId) {
        clearInterval(intervalId);
    }

// Inicia um novo temporizador:
    gameActive = true;
    intervalId = setInterval(() => {
    elapsedTime++;
    progressElement.value = elapsedTime;

// Adiciona animação de aviso quando faltam 5 segundos:
    if (elapsedTime === totalDuration - 5) {
        progressElement.classList.add("alert");
        displayNotification("As cartas ainda não encontradas serão baralhadas em 5 segundos!", 5);
    }

// Baralha as cartas não encontradas quando o tempo acabar:
    if (elapsedTime === totalDuration) {
        clearInterval(intervalId);
     progressElement.classList.remove("alert");
    progressElement.value = 0; // Reinicia a barra de progresso
    shuffleUnmatchedCards();
    elapsedTime = 0; // Reinicia o tempo
    gameActive ? initiateTimer() : ""; // Reinicia o temporizador
        }
    }, 1000); // Atualiza a cada segundo

    }
        
    createElement(parent) {
        this.#element = document.createElement("div");
        this.#element.style.position = "absolute";
        this.#element.style.backgroundImage = Face.URL;
        this.#element.style.width = this.#face.width + "px";
        this.#element.style.height = this.#face.height + "px";
        this.#element.style.backgroundPositionX = "-" + this.#face.x + "px";
        this.#element.style.backgroundPositionY = "-" + this.#face.y + "px";
        this.#element.style.backgroundSize = `${this.#face.w}px ${
            this.#face.h
        }px`;

        this.#element.addEventListener("click", this.handleClick, {
            signal: this.controller.signal,
        });
        parent.appendChild(this.#element);
    }

    handleClick() {}

    /**
     * @param {Card} card
     */
    compare(card) {
        return this.getContry() === card.getContry();
    }

    getContry() {
        return this.#face.country;
    }

    handleMatch() {
        this.controller.abort();
    }

    render() {
        this.#element.style.left = `${this.x * this.#face.width}px`;
        this.#element.style.top = `${this.y * this.#face.height}px`;
    }
}

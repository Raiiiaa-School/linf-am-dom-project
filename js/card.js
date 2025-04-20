import { Face } from "./face.js";
import { Gameboard } from "./gameboard.js";
import { Timer } from "./timer.js";

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

/**
 * Class representing a card.
 * @class
 */
export class Card {
    /**
     * @type {number}
     */
    static CARD_FLIP_DURATION = 300;
    /**
     * @type {Gameboard}
     */
    static gameboard;

    /**
     * @type {AbortController}
     */
    controller = new AbortController();
    /**
     * @type {Timer}
     */
    flipTimer = new Timer(Card.CARD_FLIP_DURATION / 2);

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
    isFace = true;
    /**
     * @type {boolean}
     */
    isMatched = false;
    /**
     * @type {HTMLDivElement}
     */
    #element;
    /**
     * @type {Face}
     */
    face;
    /**
     * @type {() => void}
     */
    handleClickFn = this.handleClick.bind(this);

    /**
     * @param {keyof typeof CountryFaces} face - The face of the card.
     * @param {HTMLElement} parent - Define the parent that to append the card
     */
    constructor(face, parent, jsonData) {
        this.face = new Face(face, jsonData);
        this.createElement(parent);
        this.flipTimer.setOnComplete(() => this.renderFace());
    }

    /**
     * Creates the element of the card.
     * @param {HTMLElement} parent - Define the parent that to append the card.
     */
    createElement(parent) {
        this.#element = document.createElement("div");
        this.#element.style.backgroundImage = Face.URL;
        this.#element.style.backgroundSize = `${this.face.w}px ${
            this.face.h
        }px`;
        this.#element.style.width = this.face.width + "px";
        this.#element.style.height = this.face.height + "px";

        this.#element.classList.add("card");

        this.showBack();
        this.renderFace();

        this.#element.addEventListener("click", this.handleClickFn, {
            signal: this.controller.signal,
        });
        parent.appendChild(this.#element);
    }

    /**
     * Handles the click event on the card.
     */
    handleClick() {
        if (this.isFace) {
            console.log("Card is already turned");
            return;
        }

        if (this.isMatched) {
            console.log("Card is alredy matched");
            return;
        }

        if (!Card.gameboard.canAddSelectedCard()) {
            return;
        }

        this.showFace();
        Card.gameboard.addSelectedCard(this);
    }

    /**
     * Shows the face of the card.
     */
    showFace() {
        this.isFace = true;
        this.face.showFace();
        if (this.#element.classList.contains("back")) {
            this.#element.classList.remove("back");
        }
        this.#element.classList.add("face");
        this.flipTimer.start();
    }

    /**
     * Shows the back of the card.
     */
    showBack() {
        this.isFace = false;
        this.face.showBack();
        if (this.#element.classList.contains("face")) {
            this.#element.classList.remove("face");
        }
        this.#element.classList.add("back");
        this.flipTimer.start();
    }

    /**
     * Compares the card with another card. If the cards match, returns true
     * @param {Card} card
     * @returns {boolean} - true if the cards match, false otherwise
     */
    compare(card) {
        return this.getCountry() === card.getCountry();
    }

    /**
     * Gets the country of the card.
     * @returns {string} - the country of the card
     */
    getCountry() {
        return this.face.country;
    }

    /**
     * Handles the match event on the card.
     */
    handleMatch() {
        const timer = new Timer(200);
        timer.start();
        timer.setOnComplete(() => {
            this.#element.classList.add("matched");
            this.controller.abort();
        });
    }

    /**
     * Renders the face of the card.
     */
    renderFace() {
        this.#element.style.backgroundPositionX = `-${this.face.x}px`;
        this.#element.style.backgroundPositionY = `-${this.face.y}px`;
    }

    /**
     * Renders the card.
     */
    render() {
        this.#element.style.left = `${this.x * this.face.width}px`;
        this.#element.style.top = `${this.y * this.face.height}px`;
    }
}

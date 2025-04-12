import { Face } from "./face.js";
import { Gameboard } from "./gameboard.js";

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
    /**
     * @type {Gameboard}
     */
    static gameboard;
    /**
     * @type {AbortController}
     */
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
    }

    createElement(parent) {
        this.#element = document.createElement("div");
        this.#element.style.position = "absolute";
        this.#element.style.backgroundImage = Face.URL;
        this.#element.style.backgroundSize = `${this.face.w}px ${
            this.face.h
        }px`;
        this.#element.style.width = this.face.width + "px";
        this.#element.style.height = this.face.height + "px";

        this.renderFace();

        this.#element.addEventListener("click", this.handleClickFn, {
            signal: this.controller.signal,
        });
        parent.appendChild(this.#element);
    }

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

    showFace() {
        this.isFace = true;
        this.face.showFace();
        this.renderFace();
    }

    showBack() {
        this.isFace = false;
        this.face.showBack();
        this.renderFace();
    }

    /**
     * @param {Card} card
     */
    compare(card) {
        return this.getContry() === card.getContry();
    }

    getContry() {
        return this.face.country;
    }

    handleMatch() {
        this.controller.abort();
    }

    renderFace() {
        this.#element.style.backgroundPositionX = `-${this.face.x}px`;
        this.#element.style.backgroundPositionY = `-${this.face.y}px`;
    }

    render() {
        this.#element.style.left = `${this.x * this.face.width}px`;
        this.#element.style.top = `${this.y * this.face.height}px`;
    }
}

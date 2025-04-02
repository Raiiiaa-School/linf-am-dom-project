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

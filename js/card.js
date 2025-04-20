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
     * @type {function}
     */
    #onClickCallback;
    /**
     * @type {function}
     */
    #onClickCallback;

    /**
     * @param {keyof typeof CountryFaces} face - The face of the card.
     * @param {HTMLElement} parent - Define the parent that to append the card
     * @param {object} jsonData - JSON data for card faces.
     * @param {function} onClick - Callback function to be called on click.
     * @param {object} jsonData - JSON data for card faces.
     * @param {function} onClick - Callback function to be called on click.
     */
    constructor(face, parent, jsonData, onClick, onClick) {
        this.#face = new Face(face, jsonData);
        this.#onClickCallback = onClick;
        this.createElement(parent);
        this.updateBackFace();
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

        this.#element.addEventListener("click", this.handleClick);
        this.#element.addEventListener("click", this.handleClick);
        parent.appendChild(this.#element);
    }

    handleClick = () => {
        if (this.#onClickCallback) {
            this.#onClickCallback(this);
        }
    }
    handleClick = () => {
        if (this.#onClickCallback) {
            this.#onClickCallback(this);
        }
    }

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
        this.#element.classList.add("matched");
    }

    resetMatch() {
        this.#element.classList.remove("matched");

    }

    renderFace() {
        this.#element.style.backgroundPositionX = `-${this.#face.x}px`;
        this.#element.style.backgroundPositionY = `-${this.#face.y}px`;

        this.#element.classList.add("matched");


    }

    render() {
        this.#element.style.left = `${this.x * this.#face.width}px`;
        this.#element.style.top = `${this.y * this.#face.height}px`;
    }

    updateFace() {
        this.isFace = true;
        //this.#element.classList.add("faced");
        this.#face.updateFace();
        this.renderFace();
    }

    updateBackFace() { // Novo método público para virar visualmente
        this.isFace = false;
        //this.#element.classList.remove("faced");
        this.#face.updateBackFace();
        this.renderFace();
    }

    isMatched() {
        return this.#element.classList.contains("matched");
    }
}
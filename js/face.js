/**
 * Class that has the positions to draw the face and back of a card
 */
export class Face {
    /**
     * @type {string}
     */
    static URL = 'url("./assets/oitavos.png")';
    /**
     * @type {number}
     */
    x;
    /**
     * @type {number}
     */
    y;

    /**
     * @type {number}
     */
    facePosX;
    /**
     * @type {number}
     */
    facePosY;
    /**
     * @type {number}
     */
    backPosX;
    /**
     * @type {number}
     */
    backPosY;
    /**
     * @type {number}
     */
    width;
    /**
     * @type {number}
     */
    height;
    /**
     * @type {string}
     */
    country;

    /**
     * @param {keyof typeof CountryFaces} face
     */
    constructor(face, jsonData) {
        this.facePosX = jsonData.frames[face].frame.x;
        this.facePosY = jsonData.frames[face].frame.y;

        this.backPosX = jsonData.frames["download.png"].frame.x;
        this.backPosY = jsonData.frames["download.png"].frame.y;

        this.width = jsonData.frames[face].frame.w;
        this.height = jsonData.frames[face].frame.h;

        this.showFace();

        this.country = face.split(".")[0];
    }

    /**
     * Shows the face of the card.
     */
    showFace() {
        this.x = this.facePosX;
        this.y = this.facePosY;
    }

    /**
     * Shows the back of the card.
     */
    showBack() {
        this.x = this.backPosX;
        this.y = this.backPosX;
    }
}

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
        this.x = jsonData.frames[face].frame.x;
        this.y = jsonData.frames[face].frame.y;
        this.width = jsonData.frames[face].frame.w;
        this.height = jsonData.frames[face].frame.h;

        this.country = face.split(".")[0];
    }
}

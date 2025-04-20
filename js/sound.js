/**
 * Class representing various sound effects.
 * @class
 */
export class Sounds {
    /**
     * @type {Sound}
     */
    background;
    /**
     * @type {Sound}
     */
    flip;
    /**
     * @type {Sound}
     */
    success;
    /**
     * @type {Sound}
     */
    hide;
    /**
     * @type {Sound}
     */
    win;

    constructor() {
        this.background = new Sound(
            document.querySelector("#backgroundSnd"),
            0.02,
            true,
        );
        this.success = new Sound(document.querySelector("#successSnd"), 0.5);
        this.flip = new Sound(document.querySelector("#flipSnd"), 0.5);
        this.hide = new Sound(document.querySelector("#hideSnd"), 0.5);
        this.win = new Sound(document.querySelector("#goalSnd"), 0.5);
    }
}

/**
 * Class representing a sound effect.
 * @class
 */
export class Sound {
    /**
     * @type {HTMLAudioElement}
     */
    #element;

    /**
     * @param {HTMLAudioElement} element
     */
    constructor(element, volume, loop = false) {
        this.#element = element;
        this.setVolume(volume);
        this.#element.loop = loop;
    }

    /**
     * Plays the audio or video element.
     */
    play() {
        this.#element.play();
    }

    /**
     * Set the volume of the audio element.
     * @param {number} volume - The volume level to set (0 to 1).
     */
    setVolume(volume) {
        if (volume > 1) {
            volume = 1;
        }
        if (volume < 0) {
            volume = 0;
        }
        this.#element.volume = volume;
    }
}

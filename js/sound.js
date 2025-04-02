/**
 * Class representing various sound effects.
 * @class
 */
export class Sounds {
    /**
     * @type {HTMLAudioElement}
     */
    background;
    /**
     * @type {HTMLAudioElement}
     */
    flip;
    /**
     * @type {HTMLAudioElement}
     */
    success;
    /**
     * @type {HTMLAudioElement}
     */
    hide;
}

export class Sound {
    /**
     * @type {HTMLAudioElement}
     */
    #element;

    /**
     * @param {HTMLAudioElement} element
     */
    constructor(element) {
        this.#element = element;
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

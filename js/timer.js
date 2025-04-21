/**
 * Class that represents a timer for the game
 */
export class Timer {
    /**
     * @param {number} duration - The duration of the timer in milliseconds.
     * @param {boolean} loop - Whether the timer should loop after completion.
     */
    constructor(duration, loop = false) {
        this.duration = duration;
        this.loop = loop;
        this.remaining = duration;
        this.startTime = null;
        this.isRunning = false;
        this.timeoutId = null;
        this.oncomplete = null; // Callback function for timer completion/restart
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startTime = Date.now();
        this.timeoutId = setTimeout(() => {
            if (this.oncomplete) {
                this.oncomplete(); // Fire the event
            }
            if (this.loop) {
                this.restart();
            } else {
                this.stop();
            }
        }, this.remaining);
    }

    pause() {
        if (!this.isRunning) return;
        this.isRunning = false;
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
        this.remaining -= Date.now() - this.startTime;
    }

    stop(reset = false) {
        this.isRunning = false;
        clearTimeout(this.timeoutId);
        if (reset) {
            this.remaining = this.duration;
        }
    }

    restart() {
        this.stop(true);
        this.start();
    }

    setDuration(duration) {
        this.duration = duration;
        this.remaining = duration;
    }

    setLoop(loop) {
        this.loop = loop;
    }

    getRemaining() {
        if (!this.isRunning) {
            return this.remaining;
        }
        return this.remaining - (Date.now() - this.startTime);
    }

    setOnComplete(callback) {
        this.oncomplete = callback;
    }
}

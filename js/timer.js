/**
 * Class that represents a timer for the game
 */
export class Timer {
    constructor(duration, loop = false) {
        this.duration = duration;
        this.loop = loop;
        this.remaining = duration;
        this.isRunning = false;
        this.timeoutId = null;
        this.oncomplete = null; // Callback function for timer completion/restart
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
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
    }

    stop(reset = false) {
        this.isRunning = false;
        clearTimeout(this.timeoutId);
        if (reset) {
            this.remaining = this.duration;
        }
    }

    restart() {
        this.stop();
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
        return this.remaining;
    }

    setOnComplete(callback) {
        this.oncomplete = callback;
    }
}

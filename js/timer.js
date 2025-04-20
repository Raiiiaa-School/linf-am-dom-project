export class Timer {
    constructor(callback) {
        this.callback = callback;
        this._intervalId = null;
        this._currentTime = 0;
        this._maxTime = 45;
        this._progressEl = document.getElementById("time");
        this._updateProgressBar();
    }

    start() {
        this.reset();
        this._intervalId = setInterval(() => {
            this._currentTime++;
            this._updateProgressBar();

            if (this._currentTime === this._maxTime) {
                clearInterval(this._intervalId);
                this._showOverlay();  
                this.callback();
            }
        }, 1000);
    }

    reset() {
        clearInterval(this._intervalId);
        this._currentTime = 0;
        this._updateProgressBar();
        this._hideOverlay();  
    }

    _updateProgressBar() {
        if (this._progressEl) {
            this._progressEl.value = this._currentTime;

            if (this._currentTime >= 40) {
                this._progressEl.classList.add("warning");
            } else {
                this._progressEl.classList.remove("warning");
            }
        }
    }

    _showOverlay(text = "Tempo esgotado! As cartas vão ser baralhadas.") {
        const overlay = document.getElementById("overlay");

        const paragraph = (overlay.querySelector("p"));
        
        paragraph .textContent = text;
        if (overlay) {
            overlay.classList.remove("hidden");
            setTimeout(() => {
                overlay.classList.add("hidden");
            }, 3000);
        }
    }

    _hideOverlay() {
        const overlay = document.getElementById("overlay");
        if (overlay) {
            overlay.classList.add("hidden");
        }
    }
}

export class Timer {
    constructor(gameboard) {
        this._intervalId = null;
        this._currentTime = 0;
        this._maxTime = 45;
        this._progressEl = document.getElementById("time");
        this._gameboard = gameboard;
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

                // Baralhar cartas após o tempo esgotar
                if (this._gameboard) {
                    this._gameboard.shuffleCards();
                }
            }
        }, 1000);
    }

    reset() {
        clearInterval(this._intervalId);
        this._currentTime = 0;
        this._updateProgressBar();
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

    _showOverlay() {
        const overlay = document.getElementById("overlay");
        if (overlay) {
            overlay.classList.remove("hidden");
    
            // Esconde o overlay após 3 segundos
            setTimeout(() => {
                overlay.classList.add("hidden");
            }, 3000);
        }
    }
}
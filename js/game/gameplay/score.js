"use strict";

export class Score {

    #currentScore;
    #digits;

    constructor(digits) {
        this.#currentScore = 0;
        this.#digits = digits;
    }

    updateScore(points) {
        this.#currentScore += points;
        this.#showScore();
    }

    #showScore() {
        const scoreToString = this.#currentScore.toString().padStart(3,"0");
        for (let i=0; i<this.#digits.length; i++) {
            this.#digits[i].canvasImage.updatePositionAndSizeOfSourceImage(this.#digits[i].numbers[scoreToString[i]])
        }
    }

    get currentScore() {
        return this.#currentScore;
    }

}
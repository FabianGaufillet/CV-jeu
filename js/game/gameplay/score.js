"use strict";

import {Digits} from "../drawing/digits.js";

export class Score {

    #currentScore;
    #digits;

    constructor(digits) {
        this.#currentScore = 0;
        this.#digits = digits;
    }

    updateScore(points) {
        this.#currentScore = Math.max(this.#currentScore+points,0);
        this.#showScore();
    }

    #showScore() {
        const scoreToString = this.#currentScore.toString().padStart(3,"0");
        for (let i= 0; i < this.#digits.length; i++) {
            this.#digits[i].canvasImage.updatePositionAndSizeOfSourceImage(Digits.numbersData[scoreToString[i]]);
        }
    }

    get currentScore() {
        return this.#currentScore;
    }

}
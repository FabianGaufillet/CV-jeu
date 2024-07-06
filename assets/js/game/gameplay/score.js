"use strict";

import {Digits} from "../drawing/digits.js";

/** Classe permettant de gérer le score : mise à jour, affichage */
export class Score {

    /**
     * Propriétés relatives au score
     * @property {number} #currentScore Score actuel
     * @property {Digits} #digits Digits permettant l'affichage du score
     */
    #currentScore;
    #digits;

    /**
     * Créé une instance de Score
     * @param {Digits[]} digits Ensemble des digits constituant l'affichage du score
     */
    constructor(digits) {
        this.#currentScore = 0;
        this.#digits = digits;
    }

    /**
     * Met à jour le score
     * @param {number} points Nombre de points à ajouter ou retrancher
     */
    updateScore(points) {
        const previousScore = this.#formatScore(this.#currentScore, 3);
        this.#currentScore = Math.max(this.#currentScore+points,0);
        this.#showScore(previousScore);
    }

    /**
     * Met à jour l'afficheur
     * @param {string} previousScore Nombre de points avant mise à jour
     */
    #showScore(previousScore) {
        const scoreToString = this.#formatScore(this.#currentScore, 3);
        if (parseInt(previousScore,10) < this.#currentScore) {
            for (let i= 0; i < this.#digits.length; i++) {
                if (parseInt(previousScore[i],10) !== parseInt(scoreToString[i],10)) {
                    this.#digits[i].sprite.setNextSprite(Digits.numbersData,this.#digits[i].canvasImage);
                }
            }
        } else if (parseInt(previousScore,10) > this.#currentScore) {
            for (let i= 0; i < this.#digits.length; i++) {
                if (parseInt(previousScore[i],10) !== parseInt(scoreToString[i],10)) {
                    this.#digits[i].sprite.setPreviousSprite(Digits.numbersData,this.#digits[i].canvasImage);
                }
            }
        }
    }

    /**
     * Formate le score sur n digits
     * @param {number} score Le score à formater
     * @param {number} nbDigits Nombre de digits
     * @returns {string} Le score formaté sur n digits
     */
    #formatScore(score, nbDigits) {
        return score.toString().padStart(nbDigits,"0");
    }

    /**
     * Score actuel
     * @returns {number} Score actuel du joueur
     */
    get currentScore() {
        return this.#currentScore;
    }

}
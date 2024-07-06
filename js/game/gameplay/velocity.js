"use strict";

import {WALK_MAXVELOCITY, RUN_MAXVELOCITY, FALL_MAXVELOCITY, GRAVITY, FRICTION_COEFFICIENT} from "./constants.js";

/** Classe décrivant les vitesses horizontale et verticale d'un presonnage */
export class Velocity {

    /**
     * @property {number} #velocityX Vitesse horizontale
     */
    #velocityX;

    /**
     * @property {number} #velocityY Vitesse verticale
     */
    #velocityY;

    /**
     * Créé une instance de Velocity
     * @param {number} [velocityX=0] Vitesse horizontale initiale
     * @param {number} [velocityY=0] Vitesse verticale initiale
     */
    constructor(velocityX = 0,velocityY = 0) {
        this.#velocityX = velocityX;
        this.#velocityY = velocityY;
    }

    /**
     * Mise à jour des vitesses horizontale et verticale
     * @param {boolean} onGround Indique si le personnage est sur un sol
     * @param {string} currentState État courant du personnage (repos, marche, course, ...)
     * @param {number} velocityXIncrement Vitesse horizontale à ajouter
     * @param {number} velocityYIncrement Vitesse verticale à ajouter
     */
    updateVelocities(onGround, currentState, velocityXIncrement, velocityYIncrement) {
        this.#updateVelocityX(onGround, currentState, velocityXIncrement);
        this.#updateVelocityY(onGround, currentState, velocityYIncrement);
    }

    /**
     * Mise à jour de la vitesse horizontale
     * @param {boolean} onGround Indique si le personnage est sur un sol
     * @param {string} currentState État courant du personnage (repos, marche, course, ...)
     * @param {number} velocityXIncrement Vitesse horizontale à ajouter
     */
    #updateVelocityX(onGround, currentState, velocityXIncrement) {
        this.#velocityX += onGround ? velocityXIncrement : 0;

        if (currentState.startsWith("dead")) {
            this.#velocityX = 0;
        } else if (currentState.startsWith("idle") || currentState.startsWith("attack")) {
            this.#velocityX *= FRICTION_COEFFICIENT;
        } else if (currentState === "walkL") {
            this.#velocityX = Math.max(this.#velocityX, -WALK_MAXVELOCITY);
        } else if (currentState === "walkR") {
            this.#velocityX = Math.min(this.#velocityX, WALK_MAXVELOCITY);
        } else if (currentState === "runL") {
            this.#velocityX = Math.max(this.#velocityX, -RUN_MAXVELOCITY);
        } else if (currentState === "runR") {
            this.#velocityX = Math.min(this.#velocityX, RUN_MAXVELOCITY);
        }
    }

    /**
     * Mise à jour de la vitesse verticale
     * @param {boolean} onGround Indique si le personnage est sur un sol
     * @param {string} currentState État courant du personnage (repos, marche, course, ...)
     * @param {number} velocityYIncrement Vitesse verticale à ajouter
     */
    #updateVelocityY(onGround, currentState, velocityYIncrement) {
        if (!onGround) this.#velocityY += GRAVITY;
        else {
            if (currentState.startsWith("jump")) this.#velocityY += velocityYIncrement;
            else this.#velocityY = 0;
        }
        if (this.#velocityY < 0) this.#velocityY = Math.max(this.#velocityY,-FALL_MAXVELOCITY);
        else if (this.#velocityY > 0) this.#velocityY = Math.min(this.#velocityY,FALL_MAXVELOCITY);
    }

    /**
     * Retourne la vitesse horizontale
     * @returns {number} Vitesse horizontale du personnage
     */
    get velocityX() {
        return this.#velocityX;
    }

    /**
     * Retourne la vitesse verticale
     * @returns {number} Vitesse verticale du personnage
     */
    get velocityY() {
        return this.#velocityY;
    }

}
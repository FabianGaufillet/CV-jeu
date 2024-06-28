"use strict";

import {WALK_MAXVELOCITY, RUN_MAXVELOCITY, FALL_MAXVELOCITY, GRAVITY, FRICTION_COEFFICIENT} from "./constants.js";

export class Velocity {

    #velocityX;
    #velocityY;

    constructor(velocityX = 0,velocityY = 0) {
        this.#velocityX = velocityX;
        this.#velocityY = velocityY;
    }

    updateVelocities(onGround, currentState, velocityXIncrement, velocityYIncrement) {
        this.#updateVelocityX(onGround, currentState, velocityXIncrement);
        this.#updateVelocityY(onGround, currentState, velocityYIncrement);
    }

    #updateVelocityX(onGround, currentState, velocityXIncrement) {
        this.#velocityX += onGround ? velocityXIncrement : 0;

        if (currentState.startsWith("idle") || currentState.startsWith("attack")) {
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

    #updateVelocityY(onGround, currentState, velocityYIncrement) {
        if (!onGround) this.#velocityY += GRAVITY;
        else {
            if (currentState.startsWith("jump")) this.#velocityY += velocityYIncrement;
            else this.#velocityY = 0;
        }
        if (this.#velocityY < 0) this.#velocityY = Math.max(this.#velocityY,-FALL_MAXVELOCITY);
        else if (this.#velocityY > 0) this.#velocityY = Math.min(this.#velocityY,FALL_MAXVELOCITY);
    }

    get velocityX() {
        return this.#velocityX;
    }

    get velocityY() {
        return this.#velocityY;
    }

}
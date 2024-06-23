"use strict";

export class Sprite {

    #currentState;
    #currentIndexOfSprite;

    constructor(state,indexOfSprite) {
        this.#currentState = state;
        this.#currentIndexOfSprite = indexOfSprite;
    }

    getNextSprite(sprites) {
        const currentIndexOfSprite = this.#currentIndexOfSprite;
        this.#currentIndexOfSprite = (this.#currentIndexOfSprite + 1)%sprites.length;
        return sprites[currentIndexOfSprite];
    }

    get currentState() {
        return this.#currentState;
    }

}
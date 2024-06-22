"use strict";

export class Sprite {

    #sprites
    #currentState;
    #currentIndexOfSprite;

    constructor(sprites,state,indexOfSprite) {
        this.#sprites = sprites;
        this.#currentState = state;
        this.#currentIndexOfSprite = indexOfSprite;
    }

    getNextSprite() {
        const currentIndexOfSprite = this.#currentIndexOfSprite;
        this.#currentIndexOfSprite = (this.#currentIndexOfSprite + 1)%this.#sprites.length;
        return this.#sprites[currentIndexOfSprite];
    }

}
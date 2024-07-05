"use strict";

export class Sprite {

    currentState;
    #currentIndexOfSprite;

    constructor(state,indexOfSprite) {
        this.currentState = state;
        this.#currentIndexOfSprite = indexOfSprite;
    }

    setNextSprite(moves,canvasImage) {
        const nextSprite = this.#getNextSprite(moves);
        canvasImage.updatePositionAndSizeOfSourceImage(nextSprite);
    }

    #getNextSprite(sprites) {
        const previousIndexOfSprite = this.#currentIndexOfSprite;
        if (!(previousIndexOfSprite === sprites.length-1 && this.currentState.startsWith("dead"))) {
            this.#currentIndexOfSprite = (this.#currentIndexOfSprite + 1)%sprites.length;
        }
        return sprites[previousIndexOfSprite];
    }

    changeSprite(state) {
        this.currentState = state;
        this.#currentIndexOfSprite = 0;
    }

    isCurrentAnimationFinished(sprites) {
        return this.#currentIndexOfSprite === sprites.length-1;
    }

}
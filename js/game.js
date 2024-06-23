"use strict";

export class Game {

    #level;
    #player;

    constructor(level,player) {
        this.#level = level;
        this.#player = player;
    }

    loadGameData() {
        return [
            this.#level.loadData(),
            this.#level.loadImage(),
            this.#player.loadData(),
            this.#player.loadImage()
        ];
    }

    animate(canvasElement) {
        setInterval(() => {
            const currentState = this.#player.sprites.currentState,
                  nextSprite = this.#player.sprites.getNextSprite(this.#player.data[currentState]["moves"]);

            canvasElement.clearRect();
            canvasElement.drawImage(this.#level);
            this.#player.canvasImage.positionOfSourceImage = {"x":nextSprite["x"],"y":nextSprite["y"]};
            canvasElement.drawImage(this.#player);
        },50);
    }

}
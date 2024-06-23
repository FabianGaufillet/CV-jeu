"use strict";

export class Game {

    #level;
    #player;
    #requestAnimationFrameID;

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
        this.#eventsManager();
        this.#loop(canvasElement);
    }

    #eventsManager() {

        document.addEventListener("keydown", (event) => {

            switch(event.key) {
                case "ArrowLeft":
                    if (!event.ctrlKey && this.#player.sprites.currentState !== "walkL") this.#updateStateOfPlayer("walkL");
                    else if (event.ctrlKey && this.#player.sprites.currentState !== "runL") this.#updateStateOfPlayer("runL");
                    break;

                case "ArrowRight":
                    if(!event.ctrlKey && this.#player.sprites.currentState !== "walkR") this.#updateStateOfPlayer("walkR");
                    else if (event.ctrlKey && this.#player.sprites.currentState !== "runR") this.#updateStateOfPlayer("runR");
                    break;

                case "ArrowUp":
                    if (!this.#player.sprites.currentState.startsWith("jump")) {
                        if (this.#player.sprites.currentState.endsWith("L")) this.#updateStateOfPlayer("jumpL");
                        else if (this.#player.sprites.currentState.endsWith("R")) this.#updateStateOfPlayer("jumpR");
                    }
                    break;

                case "Control":
                    if (this.#player.sprites.currentState === "walkL") this.#updateStateOfPlayer("runL");
                    else if (this.#player.sprites.currentState === "walkR") this.#updateStateOfPlayer("runR");
                    break;

                case "x":
                case "X":
                    if (!this.#player.sprites.currentState.startsWith("attack")) {
                        if (this.#player.sprites.currentState.endsWith("L")) this.#updateStateOfPlayer("attackL");
                        else if (this.#player.sprites.currentState.endsWith("R")) this.#updateStateOfPlayer("attackR");
                    }
                    break;

                default:
                    return;
            }
        });

        document.addEventListener("keyup", (event) => {

            switch(event.key) {
                case "ArrowLeft":
                    this.#updateStateOfPlayer("idleL");
                    break;

                case "ArrowRight":
                    this.#updateStateOfPlayer("idleR");
                    break;

                case "Control":
                    if (this.#player.sprites.currentState === "runL") this.#updateStateOfPlayer("walkL");
                    else if (this.#player.sprites.currentState === "runR") this.#updateStateOfPlayer("walkR");
                    break;

                case "x":
                case "X":
                    if (this.#player.sprites.currentState.startsWith("attack")) {
                        if (this.#player.sprites.currentState.endsWith("L")) this.#updateStateOfPlayer("idleL");
                        else if (this.#player.sprites.currentState.endsWith("R")) this.#updateStateOfPlayer("idleR");
                    }
                    break;

                default:
                    return;
            }
        });

    }

    #loop(canvasElement) {
        this.#updatePositionOfPlayer();
        canvasElement.clearRect();
        canvasElement.drawImage(this.#level);
        canvasElement.drawImage(this.#player);
        this.#requestAnimationFrameID = requestAnimationFrame(()=>this.#loop(canvasElement));
    }

    #updatePositionOfPlayer() {
        const currentState = this.#player.sprites.currentState,
              nextSprite = this.#player.sprites.getNextSprite(this.#player.data[currentState]["moves"]);

        this.#player.canvasImage.positionOfSourceImage = {"x":nextSprite["x"],"y":nextSprite["y"]};
        this.#player.canvasImage.positionInCanvas["x"] += this.#player.data[currentState]["velocityX"];
        this.#player.canvasImage.positionInCanvas["y"] += this.#player.data[currentState]["velocityY"];

    }

    #updateStateOfPlayer(state) {
        this.#player.imageFile = state;
        this.#player.sprites.currentState = state;
        this.#player.sprites.currentIndexOfSprite = 0;
    }

}
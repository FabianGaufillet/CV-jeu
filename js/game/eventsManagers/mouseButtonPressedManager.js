"use strict";

import {GameLauncher} from "../gameplay/gameLauncher.js";

export class MouseButtonPressedManager {

    #htmlCanvasElement;
    #canvasElement;
    #buttons;
    #gameLauncher;
    #gameLaunched = false;

    constructor(htmlCanvasElement, canvasElement, buttons) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#canvasElement = canvasElement;
        this.#buttons = buttons;
        this.#gameLauncher = new GameLauncher();
    }

    manageMouseButtonPressed(ev, mousedown, click) {
        const mouseX = ev.clientX-this.#htmlCanvasElement.offsetLeft,
              mouseY = ev.clientY-this.#htmlCanvasElement.offsetTop;

        for (const button of this.#buttons) {
            const leftX = button.canvasImage.positionInCanvas["x"]*this.#htmlCanvasElement.width,
                  rightX = (button.canvasImage.positionInCanvas["x"] + button.canvasImage.sizeInCanvas["width"])*this.#htmlCanvasElement.width,
                  topY = button.canvasImage.positionInCanvas["y"]*this.#htmlCanvasElement.height,
                  bottomY = (button.canvasImage.positionInCanvas["y"] + button.canvasImage.sizeInCanvas["height"])*this.#htmlCanvasElement.height,
                  overButton = mouseX >= leftX && mouseX <= rightX && mouseY >= topY && mouseY <= bottomY;

            let nextState = null;
            if (overButton) {
                if (click && button.type === "play") {
                    this.#gameLauncher.launchGame();
                    this.#gameLaunched = true;
                    return;
                } else if (!mousedown && button.sprites.currentState !== "hover") {
                    nextState = "hover";
                } else if (mousedown && button.sprites.currentState !== "click") {
                    nextState = "click";
                }
            } else if (button.sprites.currentState !== "normal") nextState = "normal";

            if (nextState) {
                button.sprites.changeSprite(nextState);
                button.sprites.setNextSprite(button.data[nextState],button.canvasImage);
            }
        }
        this.#canvasElement.drawImage(...this.#buttons);
    }

    get gameLaunched() {
        return this.#gameLaunched;
    }
}
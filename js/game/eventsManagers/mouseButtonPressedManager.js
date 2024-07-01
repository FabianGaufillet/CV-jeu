"use strict";

import {GameLauncher} from "../gameplay/gameLauncher.js";

export class MouseButtonPressedManager {

    #htmlCanvasElement;
    #canvasElement;
    #items;
    #gameLauncher;
    #gameLaunched = false;
    #screen = "mainMenu";
    #screenItems = {
        "mainMenu": ["play","config","info"],
        "config": ["back", "commands"],
        "info": ["back", "about"]
    };

    constructor(htmlCanvasElement, canvasElement, items) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#canvasElement = canvasElement;
        this.#items = items;
        this.#gameLauncher = new GameLauncher();
    }

    manageMouseButtonPressed(ev, mousedown, click) {
        const mouseX = ev.clientX-this.#htmlCanvasElement.offsetLeft,
              mouseY = ev.clientY-this.#htmlCanvasElement.offsetTop,
              concernedItems = this.#items.filter(item => this.#screenItems[this.#screen].includes(item.type));

        for (const item of concernedItems) {
            const leftX = item.canvasImage.positionInCanvas["x"]*this.#htmlCanvasElement.width,
                  rightX = (item.canvasImage.positionInCanvas["x"] + item.canvasImage.sizeInCanvas["width"])*this.#htmlCanvasElement.width,
                  topY = item.canvasImage.positionInCanvas["y"]*this.#htmlCanvasElement.height,
                  bottomY = (item.canvasImage.positionInCanvas["y"] + item.canvasImage.sizeInCanvas["height"])*this.#htmlCanvasElement.height,
                  overItem = mouseX >= leftX && mouseX <= rightX && mouseY >= topY && mouseY <= bottomY;

            let nextState = null;
            if (overItem) {
                if (click) {
                    this.#handleClick(item);
                    return;
                } else if (!mousedown && item.sprites.currentState !== "hover") {
                    nextState = "hover";
                } else if (mousedown && item.sprites.currentState !== "click") {
                    nextState = "click";
                }
            } else if (item.sprites.currentState !== "normal") nextState = "normal";

            if (nextState) this.#updateSprite(item, nextState);
        }
        this.#canvasElement.drawImage(...concernedItems);
    }

    #updateSprite(item, nextState) {
        item.sprites.changeSprite(nextState);
        item.sprites.setNextSprite(item.data[nextState],item.canvasImage);
    }

    #handleClick(item) {
        this.#updateSprite(item, "normal");
        switch (item.type) {
            case "play":
                this.#play();
                break;

            case "config":
                this.#config();
                break;

            case "info":
                this.#info();
                break;

            case "back":
                this.#back();
                break;
        }
    }

    #play() {
        this.#gameLauncher.launchGame();
        this.#gameLaunched = true;
    }

    #config() {
        this.#screen = "config";
        this.#canvasElement.drawImage(...this.#items.filter(item => this.#screenItems[this.#screen].includes(item.type)));
    }

    #info() {
        this.#screen = "info";
        this.#canvasElement.drawImage(...this.#items.filter(item => this.#screenItems[this.#screen].includes(item.type)));
    }

    #back() {
        this.#screen = "mainMenu";
        this.#canvasElement.drawImage(...this.#items.filter(item => this.#screenItems[this.#screen].includes(item.type)));
    }

    get gameLaunched() {
        return this.#gameLaunched;
    }
}
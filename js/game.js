"use strict";

import {CanvasElement} from "./canvasElement.js";
import {KeyboardEventsManager} from "./keyboardEventsManager.js";
import {Character} from "./character.js";

export class Game {

    #canvasElement;
    #level;
    #player;
    #enemies;
    #requestAnimationFrameID;
    #keyboardEventsManager;

    constructor(htmlCanvasElement,level,player,...enemies) {
        this.#canvasElement = new CanvasElement(htmlCanvasElement);
        this.#level = level;
        this.#player = player;
        this.#enemies = enemies;
        this.#keyboardEventsManager = new KeyboardEventsManager();
    }

    loadGameData() {
        return [
            this.#level.loadData(),
            this.#level.loadImage(),
            this.#player.loadData(),
            this.#player.loadImage(),
            ...this.#enemies.map(enemy => enemy.loadData()),
            ...this.#enemies.map(enemy => enemy.loadImage())
        ];
    }

    loop() {
        this.#player.setNextStateOfCharacter(this.#keyboardEventsManager.keyPressed);
        Character.updatePositionsOfCharacters(
            this.#canvasElement.width,
            this.#canvasElement.height,
            this.#player,
            ...this.#enemies
        );
        this.#canvasElement.drawImage([this.#level,...this.#enemies,this.#player]);
        Character.updateOnGroundStatus(
            this.#level["data"]["ground"],
            this.#canvasElement.width,
            this.#canvasElement.height,
            this.#player,
            ...this.#enemies
        );
        this.#requestAnimationFrameID = requestAnimationFrame(() => this.loop());
    }

}
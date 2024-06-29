"use strict";

import {CanvasElement} from "./canvasElement.js";
import {KeyboardEventsManager} from "./keyboardEventsManager.js";
import {Character} from "./character.js";
import {CollisionHandler} from "./collisionHandler.js";

export class Game {

    #canvasElement;
    #level;
    #player;
    #enemies;
    #requestAnimationFrameID;
    #keyboardEventsManager;
    #collisionHandler;

    constructor(htmlCanvasElement,level,player,...enemies) {
        CanvasElement.init(htmlCanvasElement);
        this.#canvasElement = new CanvasElement(htmlCanvasElement);
        this.#level = level;
        this.#player = player;
        this.#enemies = enemies;
        this.#keyboardEventsManager = new KeyboardEventsManager();
        this.#collisionHandler = new CollisionHandler(this.#player);
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
            CanvasElement.width,
            CanvasElement.height,
            this.#player,
            ...this.#enemies
        );
        this.#canvasElement.drawImage([this.#level,...this.#enemies,this.#player]);
        Character.updateOnGroundStatus(
            this.#level["data"]["ground"],
            CanvasElement.width,
            CanvasElement.height,
            this.#player,
            ...this.#enemies
        );
        this.#collisionHandler.detectCollision(this.#enemies);
        this.#requestAnimationFrameID = requestAnimationFrame(() => this.loop());
    }

}
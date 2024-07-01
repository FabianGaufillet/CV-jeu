"use strict";

import {GAME_REFRESH_RATE} from "./constants.js";
import {CanvasElement} from "../drawing/canvasElement.js";
import {Character} from "./character.js";
import {CollisionsManager} from "../eventsManagers/collisionsManager.js";
import {Score} from "./score.js";
import {Level} from "./level.js";
import {KeysPressedManager} from "../eventsManagers/keysPressedManager.js";

export class Game {

    #canvasElement;
    #levels;
    #digits;
    #player;
    #enemies;
    #keysPressedManager
    #collisionHandler;
    #score;
    #requestAnimationFrameID;
    #lastRefresh = Date.now();

    constructor(htmlCanvasElement,levels,digits,player,enemies) {
        this.#canvasElement = new CanvasElement(htmlCanvasElement);
        this.#levels = levels;
        this.#digits = digits;
        this.#player = player;
        this.#enemies = enemies;
        this.#keysPressedManager = new KeysPressedManager();
        this.#collisionHandler = new CollisionsManager(this.#player);
        this.#score = new Score(this.#digits);
    }

    loadGameData() {
        return [
            this.#player.loadData(),
            this.#player.loadImage(),
            ...this.#levels.map(level => level.loadData()),
            ...this.#digits.map(digit => digit.loadData()),
            ...this.#digits.map(digit => digit.loadImage()),
            ...this.#enemies.map(enemy => enemy.loadData()),
            ...this.#enemies.map(enemy => enemy.loadImage())
        ];
    }

    loop() {
        if (Date.now() - this.#lastRefresh >= GAME_REFRESH_RATE) {
            this.#lastRefresh = Date.now();
            this.#keysPressedManager.manageKeysPressed(this.#player);
            Character.updatePositionsOfCharacters(this.#player, ...this.#enemies);
            Level.levelSelection(this.#score.currentScore,this.#canvasElement);
            this.#levels[Level.currentLevel].ground.isCharacterOnGround(this.#player, ...this.#enemies);
            this.#collisionHandler.detectCollision(this.#enemies,this.#score);
            this.#canvasElement.drawImage(...this.#digits,...this.#enemies,this.#player);
        }
        this.#requestAnimationFrameID = requestAnimationFrame(() => this.loop());
    }

}
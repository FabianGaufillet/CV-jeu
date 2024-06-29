"use strict";

import {CanvasElement} from "../drawing/canvasElement.js";
import {KeyboardEventsManager} from "../eventsManagers/keyboardEventsManager.js";
import {Character} from "./character.js";
import {CollisionsManager} from "../eventsManagers/collisionsManager.js";
import {Score} from "../drawing/score.js";
import {GAME_REFRESH_RATE} from "../constants.js";

export class Game {

    #canvasElement;
    #level;
    #player;
    #enemies;
    #setIntervalID;
    #keyboardEventsManager;
    #collisionHandler;
    #digits;
    #score;

    constructor(htmlCanvasElement,level,digits,player,enemies) {
        CanvasElement.init(htmlCanvasElement);
        this.#canvasElement = new CanvasElement(htmlCanvasElement);
        this.#level = level;
        this.#digits = digits;
        this.#player = player;
        this.#enemies = enemies;
        this.#keyboardEventsManager = new KeyboardEventsManager();
        this.#collisionHandler = new CollisionsManager(this.#player);
        this.#score = new Score(this.#digits);
    }

    loadGameData() {
        return [
            this.#level.loadData(),
            ...this.#digits.map(digit => digit.loadData()),
            ...this.#digits.map(digit => digit.loadImage()),
            this.#player.loadData(),
            this.#player.loadImage(),
            ...this.#enemies.map(enemy => enemy.loadData()),
            ...this.#enemies.map(enemy => enemy.loadImage())
        ];
    }

    loop() {
        this.#setIntervalID = setInterval(() => {
            this.#player.setNextStateOfPlayer(this.#keyboardEventsManager.keyPressed);
            Character.updatePositionsOfCharacters(this.#player, ...this.#enemies);
            this.#canvasElement.drawImage(...this.#digits,...this.#enemies,this.#player);
            Character.updateOnGroundStatus(this.#level.ground, this.#player, ...this.#enemies);
            this.#collisionHandler.detectCollision(this.#enemies,this.#score);
        },GAME_REFRESH_RATE);
    }

}
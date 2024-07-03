"use strict";

import {GAME_REFRESH_RATE} from "./constants.js";
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
    #menuLauncher;

    constructor(canvasElement, menuLauncher, levels, digits, player, enemies) {
        this.#canvasElement = canvasElement;
        this.#menuLauncher = menuLauncher;
        this.#levels = levels;
        this.#digits = digits;
        this.#player = player;
        this.#enemies = enemies;
        this.#keysPressedManager = new KeysPressedManager();
        this.#collisionHandler = new CollisionsManager(this.#player);
        this.#score = new Score(this.#digits);
    }

    loadGameData() {
        this.#player.initCanvasImage();
        this.#enemies.map(enemy => enemy.initCanvasImage());
        this.#digits.map((digit,i) => digit.initCanvasImage(i));
    }

    loop() {
        if (Date.now() - this.#lastRefresh >= GAME_REFRESH_RATE) {
            this.#lastRefresh = Date.now();
            if (this.#keysPressedManager.backToMenu) {
                this.#keysPressedManager.backToMenu = false;
                cancelAnimationFrame(this.#requestAnimationFrameID);
                this.#menuLauncher.launchMenu();
                return;
            }
            if (!this.#keysPressedManager.gamePaused) {
                this.#keysPressedManager.manageKeysPressed(this.#player);
                Character.updatePositionsOfCharacters(this.#player, ...this.#enemies);
                Level.levelSelection(this.#score.currentScore,this.#canvasElement);
                this.#levels[Level.currentLevel].ground.isCharacterOnGround(this.#player, ...this.#enemies);
                this.#collisionHandler.detectCollision(this.#enemies,this.#score);
                this.#canvasElement.drawImage(...this.#digits,...this.#enemies,this.#player);
            } else if (this.#keysPressedManager.gamePaused) {
                this.#keysPressedManager.manageKeysPressed(this.#player);
            }
        }
        this.#requestAnimationFrameID = requestAnimationFrame(() => this.loop());
    }

}
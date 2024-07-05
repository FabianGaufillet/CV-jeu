"use strict";

import {
    GAME_REFRESH_RATE,
    DELAY_BEFORE_ENEMY_STATE_CHANGE,
    AVAILABLE_ENEMIES,
    DIRECTIONS,
    PROBABILITY_OF_ENEMY_APPEARANCE, DELAY_BEFORE_NEXT_ENEMY_APPEARANCE
} from "./constants.js";
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
    #lastEnemyAddedTime = Date.now();
    #menuLauncher;
    #pauseMessageOnDisplay = false;

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
            if (!this.#keysPressedManager.gamePaused) this.#pauseMessageOnDisplay = false;
            this.#lastRefresh = Date.now();
            if (this.#keysPressedManager.backToMenu) {
                this.#stopLoop();
                return;
            } else {
                this.#keysPressedManager.manageKeysPressed(this.#player);
                if (this.#keysPressedManager.gamePaused) {
                    if (!this.#pauseMessageOnDisplay) {
                        this.#canvasElement.drawText("JEU EN PAUSE","48px sans-serif", 0.4,0.5);
                        this.#pauseMessageOnDisplay = true;
                    }
                }
                else this.#updateGame();
            }
        }
        this.#requestAnimationFrameID = requestAnimationFrame(() => this.loop());
    }

    #stopLoop() {
        this.#keysPressedManager.backToMenu = false;
        cancelAnimationFrame(this.#requestAnimationFrameID);
        this.#menuLauncher.launchMenu();
    }

    #updateGame() {
        this.#updateEnemiesList();
        this.#updateEnemiesState();
        Character.updatePositionsOfCharacters(this.#player, ...this.#enemies);
        Level.levelSelection(this.#score.currentScore,this.#canvasElement);
        this.#levels[Level.currentLevel].ground.areCharactersOnGround(this.#player, ...this.#enemies);
        this.#collisionHandler.detectCollision(this.#enemies,this.#score);
        this.#canvasElement.drawImage(...this.#digits,...this.#enemies,this.#player);
    }

    #updateEnemiesList() {
        const type = AVAILABLE_ENEMIES[Math.floor(Math.random() * AVAILABLE_ENEMIES.length)],
              newEnemy = new Character(type, "walk" + DIRECTIONS.at(Math.floor(Math.random() * DIRECTIONS.length)));

        if (Date.now() - this.#lastEnemyAddedTime < DELAY_BEFORE_NEXT_ENEMY_APPEARANCE) return;
        this.#lastEnemyAddedTime = Date.now();
        if (Math.random() > PROBABILITY_OF_ENEMY_APPEARANCE) return;
        newEnemy.initCanvasImage();
        this.#enemies.push(newEnemy);
    }

    #updateEnemiesState() {
        for (const enemy of this.#enemies) {
            if (Date.now() - enemy.lastStatusChangeTime < DELAY_BEFORE_ENEMY_STATE_CHANGE) continue;
            enemy.setRandomState();
        }
    }

}
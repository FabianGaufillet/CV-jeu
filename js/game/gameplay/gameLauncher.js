"use strict";

import {AVAILABLE_ENEMIES, DIRECTIONS, MIN_ENEMIES, MAX_ENEMIES} from "./constants.js";
import {Level} from "./level.js";
import {Character} from "./character.js";
import {Game} from "./game.js";
import {Digits} from "../drawing/digits.js";

export class GameLauncher {

    #htmlCanvasElement;
    #canvasElement;
    #menuLauncher;
    #game;
    #nbEnemies;
    #levels;
    #player;
    #digits;
    #enemies;
    #ready;

    constructor(htmlCanvasElement, canvasElement, menuLauncher) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#canvasElement = canvasElement;
        this.#menuLauncher = menuLauncher;
        this.#ready = false;
        this.#initLevel();
    }

    #initLevel() {
        Promise.all([Level.loadAvailableLevelsData(), Character.loadAvailableCharacters(), Digits.loadDigits()].flat())
            .then(() => {
                this.#nbEnemies = Math.max(MIN_ENEMIES,Math.ceil(Math.random() * MAX_ENEMIES));
                this.#levels = [new Level(0),new Level(1)];
                this.#player = new Character("knight","idle"+DIRECTIONS.at(Math.floor(Math.random()*DIRECTIONS.length)));
                this.#digits =  [new Digits(), new Digits(), new Digits()];
                this.#enemies = [];
                this.#addEnemies();
                this.#createNewGame();
                this.#loadGameData();
        });
    }

    #addEnemies() {
        for (let i = 0; i < this.#nbEnemies; i++) {
            const type = AVAILABLE_ENEMIES[Math.floor(Math.random() * AVAILABLE_ENEMIES.length)];
            this.#enemies.push(new Character(type, "walk" + DIRECTIONS.at(Math.floor(Math.random() * DIRECTIONS.length))));
        }
    }

    #createNewGame() {
        this.#game = new Game(this.#canvasElement, this.#menuLauncher, this.#levels, this.#digits, this.#player, this.#enemies);
    }

    #loadGameData() {
        this.#game.loadGameData();
        this.#ready = true;
    }

    launchGame() {
        this.#canvasElement.setBackgroundImage(Level.currentLevel+1);
        this.#game.loop();
    }

    get ready() {
        return this.#ready;
    }

}
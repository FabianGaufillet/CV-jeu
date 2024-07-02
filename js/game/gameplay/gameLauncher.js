"use strict";

import {MAX_ENEMIES, ROOT_PATH_IMAGE_LEVEL} from "./constants.js";
import {Level} from "./level.js";
import {Character} from "./character.js";
import {Game} from "./game.js";
import {Digits} from "../drawing/digits.js";

export class GameLauncher {

    #htmlCanvasElement;
    #canvasElement;
    #menuLauncher;
    #game;
    #availableEnemies;
    #directions;
    #nbEnemies;
    #levels;
    #player;
    #digits;
    #enemies;
    #ready = false;

    constructor(htmlCanvasElement, canvasElement, menuLauncher) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#canvasElement = canvasElement;
        this.#menuLauncher = menuLauncher;
        this.#initLevel();
        this.#addEnemies();
        this.#createNewGame();
        this.#loadGameData();
    }

    #initLevel() {
        this.#availableEnemies = ["zombie_female","zombie_male"];
        this.#directions = ["L","R"];
        this.#nbEnemies = Math.ceil(Math.random() * MAX_ENEMIES);
        this.#levels = [new Level("level0"),new Level("level1")];
        this.#player = new Character("knight","idle"+this.#directions.at(Math.floor(Math.random()*this.#directions.length)));
        this.#digits =  [new Digits(), new Digits(), new Digits()];
        this.#enemies = [];
    }

    #addEnemies() {
        for (let i = 0; i < this.#nbEnemies; i++) {
            const type = this.#availableEnemies[Math.floor(Math.random() * this.#availableEnemies.length)];
            this.#enemies.push(new Character(type, "walk" + this.#directions.at(Math.floor(Math.random() * this.#directions.length))));
        }
    }

    #createNewGame() {
        this.#game = new Game(this.#canvasElement, this.#menuLauncher, this.#levels,this.#digits,this.#player,this.#enemies);
    }

    #loadGameData() {
        Promise.all(this.#game.loadGameData()).then(() => {
            this.#player.initCanvasImage();
            for (let i= 0; i < this.#enemies.length; i++) this.#enemies[i].initCanvasImage();
            for (let i= 0; i < this.#digits.length; i++) this.#digits[i].initCanvasImage(i);
        }).then(() => this.#ready = true);
    }

    launchGame() {
        this.#canvasElement.setBackgroundImage(`${ROOT_PATH_IMAGE_LEVEL}/level${Level.currentLevel}.svg`);
        this.#game.loop();
    }

    get ready() {
        return this.#ready;
    }

}
import {Level} from "./gameplay/level.js";
import {Character} from "./gameplay/character.js";
import {Game} from "./gameplay/game.js";
import {Digits} from "./drawing/digits.js";
import {MAX_ENEMIES} from "./constants.js";

(function() {
    "use strict";

    const availableEnemies = ["zombie_female","zombie_male"],
          directions = ["L","R"],
          nbEnemies = Math.ceil(Math.random() * MAX_ENEMIES),
          level = new Level("level1"),
          player = new Character("knight","idle"+directions.at(Math.floor(Math.random()*directions.length))),
          digits =  [new Digits(), new Digits(), new Digits()];

    let enemies = [];

    for (let i=0; i<nbEnemies; i++) {
        const type = availableEnemies[Math.floor(Math.random()*availableEnemies.length)];
        enemies.push(new Character(type,"walk"+directions.at(Math.floor(Math.random()*directions.length))));
    }

    document.addEventListener("DOMContentLoaded", function() {
        const canvas = document.querySelector("canvas"),
              game = new Game(canvas,level,digits,player,enemies);

        Promise.all(game.loadGameData()).then(() => {
            player.initCanvasImage();
            for (let i=0; i<enemies.length; i++) enemies[i].initCanvasImage();
            for (let i=0; i<digits.length; i++) digits[i].initCanvasImage(i);
            game.loop();
        });

    });

})();
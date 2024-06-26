import {Level} from "./level.js";
import {Character} from "./character.js";
import {Game} from "./game.js";

(function() {
    "use strict";

    document.addEventListener("DOMContentLoaded", function() {
        const canvas = document.querySelector("canvas"),
              level = new Level("level1"),
              player = new Character("knight","idleR"),
              enemies = [
                  new Character("zombie_female","walkR"),
                  new Character("zombie_male","walkL")
                  ],
              game = new Game(canvas,level,player,...enemies);

        Promise.all(game.loadGameData()).then(() => {
            level.initCanvasImage(canvas);
            player.initCanvasImage(level["data"]["player"],canvas.width,canvas.height);
            for (let i=0; i<enemies.length; i++) {
                enemies[i].initCanvasImage(level["data"]["enemies"][i],canvas.width,canvas.height);
            }
            game.loop();
        });

    });

})();
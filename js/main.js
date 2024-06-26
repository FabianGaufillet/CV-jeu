import {Level} from "./level.js";
import {Character} from "./character.js";
import {Game} from "./game.js";

(function() {
    "use strict";

    document.addEventListener("DOMContentLoaded", function() {
        const canvas = document.querySelector("canvas"),
              level = new Level("level1"),
              player = new Character("knight","idleR"),
              game = new Game(canvas,level,player);

        Promise.all(game.loadGameData()).then(() => {
            level.initCanvasImage(canvas);
            player.initCanvasImage(level["data"]["player"],canvas.width,canvas.height);
            game.loop();
        });

    });

})();
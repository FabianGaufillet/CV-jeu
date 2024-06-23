import {CanvasElement} from "./canvasElement.js";
import {Level} from "./level.js";
import {Character} from "./character.js";
import {Game} from "./game.js";

(function() {
    "use strict";

    document.addEventListener("DOMContentLoaded", function() {
        const canvas = new CanvasElement(document.querySelector("canvas")),
              level = new Level("level1"),
              player = new Character("knight","idleR"),
              game = new Game(level,player);

        Promise.all(game.loadGameData()).then(() => {
            level.initCanvasImage(canvas);
            player.initCanvasImage(level["data"]["player"]);
            game.animate(canvas);
        });

    });

})();
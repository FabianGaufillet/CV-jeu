import {Game} from "./game.js";

(function() {
    "use strict";

    document.addEventListener("DOMContentLoaded", function() {
        const canvas = document.querySelector("canvas"),
              game = new Game(canvas);

        game.initialize({
            "level":"level1",
            "player": {
                "type":"knight",
                "state":"idleR"
            },
            "enemies":[]
        }).then(() => game.animate());
    });

})();
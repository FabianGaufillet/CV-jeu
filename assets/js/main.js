import {Menu} from "./game/menu/menu.js";

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const htmlCanvasElement = document.querySelector("canvas#game");

        new Menu(htmlCanvasElement);

    });

})();
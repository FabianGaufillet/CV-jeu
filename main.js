import {MenuLauncher} from "./js/game/menu/menuLauncher.js";

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const htmlCanvasElement = document.querySelector("canvas#game")
            , menuLauncher = new MenuLauncher(htmlCanvasElement);

        Promise.all(menuLauncher.menu.loadMenuData()).then(() => {
            menuLauncher.initCanvasImages();
            menuLauncher.launchMenu();
        });

    });

})();
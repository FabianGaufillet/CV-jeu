import {MenuLauncher} from "./js/game/menu/menuLauncher.js";

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const menuLauncher = new MenuLauncher();
        Promise.all(menuLauncher.menu.loadMenuData()).then(() => {
            menuLauncher.initCanvasImages();
            menuLauncher.launchMenu();
        });

    });

})();
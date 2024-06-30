import {ROOT_PATH_IMAGE_MENU} from "./constants.js";
import {Menu} from "./menu.js";
import {MenuButton} from "./menuButton.js";

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const canvas = document.querySelector("canvas"),
              buttons = [new MenuButton("play","normal"),new MenuButton("config","normal"),new MenuButton("info","normal")],
              menu = new Menu(canvas,buttons);

        canvas.style.backgroundImage = `url(${ROOT_PATH_IMAGE_MENU}background.jpg)`;

        Promise.all(menu.loadMenuData()).then(() => {
            for (let i= 0; i < buttons.length; i++) buttons[i].initCanvasImage(i);
            menu.canvasElement.drawImage(...buttons);
            menu.mouseEventHandler();
        });

    });

})();
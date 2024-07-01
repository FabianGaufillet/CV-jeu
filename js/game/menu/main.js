import {
    ABOUT_HEIGHT,
    ABOUT_POSITION_X, ABOUT_POSITION_Y, ABOUT_WIDTH,
    BACK_BUTTON_POSITION_X,
    BACK_BUTTON_POSITION_Y,
    BUTTON_HEIGHT,
    BUTTON_WIDTH, COMMANDS_HEIGHT,
    COMMANDS_POSITION_X,
    COMMANDS_POSITION_Y, COMMANDS_WIDTH,
    CONFIG_BUTTON_POSITION_X,
    CONFIG_BUTTON_POSITION_Y,
    INFO_BUTTON_POSITION_X,
    INFO_BUTTON_POSITION_Y,
    PLAY_BUTTON_POSITION_X,
    PLAY_BUTTON_POSITION_Y,
    ROOT_PATH_IMAGE_MENU
} from "./constants.js";
import {Menu} from "./menu.js";
import {MenuItem} from "./menuItem.js";

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const canvas = document.querySelector("canvas"),
              playButton = new MenuItem("play","normal"),
              configButton = new MenuItem("config","normal"),
              infoButton = new MenuItem("info","normal"),
              backButton = new MenuItem("back","normal"),
              commands = new MenuItem("commands","normal"),
              about = new MenuItem("about", "normal"),
              menu = new Menu(canvas, [playButton, configButton, infoButton, backButton, commands, about]);

        canvas.style.backgroundImage = `url(${ROOT_PATH_IMAGE_MENU}/background.jpg)`;

        Promise.all(menu.loadMenuData()).then(() => {
            playButton.initCanvasImage(PLAY_BUTTON_POSITION_X, PLAY_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
            configButton.initCanvasImage(CONFIG_BUTTON_POSITION_X, CONFIG_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
            infoButton.initCanvasImage(INFO_BUTTON_POSITION_X, INFO_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
            backButton.initCanvasImage(BACK_BUTTON_POSITION_X, BACK_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
            commands.initCanvasImage(COMMANDS_POSITION_X, COMMANDS_POSITION_Y, COMMANDS_WIDTH, COMMANDS_HEIGHT);
            about.initCanvasImage(ABOUT_POSITION_X, ABOUT_POSITION_Y, ABOUT_WIDTH, ABOUT_HEIGHT);
            menu.canvasElement.drawImage(playButton, configButton, infoButton);
            menu.mouseEventHandler();
        });

    });

})();
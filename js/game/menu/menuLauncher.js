"use strict";

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

export class MenuLauncher {

    #htmlCanvasElement;
    #playButton;
    #configButton;
    #infoButton;
    #backButton;
    #commands;
    #about;
    #menu;

    constructor() {
        this.#htmlCanvasElement = document.querySelector("canvas#game");
        this.#initMenu();
    }

    #initMenu() {
        this.#playButton = new MenuItem("play","normal");
        this.#configButton = new MenuItem("config","normal");
        this.#infoButton = new MenuItem("info","normal");
        this.#backButton = new MenuItem("back","normal");
        this.#commands = new MenuItem("commands","normal");
        this.#about = new MenuItem("about", "normal");
        this.#menu = new Menu(this.#htmlCanvasElement, [this.#playButton, this.#configButton, this.#infoButton, this.#backButton, this.#commands, this.#about]);
    }

    initCanvasImages() {
        this.#playButton.initCanvasImage(PLAY_BUTTON_POSITION_X, PLAY_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
        this.#configButton.initCanvasImage(CONFIG_BUTTON_POSITION_X, CONFIG_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
        this.#infoButton.initCanvasImage(INFO_BUTTON_POSITION_X, INFO_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
        this.#backButton.initCanvasImage(BACK_BUTTON_POSITION_X, BACK_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
        this.#commands.initCanvasImage(COMMANDS_POSITION_X, COMMANDS_POSITION_Y, COMMANDS_WIDTH, COMMANDS_HEIGHT);
        this.#about.initCanvasImage(ABOUT_POSITION_X, ABOUT_POSITION_Y, ABOUT_WIDTH, ABOUT_HEIGHT);
    }

    launchMenu() {
        this.#htmlCanvasElement.style.backgroundImage = `url(${ROOT_PATH_IMAGE_MENU}/background.jpg)`;
        this.#menu.canvasElement.drawImage(this.#playButton, this.#configButton, this.#infoButton);
        this.#menu.mouseEventsManager.initializeMouseEventsHandler(this);
    }

    get menu() {
        return this.#menu;
    }
}
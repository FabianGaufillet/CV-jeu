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
import {MenuItem} from "./menuItem.js";
import {CanvasElement} from "../drawing/canvasElement.js";
import {GameLauncher} from "../gameplay/gameLauncher.js";
import {MouseEventsManager} from "../eventsManagers/mouseEventsManager.js";

export class Menu {

    #htmlCanvasElement;
    #canvasElement;
    #gameLauncher;
    #playButton;
    #configButton;
    #infoButton;
    #backButton;
    #commands;
    #about;
    #mouseEventsManager;

    constructor(htmlCanvasElement) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#canvasElement = new CanvasElement(htmlCanvasElement);
        this.#gameLauncher = new GameLauncher(this.#htmlCanvasElement, this.#canvasElement, this);
        this.#initMenu();
    }

    #initMenu() {
        Promise.all(MenuItem.loadAvailableMenuItems())
            .then(() => {
                this.#playButton = new MenuItem("play","normal");
                this.#configButton = new MenuItem("config","normal");
                this.#infoButton = new MenuItem("info","normal");
                this.#backButton = new MenuItem("back","normal");
                this.#commands = new MenuItem("commands","normal");
                this.#about = new MenuItem("about", "normal");
                this.#mouseEventsManager = new MouseEventsManager(this.#htmlCanvasElement, this.#canvasElement, [this.#playButton, this.#configButton, this.#infoButton, this.#backButton, this.#commands, this.#about]);
                this.initCanvasImages();
                this.launchMenu();
            });
    }

    initCanvasImages() {
        this.#playButton.initCanvasImage(PLAY_BUTTON_POSITION_X, PLAY_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
        this.#configButton.initCanvasImage(CONFIG_BUTTON_POSITION_X, CONFIG_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
        this.#infoButton.initCanvasImage(INFO_BUTTON_POSITION_X, INFO_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
        this.#backButton.initCanvasImage(BACK_BUTTON_POSITION_X, BACK_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
        this.#commands.initCanvasImage(COMMANDS_POSITION_X, COMMANDS_POSITION_Y, COMMANDS_WIDTH, COMMANDS_HEIGHT);
        this.#about.initCanvasImage(ABOUT_POSITION_X, ABOUT_POSITION_Y, ABOUT_WIDTH, ABOUT_HEIGHT);
    }

    #waitForGameLaunched() {
        const gameLaunchAttempt = () => {
            if (this.#gameLauncher.ready) {
                this.#gameLauncher.launchGame(this);
                this.#htmlCanvasElement.removeEventListener("gameLaunchAttempt", gameLaunchAttempt);
                this.#htmlCanvasElement.dispatchEvent(new Event('gameLaunched'));
            }
        };
        this.#htmlCanvasElement.addEventListener("gameLaunchAttempt", gameLaunchAttempt);
    }

    launchMenu() {
        this.#canvasElement.setBackgroundImage(`${ROOT_PATH_IMAGE_MENU}/background.jpg`);
        this.#canvasElement.drawImage(this.#playButton, this.#configButton, this.#infoButton);
        this.#mouseEventsManager.initializeMouseEventsHandler();
        this.#waitForGameLaunched();
    }
}
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
    PLAY_BUTTON_POSITION_Y
} from "./constants.js";
import {MenuItem} from "./menuItem.js";
import {CanvasElement} from "../drawing/canvasElement.js";
import {GameLauncher} from "../gameplay/gameLauncher.js";
import {MouseEventsManager} from "../eventsManagers/mouseEventsManager.js";

/** Classe décrivant le menu principal */
export class Menu {

    /**
     * @property {HTMLCanvasElement} #htmlCanvasElement Canvas dans lequel dessiner
     */
    #htmlCanvasElement;

    /**
     * @property {CanvasElement} #canvasElement Informations et méthodes pour la balise Canvas
     */
    #canvasElement;

    /**
     * @property {GameLauncher} #gameLauncher Tout le nécessaire pour lancer le jeu
     */
    #gameLauncher;

    /**
     * @property {MenuItem} #playButton Bouton de lancement de partie
     */
    #playButton;

    /**
     * @property {MenuItem} #configButton Bouton pour affichage des commandes
     */
    #configButton;

    /**
     * @property {MenuItem} #infoButton Bouton pour affichage du scénario
     */
    #infoButton;

    /**
     * @property {MenuItem} #backButton Bouton pour retour au menu principal
     */
    #backButton;

    /**
     * @property {MenuItem} #commands Graphique montrant les commandes
     */
    #commands;

    /**
     * @property {MenuItem} #about Graphique montrant le scénario
     */
    #about;

    /**
     * @property {MouseEventsManager} #mouseEventsManager Tout le nécessaire pour gérer les événements liés à la souris
     */
    #mouseEventsManager;

    /**
     * Créé le menu principal du jeu
     * @param {HTMLCanvasElement} htmlCanvasElement Canvas dans lequel dessiner
     */
    constructor(htmlCanvasElement) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#canvasElement = new CanvasElement(htmlCanvasElement);
        this.#gameLauncher = new GameLauncher(this.#htmlCanvasElement, this.#canvasElement, this);
        this.#initMenu();
    }

    /**
     * Initialise le menu (chargement des items, des images, du gestionnaire d'événements liés à la souris ...)
     */
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

    /**
     * Initialisation des images (position, taille) pour affichage dans la balise canvas
     */
    initCanvasImages() {
        this.#playButton.initCanvasImage(PLAY_BUTTON_POSITION_X, PLAY_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
        this.#configButton.initCanvasImage(CONFIG_BUTTON_POSITION_X, CONFIG_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
        this.#infoButton.initCanvasImage(INFO_BUTTON_POSITION_X, INFO_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
        this.#backButton.initCanvasImage(BACK_BUTTON_POSITION_X, BACK_BUTTON_POSITION_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
        this.#commands.initCanvasImage(COMMANDS_POSITION_X, COMMANDS_POSITION_Y, COMMANDS_WIDTH, COMMANDS_HEIGHT);
        this.#about.initCanvasImage(ABOUT_POSITION_X, ABOUT_POSITION_Y, ABOUT_WIDTH, ABOUT_HEIGHT);
    }

    /**
     * Lance le menu : définition de l'image de fond, dessin des boutons et écoute d'événements
     */
    launchMenu() {
        this.#canvasElement.setBackgroundImage(0);
        this.#canvasElement.drawImage(this.#playButton, this.#configButton, this.#infoButton);
        this.#mouseEventsManager.initializeMouseEventsHandler();
        this.#waitForGameLaunched();
    }

    /**
     * Définition d'un écouteur sur l'événement "gameLaunchAttempt" déclenché après clic sur le bouton "playButton"
     * Lance la partie si tous les éléments du jeu sont chargés
     */
    #waitForGameLaunched() {
        const gameLaunchAttempt = () => {
            if (this.#gameLauncher.ready) {
                this.#gameLauncher.launchGame();
                this.#htmlCanvasElement.removeEventListener("gameLaunchAttempt", gameLaunchAttempt);
                this.#htmlCanvasElement.dispatchEvent(new Event('gameLaunched'));
            }
        };
        this.#htmlCanvasElement.addEventListener("gameLaunchAttempt", gameLaunchAttempt);
    }
}
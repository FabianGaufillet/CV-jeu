"use strict";

import {MouseButtonPressedManager} from "./mouseButtonPressedManager.js";

/** Classe permettant de détecter les événements liés à la sourir */
export class MouseEventsManager {

    /**
     * @property {HTMLCanvasElement} #htmlCanvasElement Canvas sur lequel écouter les événements
     */
    #htmlCanvasElement;

    /**
     * @property {boolean} #mouseup Indique si le bouton de la souris est relâché
     */
    #mouseup = false;

    /**
     * @property {boolean} #mousedown Indique si le bouton de la souris est appuyé
     */
    #mousedown = false;

    /**
     * @property {boolean} #click Indique si un clic a eu lieu (succession de mousedown - mouseup)
     */
    #click = false;

    /**
     * @property {MouseButtonPressedManager} #mouseButtonPressedManager Gère les événements liés aux clics de souris
     */
    #mouseButtonPressedManager;

    /**
     * @property {string[]} #eventsList Ensemble des événements à écouter
     */
    #eventsList = ["mousemove","mousedown","mouseup","gameLaunched"];

    /**
     * @property {function} #mouseEventsHandler Fonction de callback à appeler au clic de souris
     */
    #mouseEventsHandler;

    /**
     * Créé une instance de MouseEventsManager
     * @param {HTMLCanvasElement} htmlCanvasElement Canvas sur lequel écouter les événements
     * @param {CanvasElement} canvasElement Informations et méthodes pour la balise Canvas
     * @param {MenuItem[]} buttons Tous les boutons du menu principal
     */
    constructor(htmlCanvasElement, canvasElement, buttons) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#mouseButtonPressedManager = new MouseButtonPressedManager(htmlCanvasElement, canvasElement, buttons);
    }

    /**
     * Fonction qui met à jour les informations relatifs aux clics de souris
     */
    initializeMouseEventsHandler() {
        this.#mouseEventsHandler = ev => {
            if (ev.type === "gameLaunched") {
                this.#eventsList.forEach(typeOfEvent => this.#htmlCanvasElement.removeEventListener(typeOfEvent, this.#mouseEventsHandler));
            } else {
                if (ev.type === "mouseup" && ev.which === 1) {
                    if (this.#mousedown) {
                        this.#click = true;
                        setTimeout(()=> this.#click = false,50);
                    }
                    this.#mouseup = true;
                    this.#mousedown = false;
                } else if (ev.type === "mousedown" && ev.which === 1) {
                    this.#mouseup = false;
                    this.#mousedown = true;
                }
                this.#mouseButtonPressedManager.manageMouseButtonPressed(ev, this.#mousedown, this.#click);
            }
        }
        this.#listenEvents();
    }

    /**
     * Fonction qui ajoute un écouteur d'événements pour chaque événement défini
     */
    #listenEvents() {
        this.#eventsList.forEach(typeOfEvent => {
            this.#htmlCanvasElement.addEventListener(typeOfEvent, this.#mouseEventsHandler);
        });
    }

}
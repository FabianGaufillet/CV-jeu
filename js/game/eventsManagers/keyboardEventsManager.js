"use strict";

/** Classe permettant de répertorier les touches sur lesquelles le joueur appuie */
export class KeyboardEventsManager {

    /**
     * @property {boolean} #arrowLeft Indique si le joueur appuie sur la touche de gauche
     */
    #arrowLeft;

    /**
     * @property {boolean} #arrowLeft Indique si le joueur appuie sur la touche de droite
     */
    #arrowRight;

    /**
     * @property {boolean} #arrowLeft Indique si le joueur appuie sur la touche du haut
     */
    #arrowUp;

    /**
     * @property {boolean} #arrowLeft Indique si le joueur appuie sur la touche "Ctrl"
     */
    #control;

    /**
     * @property {boolean} #arrowLeft Indique si le joueur appuie sur la touche "x"
     */
    #x;

    /**
     * @property {boolean} #arrowLeft Indique si le joueur appuie sur la touche "p"
     */
    #p;

    /**
     * @property {boolean} #arrowLeft Indique si le joueur appuie sur la touche "Échap"
     */
    #escape;

    /**
     * Créé une instance de KeyboardEventsManager
     */
    constructor() {
        this.#arrowLeft = false;
        this.#arrowRight = false;
        this.#arrowUp = false;
        this.#control = false;
        this.#x = false;
        this.#p = false;
        this.#escape = false;
        this.#setEventsManager();
    }

    /**
     * Définit l'écouteur d'événements sur les frappes au clavier du joueur
     */
    #setEventsManager() {
        document.addEventListener("keydown", (event) => {

            event.preventDefault();
            if (event.repeat) return false;
            switch(event.key) {

                case "ArrowLeft":
                    this.#arrowLeft = true;
                    break;

                case "ArrowRight":
                    this.#arrowRight = true;
                    break;

                case "ArrowUp":
                    this.#arrowUp = true;
                    break;

                case "Control":
                    this.#control = true;
                    break;

                case "x":
                case "X":
                    this.#x = true;
                    break;

                case "p":
                case "P":
                    this.#p = true;
                    break;

                case "Escape":
                    this.#escape = true;
                    break;

                default:
                    return;
            }
        });

        document.addEventListener("keyup", (event) => {

            switch(event.key) {

                case "ArrowLeft":
                    this.#arrowLeft = false;
                    break;

                case "ArrowRight":
                    this.#arrowRight = false;
                    break;

                case "ArrowUp":
                    this.#arrowUp = false;
                    break;

                case "Control":
                    this.#control = false;
                    break;

                case "x":
                case "X":
                    this.#x = false;
                    break;

                case "p":
                case "P":
                    this.#p = false;
                    break;

                case "Escape":
                    this.#escape = false;
                    break;

                default:
                    return;
            }
        });
    }

    /**
     * Retourne l'ensemble des états des différentes touches
     * @returns {{p, arrowLeft, x, control, arrowUp, escape, arrowRight}} État des touches utiles au jeu
     */
    get keyPressed() {
        return {
            "arrowLeft": this.#arrowLeft,
            "arrowRight": this.#arrowRight,
            "arrowUp": this.#arrowUp,
            "control": this.#control,
            "x": this.#x,
            "p": this.#p,
            "escape": this.#escape
        };
    }

}
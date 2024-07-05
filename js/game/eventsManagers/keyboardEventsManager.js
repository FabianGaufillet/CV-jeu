"use strict";

export class KeyboardEventsManager {

    #arrowLeft;
    #arrowRight;
    #arrowUp;
    #control;
    #x;
    #p;
    #escape;

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

    #setEventsManager() {
        document.addEventListener("keydown", (event) => {

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
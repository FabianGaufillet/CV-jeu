"use strict";

import {MouseButtonPressedManager} from "./mouseButtonPressedManager.js";

export class MouseEventsManager {

    #htmlCanvasElement;
    #mouseup = false;
    #mousedown = false;
    #click = false;
    #mouseButtonPressedManager;
    #eventsList = ["mousemove","mousedown","mouseup","gameLaunched"];
    #mouseEventsHandler;

    constructor(htmlCanvasElement, canvasElement, buttons) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#mouseButtonPressedManager = new MouseButtonPressedManager(htmlCanvasElement, canvasElement, buttons);
    }

    initializeMouseEventsHandler() {
        this.#mouseEventsHandler = ev => {
            if (ev.type === "gameLaunched") {
                this.#eventsList.forEach(typeOfEvent => this.#htmlCanvasElement.removeEventListener(typeOfEvent, this.#mouseEventsHandler));
            } else {
                if (ev.type === "mouseup") {
                    if (this.#mousedown) {
                        this.#click = true;
                        setTimeout(()=> this.#click = false,50);
                    }
                    this.#mouseup = true;
                    this.#mousedown = false;
                } else if (ev.type === "mousedown") {
                    this.#mouseup = false;
                    this.#mousedown = true;
                }
                this.#mouseButtonPressedManager.manageMouseButtonPressed(ev, this.#mousedown, this.#click);
            }
        }
        this.#listenEvents();
    }

    #listenEvents() {
        this.#eventsList.forEach(typeOfEvent => {
            this.#htmlCanvasElement.addEventListener(typeOfEvent, this.#mouseEventsHandler);
        });
    }

}
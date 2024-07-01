"use strict";

import {MouseButtonPressedManager} from "./mouseButtonPressedManager.js";

export class MouseEventsManager {

    #htmlCanvasElement;
    #mouseup = false;
    #mousedown = false;
    #click = false;
    #mouseButtonPressedManager;
    #eventsList = ["mousemove","mousedown","mouseup"]
    #mouseEventsHandler;

    constructor(htmlCanvasElement, canvasElement, buttons) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#mouseButtonPressedManager = new MouseButtonPressedManager(htmlCanvasElement, canvasElement, buttons);
        this.#initializeMouseEventsHandler();
        this.#listenEvents();
    }

    #initializeMouseEventsHandler() {
        this.#mouseEventsHandler = ev => {
            if (this.#mouseButtonPressedManager.gameLaunched) {
                this.#eventsList.forEach(typeOfEvent => this.#htmlCanvasElement.removeEventListener(typeOfEvent, this.#mouseEventsHandler));
            } else {
                if (ev.type === "mouseup") {
                    if (this.#mousedown) {
                        this.#click = true;
                        setTimeout(()=> this.#click = false,100);
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
    }

    #listenEvents() {
        this.#eventsList.forEach(typeOfEvent => {
            this.#htmlCanvasElement.addEventListener(typeOfEvent, this.#mouseEventsHandler);
        });
    }

}
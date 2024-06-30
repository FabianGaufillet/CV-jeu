"use strict";

import {CanvasElement} from "../drawing/canvasElement.js";
import {MouseEventsManager} from "../eventsManagers/mouseEventsManager.js";

export class Menu {

    #htmlCanvasElement;
    #canvasElement;
    #buttons;
    #mouseEventsManager;

    constructor(htmlCanvasElement, buttons) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#canvasElement = new CanvasElement(htmlCanvasElement);
        this.#buttons = buttons;
    }

    loadMenuData() {
        return [
            ...this.#buttons.map(button => button.loadData()),
            ...this.#buttons.map(button => button.loadImage())
        ];
    }

    mouseEventHandler() {
        this.#mouseEventsManager = new MouseEventsManager(this.#htmlCanvasElement, this.#canvasElement, this.#buttons);
    }

    get canvasElement() {
        return this.#canvasElement;
    }

}
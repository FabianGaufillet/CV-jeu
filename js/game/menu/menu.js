"use strict";

import {CanvasElement} from "../drawing/canvasElement.js";
import {MouseEventsManager} from "../eventsManagers/mouseEventsManager.js";

export class Menu {

    #htmlCanvasElement;
    #canvasElement;
    #items;
    #mouseEventsManager;

    constructor(htmlCanvasElement, items) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#canvasElement = new CanvasElement(htmlCanvasElement);
        this.#items = items;
    }

    loadMenuData() {
        return [
            ...this.#items.map(item => item.loadData()),
            ...this.#items.map(item => item.loadImage())
        ];
    }

    mouseEventHandler() {
        this.#mouseEventsManager = new MouseEventsManager(this.#htmlCanvasElement, this.#canvasElement, this.#items);
    }

    get canvasElement() {
        return this.#canvasElement;
    }

}
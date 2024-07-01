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
        this.#mouseEventsManager = new MouseEventsManager(this.#htmlCanvasElement, this.#canvasElement, this.#items);
    }

    loadMenuData() {
        return [
            ...this.#items.map(item => item.loadData()),
            ...this.#items.map(item => item.loadImage())
        ];
    }

    get canvasElement() {
        return this.#canvasElement;
    }

    get mouseEventsManager() {
        return this.#mouseEventsManager;
    }

}
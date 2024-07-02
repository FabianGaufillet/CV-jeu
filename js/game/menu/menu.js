"use strict";

import {MouseEventsManager} from "../eventsManagers/mouseEventsManager.js";

export class Menu {

    #items;
    #mouseEventsManager;

    constructor(htmlCanvasElement, canvasElement, items) {
        this.#items = items;
        this.#mouseEventsManager = new MouseEventsManager(htmlCanvasElement, canvasElement, this.#items);
    }

    loadMenuData() {
        return [
            ...this.#items.map(item => item.loadData()),
            ...this.#items.map(item => item.loadImage())
        ];
    }

    get mouseEventsManager() {
        return this.#mouseEventsManager;
    }

}
"use strict";

import {ROOT_PATH_DATA_MENU, ROOT_PATH_IMAGE_MENU} from "./constants.js";
import {CanvasImage} from "../drawing/canvasImage.js";
import {Sprite} from "../drawing/sprite.js";

export class MenuItem {

    static #availableMenuItems = ["play","config","info","back","commands","about"];
    static #allMenuItemsData = {};
    static #allMenuItemsImages = {};

    type;
    #sprites;
    #canvasImage;

    constructor(type,status) {
        this.type = type;
        this.#sprites = new Sprite(status,0);
    }

    static #loadData(type) {
        return fetch(`${ROOT_PATH_DATA_MENU}/${type}.json`)
            .then(res => res.json())
            .then(data => this.#allMenuItemsData[type] = data);
    }

    static #loadImage(type) {
        return new Promise((resolve, reject) => {
            this.#allMenuItemsImages[type] = new Image();
            this.#allMenuItemsImages[type].addEventListener("load", resolve);
            this.#allMenuItemsImages[type].addEventListener("error", reject);
            this.#allMenuItemsImages[type].src = `${ROOT_PATH_IMAGE_MENU}/${type}.png`;
        });
    }

    static loadAvailableMenuItems() {
        return [
            this.#availableMenuItems.map(availableMenuItem => MenuItem.#loadData(availableMenuItem)),
            this.#availableMenuItems.map(availableMenuItem => MenuItem.#loadImage(availableMenuItem))
        ].flat();
    }

    initCanvasImage(posX,posY,width,height) {
        const currentState = this.#sprites["currentState"],
              settings = MenuItem.#allMenuItemsData[this.type][currentState];

        this.#canvasImage = new CanvasImage({
            "sourceImage":{
                "x":settings[0]["x"],
                "y":settings[0]["y"],
                "w":settings[0]["w"],
                "h":settings[0]["h"]
            },
            "canvas":{
                "x":posX,
                "y":posY,
                "w":width,
                "h":height
            }
        });
    }

    get sprites() {
        return this.#sprites;
    }

    get data() {
        return MenuItem.#allMenuItemsData[this.type];
    }

    get image() {
        return MenuItem.#allMenuItemsImages[this.type];
    }

    get canvasImage() {
        return this.#canvasImage;
    }

}
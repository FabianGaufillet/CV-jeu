"use strict";

import {CanvasImage} from "../drawing/canvasImage.js";
import {
    BUTTONS_MENU_MARGIN_RIGHT,
    PLAY_BUTTON_HEIGHT,
    PLAY_BUTTON_POSITION_X,
    PLAY_BUTTON_POSITION_Y,
    PLAY_BUTTON_WIDTH,
    ROOT_PATH_DATA_MENU, ROOT_PATH_IMAGE_MENU
} from "./constants.js";
import {Sprite} from "../drawing/sprite.js";

export class MenuButton {

    #type;
    #dataFile;
    #imageFile;
    #sprites;
    #data;
    #image;
    #canvasImage;

    constructor(type,status) {
        this.#type = type;
        this.#dataFile = `${ROOT_PATH_DATA_MENU}${type}.json`;
        this.#imageFile = `${ROOT_PATH_IMAGE_MENU}${type}_button.png`;
        this.#sprites = new Sprite(status,0);
    }

    loadData() {
        return fetch(this.#dataFile)
            .then(res => res.json())
            .then(data => this.#data = data);
    }

    loadImage() {
        return new Promise((resolve, reject) => {
            this.#image = new Image();
            this.#image.addEventListener("load", resolve);
            this.#image.addEventListener("error", reject);
            this.#image.src = this.#imageFile;
        });
    }

    initCanvasImage(index) {
        const currentState = this.#sprites["currentState"],
              settings = this.#data[currentState];

        this.#canvasImage = new CanvasImage({
            "sourceImage":{
                "x":settings[0]["x"],
                "y":settings[0]["y"],
                "w":settings[0]["w"],
                "h":settings[0]["h"]
            },
            "canvas":{
                "x":PLAY_BUTTON_POSITION_X+BUTTONS_MENU_MARGIN_RIGHT*index,
                "y":PLAY_BUTTON_POSITION_Y,
                "w":PLAY_BUTTON_WIDTH,
                "h":PLAY_BUTTON_HEIGHT
            }
        });
    }

    get type() {
        return this.#type;
    }

    get sprites() {
        return this.#sprites;
    }

    get data() {
        return this.#data;
    }

    get image() {
        return this.#image;
    }

    get canvasImage() {
        return this.#canvasImage;
    }

}
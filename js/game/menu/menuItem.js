"use strict";

import {ROOT_PATH_DATA_MENU, ROOT_PATH_IMAGE_MENU} from "./constants.js";
import {CanvasImage} from "../drawing/canvasImage.js";
import {Sprite} from "../drawing/sprite.js";

export class MenuItem {

    #type;
    #dataFile;
    #imageFile;
    #sprites;
    #data;
    #image;
    #canvasImage;

    constructor(type,status) {
        this.#type = type;
        this.#dataFile = `${ROOT_PATH_DATA_MENU}/${type}.json`;
        this.#imageFile = `${ROOT_PATH_IMAGE_MENU}/${type}.png`;
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

    initCanvasImage(posX,posY,width,height) {
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
                "x":posX,
                "y":posY,
                "w":width,
                "h":height
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
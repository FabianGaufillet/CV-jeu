"use strict";

import {CanvasImage} from "./canvasImage.js";
import {ROOT_PATH_DATA_LEVEL,ROOT_PATH_IMAGE_LEVEL} from "./constants.js";

export class Level {

    #dataFile;
    #data;
    #imageFile;
    #image;
    #canvasImage;

    constructor(name) {
        this.#dataFile = `${ROOT_PATH_DATA_LEVEL}${name}.json`;
        this.#imageFile = `${ROOT_PATH_IMAGE_LEVEL}${name}.svg`;
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

    initCanvasImage(canvas) {
        this.#canvasImage = new CanvasImage({
            "canvas":{
                "x":0,
                "y":0,
                "w":canvas.width,
                "h":canvas.height
            }
        });
    }

    get image() {
        return this.#image;
    }

    get canvasImage() {
        return this.#canvasImage;
    }

    get data() {
        return this.#data;
    }

}
"use strict";

import {CanvasImage} from "./canvasImage.js";

export class Level {

    #rootPaths = {
        "data": "./data/levels/",
        "image": "./images/levels/"
    };
    #dataPath;
    #data;
    #imagePath;
    #image;
    #canvasImage;

    constructor(name) {
        this.#dataPath = `${this.#rootPaths["data"]}${name}.json`;
        this.#imagePath = `${this.#rootPaths["image"]}${name}.svg`;
    }

    loadData() {
        return fetch(this.#dataPath)
            .then(res => res.json())
            .then(data => this.#data = data);
    }

    loadImage() {
        return new Promise((resolve, reject) => {
            this.#image = new Image();
            this.#image.addEventListener("load", resolve);
            this.#image.addEventListener("error", reject);
            this.#image.src = this.#imagePath;
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
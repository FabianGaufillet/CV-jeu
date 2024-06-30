"use strict";

import {
    ROOT_PATH_DATA_NUMBERS,
    ROOT_PATH_IMAGE_NUMBERS,
    DIGITS_MARGIN_RIGHT,
    SCORE_POSITION_X,
    SCORE_POSITION_Y,
    SCORE_WIDTH,
    SCORE_HEIGHT
} from "./constants.js";
import {Sprite} from "./sprite.js";
import {CanvasImage} from "./canvasImage.js";

export class Digits {

    #dataFile;
    #imageFile;
    #sprites;
    #numbers;
    #image;
    #canvasImage;

    constructor() {
        this.#dataFile = `${ROOT_PATH_DATA_NUMBERS}numbers.json`;
        this.#imageFile = `${ROOT_PATH_IMAGE_NUMBERS}numbers.png`;
        this.#sprites = new Sprite(null,0);
    }

    loadData() {
        return fetch(this.#dataFile)
            .then(res => res.json())
            .then(data => this.#numbers = data);
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
        this.#canvasImage = new CanvasImage({
            "sourceImage":{
                "x":this.#numbers["0"]["x"],
                "y":this.#numbers["0"]["y"],
                "w":this.#numbers["0"]["w"],
                "h":this.#numbers["0"]["h"]
            },
            "canvas":{
                "x":SCORE_POSITION_X+DIGITS_MARGIN_RIGHT*index,
                "y":SCORE_POSITION_Y,
                "w":SCORE_WIDTH,
                "h":SCORE_HEIGHT
            }
        });
    }

    get numbers() {
        return this.#numbers;
    }

    get image() {
        return this.#image;
    }

    get canvasImage() {
        return this.#canvasImage;
    }

}
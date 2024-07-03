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

    static #numbersData;
    static #numbersImage;
    #sprites;
    #canvasImage;

    constructor() {
        this.#sprites = new Sprite(null,0);
    }

    static #loadData() {
        return fetch(`${ROOT_PATH_DATA_NUMBERS}/numbers.json`)
            .then(res => res.json())
            .then(data => this.#numbersData = data);
    }

    static #loadImage() {
        return new Promise((resolve, reject) => {
            this.#numbersImage = new Image();
            this.#numbersImage.addEventListener("load", resolve);
            this.#numbersImage.addEventListener("error", reject);
            this.#numbersImage.src = `${ROOT_PATH_IMAGE_NUMBERS}/numbers.png`;
        });
    }

    static loadDigits() {
        return [this.#loadData(), this.#loadImage()];
    }

    initCanvasImage(index) {
        this.#canvasImage = new CanvasImage({
            "sourceImage":{
                "x":Digits.#numbersData["0"]["x"],
                "y":Digits.#numbersData["0"]["y"],
                "w":Digits.#numbersData["0"]["w"],
                "h":Digits.#numbersData["0"]["h"]
            },
            "canvas":{
                "x":SCORE_POSITION_X+DIGITS_MARGIN_RIGHT*index,
                "y":SCORE_POSITION_Y,
                "w":SCORE_WIDTH,
                "h":SCORE_HEIGHT
            }
        });
    }

    static get numbersData() {
        return this.#numbersData;
    }

    get image() {
        return Digits.#numbersImage;
    }

    get canvasImage() {
        return this.#canvasImage;
    }

}
"use strict";

import {CanvasImage} from "./canvasImage.js";
import {Sprite} from "./sprite.js";

export class Character {

    #rootPaths = {
        "data": "./data/characters/",
        "image": "./images/characters/"
    };
    #dataFile;
    #data;
    #imagePath;
    #imageFile;
    #image;
    #sprites;
    #canvasImage;

    constructor(type,state) {
        this.#dataFile = `${this.#rootPaths["data"]}${type}.json`;
        this.#imagePath = `${this.#rootPaths["image"]}${type}/`;
        this.#imageFile = `${this.#imagePath}${state}.png`;
        this.#sprites = new Sprite(state,0);
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

    initCanvasImage(initialPositionOfPlayer) {
        const currentState = this.#sprites["currentState"],
              moves = this.#data[currentState]["moves"];

        this.#canvasImage = new CanvasImage({
            "sourceImage":{
                "x":moves[0]["x"],
                "y":moves[0]["y"],
                "w":moves[0]["w"],
                "h":moves[0]["h"]
            },
            "canvas":{
                "x":initialPositionOfPlayer["x"],
                "y":initialPositionOfPlayer["y"],
                "w":initialPositionOfPlayer["w"],
                "h":initialPositionOfPlayer["h"]
            }
        });
    }

    get image() {
        return this.#image;
    }

    get data() {
        return this.#data;
    }

    get sprites() {
        return this.#sprites;
    }

    get canvasImage() {
        return this.#canvasImage;
    }

    set imageFile(state) {
        this.#imageFile = `${this.#imagePath}${state}.png`;
        this.#image.src = this.#imageFile;
    }

}
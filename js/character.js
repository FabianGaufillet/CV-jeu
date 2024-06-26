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
    #velocityX = 0;
    #velocityY = 0;
    #onGround = true;
    #maxVelocityX = {
        "walk":0.004,
        "run":0.01
    };
    #maxVelocityY = 0.03;

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

    initCanvasImage(initialPositionOfCharacter,canvasWidth,canvasHeight) {
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
                "x":initialPositionOfCharacter["x"]*canvasWidth,
                "y":initialPositionOfCharacter["y"]*canvasHeight,
                "w":initialPositionOfCharacter["w"]*canvasWidth,
                "h":initialPositionOfCharacter["h"]*canvasHeight
            }
        });
    }

    updatePositionOfCharacter(canvasWidth,canvasHeight) {
        const currentState = this.#sprites.currentState;
        this.#setNextSprite(currentState);
        this.#updateVelocities(currentState,canvasWidth,canvasHeight);
    }

    #setNextSprite(currentState) {
        const nextSprite = this.#sprites.getNextSprite(this.#data[currentState]["moves"]);
        this.#canvasImage.positionOfSourceImage = {"x":nextSprite["x"],"y":nextSprite["y"]};
    }

    #updateVelocities(currentState,canvasWidth,canvasHeight) {
        this.#velocityX += this.#onGround ? this.#data[currentState]["velocityX"]*canvasWidth : 0;
        if ((currentState.startsWith("idle") || currentState.startsWith("attack")) && this.#onGround) {
            this.#velocityX = this.#velocityX > 0 ? Math.floor(this.#velocityX / 2)
                            : this.#velocityX < 0 ? Math.ceil(this.#velocityX / 2)
                            : this.#velocityX;
        } else if (currentState === "walkL") {
            this.#velocityX = Math.max(this.#velocityX, -this.#maxVelocityX["walk"]*canvasWidth);
        } else if (currentState === "walkR") {
            this.#velocityX = Math.min(this.#velocityX, this.#maxVelocityX["walk"]*canvasWidth);
        } else if (currentState === "runL") {
            this.#velocityX = Math.max(this.#velocityX, -this.#maxVelocityX["run"]*canvasWidth);
        } else if (currentState === "runR") {
            this.#velocityX = Math.min(this.#velocityX, this.#maxVelocityX["run"]*canvasWidth);
        }

        if (this.#onGround) {
            if (currentState.startsWith("jump")) this.#velocityY += this.#data[currentState]["velocityY"]*canvasHeight;
            else this.#velocityY = 0;
        } else this.#velocityY += 0.0025*canvasHeight;

        if (this.#velocityY < 0) this.#velocityY = Math.max(this.#velocityY,-this.#maxVelocityY*canvasHeight);
        else if (this.#velocityY > 0) this.#velocityY = Math.min(this.#velocityY,this.#maxVelocityY*canvasHeight);

        this.#canvasImage.positionInCanvas["x"] += this.#velocityX;
        this.#canvasImage.positionInCanvas["y"] += this.#velocityY;

        if (this.#canvasImage.positionInCanvas["x"] + this.#canvasImage.sizeInCanvas["width"] < 0) {
            this.#canvasImage.positionInCanvas["x"] = canvasWidth+this.#canvasImage.positionInCanvas["x"];
        } else if (this.#canvasImage.positionInCanvas["x"] >= canvasWidth) {
            this.#canvasImage.positionInCanvas["x"] = 0;
        }

        if (this.#canvasImage.positionInCanvas["y"] >= canvasHeight) {
            this.#canvasImage.positionInCanvas["y"] = 0;
        }

    }

    updateStateOfCharacter(state) {
        this.imageFile = state;
        this.#sprites.currentState = state;
        this.#sprites.currentIndexOfSprite = 0;
    }

    isOnGround(groundList,canvasWidth,canvasHeight) {
        const characterPosition = this.#canvasImage.positionInCanvas["x"] + this.#canvasImage.sizeInCanvas["width"]/2;
        let isCharacterOnGround = false;

        for (const ground of groundList) {
            if (characterPosition >= ground["x"]*canvasWidth && characterPosition <= (ground["x"]+ground["w"])*canvasWidth) {
                const bottom = this.#canvasImage.positionInCanvas["y"]+this.#canvasImage.sizeInCanvas["height"];
                if (bottom >= ground["y"]*canvasHeight && bottom <= (ground["y"]+ground["h"])*canvasHeight) {
                    isCharacterOnGround = true;
                    break;
                }
            }
        }
        this.#onGround = isCharacterOnGround;
    }

    get image() {
        return this.#image;
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

    get onGround() {
        return this.#onGround;
    }

}
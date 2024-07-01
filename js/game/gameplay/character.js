"use strict";

import {
    WIDTH_OF_CHARACTERS_IN_CANVAS,
    HEIGHT_OF_CHARACTERS_IN_CANVAS,
    ROOT_PATH_DATA_CHARACTER,
    ROOT_PATH_IMAGE_CHARACTER
} from "./constants.js";
import {CanvasImage} from "../drawing/canvasImage.js";
import {Sprite} from "../drawing/sprite.js";
import {Velocity} from "./velocity.js";

export class Character {

    #dataFile;
    #imagePath;
    #imageFile;
    #sprites;
    #velocities;
    #data;
    #image;
    #canvasImage;
    #onGround = true;
    #isDead = false;
    #fallingTime = null;

    constructor(type,state) {
        this.#dataFile = `${ROOT_PATH_DATA_CHARACTER}/${type}.json`;
        this.#imagePath = `${ROOT_PATH_IMAGE_CHARACTER}/${type}`;
        this.#imageFile = `${this.#imagePath}/${state}.png`;
        this.#sprites = new Sprite(state,0);
        this.#velocities = new Velocity();
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

    initCanvasImage() {
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
                "x":Math.random(),
                "y":Math.random(),
                "w":WIDTH_OF_CHARACTERS_IN_CANVAS,
                "h":HEIGHT_OF_CHARACTERS_IN_CANVAS
            }
        });
    }

    static updatePositionsOfCharacters(...characters) {
        for (const character of characters) {
            const currentState = character.sprites.currentState;
            character.#sprites.setNextSprite(character.#data[currentState]["moves"],character.#canvasImage);
            character.#velocities.updateVelocities(
                character.#onGround,
                currentState,
                character.#data[currentState]["velocityX"],
                character.#data[currentState]["velocityY"]
            );
            character.#canvasImage.applyVelocity(
                character.#velocities.velocityX,
                character.#velocities.velocityY
            );
        }
    }

    updateStateOfCharacter(state) {
        this.#imageFile = `${this.#imagePath}/${state}.png`;
        this.#image.src = this.#imageFile;
        this.#sprites.changeSprite(state);
    }

    comeBackToLife(status,delay) {
        setTimeout(() => {
            this.isDead = false;
            this.updateStateOfCharacter(status);
            this.#canvasImage.applyVelocity(Math.random(),Math.random());
        },delay);
    }

    get sprites() {
        return this.#sprites;
    }

    get image() {
        return this.#image;
    }

    get canvasImage() {
        return this.#canvasImage;
    }

    get onGround() {
        return this.#onGround;
    }

    set onGround(status) {
        this.#onGround = status;
    }

    get isDead() {
        return this.#isDead;
    }

    set isDead(deadStatus) {
        this.#isDead = deadStatus;
    }

    get fallingTime() {
        return this.#fallingTime;
    }

    set fallingTime(time) {
        this.#fallingTime = time;
    }

}
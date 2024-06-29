"use strict";

import {CanvasImage} from "../drawing/canvasImage.js";
import {Sprite} from "../drawing/sprite.js";
import {Velocity} from "./velocity.js";
import {
    WIDTH_OF_CHARACTERS_IN_CANVAS,
    HEIGHT_OF_CHARACTERS_IN_CANVAS,
    MAX_FALLING_TIME,
    ROOT_PATH_DATA_CHARACTER,
    ROOT_PATH_IMAGE_CHARACTER
} from "../constants.js";

export class Character {

    #dataFile;
    #data;
    #imagePath;
    #imageFile;
    #image;
    #sprites;
    #canvasImage;
    #onGround = true;
    #isDead = false;
    #velocities;
    #fallingTime = null;

    constructor(type,state) {
        this.#dataFile = `${ROOT_PATH_DATA_CHARACTER}${type}.json`;
        this.#imagePath = `${ROOT_PATH_IMAGE_CHARACTER}${type}/`;
        this.#imageFile = `${this.#imagePath}${state}.png`;
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

    setNextStateOfPlayer(keysPressed) {
        const keysPressedEntries = Object.entries(keysPressed),
              isKeyPressed = keysPressedEntries.filter(entry=> entry[0] !== "control" && entry[1]).length,
              characterOrientation = this.sprites.currentState.at(-1);

        if (this.#isDead) {
            if (!this.sprites.currentState.startsWith("dead")) this.updateStateOfCharacter("dead"+characterOrientation);
            return false;
        }
        if (this.#onGround) {
            if (!this.sprites.currentState.startsWith("idle") && !isKeyPressed) {
                this.updateStateOfCharacter("idle"+characterOrientation);
                return false;
            }

            if (keysPressed["arrowLeft"] && !keysPressed["x"]) {
                if (!keysPressed["control"] && this.sprites.currentState !== "walkL") {
                    this.updateStateOfCharacter("walkL");
                } else if (keysPressed["control"] && this.sprites.currentState !== "runL") {
                    this.updateStateOfCharacter("runL");
                }
            }

            if (keysPressed["arrowRight"] && !keysPressed["x"]) {
                if (!keysPressed["control"] && this.sprites.currentState !== "walkR") {
                    this.updateStateOfCharacter("walkR");
                } else if (keysPressed["control"] && this.sprites.currentState !== "runR") {
                    this.updateStateOfCharacter("runR");
                }
            }

            if (keysPressed["arrowUp"]) {
                this.updateStateOfCharacter("jump"+characterOrientation);
            }

            if (keysPressed["x"] && !this.sprites.currentState.startsWith("attack")) {
                this.updateStateOfCharacter("attack"+characterOrientation);
            }
        } else {
            if (keysPressed["x"]) {
                if (!this.sprites.currentState.startsWith("jumpAttack")) {
                    this.updateStateOfCharacter("jumpAttack"+characterOrientation);
                }
            } else {
                if (!this.sprites.currentState.startsWith("jump")) {
                    this.updateStateOfCharacter("jump"+characterOrientation);
                }
            }
        }
    }

    static updatePositionsOfCharacters(...characters) {
        for (const character of characters) {
            const currentState = character.sprites.currentState;
            character.#setNextSprite(currentState);
            character.#velocities.updateVelocities(
                character.#onGround,
                currentState,
                character.#data[currentState]["velocityX"],
                character.#data[currentState]["velocityY"]
            );
            character.#canvasImage.updatePositionInCanvas(
                character.#velocities.velocityX,
                character.#velocities.velocityY
            );
        }
    }

    #setNextSprite(currentState) {
        const nextSprite = this.#sprites.getNextSprite(this.#data[currentState]["moves"]);
        this.#canvasImage.updatePositionAndSizeOfSourceImage(nextSprite);
    }

    updateStateOfCharacter(state) {
        this.imageFile = state;
        this.#sprites.currentState = state;
        this.#sprites.currentIndexOfSprite = 0;
    }

    static updateOnGroundStatus(groundList,...characters) {
        for (const character of characters) {
            const characterPosition = character.canvasImage.positionInCanvas["x"] + character.canvasImage.sizeInCanvas["width"] / 2,
                  bottom = character.canvasImage.positionInCanvas["y"] + character.canvasImage.sizeInCanvas["height"];
            let isCharacterOnGround = false;

            for (const ground of groundList) {
                if (characterPosition >= ground["x"] && characterPosition <= ground["x"]+ground["w"]) {
                    if (bottom >= ground["y"] && bottom <= ground["y"]+ground["h"]) {
                        isCharacterOnGround = true;
                        break;
                    }
                }
            }
            character.#onGround = isCharacterOnGround;
            if (isCharacterOnGround) character.#fallingTime = null;
            else if (character.#fallingTime === null) character.#fallingTime = Date.now();
            else if (Date.now() - character.#fallingTime > MAX_FALLING_TIME) {
                    character.#canvasImage.updatePositionInCanvas(Math.random(),Math.random());
                    character.#fallingTime = null;
            }
        }
    }

    comeBackToLife(status,delay) {
        setTimeout(() => {
            this.isDead = false;
            this.updateStateOfCharacter(status);
            this.#canvasImage.updatePositionInCanvas(Math.random(),Math.random());
        },delay);
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

    get isDead() {
        return this.#isDead;
    }

    set isDead(deadStatus) {
        this.#isDead = deadStatus;
    }

}
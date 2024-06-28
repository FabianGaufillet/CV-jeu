"use strict";

import {CanvasImage} from "./canvasImage.js";
import {Sprite} from "./sprite.js";
import {Velocity} from "./velocity.js";
import {ROOT_PATH_DATA_CHARACTER,ROOT_PATH_IMAGE_CHARACTER} from "./constants.js";

export class Character {

    #dataFile;
    #data;
    #imagePath;
    #imageFile;
    #image;
    #sprites;
    #canvasImage;
    #onGround = true;
    #velocities;

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

    static updatePositionsOfCharacters(canvasWidth,canvasHeight,...characters) {
        for (const character of characters) {
            const currentState = character.sprites.currentState;
            character.#setNextSprite(currentState);
            character.#velocities.updateVelocities(
                character.onGround,
                currentState,
                character.#data[currentState]["velocityX"],
                character.#data[currentState]["velocityY"]
            );
            character.#canvasImage.updatePositionInCanvas(
                canvasWidth,
                canvasHeight,
                character.#velocities.velocityX,
                character.#velocities.velocityY
            );
        }
    }

    #setNextSprite(currentState) {
        const nextSprite = this.#sprites.getNextSprite(this.#data[currentState]["moves"]);
        this.#canvasImage.positionOfSourceImage = {
            "x":nextSprite["x"],
            "y":nextSprite["y"]
        };
    }

    setNextStateOfCharacter(keysPressed) {
        const keysPressedEntries = Object.entries(keysPressed),
              isKeyPressed = keysPressedEntries.filter(entry=> entry[0] !== "control" && entry[1]).length;

        if (this.onGround) {
            if (!this.sprites.currentState.startsWith("idle") && !isKeyPressed) {
                if (this.sprites.currentState.endsWith("L")) this.updateStateOfCharacter("idleL");
                else if (this.sprites.currentState.endsWith("R")) this.updateStateOfCharacter("idleR");
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
                if (this.sprites.currentState.endsWith("L")) this.updateStateOfCharacter("jumpL");
                else if (this.sprites.currentState.endsWith("R")) this.updateStateOfCharacter("jumpR");
            }

            if (keysPressed["x"]) {
                if (this.sprites.currentState.endsWith("L") && this.sprites.currentState !== "attackL") this.updateStateOfCharacter("attackL");
                else if (this.sprites.currentState.endsWith("R") && this.sprites.currentState !== "attackR" ) this.updateStateOfCharacter("attackR");
            }

        } else {
            if (keysPressed["x"]) {
                if (this.sprites.currentState.endsWith("L") && this.sprites.currentState !== "jumpAttackL") this.updateStateOfCharacter("jumpAttackL");
                else if (this.sprites.currentState.endsWith("R") && this.sprites.currentState !== "jumpAttackR" ) this.updateStateOfCharacter("jumpAttackR");
            } else {
                if (this.sprites.currentState.endsWith("L") && this.sprites.currentState !== "jumpL") this.updateStateOfCharacter("jumpL");
                else if (this.sprites.currentState.endsWith("R") && this.sprites.currentState !== "jumpR" ) this.updateStateOfCharacter("jumpR");
            }
        }
    }

    updateStateOfCharacter(state) {
        this.imageFile = state;
        this.#sprites.currentState = state;
        this.#sprites.currentIndexOfSprite = 0;
    }

    static updateOnGroundStatus(groundList,canvasWidth,canvasHeight,...characters) {
        for (const character of characters) {
            const characterPosition = character.canvasImage.positionInCanvas["x"] + character.canvasImage.sizeInCanvas["width"]/2,
                  bottom = character.canvasImage.positionInCanvas["y"]+character.canvasImage.sizeInCanvas["height"];
            let isCharacterOnGround = false;

            for (const ground of groundList) {
                if (characterPosition >= ground["x"]*canvasWidth && characterPosition <= (ground["x"]+ground["w"])*canvasWidth) {
                    if (bottom >= ground["y"]*canvasHeight && bottom <= (ground["y"]+ground["h"])*canvasHeight) {
                        isCharacterOnGround = true;
                        break;
                    }
                }
            }
            character.#onGround = isCharacterOnGround;
        }
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
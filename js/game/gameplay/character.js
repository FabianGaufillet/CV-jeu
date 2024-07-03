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

    static #availableTypes = ["knight", "zombie_female", "zombie_male"];
    static #availableStates = {
        "knight": ["attackL","attackR","deadL","deadR","idleL","idleR","jumpAttackL","jumpAttackR","jumpL","jumpR","runL","runR","walkL","walkR"],
        "zombie_female": ["attackL","attackR","deadL","deadR","idleL","idleR","walkL","walkR"],
        "zombie_male": ["attackL","attackR","deadL","deadR","idleL","idleR","walkL","walkR"]
    };
    static #allCharactersData = {};
    static #allCharactersImages = {};
    #type;
    #state;
    #sprites;
    #velocities;
    #canvasImage;
    #onGround = true;
    #isDead = false;
    #fallingTime = null;

    constructor(type,state) {
        this.#type = type;
        this.#state = state;
        this.#sprites = new Sprite(state,0);
        this.#velocities = new Velocity();
    }

    static #loadData(type) {
        return fetch(`${ROOT_PATH_DATA_CHARACTER}/${type}.json`)
            .then(res => res.json())
            .then(data => this.#allCharactersData[type] = data);
    }

    static #loadImage(type, state) {
        return new Promise((resolve, reject) => {
            if (!this.#allCharactersImages[type]) this.#allCharactersImages[type] = [];
            this.#allCharactersImages[type].push(new Image());
            this.#allCharactersImages[type].at(-1).addEventListener("load", resolve);
            this.#allCharactersImages[type].at(-1).addEventListener("error", reject);
            this.#allCharactersImages[type].at(-1).src = `${ROOT_PATH_IMAGE_CHARACTER}/${type}/${state}.png`;
        });
    }

    static loadAvailableCharacters() {
        return [
            this.#availableTypes.map(availableType => Character.#loadData(availableType)),
            Object.keys(this.#availableStates).map(type => {this.#availableStates[type].map(availableState => Character.#loadImage(type, availableState));})
        ].flat();
    }

    initCanvasImage() {
        const currentState = this.#sprites["currentState"],
              moves = Character.#allCharactersData[this.#type][currentState]["moves"];

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
            character.#sprites.setNextSprite(Character.#allCharactersData[character.#type][currentState]["moves"],character.#canvasImage);
            character.#velocities.updateVelocities(
                character.#onGround,
                currentState,
                Character.#allCharactersData[character.#type][currentState]["velocityX"],
                Character.#allCharactersData[character.#type][currentState]["velocityY"]
            );
            character.#canvasImage.applyVelocity(
                character.#velocities.velocityX,
                character.#velocities.velocityY
            );
        }
    }

    updateStateOfCharacter(state) {
        this.#state = state;
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
        return Character.#allCharactersImages[this.#type][Character.#availableStates[this.#type].indexOf(this.#state)];
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
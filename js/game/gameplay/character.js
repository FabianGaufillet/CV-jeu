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
    onGround;
    isDead;
    fallingTime;
    lastStatusChangeTime;

    constructor(type,state) {
        this.#type = type;
        this.#state = state;
        this.#sprites = new Sprite(state,0);
        this.#velocities = new Velocity();
        this.onGround = true;
        this.isDead = false;
        this.fallingTime = null;
        this.lastStatusChangeTime = Date.now();
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

    static updatePositionsOfCharacters(...characters) {
        for (const character of characters) {
            const currentState = character.state;
            character.#sprites.setNextSprite(Character.#allCharactersData[character.#type][currentState]["moves"],character.#canvasImage);
            character.#velocities.updateVelocities(
                character.onGround,
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

    updateStateOfCharacter(state) {
        this.lastStatusChangeTime = Date.now();
        this.#state = state;
        this.#sprites.changeSprite(state);
    }

    setRandomState() {
        const states = ["idleL","idleR", "walkL","walkR"];
        if (this.isDead) return;
        let nextState = this.state;
        while (nextState === this.sprites.currentState) nextState = states[Math.floor(Math.random() * states.length)];
        this.updateStateOfCharacter(nextState);
    }

    comeBackToLife(delay) {
        setTimeout(() => {
            this.isDead = false;
            this.setRandomState();
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

    get type() {
        return this.#type;
    }

    get state() {
        return this.#state;
    }

    get moves() {
        return Character.#allCharactersData[this.#type][this.#state]["moves"];
    }

}
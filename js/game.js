"use strict";

import {CanvasElement} from "./canvasElement.js";
import {KeyboardEventsManager} from "./keyboardEventsManager.js";

export class Game {

    #canvasElement;
    #level;
    #player;
    #requestAnimationFrameID;
    #keyboardEventsManager;

    constructor(htmlCanvasElement,level,player) {
        this.#canvasElement = new CanvasElement(htmlCanvasElement);
        this.#level = level;
        this.#player = player;
        this.#keyboardEventsManager = new KeyboardEventsManager();
    }

    loadGameData() {
        return [
            this.#level.loadData(),
            this.#level.loadImage(),
            this.#player.loadData(),
            this.#player.loadImage()
        ];
    }

    #handleKeyPress() {

        const isKeyPressed = Object.entries(this.#keyboardEventsManager.keyPressed).filter(entry=> entry[0] !== "control" && entry[1]).length;

        if (this.#player.onGround) {
            if (!this.#player.sprites.currentState.startsWith("idle") && !isKeyPressed) {
                if (this.#player.sprites.currentState.endsWith("L")) this.#player.updateStateOfCharacter("idleL");
                else if (this.#player.sprites.currentState.endsWith("R")) this.#player.updateStateOfCharacter("idleR");
                return false;
            }

            if (this.#keyboardEventsManager.keyPressed["arrowLeft"]) {
                if (!this.#keyboardEventsManager.keyPressed["control"] && this.#player.sprites.currentState !== "walkL") {
                    this.#player.updateStateOfCharacter("walkL");
                } else if (this.#keyboardEventsManager.keyPressed["control"] && this.#player.sprites.currentState !== "runL") {
                    this.#player.updateStateOfCharacter("runL");
                }
            }

            if (this.#keyboardEventsManager.keyPressed["arrowRight"]) {
                if (!this.#keyboardEventsManager.keyPressed["control"] && this.#player.sprites.currentState !== "walkR") {
                    this.#player.updateStateOfCharacter("walkR");
                } else if (this.#keyboardEventsManager.keyPressed["control"] && this.#player.sprites.currentState !== "runR") {
                    this.#player.updateStateOfCharacter("runR");
                }
            }

            if (this.#keyboardEventsManager.keyPressed["arrowUp"]) {
                if (this.#player.sprites.currentState.endsWith("L")) this.#player.updateStateOfCharacter("jumpL");
                else if (this.#player.sprites.currentState.endsWith("R")) this.#player.updateStateOfCharacter("jumpR");
            }

            if (this.#keyboardEventsManager.keyPressed["x"]) {
                if (this.#player.sprites.currentState.endsWith("L") && this.#player.sprites.currentState !== "attackL") this.#player.updateStateOfCharacter("attackL");
                else if (this.#player.sprites.currentState.endsWith("R") && this.#player.sprites.currentState !== "attackR" ) this.#player.updateStateOfCharacter("attackR");
            }

        }

    }

    loop() {
        this.#handleKeyPress();
        this.#player.updatePositionOfCharacter(this.#canvasElement.width,this.#canvasElement.height);
        this.#canvasElement.clearRect();
        this.#canvasElement.drawImage(this.#level);
        this.#canvasElement.drawImage(this.#player);
        this.#player.isOnGround(
            this.#level["data"]["ground"],
            this.#canvasElement.width,
            this.#canvasElement.height);
        this.#requestAnimationFrameID = requestAnimationFrame(() => this.loop());
    }

}
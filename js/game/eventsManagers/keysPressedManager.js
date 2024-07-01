"use strict";

import {KeyboardEventsManager} from "./keyboardEventsManager.js";

export class KeysPressedManager {

    #keyboardEventsManager;
    constructor() {
        this.#keyboardEventsManager = new KeyboardEventsManager();
    }

    manageKeysPressed(player) {
        const keysPressed = this.#keyboardEventsManager.keyPressed,
              keysPressedEntries = Object.entries(keysPressed),
              isKeyPressed = keysPressedEntries.filter(entry=> entry[0] !== "control" && entry[1]).length,
              characterOrientation = player.sprites.currentState.at(-1);

        if (player.isDead) {
            if (!player.sprites.currentState.startsWith("dead")) player.updateStateOfCharacter("dead"+characterOrientation);
            return false;
        }

        if (player.onGround) {
            if (!player.sprites.currentState.startsWith("idle") && !isKeyPressed) {
                player.updateStateOfCharacter("idle"+characterOrientation);
                return false;
            }

            if (keysPressed["arrowLeft"] && !keysPressed["x"]) {
                if (!keysPressed["control"] && player.sprites.currentState !== "walkL") {
                    player.updateStateOfCharacter("walkL");
                } else if (keysPressed["control"] && player.sprites.currentState !== "runL") {
                    player.updateStateOfCharacter("runL");
                }
            }

            if (keysPressed["arrowRight"] && !keysPressed["x"]) {
                if (!keysPressed["control"] && player.sprites.currentState !== "walkR") {
                    player.updateStateOfCharacter("walkR");
                } else if (keysPressed["control"] && player.sprites.currentState !== "runR") {
                    player.updateStateOfCharacter("runR");
                }
            }

            if (keysPressed["arrowUp"]) {
                player.updateStateOfCharacter("jump"+characterOrientation);
            }

            if (keysPressed["x"] && !player.sprites.currentState.startsWith("attack")) {
                player.updateStateOfCharacter("attack"+characterOrientation);
            }
        } else {
            if (keysPressed["x"]) {
                if (!player.sprites.currentState.startsWith("jumpAttack")) {
                    player.updateStateOfCharacter("jumpAttack"+characterOrientation);
                }
            } else {
                if (!["jumpL","jumpR"].includes(player.sprites.currentState)) {
                    player.updateStateOfCharacter("jump"+characterOrientation);
                }
            }
        }
    }
}
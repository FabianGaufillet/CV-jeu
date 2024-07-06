"use strict";

import {COOLDOWN_BETWEEN_PAUSES} from "../gameplay/constants.js";
import {KeyboardEventsManager} from "./keyboardEventsManager.js";

/** Classe permettant de définir les actions à mener en fonction des actions de l'utilisateur */
export class KeysPressedManager {

    /**
     * @property {KeyboardEventsManager} #keyboardEventsManager Gestionnaire d'événements liés aux frappes sur le clavier
     */
    #keyboardEventsManager;

    /**
     * @property {boolean} #gamePaused Indique si le jeu est en pause
     */
    #gamePaused;

    /**
     * @property {number} #gamePausedTime Timestamp depuis la mise en pause du jeu
     */
    #gamePausedTime;

    /**
     * @property {boolean} backToMenu Indique si le joueur a demandé à revenir au menu principal
     */
    backToMenu;

    /**
     * Créé une instance de KeysPressedManager
     */
    constructor() {
        this.#keyboardEventsManager = new KeyboardEventsManager();
        this.#gamePaused = false;
        this.#gamePausedTime = 0;
        this.backToMenu = false;
    }

    /**
     * Définis les actions à mener en fonction des appuis de l'utilisateur
     * @param {Character} player Informations sur le joueur (en vie, sur un sol, ...)
     */
    manageKeysPressed(player) {
        const keysPressed = this.#keyboardEventsManager.keyPressed,
              keysPressedEntries = Object.entries(keysPressed),
              isKeyPressed = keysPressedEntries.filter(entry=> entry[0] !== "control" && entry[1]).length,
              characterOrientation = player.state.at(-1);

        if (keysPressed["escape"]) {
            this.#gamePaused = false;
            this.backToMenu = true;
        }
        if (keysPressed["p"]) {
            if (Date.now() - this.#gamePausedTime >= COOLDOWN_BETWEEN_PAUSES) {
                this.#gamePausedTime = Date.now();
                this.#gamePaused = !this.#gamePaused;
            }
            return;
        }
        if (player.isDead) {
            if (!player.state.startsWith("dead")) player.updateStateOfCharacter("dead"+characterOrientation);
            return false;
        }

        if (player.onGround) {
            if (!player.state.startsWith("idle") && !isKeyPressed) {
                player.updateStateOfCharacter("idle"+characterOrientation);
                return false;
            }

            if (keysPressed["arrowLeft"] && !keysPressed["x"]) {
                if (!keysPressed["control"] && player.state !== "walkL") {
                    player.updateStateOfCharacter("walkL");
                } else if (keysPressed["control"] && player.state !== "runL") {
                    player.updateStateOfCharacter("runL");
                }
            }

            if (keysPressed["arrowRight"] && !keysPressed["x"]) {
                if (!keysPressed["control"] && player.state !== "walkR") {
                    player.updateStateOfCharacter("walkR");
                } else if (keysPressed["control"] && player.state !== "runR") {
                    player.updateStateOfCharacter("runR");
                }
            }

            if (keysPressed["arrowUp"]) {
                player.updateStateOfCharacter("jump"+characterOrientation);
            }

            if (keysPressed["x"] && !player.state.startsWith("attack")) {
                player.updateStateOfCharacter("attack"+characterOrientation);
            }
        } else {
            if (keysPressed["x"]) {
                if (!player.state.startsWith("jumpAttack")) {
                    player.updateStateOfCharacter("jumpAttack"+characterOrientation);
                }
            } else {
                if (!["jumpL","jumpR"].includes(player.state)) {
                    player.updateStateOfCharacter("jump"+characterOrientation);
                }
            }
        }
    }

    /**
     * Indique si le jeu est en pause
     * @returns {boolean} Vrai, le jeu est en pause; faux il est en cours.
     */
    get gamePaused() {
        return this.#gamePaused;
    }
}
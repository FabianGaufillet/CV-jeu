"use strict";

import {PLAYER_DELAY_BEFORE_BACK_TO_LIFE, ENEMY_DELAY_BEFORE_BACK_TO_LIFE} from "./constants.js";

/** Classe permettant de modifier l'état des personnages en fonction des collisions entre eux */
export class CollisionsManager {

    /**
     * @property {Character} #player Le joueur, avec toutes ses caractéristiques
     */
    #player;

    /**
     * Créé une instance de CollisionsManager
     * @param {Character} player Le joueur, avec toutes ses caractéristiques
     */
    constructor(player) {
        this.#player = player;
    }

    /**
     * Fonction qui détermine avec quel(s) ennemi(s) le joueur est entré en collision
     * @param {Character[]} enemies Ensemble des ennemis du jeu
     * @param {number} score Score actuel du joueur
     */
    detectCollision(enemies,score) {
        for (const enemy of enemies) {
            const playerCoordinates = this.#player.canvasImage.coordinates(),
                  enemyCoordinates = enemy.canvasImage.coordinates(),
                  playerPositionY = playerCoordinates["top"] + this.#player.canvasImage.sizeInCanvas["height"] / 2;

            if (this.#player.isDead) {
                this.collisionResolution(enemy,"",score);
                continue;
            }
            if (enemy.isDead) continue;
            if (playerPositionY >= enemyCoordinates["top"] && playerPositionY <= enemyCoordinates["bottom"]) {
                if (playerCoordinates["left"] >= enemyCoordinates["left"] && playerCoordinates["left"] <= enemyCoordinates["right"]) {
                    this.collisionResolution(enemy,"L",score);
                } else if (playerCoordinates["right"] >= enemyCoordinates["left"] && playerCoordinates["right"] <= enemyCoordinates["right"]) {
                    this.collisionResolution(enemy,"R",score);
                } else {
                    this.collisionResolution(enemy,"",score);
                }
            } else {
                this.collisionResolution(enemy,"",score);
            }
        }
    }

    /**
     * Fonction qui modifie l'état des personnages en fonction des collisions détectées
     * @param {Character} enemy Ennemi en cours d'étude
     * @param {string} collisionPositionX Côté du joueur avec lequel l'ennemi est entré en collision
     * @param {Score} score Instance de Score permettant de gérer le score du joueur
     */
    collisionResolution(enemy,collisionPositionX,score) {
        const enemyOrientation = enemy.state.at(-1),
              attackStatus = [`attack${collisionPositionX}`,`jumpAttack${collisionPositionX}`];

        if (!collisionPositionX) {
            if (enemy.state.startsWith("attack") && enemy.sprite.isCurrentAnimationFinished(enemy.moves)) {
                enemy.setRandomState();
            }
        } else {
            if (attackStatus.includes(this.#player.state)) {
                enemy.isDead = true;
                enemy.lastStatusChangeTime = Date.now();
                score.updateScore(1);
                enemy.updateStateOfCharacter("dead" + enemyOrientation);
                enemy.comeBackToLife(ENEMY_DELAY_BEFORE_BACK_TO_LIFE);
            } else if (collisionPositionX === enemyOrientation) {
                if (enemy.state.startsWith("attack")) {
                    enemy.setRandomState();
                }
            } else if (!enemy.state.startsWith("attack")) {
                enemy.updateStateOfCharacter("attack"+enemyOrientation);
            } else if (enemy.state.startsWith("attack")) {
                this.#player.isDead = true;
                score.updateScore(-1);
                this.#player.comeBackToLife(PLAYER_DELAY_BEFORE_BACK_TO_LIFE);
            }
        }
    }

}
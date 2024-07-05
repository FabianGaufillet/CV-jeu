"use strict";

import {PLAYER_DELAY_BEFORE_BACK_TO_LIFE, ENEMY_DELAY_BEFORE_BACK_TO_LIFE} from "./constants.js";

export class CollisionsManager {

    #player;

    constructor(player) {
        this.#player = player;
    }

    detectCollision(enemies,score) {
        for (const enemy of enemies) {
            const playerCoordinates = this.#player.canvasImage.coordinates(),
                  enemyCoordinates = enemy.canvasImage.coordinates(),
                  playerPositionY = playerCoordinates["top"] + this.#player.canvasImage.sizeInCanvas["height"] / 2;

            if (this.#player.isDead) {
                this.collisionResolution(enemy,"");
                continue;
            }
            if (enemy.isDead) continue;
            if (playerPositionY >= enemyCoordinates["top"] && playerPositionY <= enemyCoordinates["bottom"]) {
                if (playerCoordinates["left"] >= enemyCoordinates["left"] && playerCoordinates["left"] <= enemyCoordinates["right"]) {
                    this.collisionResolution(enemy,"L",score);
                } else if (playerCoordinates["right"] >= enemyCoordinates["left"] && playerCoordinates["right"] <= enemyCoordinates["right"]) {
                    this.collisionResolution(enemy,"R",score);
                } else {
                    this.collisionResolution(enemy,"");
                }
            } else {
                this.collisionResolution(enemy,"");
            }
        }
    }

    collisionResolution(enemy,collisionPositionX,score) {
        const characterOrientation = enemy.state.at(-1),
              attackStatus = [`attack${collisionPositionX}`,`jumpAttack${collisionPositionX}`];

        if (!collisionPositionX) {
            if (enemy.state.startsWith("attack") && enemy.sprites.isCurrentAnimationFinished(enemy.moves)) {
                enemy.setRandomState();
            }
        } else {
            if (attackStatus.includes(this.#player.state)) {
                enemy.isDead = true;
                enemy.lastStatusChangeTime = Date.now();
                score.updateScore(1);
                enemy.updateStateOfCharacter("dead" + characterOrientation);
                enemy.comeBackToLife(ENEMY_DELAY_BEFORE_BACK_TO_LIFE);
            } else if (collisionPositionX === characterOrientation) {
                if (enemy.state.startsWith("attack")) {
                    enemy.setRandomState();
                }
            } else if (!enemy.state.startsWith("attack")) {
                enemy.updateStateOfCharacter("attack"+characterOrientation);
            } else if (enemy.state.startsWith("attack")) {
                this.#player.isDead = true;
                score.updateScore(-1);
                this.#player.comeBackToLife(PLAYER_DELAY_BEFORE_BACK_TO_LIFE);
            }
        }
    }

}
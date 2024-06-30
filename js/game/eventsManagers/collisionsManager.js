"use strict";

import {DELAY_BEFORE_BACK_TO_LIFE} from "./constants.js";

export class CollisionsManager {

    #player;
    constructor(player) {
        this.#player = player;
    }

    detectCollision(enemies,score) {
        for (const enemy of enemies) {
            const playerCanvasImage = this.#player.canvasImage,
                  enemyCanvasImage = enemy.canvasImage,
                  playerPositionLeft = playerCanvasImage.positionInCanvas["x"],
                  playerPositionRight = playerCanvasImage.positionInCanvas["x"] + playerCanvasImage.sizeInCanvas["width"],
                  playerPositionY = playerCanvasImage.positionInCanvas["y"] + playerCanvasImage.sizeInCanvas["height"] / 2,
                  enemyPositionLeft = enemyCanvasImage.positionInCanvas["x"],
                  enemyPositionRight = enemyCanvasImage.positionInCanvas["x"] + enemyCanvasImage.sizeInCanvas["width"],
                  enemyPositionBottom = enemyCanvasImage.positionInCanvas["y"] + enemyCanvasImage.sizeInCanvas["height"],
                  enemyPositionTop = enemyCanvasImage.positionInCanvas["y"];

            if (this.#player.isDead) {
                this.collisionResolution(enemy,"");
                continue;
            }
            if (enemy.isDead) continue;
            if (playerPositionY >= enemyPositionTop && playerPositionY <= enemyPositionBottom) {
                if (playerPositionLeft >= enemyPositionLeft && playerPositionLeft <= enemyPositionRight) {
                    this.collisionResolution(enemy,"L",score);
                } else if (playerPositionRight >= enemyPositionLeft && playerPositionRight <= enemyPositionRight) {
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
        const characterOrientation = enemy.sprites.currentState.at(-1),
              attackStatus = [`attack${collisionPositionX}`,`jumpAttack${collisionPositionX}`];

        if (!collisionPositionX) {
            if (!enemy.sprites.currentState.startsWith("walk")) {
                enemy.updateStateOfCharacter("walk"+characterOrientation);
            }
        } else {
            if (attackStatus.includes(this.#player.sprites.currentState)) {
                const directions = ["L","R"];
                enemy.isDead = true;
                score.updateScore(1);
                enemy.updateStateOfCharacter("dead" + characterOrientation);
                enemy.comeBackToLife("walk"+directions.at(Math.floor(Math.random()*directions.length)), DELAY_BEFORE_BACK_TO_LIFE);
            } else if (collisionPositionX === characterOrientation) {
                if (!enemy.sprites.currentState.startsWith("walk")) {
                    enemy.updateStateOfCharacter("walk"+characterOrientation);
                }
            } else if (enemy.sprites.currentState.startsWith("walk")) {
                enemy.updateStateOfCharacter("attack"+characterOrientation);
            } else if (enemy.sprites.currentState.startsWith("attack")) {
                this.#player.isDead = true;
            }
        }
    }

}
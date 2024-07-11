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
     * Fonction qui détermine avec quel(s) personnage(s) le joueur est entré en collision
     * @param {Character[]} enemies Ensemble des ennemis du jeu
     * @param {Character} stranger Personnage non joueur
     * @param {Score} score Gestion du score
     */
    handleCollisions(enemies, stranger, score) {
        const isStrangerAvailable = stranger.state.startsWith("idle") && stranger.onGround;

        if (this.#player.meetStranger === false && isStrangerAvailable) {
            if (this.#detectCollision(this.#player, stranger)) this.#player.meetStranger = true;
        }
        for (const enemy of enemies) {
            const collisionStrangerEnemy = this.#detectCollision(stranger, enemy),
                  collisionPlayerEnemy = this.#detectCollision(this.#player, enemy);

            if (collisionStrangerEnemy === "L") {
                if (!stranger.state.startsWith("attack") && !enemy.isDead) {
                    stranger.updateStateOfCharacter("attackL");
                    this.#handleEnemyDeath(enemy);
                }
            } else if (collisionStrangerEnemy === "R") {
                if (!stranger.state.startsWith("attack") && !enemy.isDead) {
                    stranger.updateStateOfCharacter("attackR");
                    this.#handleEnemyDeath(enemy);
                }
            } else if (stranger.state.startsWith("attack") && stranger.sprite.isCurrentAnimationFinished(stranger.moves)) {
                stranger.setRandomState();
            }

            if (this.#player.isDead) {
                this.collisionResolution(enemy,"",score);
                continue;
            }
            if (enemy.isDead) continue;
            if (collisionPlayerEnemy === "L") this.collisionResolution(enemy,"L",score);
            else if (collisionPlayerEnemy === "R") this.collisionResolution(enemy,"R",score);
            else this.collisionResolution(enemy,"",score);
        }
    }

    /**
     * Fontion qui retourne la position de la collision entre 2 personnages
     * @param {Character} player Premier personnage
     * @param {Character} enemy Second personnage
     * @returns {string} Position de la collision entre les 2 personnages
     */
    #detectCollision(player, enemy) {
        const playerCoordinates = player.canvasImage.coordinates(),
              playerPositionY = playerCoordinates["top"] + player.canvasImage.sizeInCanvas["height"] / 2,
              enemyCoordinates = enemy.canvasImage.coordinates();

        if (playerPositionY >= enemyCoordinates["top"] && playerPositionY <= enemyCoordinates["bottom"]) {
            if (playerCoordinates["left"] >= enemyCoordinates["left"] && playerCoordinates["left"] <= enemyCoordinates["right"]) {
                return "L";
            } else if (playerCoordinates["right"] >= enemyCoordinates["left"] && playerCoordinates["right"] <= enemyCoordinates["right"]) {
                return "R";
            }
        }
        return "";
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
                this.#handleEnemyDeath(enemy);
                score.updateScore(1);
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

    /**
     * Fonction qui met à jour l'état d'un ennemi qui vient de perdre un combat
     * @param {Character} enemy
     */
    #handleEnemyDeath(enemy) {
        const enemyOrientation = enemy.state.at(-1);

        enemy.isDead = true;
        enemy.lastStatusChangeTime = Date.now();
        enemy.updateStateOfCharacter("dead" + enemyOrientation);
        enemy.comeBackToLife(ENEMY_DELAY_BEFORE_BACK_TO_LIFE);

    }

}
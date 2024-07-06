"use strict";

import {MAX_FALLING_TIME} from "./constants.js";

/** Classe décrivant les positions des sols */
export class Ground {

    /**
     * @property {Object[]} #groundList Liste des positions et tailles des sols
     */
    #groundList;

    /**
     * Créé une instance de Ground
     * @param {Object[]} groundList Liste des positions et tailles des sols
     */
    constructor(groundList) {
        this.#groundList = groundList;
    }

    /**
     * Met à jour le statut "sur un sol" de tous les personnages
     * @param {...Character} characters Liste de tous les personnages actuellement en jeu
     */
    areCharactersOnGround(...characters) {
        for (const character of characters) {
            character.onGround = this.#isCharacterOnGround(character);
            this.#updateFallingTime(character);
        }
    }

    /**
     * Détermine si un personnage est sur un sol ou non
     * @param {Character} character Un des personnages actuellement en jeu
     * @returns {boolean} Vrai si le personnage est sur un sol, faux sinon
     */
    #isCharacterOnGround(character) {
        const characterPosition = character.canvasImage.positionInCanvas["x"] + character.canvasImage.sizeInCanvas["width"] / 2,
              bottom = character.canvasImage.positionInCanvas["y"] + character.canvasImage.sizeInCanvas["height"];

        for (const ground of this.#groundList) {
            if (characterPosition >= ground["x"] && characterPosition <= ground["x"]+ground["w"]) {
                if (bottom >= ground["y"] && bottom <= ground["y"]+ground["h"]) {
                    this.#setCharacterPositionY(character, ground);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Replace correctement le personnage sur l'axe vertical pour éviter les décalages entre personnages
     * @param {Character} character Personnage à replacer
     * @param {Ground} ground Coordonnées du sol sur lequel se trouve le personnage
     */
    #setCharacterPositionY(character, ground) {
        const offsetY = ground["y"]+ground["h"] / 2 - (character.canvasImage.sizeInCanvas["height"] + character.canvasImage.positionInCanvas["y"]);
        character.canvasImage.applyVelocity(0,offsetY);
    }

    /**
     * Met à jour la durée de la chute
     * Si celle-ci dure trop (chute infinie), on replace le personnage à une autre position aléatoire
     * @param {Character} character Un des personnages actuellement en jeu
     */
    #updateFallingTime(character) {
        if (character.onGround) character.fallingTime = null;
        else if (character.fallingTime === null) character.fallingTime = Date.now();
        else if (Date.now() - character.fallingTime > MAX_FALLING_TIME) {
            character.canvasImage.applyVelocity(Math.random(),Math.random());
            character.fallingTime = null;
        }
    }

}
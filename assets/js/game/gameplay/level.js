"use strict";

import {ROOT_PATH_DATA_LEVEL, SCORE_REQUIRED_TO_CHANGE_LEVEL} from "./constants.js";
import {Ground} from "./ground.js";

/** Classe regroupant les informations relatives aux niveaux */
export class Level {

    /**
     * @property {string[]} Level.#availableLevels Liste des niveaux disponibles
     */
    static #availableLevels = ["level0","level1"];

    /**
     * @property {Object<Ground>} Level.#allGrounds Positions des sols
     */
    static #allGrounds = {};

    /**
     * @property {number} currentLevel Niveau en cours
     */
    static currentLevel = 0;

    /**
     * @property {number} nbLevels Nombre total de niveaux
     */
    static nbLevels = 0;

    /**
     * @property {number} scoreToReachForNextLevel Score à atteindre pour changer de niveau
     */
    static scoreToReachForNextLevel = SCORE_REQUIRED_TO_CHANGE_LEVEL;

    /**
     * @property {number} #levelNumber Numéro du niveau
     */
    #levelNumber;

    /**
     * Créé une instance de Level
     * @param {number} levelNumber Numéro du niveau
     */
    constructor(levelNumber) {
        this.#levelNumber = levelNumber;
        Level.nbLevels++;
    }

    /**
     * Charge les données contenues dans un fichier JSON
     * @function Level.loadData
     * @param {string} levelName Nom du niveau
     * @returns {Promise<Ground>} Promesse de chargement des données
     */
    static loadData(levelName) {
        return fetch(`${ROOT_PATH_DATA_LEVEL}/${levelName}.json`)
            .then(res => res.json())
            .then(data => Level.#allGrounds[levelName] = new Ground(data["ground"]));
    }

    /**
     * Appelle la fonction de chargement de données pour chaque niveau
     * @function Level.loadAvailableLevelsData
     * @returns {Array<Promise<Ground>>} Une promesse pour chaque niveau
     */
    static loadAvailableLevelsData() {
        return this.#availableLevels.map(availableLevel => Level.loadData(availableLevel));
    }

    /**
     * Mise à jour du niveau en fonction du score du joueur
     * @function Level.levelSelection
     * @param {number} score Score actuel du joueur
     * @param {CanvasElement} canvasElement Instance de CanvasElement pour mise à jour de l'image de fond
     */
    static levelSelection(score, canvasElement) {
        if (score >= Level.scoreToReachForNextLevel) {
            Level.scoreToReachForNextLevel += SCORE_REQUIRED_TO_CHANGE_LEVEL;
            Level.currentLevel = (Level.currentLevel+1)%Level.nbLevels;
            canvasElement.setColorPalette(Level.currentLevel+1);
        }
    }

    /**
     * Ensemble des zones de sol pour un niveau donné
     * @returns {Object[]} Objets décrivant chaque zone de sol
     */
    get ground() {
        return Level.#allGrounds[`level${this.#levelNumber}`];
    }

}
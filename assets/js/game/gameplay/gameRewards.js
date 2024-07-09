"use strict";

import {ROOT_PATH_DATA_REWARDS, SKILL_LOCKED_OPACITY, SKILL_UNLOCKED_OPACITY,} from "./constants.js";

/** Classe permettant la gestion des récompenses */
export class GameRewards {

    /**
     * @property {Object} GameRewards.#rewardsData Objet décrivant chaque récompense
     */
    static #rewardsData;

    /**
     * @property {number} GameRewards.#skillNo Numéro de skill
     */
    static #skillNo = 0;

    /**
     * @property {string} #skill Nom de la compétence
     */
    #skill;

    /**
     * @property {string} #selector Sélecteur de l'élément HTML correspondant à la compétence
     */
    #selector;

    /**
     * @property {number} #scoreToReach Score à atteindre pour atteindre la récompense
     */
    #scoreToReach;

    /**
     * Créé une instance de GameRewards
     */
    constructor() {
        this.#skill = Object.keys(GameRewards.#rewardsData)[GameRewards.#skillNo++];
        this.#selector = GameRewards.#rewardsData[this.#skill]["selector"];
        this.#scoreToReach = GameRewards.#rewardsData[this.#skill]["score"];
    }

    /**
     * Charge les données contenues dans un fichier JSON
     * @function GameRewards.#loadData
     * @returns {Promise<any>} Promesse de chargement des données
     */
    static loadData() {
        return fetch(`${ROOT_PATH_DATA_REWARDS}/rewards.json`)
            .then(res => res.json())
            .then(data => this.#rewardsData = this.#sortRewardsData(data));
    }

    /**
     * Fonction de tri des récompenses par score requis croissant
     * @function GameRewards.#sortRewardsData
     * @param {Object} data Données relatives aux récompenses non triées
     * @returns {Object} Données relatives aux récompenses triées
     */
    static #sortRewardsData(data) {
        return Object.fromEntries(Object.entries(data).sort(([_key1,value1],[_key2,value2]) => value1["score"]-value2["score"]));
    }

    /**
     * Fonction d'affichage des récompenses en fonction du score atteint par le joueur
     * @param {number} currentScore Score atteint par le joueur
     */
    drawReward(currentScore) {
        const rewardHTMLElement = document.querySelector(this.#selector);
        if (currentScore >= this.#scoreToReach) rewardHTMLElement.style.opacity = SKILL_UNLOCKED_OPACITY;
        else rewardHTMLElement.style.opacity = SKILL_LOCKED_OPACITY;
    }

    /**
     * Retourne le score à atteindre pour afficher une récompense
     * @returns {number} Score à atteindre
     */
    get scoreToReach() {
        return this.#scoreToReach;
    }

}
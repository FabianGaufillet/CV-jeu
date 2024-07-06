"use strict";

import {
    HEIGHT_OF_REWARDS_IN_CANVAS, NUMBER_OF_SKILLS,
    ROOT_PATH_DATA_REWARDS,
    ROOT_PATH_IMAGE_REWARDS,
    WIDTH_OF_REWARDS_IN_CANVAS
} from "./constants.js";
import {CanvasImage} from "../drawing/canvasImage.js";

/** Classe permettant la gestion des récompenses */
export class GameRewards {

    /**
     * @property {Object} GameRewards.#rewardsData Objet décrivant chaque récompense
     */
    static #rewardsData;

    /**
     * @property {Image} GameRewards.#rewardsImage Sprite contenant les images de toutes les récompenses
     */
    static #rewardsImage;

    /**
     * @property {number} GameRewards.#skillNo Numéro de skill
     */
    static #skillNo = 0;

    /**
     * @property {CanvasImage} #canvasImage Informations relatives à la position et la taille de l'image dans le canvas
     */
    #canvasImage;

    /**
     * @property {string} #skill Nom de la compétence
     */
    #skill;

    /**
     * @property {number} #scoreToReach Score à atteindre pour atteindre la récompense
     */
    #scoreToReach;

    /**
     * Créé une instance de GameRewards
     */
    constructor() {
        this.#skill = Object.keys(GameRewards.#rewardsData)[GameRewards.#skillNo++];
        this.#scoreToReach = GameRewards.#rewardsData[this.#skill]["score"];
    }

    /**
     * Charge les données contenues dans un fichier JSON
     * @function GameRewards.#loadData
     * @returns {Promise<any>} Promesse de chargement des données
     */
    static #loadData() {
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
        return Object.fromEntries(Object.entries(data).sort(([,a],[,b]) => a["score"]-b["score"]));
    }

    /**
     * Instancie une Image contenant l'ensemble des récompenses
     * @function GameRewards.#loadImage
     * @returns {Promise<unknown>} Promesse de chargement de l'image
     */
    static #loadImage() {
        return new Promise((resolve, reject) => {
            this.#rewardsImage = new Image();
            this.#rewardsImage.addEventListener("load", resolve);
            this.#rewardsImage.addEventListener("error", reject);
            this.#rewardsImage.src = `${ROOT_PATH_IMAGE_REWARDS}/rewards.png`;
        });
    }

    /**
     * Appelle les 2 fonctions de chargement : données et image
     * @returns {Array.<Promise<*>>} Intégralité des promesses
     */
    static loadRewards() {
        return [this.#loadData(), this.#loadImage()];
    }

    /**
     * Initialisation de chaque image (position, taille) pour affichage dans la balise canvas
     * @param {number} index Numéro de l'image à afficher. Utile pour déterminer sa position.
     */
    initCanvasImage(index) {
        const space = (1-NUMBER_OF_SKILLS*WIDTH_OF_REWARDS_IN_CANVAS)/(NUMBER_OF_SKILLS - 1);
        this.#canvasImage = new CanvasImage({
            "sourceImage":{
                "x":0,
                "y":0,
                "w":0,
                "h":0
            },
            "canvas":{
                "x": (WIDTH_OF_REWARDS_IN_CANVAS + space)*index,
                "y": 1-HEIGHT_OF_REWARDS_IN_CANVAS,
                "w": WIDTH_OF_REWARDS_IN_CANVAS,
                "h": HEIGHT_OF_REWARDS_IN_CANVAS
            }
        });
    }

    /**
     * Fonction d'affichage des récompenses en fonction du score atteint par le joueur
     * @param {number} currentScore Score atteint par le joueur
     */
    drawReward(currentScore) {
        if (currentScore >= this.#scoreToReach) {
            this.#canvasImage.updatePositionAndSizeOfSourceImage({
                "x":GameRewards.#rewardsData[this.#skill]["x"],
                "y":GameRewards.#rewardsData[this.#skill]["y"],
                "w":GameRewards.#rewardsData[this.#skill]["w"],
                "h":GameRewards.#rewardsData[this.#skill]["h"]
            });
        } else {
            this.#canvasImage.updatePositionAndSizeOfSourceImage({
                "x":0,
                "y":0,
                "w":0,
                "h":0
            });
        }
    }

    /**
     * Informations relatives à la position et à la taille de l'image dans le canvas pour une récompense
     * @returns {CanvasImage} Instance de CanvasImage
     */
    get canvasImage() {
        return this.#canvasImage;
    }

    /**
     * Instance d'Image contenant toutes les images des récompenses
     * @returns {Image} Instance d'Image
     */
    get image() {
        return GameRewards.#rewardsImage;
    }

    /**
     * Retourne le score à atteindre pour afficher une récompense
     * @returns {number} Score à atteindre
     */
    get scoreToReach() {
        return this.#scoreToReach;
    }

}
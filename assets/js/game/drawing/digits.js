"use strict";

import {
    ROOT_PATH_DATA_NUMBERS,
    ROOT_PATH_IMAGE_NUMBERS,
    SCORE_POSITION_X,
    SCORE_POSITION_Y,
    SCORE_WIDTH,
    SCORE_HEIGHT
} from "./constants.js";
import {Sprite} from "./sprite.js";
import {CanvasImage} from "./canvasImage.js";

/** Classe permettant d'afficher un digit à l'écran */
export class Digits {

    /**
     * @property {Object[]} Digits.#numbersData Données relatives aux digits (taille et position de chaque sprite)
     */
    static #numbersData;

    /**
     * @property {Image} Digits.#numbersImage Image contenant tous les chiffres de 0 à 9
     */
    static #numbersImage;

    /**
     * @property {Sprite} #sprite Informations relatives à la partie du sprite en cours d'affichage
     */
    #sprite;

    /**
     * @property {CanvasImage} #canvasImage Informations relatives à la position et la taille de l'image dans le canvas
     */
    #canvasImage;

    /**
     * Créé une instance de Sprite
     */
    constructor() {
        this.#sprite = new Sprite(null,0);
    }

    /**
     * Charge les données contenues dans un fichier JSON
     * @function Sprite.#loadData
     * @returns {Promise<void>} Promesse de chargement des données
     */
    static #loadData() {
        return fetch(`${ROOT_PATH_DATA_NUMBERS}/numbers.json`)
            .then(res => res.json())
            .then(data => {
                for (const [key, value] of Object.entries(data)) {
                    if (!Array.isArray(Digits.#numbersData)) Digits.#numbersData = [];
                    Digits.#numbersData[parseInt(key,10)] = value;
                }
            });
    }

    /**
     * Instancie une Image contenant tous les digits
     * @function Digits.#loadImage
     * @returns {Promise<unknown>} Promesse de chargement d'une image
     */
    static #loadImage() {
        return new Promise((resolve, reject) => {
            this.#numbersImage = new Image();
            this.#numbersImage.addEventListener("load", resolve);
            this.#numbersImage.addEventListener("error", reject);
            this.#numbersImage.src = `${ROOT_PATH_IMAGE_NUMBERS}/numbers.png`;
        });
    }


    /**
     * Appelle les 2 fonctions de chargement : données et images pour chaque personnage et chaque état
     * @function Digits.loadDigits
     * @returns {Array.<Promise<*>>} Intégralité des promesses pour tous les digits
     */
    static loadDigits() {
        return [this.#loadData(), this.#loadImage()];
    }

    /**
     * Initialisation de l'image (position, taille) pour affichage dans la balise canvas
     */
    initCanvasImage(index) {
        this.#canvasImage = new CanvasImage({
            "sourceImage":{
                "x":Digits.#numbersData["0"]["x"],
                "y":Digits.#numbersData["0"]["y"],
                "w":Digits.#numbersData["0"]["w"],
                "h":Digits.#numbersData["0"]["h"]
            },
            "canvas":{
                "x":SCORE_POSITION_X[index],
                "y":SCORE_POSITION_Y,
                "w":SCORE_WIDTH,
                "h":SCORE_HEIGHT
            }
        });
    }

    /**
     * Accès aux données relatives aux digits
     * @function Digits.numbersData
     * @returns {Object[]} Données relatives aux digits (taille et position de chaque sprite)
     */
    static get numbersData() {
        return this.#numbersData;
    }

    /**
     * Sprite pour un digit en particulier
     * @returns {Sprite} Informations relatives à la partie du sprite en cours d'affichage
     */
    get sprite() {
        return this.#sprite;
    }

    /**
     * Instance d'Image pour les digits
     * @returns {Image} Instance d'Image
     */
    get image() {
        return Digits.#numbersImage;
    }

    /**
     * Informations relatives à la position et la taille de l'image dans le canvas pour un digit
     * @returns {CanvasImage} Instance de CanvasImage
     */
    get canvasImage() {
        return this.#canvasImage;
    }

}
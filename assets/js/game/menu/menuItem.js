"use strict";

import {ROOT_PATH_DATA_MENU, ROOT_PATH_IMAGE_MENU} from "./constants.js";
import {CanvasImage} from "../drawing/canvasImage.js";
import {Sprite} from "../drawing/sprite.js";

/** Classe décrivant un élément du menu (bouton, texte, ...) */
export class MenuItem {

    /**
     * @property {string[]} MenuItem.#availableMenuItems Liste intégrale des items disponibles
     */
    static #availableMenuItems = ["play","config","info","back","commands","about"];

    /**
     * @property {object} MenuItem.#allMenuItemsData Données relatives aux items (taille, position sur la feuille de sprite)
     */
    static #allMenuItemsData = {};

    /**
     * @property {object} MenuItem.#allMenuItemsImages Instances HTMLImageElement correspondant à chaque image
     */
    static #allMenuItemsImages = {};

    /**
     * @property {string} type Type d'item
     */
    type;

    /**
     * @property {Sprite} #sprite Informations relatives à la partie du sprite en cours d'affichage
     */
    #sprite;

    /**
     * @property {CanvasImage} #canvasImage Informations relatives à la position et la taille de l'image dans le canvas
     */
    #canvasImage;

    /**
     * Créé un nouvel item pour le menu principal
     * @param {string} type Type d'item
     * @param {string} status Statut du bouton (normal, en cours de survol, cliqué)
     */
    constructor(type,status) {
        this.type = type;
        this.#sprite = new Sprite(status, 0);
    }

    /**
     * Charge les données contenues dans un fichier JSON
     * @function MenuItem.#loadData
     * @param {string} type Type d'item
     * @returns {Promise<any>} Promesse de chargement des données
     */
    static #loadData(type) {
        return fetch(`${ROOT_PATH_DATA_MENU}/${type}.json`)
            .then(res => res.json())
            .then(data => this.#allMenuItemsData[type] = data);
    }

    /**
     * Instancie une Image pour chaque type d'item
     * @function MenuItem.#loadImage
     * @param type Type d'item
     * @returns {Promise<unknown>} Promesse de chargement d'une image
     */
    static #loadImage(type) {
        return new Promise((resolve, reject) => {
            this.#allMenuItemsImages[type] = new Image();
            this.#allMenuItemsImages[type].addEventListener("load", resolve);
            this.#allMenuItemsImages[type].addEventListener("error", reject);
            this.#allMenuItemsImages[type].src = `${ROOT_PATH_IMAGE_MENU}/${type}.png`;
        });
    }

    /**
     * Appelle les 2 fonctions de chargement : données et images pour chaque item
     * @function MenuItem.loadAvailableMenuItems
     * @returns {Array.<Promise<*>>} Intégralité des promesses pour tous les items
     */
    static loadAvailableMenuItems() {
        return [
            this.#availableMenuItems.map(availableMenuItem => MenuItem.#loadData(availableMenuItem)),
            this.#availableMenuItems.map(availableMenuItem => MenuItem.#loadImage(availableMenuItem))
        ].flat();
    }

    /**
     * Initialisation de l'image (position, taille) pour affichage dans la balise canvas
     * @param {number} posX Position horizontale de l'item
     * @param {number} posY Position verticale de l'item
     * @param {number} width Largeur de l'item dans la balise canvas
     * @param {number} height Hauteur de l'item dans la balise canvas
     */
    initCanvasImage(posX,posY,width,height) {
        const currentState = this.#sprite["currentState"],
              settings = MenuItem.#allMenuItemsData[this.type][currentState];

        this.#canvasImage = new CanvasImage({
            "sourceImage":{
                "x":settings[0]["x"],
                "y":settings[0]["y"],
                "w":settings[0]["w"],
                "h":settings[0]["h"]
            },
            "canvas":{
                "x":posX,
                "y":posY,
                "w":width,
                "h":height
            }
        });
    }

    /**
     * Informations relatives à la partie du sprite en cours d'affichage
     * @returns {Sprite} Informations relatives à la partie du sprite en cours d'affichage
     */
    get sprite() {
        return this.#sprite;
    }

    /**
     * Données relatives à un item particulier
     * @returns {Object[]} Données sur les différentes positions et tailles de l'image dans le sprite
     */
    get data() {
        return MenuItem.#allMenuItemsData[this.type];
    }

    /**
     * Instance d'Image pour un item particulier
     * @returns {Image} Instance d'Image
     */
    get image() {
        return MenuItem.#allMenuItemsImages[this.type];
    }

    /**
     * Informations relatives à la position et la taille de l'image dans le canvas pour un item en particulier
     * @returns {CanvasImage} Instance de CanvasImage
     */
    get canvasImage() {
        return this.#canvasImage;
    }

}
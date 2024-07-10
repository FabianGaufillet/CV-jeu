"use strict";

import {
    WIDTH_OF_CHARACTERS_IN_CANVAS,
    HEIGHT_OF_CHARACTERS_IN_CANVAS,
    ROOT_PATH_DATA_CHARACTER,
    ROOT_PATH_IMAGE_CHARACTER
} from "./constants.js";
import {CanvasImage} from "../drawing/canvasImage.js";
import {Sprite} from "../drawing/sprite.js";
import {Velocity} from "./velocity.js";

/** Classe permettant de gérer les personnages */
export class Character {

    /**
     * @property {string[]} Character.#availableTypes Tous les types de personnages disponibles
     */
    static #availableTypes = ["knight", "zombie_female", "zombie_male", "adventure_girl"];

    /**
     * @property {Object<string[]>} Character.#availableStates Tous les états possibles en fonction du type de personnage
     */
    static #availableStates = {
        "knight": ["attackL","attackR","deadL","deadR","idleL","idleR","jumpAttackL","jumpAttackR","jumpL","jumpR","runL","runR","walkL","walkR"],
        "zombie_female": ["attackL","attackR","deadL","deadR","idleL","idleR","walkL","walkR"],
        "zombie_male": ["attackL","attackR","deadL","deadR","idleL","idleR","walkL","walkR"],
        "adventure_girl": ["attackL", "attackR", "idleL","idleR", "walkL", "walkR"]
    };

    /**
     * @property {Object} Character.#allCharactersData Intégralité des données relatives aux personnages
     */
    static #allCharactersData = {};

    /**
     * @property {Object} Character.#allCharactersImages Intégralité des images relatives aux personnages et leurs différents états
     */
    static #allCharactersImages = {};

    /**
     * @property {string} #type Type de personnage (knight, zombie)
     */
    #type;

    /**
     * @property {string} #state État actuel du personnage (repos, déplacement, ...)
     */
    #state;

    /**
     * @property {Sprite} #sprite Informations relatives à la partie du sprite en cours d'affichage
     */
    #sprite;

    /**
     * @property {Velocity} #velocities Informations relatives à la vitesse de déplacement du personnage
     */
    #velocities;

    /**
     * @property {CanvasImage} #canvasImage Informations relatives à la position et la taille de l'image dans le canvas
     */
    #canvasImage;

    /**
     * @property {boolean} onGround Indique si le personnage est sur un sol
     */
    onGround;

    /**
     * @property {boolean} isDead Indique si le personnage est en vie ou pas
     */
    isDead;

    /**
     * @property {boolean} meetStranger Indique si le personnage est en contact avec l'étranger
     */
    meetStranger;

    /**
     * @property {number} fallingTime Timestamp du début de la chute libre du personnage
     */
    fallingTime;

    /**
     * @property {number} lastStatusChangeTime Timestamp du dernier changement d'état du personnage
     */
    lastStatusChangeTime;

    /**
     * Créé une instance de Character
     * @param {string} type Type de personnage
     * @param {string} state État initial du personnage
     */
    constructor(type,state) {
        this.#type = type;
        this.#state = state;
        this.#sprite = new Sprite(state,0, ["deadL","deadR"]);
        this.#velocities = new Velocity();
        this.onGround = true;
        this.isDead = false;
        this.meetStranger = false;
        this.fallingTime = null;
        this.lastStatusChangeTime = Date.now();
    }

    /**
     * Charge les données contenues dans un fichier JSON
     * @function Character.#loadData
     * @param {string} type Type de personnage
     * @returns {Promise<any>} Promesse de chargement des données
     */
    static #loadData(type) {
        return fetch(`${ROOT_PATH_DATA_CHARACTER}/${type}.json`)
            .then(res => res.json())
            .then(data => this.#allCharactersData[type] = data);
    }

    /**
     * Instancie une Image pour chaque personnage et chaque état possible
     * @function Character.#loadImage
     * @param {string} type Type de personnage
     * @param {string} state État du personnage
     * @returns {Promise<unknown>} Promesse de chargement d'une image
     */
    static #loadImage(type, state) {
        return new Promise((resolve, reject) => {
            if (!this.#allCharactersImages[type]) this.#allCharactersImages[type] = [];
            this.#allCharactersImages[type].push(new Image());
            this.#allCharactersImages[type].at(-1).addEventListener("load", resolve);
            this.#allCharactersImages[type].at(-1).addEventListener("error", reject);
            this.#allCharactersImages[type].at(-1).src = `${ROOT_PATH_IMAGE_CHARACTER}/${type}/${state}.png`;
        });
    }

    /**
     * Appelle les 2 fonctions de chargement : données et images pour chaque personnage et chaque état
     * @function Character.loadAvailableCharacters
     * @returns {Array.<Promise<*>>} Intégralité des promesses pour tous les personnages
     */
    static loadAvailableCharacters() {
        return [
            this.#availableTypes.map(availableType => Character.#loadData(availableType)),
            Object.keys(this.#availableStates).map(type => {this.#availableStates[type].map(availableState => Character.#loadImage(type, availableState));})
        ].flat();
    }

    /**
     * Mise à jour de la position de tous les personnages du jeu
     * @function Character.updatePositionsOfCharacters
     * @param {...Character} characters Personnages du jeu
     */
    static updatePositionsOfCharacters(...characters) {
        for (const character of characters) {
            const currentState = character.state;
            character.#sprite.setNextSprite(Character.#allCharactersData[character.#type][currentState]["moves"],character.#canvasImage);
            character.#velocities.updateVelocities(
                character.onGround,
                currentState,
                Character.#allCharactersData[character.#type][currentState]["velocityX"],
                Character.#allCharactersData[character.#type][currentState]["velocityY"]
            );
            character.#canvasImage.applyVelocity(
                character.#velocities.velocityX,
                character.#velocities.velocityY
            );
        }
    }

    /**
     * Initialisation de l'image (position, taille) pour affichage dans la balise canvas
     */
    initCanvasImage() {
        const currentState = this.#sprite["currentState"],
              moves = Character.#allCharactersData[this.#type][currentState]["moves"];

        this.#canvasImage = new CanvasImage({
            "sourceImage":{
                "x":moves[0]["x"],
                "y":moves[0]["y"],
                "w":moves[0]["w"],
                "h":moves[0]["h"]
            },
            "canvas":{
                "x":Math.random(),
                "y":Math.random(),
                "w":WIDTH_OF_CHARACTERS_IN_CANVAS,
                "h":HEIGHT_OF_CHARACTERS_IN_CANVAS
            }
        });
    }

    /**
     * Mise à jour de l'état du personnage
     * @param {string} state Nouvel état du personnage
     */
    updateStateOfCharacter(state) {
        this.lastStatusChangeTime = Date.now();
        this.#state = state;
        this.#sprite.changeSprite(state);
    }

    /**
     * Fonction qui détermine aléatoirement le prochain état d'un personnage
     */
    setRandomState() {
        const states = Object.keys(Character.#allCharactersData[this.#type]).filter(s => !(s.startsWith("dead") || s.startsWith("attack")));
        if (this.isDead) return;
        let nextState = this.state;
        while (nextState === this.sprite.currentState) nextState = states[Math.floor(Math.random() * states.length)];
        this.updateStateOfCharacter(nextState);
    }

    /**
     * Fonction qui fait revenir un personnage à la vie après un certain temps
     * @param {number} delay Temps d'attente (en ms) avant que le personnage revienne à la vie
     */
    comeBackToLife(delay) {
        setTimeout(() => {
            this.isDead = false;
            this.setRandomState();
            this.#canvasImage.applyVelocity(Math.random(),Math.random());
        },delay);
    }

    /**
     * Sprite pour un personnage et un état en particulier
     * @returns {Sprite} Informations relatives à la partie du sprite en cours d'affichage
     */
    get sprite() {
        return this.#sprite;
    }

    /**
     * Instance d'Image pour un personnage et un état en particulier
     * @returns {Image} Instance d'Image
     */
    get image() {
        return Character.#allCharactersImages[this.#type][Character.#availableStates[this.#type].indexOf(this.#state)];
    }

    /**
     * Informations relatives à la position et la taille de l'image dans le canvas pour un personnage et un statut en particulier
     * @returns {CanvasImage} Instance de CanvasImage
     */
    get canvasImage() {
        return this.#canvasImage;
    }

    /**
     * Le type de personnage
     * @returns {string} Type du personnage ciblé
     */
    get type() {
        return this.#type;
    }

    /**
     * État actuel du personnage
     * @returns {string} État du personnage ciblé
     */
    get state() {
        return this.#state;
    }

    /**
     * Position dans le sprite des différents mouvements décrivant une animation
     * @returns {Object[]} Toutes les positions des images dans le sprite pour un état particulier
     */
    get moves() {
        return Character.#allCharactersData[this.#type][this.#state]["moves"];
    }

}
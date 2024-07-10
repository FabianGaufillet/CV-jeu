"use strict";

import {
    AVAILABLE_ENEMIES,
    DIRECTIONS,
    MIN_ENEMIES,
    MAX_ENEMIES,
    PLAYER_INITIAL_STATE,
    ENEMIES_INITIAL_STATE, NB_REWARDS
} from "./constants.js";
import {Level} from "./level.js";
import {Character} from "./character.js";
import {Game} from "./game.js";
import {Digits} from "../drawing/digits.js";
import {GameRewards} from "./gameRewards.js";

/** Classe permettant de gérer le lancement du jeu */
export class GameLauncher {

    /**
     * @property {HTMLCanvasElement} #htmlCanvasElement Canvas dans lequel dessiner
     */
    #htmlCanvasElement;

    /**
     * @property {CanvasElement} #canvasElement Informations et méthodes pour la balise Canvas
     */
    #canvasElement;

    /**
     * @property {Menu} #menu Pour revenir au menu principal
     */
    #menu;

    /**
     * @property {Game} #game Pour lancer une partie
     */
    #game;

    /**
     * @property {number} #nbEnemies Nombre d'ennemis au départ de la partie
     */
    #nbEnemies;

    /**
     * @property {Level[]} #levels Tous les niveaux de jeu
     */
    #levels;

    /**
     * @property {Character} #player Le joueur, avec toutes ses caractéristiques
     */
    #player;

    /**
     * @property {Character} #stranger Personnage non joueur
     */
    #stranger;

    /**
     * @property {Digits[]} #digits Pour l'affichage du score
     */
    #digits;

    /**
     * @property {Character[]} #enemies Tous les ennemis présents dans le jeu
     */
    #enemies;

    /**
     * @property {GameRewards} #gameRewards Récompenses de jeu
     */
    #gameRewards;

    /**
     * @property {boolean} #ready Indique si le jeu est prêt à être lancé
     */
    #ready;

    /**
     * Créé un nouveau lanceur pour le jeu
     * @param {HTMLCanvasElement} htmlCanvasElement Canvas dans lequel dessiner
     * @param {CanvasElement} canvasElement Informations et méthodes pour la balise Canvas
     * @param {Menu} menu Pour revenir au menu principal
     */
    constructor(htmlCanvasElement, canvasElement, menu) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#canvasElement = canvasElement;
        this.#menu = menu;
        this.#ready = false;
        this.#initLevel();
    }

    /**
     * Initialise l'intégralité des données relatives au jeu
     */
    #initLevel() {
        Promise.all([Level.loadAvailableLevelsData(), Character.loadAvailableCharacters(), Digits.loadDigits(), GameRewards.loadData()].flat())
            .then(() => {
                this.#nbEnemies = Math.max(MIN_ENEMIES,Math.ceil(Math.random() * MAX_ENEMIES));
                this.#levels = [new Level(0),new Level(1)];
                this.#player = new Character("knight", this.#setState(PLAYER_INITIAL_STATE));
                this.#stranger = new Character("adventure_girl", this.#setState("idle"));
                this.#digits =  [new Digits(), new Digits(), new Digits()];
                this.#gameRewards = Array(NB_REWARDS).fill("").map(_el => new GameRewards());
                this.#enemies = [];
                this.#addEnemies();
                this.#createNewGame();
                this.#initAllCanvasImages();
        });
    }

    /**
     * Ajoute les premiers ennemis au début du jeu
     */
    #addEnemies() {
        for (let i = 0; i < this.#nbEnemies; i++) {
            const type = AVAILABLE_ENEMIES[Math.floor(Math.random() * AVAILABLE_ENEMIES.length)];
            this.#enemies.push(new Character(type, this.#setState(ENEMIES_INITIAL_STATE)));
        }
    }

    /**
     * Définit aléatoirement une direction
     * @param {string} state État du personnage
     * @returns {string} État du personnage avec une direction
     */
    #setState(state) {
        return state+DIRECTIONS.at(Math.floor(Math.random() * DIRECTIONS.length));
    }

    /**
     * Créé une nouvelle partie
     */
    #createNewGame() {
        this.#game = new Game(this.#canvasElement, this.#menu, this.#levels, this.#digits, this.#player, this.#stranger, this.#enemies, this.#gameRewards);
    }

    /**
     * Initialise les informations relatives à la position et la taille de chaque image dans le canvas
     */
    #initAllCanvasImages() {
        this.#game.initAllCanvasImages();
        this.#ready = true;
    }

    /**
     * Lance la partie une fois que tout a été correctement chargé
     */
    launchGame() {
        this.#canvasElement.setColorPalette(Level.currentLevel+1);
        this.#game.loop();
    }

    /**
     * Indique si la partie est prête à être lancée
     * @returns {boolean} Vrai si la partie peut être lancée, faux sinon.
     */
    get ready() {
        return this.#ready;
    }

}
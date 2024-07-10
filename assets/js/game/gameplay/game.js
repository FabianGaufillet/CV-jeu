"use strict";

import {
    GAME_REFRESH_RATE,
    DELAY_BEFORE_ENEMY_STATE_CHANGE,
    AVAILABLE_ENEMIES,
    DIRECTIONS,
    PROBABILITY_OF_ENEMY_APPEARANCE,
    DELAY_BEFORE_NEXT_ENEMY_APPEARANCE,
    PAUSE_MESSAGE,
    FONT_MESSAGE,
    ENEMIES_INITIAL_STATE,
    PAUSE_MESSAGE_POSX,
    PAUSE_MESSAGE_POSY, RESUME_DESCRIPTION, WIN_MESSAGE
} from "./constants.js";
import {Character} from "./character.js";
import {CollisionsManager} from "../eventsManagers/collisionsManager.js";
import {Score} from "./score.js";
import {Level} from "./level.js";
import {KeysPressedManager} from "../eventsManagers/keysPressedManager.js";

/** Classe permettant de gérer le jeu */
export class Game {

    /**
     * @property {CanvasElement} #canvasElement Informations et méthodes pour la balise Canvas
     */
    #canvasElement;

    /**
     * @property {Level[]} #levels Tous les niveaux de jeu
     */
    #levels;

    /**
     * @property {Digits[]} #digits Pour l'affichage du score
     */
    #digits;

    /**
     * @property {Character} #player Le joueur, avec toutes ses caractéristiques
     */
    #player;

    /**
     * @property {Character} #player Le personnage none joueur, avec toutes ses caractéristiques
     */
    #stranger

    /**
     * @property {Character[]} #enemies Tous les ennemis présents dans le jeu
     */
    #enemies;

    /**
     * @property {GameRewards} #gameRewards Récompenses de jeu
     */
    #gameRewards;

    /**
     * @property {KeysPressedManager} #keysPressedManager Gestionnaire d'événements relatifs à l'appui sur les touches du clavier
     */
    #keysPressedManager;

    /**
     * @property {CollisionsManager} #collisionHandler  Gestionnaire de collision
     */
    #collisionHandler;

    /**
     * @property {Score} #score Pour la gestion du score
     */
    #score;

    /**
     * @property {number} #requestAnimationFrameID ID de requestAnimationFrame
     */
    #requestAnimationFrameID;

    /**
     * @property {number} #lastRefresh Timestamp de la dernière mise à jour de l'écran de jeu
     */
    #lastRefresh;

    /**
     * @property {number} #lastEnemyAddedTime Timestamp du dernier ajout d'ennemi
     */
    #lastEnemyAddedTime;

    /**
     * @property {MenuLauncher} #menuLauncher Pour revenir au menu principal
     */
    #menuLauncher;

    /**
     * @property {boolean} #pauseMessageOnDisplay Indique si le message de pause est actuellement affiché
     */
    #pauseMessageOnDisplay;

    /**
     * @property {boolean} #win Indique si le joueur a gagné la partie
     */
    #win;

    /**
     * @property {boolean} #winMessageOnDisplay Indique si le message de victoire est actuellement affiché
     */
    #winMessageOnDisplay;

    /**
     * @property {string[]} #strangerMessages Messages du personnage non joueur
     */
    #strangerMessages;

    /**
     * @property {boolean} #strangerMessageOndisplay Indique si le message du personnage non joueur est actuellement affiché
     */
    #strangerMessageOndisplay;

    /**
     * Créé une nouvelle instance de Game
     * @param {CanvasElement} canvasElement Informations et méthodes pour la balise Canvas
     * @param {MenuLauncher} menuLauncher Pour revenir au menu principal
     * @param {Level[]} levels Tous les niveaux de jeu
     * @param {Digits[]} digits Pour l'affichage du score
     * @param {Character} player Le joueur, avec toutes ses caractéristiques
     * @param {Character} stranger Le personnage non joueur, avec toutes ses caractéristiques
     * @param {Character[]} enemies Tous les ennemis présents dans le jeu
     * @param {GameRewards} gameRewards Récompenses de jeu
     */
    constructor(canvasElement, menuLauncher, levels, digits, player, stranger, enemies, gameRewards) {
        this.#canvasElement = canvasElement;
        this.#levels = levels;
        this.#digits = digits;
        this.#player = player;
        this.#stranger = stranger;
        this.#enemies = enemies;
        this.#gameRewards = gameRewards;
        this.#keysPressedManager = new KeysPressedManager();
        this.#collisionHandler = new CollisionsManager(this.#player);
        this.#score = new Score(this.#digits);
        this.#lastRefresh = Date.now();
        this.#lastEnemyAddedTime = Date.now();
        this.#menuLauncher = menuLauncher;
        this.#pauseMessageOnDisplay = false;
        this.#win = false;
        this.#winMessageOnDisplay = false;
        this.#strangerMessages = RESUME_DESCRIPTION;
        this.#strangerMessageOndisplay = false;
    }

    /**
     * Initialise les informations relatives à la position et la taille de chaque image dans le canvas
     */
    initAllCanvasImages() {
        this.#player.initCanvasImage();
        this.#stranger.initCanvasImage();
        this.#enemies.map(enemy => enemy.initCanvasImage());
        this.#digits.map((digit,i) => digit.initCanvasImage(i));
    }

    /**
     * Boucle de jeu
     * Gestion de la pause
     * Gestion du retour au menu principal
     * Gestion de la partie
     */
    loop() {
        if (Date.now() - this.#lastRefresh >= GAME_REFRESH_RATE) {
            if (!this.#keysPressedManager.gamePaused) this.#pauseMessageOnDisplay = false;
            this.#lastRefresh = Date.now();
            if (this.#keysPressedManager.backToMenu) {
                this.#stopLoop();
                return;
            } else {
                this.#keysPressedManager.manageKeysPressed(this.#player);
                if (this.#win) this.#handleEndOfGame();
                else if (this.#player.meetStranger) this.#handleStrangerMeeting();
                else if (this.#keysPressedManager.gamePaused) this.#handleGamePaused();
                else this.#updateGame();
            }
        }
        this.#requestAnimationFrameID = requestAnimationFrame(() => this.loop());
    }

    /**
     * Arrêt des animations si le joueur revient au menu principal
     */
    #stopLoop() {
        this.#keysPressedManager.backToMenu = false;
        cancelAnimationFrame(this.#requestAnimationFrameID);
        this.#menuLauncher.launchMenu();
    }

    /**
     * Mise à jour du jeu
     * Ajout et déplacement des ennemis
     * Gestion des commandes du joueur
     * Affichage des récompenses
     * Éventuel changement de niveau
     * Gestion des collisions
     */
    #updateGame() {
        const currentLevel = this.#levels[Level.currentLevel];
        this.#updateEnemiesList();
        this.#updateNonPlayerCharactersState();
        Character.updatePositionsOfCharacters(this.#player, this.#stranger, ...this.#enemies);
        Level.levelSelection(this.#score.currentScore,this.#canvasElement);
        this.#updateRewards();
        currentLevel.ground.areCharactersOnGround(this.#player, this.#stranger, ...this.#enemies);
        this.#collisionHandler.handleCollisions(this.#enemies, this.#stranger, this.#score);
        this.#canvasElement.drawImage(...this.#digits,...this.#enemies, this.#player, this.#stranger);
    }

    /**
     * Mise à jour de la liste d'ennemis
     * Consiste à ajouter des ennemis à intervalles réguliers avec une probabilité relativement faible
     */
    #updateEnemiesList() {
        const type = AVAILABLE_ENEMIES[Math.floor(Math.random() * AVAILABLE_ENEMIES.length)],
              newEnemy = new Character(type, ENEMIES_INITIAL_STATE + DIRECTIONS.at(Math.floor(Math.random() * DIRECTIONS.length)));

        if (Date.now() - this.#lastEnemyAddedTime < DELAY_BEFORE_NEXT_ENEMY_APPEARANCE) return;
        this.#lastEnemyAddedTime = Date.now();
        if (Math.random() > PROBABILITY_OF_ENEMY_APPEARANCE) return;
        newEnemy.initCanvasImage();
        this.#enemies.push(newEnemy);
    }

    /**
     * Mise à jour de l'état des ennemis
     * On change leur état régulièrement pour leur donner un semblant de vie
     */
    #updateNonPlayerCharactersState() {
        if (Date.now() - this.#stranger.lastStatusChangeTime > DELAY_BEFORE_ENEMY_STATE_CHANGE) this.#stranger.setRandomState();
        for (const enemy of this.#enemies) {
            if (Date.now() - enemy.lastStatusChangeTime < DELAY_BEFORE_ENEMY_STATE_CHANGE) continue;
            enemy.setRandomState();
        }
    }

    /**
     * Mise à jour des récompenses affichées en fonction du score du joueur
     */
    #updateRewards() {
        for (const gameReward of this.#gameRewards) gameReward.drawReward(this.#score.currentScore);
        if (this.#win !== null) this.#win = this.#gameRewards.every(gameReward => this.#score.currentScore >= gameReward.scoreToReach);
    }

    /**
     * Gestion de la pause
     */
    #handleGamePaused() {
        if (!this.#pauseMessageOnDisplay) {
            this.#canvasElement.drawText(PAUSE_MESSAGE, FONT_MESSAGE, PAUSE_MESSAGE_POSX, PAUSE_MESSAGE_POSY);
            this.#pauseMessageOnDisplay = true;
        }
    }

    /**
     * Gestion de la victoire
     */
    #handleEndOfGame() {
        if (!this.#winMessageOnDisplay) {
            this.#fillModal(WIN_MESSAGE["icon"],WIN_MESSAGE["head"],WIN_MESSAGE["body"]);
            this.#showModal();
            this.#winMessageOnDisplay = true;
        } else {
            if (this.#isModalHidden()) {
                this.#winMessageOnDisplay = false;
                this.#win = null;
            }
        }
    }

    /**
     * Gestion de la rencontre entre le joueur et le personnage non joueur
     */
    #handleStrangerMeeting() {
        if (!this.#strangerMessageOndisplay) {
            this.#strangerMessageOndisplay = true;
            this.#fillModal(this.#strangerMessages["icon"], this.#strangerMessages["head"], this.#strangerMessages["body"].shift());
            this.#showModal();
            this.#stranger.comeBackToLife(0);
        } else {
            if (this.#isModalHidden()) {
                this.#strangerMessageOndisplay = false;
                if (!this.#strangerMessages["body"].length) this.#player.meetStranger = null;
                else this.#player.meetStranger = false;
            }
        }
    }

    /**
     * Fonction qui indique l'état affiché/masqué de la modale
     * @returns {boolean} Vrai si la modale est masquée, faux sinon
     */
    #isModalHidden() {
        const modal = document.querySelector(".modal");
        return modal.classList.contains("hidden");
    }

    /**
     * Fonction qui affiche la modale
     */
    #showModal() {
        const modal = document.querySelector(".modal"),
              overlay = document.querySelector(".overlay");

        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");
    }

    /**
     * Remplissage de la modale avec un petit message
     */
    #fillModal(icon, head, body) {
        const modalBtnClose = document.querySelector("section.modal > button.btn-close")
            , divs = [document.createElement("div"), document.createElement("div")];

        divs[0].innerHTML = `<i class="${icon} fa-xl mr-1vw"></i><strong>${head}</strong>`;
        divs[1].innerHTML = `<div><p>${body}</p></div>`;
        modalBtnClose.after(...divs);

    }

}
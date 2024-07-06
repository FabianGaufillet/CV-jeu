"use strict";

/** Classe permettant de gérer les positions d'un sprite */
export class Sprite {

    /**
     * @property {string} currentState État courant de l'élément à dessiner (ex: pour un personnage, "idle")
     */
    currentState;

    /**
     * @property {number} #currentIndexOfSprite Numéro du sprite actuellement dessiné
     */
    #currentIndexOfSprite;

    /**
     * @property {string[]} #oneTimeAnimations Liste d'animations devant être jouées qu'une seule fois
     */
    #oneTimeAnimations;

    /**
     * Créé une instance de Sprite
     * @param {string} state État initial de l'élément à dessiner
     * @param {number} indexOfSprite Numéro du sprite de départ
     * @param {string[]} [oneTimeAnimations=[]] Liste d'animations jouées de manière unique
     */
    constructor(state,indexOfSprite, oneTimeAnimations = []) {
        this.currentState = state;
        this.#currentIndexOfSprite = indexOfSprite;
        this.#oneTimeAnimations = oneTimeAnimations;
    }

    /**
     * Récupère le sprite suivant et l'affiche
     * @param {Object[]} sprites Positions des différents sprites
     * @param {CanvasImage} canvasImage Informations et méthodes pour la balise Canvas
     */
    setNextSprite(sprites, canvasImage) {
        const nextSprite = this.#getNextSprite(sprites);
        canvasImage.updatePositionAndSizeOfSourceImage(nextSprite);
    }

    /**
     * Récupère le sprite précédent et l'affiche
     * @param {Object[]} sprites Positions des différents sprites
     * @param {CanvasImage} canvasImage Informations et méthodes pour la balise Canvas
     */
    setPreviousSprite(sprites, canvasImage) {
        const previousSprite = this.#getPreviousSprite(sprites);
        canvasImage.updatePositionAndSizeOfSourceImage(previousSprite);
    }

    /**
     * Retourne les informations sur la position et la taille du sprite suivant
     * @param {Object[]} sprites Positions des différents sprites
     * @returns {Object} Position du sprite qu'on souhaite dessiner
     */
    #getNextSprite(sprites) {
        if (!(this.#currentIndexOfSprite === sprites.length-1 && this.#oneTimeAnimations.includes(this.currentState))) {
            this.#currentIndexOfSprite = (this.#currentIndexOfSprite + 1)%sprites.length;
        }
        return sprites[this.#currentIndexOfSprite];
    }

    /**
     * Retourne les informations sur la position et la taille du sprite précédent
     * @param {Object[]} sprites Positions des différents sprites
     * @returns {Object} Position du sprite qu'on souhaite dessiner
     */
    #getPreviousSprite(sprites) {
        if (this.#currentIndexOfSprite === 0) this.#currentIndexOfSprite = sprites.length-1;
        else this.#currentIndexOfSprite--;
        return sprites[this.#currentIndexOfSprite];
    }

    /**
     * Fonction permettant de changer de sprite lors d'un changement d'état (ex: idle -> walk)
     * @param {string} state Nouvel état de l'élément à dessiner
     */
    changeSprite(state) {
        this.currentState = state;
        this.#currentIndexOfSprite = 0;
    }

    /**
     * Fonction indiquant si tous les sprites d'une animation ont été joués
     * @param {Object[]} sprite Positions des différents sprites
     * @returns {boolean} Vrai si l'animation s'est jouée intégralement, faux sinon
     */
    isCurrentAnimationFinished(sprite) {
        return this.#currentIndexOfSprite === sprite.length-1;
    }

}
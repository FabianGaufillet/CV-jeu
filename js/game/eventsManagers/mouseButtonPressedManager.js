"use strict";

/** Classe permettant de définir l'action à effectuer en fonction des actions de l'utilisateur */
export class MouseButtonPressedManager {

    /**
     * @property {HTMLCanvasElement} #htmlCanvasElement Canvas dont on récupère les dimensions
     */
    #htmlCanvasElement;

    /**
     * @property {CanvasElement} #canvasElement Informations et méthodes pour la balise Canvas
     */
    #canvasElement;

    /**
     * @property {MenuItem[]} #items Tous les boutons du menu principal
     */
    #items;

    /**
     * @property {string} #screen Écran du menu principal actuellement affiché
     */
    #screen = "mainMenu";

    /**
     * @property {Object<string[]>} #screenItems Description des boutons à utiliser en fonction de l'écran affiché
     */
    #screenItems = {
        "mainMenu": ["play","config","info"],
        "config": ["back", "commands"],
        "info": ["back", "about"]
    };

    /**
     * Créé une instance de MouseButtonPressedManager
     * @param {HTMLCanvasElement} htmlCanvasElement Canvas dont on récupère les dimensions
     * @param {CanvasElement} canvasElement Informations et méthodes pour la balise Canvas
     * @param {MenuItem[]} items Tous les boutons du menu principal
     */
    constructor(htmlCanvasElement, canvasElement, items) {
        this.#htmlCanvasElement = htmlCanvasElement;
        this.#canvasElement = canvasElement;
        this.#items = items;
    }

    /**
     * Fonction qui détermine l'action à effectuer en fonction de l'action de l'utilisateur
     * @param {MouseEvent} ev Événement lié l'utilisation de la souris
     * @param {boolean} mousedown Indique si le bouton est actuellement enfoncé
     * @param {boolean} click Indique s'il y a eu un clic
     */
    manageMouseButtonPressed(ev, mousedown, click) {
        const mouseX = ev.clientX-this.#htmlCanvasElement.offsetLeft,
              mouseY = ev.clientY-this.#htmlCanvasElement.offsetTop,
              concernedItems = this.#items.filter(item => this.#screenItems[this.#screen].includes(item.type));

        for (const item of concernedItems) {
            const itemCoords = this.#itemCoordinates(item),
                  overItem = mouseX >= itemCoords["leftX"] && mouseX <= itemCoords["rightX"] && mouseY >= itemCoords["topY"] && mouseY <= itemCoords["bottomY"];

            let nextState = null;
            if (overItem) {
                if (click) {
                    this.#handleClick(item);
                    return;
                } else if (!mousedown && item.sprite.currentState !== "hover") {
                    nextState = "hover";
                } else if (mousedown && item.sprite.currentState !== "click") {
                    nextState = "click";
                }
            } else if (item.sprite.currentState !== "normal") nextState = "normal";

            if (nextState) this.#updateSprite(item, nextState);
        }
        this.#canvasElement.drawImage(...concernedItems);
    }

    /**
     * Retourne les coordonnées d'un élément du menu
     * @param {MenuItem} item Élément du menu
     * @returns {{leftX: number, topY: number, bottomY: number, rightX: number}} #itemCoordinates Coordonnées de l'élément
     */
    #itemCoordinates(item) {
        return {
            "leftX": item.canvasImage.positionInCanvas["x"]*this.#htmlCanvasElement.width,
            "rightX": (item.canvasImage.positionInCanvas["x"] + item.canvasImage.sizeInCanvas["width"])*this.#htmlCanvasElement.width,
            "topY": item.canvasImage.positionInCanvas["y"]*this.#htmlCanvasElement.height,
            "bottomY": (item.canvasImage.positionInCanvas["y"] + item.canvasImage.sizeInCanvas["height"])*this.#htmlCanvasElement.height,
        }
    }

    /**
     * Met à jour le sprite d'un bouton
     * @param {MenuItem} item Élément du menu concerné
     * @param {string} nextState Nouvel état de l'élément à mettre à jour
     */
    #updateSprite(item, nextState) {
        item.sprite.changeSprite(nextState);
        item.sprite.setNextSprite(item.data[nextState],item.canvasImage);
    }

    /**
     * Gestion du clic sur un élément du menu
     * @param {MenuItem} item Élément du menu concerné
     */
    #handleClick(item) {
        this.#updateSprite(item, "normal");
        switch (item.type) {
            case "play":
                this.#play();
                break;

            case "config":
            case "info":
                this.#drawImage(item.type);
                break;

            case "back":
                this.#drawImage("mainMenu");
                break;
        }
    }

    /**
     * Gestion de l'appui sur le bouton "jouer"
     */
    #play() {
        this.#htmlCanvasElement.dispatchEvent(new Event('gameLaunchAttempt'));
    }

    /**
     * Affichage du menu et de toutes ses composantes
     * @param {string} type Page du menu principal à afficher
     */
    #drawImage(type) {
        this.#screen = type;
        this.#canvasElement.drawImage(...this.#items.filter(item => this.#screenItems[this.#screen].includes(item.type)));
    }
}
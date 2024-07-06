"use strict";

/** Classe permettant de gérer les informations et méthodes relatives au canvas */
export class CanvasElement {

    /**
     * @property {HTMLCanvasElement} #htmlCanvasElement Canvas dans lequel dessiner
     */
    htmlCanvasElement;

    /**
     * @property {number} width Largeur du canvas
     */
    width;

    /**
     * @property {number} height Hauteur du canvas
     */
    height;

    /**
     * @property {CanvasRenderingContext2D} #context Interface indispensable pour dessiner dans le canvas
     */
    #context;

    /**
     * Créé une instance de CanvasElement
     * @param {HTMLCanvasElement} htmlCanvasElement Canvas dans lequel dessiner
     */
    constructor(htmlCanvasElement) {
        this.htmlCanvasElement = htmlCanvasElement;
        this.width = htmlCanvasElement.width;
        this.height = htmlCanvasElement.height;
        this.#context = this.#getContext(htmlCanvasElement);
    }

    /**
     * Fonction permettant d'obtenir l'interface indispensable pour dessiner
     * @param {HTMLCanvasElement} htmlCanvasElement Canvas dans lequel dessiner
     * @returns {CanvasRenderingContext2D} Interface de dessin
     */
    #getContext(htmlCanvasElement) {
        return htmlCanvasElement.getContext("2d");
    }

    /**
     * Fonction permettant d'effacer ce qui est actuellement dessiné dans le canvas
     * @param {number} [x=0] Coordonnée x du rectangle
     * @param {number} [y=0] Coordonnée y du rectangle
     * @param {number} [width=canvas.width] Largeur du rectangle
     * @param {number} [height=canvas.height] Hauteur du rectangle
     */
    clearRect(x= 0, y= 0, width = this.width, height = this.height) {
        this.#context.clearRect(x, y, width, height);
    }

    /**
     * Fonction permettant de dessiner dans le canvas
     * @param {...*} elements Liste d'éléments à dessiner
     */
    drawImage(...elements) {
        this.clearRect();
        for (const element of elements) {
            if (element.canvasImage.positionOfSourceImage === undefined || element.canvasImage.sizeOfSourceImage === undefined) {
                this.#context.drawImage(
                    element.image,
                    element.canvasImage.positionInCanvas.x*this.width,
                    element.canvasImage.positionInCanvas.y*this.height,
                    element.canvasImage.sizeInCanvas.width*this.width,
                    element.canvasImage.sizeInCanvas.height*this.height);
            } else {
                this.#context.drawImage(
                    element.image,
                    element.canvasImage.positionOfSourceImage.x,
                    element.canvasImage.positionOfSourceImage.y,
                    element.canvasImage.sizeOfSourceImage.width,
                    element.canvasImage.sizeOfSourceImage.height,
                    element.canvasImage.positionInCanvas.x*this.width,
                    element.canvasImage.positionInCanvas.y*this.height,
                    element.canvasImage.sizeInCanvas.width*this.width,
                    element.canvasImage.sizeInCanvas.height*this.height);
            }
        }
    }

    /**
     * Fonction permettant d'écrire du texte dans le canvas
     * @param {string} text Texte à écrire
     * @param {string} font Police et taille à utiliser
     * @param {number} x Coordonnée horizontale du texte
     * @param {number} y Coordonnée verticale du texte
     */
    drawText(text, font, x, y) {
        this.#context.font = font;
        this.#context.fillText(text, x*this.width, y*this.height, 0.2*this.width);
    }

    /**
     * Fonction permettant de définir l'image de fond du canvas
     * @param {number} backgroundIndex Indice du fond sélectionné
     */
    setBackgroundImage(backgroundIndex) {
        const backgroundSizes = Array(3).fill("0");
        backgroundSizes[backgroundIndex] = "cover";
        this.htmlCanvasElement.style.backgroundSize = backgroundSizes.join(",");
    }

}
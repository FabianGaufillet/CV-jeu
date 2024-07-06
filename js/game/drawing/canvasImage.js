"use strict";

/** Classe permettant de gérer la taille et la position d'une image dans le canvas */
export class CanvasImage {

    /**
     * @property {Object} #positionInCanvas Coordonnées x et y d'une image dans le canvas
     */
    #positionInCanvas;

    /**
     * @property {Object} #sizeInCanvas Largeur et hauteur d'une image dans le canvas
     */
    #sizeInCanvas;

    /**
     * @property {Object} #positionOfSourceImage Position (x,y) de l'image source
     */
    #positionOfSourceImage;

    /**
     * @property {Object} #sizeOfSourceImage Largeur et hauteur de l'image source
     */
    #sizeOfSourceImage;

    /**
     * Créé une instance de CanvasImage
     * @param {Object} imageData Informations relatives à une image (taille, position)
     */
    constructor(imageData) {
        this.#positionInCanvas = {
            "x":imageData.canvas.x,
            "y":imageData.canvas.y
        };
        this.#sizeInCanvas = {
            "width":imageData.canvas.w,
            "height":imageData.canvas.h
        };
        if (imageData.sourceImage?.x !== undefined && imageData.sourceImage?.y !== undefined) {
            this.#positionOfSourceImage = {
                "x":imageData.sourceImage.x,
                "y":imageData.sourceImage.y
            };
        }
        if (imageData.sourceImage?.w !== undefined && imageData.sourceImage?.h !== undefined) {
            this.#sizeOfSourceImage = {
                "width":imageData.sourceImage.w,
                "height":imageData.sourceImage.h
            };
        }
    }

    /**
     * Retourne les coordonnées d'une image dans le canvas
     * @returns {{top, left, bottom: *, right: *}} Coordonnées de l'image
     */
    coordinates() {
        return {
            "left": this.positionInCanvas["x"],
            "right": this.positionInCanvas["x"] + this.sizeInCanvas["width"],
            "bottom": this.positionInCanvas["y"] + this.sizeInCanvas["height"],
            "top": this.positionInCanvas["y"]
        };
    }

    /**
     * Détermine la nouvelle position d'un élément dans le canvas
     * @param {number} velocityX Déplacement horizontal à effectuer
     * @param {number} velocityY Déplacement vertical à effectuer
     */
    applyVelocity(velocityX, velocityY) {
        this.#positionInCanvas["x"] += velocityX;
        this.#positionInCanvas["y"] += velocityY;

        if (this.#positionInCanvas["x"] + this.#sizeInCanvas["width"] < 0) {
            this.#positionInCanvas["x"] = 1+this.#positionInCanvas["x"];
        } else if (this.#positionInCanvas["x"] >= 1) {
            this.#positionInCanvas["x"] = 0;
        }

        if (this.#positionInCanvas["y"] >= 1) {
            this.#positionInCanvas["y"] = 0;
        }
    }

    /**
     * Met à jour la position et la taille du sprite
     * @param {Object} sourceImage Coordonnées et dimensions du sprite
     */
    updatePositionAndSizeOfSourceImage(sourceImage) {
        this.#positionOfSourceImage = {
            "x":sourceImage["x"],
            "y":sourceImage["y"]
        };
        this.#sizeOfSourceImage = {
            "width":sourceImage["w"],
            "height":sourceImage["h"]
        };
    }

    /**
     * Pour obtenir la position d'une image dans le canvas
     * @returns {Object} Coordonnées de l'image dans le canvas
     */
    get positionInCanvas() {
        return this.#positionInCanvas;
    }

    /**
     * Pour obtenir la taille d'une image dans le canvas
     * @returns {Object} Dimensions d'une image dans le canvas
     */
    get sizeInCanvas() {
        return this.#sizeInCanvas;
    }

    /**
     * Pour obtenir la position du sprite
     * @returns {Object} Coordonnées du sprite
     */
    get positionOfSourceImage() {
        return this.#positionOfSourceImage;
    }

    /**
     * Pour obtenir la taille d'un sprite
     * @returns {Object} Dimensions d'un sprite
     */
    get sizeOfSourceImage() {
        return this.#sizeOfSourceImage;
    }

}
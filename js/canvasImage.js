"use strict";

export class CanvasImage {

    #positionInCanvas;
    #positionOfSourceImage;
    #sizeInCanvas;
    #sizeOfSourceImage;

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

    get positionInCanvas() {
        return this.#positionInCanvas;
    }

    get positionOfSourceImage() {
        return this.#positionOfSourceImage;
    }

    get sizeInCanvas() {
        return this.#sizeInCanvas;
    }

    get sizeOfSourceImage() {
        return this.#sizeOfSourceImage;
    }

    set positionOfSourceImage(position) {
        this.#positionOfSourceImage.x = position.x;
        this.#positionOfSourceImage.y = position.y;
    }

}
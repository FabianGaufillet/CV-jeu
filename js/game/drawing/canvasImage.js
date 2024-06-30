"use strict";

export class CanvasImage {

    #positionInCanvas;
    #sizeInCanvas;
    #positionOfSourceImage;
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

    updatePositionInCanvas(velocityX,velocityY) {
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

    get positionInCanvas() {
        return this.#positionInCanvas;
    }

    set positionInCanvas(position) {
        this.#positionInCanvas = position;
    }

    get sizeInCanvas() {
        return this.#sizeInCanvas;
    }

    get positionOfSourceImage() {
        return this.#positionOfSourceImage;
    }

    get sizeOfSourceImage() {
        return this.#sizeOfSourceImage;
    }

    set sizeOfSourceImage(size) {
        this.#sizeOfSourceImage = size;
    }

}
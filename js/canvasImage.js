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

    updatePositionInCanvas(canvasWidth,canvasHeight,velocityX,velocityY) {
        this.#positionInCanvas["x"] += velocityX*canvasWidth;
        this.#positionInCanvas["y"] += velocityY*canvasHeight;

        if (this.#positionInCanvas["x"] + this.#sizeInCanvas["width"] < 0) {
            this.#positionInCanvas["x"] = canvasWidth+this.#positionInCanvas["x"];
        } else if (this.#positionInCanvas["x"] >= canvasWidth) {
            this.#positionInCanvas["x"] = 0;
        }

        if (this.#positionInCanvas["y"] >= canvasHeight) {
            this.#positionInCanvas["y"] = 0;
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
        this.#positionOfSourceImage = position;
    }

    set positionInCanvas(position) {
        this.#positionInCanvas = position;
    }

}
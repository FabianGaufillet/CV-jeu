"use strict";

export class CanvasImage {

    #src;
    #htmlImageElement;
    #positionInCanvas;
    #positionOfSourceImage;
    #sizeInCanvas;
    #sizeOfSourceImage;
    #sprites;

    constructor(imageData) {
        this.#src = imageData.src;
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
        this.#sprites = imageData.sprites;
    }

    async loadImage() {
        return new Promise((resolve, reject) => {
            this.#htmlImageElement = new Image();
            this.#htmlImageElement.addEventListener("load", resolve);
            this.#htmlImageElement.addEventListener("error", reject);
            this.#htmlImageElement.src = this.#src;
        });
    }

    drawImage(context) {
        if (this.#positionOfSourceImage === undefined || this.#sizeOfSourceImage === undefined) {
            context.drawImage(this.#htmlImageElement,
                              this.#positionInCanvas.x,
                              this.#positionInCanvas.y,
                              this.#sizeInCanvas.width,
                              this.#sizeInCanvas.height);
        } else {
            context.drawImage(this.#htmlImageElement,
                              this.#positionOfSourceImage.x,
                              this.#positionOfSourceImage.y,
                              this.#sizeOfSourceImage.width,
                              this.#sizeOfSourceImage.height,
                              this.#positionInCanvas.x,
                              this.#positionInCanvas.y,
                              this.#sizeInCanvas.width,
                              this.#sizeInCanvas.height);
        }
    }

    set positionOfSourceImage(position) {
        this.#positionOfSourceImage.x = position.x;
        this.#positionOfSourceImage.y = position.y;
    }

    get sprites() {
        return this.#sprites;
    }

}
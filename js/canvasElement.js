"use strict";

export class CanvasElement {

    #width;
    #height;
    #context;

    constructor(htmlCanvasElement) {
        this.#width = htmlCanvasElement.width;
        this.#height = htmlCanvasElement.height;
        this.#context = this.#getContext(htmlCanvasElement);
    }

    #getContext(htmlCanvasElement) {
        return htmlCanvasElement.getContext("2d");
    }

    clearRect() {
        this.#context.clearRect(0, 0, this.#width, this.#height);
    }

    drawImage(element) {
        if (element.canvasImage.positionOfSourceImage === undefined || element.canvasImage.sizeOfSourceImage === undefined) {
            this.#context.drawImage(
                element.image,
                element.canvasImage.positionInCanvas.x,
                element.canvasImage.positionInCanvas.y,
                element.canvasImage.sizeInCanvas.width,
                element.canvasImage.sizeInCanvas.height);
        } else {
            this.#context.drawImage(
                element.image,
                element.canvasImage.positionOfSourceImage.x,
                element.canvasImage.positionOfSourceImage.y,
                element.canvasImage.sizeOfSourceImage.width,
                element.canvasImage.sizeOfSourceImage.height,
                element.canvasImage.positionInCanvas.x,
                element.canvasImage.positionInCanvas.y,
                element.canvasImage.sizeInCanvas.width,
                element.canvasImage.sizeInCanvas.height);
        }
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

}
"use strict";

export class CanvasElement {

    htmlCanvasElement;
    width;
    height;
    #context;

    constructor(htmlCanvasElement) {
        this.htmlCanvasElement = htmlCanvasElement;
        this.width = htmlCanvasElement.width;
        this.height = htmlCanvasElement.height;
        this.#context = this.#getContext(htmlCanvasElement);
    }

    #getContext(htmlCanvasElement) {
        return htmlCanvasElement.getContext("2d");
    }

    clearRect(x= 0, y= 0, width = this.width, height = this.height) {
        this.#context.clearRect(x, y, width, height);
    }

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

}
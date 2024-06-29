"use strict";

export class CanvasElement {

    static width;
    static height;
    #context;

    constructor(htmlCanvasElement) {
        this.#context = this.#getContext(htmlCanvasElement);
    }

    static init({width, height}) {
        this.width = width;
        this.height = height;
    }

    #getContext(htmlCanvasElement) {
        return htmlCanvasElement.getContext("2d");
    }

    clearRect(x= 0, y= 0, width = CanvasElement.width, height = CanvasElement.height) {
        this.#context.clearRect(x, y, width, height);
    }

    drawImage(...elements) {
        this.clearRect();
        for (const element of elements) {
            if (element.canvasImage.positionOfSourceImage === undefined || element.canvasImage.sizeOfSourceImage === undefined) {
                this.#context.drawImage(
                    element.image,
                    element.canvasImage.positionInCanvas.x*CanvasElement.width,
                    element.canvasImage.positionInCanvas.y*CanvasElement.height,
                    element.canvasImage.sizeInCanvas.width*CanvasElement.width,
                    element.canvasImage.sizeInCanvas.height*CanvasElement.height);
            } else {
                this.#context.drawImage(
                    element.image,
                    element.canvasImage.positionOfSourceImage.x,
                    element.canvasImage.positionOfSourceImage.y,
                    element.canvasImage.sizeOfSourceImage.width,
                    element.canvasImage.sizeOfSourceImage.height,
                    element.canvasImage.positionInCanvas.x*CanvasElement.width,
                    element.canvasImage.positionInCanvas.y*CanvasElement.height,
                    element.canvasImage.sizeInCanvas.width*CanvasElement.width,
                    element.canvasImage.sizeInCanvas.height*CanvasElement.height);
            }
        }
    }

}
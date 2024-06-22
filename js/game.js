"use strict";

import {CanvasImage} from "./canvasImage.js";
import {Level} from "./level.js";
import {Character} from "./character.js";
import {Sprite} from "./sprite.js";

export class Game {

    #context;
    #width;
    #height;
    #canvasImages = [];

    constructor(htmlCanvasElement) {
        this.#width = htmlCanvasElement.width;
        this.#height = htmlCanvasElement.height;
        this.#context = this.#getContext(htmlCanvasElement);
    }

    #getContext(htmlCanvasElement) {
        return htmlCanvasElement.getContext("2d");
    }

    initialize(initialGameData) {
        const level = new Level(initialGameData["level"]),
              initialState = initialGameData["player"]["state"],
              player = new Character(initialGameData["player"]["type"],initialState);

        let promises = [];

        level.load().then(() => {
            this.#canvasImages.push(new CanvasImage({
                "src":level["source"],
                "canvas":{
                    "x":0,
                    "y":0,
                    "w":this.#width,
                    "h":this.#height
                }
            }));
            promises.push(this.#canvasImages.at(-1).loadImage());
        });
        player.load()
            .then(() => {
                const initialPositionOfPlayer = level["data"]["player"],
                      moves = player["data"][initialState]["moves"];

                this.#canvasImages.push(new CanvasImage({
                    "src":player["source"],
                    "sprites": new Sprite(player["data"][initialState]["moves"],initialState,0),
                    "sourceImage":{
                        "x":moves[0]["x"],
                        "y":moves[0]["y"],
                        "w":moves[0]["w"],
                        "h":moves[0]["h"]
                    },
                    "canvas":{
                        "x":initialPositionOfPlayer["x"],
                        "y":initialPositionOfPlayer["y"],
                        "w":initialPositionOfPlayer["w"],
                        "h":initialPositionOfPlayer["h"]
                    }
                }));
                promises.push(this.#canvasImages.at(-1).loadImage());
            });
        return Promise.all(promises);
    }

    animate() {
        setInterval(() => {
            this.#context.clearRect(0,0,this.#width, this.#height);
            for (const image of this.#canvasImages) {
                if (image.sprites) {
                    const nextSprite = image.sprites.getNextSprite();
                    image.positionOfSourceImage = {"x":nextSprite["x"],"y":nextSprite["y"]};
                    image.drawImage(this.#context);
                } else {
                    image.drawImage(this.#context);
                }
            }
        },50);
    }

}
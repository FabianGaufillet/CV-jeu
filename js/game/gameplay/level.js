"use strict";

import {ROOT_PATH_DATA_LEVEL, ROOT_PATH_IMAGE_LEVEL, SCORE_REQUIRED_TO_CHANGE_LEVEL} from "./constants.js";
import {Ground} from "./ground.js";

export class Level {

    static currentLevel = 0;
    static nbLevels = 0;
    static scoreToReachForNextLevel = SCORE_REQUIRED_TO_CHANGE_LEVEL;
    #dataFile;
    #ground;

    constructor(name) {
        this.#dataFile = `${ROOT_PATH_DATA_LEVEL}/${name}.json`;
        Level.nbLevels++;
    }

    loadData() {
        return fetch(this.#dataFile)
            .then(res => res.json())
            .then(data => {this.#ground = new Ground(data["ground"]);});
    }

    static levelSelection(score, canvasElement) {
        if (score >= Level.scoreToReachForNextLevel) {
            Level.scoreToReachForNextLevel += SCORE_REQUIRED_TO_CHANGE_LEVEL;
            Level.currentLevel = (Level.currentLevel+1)%Level.nbLevels;
            canvasElement.setBackgroundImage(`${ROOT_PATH_IMAGE_LEVEL}/level${Level.currentLevel}.svg`);
        }
    }

    get ground() {
        return this.#ground;
    }

}
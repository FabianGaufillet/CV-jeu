"use strict";

import {ROOT_PATH_DATA_LEVEL, ROOT_PATH_IMAGE_LEVEL, SCORE_REQUIRED_TO_CHANGE_LEVEL} from "./constants.js";
import {Ground} from "./ground.js";

export class Level {

    static #availableLevels = ["level0","level1"];
    static #allGrounds = {};
    static currentLevel = 0;
    static nbLevels = 0;
    static scoreToReachForNextLevel = SCORE_REQUIRED_TO_CHANGE_LEVEL;
    #levelNumber;

    constructor(levelNumber) {
        this.#levelNumber = levelNumber;
        Level.nbLevels++;
    }

    static loadData(levelName) {
        return fetch(`${ROOT_PATH_DATA_LEVEL}/${levelName}.json`)
            .then(res => res.json())
            .then(data => Level.#allGrounds[levelName] = new Ground(data["ground"]));
    }

    static loadAvailableLevelsData() {
        return this.#availableLevels.map(availableLevel => Level.loadData(availableLevel));
    }

    static levelSelection(score, canvasElement) {
        if (score >= Level.scoreToReachForNextLevel) {
            Level.scoreToReachForNextLevel += SCORE_REQUIRED_TO_CHANGE_LEVEL;
            Level.currentLevel = (Level.currentLevel+1)%Level.nbLevels;
            canvasElement.setBackgroundImage(`${ROOT_PATH_IMAGE_LEVEL}/level${Level.currentLevel}.svg`);
        }
    }

    get ground() {
        return Level.#allGrounds[`level${this.#levelNumber}`];
    }

}
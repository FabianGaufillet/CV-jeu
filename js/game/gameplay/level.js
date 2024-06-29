"use strict";

import {ROOT_PATH_DATA_LEVEL,ROOT_PATH_IMAGE_LEVEL} from "../constants.js";

export class Level {

    #dataFile;
    #imageFile;
    #ground;

    constructor(name) {
        this.#dataFile = `${ROOT_PATH_DATA_LEVEL}${name}.json`;
        this.#imageFile = `${ROOT_PATH_IMAGE_LEVEL}${name}.svg`;
    }

    loadData() {
        return fetch(this.#dataFile)
            .then(res => res.json())
            .then(data => {this.#ground = data["ground"];});
    }

    get ground() {
        return this.#ground;
    }

}
"use strict";

export class Level {

    #path;
    #source;
    #data;

    constructor(name) {
        this.#path = `./data/levels/${name}.json`;
        this.#source = `./images/levels/${name}.svg`;
    }

    async load() {
        return fetch(this.#path)
            .then(res => res.json())
            .then(data => this.#data = data);
    }

    get source() {
        return this.#source;
    }

    get data() {
        return this.#data;
    }

}
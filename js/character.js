"use strict";

export class Character {

    #path;
    #source;
    #data;

    constructor(type,state) {
        this.#path = `./data/characters/${type}.json`;
        this.#source = `./images/characters/${type}/${state.slice(0,-1)}.png`;
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
"use strict";

import {MAX_FALLING_TIME} from "./constants.js";

export class Ground {

    #groundList;

    constructor(groundList) {
        this.#groundList = groundList;
    }

    areCharactersOnGround(...characters) {
        for (const character of characters) {
            character.onGround = this.#isCharacterOnGround(character);
            this.#updateFallingTime(character);
        }
    }

    #isCharacterOnGround(character) {
        const characterPosition = character.canvasImage.positionInCanvas["x"] + character.canvasImage.sizeInCanvas["width"] / 2,
              bottom = character.canvasImage.positionInCanvas["y"] + character.canvasImage.sizeInCanvas["height"];

        for (const ground of this.#groundList) {
            if (characterPosition >= ground["x"] && characterPosition <= ground["x"]+ground["w"]) {
                if (bottom >= ground["y"] && bottom <= ground["y"]+ground["h"]) {
                    const offsetY = ground["y"]+ground["h"] / 2 - (character.canvasImage.sizeInCanvas["height"] + character.canvasImage.positionInCanvas["y"]);
                    character.canvasImage.applyVelocity(0,offsetY);
                    return true;
                }
            }
        }
        return false;
    }

    #updateFallingTime(character) {
        if (character.onGround) character.fallingTime = null;
        else if (character.fallingTime === null) character.fallingTime = Date.now();
        else if (Date.now() - character.fallingTime > MAX_FALLING_TIME) {
            character.canvasImage.applyVelocity(Math.random(),Math.random());
            character.fallingTime = null;
        }
    }

}
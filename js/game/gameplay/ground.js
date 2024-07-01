"use strict";

import {MAX_FALLING_TIME} from "./constants.js";

export class Ground {

    #groundList;
    constructor(groundList) {
        this.#groundList = groundList;
    }

    isCharacterOnGround(...characters) {
        for (const character of characters) {
            const characterPosition = character.canvasImage.positionInCanvas["x"] + character.canvasImage.sizeInCanvas["width"] / 2,
                  bottom = character.canvasImage.positionInCanvas["y"] + character.canvasImage.sizeInCanvas["height"];

            let isCharacterOnGround = false;

            for (const ground of this.#groundList) {
                if (characterPosition >= ground["x"] && characterPosition <= ground["x"]+ground["w"]) {
                    if (bottom >= ground["y"] && bottom <= ground["y"]+ground["h"]) {
                        const offsetY = ground["y"]+ground["h"] / 2 - (character.canvasImage.sizeInCanvas["height"] + character.canvasImage.positionInCanvas["y"]);
                        isCharacterOnGround = true;
                        character.canvasImage.applyVelocity(0,offsetY);
                        break;
                    }
                }
            }
            character.onGround = isCharacterOnGround;
            if (isCharacterOnGround) character.fallingTime = null;
            else if (character.fallingTime === null) character.fallingTime = Date.now();
            else if (Date.now() - character.fallingTime > MAX_FALLING_TIME) {
                character.canvasImage.applyVelocity(Math.random(),Math.random());
                character.fallingTime = null;
            }
        }
    }

}
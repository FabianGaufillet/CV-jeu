"use strict";

export class CollisionHandler {

    #element;
    constructor(element) {
        this.#element = element;
    }

    detectCollision(characters) {

        for (const character of characters) {
            const thisCanvasImage = this.#element.canvasImage,
                  characterCanvasImage = character.canvasImage,
                  thisPositionLeft = thisCanvasImage.positionInCanvas["x"],
                  thisPositionRight = thisCanvasImage.positionInCanvas["x"] + thisCanvasImage.sizeInCanvas["width"],
                  thisPositionY = thisCanvasImage.positionInCanvas["y"] + thisCanvasImage.sizeInCanvas["height"] / 2,
                  characterPositionLeft = characterCanvasImage.positionInCanvas["x"],
                  characterPositionRight = characterCanvasImage.positionInCanvas["x"] + characterCanvasImage.sizeInCanvas["width"],
                  characterPositionBottom = characterCanvasImage.positionInCanvas["y"] + characterCanvasImage.sizeInCanvas["height"],
                  characterPositionTop = characterCanvasImage.positionInCanvas["y"];

            if (this.#element.isDead) {
                this.collisionResolution(character,"");
                continue;
            }
            if (character.isDead) continue;
            if (thisPositionY >= characterPositionTop && thisPositionY <= characterPositionBottom) {
                if (thisPositionLeft >= characterPositionLeft && thisPositionLeft <= characterPositionRight) {
                    this.collisionResolution(character,"L");
                } else if (thisPositionRight >= characterPositionLeft && thisPositionRight <= characterPositionRight) {
                    this.collisionResolution(character,"R");
                }
            } else {
                this.collisionResolution(character,"");
            }
        }
    }

    collisionResolution(character,collisionPositionX) {
        const characterOrientation = character.sprites.currentState.at(-1),
              attackStatus = [`attack${collisionPositionX}`,`jumpAttack${collisionPositionX}`];

        if (!collisionPositionX) {
            if (!character.sprites.currentState.startsWith("walk")) {
                character.updateStateOfCharacter("walk"+characterOrientation);
            }
        } else {
            if (attackStatus.includes(this.#element.sprites.currentState)) {
                character.isDead = true;
                character.updateStateOfCharacter("dead" + characterOrientation);
                character.comeBackToLife("walkR", 5000);
            } else if (collisionPositionX === characterOrientation) {
                if (!character.sprites.currentState.startsWith("walk")) {
                    character.updateStateOfCharacter("walk"+characterOrientation);
                }
            } else if (character.sprites.currentState.startsWith("walk")) {
                character.updateStateOfCharacter("attack"+characterOrientation);
            } else if (character.sprites.currentState.startsWith("attack")) {
                this.#element.isDead = true;
            }
        }

    }

}
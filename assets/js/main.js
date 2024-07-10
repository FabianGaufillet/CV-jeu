import {Menu} from "./game/menu/menu.js";

(function() {
    'use strict';

    /**
     * Fonction permettant d'afficher toutes les compétences d'un seul coup
     */
    function showAllRewards() {
        document.querySelectorAll("div.rewards > i").forEach((item) => {
            item.style.opacity = "1.0";
        });
    }

    /**
     * Fonction permettant de gérer les actions de l'utilisateur sur la modale
     */
    function handleModal() {
        const modal = document.querySelector(".modal"),
             overlay = document.querySelector(".overlay"),
             closeModalBtn = document.querySelector(".btn-close"),
             okModalButton = document.querySelector("section.modal > button.btn");

        [closeModalBtn, overlay, okModalButton].forEach(htmlElement => {
            htmlElement.addEventListener("click", function() {
                const elementsToRemove = document.querySelectorAll("section.modal > :not(button)");
                for (const elementToRemove of elementsToRemove) elementToRemove.remove();
                modal.classList.add("hidden");
                overlay.classList.add("hidden");
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        const htmlCanvasElement = document.querySelector("canvas#game"),
              main = document.querySelector("main"),
              skillsButton = document.querySelector("div.sidebar li:last-of-type");

        new Menu(htmlCanvasElement, main);
        handleModal();
        skillsButton.addEventListener("click", showAllRewards);

    });

})();
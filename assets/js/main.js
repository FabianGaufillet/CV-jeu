import {Menu} from "./game/menu/menu.js";

(function() {
    'use strict';

    function showAllRewards() {
        document.querySelectorAll("div.rewards > i").forEach((item) => {
            item.style.opacity = "1.0";
        });
    }

    function handleModal() {
        const modal = document.querySelector(".modal"),
            overlay = document.querySelector(".overlay"),
            closeModalBtn = document.querySelector(".btn-close"),
            okModalButton = document.querySelector("section.modal > button.btn");

        [closeModalBtn, overlay, okModalButton].forEach(htmlElement => {
            htmlElement.addEventListener("click", function() {
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
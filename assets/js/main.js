import {Menu} from "./game/menu/menu.js";

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const htmlCanvasElement = document.querySelector("canvas#game"),
              main = document.querySelector("main");

        new Menu(htmlCanvasElement, main);
        document.querySelector("div.sidebar li:last-of-type").addEventListener("click", function() {
           document.querySelectorAll("div.rewards > i").forEach((item) => {
               item.style.opacity = "1.0";
           })
        });

    });

})();
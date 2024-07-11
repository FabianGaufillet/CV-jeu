"use strict";

export const AVAILABLE_ENEMIES = ["zombie_female","zombie_male"];
export const DIRECTIONS = ["L","R"];
export const MIN_ENEMIES = 2;
export const MAX_ENEMIES = 5;
export const WIDTH_OF_CHARACTERS_IN_CANVAS = 0.08;
export const HEIGHT_OF_CHARACTERS_IN_CANVAS = 0.12;
export const ROOT_PATH_DATA_CHARACTER = "./assets/data/characters";
export const ROOT_PATH_IMAGE_CHARACTER = "./assets/images/characters";
export const ROOT_PATH_DATA_REWARDS = "./assets/data/rewards"
export const PLAYER_INITIAL_STATE = "idle";
export const ENEMIES_INITIAL_STATE = "walk";
export const GAME_REFRESH_RATE = 30;
export const MAX_FALLING_TIME = 3000;
export const ROOT_PATH_DATA_LEVEL = "./assets/data/levels";
export const SCORE_REQUIRED_TO_CHANGE_LEVEL  = 10;
export const WALK_MAXVELOCITY = 0.005;
export const RUN_MAXVELOCITY = 0.01;
export const FALL_MAXVELOCITY = 0.03;
export const GRAVITY = 0.0025;
export const FRICTION_COEFFICIENT = 0.8;
export const COOLDOWN_BETWEEN_PAUSES = 1000;
export const DELAY_BEFORE_ENEMY_STATE_CHANGE = 5000;
export const PROBABILITY_OF_ENEMY_APPEARANCE = 0.05;
export const DELAY_BEFORE_NEXT_ENEMY_APPEARANCE = 5000;
export const FONT_MESSAGE = "48px sans-serif";
export const PAUSE_MESSAGE = "JEU EN PAUSE";
export const PAUSE_MESSAGE_POSX = 0.25;
export const PAUSE_MESSAGE_POSY = 0.5;
export const SKILL_UNLOCKED_OPACITY = "1";
export const SKILL_LOCKED_OPACITY = "0.1";
export const NB_REWARDS = 14;
export const WIN_MESSAGE = {
    "icon": "fa-solid fa-hands-clapping",
    "head": "FÉLICITATIONS !",
    "body": "Vous avez débloqué toutes les compétences ! Vous pouvez désormais accéder à mon CV ou continuer à jouer."
};
export const RESUME_DESCRIPTION = {
    "icon": "fa-solid fa-user-graduate",
    "head": "INFOS",
    "body": [
        "Salutations ! N'hésitez pas à venir me voir et m'en dire un peu plus sur vous ! Enfin, quand je serai un peu moins occupée avec ces zombies...",
        "Vous avez commencé la programmation avec le C et C++ durant vos études ? Intéressant !",
        "Vous avez poursuivi avec 4 ans de programmation en Fortran 90 durant votre doctorat ! Great Job!",
        "Avant d'enchaîner avec huit années passées en tant que développeur web Full-Stack ! Hum, ça commence à m'intéresser.",
        "Et une formation chez IFOCOP pour enrichir vos connaissances en développement web ! Top !",
        "Je peux télécharger votre CV en cliquant simplement sur le bouton situé à gauche ? J'y vais !"
    ]
};
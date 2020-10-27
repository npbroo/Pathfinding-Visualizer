import Game from './game.js'

let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

const SCREEN_WIDTH = 560;
const SCREEN_HEIGHT = 560;
var paused = true;

//create and initialize game
let game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
game.init(canvas);

window.onload = function() {

    let btn = document.getElementById("play");
    btn.addEventListener("click", play, false);

    btn = document.getElementById("stop");
    btn.addEventListener("click", stop, false);

    btn = document.getElementById("visualize");
    btn.addEventListener("change", visualize, false);

    btn = document.getElementById("diagonals");
    btn.addEventListener("change", diagonals, false);

    btn = btn = document.getElementById("heuristic");
    btn.addEventListener("change", heuristic, false);
}

function play(event) {
    let btn = event.target;
    if (btn.value=="play") {
        pause();
    }
    else if(game.visualize){
        console.log("pause");
        if (paused && game.on) {
            paused = false;
        } else {
            start();
        }
    }
    else {
        start();
    }
}

function start() {
    paused = false;
    game.nodeH.reset();
    game.nodeH.init();
    game.on = true;
    if(game.visualize) {
        game.algorithm.initStepByStep();
    } else {
        game.algorithm.runInstant();
    }
}

function stop() {
    paused = true;
    game.on = false;
    game.algorithm.running = false;
    game.updateTime(0);
    game.nodeH.reset();
    game.nodeH.init();
}

function toggle() {
    console.log("toggle");
    let btn = document.getElementById("play");
    if (btn.value=="play") {
        start();
    } else {
        stop();
    }
}

function pause() {
    paused = true;
}

function visualize(event) {
    switch(event.target.value) {
    case 's':
        game.visualize = true;
        break;
    case 'i':
        game.visualize = false;
        break;
    }
    toggle();
}

function diagonals(event){
   switch(event.target.value) {
    case 'yes':
        game.diagonals = true;
        break;
    case 'no':
        game.diagonals = false;
        break;
    }
    toggle();
}

function heuristic(event) {
    switch(event.target.value) {
        case 'manhattan':
            game.heuristic = 'manhattan';
            break;
        case 'diagonal':
            game.heuristic = 'diagonal';
            break;
        case 'euclidian':
            game.heuristic = 'euclidian';
            break;
    }
    toggle();
}


let lastTime = 0;
function gameLoop(timestamp) {
    lastTime = timestamp;
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    let btn = document.getElementById("play");

    //main game loop
    game.draw(ctx);

    if(game.visualize && game.algorithm.running) {
        if(!paused) {
            btn.value = "play";
            btn.innerHTML = 'Pause';
            game.algorithm.continueStepbyStep();
        } else {
            btn.value = "pause";
            btn.innerHTML = 'Play';
        }
    } else if (!game.algorithm.running) {
        btn.value = "pause";
        btn.innerHTML = 'Play';
    }
    
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);


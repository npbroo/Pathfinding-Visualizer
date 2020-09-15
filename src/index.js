import Game from './game.js'

let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

const SCREEN_WIDTH = 600;
const SCREEN_HEIGHT = 600;

//create and initialize game
let game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
game.init(canvas);

window.onload = function() {
    let btn = document.getElementById("modebtn");
    btn.addEventListener("click", changeMode, false);

    btn = document.getElementById("vizbtn");
    btn.addEventListener("click", visualize, false);

    btn = document.getElementById("diagonals");
    btn.addEventListener("change", diagonals, false);

}

function changeMode() {
    let btn = document.getElementById("modebtn");
    let mode = document.getElementById("mode1");
    if (btn.value=="play") {
        btn.value = "edit";
        mode.innerHTML = 'Mode: Edit';
        reset();
    }
    else {
        console.log("edit");
        btn.value = "play";
        mode.innerHTML = 'Mode: Play';
        start();
    }
}

function start() {
    game.nodeH.reset();
    game.nodeH.init();
    game.on = true;
    if(game.visualize) {
        game.algorithm.initStepByStep();
    } else {
        game.algorithm.runInstant();
    }
}

function reset() {
    game.on = false;
    game.algorithm.running = false;
    game.updateTime(0);
    game.nodeH.reset();
    game.nodeH.init();
}

function visualize() {
    let visBtn = document.getElementById("vizbtn");
    let mode = document.getElementById("mode2");

    if (visBtn.value=="s") {
        visBtn.value = "i";
        mode.innerHTML = 'Visualize: Instant';
        game.visualize = false;
    }
    else {
        visBtn.value = "s";
        mode.innerHTML = 'Visualize: Step-by-step';
        game.visualize = true;
    }

    let btn = document.getElementById("modebtn");
    if (btn.value=="play") {
        start();
    } else {
        reset();
    }
}

function diagonals(event){
    

    if (event.target.checked) {
        game.diagonals = true;
        console.log('diagonals true');
    } else {
        game.diagonals = false;
        console.log('diagonals false');
    }

    let btn = document.getElementById("modebtn");
    if (btn.value=="play") {
        start();
    } else {
        reset();
    }
}


let lastTime = 0;
function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    //main game loop
    game.draw(ctx);

    if(game.visualize && game.algorithm.running) {
        game.algorithm.continueStepbyStep();
    }
    
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);


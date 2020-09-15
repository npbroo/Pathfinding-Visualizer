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
    btn.addEventListener ("click", visualize, false);

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
        game.algorithm.start();
    }
}

function reset() {
    game.on = false;
    game.algorithm.running = false;
    game.nodeH.reset();
    game.nodeH.init();
}

function visualize() {
    let btn = document.getElementById("modebtn");
    let visBtn = document.getElementById("vizbtn");
    let mode = document.getElementById("mode2");

    if (visBtn.value=="s") {
        console.log("instant");
        visBtn.value = "i";
        mode.innerHTML = 'Visualize: Instant';

        game.visualize = false;
        if (btn.value=="play") {
            start();
        } else {
            reset();
        }
    }
    else {
        console.log("step-by-step");
        visBtn.value = "s";
        mode.innerHTML = 'Visualize: Step-by-step';

        game.visualize = true;
        if (btn.value=="play") {
            start();
        } else {
            reset();
        }
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


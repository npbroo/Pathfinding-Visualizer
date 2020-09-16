import InputHandler from './input.js';
import Grid from './grid.js'
import Astar from './algorithms/astar.js';
import NodeHandler from './nodeHandler.js';

export default class Game {
    constructor(screenWidth, screenHeight) {
        this.blockSize = 20;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.gridWidth = screenWidth/this.blockSize;
        this.gridHeight = screenHeight/this.blockSize;
        this.on = false;
        this.visualize = false;
        this.diagonals = true;
        this.heuristic = 'manhattan';
        //this.heuristic = 'diagonal';
        //this.heuristic = 'euclidean';
    }

    init(canvas) {
        this.grid = new Grid(this);

        let startPos = {x:5, y: 15};
        let endPos = {x: 24, y: 15};
        this.nodeH = new NodeHandler(this, startPos, endPos);
        this.nodeH.init();

        this.algorithm = new Astar(this, this.start);
        new InputHandler(this, canvas);

    }

    draw(ctx) {
        this.grid.drawSpaces(ctx);
        this.nodeH.drawNodes(ctx);
    }

    updateTime(elapsed, state) {
        let div = document.getElementById("time");
        let str = '';
        if(!this.visualize) {
            str = 'Elapsed time: ' + elapsed + "(ms)";
        } else {
            str = 'Elapsed time: n/a';
        }
        if (state == 0){
            str += ' - SEARCHING';
        } else if (state == 1) {
            str += ' - SUCCESS';
        } else if (state == 2){
            str += ' - NO SOLUTION';
        } 
        div.innerHTML = str;
    }
}
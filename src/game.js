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
    }

    init(canvas) {
        this.grid = new Grid(this);

        let startPos = {x:5, y: 15};
        let endPos = {x: 24, y: 15};
        this.nodeH = new NodeHandler(this, startPos, endPos);
        this.nodeH.init();

        this.algorithm = new Astar(this);
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
            str = ": " + elapsed + "ms";
        } else {
            str = ': n/a';
        }
        div.innerHTML = str;

        div = document.getElementById("status");
        str = '&nbsp;';
        if (state == 0){
            str += '(SEARCHING)';
            div.style.color = 'black';
        } else if (state == 1) {
            str += '(SUCCESS)';
            div.style.color = 'green';
        } else if (state == 2){
            str += '(NO SOLUTION)';
            div.style.color = 'red';
        } 
        div.innerHTML = str;
        
    }
}
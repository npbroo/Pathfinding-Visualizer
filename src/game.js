import InputHandler from './input.js';
import Grid from './grid.js'
import Node from './node.js'
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

    updateTime(elapsed) {
        let div = document.getElementById("time");
        if(!this.visualize) {
            div.innerHTML = 'Elapsed time: ' + elapsed + "(ms)";
        } else {
            div.innerHTML = 'Elapsed time: n/a';
        }
        
    }
}
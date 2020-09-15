export default class InputHandler {
    
    constructor(game, canvas) {
        this.blockSize = game.blockSize;
        this.activeNode = null;
        this.wallAddMode = false;
        this.wallEraseMode = false;
        this.worldCoords = {};
        
        canvas.addEventListener('pointerdown', (event) => {
            //let wallIndex = null;
            let coords =this.calculateWorldCoords(event, canvas);
            this.worldCoords = coords;
            if(game.nodeH.start.at(coords)) {
                this.activeNode = game.nodeH.start;
                if (game.visualize) game.nodeH.reset();
            } else if (game.nodeH.end.at(coords)) {
                this.activeNode = game.nodeH.end;
                if (game.visualize) game.nodeH.reset();
            } else {
                if (game.grid.isWall(coords)) {
                    //erase a wall
                    this.wallEraseMode = true;
                    game.nodeH.reset();
                    game.grid.removeWall(coords);
                } else if (this.activeNode == null) {
                    //the block is empty, add a wall
                    this.wallAddMode = true;
                    game.nodeH.reset();
                    game.grid.addWall(coords);
                }
            } 
            let node = game.nodeH.nodeAt(coords);
            if (node != null) {
                console.log(node);
            }
        });

        canvas.addEventListener('pointermove', (event) => {
            let coords = this.calculateWorldCoords(event, canvas);
            if(coords !== this.worldCoords) {
                //mouse moved to a new world coordinate
                if (coords.x >= 0 && coords.x < game.gridWidth && 
                    coords.y >= 0 && coords.y < game.gridHeight) { 
                    
                    this.worldCoords = coords;
                    if ( !game.grid.isWall(coords)) {
                        let atStart = game.nodeH.start.at(coords);
                        let atEnd = game.nodeH.end.at(coords);
                        if (this.activeNode === game.nodeH.start && !atEnd) {
                            //move end
                            this.activeNode.pos = coords;
                            game.nodeH.reset();
                            game.nodeH.init();
                            if (game.on && !game.visualize) game.algorithm.start();
                        } else if (this.activeNode === game.nodeH.end && !atStart) {
                            //move start
                            this.activeNode.pos = coords;
                            game.nodeH.reset(); 
                            game.nodeH.init();
                            if (game.on && !game.visualize) game.algorithm.start();
                        } else if (this.wallAddMode && !atEnd && !atStart) {
                            //add wall
                            game.grid.addWall(coords);
                        }
                    } else if (this.wallEraseMode) {
                        //erase wall
                        game.nodeH.reset();
                        game.grid.removeWall(coords);
                    }
                }
            }

        });

        canvas.addEventListener('pointerup', (event) => {
            this.activeNode = null;
            this.wallAddMode = false;
            this.wallEraseMode = false;
            if (game.on) {
                if (game.visualize) {
                    game.algorithm.initStepByStep();
                } else {
                    game.nodeH.reset();
                    game.nodeH.init();
                    game.algorithm.start();
                }
            }
        });

        document.addEventListener('keydown', (event) => {
            //console.log(event.keyCode);
            if(event.keyCode == 32) {
                //reset and start the pathfinder
                console.log("START");
                game.on = true;
                game.nodeH.reset();
                game.nodeH.init();
                game.algorithm.start();
            }
            if(event.keyCode == 13) {
                //reset the pathfinder and dont start
                console.log("RESET");
                game.on = false;
                game.nodeH.reset();
                game.nodeH.init();
            }
        });
    }

    //converts screen coordinates to world coordinates
    calculateWorldCoords(event, canvas) {
        let rect = canvas.getBoundingClientRect();
        let worldCoords = {
            x: parseInt( (event.x - rect.left) /this.blockSize), 
            y: parseInt( (event.y - rect.top) /this.blockSize)
        };
        return worldCoords;
    }
}
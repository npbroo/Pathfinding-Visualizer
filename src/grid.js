class Wall {
    constructor(game, pos) {
        this.pos = {x: pos.x, y: pos.y};
        this.blockSize = game.blockSize;
    }

    draw(ctx) {
        ctx.fillRect(this.pos.x * this.blockSize, this.pos.y * this.blockSize, this.blockSize, this.blockSize);
    }

    at(pos) {
        if(pos.x == this.pos.x && pos.y ==this.pos.y) {
            return true;
        }
        return false;
    }
}

export default class Grid {
    constructor(game) {
        this.game = game;
        this.size = game.blockSize;
        this.width = game.gridWidth;
        this.height = game.gridHeight;
        this.grid = {};
    }

    drawSpaces(ctx) {
        for(let x = 0; x<this.width; x++) {
            for(let y = 0; y<this.height; y++) {
                if (x+'_'+y in this.grid) {
                    ctx.fillStyle = "gray"; 
                    this.grid[x+'_'+y].draw(ctx);
                } else {
                    ctx.strokeRect(x*this.size, y*this.size, this.size, this.size);
                }
            }
        }
    }

    isWall(pos) {
        return pos.x+'_'+pos.y in this.grid; 
    }

    addWall(pos) {
        this.grid[pos.x+'_'+pos.y] = new Wall(this.game, pos);
    }

    removeWall(pos) {
        delete this.grid[pos.x+'_'+pos.y];
    }

    update() {

    }
}
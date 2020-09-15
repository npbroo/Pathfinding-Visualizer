export default class Node {

    constructor(game, id, position) {
        this.game = game;
        this.blockSize = game.blockSize;
        this.id = id;
        this.position = position;
        this.parent = null;
    }

    initNode(g, h, parent) {
        this.g = g;
        this.h = h;
        this.f = g + h;
        this.parent = parent;
    }

    updateNode(g, parent) {
        this.g = g;
        this.f = g + this.h;
        this.parent = parent;
    }

    //draws the object stored in node
    draw(ctx) {  
        ctx.fillRect(this.position.x * this.blockSize, this.position.y * this.blockSize, this.blockSize, this.blockSize);
    }

    //checks if the node is at the coordinates
    at(position) {
        if(position.x == this.position.x && position.y ==this.position.y) {
            return true;
        }
        return false;
    }
}
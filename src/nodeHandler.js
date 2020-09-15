class Node {
    constructor(g, h, parent, pos) {
        this.g = g;
        this.h = h;
        this.f = g + h;
        this.parent = parent;
        this.pos = {x: pos.x, y: pos.y};
        this.closed = false;
        this.start = false;
        this.end = false;
        this.path = false;
    }

    draw(ctx, blockSize) {  
        ctx.fillRect(this.pos.x * blockSize, this.pos.y * blockSize, blockSize, blockSize);
    }

    
    at(pos) {
        return (pos.x == this.pos.x && pos.y ==this.pos.y)
    }

    updateNode(g, parent) {
        this.g = g;
        this.f = this.g + this.h;
        this.parent = parent;
    }
}

export default class NodeHandler {
    constructor(game, startPos, endPos) {
        this.game = game;
        this.blockSize = game.blockSize;
        this.start = new Node(0,0,null,startPos);
        this.end = new Node(0,0,null,endPos);
        this.end.end = true;
        this.start.start = true;
        this.open = [];
        this.nodeGrid = {};
    }

    init() {
        this.open.push(this.start);
        this.nodeGrid[this.start.pos.x+'_'+this.start.pos.y] = this.start;
        this.nodeGrid[this.end.pos.x+'_'+this.end.pos.y] = this.end;
    }

    drawNodes(ctx) {
        for(var key in this.nodeGrid) {
            let node = this.nodeGrid[key];
            if (node.start) {
                ctx.fillStyle = "green";
                node.draw(ctx, this.blockSize);
            } else if (node.end) {
                ctx.fillStyle = "red";
                node.draw(ctx, this.blockSize);
            } else if (node.path) {
                ctx.fillStyle = "blue";
                node.draw(ctx, this.blockSize);
            } else if (node.closed) {
                ctx.fillStyle = "orange";
                node.draw(ctx, this.blockSize);
            } else {
                ctx.fillStyle = "yellow";
                node.draw(ctx, this.blockSize);
            }
        }
    }

    //add a node to the position with g, h, and parent values
    addOpen(g, h, parent, pos) {
        //the open list is priority queued
        let node = new Node(g,h,parent,pos);
        this.insert(node);
        this.nodeGrid[node.pos.x+'_'+node.pos.y] = node;
    }

    //re-parenting a node
    reparent(node, g, parent) {
        let element = null;
        
        let i = 0;
        for (var n of this.open) {
            if (n.pos.x == node.pos.x && n.pos.y == node.pos.y) {
                element = this.open.splice(i,1);
                break;
            }
            i++;
        }
        node.updateNode(g, parent);
        this.insert(node);

    }

    insert(node) {
        let i = 0;
        if(this.open.length) {
            while(i < this.open.length) {
                if (this.open[i].f >= node.f) {
                    this.open.splice(i,0,node);
                    break;
                }
                i++;
            }
            if (i == this.open.length) {
                this.open.push(node);
            }
        } else {
            this.open.push(node);
        }
    }

    //pop the node with the smallest f value on the open list
    popSmallestF() {
        if(this.open.length) {
            let node = this.open.shift();
            return node;
        }
        return null;
    }

    //pushes the node to the closed list
    pushToClosed(node) {
        node.closed = true;
    }

    //checks position to see if it holds a node
    nodeAt(pos) {
        if (pos.x+'_'+pos.y in this.nodeGrid) {
            return this.nodeGrid[pos.x+'_'+pos.y];
        }
        else return null;
    }

    //clears the nodes
    reset() {
        this.open = [this.start];
        this.nodeGrid = {};
        this.nodeGrid[this.start.pos.x+'_'+this.start.pos.y] = this.start;
        this.nodeGrid[this.end.pos.x+'_'+this.end.pos.y] = this.end;
    }


}
export default class Astar {
    constructor(game, startNode) {
        this.game = game;
        this.nodeH = game.nodeH;
        this.running = false;
    }

    initStepByStep() {
        this.running = true;
        this.game.updateTime(0,0);
    }

    continueStepbyStep() {
        if(this.nodeH.open.length) {
            if (this.running) {
                //find node with the smallest f on the open list
                let node = this.nodeH.popSmallestF();
                //push the node to the closed list
                this.nodeH.pushToClosed(node);
                //generate successors
                this.genChildren(node);
            }
        } else {
            this.running = false;
            this.game.updateTime(0, 2);
        }
    }

    runInstant() {
        this.running = true;
        this.time = new Date().getTime();
        while(this.nodeH.open.length && this.running) {
            //find node with the smallest f on the open list
            let node = this.nodeH.popSmallestF();
            //push the node to the closed list
            this.nodeH.pushToClosed(node);
            //generate successors
            this.genChildren(node);
        }
        if(!this.nodeH.open.length) {
            this.running = false;
            let elapsed = new Date().getTime() - this.time;
            this.game.updateTime(elapsed, 2);
        }
    }

    genChildren(node) {
        let vectors = {
            north: {x: 0, y: -1, g: 1},
            south: {x: 0, y: 1, g: 1},
            east: {x: 1, y: 0, g: 1},
            west: {x: -1, y: 0, g: 1},
        };
        let vectorsDiag = {
            northeast: {x: 1, y: -1, g: 1.4},
            southwest: {x: -1, y: 1, g: 1.4},
            northwest: {x: -1, y: -1, g: 1.4},
            southeast: {x: 1, y: 1, g: 1.4},
        }
        for(let dir in vectors) {
            this.genChild(node, vectors[dir]);
        }
        if(this.game.diagonals) {
            for(let dir in vectorsDiag) {
                this.genChild(node, vectorsDiag[dir]);
            }
        }
    }

    genChild(node, v) {
        let pos = {x: node.pos.x + v.x, y: node.pos.y + v.y};
        let g = node.g + v.g;

        if (this.inBounds(pos)) {
            let isWall = this.game.grid.isWall(pos);
            if (!isWall) {
                let nodeAtPos = this.nodeH.nodeAt(pos);
                if (nodeAtPos == null) {
                    //check diagonal parity
                    if (this.game.diagonals) {
                        if (pos.x != node.pos.x && pos.y != node.pos.y) {
                            if (this.game.grid.isWall({x: pos.x, y: node.pos.y}) && 
                                this.game.grid.isWall({x: node.pos.x, y: pos.y})) {
                            return;
                            }
                        }
                    }
                    //calculate h heuristic (manhattan)
                    let h = this.calculateH(pos);
                    //= Math.abs(pos.x - this.nodeH.end.pos.x) + Math.abs(pos.y - this.nodeH.end.pos.y);
                    //add it to the open list
                    this.nodeH.addOpen(g, h, node, pos);
                    
                } else if (nodeAtPos.end) {
                    if (pos.x != node.pos.x && pos.y != node.pos.y) {
                        if (this.game.grid.isWall({x: pos.x, y: node.pos.y}) && 
                            this.game.grid.isWall({x: node.pos.x, y: pos.y})) {
                          return;
                        }
                    }
                    this.tracePath(node);
                    return;
                } else if (!nodeAtPos.closed){
                    if (nodeAtPos.g > g) {
                        this.nodeH.reparent(nodeAtPos, g, node);
                    } 
                    return;
                }
            }
        }
    }

    calculateH(pos) {
        if (this.game.heuristic == 'manhattan') {
            return Math.abs(pos.x - this.nodeH.end.pos.x) + Math.abs(pos.y - this.nodeH.end.pos.y);
        } else if (this.game.heuristic == 'diagonal') {
            return Math.max(Math.abs(pos.x - this.nodeH.end.pos.x), Math.abs(pos.y - this.nodeH.end.pos.y));
        } else if (this.game.heuristic == 'euclidean') {
            return Math.sqrt(Math.pow(pos.x - this.nodeH.end.pos.x, 2) + Math.pow(pos.y - this.nodeH.end.pos.y, 2));
        }
    }

    //traces the path back
    tracePath(node) {
        console.log('END FOUND!');
        while(node.start != true) {
            node.path = true;
            node = node.parent;
        }
        this.running = false;
        let elapsed = new Date().getTime() - this.time;
        this.game.updateTime(elapsed, 1);
        console.log('elapsed time: ' + elapsed/1000 + "(seconds)");
        console.log('elapsed time: ' + elapsed + "(ms)");
    }

    //test if a positon is in bounds
    inBounds(pos) {
        if (pos.x >= 0 && pos.x < this.game.gridWidth && 
            pos.y >= 0 && pos.y < this.game.gridHeight) { 
            return true;
        }
        return false;
    }
}

// addding additional method to finding out shortest path using A* algoritms
var visitedNodesInOrder = [];
var nodesInShortestPathOrder = [];
var dest_row, dest_col;
var unvisitedNodes = [];

export function astar(grid, start_node, end_node) {
  // Handle any weird edge cases

  unvisitedNodes = getAllNodes(grid);
  start_node.distance = 0;

  while (unvisitedNodes.length !== 0) {
    sortNodesByDistance(unvisitedNodes);
    // Removes the first node and gives it to us
    const closestNode = unvisitedNodes.shift();
    closestNode.isVisited = true;
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // We must be trapped and should therefore stop.
    if (closestNode.distance === 1000000000) return visitedNodesInOrder;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === end_node) return visitedNodesInOrder;

    updateNeighbors(closestNode, grid);
  }
  return visitedNodesInOrder;
}

function get_euclid_distance(x1, y1, x2, y2) {
  var v1 = Math.pow(x1 - x2, 2);
  v1 = v1 * v1;
  var v2 = Math.pow(y1 - y2, 2);
  v2 = v2 * v2;
  return Math.pow(v1 + v2, 0.5);
}

/* the difference between  A* and dijkstra's
 Here we sort based on a function f=g+h, where,
 g - distance with which we reach the neighbor node
 h - the heurestic/ prediction/ possible amount of moves to reach target
 this heurestic can be say euclidean distance, or manhattan distance  
*/

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => {
    return (
      nodeA.distance +
      get_euclid_distance(nodeA.row, nodeA.col, dest_row, dest_col) -
      (nodeB.distance +
        get_euclid_distance(nodeB.row, nodeB.col, dest_row, dest_col))
    );
  });
}

function updateNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const nodes of unvisitedNeighbors) {
    nodes.distance = node.distance + 1;
    nodes.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  //We are only concerned about the unvisited neighbors
  return neighbors.filter((node) => !node.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function solve_astar(grid, start_node, end_node) {
  visitedNodesInOrder = [];
  nodesInShortestPathOrder = [];
  dest_row = end_node.row;
  dest_col = end_node.col;
  return astar(grid, start_node, end_node);
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrderASTAR(finishNode) {
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
  // it will return the array of nodes leading towards shortest path
}

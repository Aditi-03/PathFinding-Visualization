"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aStar = void 0;

var _utility = require("/src/utility.js");

var _script = require("./script.js");

//Invoked when start visualizing is 'CLICKED'
//Get the start and end node
var getSpecialNodes = function getSpecialNodes() {
  var copy_start = null;
  var copy_end = null;

  for (var r = 0; r < _script.totalRows; r++) {
    for (var c = 0; c < _script.totalCols; c++) {
      if (_script.gridArray[r][c].status === "start" && _script.gridArray[r][c].isClass === "start") {
        copy_start = _script.gridArray[r][c];
      } else if (_script.gridArray[r][c].status === "end" && _script.gridArray[r][c].isClass === "end") {
        copy_end = _script.gridArray[r][c];
      }
    }
  }

  var valid_buttons = [copy_start, copy_end];
  return valid_buttons;
};

function getNeighbours(currNode) {
  var r = currNode.row;
  var c = currNode.col;
  var relevantStatuses = ["start", "wall", "visited"];
  var actual_neighbours = [];
  var neighbours = [];

  if (r - 1 >= 0) {
    neighbours.push(_script.gridArray[r - 1][c]);

    if (c - 1 >= 0) {
      if (_script.gridArray[r - 1][c].status !== "wall" && _script.gridArray[r][c - 1].status !== "wall") neighbours.push(_script.gridArray[r - 1][c - 1]);
    }

    if (c + 1 <= _script.totalCols - 1) {
      if (_script.gridArray[r - 1][c].status !== "wall" && _script.gridArray[r][c + 1].status !== "wall") neighbours.push(_script.gridArray[r - 1][c + 1]);
    }
  }

  if (r + 1 <= _script.totalRows - 1) {
    neighbours.push(_script.gridArray[r + 1][c]);

    if (c - 1 >= 0) {
      if (_script.gridArray[r + 1][c - 1].status !== "wall" && _script.gridArray[r + 1][c].status !== "wall") {
        neighbours.push(_script.gridArray[r + 1][c - 1]);
      }

      neighbours.push(_script.gridArray[r][c - 1]);
    }

    if (c + 1 <= _script.totalCols - 1) {
      if (_script.gridArray[r][c + 1].status !== "wall" && _script.gridArray[r + 1][c].status !== "wall") {
        neighbours.push(_script.gridArray[r + 1][c + 1]);
      }

      neighbours.push(_script.gridArray[r][c + 1]);
    }
  }

  neighbours.forEach(function (neighbour) {
    if (!relevantStatuses.includes(neighbour.status)) {
      actual_neighbours.push(neighbour);
    }
  });
  return actual_neighbours;
}

function updateNeighbours(neighbours, currNode, algo, startNode, endNode) {
  if (algo === "aStar") {
    neighbours.forEach(function (neighbour) {
      var newGCost = neighbour.weight + currNode.g; // if (newGCost < neighbour.g) {
      //   neighbour.g = newGCost;
      //   neighbour.parent = currNode;
      // }

      var estimation_cost = getDistance(neighbour, endNode);
      var newCost = newGCost + estimation_cost;

      if (newCost < neighbour.f) {
        neighbour.g = newGCost;
        neighbour.f = newCost;
        neighbour.h = estimation_cost;
        neighbour.parent = currNode;
      }
    });
  }
} //Astar Algorithm


function getDistance(nodeA, nodeB) {
  var dx = Math.abs(nodeA.row - nodeB.row);
  var dy = Math.abs(nodeA.col - nodeB.col);

  if (dx > dy) {
    //Better results than using sqrt(2) and 1
    return 14 * dy + 10 * (dx - dy);
  }

  return 14 * dx + 10 * (dy - dx); //return dx + dy;
}

function backtrack(startNode, endNode, nodesToAnimate) {
  nodesToAnimate.push(endNode);
  var currNode = new _script.Node();
  currNode = endNode.parent;

  while (currNode !== startNode) {
    nodesToAnimate.push(currNode);
    currNode.status = "shortest";
    var element = document.getElementById(currNode.id);
    element.className = "shortest";
    currNode = currNode.parent;
  }

  nodesToAnimate.push(startNode);
  nodesToAnimate.reverse();
  return nodesToAnimate;
}

var aStar = function aStar(nodesToAnimate) {
  //Get the startNode and the endNode
  var specialNodes = getSpecialNodes();
  var startNode = specialNodes[0];
  var endNode = specialNodes[1]; //Make a min heap to keep track of nodes with lowest f
  //UnvisitedNodes array

  var openList = new _utility.minHeap();
  var visitedNodesInOrder = []; //Update the distances of startNode
  //Distance of startNode from startNode

  startNode.g = 0;
  startNode.h = getDistance(startNode, endNode); //Considering directions as only four

  startNode.f = startNode.g + startNode.h; //Push start node in the open List

  openList.push([startNode.f, startNode]); //nodesToAnimate.push([startNode, "searching"]);

  while (!openList.isEmpty()) {
    //The node having the lowest f value
    var currNode = new _script.Node();
    var currArr = openList.getMin();
    currNode = currArr[1]; //nodesToAnimate.push([currNode, "searching"]);

    visitedNodesInOrder.push(currNode); //Check if the endNode

    if (currNode === endNode) {
      return backtrack(startNode, endNode, nodesToAnimate);
    }

    if (currNode !== startNode) {
      currNode.status = "visited";
    } //get element


    var element = document.getElementById(currNode.id);

    if (element.className !== "start" && element.className !== "end") {
      element.className = "visited";
    } //nodesToAnimate.push([currNode, "visited"]);


    var neighbours = getNeighbours(currNode, _script.gridArray);
    updateNeighbours(neighbours, currNode, "aStar", startNode, endNode);

    for (var i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i]; // if (!openList.includes(neighbour)) {

      openList.push([neighbour.f, neighbour]); // }
    }
  }

  alert("No Path Exists");
  return;
};

exports.aStar = aStar;
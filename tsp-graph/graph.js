/* eslint-disable no-plusplus */

class Graph {
  constructor() {
    this.numberOfNodes = 0;
    this.numberOfEdges = 0;
    this.nodes = [];
    this.edges = {};
    this.cost = {};
  }
  /* Adds an oriented edge from node1 --> node2 */

  addEdge(node1, node2) {
    if (this.edges[node1.index] == null) {
      this.edges[node1.index] = [];
    }
    this.edges[node1.index].push(node2);
    this.cost[JSON.stringify({
      start: node1.index,
      end: node2.index
    })] = node2.cost;
  }

  getCost(index1, index2) {
    return this.cost[JSON.stringify({
      start: index1,
      end: index2
    })];
  }

  getCostPath(path) {
    let cost = 0;
    for (let i = 0; i < path.length - 1; i++) {
      cost += this.getCost(path[i], path[i + 1]);
    }
    return cost;
  }
}

module.exports = Graph;

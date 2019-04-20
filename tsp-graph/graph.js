/* eslint-disable no-plusplus */

class Graph {
  constructor() {
    this.numberOfNodes = 0;
    this.numberOfEdges = 0;
    this.nodes = [];
    this.edges = {};
  }
  /* Adds an oriented edge from node1 --> node2 */

  addEdge(node1, node2) {
    if (this.edges[node1.index] == null) {
      this.edges[node1.index] = [];
    }
    this.edges[node1.index].push(node2);
  }
}

module.exports = Graph;

class Graph {
  constructor(numberOfNodes, adjacencyList) {
    this.numberOfNodes = numberOfNodes;
    this.adjacencyList = adjacencyList;
  }
  /* Adds an oriented edge from node1 --> node2 */

  addEdge(node1, node2) {
    this.adjacencyList.get(node1.index).push(node2);
  }
}

module.exports = Graph;

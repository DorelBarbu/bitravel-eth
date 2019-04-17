import Node from './Node';

interface Graph {
  numberOfNodes: Number,
  adjacencyList: Map<Number,Node[]>
}

class Graph {
  constructor(numberOfNodes: Number, adjacencyList: Map<Number,Node[]> | null) {
    this.numberOfNodes = numberOfNodes;
    this.adjacencyList = adjacencyList;
  }
  /* Adds an oriented edge from node1 --> node2 */
  addEdge(node1: Node, node2: Node) {
    this.adjacencyList.get(node1.index).push(node2);
  }
}

export default Graph;

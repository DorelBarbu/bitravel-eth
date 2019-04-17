interface Node {
  index: Number,
  source: String,
  destination: String,
  cost: Number
}

class Node {
  constructor(index: Number, source: String, destination: String, cost: Number) {
    this.index = index;
    this.source = source;
    this.destination = destination;
    this.cost = cost;
  }
}

export default Node;

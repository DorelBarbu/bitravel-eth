class Node {
  constructor(index, location, cost = 0) {
    this.index = index;
    this.location = location;
    this.cost = cost;
  }
}

module.exports = Node;

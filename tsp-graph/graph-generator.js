/* eslint-disable no-plusplus */
const Graph = require('./graph');
const Node = require('./node');
// const Logger = require('../logger');

const generateGraph = cities => {
  const graph = new Graph();
  const numberOfCities = cities.length;
  let cost = 1000000;
  for (let i = 1; i <= numberOfCities; i++) {
    const newNode1 = new Node(i, cities[i - 1], cost);
    for (let j = 1; j <= numberOfCities; j++) {
      if (i !== j) {
        // Logger.msg(`${i} ${j} ${cost}`);
        const newNode2 = new Node(j, cities[j - 1], cost);
        cost -= 10;
        graph.addEdge(newNode1, newNode2);
        // cost += 10;
        graph.addEdge(newNode2, newNode1);
      }
    }
  }
  return graph;
};

module.exports = generateGraph;

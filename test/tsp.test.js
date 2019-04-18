const mocha = require('mocha');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const Logger = require('../logger');
const Graph = require('../tsp-graph/graph.js');
const Node = require('../tsp-graph/node');

const web3 = new Web3(ganache.provider());

const compiledFactoryContractPath = path.resolve(
  'build',
  'TSPInstanceFactory.json'
);
const compiledFactoryContract = JSON.parse(
  fs.readFileSync(compiledFactoryContractPath, 'utf8')
);

const compiledTSPPath = path.resolve('build', 'TSPInstance.json');
const compiledTSPContract = JSON.parse(
  fs.readFileSync(compiledTSPPath, 'utf8')
);

/* The deployed tsp factory contracts */
let tspFactory;
/* The deployed tsp contract */
let tsp;
/* A list of all the accounts available */
let accounts;
/* The address of the tsp instance */
let tspInstanceAddress;

mocha.beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  // const { bytecode, interface } = compiledFactoryContract;
  try {
    /* Deploy a factory contract */
    let interf = compiledFactoryContract.interface;
    let { bytecode } = compiledFactoryContract;
    tspFactory = await new web3.eth.Contract(JSON.parse(interf))
      .deploy({ data: bytecode })
      .send({ from: accounts[0], gas: '1000000' });
    /* Deploy a contract using the factory contract */
    await tspFactory.methods.createTSPInstance(12, 'mognodbid').send({
      from: accounts[0],
      gas: '1000000'
    });
    /* Get the deployed campaigns */
    [
      tspInstanceAddress
    ] = await tspFactory.methods.getDeployedTSPInstances().call();
    /* Deploy a tsp contract */
    interf = compiledTSPContract.interface;
    // eslint-disable-next-line prefer-destructuring
    bytecode = compiledTSPContract.bytecode;
    tsp = await new web3.eth.Contract(JSON.parse(interf), tspInstanceAddress);
  } catch (err) {
    Logger.err('Error deploying TSP contract');
    Logger.msg(err);
  }
});

mocha.describe('TSPFactoryInstance contract', () => {
  /* Tests to see if creating a factory contract is successful */
  mocha.it('Deploys a TSPInstanceFactory contract', () => {
    assert.ok(tspFactory.options.address);
  });
  /* Tests to see if we can successfully deploy a TSPInstance */
  mocha.it('Deploys a TSPInstance contract', () => {
    assert.ok(tsp.options.address);
  });
  /* Tests to see if we can successfully deploy a TSPInstance contract using TSPInstanceFactory */
  mocha.it('Deploys using TSPFactory', () => {
    assert.equal(tsp.options.address, tspInstanceAddress);
  });
});

mocha.describe('Graph class test', () => {
  mocha.it('Creates a node', () => {
    const newNode = new Node(1, 'Bucharest', 'Milano', 10);
    assert.ok(newNode);
  });
  mocha.it('Creates a graph', () => {
    const cities = ['Bucharest', 'Rome', 'Milano'];
    const numberOfCities = cities.length;
    let index = 0;
    let cost = 0;
    for (let i = 0; i < numberOfCities; i++) {
      for (let j = i + 1; j < numberOfCities; j++) {}
    }
  });
});

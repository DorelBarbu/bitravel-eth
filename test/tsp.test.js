/* eslint-disable no-plusplus */
const mocha = require('mocha');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/routes/router');
const Logger = require('../logger');
const Graph = require('../tsp-graph/graph');
const Node = require('../tsp-graph/node');
const web3 = require('../src/utils/web3');

// Configure chai
chai.use(chaiHttp);
chai.should();

const compiledFactoryContractPath = path.resolve('build', 'TSPInstanceFactory.json');
const compiledFactoryContract = JSON.parse(fs.readFileSync(compiledFactoryContractPath, 'utf8'));

const compiledTSPPath = path.resolve('build', 'TSPInstance.json');
const compiledTSPContract = JSON.parse(fs.readFileSync(compiledTSPPath, 'utf8'));

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
    [tspInstanceAddress] = await tspFactory.methods.getDeployedTSPInstances().call();
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
    const graph = new Graph();
    assert.equal(graph.numberOfNodes, 0);
    assert.equal(graph.numberOfEdges, 0);
    const cities = [
      'Bucharest',
      'Rome',
      'Milano',
      'Amsterdam',
      'Viena',
      'Madrid',
      'Venezia',
      'Cluj'
    ];
    const numberOfCities = cities.length;
    let index = 0;
    let cost = 10;
    for (let i = 0; i < numberOfCities; i++) {
      const newNode1 = new Node(index, cities[i]);
      index++;
      for (let j = 0; j < numberOfCities; j++) {
        if (i !== j) {
          const newNode2 = new Node(index, cities[j], cost);
          index++;
          cost += 10;
          graph.addEdge(newNode1, newNode2);
        }
      }
    }
    let distinctNodes = 0;
    for (const node in graph.edges) {
      distinctNodes++;
      assert.equal(graph.edges[node].length, numberOfCities - 1);
    }
    assert.equal(distinctNodes, numberOfCities);
  });
});

mocha.describe('/account', () => {
  mocha.it('Retrieves accounts', async () => {
    try {
      const resp = await chai.request(app).get('/account');
      assert.ok(resp.body.data.accounts);
    } catch (err) {
      assert(false);
    }
  });
});

mocha.describe('/contract/factory', () => {
  mocha.it('Deploys a factory contract', async () => {
    const acc = (await chai.request(app).get('/account')).body.data.accounts;
    try {
      const resp = await chai.request(app).post('/contract/factory').send({
        account: acc[0],
        gas: '1000000'
      });
      assert.ok(resp.body.isError === false);
    } catch (err) {
      assert.ok(false);
    }
  });

  mocha.it('Deploys a TSP contract', async () => {
    const resp = await chai.request(app).post(`/contract/factory/${tspFactory.options.address}`).send({
      account: accounts[0],
      gas: '1000000',
      mongodbAddress: 'somemongodbaddress',
      size: 10
    });
    assert.ok(resp.body.isError === false);
  });

  mocha.it('Retrieves deployed instances', async () => {
    const factoryAddress = tspFactory.options.address;
    const resp = await chai.request(app).get(`/contract/factory/${factoryAddress}/deployed`);
    assert.ok(resp.body.isError === false);
  });
});

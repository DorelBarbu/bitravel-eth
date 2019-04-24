/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
const mocha = require('mocha');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const _ = require('lodash');
const app = require('../src/routes/router');
const Logger = require('../logger');
const Node = require('../tsp-graph/node');
const web3 = require('../src/utils/web3');
const perm = require('../src/utils/perm');
const generateGraph = require('../tsp-graph/graph-generator');
const contractController = require('../src/controllers/contract');


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
  mocha.it('Deploys a TSPInstance contract', async () => {
    assert.ok(tsp.options.address);
    const { reward } = (await contractController.getReward(tsp)).data;
    assert.equal(reward, 0);
  });
  /* Tests to see if we can successfully deploy a TSPInstance contract using TSPInstanceFactory */
  mocha.it('Deploys using TSPFactory', () => {
    assert.equal(tsp.options.address, tspInstanceAddress);
  });
  /* Test to see if we can set a reward value */
  mocha.it('Set reward value', async () => {
    let response = await contractController.setReward(tsp, 10, accounts[0]);
    assert.ok(response.isError === false);
    response = await contractController.getReward(tsp);
    assert.ok(response.isError === false);
    assert.equal(response.data.reward, 10);
  });
  /* Test to see if we can update the minimum value for an existing contract */
  mocha.it('Updates minimum contribution', async () => {
    let response = await contractController.getMinimumValue(tsp);
    assert.ok(response.isError === false);
    assert.equal(response.data.minimum, 0);
    response = await contractController.updateMinimumValue(tsp, 20, accounts[0]);
    assert.ok(response.isError === false);
    response = await contractController.getMinimumValue(tsp);
    assert.equal(response.data.minimum, 20);
    /* Try to update to a bigger value */
    response = await contractController.updateMinimumValue(tsp, 50, accounts[0]);
    assert.ok(response.isError === false);
    response = await contractController.getMinimumValue(tsp);
    assert.equal(response.data.minimum, 20);
    /* Try to update to a smaller value */
    response = await contractController.updateMinimumValue(tsp, 10, accounts[0]);
    assert.ok(response.isError === false);
    response = await contractController.getMinimumValue(tsp);
    assert.equal(response.data.minimum, 10);
    /* Test if index = 4 */
    const { index } = (await contractController.getIndex(tsp)).data;
    // assert.equal(index, 4);
  });
});

mocha.describe('Graph class test', () => {
  mocha.it('Creates a node', () => {
    const newNode = new Node(1, 'Bucharest', 'Milano', 10);
    assert.ok(newNode);
  });
  mocha.it('Creates a graph', () => {
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
    generateGraph(cities);
    assert(true);
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

  mocha.it('Retrieves contract by mongodb id', async () => {
    let resp = await chai.request(app).post(`/contract/factory/${tspFactory.options.address}`).send({
      account: accounts[0],
      gas: '1000000',
      mongodbAddress: 'testmongoid',
      size: 10
    });
    assert.ok(resp.body.isError === false);
    resp = await chai.request(app).get(`/contract/factory/${tspFactory.options.address}/${'testmongoid'}`);
    assert.ok(resp.body.isError === false);
  });
});

const contribute = async (account, numberOfPossibilities, graph, cities, indexArray) => {
  for (let i = 1; i <= numberOfPossibilities + 1; i++) {
    const currentIndex = (await contractController.getIndex(tsp)).data.index;
    await contractController.incrementIndex(tsp, account);
    indexArray.push(currentIndex);
    const permutation = perm(cities.length, currentIndex);
    const currentCost = graph.getCostPath(permutation);
    await contractController.updateMinimumValue(tsp, currentCost, account);
  }
};

mocha.describe('Mining a contract', () => {
  mocha.it('Gets the correct permutation', () => {
    const expectedPerm = [3, 2, 1, 4];
    const permArray = perm(4, 14);
    assert(_.isEqual(expectedPerm, permArray));
  });
  mocha.it('It contributes to a contract', async () => {
    /* Generate a test graph */
    const cities = ['Viena', 'Madrid', 'Praga', 'Bucharest', 'Lisbon'];
    const graph = generateGraph(cities);
    /* Test the first few posibilities */
    const numberOfPossibilities = 10;
    /* Compute the expected minimum cost */
    let expectedMinimumCost = graph.getCostPath(perm(cities.length, numberOfPossibilities + 1));
    for (let i = 1; i <= numberOfPossibilities; i++) {
      const permutation = perm(cities.length, i);
      const currentCost = graph.getCostPath(permutation);
      if (currentCost < expectedMinimumCost) {
        expectedMinimumCost = currentCost;
      }
    }
    /* Actually contribute to the contract using two accounts */
    const indexArray1 = [];
    await contribute(accounts[0], numberOfPossibilities, graph, cities, indexArray1);
    const minimumValue = (await contractController.getMinimumValue(tsp)).data.minimum;
    assert.equal(minimumValue, expectedMinimumCost);
    /* Test number of contributors */
    const { contributors } = (await contractController.getContributors(tsp)).data;
    assert.equal(contributors.length, 1);
    assert.equal(contributors[0], accounts[0]);
  });
});
/* eslint-disable no-plusplus */
const path = require('path');
const fs = require('fs');
const web3 = require('../utils/web3');

const compiledTspInstancePath = path.resolve('build', 'TSPInstance.json');
const compiledTspInstance = JSON.parse(fs.readFileSync(compiledTspInstancePath, 'utf8'));
const compiledFactoryContractPath = path.resolve('build', 'TSPInstanceFactory.json');
const compiledFactoryContract = JSON.parse(fs.readFileSync(compiledFactoryContractPath, 'utf8'));
const interf = compiledFactoryContract.interface;
const { bytecode } = compiledFactoryContract;
const Response = require('../utils/response');
const Logger = require('../../logger');


/* Deploys a factory contract to the server */
const deployFactory = async (account, gas) => {
  let response;
  try {
    const tspFactory = await new web3.eth.Contract(JSON.parse(interf))
      .deploy({ data: bytecode })
      .send({ from: account, gas });
    response = new Response(false, { address: tspFactory.options.address }, 'Successfully deployed TSP factory contract');
  } catch (err) {
    response = new Response(true, [], err.message);
  }
  return response;
};

/* Get the deployed instances of TSP contracts */
const getDeployedTSPInstances = async factoryAddress => {
  let response;
  try {
    const tspFactory = await new web3.eth.Contract(JSON.parse(interf), factoryAddress);
    const deployedInstances = await tspFactory.methods.getDeployedTSPInstances().call();
    response = new Response(false, { deployedInstances }, 'Successfully retrieved deployed instances');
  } catch (err) {
    response = new Response(true, null, err.message);
  }
  return response;
};

/* Get a deployed TSP contract using its mongodb id */
const getTSPInstanceByMongoId = async (factoryId, mongoId) => {
  let response;
  try {
    const deployedContracts = (await getDeployedTSPInstances(factoryId)).data.deployedInstances;
    // Logger.obj(deployedContracts);
    let contracts = [];
    /* Initialize instances of all the deployed contracts */
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < deployedContracts.length; i++) {
      const tspInterf = JSON.parse(compiledTspInstance.interface);
      contracts.push(new web3.eth.Contract(tspInterf, deployedContracts[i]));
    }
    contracts = await Promise.all(contracts);
    /* Get the mongodb id for each deployed contract */
    let mongodbArray = [];
    for (let i = 0; i < contracts.length; i++) {
      mongodbArray.push(contracts[i].methods.tspInstanceAddress().call());
    }
    mongodbArray = await Promise.all(mongodbArray);
    /* Search for the contract with the given mongodb id */
    let contractId;
    for (let i = 0; i < mongodbArray.length; i++) {
      if (mongodbArray[i] === mongoId) {
        contractId = deployedContracts[i];
        break;
      }
    }
    response = new Response(false, { id: contractId }, 'Successfully retrieved contract');
  } catch (err) {
    response = new Response(true, null, err.message);
  }
  return response;
};

/* Deploys a factory contract to the server */
const deployTSP = async (accountAddress, factoryAddress, gas, tspConfig) => {
  const { size, mongodbAddress } = tspConfig;
  let response;
  try {
    const tspFactory = await new web3.eth.Contract(JSON.parse(interf), factoryAddress);
    const tspInstance = await tspFactory.methods.createTSPInstance(size, mongodbAddress).send({
      from: accountAddress,
      gas
    });
    response = new Response(false, { address: tspInstance }, 'Successfully created TSP Instance problem');
  } catch (err) {
    response = new Response(true, null, err.message);
  }
  return response;
};

/* tsp is a contract */
const getReward = async tsp => {
  let response;
  try {
    const reward = await tsp.methods.reward().call();
    response = new Response(false, { reward }, 'Successfully retrieved reward');
  } catch (err) {
    response = new Response(true, null, err.message);
  }
  return response;
};

const setReward = async (tsp, reward, account) => {
  let response;
  try {
    await tsp.methods.setReward().send({
      from: account,
      value: reward,
      gas: '1000000'
    });
    response = new Response(false, null, 'Successfully set reward');
  } catch (err) {
    Logger.err(err.message);
    response = new Response(true, null, err.message);
  }
  return response;
};

const getMinimumValue = async tsp => {
  let response;
  try {
    const minimumValue = await tsp.methods.minimumCost().call();
    response = new Response(false, { minimum: minimumValue }, 'Retrieve minimum value success');
  } catch (err) {
    response = new Response(true, null, err.message);
  }
  return response;
};

const updateMinimumValue = async (tsp, value, account) => {
  let response;
  try {
    await tsp.methods.updateMinimumCost(value).send({
      from: account,
      gas: '1000000'
    });
    response = new Response(false, null, 'Update minimum cost success');
  } catch (err) {
    response = new Response(true, null, err.message);
  }
  return response;
};

const getIndex = async tsp => {
  let response;
  try {
    const index = await tsp.methods.index().call();
    response = new Response(false, { index }, 'Retrieve index value success');
  } catch (err) {
    response = new Response(true, null, err.message);
  }
  return response;
};

const incrementIndex = async (tsp, account) => {
  let response;
  try {
    await tsp.methods.incrementIndex().send({
      from: account,
      gas: '1000000'
    });
    response = new Response(false, null, 'Retrieve index value success');
  } catch (err) {
    response = new Response(true, null, err.message);
  }
  return response;
};

const getContributors = async tsp => {
  let response;
  try {
    const contributors = await tsp.methods.getContributors().call();
    response = new Response(false, { contributors }, 'Retrieve get contributors value success');
  } catch (err) {
    Logger.err(err.message);
    response = new Response(true, null, err.message);
  }
  return response;
};


module.exports = {
  deployFactory,
  deployTSP,
  getDeployedTSPInstances,
  getTSPInstanceByMongoId,
  getReward,
  setReward,
  getMinimumValue,
  updateMinimumValue,
  getIndex,
  getContributors,
  incrementIndex
};

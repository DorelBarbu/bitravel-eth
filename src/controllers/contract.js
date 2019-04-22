const path = require('path');
const fs = require('fs');
const web3 = require('../utils/web3');

const compiledFactoryContractPath = path.resolve('build', 'TSPInstanceFactory.json');
const compiledFactoryContract = JSON.parse(fs.readFileSync(compiledFactoryContractPath, 'utf8'));
const interf = compiledFactoryContract.interface;
const { bytecode } = compiledFactoryContract;
const Response = require('../utils/response');
//const Logger = require('../../logger');


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

/* Get a deployed TSP contract using its mongodb id */
const getTSPInstanceByMongoId = async (factoryId, mongoId) => {

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

module.exports = {
  deployFactory,
  deployTSP,
  getDeployedTSPInstances
};

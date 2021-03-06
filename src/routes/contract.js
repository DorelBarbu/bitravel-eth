const express = require('express');
const controller = require('../controllers/contract');
// const Logger = require('../../logger');

const router = express.Router();

router.post('/contract/factory', async (req, res) => {
  const { account, gas } = req.body;
  const response = await controller.deployFactory(account, gas);
  res.send(response);
});

router.post('/contract/factory/:factoryId', async (req, res) => {
  const {
    account, gas, mongodbAddress, size
  } = req.body;
  const { factoryId } = req.params;
  const response = await controller.deployTSP(account, factoryId, gas, {
    mongodbAddress,
    size
  });
  res.send(response);
});

router.get('/contract/factory/:factoryId/deployed', async (req, res) => {
  const { factoryId } = req.params;
  const response = await controller.getDeployedTSPInstances(factoryId);
  res.send(response);
});

router.get('/contract/tsp/:address', async (req, res) => {
  const { address } = req.params;
  const response = await controller.getTspContractInfo(address);
  res.send(response);
});

router.get('/contract/factory/:factoryId/:monogId', async (req, res) => {
  const { monogId, factoryId } = req.params;
  const response = await controller.getTSPInstanceByMongoId(factoryId, monogId);
  res.send(response);
});

router.post('/contract/:contractId/contribute', async (req, res) => {
  const { contractId } = req.params;
  const { account } = req.body;
  const response = await controller.contribute(contractId, account);
  res.send(response);
});

router.get('/contract/abi/:contractType', async (req, res) => {
  const { contractType } = req.params;
  const response = controller.getContractABI(contractType);
  // console.warn('contract type: ', contractType);
  // console.log(response);
  res.send(response);
});

router.get('/', async (req, res) => {
  res.send('bitravel-eth server is up');
});

router.post('/contract/:contractId/reward', async (req, res) => {
  const { reward, accountId } = req.body;
  const { contractId } = req.params;
  const contract = (await controller.getTsp(contractId)).data.tspContract;
  const response = await controller.setReward(contract, reward, accountId);
  res.send(response);
});

module.exports = router;

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

module.exports = router;

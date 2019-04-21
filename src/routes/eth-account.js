const express = require('express');
const controller = require('../controllers/eth-account');

const router = express.Router();

router.get('/account', async (req, res) => {
  const response = await controller.getAccounts();
  res.send(response);
});

module.exports = router;

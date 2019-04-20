const express = require('express');
const controller = require('../controllers/compile');
const Response = require('../utils/response');

const router = express.Router();

router.post('/compile', (req, res) => {
  controller.compile('TSPInstance');
  const response = new Response(false, [], 'Successfully compiled contracts');
  res.send(response);
});

module.exports = router;

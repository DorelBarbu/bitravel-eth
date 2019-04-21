const express = require('express');
const Response = require('../utils/response');

const router = express.Router();

router.post('contract/factory', async () => new Response(false, { id: 'asoamgoaa' }, 'success'));

module.exports = router;

const express = require('express');
const bodyParser = require('body-parser');
const compileRouter = require('./compile');
const contractRouter = require('./contract');
const ethAccountRouter = require('./eth-account');
// const requireParams = require('../middlewares/require-params');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(requireParams);

app.use(compileRouter);
app.use(contractRouter);
app.use(ethAccountRouter);

module.exports = app;

const express = require('express');
const compileRouter = require('./compile');
const contractRouter = require('./contract');

const app = express();

app.use(compileRouter);
app.use(contractRouter);

module.exports = app;

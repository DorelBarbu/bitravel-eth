const express = require('express');
const compileRouter = require('./compile');

const app = express();

app.use(compileRouter);

module.exports = app;

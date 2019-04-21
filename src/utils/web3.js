const Web3 = require('web3');
const ganache = require('ganache-cli');

const web3 = new Web3(ganache.provider());

module.exports = web3;

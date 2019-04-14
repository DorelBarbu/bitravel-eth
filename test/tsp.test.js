const mocha = require('mocha');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const { interf, bytecode } = require('../compile');

let tsp;
let accounts;

mocha.beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  tsp = await new web3.eth.Contract(JSON.parse(interf))
    .deploy({ data: bytecode, arguments: [123, '123'] })
    .send({ from: accounts[0], gas: '1000000' });
});

mocha.describe('Lottery contract', () => {
  mocha.it('Deploys a contract', () => {
    assert.ok(tsp.options.address);
  });
});

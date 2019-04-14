const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interf, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'cigar fiber cousin soldier mind witness bless boat beyond welcome cheap pigeon',
  'https://rinkeby.infura.io/v3/f542635d431e4b51a0b38d83f087e81c'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(`Attempting to deploy from account ${accounts[0]}`);
  try {
    await new web3.eth.Contract(JSON.parse(interf))
      .deploy({ data: bytecode })
      .send({ gas: '1000000', from: accounts[0] });
  } catch (error) {
    console.log(error);
  }
};

deploy();

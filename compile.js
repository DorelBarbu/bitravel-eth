const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'TSPInstance.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');
const compiledContract = solc.compile(source, 1).contracts[':TSPInstance'];
module.exports = {
  interf: compiledContract.interface,
  bytecode: compiledContract.bytecode
};

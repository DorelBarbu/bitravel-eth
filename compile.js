const path = require('path');
const fs = require('fs');
const solc = require('solc');

const compileContract = filename => {
  const contractPath = path.resolve(__dirname, 'contracts', `${filename}.sol`);
  const source = fs.readFileSync(contractPath, 'utf8');
  const compiledContract = solc.compile(source, 1).contracts[`:${filename}`];
  return compiledContract;
};

let tspInstanceContract = compileContract('TSPInstance');
let tspFactoryContract = compileContract('TSPInstanceFactory');

module.exports = {
  interf: compiledContract.interface,
  bytecode: compiledContract.bytecode
};

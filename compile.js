const path = require('path');
const fs = require('fs');
const solc = require('solc');

const compileContract = filename => {
  const contractPath = path.resolve(__dirname, 'contracts', `${filename}.sol`);
  const source = fs.readFileSync(contractPath, 'utf8');
  const compiledContracts = solc.compile(source, 2).contracts;
  for (const contract in compiledContracts) {
    console.log(contract);
    const outputPath = path.resolve(__dirname, 'build', `${contract.slice(1)}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(compiledContracts[contract]));
    console.log(compiledContracts[contract]);
    console.log('------------------');
  }
  return compiledContracts;
};

const tspFactoryContract = compileContract('TSPInstance');

module.exports = {
  interf: tspFactoryContract.interface,
  bytecode: tspFactoryContract.bytecode
};

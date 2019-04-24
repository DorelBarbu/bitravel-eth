const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Logger = require('./logger');

const compileContract = filename => {
  const contractPath = path.resolve(__dirname, 'contracts', `${filename}.sol`);
  const source = fs.readFileSync(contractPath, 'utf8');
  const compiledContracts = solc.compile(source, 1).contracts;
  for (const contract in compiledContracts) {
    const outputPath = path.resolve(__dirname, 'build', `${contract.slice(1)}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(compiledContracts[contract]));
  }
  Logger.success('Successfully compiled contracts');
  return compiledContracts;
};

compileContract('TSPInstance');

module.exports = compileContract;

const compileContracts = require('../../compile');

const compile = filename => {
  compileContracts(filename);
};

module.exports = {
  compile
};

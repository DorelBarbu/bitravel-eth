const web3 = require('../utils/web3');
const Response = require('../utils/response');

const getAccounts = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    return new Response(false, { accounts }, 'Successfully retrieved accounts');
  } catch (err) {
    return new Response(true, err, 'Error getting accounts');
  }
};

module.exports = {
  getAccounts
};

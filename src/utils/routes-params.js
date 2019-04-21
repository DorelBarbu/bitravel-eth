const requiredRoutesParams = {};

requiredRoutesParams['/contract/factory'] = {
  body: ['account', 'gas']
};

requiredRoutesParams['/contract/factory/:factoryId'] = {
  body: ['account', 'gas', 'size', 'mongodbId'],
  qureyString: ['factoryId']
};

module.exports = requiredRoutesParams;

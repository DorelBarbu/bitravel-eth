/**
 * This module tests whether or not a POST request contains
 * all the necessary parameters.
 * The function returns the remaining necessary params
 * @param {Object} reqBody
 */

// const Logger = require('../../logger');
const requiredRoutesParams = require('../utils/routes-params');
const Response = require('../utils/response');
const Logger = require('../../logger');

const requireParams = (req, res, next) => {
  const route = req.originalUrl;
  Logger.warn(route);
  if (requiredRoutesParams[route] === undefined) {
    next();
    return;
  }
  let isValid = true;
  const { body } = req;
  const missingParameters = [];
  requiredRoutesParams[route].body.forEach(param => {
    if (!body[param]) {
      isValid = false;
      missingParameters.push(param);
    }
  });
  if (isValid) {
    next();
  } else {
    res.send(new Response(true, { missingParameters }, 'Insufficient parameters'));
  }
};

module.exports = requireParams;

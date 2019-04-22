/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const Logger = require('../../logger');

/**
 * Returns the factoradic representation of a given numbe.r
 * There is a direct relationship between the factoradic representation
 * of a given number and the n-th permutation of a set
 */
const getFactoradic = n => {
  const factoradicRepresentation = [];
  let i = 1;
  while (n) {
    factoradicRepresentation.push(n % i);
    n = Math.floor(n / i);
    i++;
  }
  factoradicRepresentation.reverse();
  return factoradicRepresentation;
};

/** Returns the n-th permutation in lexicographical order
 * for the set {1, 2, 3, ..., setCardinal}
 */
const getPerm = (setCardinal, permutationOrder) => {
  /* Build initial array of {1, 2, 3, ..., setCardinal} */
  const initialArray = [];
  for (let i = 0; i < setCardinal; i++) {
    initialArray.push(i);
  }
  /* Build the permutation array */
  const factoradic = getFactoradic(permutationOrder);
  Logger.msg(factoradic);
  const perm = [];
  for (let i = 0; i < factoradic.length; i++) {
    const elem = factoradic[i];
    perm.push(initialArray[elem]);
    initialArray.slice(elem + 1, initialArray.length - 1);
  }
  Logger.msg(perm);
  return perm;
};

module.exports = getPerm;

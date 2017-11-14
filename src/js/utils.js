import numeral from 'numeral';
import is from 'is_js';
import { gasCostCeil } from 'chainline-js';

// http://docs.neo.org/en-us/sc/systemfees.html
// const CHECKSIG_COST = 0.1;
const CHECKWITNESS_COST = 0.2;
const COST_BUFFER = 0.01;
const COST_MIN = 0.001;
const EXTRA_GAS_CONSUMPTION_CHARGES = CHECKWITNESS_COST + COST_BUFFER;
const FREE_GAS = 10;

/**
 * Converts GAS consumption cost to the real cost a user should pay to invoke the contract.
 * @param {number|string} gasConsumption
 * @return {string} the real GAS consumption cost with extras (see above)
 */
export const calculateRealGasConsumption = (gasConsumption = 0) =>
  Math.max(
    gasCostCeil(
      ((is.number(gasConsumption) ? gasConsumption : parseFloat(gasConsumption))
        + EXTRA_GAS_CONSUMPTION_CHARGES
      ) - FREE_GAS)
    , COST_MIN);

/**
 * Converts GAS consumption cost to a human readable form.
 * @param {number} gasConsumption
 * @return {string} the human-friendly GAS consumption cost
 */
export const formatGasConsumption = (gasConsumption = 0) =>
  numeral(gasConsumption).format('0,0.000');

/**
 * Converts a number to a hexstring of a suitable size.
 * @param {number} num
 * @param {number} size - the required size in chars, eg 2 for Uint8, 4 for Uint16. Defaults to 2.
 */
export const num2hexstring = (num, size = 2) => {
  const hexstring = num.toString(16);
  return hexstring.length % size === 0 ?
    hexstring :
    ('0'.repeat(size) + hexstring).substring(hexstring.length);
};

/**
 * Converts a string to hex, optionally zero-padding to a specified length.
 * @param {string} str
 * @param {number} padToBytes - the output string will be zero-padded to reach this size
 * @return {string} the hex form of the string
 */
export const string2hex = (str, padToBytes = 0) => {
  let hex = '';
  for (let i = 0; i < str.length; i += 1) {
    hex += num2hexstring(str.charCodeAt(i));
  }
  while (hex.length / 2 < padToBytes) {
    hex += '00';
  }
  return hex;
};

export default {
  calculateRealGasConsumption,
  formatGasConsumption,
  num2hexstring,
  string2hex,
};

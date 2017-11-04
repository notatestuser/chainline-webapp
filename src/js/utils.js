/**
 * Converts a number to a hexstring of a suitable size
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
 * Converts a string to hex, optionally zero-padding to a specified length
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

export default { num2hexstring, string2hex };

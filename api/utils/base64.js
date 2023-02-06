/**
 * Encode with base64
 * @param {String} plaintext
 * @returns {String} base64
 */
const encode = (plaintext) => {
  return Buffer.from(plaintext).toString('base64');
};

/**
 * Decode base64
 * @param {String} encoded
 * @returns {String} plaintext
 */
const decode = (encoded) => {
  return Buffer.from(encoded, 'base64').toString('ascii');
};

export default {
  encode,
  decode,
};

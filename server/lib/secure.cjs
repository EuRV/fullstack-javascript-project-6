const crypto = require('crypto');

/**
 * @param {string} password
 * @returns {string}
 */
function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

/**
 * @param {string} password
 * @param {string} storedHash
 * @returns {boolean}
 */
function verifyPassword(password, storedHash) {
  const hash = hashPassword(password);
  return hash === storedHash;
}

module.exports = {
  hashPassword,
  verifyPassword,
};
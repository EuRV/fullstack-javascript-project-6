// @ts-check

const crypto = await import('node:crypto');

export default (value) => crypto.createHash('sha256')
  .update(value)
  .digest('hex');

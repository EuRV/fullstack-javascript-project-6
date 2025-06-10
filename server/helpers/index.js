import i18next from 'i18next';

export default (app) => ({
  t(key) {
    return i18next.t(key);
  },

  formatDate(str) {
    const date = new Date(str);
    return date.toLocaleString();
  },

  isEmpty(value) {
    if (value == null) {
      return true;
    }

    if (typeof value !== 'object' && typeof value !== 'function') {
      return true;
    }

    if (Array.isArray(value) || typeof value === 'string'
      || (typeof value.length === 'number' && value.length > 0 && (value.length - 1) in value)) {
      return value.length === 0;
    }

    if (value instanceof Map || value instanceof Set) {
      return value.size === 0;
    }

    if (typeof value === 'object') {
      if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
        return value.length === 0;
      }

      const proto = Object.getPrototypeOf(value);
      if (proto === null || proto === Object.prototype) {
        return Object.keys(value).length === 0;
      }
    }

    return false;
  },

  get(obj, key, defaultValue = undefined) {
    const result = obj[key] || defaultValue;
    return result;
  },
});

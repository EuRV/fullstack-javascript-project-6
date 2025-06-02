import i18next from 'i18next';

export default (app) => ({
  t(key) {
    return i18next.t(key);
  },
  formatDate(str) {
    const date = new Date(str);
    return date.toLocaleString();
  },
});

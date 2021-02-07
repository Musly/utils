module.exports = {
  extends: [
    './main',
    './react',
    './cypress',
  ].map(require.resolve),
};

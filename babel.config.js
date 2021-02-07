module.exports = (api) => {
  api.cache(false);

  return {
    compact: true,
    presets: [
      '@babel/preset-env',
    ],
  };
};

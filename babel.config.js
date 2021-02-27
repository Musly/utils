module.exports = (api) => {
  api.cache(true);

  return {
    compact: true,
    presets: [
      '@babel/preset-env',
    ],
  };
};

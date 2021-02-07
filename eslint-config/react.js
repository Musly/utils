module.exports = {
  plugins: [
    'react-hooks',
  ],
  rules: {
    'react/sort-prop-types': 0,
    'react/sort-comp': 0,
    'react/jsx-props-no-spreading': 0,
    'react/destructuring-assignment': 1,
    'react/jsx-fragments': [2, 'element'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-closing-bracket-location': [2, 'tag-aligned'],
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 2,
  },
};

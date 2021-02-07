module.exports = {
  extends: [
    'airbnb',
  ],
  parser: '@babel/eslint-parser',
  env: {
    jest: true,
    node: true,
    es6: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  rules: {
    camelcase: 0,
    indent: ['error', 2],
    'no-underscore-dangle': 0,
    'capitalized-comments': 0,
    'comma-dangle': [2, {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'import/extensions': [2, 'never'],
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'no-multiple-empty-lines': [2, {
      max: 1,
      maxBOF: 0,
      maxEOF: 1,
    }],
    'no-prototype-builtins': 1,
    'require-jsdoc': 0,
    'valid-jsdoc': 0,
    'prefer-arrow-callback': 0,
    'space-before-function-paren': [2, 'always'],
    'no-param-reassign': 0,
    'no-console': 1,
    'operator-linebreak': [2, 'after', { overrides: { '?': 'before', ':': 'before' } }],
    'class-methods-use-this': 0,
    'max-len': 0,
  },
  settings: {
    'import/extensions': ['.js', '.jsx'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
};

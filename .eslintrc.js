module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    mocha: true,
  },
  extends: ['eslint:recommended', 'google', 'prettier'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['hbs'],
  rules: {
    'hbs/check-hbs-template-literals': 2,
  },
};

module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: 'standard',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-trailing-spaces': 'off',
    'no-multiple-empty-lines': 'off',
    'space-before-function-paren': 'off',
    'camelcase': 'off',
    'quote-props': 'off',
    'padded-blocks': 'off',
    'eol-last': 'off',
    'comma-spacing': 'off',
    'quotes': 'off',
    'dot-notation': 'off'
  }
}

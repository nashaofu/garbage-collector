module.exports = {
  parser: 'babel-eslint',
  extends: ['taro'],
  rules: {
    'no-shadow': 'off',
    'import/no-commonjs': 'off',
    'jsx-quotes': ['error', 'prefer-double'],
    'no-unused-vars': ['error', { varsIgnorePattern: 'Taro' }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }]
  }
}

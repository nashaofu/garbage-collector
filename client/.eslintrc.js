module.exports = {
  parser: 'babel-eslint',
  extends: ['taro'],
  rules: {
    "react/sort-comp": 0,
    'jsx-quotes': ['error', 'prefer-double'],
    'no-unused-vars': ['error', { varsIgnorePattern: 'Taro' }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }]
  }
}

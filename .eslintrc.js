module.exports = {
  "env": {
    "browser": true,
    "jquery": true,
    "commonjs": true,
    "es2021": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 12
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": ["error", 2, {"SwitchCase": 1}],
    "no-unused-vars": ["warn", {"vars": "all", "args": "none"}],
    "no-console": ["off"]
  }
};

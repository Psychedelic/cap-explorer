const path = require('path');

const withResolvedPath = (pathname) => path.join(path.resolve(__dirname, pathname));

module.exports = {
  extends: '../../.eslintrc',
  settings: {
    'import/resolver': {
      typescript: {
        project: withResolvedPath('./src/tsconfig.json'),
      },
    },
  },
  env: {
    jest: true,
  },
};
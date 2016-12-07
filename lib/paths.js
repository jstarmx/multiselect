const path = require('path');

const root = path.join(__dirname, '..');

module.exports = {
  build: path.join(root, 'dist'),
  scripts: path.join(root, 'src', 'scripts'),
  styles: path.join(root, 'src', 'styles'),
};

console.log('# Load time');
console.time('minimatch');
exports.mm = require('minimatch');
console.timeEnd('minimatch');
console.time('micromatch');
exports.mi = require('../src');
console.timeEnd('micromatch');
console.log();

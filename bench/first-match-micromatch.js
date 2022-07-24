console.time('micromatch');
console.log(require('../src').makeRe('**/*').test('foo/bar/baz/qux.js'));
console.timeEnd('micromatch');
// micromatch: 7.429ms


const assert = require('assert');
const mm = require('../src');

describe('.makeRe()', () => {
  it('should throw an error when value is not a string', () => {
    assert.throws(() => mm.makeRe());
  });

  it('should create a regex for a glob pattern', () => {
    assert(mm.makeRe('*') instanceof RegExp);
  });
});

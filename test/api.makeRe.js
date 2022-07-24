
import assert from 'assert';
import mm from '../src/index.js';
const {all} = mm;

describe('.makeRe()', () => {
  it('should throw an error when value is not a string', () => {
    assert.throws(() => mm.makeRe());
  });

  it('should create a regex for a glob pattern', () => {
    assert(mm.makeRe('*') instanceof RegExp);
  });
});

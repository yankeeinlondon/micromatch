
import 'mocha';
import assert from 'assert';
import mm from '../src/index.js';
const {braces} = mm;

if (!process.env.ORIGINAL_PATH_SEP) {
  process.env.ORIGINAL_PATH_SEP = path.sep
}

describe('.braces()', () => {it('should throw an error when arguments are invalid', () => {
    assert.throws(() => braces());
  });

  it('should create a regex source string from a brace pattern', () => {
    assert.deepEqual(braces('{a,b}'), ['(a|b)']);
  });

  it('should expand a brace pattern', () => {
    assert.deepEqual(braces('{a,b}', {expand: true}), ['a', 'b']);
  });
});

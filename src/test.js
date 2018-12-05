const { some } = require('./index');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const assert = chai.assert;
const expect = chai.expect;

describe('promise-some', () => {
  it('should reject if the argument is not iterable', () => {
    const p1 = new Promise(resolve => { resolve(); });
    assert.isRejected(some(p1));
    assert.isRejected(some(42));
    assert.isRejected(some({}));
    assert.isRejected(some(true));
  });
  it('should reject if the argument is iterable but empty', () => {
    assert.isRejected(some([]));
    assert.isRejected(some(''));
    assert.isRejected(some(new Map()));
    assert.isRejected(some(new Set()));
    assert.isRejected(some(new Int8Array()));
  });
  it('should resolve with the value of the first non-Promise value of the iterable argument, if one exists', () => {
    assert.eventually.equal(some([1, 2]), 1);
    assert.eventually.equal(some('12'), 1);
    assert.eventually.deepEqual(
      some(new Map([['key', 1], ['another key', 2]])),
      ['key', 1]
    );
    assert.eventually.equal(some(new Set([1, 2])), 1);
    const typedArray = new Int8Array(2);
    typedArray[0] = 1;
    typedArray[1] = 2;
    return assert.eventually.equal(some(typedArray), 1);
  });
  it('should resolve with the first resolving Promise in the iterable argument, if it has only Promise values', () => {
    let resolveP1;
    let resolveP2;
    const p1 = new Promise(resolve => {
      resolveP1 = resolve;
    });
    const p2 = new Promise(resolve => {
      resolveP2 = resolve;
    });
    const result = some([p1, p2]);
    resolveP2('p2');
    resolveP1('p1');
    return assert.eventually.equal(result, 'p2');
  });
  it('should reject with rejection reasons in the same order as the Promises that generated them, if the iterable argument contains only Promises and they all reject', () => {
    let rejectP1;
    let rejectP2;
    let rejectP3;
    const p1 = new Promise((_, reject) => {
      rejectP1 = reject;
    });
    const p2 = new Promise((_, reject) => {
      rejectP2 = reject;
    });
    const p3 = new Promise((_, reject) => {
      rejectP3 = reject;
    });
    const result = some([p1, p2, p3]);
    rejectP2('p2');
    rejectP1('p1');
    rejectP3('p3');
    return expect(result).to.be.rejectedWith(['p1', 'p2', 'p3']);
  });
});

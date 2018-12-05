const { some } = require("./index");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const assert = chai.assert;
const expect = chai.expect;
chai.should();

describe("promise-some", () => {
  it("should reject if the argument is not iterable", () => {
    const p1 = new Promise(resolve => {
      resolve();
    });
    return Promise.all([
      some(p1).should.be.rejected,
      some(42).should.be.rejected,
      some({}).should.be.rejected,
      some(true).should.be.rejected
    ]);
  });
  it("should reject if the argument is iterable but empty", () => {
    return Promise.all([
      some([]).should.be.rejected,
      some("").should.be.rejected,
      some(new Map()).should.be.rejected,
      some(new Set()).should.be.rejected,
      some(new Int8Array()).should.be.rejected
    ]);
  });
  it("should resolve with the value of the first non-Promise value of the iterable argument, if one exists", () => {
    const typedArray = new Int8Array(2);
    typedArray[0] = 1;
    typedArray[1] = 2;

    return Promise.all([
      some([1, 2]).should.become(1),
      some("12").should.become("1"),
      some(new Map([["a", 1], ["b", 2]])).should.eventually.deep.equal([
        "a",
        1
      ]),
      some(new Set([1, 2])).should.become(1),
      some(typedArray).should.become(1)
    ]);
  });
  it("should resolve with the first resolving Promise in the iterable argument, if it has only Promise values", () => {
    let resolveP1;
    let resolveP2;
    const p1 = new Promise(resolve => {
      resolveP1 = resolve;
    });
    const p2 = new Promise(resolve => {
      resolveP2 = resolve;
    });
    const result = some([p1, p2]);
    resolveP2("p2");
    resolveP1("p1");
    return assert.eventually.equal(result, "p2");
  });
  it("should reject with rejection reasons in the same order as the Promises that generated them, if the iterable argument contains only Promises and they all reject", () => {
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
    rejectP2("p2");
    rejectP1("p1");
    rejectP3("p3");
    return result.then(
      () => assert.fail(),
      reasons => expect(reasons).to.deep.equal(["p1", "p2", "p3"])
    );
  });
});

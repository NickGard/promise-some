Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.some = some;

function some(iterable) {
  const promises = Array.from(iterable);
  const reasons = [];
  let rejectionsCount = 0;

  if (promises.length === 0) {
    return Promise.reject();
  }

  const nonPromise = promises.find(promise => !(promise instanceof Promise));
  if (nonPromise) {
    // resolve with the first non-Promise value
    return Promise.resolve(nonPromise);
  }

  function accumulateRejection(index) {
    return function(reason) {
      // rejection reasons should be in the same order as the promises that generated them
      reasons[index] = reason;
      if (++rejectionsCount === promises.length) {
        // reject if all promises rejected
        reject(reasons);
      }
    }
  }
  
  return new Promise(function (resolve) {
    Promise.race(promises.map(function (promise, i) {
      return promise.then(resolve, accumulateRejection(i))
    }));
  });
};

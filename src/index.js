Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.some = some;

function some(promises) {
  return reverse(Promise.all(Array.from(promises).map(reverse)))
}

function reverse(promise) {
  return new Promise((resolve, reject) => {
    if (promise && typeof promise.then === 'function') {
      return promise.then(reject, resolve);
    }
    reject(promise);
  })
}
# promise-some

[![source](https://badgen.net/npm/v/@ngard/promise-some)](https://www.npmjs.com/package/@ngard/promise-some)
[![bundle size](https://badgen.net/bundlephobia/minzip/@ngard/promise-some)](https://bundlephobia.com/result?p=@ngard/promise-some)
[![build status](https://badgen.net/travis/NickGard/promise-some)](https://travis-ci.org/NickGard/promise-some)
[![license](https://badgen.net/badge/license/MIT/blue)](https://badgen.net/badge/license/MIT/blue)

A complementary function to `Promise.all()` that will resolve if any passed `Promise` resolves and rejects only if all of the passed `Promise`s reject. The rejection handler is passed an array containing the individual `Promise`'s rejection reasons in the order the `Promise`s were passed in to `some` (not in the order in which they rejected).

<hr/>

## Syntax

```javascript
import { some } from '@ngard/promise-some';

some(/* iterable */)
```

## Parameter

`iterable` — An iterable object containing `Promise`s or other values

## Return

* An already rejected `Promise` if the iterable passed is empty.
* An asynchronously resolved `Promise` if the iterable passed contains a non-`Promise` value.
* A pending `Promise` in all other cases. This returned promise is then resolved/rejected asynchronously (as soon as the stack is empty) when any of the promises in the given iterable have resolved, or if any of the promises resolves. Returned values will be in order of the `Promise`s passed, regardless of completion order.

<hr/>

## Examples

```javascript
const p1 = Promise.resolve('p1 resolved');
const p2 = new Promise(() => {});

some([ p1, p2 ]).then((val) => console.log(val));
// logs "p1 resolved"
```

```javascript
const p1 = Promise.resolve('p1 resolved');

some([ p1, 'not a promise' ]).then((val) => console.log(val));
// logs "not a promise"
```

```javascript
const p1 = new Promise((resolve, reject) => {
  setTimeout(reject, 300, 'p1 rejected');
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(reject, 100, 'p2 rejected');
});
const p3 = new Promise((resolve, reject) => {
  setTimeout(reject, 200, 'p3 rejected');
});

some([ p1, p2, p3 ]).catch((val) => console.log(val));
// logs ["p1 rejected", "p2 rejected", "p3 rejected"]
```

<hr/>

<div class="alert alert-info">

**Note:** This utility relies on `Array.from` which is not supported in Internet Explorer. However, `Promise` is also not supported in IE. If you are polyfilling `Promise` for older browsers, you will also need to polyfill `Array.from`.

</div>
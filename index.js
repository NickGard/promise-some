function isIterable(e){try{return"function"==typeof e[Symbol.iterator]}catch(t){return Array.isArray(e)||"string"==typeof e||"[object Arguments]"===Object.prototype.toString.call(e)}}function some(e){const t=[];let r=0;if(!isIterable(e)||0===e.length||0===e.size)return Promise.reject();return new Promise(function(n){let o=e.find(e=>!(e instanceof Promise));o?Promise.resolve(o):Promise.race(e.map(function(o,i){return o.then(n,(s=i,function(n){t[s](n),++r===e.length&&reject(t)}));var s}))})}Object.defineProperty(exports,"__esModule",{value:!0}),exports.some=some;
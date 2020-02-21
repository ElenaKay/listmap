
# ListMap: Javascript Object With Ordered Keys

Even though an object's keys are (mostly) enumerable in Javascript, there is no guaranteed order on this enumeration; consider the following snippet:

```js
var obj = {};

obj['a'] = 1;
obj['b'] = 2;

for (var objectKey in obj) {
  if (obj.hasOwnProperty(objectKey) {
    console.log(objectKey);
  }
}
```

even though `a` was set first, the snippet above may still produce the sequence `b a`, i.e., there is not guarantee that it would always print `a b`.

But what if we want to keep track of the order in which an object's keys were set? this is where `ListMap` comes in handy:

## Installation

```sh
npm install listmap
```

## Usage

```js
var listmap = require('listmap');

var lm = new listmap.ListMap();

lm.set('a', 1);
lm.set('b', 2);
lm.set('c', 12);
lm.set('d', 40);
lm.set('e', 55);

console.log('length:', lm.length);

// traverse listmap in reverse
while (lm.length > 0) {
  var i = lm.length - 1;

  var k = lm.keyAt(i);
  console.log('key at ['+i+'] is:', k);

  var v = lm.valueAt(i);
  console.log('value at ['+i+'] is:', v);

  var kIndex = lm.locateKey(k);
  console.log('key with name ['+k+'] is located at index:', kIndex);

  lm.deleteKey(k);
  console.log('deleted key name ['+k+']; listmap.length:', lm.length);

  kIndex = lm.locateKey(k);
  if (kIndex !== -1) // never happens, since entry `k: v` has just been deleted
    throw new Error('deleted key, but located it in the key list!');

  // re-insert (k,v) into the listmap
  lm.set(k, v);

  console.log('re-inserted ['+k+': '+v+']; list.length:', lm.length);

  var valueByKey = lm.get(k);
  console.log('value at key name [' + k +'] is:', v);

  kIndex = lm.locateKey(k);
  if (kIndex === -1) // never happens, since we have just inserted `k: v`
    throw new Error('key-value was just inserted into the listmap, but it was '+
      'not anywhere in the key list!');

  lm.removeIndex(kIndex);
  console.log('removed index at ['+kIndex+']; listmap.length:', (lm).length);

  console.log('--------------------\n');
}
```

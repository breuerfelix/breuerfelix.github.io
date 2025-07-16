---
layout: post
title: JavaScripts magic three dots
date: 2020-07-26 11:00:00 +01:00
modify_date: 2020-07-27 11:00:00 +01:00
tags: javascript magic dots three spread operator typescript
category: blog
---

The so-called spread/rest operator scares a lot of people switching to JavaScript.  
This should be a self-explaining code snippet:<!--more-->
```javascript
const obj1 = { key1: 1, key2: 2 };
const obj2 = { ...obj1, key3: 3 };
console.log(obj2);
// output: { key1: 1, key2: 2, key3: 3 }

const obj3 = { ...obj1, key2: 4, key3: 3 };
console.log(obj3)
// output: { key1: 1, key2: 4, key3: 3 }
// keys will be overridden

const arr1 = [ 1, 2, 3, 4 ];
const arr2 = [ ...arr1, 5, 6 ];
console.log(arr2);
// output: [ 1, 2, 3, 4, 5, 6 ]

function spread(a, b, ...remaining) {
  console.log(remaining);
}

spread(1, 2, 3, 4, 5);
// output: [ 3, 4, 5 ]

spread(...arr1);
// output: [ 3, 4 ]
```

More to come...

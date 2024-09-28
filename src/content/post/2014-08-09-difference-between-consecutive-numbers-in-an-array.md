---
title: Difference between consecutive numbers in an Array
description: ""
publishDate: 09 Aug 2014
tags: ["functional programming", "fun"]
---
Ah! A homework question? Not really, a friend asked this on a group chat, but he asked us to solve it using functional programming.

The input should be an array such as `[1, 2, 3, 5]` and the output will be `[2 - 1, 3 - 2, 5 - 3] === [1, 1, 2]`

I solved it by using various built-in functions in Haskell, which are also available in lodash.

```javascript
	_.filter(_.map(_.zip(array, _.tail(array)), function (v) {
        return v[1] - v[0];
    }));
```

Try out the solution here: http://jsfiddle.net/debjitbis08/p2j02jf6/

---
title: Readable List from Array
description: ""
publishDate: 24 Oct 2013
tags: ["functional programming", "snippet"]
---

I recently came across a problem
of rendering an array of strings as a human readable string in the format: "A, B
and C". It didn't seem too difficult at first but I decided to do this in a more
functional way, without using a loop. Additionaly it needed to work with arrays
of single element and even an empty array.

The cases are:

```
[]              -> ""
[""]            -> ""
["A"]           -> "A"
["A", "B"]      -> "A and B"
["A", "B", "C"] -> "A, B and C"
```

... and so on

First let's look at a naive solution with a loop. This can be improved and
optimized, but I was not interested in such a solution, so I din't explore it
further.

```javascript
function getReadableString(a) {
    var l = a.length,
        str = "";

    for (var i = 0; i < l; i += 1) {

        if (l < 2) {
            str = a[i] || "";
            continue;
        }

        if (i === l - 1 && l > 1) {
            str += "and " + a[i];
        } else if (i === 0 && l === 2) {
            str += a[i] + " ";
        } else {
            str += a[i] + ", ";
        }
    }

    return str;
}
```

That is such mess, lets change that:

```javascript
function getReadableString(a) {
    var l = a.length,
        str = "";

    switch(l) {
    case 0:
        str = "";
        break;
    case 1:
        str = a[0]
        break;
    case 2:
        str = a.join(" and ");
        break;
    default:
        str = a.slice(0, -1).join(", ") + " and " + [a.pop()]
    };

    return str;
}
```

Now, that looks organized. Still, if somehow we can include the cases for array
length being 0, 1 or 2 in the default logic, we would have a nicer solution.

```javascript
function getReadableString(a) {
    return [
            a

            /* Get all the elements except the last one.
             * If there is just one element, get that
             */
            .slice(0, a.length - 1 || 1)

            /* Create a comma separated string from these elements */
            .join(", ")
        ]
        /* Process the last element (if there is one) and concat it
         * with the processed first part.
         */
        .concat(
            a

            /* Create a copy */
            .slice()

            /* Take the last element, if there is one */
            .splice(-1, Number(a.length > 1))
        )

        /* Join the two processed parts */
        .join(" and ");
}
```

Is there a better solution? I am still looking.

---

**Update:** Ok, so one of my friends suggested a solution, by joining the array
and replacing the last comma as with 'and'. I must admit that the solution has a
beauty of its own.

```javascript
function getReadableString(a) {
    return a.join(', ').replace(/(.*),\s([^,]*)$/,'$1 and $2');
}
```

I am not sure if the regex used is the best possible, but it works. The
disadvantage of this solution is that it cannot be extended to create strings
such as 'A, B, C and 4 others', while the previous solution can be,

```javascript
function getReadableString(a) {
    var l = a.length;

    return ([a
            .slice(0, Number(l > 2) + 1)
            .join(", ")
        ]
        .concat(l < 4 ? a.slice().splice(-1, Number(l > 1)) : l - 2 + " others")
        .join(" and ") || "None");
}
```

Another disadvantage, it is not as much fun as the previous one ☺.

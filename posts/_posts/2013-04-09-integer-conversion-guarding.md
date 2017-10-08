---
layout: post
title: Integer conversion with guarding
---
<p>
Ever wanted to convert a string to an integer while making sure that the result is zero when the string is empty. Well here is neat trick to do it in JavaScript. Warning: This works only for integers and I consider this code "too clever" and suggest you use more obvious methods.
</p>
<p>
Enough talk, here is the method:

<pre><code>(someVar | 0)</code></pre>
</p>

<p>
I hear you saying, come on, that’s an old trick to convert to integers. Yes it is, but it also guards against  <code>someVar</code> being <code>""</code>, <code>null</code> and <code>undefined</code>.

<pre><code>("" | 0) === 0 //true
(null | 0) === 0 //true
(undefined | 0) === 0 //true
</code></pre>
</p>
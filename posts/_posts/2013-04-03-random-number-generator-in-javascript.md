---
layout: post
title: Random Number Generator in JavaScript
---
<p>
	A random number generator in JavaScript without using a Math.random function is a challenge to write.
	Much research has gone into the theoretical underpinnings of such a procedure but I have not been able to fathom any of it till now. That can be a future endeavour I suppose.
</p>
<p>
	For the present I am using the random number generator presented in Knuth's The Art Of Computer Programming: Seminumerical Algorithms (Vol 2). It's a port from the C code with the essential parts modified. The original code can be
	found at <a href="http://www-cs-faculty.stanford.edu/~uno/programs/rng-double.c">http://www-cs-faculty.stanford.edu/~uno/programs/rng-double.c</a> View the <a href="http://jsfiddle.net/debjitbis08/LNY82/13/">demo</a> to see it in action.
</p>
<p>
	Here is the code:
	<script src="https://gist.github.com/debjitbis08/5295038.js"></script>
</p>
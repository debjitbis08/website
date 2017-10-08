---
layout: post
title: Override onclick
---
<p>
Sometimes it is required to override the onclick values pre-populated by server to implement our own handlers and also
call the overriden functions. The code below does this very reliably without any browser specific hacks.
</p>
<p>
Working on a recent recent project required me to perform some operations on a click of a button but the only complication
was that the button already had a javascript call on the click of a button. More specifically the button had it's onclick
attribute set to a javascript function call. Something like:
</p>
<pre>
<code>&lt;button onclick="someFunc(arg1, arg2)"&gt;Click Me&lt;/button&gt;</code>
</pre>
<p>
I wanted to run my own operations on the click of this button and then call someFunc(arg1, arg2). I searched but did not
get any solution (surprisingly).
</p>
<p>
I could have easily used eval or Function to parse the onclick value and run it after my operations were complete but to
avoid the eval way I invented a simpler solution.
</p>
<p>
I created a dummy anchor element and set its onclick to the onclick of the button, then removed the onclick from the button registered and added a new function to execute on click of the button. In this function I performed the required operations and then triggered the click of the dummy element. Thus I was able to execute both my operations and the default operations
(someFunc(arg1, arg2)))
</p>
<p>
In the below example, by default the submit button modifies the innerHTML of the #output span to "onclick text". Then in the
JavaScript code below that the this operation is overriden to first show a message and then change the text.
</p>
<pre>
<code>&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
&lt;head&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;span id="output"&gt;Nothing yet&lt;/span&gt;
  &lt;button id="submit" onclick="document.getElementById('output').innerHTML = 'onclick text'"&gt;Click Me&lt;/button&gt;
  &lt;script type="text/javascript"&gt;
    (function() {
        var buttonElement = document.getElementById('submit'),
            dummyElement  =  document.createElement('a'),
            outputElement = document.getElementById('output');
        alert(typeof  buttonElement.getAttribute('onclick'));
        if (typeof buttonElement.getAttribute('onclick') === 'function') {
            dummyElement.onclick = buttonElement.getAttribute('onclick');
        }
        else {
            dummyElement.setAttribute('onclick', buttonElement.getAttribute('onclick'));
        }
        buttonElement.removeAttribute('onclick');
        buttonElement.onclick  =  function () {
            alert('Ok  overriden. Now call the base onclick');
            dummyElement.click();
        };
    }());
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code>
</pre>
<p>Please share if you have any other better techniques to accomplish this</p>
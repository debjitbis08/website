---
layout: post
title: Detecting DOM changes
---
<p>Recently, I have come across situations where I need to detect elements being added to the DOM and trigger some other function.</p>
<p>For example, I was working on combining the <a href="http://leandrovieira.com/projects/jquery/lightbox/" target="_blank">lightbox plugin</a> with a <a href="http://plugins.jquery.com/project/iviewer" target="_blank">Jquery iviewer</a> plugin. The problem is the lightbox plugin creates various elements and the zoom plugin can work only after all the elements created by lightbox have been loaded. I used <code>setTimeout</code> initially, but that created race conditions.</p>
<p>In another situations I had to wait for a third party server response and DOM nodes being added before my code was executed.</p>
<p>To tackle these kind of situations I came up with a small polling function that would wait for the element to be created before doing something else. Without any more delay I present the idea implemented below:</p>
<pre><code class="codeBlock">
var limit = 1000,
    iter = 0,
    timeout = 100,
    wnw = function () {
      if (iter > limit) {
          return false;
      }
      if ($(element).length > 0) {
          //do something
          return true;
      }
      else {
          setTimeout(wnw, timeout);
      }
      iter += 1;
    };
</code></pre>
<p>The function once executed calls itself at regular intervals(<code>timeout</code>) before checking if the element exits and doing the needful. If the functions has been called more than a specified number of times(<code>limit</code>) it simply exits deciding that the element would never be created.</p>
<p>This can also be extended to detect element removal. Of course, I suggest wrapping all this code in a <a href="http://www.yuiblog.com/blog/2007/06/12/module-pattern/" target="_blank">module</a> before using it.</p>
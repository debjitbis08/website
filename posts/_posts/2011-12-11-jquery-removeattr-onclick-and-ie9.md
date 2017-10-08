---
layout: post
title: jQuery removeAttr for onclick and IE9
---
<p>Did you know that the removeAttr method cannot remove the 'onclick' attribute on IE9 browser? Seems strange right, unfortunately it's true. jQuery is not at fault here though, IE9 has a bug it seems. So for now use the <code>.prop('onclick', null)</code> method to get the job done.</p>
<p>For more information hit this link: <a href="http://bugs.jquery.com/ticket/9405">http://bugs.jquery.com/ticket/9405</a></p>
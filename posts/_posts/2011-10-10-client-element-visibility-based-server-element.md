---
layout: post
title: Client Element visibility based on Server Element
---
<p>
Ever wanted to hide a client-side element based on the visibility of the server-side element in ASP.NET? The below
achieves this by using the Visible property and some CSS.
</p>
<p>
Suppose you have the following:
</p>
<pre><code>
&lt;div id="clientElement"&gt;Blah Blah...&lt;/div&gt;
&lt;div id="serverElement" runat="server"&gt;Some more Blah...&lt;/div&gt;
</code></pre>
<p>
Now the #clientElement needs to be hidden when the #serverElement is not rendered. To achieve this, we will use the 
<code>&lt;%=&nbsp;serverElement.Visible&nbsp;%&gt;</code> property in a class for #clientElement.
</p>
<pre><code>
&lt;div id="clientElement" class="visible&lt;%= serverElement.Visible %&gt;"&gt;
  Blah Blah...
&lt;/div&gt;
</code></pre>
<p>
The class applied to #clientElement when #serverElement is hidden will be visibleFalse and we will hide such elements
in CSS.
</p>
<pre><code>
&lt;style&gt;
  .visibleFalse {display: none;}
&lt;/style&gt;
</code></pre>
<p>
Have any suggestions? Better techniques? Please share below.
</p>
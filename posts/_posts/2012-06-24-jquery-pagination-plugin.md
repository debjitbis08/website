---
layout: post
title: jQuery Pagination Plugin
---
<p>
	I was searching for some jquery plugins to do pagination without knowing anything about the content and which can also handle a lot of pages. My friend suggested a excellent one <a href="http://tutorials.ajaxmasters.com/pagination-demo/" target="_blank">here</a>. I liked the way it worked but had a hard time understanding the algorithm involved. Thus I decided to make a similar one myself to understand the underlying logic. Please note the code I present below is a two hour hack and contains a lot of stupid things that is not recommended.
</p>
<p>
	<strong>Update:</strong> The code has been completely updated. The code can be found in it's <a href="https://github.com/debjitbis08/dynPaginate">github repo</a>.
</p>
<p>
	<a style="font-size: 110%" href="http://www.debjitbiswas.com/media/2012/dynPaginate/demo.html" target="_blank" >View jQuery Pagination Demo</a>
</p>
<p>
	I decided upon the following before starting out with the code:
	<ul>
		<li>
			Nothing should be displayed if there is JavaScript is switched off. I suggest you combine this with your server side implementation, if there is any.
		</li>
		<li>
			This plugin will know nothing about the content that is paginated. It will take the total number of pages and some other settings and will just execute a callback function with current page as a parameter. A better way would be to publish the current page over a channel using pub/sub.
		</li>
		<li>
			The markup to use for page number will be a ordered list, since that is the most semantic choice.
		</li>
	</ul>
</p>
<p>
	The options for this plugin are as follows:
	<dl>
		<dt><code>count</code></dt>
		<dd>The total number of pages</dd>
		<dt><code>adj</code></dt>
		<dd>The maximum number of page numbers to show before and after the currently selected page number</dd>
		<dt><code>edgeCount</code></dt>
		<dd>Number of page numbers to show at the start and end</dd>
		<dt><code>callback</code></dt>
		<dd>Callback function to call when page changes</dd>
		<dt><code>prevText</code></dt>
		<dd>Text for previous link</dd>
		<dt><code>nextText</code></dt>
		<dd>Text for next link</dd>
	</dl>
</p>
<p>
	When a page number is clicked the following takes place:
	<ol>
		<li>
			A function is called to highlight the page number clicked and return the current page number.
		</li>
		<li>
			The next function call adjusts the display of the page number based on the current page number.
			<ol>
				<li>
					If the current page number has less than or equal to <code>adj</code> numbers before it, then it is close to the start. Thus show <code>adj</code> page numbers after it and the last <code>edgeCount</code> numbers.
				</li>
				<li>
					If current page number is greater than the difference between <code>count</code> and <code>edgeCount</code> then it is close to the end. Show the first <code>edgeCount</code> page numbers and the <code>adj</code> numbers before the current page number.
				</li>
				<li>
					Else the current page is somewhere in the middle. Show the <code>edgeCount</code> page numbers at the start and the end. Then show the <code>adj</code> numbers before and after the current page number.
				</li>
			</ol>
		</li>
	</ol>
	If the number of pages is less than <code>(2*adj + 1) + (2*edgeCount)</code> then there is no need do dynamic pagination. Just a list of page numbers are displayed.
</p>
<p>Check out the demo <a href="http://www.debjitbiswas.com/media/2012/dynPaginate/demo.html" target="_blank">here</a></p>
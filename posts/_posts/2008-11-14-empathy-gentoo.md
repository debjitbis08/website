---
layout: post
title: Empathy on Gentoo
---
<p>
	Gtalk with 'talk' is what i was missing on gentoo. 
	Now i have got it work with Empathy 2.24.1. Only Linux to windows tested, 
	Linux to Linux not working. It is possible that there is problem 
	with the other Linux machine i am testing with. 
	Please inform if anyone gets it to work.
</p>

The packages needed with USE flags are:

<ul>
	<li>empathy</li>
	<li>telepathy-stream-engine USE="alsa gnome v4l v4l2 xv  -debug -esd -oss -pulseaudio"</li>
	<li>telepathy-gabble</li>
	<li>telepathy-mission-control</li>
	<li>farsight   USE="jingle msn yahoo -gsm -jpeg2k"</li>
	<li>gst-plugins-farsight  USE="jingle -doc -test"</li>
</ul>
Use Empathy 2.24 or higher, msn and yahoo USE flags are not necessary for gtalk.
I used them for future use.Also v4l2 may not be required. Webcam not tested yet.

Ubuntu and Debian users may install the packages from repository.
Have a look at 
<a href="http://ubuntuforums.org/showthread.php?t=819046">
	http://ubuntuforums.org/showthread.php?t=819046
</a>.
Also for debugging Empathy these instructions are very useful 
<a href="http://live.gnome.org/Empathy/Debugging">
	http://live.gnome.org/Empathy/Debugging
</a>. 
This is how I found what was missing.

<p>
I will repeat the debugging instructions for gentoo (simple path differences)
</p>
<p>
Kill all telepathy relate processes. Quitting empathy should be enough but to make sure you may want to kill them:
<pre class="code">
$ killall empathy mission-control telepathy-gabble telepathy-stream-engine
</pre>
<p>
Start programs in different consoles:
<pre class="code">
   $ GABBLE_PERSIST=1 GABBLE_DEBUG=all /usr/libexec/telepathy-gabble
   $ STREAM_ENGINE_PERSIST=1 STREAM_ENGINE_DEBUG=all /usr/libexec/telepathy-stream-engine
   $ /usr/lib/telepathy/mission-control
   $ EMPATHY_DEBUG=all empathy
</pre>
</p>
Enjoy talking !!!
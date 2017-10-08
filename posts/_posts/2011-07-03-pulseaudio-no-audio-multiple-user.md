---
layout: post
title: PulseAudio No audio for multiple users
---
<p>I recently installed gnome 3 on my Arch Linux system. I have two persons using the system using different accounts and use fast user switch. A very strange issue that I faced was there was no audio for the user who logged in second. I had both the users added to the audio group (which was a wrong thing to do on my system.)</p>
<p>Below is the documentation from PulseAudio wiki page (<a href="http://www.pulseaudio.org/wiki/PerfectSetup" target="_blank">http://www.pulseaudio.org/wiki/PerfectSetup</a>) which gives information about whether users should be added to audio group or not.</p>
<p>I am quoting the section for reference:</p>
<blockquote>
<h2>Should users be in the "audio" group?</h2>
<p>There are three kind of distributions: 1) those who control access to the sound card by adding users to the "audio" group, 2) those who use HAL and ConsoleKit to dynamically give access to the currently "active" user, but allow overriding that using the "audio" group and 3) those who don't use the "audio" group at all, but rely solely on HAL+ConsoleKit to grant access to the sound card. </p>
To find out which group your distribution belongs to, run ls -l /dev/snd. If the permission field of many of the listed files contains a plus character in the end, like this: 
<pre><code>crw-rw----+ 1 root audio 116,  7 Aug  2 08:57 pcmC0D0p</code></pre>
then your distribution most likely belongs to group 2 or 3. If the group of the file is "audio", as above, then the distribution belongs to group 2, otherwise it belongs to group 3. 
If there was no plus character in the permission fields, like in this example: 
<pre><code>crw-rw---- 1 root audio 116,  7 Aug  2 08:57 pcmC0D0p</code></pre>
then your distribution belongs to group 1. 
<p>Now that you know how your distribution does access control to the sound card, it's easy to determine whether you should put users to the "audio" group or not: </p>
<ul>
<li>If your distribution belongs to group 1, you must put all users to the "audio" group or otherwise they can't access the sound card. </li>
<li>If your distribution belongs to group 2 or 3, you should make sure that no one is in the "audio" group. (If you plan running pulseaudio in the system-wide mode, then the special user "pulse" should still be in the "audio" group in order to have access to the sound card.)</li>
</ul>
<p>If your distribution belongs to group 1 or 2, fast user switching doesn't work properly if users are in the "audio" group.</p></blockquote>
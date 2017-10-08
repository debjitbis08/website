---
layout: post
title: Simple touchpad problem
---
<p>
When will i learn sheesh ... I am ok, but i again messed up the basics. I assumed the problem is a complicated one when it was not. Well this what happened, i had my system (Gentoo Linux) up for about two days and i did some updates. I dont remember what they were but some were surely related to the touchpad driver. While testing a program ( front end for linc, cyberoam client ) X restarted and the touchpad scrolling and tapping was lost. I tried a lot of things starting from editing xorg.conf to kernel upgradation, nothing worked. The output of  synclient -m 1000 (monitor touchpad activity) were all zeros. I tried finding any reported bugs, ... anything.
</p>
<p>
Well then at last i found what i looking for in the Gentoo Wiki. Although i did look into the xorg.conf file i assumed that the mouse device specified was the correct one, but i never confirmed it.
</p>
<p>
The touchpad's device file can be can be found using cat /proc/bus/input/devices. The device file name can be found on the Handlers line. This what i get on my system (only the touchpad part shown) :
</p>
<p>
<pre class="code">
I: Bus=0011 Vendor=0002 Product=0007 Version=25b1
N: Name="SynPS/2 Synaptics TouchPad"
P: Phys=isa0060/serio4/input0
S: Sysfs=/class/input/input3
U: Uniq=
H: Handlers=mouse0 event3
B: EV=b
B: KEY=6420 0 70000 0 0 0 0 0 0 0 0
B: ABS=11000003
</pre>
</p>
<p>
In the xorg.conf file the touchpad section had the line
</p>
<p>
<pre class="code">
Option "Device" "/dev/input/event1"
</pre>
</p>
<p>
which should have been
</p>
<pre class="code">
Option "Device" "/dev/input/event3"
</pre>
<p>
Well that's it.<br />
Moral : try out simple solutions first and never assume things. 
</p>
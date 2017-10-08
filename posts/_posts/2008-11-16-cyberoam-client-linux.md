---
layout: post
title: Cyberoam client for Linux
---
<p>
Our college uses cyberoam for internet access. Anyone using the college internet facility has to login the provided username and password. This can be done using a Cyberoam client. There is a HTTP client, i.e. we can access that client using a browser and login, but the problem is the window should be open at all times while using internet.
</p>
<p>
This can be avioded by using a non-http client. Windows users get a nice client with a simple gui. For Linux there is a command line client but as we know not many people like the terminal and its also not open source. So i decided to a gui based client for Linux which would be completely open.
</p>
<p>
As is the norm before writing any open source code its better to look around and observe what has already been done. So in during the search i found this software called linc  which stands for "Linc is not Cyberoam". Its runs as daemon, and can be controlled with signals. It seems all of the difficult work has been done.
</p>
<p>
Well i downloaded and tried installing but it turned out that linc does not compile with gcc 4.3 ( i have gcc version 4.3.2 ), it successfully compiles with gcc 4.1 as others stated. For those who would like to compile it gcc 4.3 i present a small patch.The errors are not too serious, anyone with basic knowledge of C/C++ can correct these errors. I hope it will be fixed in future releases.
</p>
<p>
Here is the patch :
<pre class="code">
diff -uNrB linc-daemon-1.2/Cfg.cpp linc-1.2-working-copy/Cfg.cpp
--- linc-daemon-1.2/Cfg.cpp 2003-04-05 10:42:36.000000000 +0530
+++ linc-1.2-working-copy/Cfg.cpp 2008-11-15 18:42:09.000000000 +0530
@@ -30,6 +30,8 @@
#include &lt;Cfg.h&gt;
#include &lt;encrypt.h&gt;
#include &lt;iostream&gt;
+#include &lt;cstdlib&gt;
+

using std::endl;

diff -uNrB linc-daemon-1.2/CliApp.cpp linc-1.2-working-copy/CliApp.cpp
--- linc-daemon-1.2/CliApp.cpp 2003-04-01 16:43:34.000000000 +0530
+++ linc-1.2-working-copy/CliApp.cpp 2008-11-15 18:44:09.000000000 +0530
@@ -50,6 +50,7 @@
#include &lt;InactiveState.h&gt;
#include &lt;DiscState.h&gt;
#include &lt;DeInitState.h&gt;
+#include &lt;cstdlib&gt;

//! the polling interval (i.e. interval for sending keepalive messages
#define POLLINTERVAL 120
diff -uNrB linc-daemon-1.2/encrypt.cpp linc-1.2-working-copy/encrypt.cpp
--- linc-daemon-1.2/encrypt.cpp 2003-04-05 10:42:37.000000000 +0530
+++ linc-1.2-working-copy/encrypt.cpp 2008-11-15 18:52:15.000000000 +0530
@@ -119,8 +119,8 @@
#define TS_STRLEN 10

//! scramble the timestamp
-u_int16_t ScrambleTimestamp(const string& oStrTimeStamp,
- u_int32_t& rui32Current, u_int32_t& rui32Previous);
+uint16_t ScrambleTimestamp(const string& oStrTimeStamp,
+ uint32_t& rui32Current, uint32_t& rui32Previous);

string Encrypt(const string& rkoStrPlaintext, time_t tTime)
{
@@ -133,14 +133,14 @@
oSrmCiphertext &lt;&lt; oStrTimeStamp;

// Generate ciphertext
- u_int32_t ui32N1=0, ui32N2=0;
+ uint32_t ui32N1=0, ui32N2=0;
for (int i = 0; i &lt; rkoStrPlaintext.size(); i++)
{
// the ith plaintext password character
char cCh = rkoStrPlaintext[i];

// call the scramble routine for the ith time
- u_int16_t ui16Scramble = ScrambleTimestamp(oStrTimeStamp, ui32N1, ui32N2);
+ uint16_t ui16Scramble = ScrambleTimestamp(oStrTimeStamp, ui32N1, ui32N2);

// XOR each timestamp character with the password character
for (int j = 0; j &lt; TS_STRLEN; j++)
@@ -152,7 +152,7 @@
* the encrypted character is an XOR of the char, the high order
* scramble byte and the lower order scramble byte
*/
- u_int16_t ui16Enc = cCh ^ (ui16Scramble & 0xFF) ^ (ui16Scramble &gt;&gt; 8);
+ uint16_t ui16Enc = cCh ^ (ui16Scramble & 0xFF) ^ (ui16Scramble &gt;&gt; 8);

// write the encrypted character as its byte value
oSrmCiphertext &lt;&lt; setw(3) &lt;&lt; setfill('0') &lt;&lt; ui16Enc;
@@ -161,18 +161,18 @@
return oSrmCiphertext.str();
}

-u_int16_t ScrambleTimestamp(const string& oStrTimeStamp,
- u_int32_t& rui32N1, u_int32_t& rui32N2)
+uint16_t ScrambleTimestamp(const string& oStrTimeStamp,
+ uint32_t& rui32N1, uint32_t& rui32N2)
{
- u_int32_t ui32N3 = 0;
- u_int32_t ui32Final = 0;
+ uint32_t ui32N3 = 0;
+ uint32_t ui32Final = 0;

- for(u_int32_t ui32Iter = 0; ui32Iter &lt; TS_STRLEN/2; ui32Iter++)
+ for(uint32_t ui32Iter = 0; ui32Iter &lt; TS_STRLEN/2; ui32Iter++)
{
/* the scrambled text is the XOR of ui32N3 and the ui32Iter'th
- * pair of bytes taken together as a u_int16_t value
+ * pair of bytes taken together as a uint16_t value
*/
- u_int32_t ui32Scramble = ui32N3 ^
+ uint32_t ui32Scramble = ui32N3 ^
((oStrTimeStamp[ui32Iter*2] &lt;&lt; 8) | oStrTimeStamp[ui32Iter*2+1]);

/* I don't pretend to understand the remainder of this compound statement */
@@ -184,7 +184,7 @@
ui32Final ^= rui32N1 ^ ui32N3;
}

- return static_cast&lt;u_int16_t&gt; (ui32Final & 0xFFFF);
+ return static_cast&lt;uint16_t&gt; (ui32Final & 0xFFFF);
}
/*
* This source file is part of linc $Name: rel-1-2 $
diff -uNrB linc-daemon-1.2/main.cpp linc-1.2-working-copy/main.cpp
--- linc-daemon-1.2/main.cpp 2003-04-01 16:43:34.000000000 +0530
+++ linc-1.2-working-copy/main.cpp 2008-11-15 18:44:34.000000000 +0530
@@ -52,6 +52,7 @@
*
*/
</pre>
</p>
<p>
The provided lincrc (sample.linrc) has to be modified and put as .linrcin the home directory of the user. No need to worry about the authinfo field. hwaddr is the MAC address of the network card. It can be found using ifconfig. srvport ( server port) is usually 6060 though it may be different. srvaddr ( server address ) is address of the cyeroam server one connects to login.
</p>
<p>
Linc is run as
<pre class="code">
$ linc
</pre>
</p>
<p>
Linc daemonizes and then it can be asked to logout by sending a SIGUSR2 signal and login using SIGUSR1. When linc is started it automatically logs in. Signals can be sent using killall or kill
</p>
<p>
login
<pre class="code">
$ killall -USR1 linc
</pre>
</p>
<p>
logout
<pre class="code">
$ killall -USR2 linc
</pre>
</p>
<p>
exit linc
<pre class="code">
$ killall linc
</pre>
</p>
<p>
I hope I will be able to extend it include a gui. 
</p>
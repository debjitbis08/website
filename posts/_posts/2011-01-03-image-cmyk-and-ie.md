---
layout: post
title: Image, CMYK and IE
---
<p>Sorry for the strange title of the post, I've been reading Chapter 17 - Cat Rat and Dog of Harry Potter and Prisoner of Azkaban. Today, I came to know about a strange issue (yes, today) where a JPEG image won't show up on IE even though it shows up perfectly on Firefox. After a bit of searching (Google) I came to know that the issue is with the color profiles of the images. All the affected images had <a href="Internet Explorer" target="_blank">CMYK</a> color profile.</p>
<p>CMYK is used in color printing, so for the Web it is better to use RGB color profiles, which is a additive color model and meant for displays.</p>
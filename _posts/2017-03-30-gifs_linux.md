---
layout: post
title:  "How to create a looping GIFs on Linux using ffmpeg"
date:   2017-03-30 23:30:08 +0000
categories: linux
---

Its always fun to make GIFs of your friends and upload them to gif sharing services (Tenor keyboard for example), on Linux this is quite easy task.

1. Create a GIF file:

```
$ ffmpeg -i some_video.mov -ss 6 -t 2.4  -vf deshake -vf scale=320:-1  look.gif
```

What do these parameters mean?
1. ``-ss`` is start of the video
2. ``-t`` is duration
3. ``-vf deshake`` is a filter that should stabilize your shaky hand a bit. 
4. ``-vf scale`` is filter that scales your filter to 320x, preserving the ratio. 

Now lets make loop with ``ImageMagick``:

```
$ convert look.gif -coalesce   -duplicate 1,-2-1 -quiet -layers OptimizePlus  -loop 0 look_cycle.gif
```

This will add reversed gif to the end of the video. This is better for GIFs with short span capturing some simple movement where you can't easily tell that it is happening in reverse.

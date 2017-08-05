---
layout: post
title:  "Syncthing > Dropbox"
date:   2017-08-05 12:16:08 +0000
permalink: /syncthing/
---

I have been using Dropbox for quite some time, I also made a lot of people install it on their computer. Anyway I bought a new phone recently and suddenly I was running out of space - playing with 4k videos and photos in RAW mode.

So I needed more space, these were my options:

- paid Dropbox, the cheapest plan for 1TB is for 9 eur, this is quite a good offer
- MEGA.nz - 50GB for free, thats very nice offer, but their Ubuntu client that should work like dropbox did not work for me. I tried the CLI client but it did not look like something I wanted to deal with.
- Syncthing which was recommended by a bunch of nerds.

I went with syncthing, cause it looked fun.


# How does it work:
![]({{ "/assets/syncthing.png" | relative_url }})


Setting up the network of devices is pretty easy, every device has a unique ID, so when you for example want to link your computer with your phone you only need to scan the computer QR code. Devices connect on the shortest possible way, so if you are on local network it should be very fast. You can read more about that stuff in the official docs so I am not going to rewrite it here. It just works out of the box.


# Always online device

One thing that you need to worry about is that syncthing only works on your devices. So if you want to synchronize your photos you need to have your laptop or at least one device on. The best way to do this is to have a VPS instance somewhere like digitalocean. Setting up that is extremely easy and is well documented.

But with some data you dont trust the server provider. So its time for encryption, there are many options, a good table of different tools can be found here: https://nuetzlich.net/gocryptfs/comparison/. I went with cryfs: https://www.cryfs.org/tutorial (look at the dropbox guide).

After setting up the cryfs I moved there about 8GB of data, this did not work very well and was extremely slow. So now I keep there only ~1GB of important documents and rest is unencrypted.

If you intend to have the cryfs mounted at two computers at the same time you probably want it to use inotify - either set it up manually or use syncthing-gtk. Without inotify I experienced some strange issues of for example newly created file being deleted by the file system because the same fileblocks were being synced by the other computer. So you ideally need inotify to synchronize the files immediately.


## Conclusion

After couple of days of using syncthing I have to say I am mostly pleased. There are couple of things that could be improved:

- encryption should be integrated
- the mobile client should support the option to only save selected files, or some browser where you could download the files when you need them
- on mobile it would be helpful to enable synchronization only when you need it. Right now there are only options to: run it always, only on wifi, only when charging - and combinations. But that also means that you cant quickly download some documents when you need them.
- the device status is sometimes incorrect
- inotify should be integrated directly

But I will stick to it because its kind of fun to have your own network of devices and to see how they all exchange files.

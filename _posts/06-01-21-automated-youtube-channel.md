---
layout: post
title: How to automate a YouTube Channel
date: 2021-03-07 11:00:00 +01:00
modify_date: 2021-01-07 14:00:00 +01:00
tags: automated youtube channel twitch highlights clips
category: blog
---

__tl;dr__ I created a program that takes care of [this](https://www.youtube.com/channel/UC0M8qvpFLG_QoimeBih_6nA) YouTube Channel on its own! Wanna know how? Keep reading!  
I also created a [YouTube video](https://www.youtube.com/watch?v=7zGboBMPjig) covering this blog post.

## The Idea

One day after I streamed on [twitch.tv/scriptworld](https://twitch.tv/scriptworld) I thought about all that footage that gets deleted after the stream ended. What can I do with that data?  
So I got that idea: Shrinking down a 10 hours stream to its most exciting 5 minutes and automatically upload that to YouTube.

After researching and prototyping some hours, I realised, that the outcome still takes human interaction to be a 'nice' video. At some point I already spend weeks into improving my algorithm but yet haven't event uploaded one video you YouTube. Not even a 'bad' one. I needed to get back focussing on a MVP.

Keep it simple. Where can I get some decent footage? Right, Twitch Clips!  
I decided to take the most viewed Twitch clips for a certain game in the past week, cut them together and upload this video to the channel. Automatically, every day another game, repeating after a week.

## Creating the Videos

All code that is creating the Videos is found in my GitHub Repo called [Highzer](https://github.com/breuerfelix/highzer).

### Fetching

Twitch got a really nice [API](https://dev.twitch.tv/docs/v5/guides/clips-discovery#clips-discovery-guide) to discover clips and download them.
```bash
curl -H "Accept: application/vnd.twitchtv.v5+json" \
  -H "Client-ID: uo6dggojyb8d6soh92zknwmi5ej1q2" \
  "https://api.twitch.tv/kraken/clips/top?limit=5&game=Overwatch&trending=false&period=week"
```
This code fetches the top 5 clips based on view count from the game 'Overwatch'. But ... what about the `Client-ID`? Yo need to register a Twitch application for that? Ouh man .... Even though this is free I really don't wanna do that...  
But how can you view the top clips in the browser even if you are not logged in with your account? Right, they got a static `Client-ID` for this purpose. Every non-logged in user uses this particular `Client-ID`. Just grab it from the HTML source in your browser and off you go: `kimne78kx3ncx6brgo4mv6wki5h1ko`.

### Cutting

When searching on Google: [how to cut 2 video clips togehter via cli](https://www.google.com/search?q=how+to+cut+2+video+clips+together+via+cli), you realise, there is this one tool called [ffmpeg](https://ffmpeg.org/) which does the trick.  
But why `via cli`? Simple answer. I want to run this whole script without user interaction. So every information the cutting / merging tool needs to produce my clip, has to be provided as command line arguments.  
Long story short: I experimented for hours with this tool and only got a low quality output without any transition between the clips. Have a look at [this one I uploaded](https://www.youtube.com/watch?v=yOXu4WXhzvo).  
I ended up using an awesome Python Lib called [MoviePy](https://github.com/Zulko/moviepy). With less than 10 lines of code i was able to resize, crossfade and merge my clips together!
```python
def concat_clips(files, out_file):
    clips = list()
    for i, file in enumerate(files):
        clip = VideoFileClip(file).resize((1920, 1080)) \
            .crossfadeout(1).crossfadein(1)

        comp = CompositeVideoClip([clip])
        clips.append(comp)

    final_clip = concatenate_videoclips(clips, method="chain")
    final_clip.write_videofile(out_file)
```
This felt so great after my ffmpeg struggle.

## Uploading

All the code for handling the uploads is found in [this GitHub Repo](https://github.com/breuerfelix/youtube-uploader).  
At first i thought: YouTube got an API right? Uploading should be the easy part of this project. Then i ended up spending 10x more time than i actually wanted. As always...  
Turns out that once you uploaded a Video with the YouTube API, it will be private and you won't ever be able to make it public. Unless you have a YouTube verified API. Tried getting this one -> no luck! Why? Not even YouTube was able to tell me that!

So... what to do when APIs suck? Right... Chromedriver! This time i wanted to try out pupeteer because it is a Google Product and i wanted to fight YouTube with its own weapons! Screw you!  
The code is nothing fancy, just have a look at those files in the repo. I encoutered just one weird thing... When i try to run the youtube-uploader in headless mode, the YouTube page stays blank. If i remove all cookies (so i am not logged into my Google account), YouTube loads fine. I login to Google -> run in headless mode -> blank website.  
It seems like YouTube is preventing me to browse headless while being logged into my account. Until today, i don't know how to solve it since i didn't spend more time investigating, even though this topic is really interesting!  
If you experienced similar problems, let me know in the comments, i am curious!

How did i upload my videos now? Since my Server got now user interface, i put RaspbianOS on my Raspberry Pi which now handles the uploading everyday for me.

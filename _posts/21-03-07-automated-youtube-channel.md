---
layout: post
title: How to automate a YouTube Channel
date: 2021-03-07 11:00:00 +01:00
modify_date: 2021-03-07 14:00:00 +01:00
tags: automated youtube channel twitch highlights clips
category: blog
---

__tl;dr__ I created a program that manages [this](https://www.youtube.com/channel/UC0M8qvpFLG_QoimeBih_6nA) YouTube Channel on its own! Want to know how? Keep reading!  
I also created a [YouTube video](https://www.youtube.com/watch?v=7zGboBMPjig) covering this blog post.

## The Idea

One day after I streamed on [twitch.tv/scriptworld](https://twitch.tv/scriptworld), I thought about all that footage that gets deleted after the stream ends. What can I do with that data?  
So I got this idea: Shrink a 10-hour stream down to its most exciting 5 minutes and automatically upload that to YouTube.

After researching and prototyping for a few hours, I realized that the outcome still required human interaction to be a 'nice' video. At some point, I had already spent weeks improving my algorithm but still hadn't even uploaded one video to YouTube—not even a 'bad' one. I needed to get back to focusing on an MVP.

Keep it simple. Where can I get some decent footage? Right, Twitch Clips!  
I decided to take the most viewed Twitch clips for a certain game in the past week, cut them together, and upload this video to the channel. Automatically, every day another game, repeating after a week.

## Creating the Videos

All the code that creates the videos can be found in my GitHub repo called [Highzer](https://github.com/breuerfelix/highzer).

### Fetching

Twitch has a really nice [API](https://dev.twitch.tv/docs/v5/guides/clips-discovery#clips-discovery-guide) to discover clips and download them.
```bash
curl -H "Accept: application/vnd.twitchtv.v5+json" \
  -H "Client-ID: uo6dggojyb8d6soh92zknwmi5ej1q2" \
  "https://api.twitch.tv/kraken/clips/top?limit=5&game=Overwatch&trending=false&period=week"
```
This code fetches the top 5 clips based on view count from the game 'Overwatch'. But ... what about the `Client-ID`? You need to register a Twitch application for that? Oh man... Even though this is free, I really don't want to do that...  
But how can you view the top clips in the browser even if you are not logged in with your account? Right, they have a static `Client-ID` for this purpose. Every non-logged-in user uses this particular `Client-ID`. Just grab it from the HTML source in your browser and off you go: `kimne78kx3ncx6brgo4mv6wki5h1ko`.

### Cutting

When searching on Google: [how to cut 2 video clips together via cli](https://www.google.com/search?q=how+to+cut+2+video+clips+together+via+cli), you realize there is this one tool called [ffmpeg](https://ffmpeg.org/) which does the trick.  
But why `via cli`? Simple answer: I want to run this whole script without user interaction. So every piece of information the cutting/merging tool needs to produce my clip has to be provided as command line arguments.  
Long story short: I experimented for hours with this tool and only got a low-quality output without any transitions between the clips. Have a look at [this one I uploaded](https://www.youtube.com/watch?v=yOXu4WXhzvo).  
I ended up using an awesome Python library called [MoviePy](https://github.com/Zulko/moviepy). With less than 10 lines of code, I was able to resize, crossfade, and merge my clips together!
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

All the code for handling the uploads can be found in [this GitHub repo](https://github.com/breuerfelix/youtube-uploader).  
At first, I thought: YouTube has an API, right? Uploading should be the easy part of this project. Then I ended up spending 10x more time than I actually wanted. As always...  
Turns out that once you upload a video with the YouTube API, it will be private and you won't ever be able to make it public—unless you have a YouTube verified API. Tried getting this one -> no luck! Why? Not even YouTube was able to tell me!

So... what to do when APIs suck? Right... Chromedriver! This time I wanted to try out Puppeteer because it is a Google product and I wanted to fight YouTube with its own weapons!  
The code is nothing fancy, just have a look at those files in the repo. I encountered just one weird thing... When I try to run the youtube-uploader in headless mode, the YouTube page stays blank. If I remove all cookies (so I am not logged into my Google account), YouTube loads fine. I log in to Google -> run in headless mode -> blank website.  
It seems like YouTube is preventing me from browsing headless while being logged into my account. Until today, I don't know how to solve it since I didn't spend more time investigating, even though this topic is really interesting!  
If you have experienced similar problems, let me know in the comments—I'm curious!

How did I upload my videos now? Since my server has no user interface, I put RaspbianOS on my Raspberry Pi, which now handles the uploading every day for me.

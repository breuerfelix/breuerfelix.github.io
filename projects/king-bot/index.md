---
layout: project
title: KingBot - Automate Travian Kingdoms
date: 2018-06-18 22:15:00 +01:00
modify_date: 2018-06-19 07:50:00 +01:00
tags: selenium bot automation travian kingdoms python
category: project
---

Welcome to my personal documentation site for [king-bot](https://github.com/scriptworld-git/king-bot).

Since I already wrote a really good documentation on the original GitHub repository, it would be kinda dumb to copy and paste the readme.md onto this website.  
That's why I decided to talk more about the 'why' on this project page.

## general

The project is written in [Python 3](https://www.python.org) with the [Selenium](http://selenium-python.readthedocs.io) package. Selenium is a tool for automating your tasks.  
It opens a new browser instance which can be controlled by code.  
My project [Series-Monitor](/projects/series-monitor) was also writte with the help of selenium, but I wrote it in Java so there is way more overhead than a project written in python.  
That was acceptable because it also had a GUI, king-bot was originally planned without a gui. At least the core of it.

Another good reason to write this project in python was the fact that I never ever written even one line in python and really wanted to learn this language, since it is really popular in the automated testing industry.

#### why travian kingdoms ?

Good question.  
I played that game some years ago, the old and new version, and had alot of fun doing so.  
The community is really friendly and I had the pleasure to meet plenty of nice people.

There is one bad factor about this game. You need to be online **alot** to be a successful player.  
Seems fair right ? No. You only have to click once every 10 min, send your farmlists and leave the game again...  
That was really boring and frustrating cause no one wants to get up in the middle of the game just for a little browsergame.

In the past I solved this problem with a little 'auto-clicker' tool, running the whole night, pressing one single button.  
This was okay but I wanted more features like adding new farms and removing red farms from the farmlist.

The idea of king-bot was born !

Unfortunately I had no spare time programming the bot because of other projects. I wanted to learn web development instead.  
Now, some months later I finally started this project with it's basic features in hope that many other people will join and help me improving this bot.

## classes

In general I choosed one class for every component in the game.  
That helped alot because once you initialized all villages for example, you just have to call one function `openVillage(2)` on the gameworld class and you opened it.  
There is no need for defining every possible state of the game in functions because a class always knows its state and can handle accordingly to it.

This helps alot when programming new features because it's really easy to associate them with one of those gameobjects.

I got classes for:

-   account
-   gameworld
-   village
-   (resource/building) slot

## custom driver

Seleniums base driver class is really good in general, but I am a huge fan of short function names and deep class structures.  
That allows me to make easier changes on general tasks like finding and element.

There is one example I wanna mention to explain myself a little bit better.  
If I want to wait after clicking on a button for the page to load, you can simply put a `time.sleep(2)` statement after your click.  
I decided to make a function on my custom browser class like the following:

```python
def sleep(self, seconds):
    time.sleep(seconds)
```

At first many people might say:

> uhm that is really ridiculous !

A few days later I implemented the headless mode and this function saved my life.

After a while I thought:

> well, the browser is alot faster because it doesn't have to load all the images... now I have to adjust all my sleep times to be shorter, or no one will ever notice the bot being faster in headless mode'.

Having the function 2 lines of code later I was done adjusting the sleep times in headless mode.  
After setting a class attribute called `self.headless = True` I edited my function:

```python
def sleep(self, seconds):
    if self.headless:
        seconds = seconds / 2

    time.sleep(seconds)
```

Done.

Life can be really easy sometimes, just think a little into the future when planning your project.  
Make things like that your habit, and your are good to go.

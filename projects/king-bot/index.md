---
layout: project
title: KingBot - Automate Travian Kingdoms
date: 2018-06-18 22:15:00 +01:00
modify_date: 2018-06-19 07:50:00 +01:00
tags: selenium bot automation travian kingdoms python
category: project
---

## installation

1.  install python3 for your system
    1.  [get python](https://www.python.org/downloads/)
2.  install selenium package
    1.  open console as administrator
    2.  `pip3 install selenium`
3.  clone this repository
4.  download chromedriver for your system
    1.  [get chromederiver](http://chromedriver.chromium.org)
    2.  edit chromedriver path in `start.py` line 7
        1.  `chromedriverPath = 'enter path here'`
5.  store your login credentials
    1.  create `credentials.txt` file
    2.  write your email and password like following
    3.  `test@gmail.com;my_password`
    4.  save the file
6.  edit `start.py`
    1.  edit your gameworld in line 8 `world = 'COM4'`
        1.  make sure to use uppercase!
    2.  place the actions your bot have to do at the end
        1.  read documentation for this
7.  execute in console:
    1.  `python3 start.py`
    2.  read documentation for options like remote browser or headless browsing

## documentation

### specify the bot

#### adventures

```python
game.enableAdventures()
```

this enables auto sending the hero on adventures.  
be careful if the hero in low on health! there is no stopping mechanism for now.

#### upgrade resource fields

```python
game.upgradeSlot(0, 5)
```

this function will upgrade the resource field with id 5 one level in your first village.

on the picture below you can see all field id's. these stay the same no matter what kind of village you have (even in 15er crop villages).

![resource-fields](/assets/king-bot/resourceFields.png)

### start options

#### remote browser

if the script exists because of an exception, it's possible to re-use the browser session so you don't have to go through the whole login process again.  
just don't exit the browser window and make sure to remove the functions in the script, which the bot already completed in last session.

start the script with the following command:

```bash
$ python3 start.py -r
```

#### headless browsing

if you don't wont a browser window to pop up, or using the script on a dedicated server with no gui, it is possible to run the script in headless mode.  
the console window will inform you about important actions the bot will do.

start the script with the following command:

```bash
$ python3 start.py -h
```

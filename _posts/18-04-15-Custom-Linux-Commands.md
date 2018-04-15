---
layout: post
title: Create custom Linux Commands
date: 2018-04-15 09:00:00 +01:00
modify_date: 2018-04-15 15:00:00 +01:00
tags: linux bash customcommands
category: tutorial
---

Sometimes I am really bored of typing the same commands all over again for example when building my Jekyll Blog into a certain folder (`bundle exec jekyll build --destination /var/www --watch &`) or moving to a specific folder just to perfom a `git pull` request.

A really good way of handling that problem is to create your own Shell Scripts, which can be executed from any location, just like `apt-get`.<!--more-->

## Create a Script Directory
First of all we need to find a good location to store all of our scripts.  
I usually create a folder named `shell-scripts` in the `/var` Directory.
```bash
$ cd /var
$ sudo mkdir shell-scripts
```
All files in this folder need to be execute- and editable (we dont always wanna `sudo` to edit our scripts).
```bash
$ sudo chmod -R 777 /shell-scripts
```
__Everybody__ is able to execute __everything__ in the folder `/var/shell-scripts` now.

## Customize PATH Locations
After creating the Directory we have to make sure our system knows the location of these scripts.  
That allows us to execute these in any Directory we are currently in.  
Open `.bashrc` file with any editor you like (I use the __Vi-Editor__ - [Tutorial here](http://www.openvim.com)).
```bash
$ sudo vi ~/.bashrc
```
Now we gonna add our freshly created `shell-scripts` folder to the PATH-Locations.  
Append following content:
```bash
# global shell scripts
export PATH=$PATH:/var/shell-scripts
```
Save and close the file.  
To make sure the System reloads the file you can either relog your user or proceed with the following command:
```bash
$ source ~/.bashrc
```

## Write a Shell Script
Finally we are ready to deploy our first custom command.  
In this example we want to perform a `git pull` request in a folder named in `/etc/gitrepo` just by typing `pullgit` anywhere on the system.  

Head over to our `shell-scripts` folder and create a file.  
__The name of the file will be the command you have to type in the console later on!__  
```bash
$ cd /var/shell-scripts
$ touch pullgit
```
Open the file with your preferred editor.
```bash
$ vi pullgit
```
Write everything down that should be executed with your custom command.  
In our example this will be a really short script.
```bash
#!/bin/bash
cd /etc/gitrepo
git pull
```
Save and close the file.  
Just repeat this chapter for all of your furhter custom commands.

## Use your Command
Once we are done setting up the locations and writing our scripts it's time to try everything out!  
It doesn't matter in which directory you are in just type the name of the file you created.  
In our example it would be:
```bash
$ pullgit
```

## ToDo
- Explain possibilities
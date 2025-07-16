---
layout: post
title: Create custom Linux Commands
date: 2018-04-15 09:00:00 +01:00
modify_date: 2018-04-16 22:00:00 +01:00
tags: linux bash customcommands shellscripts alias
category: tutorial
---

Sometimes I get really bored of typing the same commands over and over again. For example, when building my Jekyll Blog into a certain folder (`bundle exec jekyll build --destination /var/www --watch &`) or moving to a specific folder just to perform a `git pull`.

A great way to handle this problem is to create your own shell scripts, which can be executed from any location, just like `apt-get`.<!--more-->  
It's also possible to pass parameters to these custom commands. For example: `apt-get install ruby`.

## Create a Script Directory
First of all, we need to find a good location to store all of our scripts.  
I usually create a folder named `shell-scripts` in the `/var` directory:
```bash
$ cd /var
$ sudo mkdir shell-scripts
```
All files in this folder need to be executable and editable (we don't always want to use `sudo` to edit our scripts):
```bash
$ sudo chmod -R 777 /shell-scripts
```
__Everybody__ is now able to execute __everything__ in the folder `/var/shell-scripts`.

## Customize PATH Locations
After creating the directory, we have to make sure our system knows the location of these scripts.  
That allows us to execute them in any directory we are currently in.  
Open the `.bashrc` file with any editor you like (I use the __Vi-Editor__ - [Tutorial here](http://www.openvim.com)):
```bash
$ sudo vi ~/.bashrc
```
Now we're going to add our freshly created `shell-scripts` folder to the PATH locations.  
Append the following content:
```bash
# global shell scripts
export PATH=$PATH:/var/shell-scripts
```
Save and close the file.  
To make sure the system reloads the file, you can either relog your user or proceed with the following command:
```bash
$ source ~/.bashrc
```

### Add Path to 'sudo' Location
There is another location file we have to modify if we want to execute our shell scripts with `sudo` permissions.  
This step is optional if you want to create only non-root commands.
```bash
$ sudo visudo
```
Search for `secure-path=` and append our folder:
```bash
Defaults secure-path="... :/var/shell-scripts"
```
Save and close the file.

## Write a Shell Script
Finally, we are ready to deploy our first custom command.  
In this example, we want to perform a `git pull` request in a folder named `/etc/gitrepo` just by typing `pullgit` anywhere on the system.  

Head over to your `shell-scripts` folder and create a file with 777 permissions.  
__The name of the file will be the command you have to type in the console later on!__  
```bash
$ cd /var/shell-scripts
$ touch pullgit
$ sudo chmod 777 pullgit
```
Open the file with your preferred editor:
```bash
$ vi pullgit
```
Write everything that should be executed with your custom command.  
In our example, this will be a really short script:
```bash
#!/bin/bash
cd /etc/gitrepo
git pull
```
Save and close the file.  
Just repeat this chapter for all of your further custom commands.

### Passing Parameters
echo firstparam
echo secondparam
It is also possible to pass parameters to our commands (shell scripts).  
A sample code with two passed parameters would look like this:
```bash
#!/bin/bash
firstparam="$1"
secondparam="$2"
echo $firstparam
echo $secondparam
```
Usage:
```bash
$ testscript hello world
hello
world
```

## Use your Command
Once we are done setting up the locations and writing our scripts, it's time to try everything out!  
It doesn't matter which directory you are in—just type the name of the file you created.  
In our example, it would be:
```bash
$ pullgit
```
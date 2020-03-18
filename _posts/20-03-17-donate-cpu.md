---
layout: post
title: Donate CPU for Cancer, COVID-19 and co.
date: 2020-03-17 11:00:00 +01:00
modify_date: 2020-03-18 11:00:00 +01:00
tags: foldingathome corona cancer covid19 rosetta boinc donate cpu
category: blog
---

__TL;DR:__ Run `docker run -d johnktims/folding-at-home` to donate your spare CPU power!

As a software developer you probably rent some sweet little servers to host all your wonderful awesome services.  
You probably also realised that there are not that many people using your services so the server is always running at `0.01` load.  
So what should you do with all that idle compute power?? <!--more-->

I stumbled across [folding@home](https://foldingathome.org/) but all the setup guides doesn't fit my needs since in a dockerized world I do not want to install anything (except docker).  
I also found [Boinc](https://boinc.berkeley.edu/) which got native docker support but it is a little weird to get started at first.

__Important:__ These programs run as 'low priority' threads. If your other programs need more CPU power, they will get it!

__[Docker? What the heck?](https://www.ibm.com/cloud/learn/docker)__

## folding@home

### Docker

A simple one-liner. Works out of the box!

```bash
docker run --restart always --name folding -d -p 7396:7396 johnktims/folding-at-home:latest \
    --user=Anonymous --team=0 --gpu=false --smp=true --power=full

# short version with above as default values
docker run -p 7396:7396 -d johnktims/folding-at-home

# stop and remove
docker stop folding && docker rm folding
```

If you have an account you can also add the `--passkey=<insert_key>` parameter and change the user.  
There is a neat web ui at `http://localhost:7396` to see what you are currently doing.  
Available `--power` settings are `light`, `medium` and `full`.  
`--user=Anonymous` and `--team=0` basically means: help anybody who needs help and do not add credits to an account.

### Windows / Mac

I highly recommend to only run this program on a desktop computer or when connected to a powersource because it will drain your battery since it is using all the available CPU power on your system.  
You can, of course, also use docker here, but why not have a nice gui?

Since this is well documented already, I won't go into detail here.

[Official Windows Guide](https://foldingathome.org/support/faq/installation-guides/windows/)  
[Official Mac Guide](https://foldingathome.org/support/faq/installation-guides/mac/)

### Account

If you want to track all the work you did you can set up an account [here](https://apps.foldingathome.org/getpasskey).  
You will get a passkey and username via email.

### Errors

```
14:43:03:ERROR:WU00:FS00:Exception: Could not get an assignment
```

If you see this 'error' log, don't worry, there is just nothing to do right now. It will try again later and maybe pick up some work!  
That means there are alot of people donating right now. Keep it up!

## Boinc

First you have to pick a project. One client can only participate for one project at a given time.  
[Click here](https://boinc.berkeley.edu/projects.php) for a list of all projects.

I pick [Rosetta@home](http://boinc.bakerlab.org/rosetta/) for this guide because they are currently working on COVID-19.

First you have to create an account at the [Rosetta Project Page](https://boinc.bakerlab.org/rosetta/create_account_form.php).  
Once you are logged in go to the secion `Account Information` and click on `show` to see the `Account key`.  
At the bottom you will see a `weak account key`. Grab this one, we need it!

### Docker

```bash
# run
docker run --restart always -d --name boinc --net=host --pid=host \
    -e BOINC_CMD_LINE_OPTIONS="--attach_project http://boinc.bakerlab.org/rosetta/ <weak_account_key>" boinc/client

# stop and remove
docker stop boinc && docker rm boinc
```

If you want to support another project, just swap the project url with the new account key and you are good to go.  
If you need more configuration just have a look [here](https://hub.docker.com/r/boinc/client) to connect a remote GUI RPC.

### Desktop

[Click here](http://boinc.bakerlab.org/rosetta/join.php) to setup the desktop version or even an Android app.

### Errors

```
No protocol specified
```

If this will be spammed in the docker logs... don't worry about it! It is just a warning.  
I still have to figure out how to surpress this.

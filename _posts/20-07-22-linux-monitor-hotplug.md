---
layout: post
title: Hotplug external Monitors on Linux
date: 2020-07-25 11:00:00 +01:00
modify_date: 2020-07-26 11:00:00 +01:00
tags: linux external monitor hotplug i3 windowmanager
category: blog
---

I am using i3 window manager which is automatically creating workspaces for new monitors.  
The problem is that `xrandr` is not enabling my external monitors when i plug them in (or remove them when unplugging them).<!--more-->

`xrandr --output HDMI2 --auto --left-of eDP1` for example enables your external monitor and put it left of your internal display.  
`eDP1` often refers to the internal laptop display.

`udevadm` is a tool which fires events on hardware changes like USB or HDMI hotplug.  
`udevadm monitor` displays these events on the console.

Create a file named `95-monitor-hotplug.rules` in `/etc/udev/rules.d/` with the following content:
```conf
KERNEL=="card0", \
ACTION=="change", \
SUBSYSTEM=="drm", \
ENV{DISPLAY}=":0", \
ENV{XAUTHORITY}="/home/felix/.Xauthority", \
RUN+="/home/felix/dotfiles/programs/hotplug.sh"
```

Modify the paths to fit your system.

Content of `hotplug.sh`:
```bash
#! /usr/bin/bash

export DISPLAY=:0
export XAUTHORITY=/home/felix/.Xauthority

function connect() {
    xrandr --output $1 --left-of eDP1 --auto
    # this moves the current workspace to the new created one from i3
    i3 move workspace to output left
}

function disconnect() {
    xrandr --output $1 --off
}

function main() {
    # list of all different HDMI ports on docking stations etc.
    for disp in 'DP2' 'HDMI2' ;
    do
        xrandr --query | grep "$disp connected" &> /dev/null && connect $disp || disconnect $disp
    done

    # restart window manager
    i3 restart
}

# start it forked so the monitor is active
# this is needed because udev activates the monitor
# AFTER this script returns
main &
```

If you need more explanation of some parts in more detail, let me know in the comments or via email.

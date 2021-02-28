---
layout: post
title: Getting started with NixOS and Home-Manager
date: 2021-01-06 17:00:00 +01:00
modify_date: 2021-01-07 11:00:00 +01:00
tags: nixos nix linux homemanager
category: blog
---

- use home-manager
- put it in configuration -> do not let him manager himself

- show shortcuts
- why home manager ? because you do not want everything to be installed as root
- show how to launch i3 or plasma
- put comments everywhere
- make it a git repo
- show all commands needed

- difference enable and installation
- make nix configuration file editable by yourself


manual commands:
- git clone dotfiles
- plugInstall (vim)
- UpdateRemotePlugins (wilder)
- take out python host in vimrc file

fatlabel /dev/... LABEL
cryptsetup config /dev/... --label LABEL

nix channel add home manager
nix channel update

close dotfiles to /config


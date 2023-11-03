---
layout: post
title: "Enhancing your Workflow: Must-Have Applications for Power Users on MacOS"
date: 2023-11-03 09:00:00 +01:00
tags: macos workflow productivity raycast yabai amethyst skhd karabiner-elements arc vivaldi vim neovim homebrew
category: blog
---

In the world of technology, power users are the enthusiasts who go above and beyond in customizing their computing experience. They are the ones who seek to optimize every aspect of their workflow, squeezing every drop of productivity from their devices. For many power users, Linux is the preferred operating system due to its unparalleled customizability. In this post, we'll delve into some essential applications that can supercharge your productivity, streamline your workflow, and help you become a true power user. While we won't delve into the terminal here (that's a story for another day), we'll explore some indispensable tools for your arsenal.

## Application Launcher: Boosting Efficiency

Application launchers are essential tools for power users, allowing you to quickly access and execute applications, commands, and scripts with minimal effort. One remarkable launcher for macOS is [Raycast](https://www.raycast.com/). This tool takes application launching to the next level.

**Raycast** offers a highly customizable interface, allowing you to set up quicklinks to your most frequently used tools, applications, and actions. Whether it's managing your passwords with **Bitwarden**, navigating your **GitHub** or **GitLab** repositories, or accessing your clipboard history, Raycast simplifies these tasks with its Quicklinks feature.

Additionally, Raycast supports a variety of plugins available through the Raycast Store, providing endless possibilities for enhancing your workflow.

## Tiling Window Manager: Organize Your Workspace

A window manager controls the layout and arrangement of windows on your screen. Tiling window managers, in particular, are beloved by power users for their efficiency and organization. Two notable options for macOS are [Yabai](https://github.com/koekeishiya/yabai) and [Amethyst](https://ianyh.com/amethyst/).

**Yabai** is a popular choice due to its active development community. With Yabai, you can establish rules that prevent it from managing dialog windows or system settings, ensuring that it seamlessly integrates into your workflow. For example, you can set a rule that excludes system preferences from window management.

## Keybindings: Mastering Efficiency

Efficient keybindings are a hallmark of a power user's setup. To configure keybindings on macOS, two applications stand out: [Karabiner Elements](https://karabiner-elements.pqrs.org/) and [skhd](https://github.com/koekeishiya/skhd).

**Skhd** is especially useful for setting up keybindings for Yabai because it simplifies binding shell commands to keyboard shortcuts. For instance, you can bind a Yabai command like moving a window to a specific workspace with ease.

On the other hand, **Karabiner Elements** excels at handling complex keybindings, such as remapping keys or creating conditional keybindings for specific contexts, like "Ctrl is Command and Ctrl is Ctrl while in the terminal."

To streamline your keybinding setup, the **Karabiner Event Viewer** is a handy tool for debugging keyboard and mouse inputs.

## Browsers: Taking Control of Your Web Experience

Power users often gravitate towards browsers like [Vivaldi](https://vivaldi.com/) and [Arc](https://arc.net/) for their unparalleled customization options. These Chromium-based browsers allow users to rebind virtually every shortcut, a level of control not found in mainstream browsers like Chrome or Firefox. Moreover, they support native vertical tab layouts, perfect for managing numerous open tabs.

For even greater control over web navigation, consider the **Vimium** extension. Vimium lets you navigate the web using keyboard shortcuts, making browsing lightning-fast. For instance, pressing "f" highlights clickable links on a page, and you can activate them with keystrokes like "gh."

## Vim: Mastering Text Editing

Text editing is a fundamental task for many power users. While [Neovim](https://neovim.io/) is a popular choice among developers, it does have a steep learning curve. If you're new to Vim-style editing, start by installing a Vim plugin for your current editor and gradually acclimate to its functionality. Keep in mind that becoming proficient in Vim requires time and dedication, and it may not be for everyone.

## Homebrew: Managing Your Tools

[Homebrew](https://brew.sh/) is a package manager for macOS that simplifies the installation and management of software. Power users love it for its ability to keep track of installed packages and quickly uninstall them. Additionally, you can export a list of all installed brews, making it painless to set up a new Mac with your preferred tools.

## Other Useful Tools: Fine-Tuning Your Workflow

Beyond the core applications, several additional tools can enhance your productivity:

- [Meeting Bar](https://meetingbar.app/): Displays upcoming meetings in your macOS status bar, ensuring you never miss important appointments.
- [Sketchybar](https://felixkratz.github.io/SketchyBar/): An alternative macOS status bar for those who want to add a touch of style to their desktop.
- [Timeout](https://apps.apple.com/de/app/time-out-break-reminders/id402592703?mt=12): Periodically blurs your screen for a few seconds to reduce eye strain during long working hours.

## Don't Forget to Relax

While optimizing your workflow is essential, it's equally important to find balance. You don't need to be a power user 24/7. Allow yourself time to relax and enjoy your computer for leisure activities. After all, creativity often thrives when you're not solely focused on productivity.

In conclusion, becoming a power user involves tailoring your computing environment to suit your needs. These applications and tools provide the means to create a highly customized and efficient workspace, but remember that the journey toward becoming a power user is personal and should align with your goals and preferences. So, go forth, explore, and make your digital world truly your own.

<details markdown="1"> 
<summary>
This article is generated with ChatGPT 3.5. Click to reveal my prompt.
</summary>
expand the following article to be published on a technology blog and optimize it for search engines:

## introduction

explain what a power user is
power users often use linux because of its customizability
many developers use macos because of its simplicity

in this post i wanna share some of the applications i use to enhance my workflow on a mac operating system
i wont go into detail about my terminal because this is a another big story i wanna cover in a different post

## application launcher

briefly explain what application launchers are

- raycast
- briefly explain what raycast is

explain what can be done with raycast quicklinks

raycast has multiple plugins that can be installed via the raycast store
some examples i use really often:
- bitwaren (password manager)
- github / gitlab
- clipboard history

## tiling window manager

- briefly explain what a window manager is and what tiling means

there are 2 out there for macos:
- yabai
- amethyst

i use yabai since the github repo has more drive

you can set rules with yabai so that it does not manage dialog windows or system settings
give an example to this

## keybindings

- karabiner elements
- skhd

i set all my yabai keybindings with skhd since it makes it easy to bind shell commands
give an example on how to bind a yabai command with skhd

complex keybindings are done with karabiner elements like "ctrl is command and ctrl is ctrl while in the terminal"
give an example on how to set a karabiner elements via json

karabiner event viewer is pretty good for debugging keyboard and mouse input

## browser

there are some browsers that are used by power users like vivaldi and arc
they allow users to rebind every shortcut unlike chrome or firefox
both are chromium based so you can install all chrome browser extensions
they are the only browsers that allow native vertical tab layout

there is a chromium plugin called vimium which lets you navigate the web via shortcuts, pressing f will highlight every clickable link on the current site and mark them with a keystroke like "gh", if you press "gh" it will then click this link for you

## vim

i personally use neovim for my development but that has a steep learning curve and you really need to want this.
better start of with installing a vim plugin for the editor you currently use and get used to it slowly.
you dont have to fully commit to coding in the terminal, even though it looks badass and you are a king when pair programming but it wont make you a fast or better programmer. IDEs like intelliJ are really good and offer a really good bundle. vim is only for people that really want to take time and configure their IDE as their needs.

## homebrew

briefly explain homebrew
i use it to install nearly all of my tools in order to track what i have installed on my system and to uninstall them easily
also you can export a list of all installed brews in order to ease setting up a new mac

## other useful tools

- meeting bar
  - it displays upcoming meetings in your macos status bar so you never miss them even though you are in the zone
- sketchybar
  - alternative macos status bar (looks fancy but does not increase productivity at all)
- timeout
  - blurs your screen every x minutes for some seconds to release strain on your eyes
  - it is not good to look at the same distance for ours
  - try to look outside the window during this short break

## dont freak out

sometimes it is also good to just lay back and enjoy browsing or coding. there is no need to be a power user 24/7.
i personally have my power user hours where i got an idea and i wanna dump my brain farts as fast as possible into bad code and that has to be as fast and efficient as possible since these hours usually dont last long for me that is why i have to use them!
</details>

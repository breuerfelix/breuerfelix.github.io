---
layout: post
title: react-native-app with expo.io on coder.com
date: 2018-08-04 11:00:00 +01:00
modify_date: 2018-08-05 11:00:00 +01:00
tags: expo.io react-native coder.com js
category: tutorial
---

In the past few weeks, I learned about [react-native](https://facebook.github.io/react-native/), [coder.com](https://coder.com), and [expo.io](https://expo.io).  
My brain went kind of crazy and wanted to connect these things into one, so I could develop my app wherever I want with only a browser and my phone.<!--more-->

For those who don't know about these technologies, I'll explain them real quick.

__react native:__  
Developing cross-platform apps by only using JavaScript.

__expo.io:__  
Testing and deploying your app directly onto your phone without a virtual machine.

__coder.com:__  
Browser-based, cloud IDE.

## creating your project

First of all, we need to create an account on coder.com and a project on their website.  
After opening the empty project, we are able to hit the 'console' button on the left toolbar.

Since we are not able to install global packages on this small virtual machine, many people didn't even try to init a new expo project.  
Normally, you need a globally installed `expo-cli` module. We are going to install it locally, and still access its commands.

```bash
$ npm install expo-cli
```

This is going to take a while if fast-mode is disabled. When finished, we get a `node_modules` folder with all of our `expo` commands.  
These commands are located in `node_modules/.bin/expo`. Now we can init our project:

```bash
$ ./node_modules/.bin/expo init my_new_project_name
```

Choose between blank or sample project and hit `ENTER` to finish the setup.

Delete your old project files:

```bash
$ rm -rf node_modules
$ rm package-lock.json
```

Copy your new project into the root directory of this project and remove the old files:

```bash
$ cp -a ./my_new_project_name/. ./
$ rm -rf ./my_new_project_name
```

To use our `exp` commands in the future, the last step we need to do is install the package again.  
We also have to make sure all packages are installed correctly.

```bash
$ npm install exp
$ npm install
```

## setting up your project

If we want to run an exp command now, we'll always have to type `node_modules/.bin/exp`, which is really time-consuming.  
Node.js knows about its `.bin` directory. We just have to edit the commands in `package.json`.

Change all of your scripts to these (I only changed `expo` to `exp`):

```json
"scripts": {
    "start": "exp start",
    "android": "exp start --android",
    "ios": "exp start --ios",
    "eject": "exp eject"
 }
 ```

Another way is to install `expo-cli` locally. But that's a little bit more overhead.

```bash
$ npm install expo-cli
```

### ports

We can already run our server with `$ npm start`, but the server would only run on the local machine.  
We couldn't connect to it via the Expo app.

coder.com only supports a few ports that are available for a connection outside our black box.  
These are: [80, 3000, 3001, 8000, 8080, 9000, 9080]

Expo needs two ports, so we're going to choose 8000 and 8080 in this tutorial.

To change the port for Expo, we need to create a file called `.exprc` in our root folder and paste the following content:

```json
{
    "manifestPort": "8000"
}
```

The Metro bundler will still be on port 19001. To change this, we need to edit our `app.json` file.  
Search for `"expo": {}` and insert the following as another option to expo:

```json
"packagerOpts": { "port": 8080 }
```

### address

The addresses of our links are still going to be a local IP address, even though coder.com is tunneling our connections outside.

When the server is running (`npm start`), coder is recognizing our connections.  
To check that, just click on the globe symbol on the left side.  
We should see two links right now. They should be similar to this one:  
`https://8000-interestmisshapenseal.cdr.co`

These are our new addresses. All we have to do now is tell node that it should proxy our connections to this link and we are done.

```bash
$ export EXPO_MANIFEST_PROXY_URL="https://8000-interestmisshapenseal.cdr.co"
$ export EXPO_PACKAGER_PROXY_URL="https://8080-interestmisshapenseal.cdr.co"
```

If you start your server again, you should see something like this at the bottom of the QR code:  
`Your URL is: exp://8000-interestmisshapenseal.cdr.co:443`

Just scan your QR code and the Expo App (can be downloaded in the Play or Apple store) on your phone will open your app.

The first time you open the app, it will take a long time to load if fast-mode is turned off on your virtual machine.

## enable hot reloading

coder.com doesn't support inotify events for the file system in their mounted project directories.

If you still want to enable hot reloading, you can move your project folder out of the project directory into the `./root` folder of your machine, for example.  
It should work then.

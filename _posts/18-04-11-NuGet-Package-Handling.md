---
layout: post
title: NugGet Package Handling with .bat File
date: 2018-04-11 22:15:00 +01:00
modify_date: 2018-04-14 15:00:00 +01:00
tags: nuget batch tutorial windows package
category: tutorial
---

A while ago I set up a private NuGet Server in our Company because we wanted to escape the 'DLL-Hell'.<br />
After happily finished setting up the Server _(tutorial coming soon...)_ I wanted to publish our first private NuGet.<br /><br />
__Creating your own NuGet Package was getting more difficult than I thought.__<br /><br /><!--more-->
You have to download the `nuget.exe`, deploy it in every Project Folder you wanna turn into a NuGet and run several bash Commands to finally deploy your Package.<br />
This simple File is an all-in-one Tool for handling all that stuff.
## How to use
- Create a .bat File and copy the Code below
- Deploy the File into your Project Folder
- Change `http://localhost:64591/nuget` to the NuGet Feed you wanna push your Package to
- - Additional add the api key to that line
- Execute the Script 
- - `nuget.exe` getting downloaded and .nuspec File will be created
- Edit your .nuspec File
- - [View Example](https://docs.microsoft.com/de-de/nuget/create-packages/creating-a-package#the-role-and-structure-of-the-nuspec-file)


## Code
{% highlight powershell %}
@echo off
echo Proceed with checking nuget.exe and Downloading if missing.
pause

if not exist nuget.exe (
    echo Downloading nuget.exe...
    powershell -Command "Invoke-WebRequest https://dist.nuget.org/win-x86-commandline/latest/nuget.exe -OutFile nuget.exe"
    echo Finished Downloading
) else (
    echo nuget.exe located.
)

if exist nuget.exe (
    if exist "%~1" (
        echo Drag and Drop recognized
        echo Pushing the Package...

        rem edit your nuget server here
        nuget push %~1 -Source http://localhost:64591/nuget
        echo Finished pushing.
    ) else (
        if exist *.nuspec (
            rem get modified file from server
            nuget pack
            echo Finished.
        ) else (
            nuget spec
            echo Modify *.nuspec and Start the .bat again to Pack the NuGet.
        )
    )
) else (
    echo Error locating nuget.exe !
)

pause
{% endhighlight %}

## ToDo
- More Comments
- nuget.exe stored only in one place
- Proper Syntax Highlight for Code


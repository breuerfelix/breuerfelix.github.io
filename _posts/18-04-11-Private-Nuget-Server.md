---
layout: post
title: NugGet Handling with .bat File
tags: nuget bat tutorial win c#
category: tutorial
---

A while ago I set up a private NuGet Server in our Company because we wanted to escape the 'DLL-Hell'.<br />
After happily finished setting up the Server _(tutorial coming soon...)_ I wanted to publish our first private NuGet.<br /><br />
Creating your own NuGet was getting more difficult than I thought.<!--more--><br /><br />
You have to download the `nuget.exe`, deploy it in every Project Folder you wanna turn into a NuGet and run several bash Commands to finally deploy your Package.<br />
More explanation coming soon...<br />

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
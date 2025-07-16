---
layout: post
title: NuGet Package Handling with .bat File
date: 2018-04-11 22:15:00 +01:00
modify_date: 2018-04-14 15:00:00 +01:00
tags: nuget batch tutorial windows package c#
category: blog
---

A while ago, I set up a private NuGet Server in our company because we wanted to escape 'DLL Hell'.  
After happily finishing setting up the server _(tutorial coming soon...)_, I wanted to publish our first private NuGet.

__Unfortunately, creating your own NuGet Package was more difficult than I thought.__<!--more-->

You have to download `nuget.exe`, deploy it in every project folder you want to turn into a NuGet, and run several batch commands to finally deploy your package.  
This simple file is an all-in-one tool for handling all of that.

## How to Use
### Create Package
- Create a .bat file and copy the code below
- Deploy the file into your project folder
- Change `http://localhost:64591/nuget` to the NuGet Feed you want to push your package to
  - Additionally, add the API key to that command line
- Execute the script 
  - `nuget.exe` will be downloaded and a .nuspec file will be created
- Edit and save your `.nuspec` file
  - [How to edit .nuspec file](https://docs.microsoft.com/de-de/nuget/create-packages/creating-a-package#the-role-and-structure-of-the-nuspec-file)

### Push Package
- Drag and drop the `.nuspec` file onto the `.bat` file
- The package will be deployed to the feed declared in the script

## Code
```powershell
@echo off
echo Proceed with checking nuget.exe and downloading if missing.

if not exist nuget.exe (
    echo Downloading nuget.exe...
    powershell -Command "Invoke-WebRequest https://dist.nuget.org/win-x86-commandline/latest/nuget.exe -OutFile nuget.exe"
    echo Finished downloading
) else (
    echo nuget.exe located.
)

if exist nuget.exe (
    if exist "%~1" (
        echo Drag and drop recognized
        echo Pushing the package...

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
            echo Modify *.nuspec and start the .bat again to pack the NuGet.
        )
    )
) else (
    echo Error locating nuget.exe!
)

pause
```

## ToDo
- More comments
- nuget.exe stored only in one place
- Proper syntax highlighting for code

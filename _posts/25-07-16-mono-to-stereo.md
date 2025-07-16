---
layout: post
title: Convert Mono Input to Stereo on MacOS
date: 2025-07-16 09:00:00 +01:00
tags: macos mono stereo convert audio interface microphone
category: blog
---

__tl;dr:__ Install Blackhole (`brew install --cask blackhole-2ch`) and run the script below. Make sure to adjust your input device in the constants and install `sounddevice` + `numpy`.

I recently bought a fancy XLR microphone and an audio interface from Focusrite (Scarlett Duo). After plugging in everything, I wanted to hear my awesome voice via Voice Memos on Mac. I could hear myself only on the left side of my headphones.  
Replugging everything, checking settings, turning the mic... Same output, just the left side.

I thought it must be broken, but after a little research I realized that microphones always produce mono output, and the computer just turns it into fake stereo. Teams, Zoom, Google Meet, etc. also provide my input as stereo. So when my coworkers heard me via Teams, all was fine. At least that worked great.

But I couldn't stop messing around and wanted to figure out how to duplicate my input to a second channel. Can't be that hard, right?  
Yes. Just buy Loopback for 99 dollars and I'm fine! Wow.

Nope. Not going to do that.

So first of all, we need a virtual audio device we can use to route our duplicated mono input. There is a nice open-source project for this:  
[Blackhole](https://existential.audio/blackhole/). Just install it via Homebrew: `brew install --cask blackhole-2ch`.

I wrote a simple Python script to duplicate the mono stream to stereo from my Scarlett audio interface to Blackhole in real time. Just make sure you choose `Blackhole` as the input device when recording audio.

Here is the code with some comments:

```python
# make sure to install dependencies
# pip install sounddevice
# pip install numpy
import sounddevice as sd
import numpy as np
import time
import multiprocessing
import os

INPUT_CHANNEL = 0         # take the first channel and duplicate
OUTPUT_CHANNELS = [0, 1]  # map to channel 0 and 1 -> stereo
INPUT_DEVICE = "scarlett" # change to your audio interface, lowercase and first word is enough

def audio_callback(indata, outdata, frames, time, status):
    if status:
        print(f"Stream status: {status}")
        raise Exception(f"Stream status error {status}")

    outdata[:, OUTPUT_CHANNELS] = np.tile(indata[:, INPUT_CHANNEL], (len(OUTPUT_CHANNELS), 1)).T

def main():
    # adjust your sample rate here
    # do not exceed 96kHz otherwise the input gets crackly
    samplerate = 96000

    devices = sd.query_devices()
    print("Available devices:")
    for i, d in enumerate(devices):
        print(f"{i}: {d['name']} (in: {d['max_input_channels']}, out: {d['max_output_channels']})")

    input_device_index = next((i for i, d in enumerate(devices) if d['name'].lower().startswith(INPUT_DEVICE)), None)
    # output should be Blackhole (virtual audio interface)
    output_device_index = next((i for i, d in enumerate(devices) if d['name'].lower().startswith('blackhole')), None)

    if input_device_index is None or output_device_index is None:
        print("Could not find Scarlett input or Blackhole output device.")
        return

    print(f"Using input device {input_device_index}: {devices[input_device_index]['name']}")
    print(f"Using output device {output_device_index}: {devices[output_device_index]['name']}")

    with sd.Stream(device=(input_device_index, output_device_index),
                   channels=(INPUT_CHANNEL+1, max(OUTPUT_CHANNELS)+1),
                   dtype='float32',
                   samplerate=samplerate,
                   # this should be real time
                   latency="low",
                   callback=audio_callback) as s:

        print(f"Routing audio at {samplerate} Hz... Press Ctrl+C to stop.")

        while s.active:
            time.sleep(1)

        print("Stream is not active anymore.")

    print("Stream closed.")


def run_main_on_core():
    while True:
        # this makes sure that it works even if you unplug and replug the device
        # if the main function does not run in a separate process
        # the reconnection does not work because the device will always be blocked by the main thread
        # I tested this a bunch...
        p = multiprocessing.Process(target=main)
        p.start()
        p.join()
        print("Main function stopped. Waiting 5 seconds before restarting...")
        time.sleep(5)

if __name__ == "__main__":
    run_main_on_core()
```

I also wanted to make sure that when I accidentally unplugged the mic, it would reconnect and reopen the stream after replugging. That was a hell of a ride.  
Turns out, you have to run the streaming code inside a new process so when it crashes and the process stops, it "releases" the input. Without multiprocessing, I was not able to reconnect the microphone, no matter how often I closed the stream.

Feel free to reach out if you have any questions :)  
Happy coding!

# discord-mobile-desktop
_A lightweight, phone-sized Electron wrapper for Discord._

> [!IMPORTANT] 
> This project is not affiliated with Discord.
>
> It simply wraps the public web app in Electron and inherits all Electron‑related limitations.

## Why This Exists

I’ve always loved the simplicity of old-school MSN Messenger. Discord is where everyone is now, but the full desktop UI can feel overwhelming when you just want to send a quick message. This wrapper renders Discord in a phone-sized window  nothing modified, nothing injected, just a clean minimal shell.

The wrapper includes a lightweight update checker that notifies users when a newer GitHub release is available. It does not modify Discord or inject code into the Discord web app. Keep an eye out for my own messaging service later: lightweight, offline-first, visually clean, and as free as possible.

## Requirements
Discord is heavy. Electron is heavy. This wrapper keeps things as lean as possible.

### RAM
- Electron (WebView2) baseline: 110–130 MB
- Discord in browser: ~100 MB
- Combined runtime: 250–350 MB
This is lighter than the official desktop app.
### Storage

The installer is just under 90 MB.
The project uses Electron because Chromium compatibility is important for Discord voice, camera, microphone, uploads, notifications, and screen sharing.

### CPU

If your machine can run Discord in a browser, it can run this wrapper.

### Operating System

- Windows and Ubuntu builds provided
- Other Linux distros can use the Ubuntu-tested AppImage
- macOS builds are not provided (no hardware available for testing)

### Overview
This project is intentionally a single-account Discord wrapper. It focuses on a small, phone-sized window and useful host integrations while leaving Discord's web app unchanged.

Multi-account tabs are out of scope for this project. That feature belongs in the planned standalone messaging app rather than becoming additional complexity in the Discord wrapper.

> **Note for Linux users:**  
> AppImage builds require FUSE.
> Install via your package manager (e.g., sudo apt install libfuse2).


## Quick Start

Run from source:

```bash
git clone https://github.com/ZFordDev/discord-mobile-desktop.git
cd discord-mobile-desktop

npm install
npm run build
npm start

```

### Windows
- `npm install`
- `npm run build`
- If npm is missing, install Node.js from [https://nodejs.org](https://nodejs.org)

### Linux
- `npm install && npm run build`  
- If npm is missing: `sudo apt install npm`

> **Note:** AppImage builds require FUSE on some distros (`sudo apt install libfuse2`).

## Installation

Download installers and portable builds from Releases:

👉 https://github.com/ZFordDev/discord-mobile-desktop/releases

## Project Structure
_its dam simple!_

```
discord-mobile-desktop/
    ├── LICENSE # MIT as always 
    ├── README.md # This document
    ├── main.js # the logic of the wrapper 
    ├── package.json # meta for the app
```

## Support
If you like or use the wrapper, leave a ⭐  it helps others find it.
Bug reports are welcome, but most issues will originate from Electron or Discord.
Feature requests are fine, but this is intentionally minimal.

## Known Issues

### Host integrations

The wrapper now handles the desktop concerns around the unchanged Discord web app:

- Camera, microphone, fullscreen, clipboard, and web notification permissions are limited to Discord origins.
- Screen sharing presents a source-selection dialog instead of granting a screen automatically.
- Discord downloads use the system Downloads folder and completed files are revealed by the operating system.
- External links open in the default browser, while Discord navigation stays inside the wrapper.
- A second launch focuses the existing window, and a crashed renderer reloads Discord.

Screen-share system audio is supported through Electron's Windows loopback capture. Linux and macOS may provide video without system audio depending on their desktop and Electron support.

upstream limitation are worth noting:

### Electron on Linux (Wayland/X11 Variability)
Some Linux distros may experience minor rendering or window‑manager quirks due to upstream Electron/Chromium behaviour.

### Missing FUSE (appImage)
Some modern distros no longer ship FUSE by default.
Install via your package manager (e.g., sudo apt install libfuse2).

Electron and Chromium compatibility remain important dependencies for this wrapper.

## Disclaimer
This is an independent, open-source project.
It uses public web interfaces and does not ship, modify, or reverse-engineer any proprietary Discord code.
Use at your own discretion.

## License
This project is open-source and available under the [MIT License](LICENSE).
# discord-mobile-desktop
_A lightweight, phone-sized Electron wrapper for Discord._

> [!IMPORTANT] 
> This project is not affiliated with Discord.
>
> It simply wraps the public web app in Electron and inherits all Electron‑related limitations.

## Why This Exists

I’ve always loved the simplicity of old-school MSN Messenger. Discord is where everyone is now, but the full desktop UI can feel overwhelming when you just want to send a quick message. This wrapper renders Discord in a phone-sized window  nothing modified, nothing injected, just a clean minimal shell.

The wrapper includes an auto‑updater (enabled by default) purely to keep Electron fresh and avoid edge‑case issues. I don’t plan to extend this project beyond this point. Keep an eye out for my own messaging service later  lightweight, offline‑first, visually clean, and as free as possible (servers cost money once you go full‑time).

## Requirements
Discord is heavy. Electron is heavy. This wrapper keeps things as lean as possible.

### ram
- Electron (WebView2) baseline: 110–130 MB
- Discord in browser: ~100 MB
- Combined runtime: 250–350 MB
This is lighter than the official desktop app.
### storage

The installer is just under 90 MB.
Tauri could reduce installer size, but RAM usage would remain similar because both rely on WebView2. Anything under 100 MB is acceptable; if it climbs above that, I may switch.

### CPU

If your machine can run Discord in a browser, it can run this wrapper.

### Operating System

- Windows and Ubuntu builds provided
- Other Linux distros can use the Ubuntu-tested AppImage
- macOS builds are not provided (no hardware available for testing)

### overview 
You won’t get a cleaner Discord wrapper without modifying Discord’s code  and that’s not something I’m interested in doing.
Wait for my messaging app; I’ll keep it low, clean, and offline‑first.

> **Note for Linux users:**  
> AppImage builds require FUSE.
> Install via your package manager (e.g., sudo apt install libfuse2).


## Quick Start

Run from source:

```bash
git clone https://github.com/ZFordDev/discord-mobile-desktop.git
cd discord-mobile-desktop

npm install
npm run prestart
npm run build
npm start
npm run clear

```

### Windows
- `npm install | npm run build`  
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
    └── temp_notes.md # ZFordDev standard
```

## Support
If you like or use the wrapper, leave a ⭐  it helps others find it.
Bug reports are welcome, but most issues will originate from Electron or Discord.
Feature requests are fine, but this is intentionally minimal.

## Known Issues

upstream limitation are worth noting:

### Electron on Linux (Wayland/X11 Variability)
Some Linux distros may experience minor rendering or window‑manager quirks due to upstream Electron/Chromium behaviour.

### Missing FUSE (appImage)
Some modern distros no longer ship FUSE by default.
Install via your package manager (e.g., sudo apt install libfuse2).

Electron is updated regularly, and alternative runtimes are being evaluated for long‑term Linux stability.

## Disclaimer
This is an independent, open-source project.
It uses public web interfaces and does not ship, modify, or reverse-engineer any proprietary Discord code.
Use at your own discretion.

## License
This project is open-source and available under the [MIT License](LICENSE).
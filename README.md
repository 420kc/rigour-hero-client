# Rigour Hero Desktop Client

## What is this?

The Rigour Hero Desktop Client is a lightweight app that runs the game in its own window — no browser needed. It loads the latest version of Rigour Hero directly from rigourhero.com every time you open it, so you're always playing the most up-to-date version.

## Is it safe?

Yes. The desktop client is just a thin wrapper around the same game you play in your browser. It doesn't access your files, install background processes, or collect any data beyond what the game itself uses. The source code is open and available at [github.com/420kc/rigour-hero-client](https://github.com/420kc/rigour-hero-client).

**Windows may show a SmartScreen warning** the first time you run the installer because it's not signed with a paid certificate. This is normal for independent software — click "More info" then "Run anyway" to proceed. The app is safe.

## How to install

1. Download **Rigour Hero Setup.exe**
2. Run the installer — it takes about 10 seconds
3. Rigour Hero appears on your desktop and in your Start menu
4. Double-click to play

## How to uninstall

Go to **Settings → Apps → Rigour Hero → Uninstall**, or run the uninstaller from the Start menu.

## Why use the desktop client?

- **Always up to date** — loads the latest game version on every launch
- **No cache issues** — never see an outdated version of the game
- **Clean experience** — no browser tabs, no URL bar, no distractions
- **Same game** — your account, scores, pets, and GP are all the same

## Technical details

- Built with Electron (Chromium-based)
- Connects to rigourhero.com over HTTPS
- WebSocket chat and multiplayer work identically to the browser version
- ~99 MB installer, ~220 MB installed
- Windows 10/11 supported

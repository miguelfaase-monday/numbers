# Nummers

Nummers is a desktop-first grading and normering app for Dutch teachers, built with Tauri and React.

The product UI is Dutch by design. Repository docs and developer-facing text are English.

## Features

- Five grading methods:
  - N-term
  - Cesuur % (non-linear split scale)
  - Fouten per punt
  - Goed per punt
  - Cesuur in punten
- Fully reactive calculations (no submit button)
- Quick lookup with input mode as `goed` or `fout`
- Grade curve visualization
- Complete score table
- Export support:
  - CSV
  - XLSX
  - PDF
  - Clipboard fallback (TSV)
- Local persistence of settings

## Stack

- Tauri
- React + TypeScript
- Tailwind CSS + Radix UI primitives
- Recharts

## Requirements

- Node.js 18+
- npm 9+
- Rust toolchain (for Tauri desktop builds)

Platform prerequisites for Tauri are documented here:
[Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

## Install

```bash
npm install
```

## Development

Run the web app:

```bash
npm run dev
```

Default URL: `http://localhost:1420`

Run Tauri desktop in development:

```bash
npm run tauri dev
```

## Build

Web build:

```bash
npm run build
```

Desktop build:

```bash
npm run tauri build
```

## Download

End users should download prebuilt binaries from the GitHub Releases page:

- Open your repository releases page: `https://github.com/<org-or-user>/<repo>/releases`
- Download the correct installer for your platform:
  - macOS: `.dmg` (universal build)
  - Windows: `.exe` (standard installer) or `.msi` (managed/IT deployment)
  - Linux:
    - `.deb` for Ubuntu/Debian
    - `.rpm` for Fedora/RHEL/openSUSE
    - `.AppImage` for portable use across distributions

Quick install notes:

- macOS: open `.dmg`, drag `Nummers.app` to Applications
- Windows: run `.exe` (or deploy `.msi`)
- Linux:
  - `.deb`: `sudo dpkg -i <file>.deb`
  - `.rpm`: `sudo rpm -i <file>.rpm`
  - `.AppImage`: `chmod +x <file>.AppImage` then run it

## Deploy

Cloudflare Pages scripts:

```bash
npm run deploy
npm run deploy:preview
```

## Notes

- Frontend wording should remain Dutch.
- Non-UI text (README, workflow labels, metadata descriptions) should remain English.

# Cijfers

Een professionele cijfer calculator voor Nederlandse docenten. Bereken snel en eenvoudig cijfers voor toetsen met verschillende berekeningsmethoden.

![Tauri](https://img.shields.io/badge/Tauri-1.5-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

---

## Inhoudsopgave

- [Features](#features)
- [Quick Start](#quick-start)
- [Vereisten](#vereisten)
- [Installatie](#installatie)
  - [1. Node.js installeren](#1-nodejs-installeren)
  - [2. Rust installeren (voor Tauri build)](#2-rust-installeren-voor-tauri-build)
  - [3. Project dependencies installeren](#3-project-dependencies-installeren)
- [Applicatie starten](#applicatie-starten)
  - [Development mode (Web)](#development-mode-web)
  - [Development mode (Tauri Desktop)](#development-mode-tauri-desktop)
- [Applicatie bouwen](#applicatie-bouwen)
  - [GitHub Actions (Aanbevolen)](#github-actions-aanbevolen)
  - [Lokale build](#lokale-build)
- [Projectstructuur](#projectstructuur)
- [Berekeningsmethoden](#berekeningsmethoden)
- [Problemen oplossen](#problemen-oplossen)

---

## Features

- **5 Berekeningsmethoden:**
  - N-term (Standaard): `Cijfer = 9 × (Score / Totaal) + N`
  - Cesuur % (Percentage Normering): Lineaire schaal met cesuur percentage
  - Fouten per punt: `Cijfer = 10 - (Fouten / K)`
  - Goed per punt: `Cijfer = 1 + (Score / K)`
  - Punten Cesuur: Vaste puntengrens voor voldoende

- **Snel Opzoeken:** Direct cijfers berekenen voor individuele scores
- **Interactieve Grafiek:** Visuele weergave van de cijfercurve (Recharts)
- **Volledige Tabel:** Overzicht van alle scores met kleurcodering (groen = voldoende, rood = onvoldoende)
- **Export naar Excel:** Kopieer tabel in TSV formaat
- **Afdrukken:** Print-geoptimaliseerde weergave
- **Persistentie:** Instellingen worden automatisch opgeslagen in localStorage
- **Cross-platform:** Draait op macOS, Windows en Linux als native desktop app

---

## Quick Start

### Web versie (snelste manier)

```bash
# Clone het project
git clone https://github.com/[username]/numbers.git
cd numbers

# Installeer dependencies en start
npm install
npm run dev
```

Open **http://localhost:1420** in je browser.

### Desktop versie downloaden

Download de laatste release van de [Releases pagina](../../releases) voor jouw platform:
- **macOS:** `.dmg` bestand
- **Windows:** `.msi` of `.exe` installer
- **Linux:** `.deb` of `.AppImage`

---

## Vereisten

### Voor web development (minimaal)

| Software | Versie | Download |
|----------|--------|----------|
| Node.js | 18.0+ | [nodejs.org](https://nodejs.org/) |
| npm | 9.0+ | (komt met Node.js) |

### Voor Tauri desktop build (aanvullend)

| Software | Versie | Download |
|----------|--------|----------|
| Rust | 1.70+ | [rustup.rs](https://rustup.rs/) |
| Xcode Command Line Tools | Latest | `xcode-select --install` (macOS) |
| Visual Studio Build Tools | 2019+ | [visualstudio.com](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (Windows) |
| System libraries | - | Zie [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) |

---

## Installatie

### 1. Node.js installeren

#### macOS (met Homebrew)
```bash
brew install node
```

#### macOS (handmatig)
Download en installeer van [nodejs.org](https://nodejs.org/)

#### Windows
Download en installeer van [nodejs.org](https://nodejs.org/) of gebruik:
```powershell
winget install OpenJS.NodeJS.LTS
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verificatie:**
```bash
node --version  # Moet v18.0.0 of hoger zijn
npm --version   # Moet v9.0.0 of hoger zijn
```

### 2. Rust installeren (voor Tauri build)

#### macOS / Linux
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Na installatie, herstart je terminal of voer uit:
```bash
source "$HOME/.cargo/env"
```

#### Windows
Download en voer uit: [rustup-init.exe](https://win.rustup.rs/)

**Verificatie:**
```bash
rustc --version  # Moet 1.70.0 of hoger zijn
cargo --version
```

### 3. Project dependencies installeren

Clone of download het project en installeer de dependencies:

```bash
# Navigeer naar de project directory
cd /pad/naar/numbers

# Installeer Node.js dependencies
npm install
```

Dit installeert automatisch:
- React 18
- TypeScript 5
- Tailwind CSS 3
- Radix UI componenten
- Recharts (grafieken)
- Lucide React (iconen)
- Tauri CLI

---

## Applicatie starten

### Development mode (Web)

Start de development server voor web-only gebruik:

```bash
npm run dev
```

De applicatie is nu beschikbaar op: **http://localhost:1420**

Hot Module Replacement (HMR) is ingeschakeld - wijzigingen worden direct zichtbaar.

### Development mode (Tauri Desktop)

Start de applicatie als native desktop app met hot reload:

```bash
npm run tauri dev
```

Dit compileert de Rust code en opent een native venster. De eerste keer duurt dit langer door het compileren van dependencies.

---

## Applicatie bouwen

### GitHub Actions (Aanbevolen)

De makkelijkste manier om de app te bouwen is via GitHub Actions. Dit bouwt automatisch voor alle platforms zonder lokale setup.

#### Automatische builds

Bij elke push naar `main` wordt de app automatisch gebouwd voor:
- ✅ macOS (Apple Silicon - M1/M2/M3)
- ✅ macOS (Intel x64)
- ✅ Windows (x64)
- ✅ Linux (x64)

De build artifacts zijn te downloaden via de **Actions** tab in GitHub.

#### Release maken

Om een officiële release te maken met downloadbare installers:

```bash
# Tag een nieuwe versie
git tag v1.0.0
git push origin v1.0.0
```

Dit triggert automatisch een build en maakt een draft release aan met alle installers.

#### Handmatig triggeren

Je kunt de build ook handmatig starten:
1. Ga naar **Actions** tab in GitHub
2. Selecteer **Build Tauri App**
3. Klik **Run workflow**

### Lokale build

#### Web build

Bouw een geoptimaliseerde versie voor web deployment:

```bash
npm run build
```

Output wordt gegenereerd in de `dist/` directory.

#### Tauri Desktop build (lokaal)

> ⚠️ **Let op:** Lokale Tauri builds vereisen Rust en platform-specifieke dependencies. GitHub Actions is eenvoudiger.

**macOS (Apple Silicon):**
```bash
npm run tauri build -- --target aarch64-apple-darwin
```

**macOS (Intel):**
```bash
npm run tauri build -- --target x86_64-apple-darwin
```

**Windows:**
```bash
npm run tauri build -- --target x86_64-pc-windows-msvc
```

**Linux:**
```bash
npm run tauri build -- --target x86_64-unknown-linux-gnu
```

**Output locaties:**
- macOS: `src-tauri/target/[target]/release/bundle/dmg/*.dmg`
- Windows: `src-tauri/target/[target]/release/bundle/msi/*.msi`
- Linux: `src-tauri/target/[target]/release/bundle/deb/*.deb`

---

## Projectstructuur

```
numbers/
├── src/                          # React source code
│   ├── components/
│   │   ├── ui/                   # Herbruikbare UI componenten
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── toggle-group.tsx
│   │   ├── GradeChart.tsx        # Recharts cijfergrafiek
│   │   ├── GradeTable.tsx        # Cijfertabel met export
│   │   ├── QuickLookup.tsx       # Snel opzoeken component
│   │   └── Sidebar.tsx           # Configuratie sidebar
│   ├── hooks/
│   │   └── useLocalStorage.ts    # LocalStorage hook
│   ├── lib/
│   │   ├── grading.ts            # Berekeningsmethoden engine
│   │   └── utils.ts              # Utility functies
│   ├── App.tsx                   # Hoofd applicatie component
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Tailwind CSS + custom styles
├── src-tauri/                    # Tauri/Rust source code
│   ├── src/
│   │   └── main.rs               # Rust entry point
│   ├── icons/                    # App iconen
│   ├── Cargo.toml                # Rust dependencies
│   ├── build.rs                  # Tauri build script
│   └── tauri.conf.json           # Tauri configuratie
├── public/                       # Statische bestanden
├── dist/                         # Build output (gegenereerd)
├── package.json                  # Node.js dependencies & scripts
├── tsconfig.json                 # TypeScript configuratie
├── tailwind.config.js            # Tailwind CSS configuratie
├── postcss.config.js             # PostCSS configuratie
├── vite.config.ts                # Vite bundler configuratie
└── index.html                    # HTML template
```

---

## Berekeningsmethoden

### 1. N-term (Standaard)
De meest gebruikte methode in het Nederlandse onderwijs.

**Formule:** `Cijfer = 9 × (Score / Totaal) + N`

- `N = 1.0` geeft een standaard verdeling (0 punten = 1, alle punten = 10)
- `N > 1.0` maakt de normering soepeler
- `N < 1.0` maakt de normering strenger

### 2. Cesuur % (Percentage Normering)
Lineaire schaal met een cesuurpercentage.

**Werking:**
- Onder cesuur%: Lineair van 1.0 naar Voldoende
- Boven cesuur%: Lineair van Voldoende naar 10.0

### 3. Fouten per punt
Begint bij 10 en trekt af per fout.

**Formule:** `Cijfer = 10 - (Fouten / K-factor)`

### 4. Goed per punt
Begint bij 1 en telt op per goed antwoord.

**Formule:** `Cijfer = 1 + (Score / K-factor)`

### 5. Punten Cesuur
Vergelijkbaar met Cesuur %, maar met een vast puntenaantal.

**Werking:**
- Onder cesuurpunten: Lineair van 1.0 naar Voldoende
- Boven cesuurpunten: Lineair van Voldoende naar 10.0

---

## Problemen oplossen

### npm install faalt

```bash
# Verwijder node_modules en probeer opnieuw
rm -rf node_modules package-lock.json
npm install
```

### Rust/Cargo niet gevonden

```bash
# Herlaad shell environment
source "$HOME/.cargo/env"

# Of voeg toe aan je shell profile (~/.zshrc of ~/.bashrc)
echo 'source "$HOME/.cargo/env"' >> ~/.zshrc
```

### Tauri build download errors

Als crates.io downloads falen (netwerk/firewall issues):

```bash
# Verhoog retry count
CARGO_NET_RETRY=20 npm run tauri build

# Of probeer met andere network settings
CARGO_HTTP_MULTIPLEXING=false npm run tauri build
```

**Firewall configuratie:** Zorg dat deze domeinen toegankelijk zijn:
- `static.crates.io`
- `index.crates.io`
- `crates.io`

### macOS: "App is damaged" waarschuwing

Na het bouwen van de app:
```bash
xattr -cr "src-tauri/target/release/bundle/macos/Cijfer Calculator.app"
```

### Windows: Visual Studio Build Tools ontbreken

Installeer de C++ build tools:
1. Download [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. Selecteer "Desktop development with C++"
3. Herstart en probeer opnieuw

### Linux: Ontbrekende system libraries

Ubuntu/Debian:
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

Fedora:
```bash
sudo dnf install webkit2gtk3-devel \
    openssl-devel \
    curl \
    wget \
    libappindicator-gtk3 \
    librsvg2-devel
```

Arch Linux:
```bash
sudo pacman -S webkit2gtk \
    base-devel \
    curl \
    wget \
    openssl \
    appmenu-gtk-module \
    gtk3 \
    libappindicator-gtk3 \
    librsvg \
    libvips
```

---

## Scripts overzicht

| Command | Beschrijving |
|---------|--------------|
| `npm run dev` | Start development server (web) |
| `npm run build` | Bouw voor productie (web) |
| `npm run preview` | Preview productie build |
| `npm run tauri dev` | Start Tauri in development mode |
| `npm run tauri build` | Bouw Tauri desktop applicatie |

---

## Licentie

MIT

---

## Bijdragen

Bijdragen zijn welkom! Open een issue of pull request op GitHub.

#!/usr/bin/env node
/**
 * Generate app icons from SVG source
 * Uses sharp library for reliable cross-platform icon generation
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

const ICONS_DIR = path.join(__dirname, '..', 'src-tauri', 'icons');
const SVG_PATH = path.join(ICONS_DIR, 'icon.svg');

// Icon sizes needed by Tauri
const SIZES = [
  { name: '32x32.png', size: 32 },
  { name: '128x128.png', size: 128 },
  { name: '128x128@2x.png', size: 256 },
  { name: 'icon.png', size: 512 },
];

// ICO sizes (Windows requires multiple sizes in one ICO file)
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256];

// macOS iconset sizes
const ICONSET_SIZES = [
  { name: 'icon_16x16.png', size: 16 },
  { name: 'icon_16x16@2x.png', size: 32 },
  { name: 'icon_32x32.png', size: 32 },
  { name: 'icon_32x32@2x.png', size: 64 },
  { name: 'icon_128x128.png', size: 128 },
  { name: 'icon_128x128@2x.png', size: 256 },
  { name: 'icon_256x256.png', size: 256 },
  { name: 'icon_256x256@2x.png', size: 512 },
  { name: 'icon_512x512.png', size: 512 },
  { name: 'icon_512x512@2x.png', size: 1024 },
];

async function generateIcons() {
  console.log('Generating icons from SVG...');

  // Ensure icons directory exists
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  // Read SVG
  const svgBuffer = fs.readFileSync(SVG_PATH);

  // Generate main icons
  for (const { name, size } of SIZES) {
    const outputPath = path.join(ICONS_DIR, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`  ✓ ${name} (${size}x${size})`);
  }

  // Generate ICO for Windows (proper multi-size ICO format)
  console.log('  Generating Windows ICO...');
  const icoPngs = [];
  for (const size of ICO_SIZES) {
    const pngBuffer = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    icoPngs.push(pngBuffer);
  }
  
  const icoBuffer = await pngToIco(icoPngs);
  fs.writeFileSync(path.join(ICONS_DIR, 'icon.ico'), icoBuffer);
  console.log('  ✓ icon.ico (multi-size)');

  // Generate macOS iconset
  const iconsetDir = path.join(ICONS_DIR, 'icon.iconset');
  if (!fs.existsSync(iconsetDir)) {
    fs.mkdirSync(iconsetDir, { recursive: true });
  }

  for (const { name, size } of ICONSET_SIZES) {
    const outputPath = path.join(iconsetDir, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
  }
  console.log('  ✓ icon.iconset (all sizes)');

  // On macOS, create icns file
  if (process.platform === 'darwin') {
    const { execSync } = require('child_process');
    const icnsPath = path.join(ICONS_DIR, 'icon.icns');
    try {
      execSync(`iconutil -c icns "${iconsetDir}" -o "${icnsPath}"`, { stdio: 'inherit' });
      console.log('  ✓ icon.icns');
    } catch (e) {
      console.log('  ⚠ Could not create icon.icns (iconutil not available)');
    }
  }

  console.log('\nIcon generation complete!');
}

generateIcons().catch(console.error);

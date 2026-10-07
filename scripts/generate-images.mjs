/**
 * Generates the static dashboard/hero artwork referenced by the app.
 *
 * The original project referenced /images/*.png files that were never
 * committed, so the dashboard cards and hero panel rendered empty. This
 * script renders matching on-theme SVG artwork to PNG via sharp.
 *
 * Usage: node scripts/generate-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve(process.cwd(), "public/images");
fs.mkdirSync(outDir, { recursive: true });

const hexGridPattern = (id, color, opacity, size = 56) => `
  <pattern id="${id}" width="${size}" height="${size * 0.866}" patternUnits="userSpaceOnUse">
    <path d="M${size / 2} 0 L${size} ${size * 0.25} L${size} ${size * 0.61}
             M${size} ${size * 0.61} L${size} ${size * 0.866} L${size / 2} ${size * 1.116}
             M${size / 2} ${size * 1.116} L0 ${size * 0.866} L0 ${size * 0.5}
             M0 ${size * 0.5} L0 ${size * 0.14} L${size / 2} ${size * 0.4}"
          fill="none" stroke="${color}" stroke-width="1" opacity="${opacity}"/>
  </pattern>`;

const scanlines = (opacity = 0.05) => `
  <pattern id="scan" width="6" height="6" patternUnits="userSpaceOnUse">
    <rect width="6" height="3" fill="#000" opacity="${opacity}"/>
  </pattern>`;

/* ------------------------------------------------------------------ */
/* hero-cyber-core.png — lime/green cyber core for the dashboard hero  */
/* ------------------------------------------------------------------ */
const hero = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="700" viewBox="0 0 1600 700">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1210"/>
      <stop offset="0.55" stop-color="#101a15"/>
      <stop offset="1" stop-color="#16241c"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#c4ef88" stop-opacity="0.34"/>
      <stop offset="0.55" stop-color="#8fd06a" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#8fd06a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="coreFill" cx="0.38" cy="0.32" r="0.85">
      <stop offset="0" stop-color="#22342a"/>
      <stop offset="1" stop-color="#0d1512"/>
    </radialGradient>
    <linearGradient id="lineFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#c4ef88" stop-opacity="0"/>
      <stop offset="1" stop-color="#c4ef88" stop-opacity="0.55"/>
    </linearGradient>
    ${hexGridPattern("hex", "#c4ef88", 0.07)}
    ${scanlines(0.06)}
  </defs>

  <rect width="1600" height="700" fill="url(#bg)"/>
  <rect width="1600" height="700" fill="url(#hex)"/>

  <!-- perspective floor grid -->
  <g stroke="#c4ef88" opacity="0.13" stroke-width="1">
    <path d="M760 700 L1060 470 M860 700 L1110 470 M960 700 L1160 470 M1060 700 L1210 470
             M1160 700 L1260 470 M1260 700 L1310 470 M1360 700 L1360 470 M1460 700 L1410 470
             M1560 700 L1460 470"/>
    <path d="M700 690 H1600 M740 640 H1600 M780 596 H1600 M830 558 H1600 M890 526 H1600 M960 500 H1600 M1040 480 H1600"/>
  </g>

  <!-- core glow -->
  <circle cx="1180" cy="330" r="330" fill="url(#glow)"/>

  <!-- orbit rings -->
  <g fill="none" stroke="#c4ef88">
    <ellipse cx="1180" cy="330" rx="252" ry="96" opacity="0.5" stroke-width="1.6" transform="rotate(-18 1180 330)"/>
    <ellipse cx="1180" cy="330" rx="252" ry="96" opacity="0.38" stroke-width="1.6" transform="rotate(42 1180 330)"/>
    <ellipse cx="1180" cy="330" rx="252" ry="96" opacity="0.28" stroke-width="1.6" transform="rotate(96 1180 330)"/>
    <circle cx="1180" cy="330" r="176" opacity="0.32" stroke-width="1.2" stroke-dasharray="5 11"/>
    <circle cx="1180" cy="330" r="132" opacity="0.5" stroke-width="1.4"/>
  </g>

  <!-- satellite nodes on orbits -->
  <g fill="#e7f9cf">
    <circle cx="1408" cy="248" r="6"/>
    <circle cx="1014" cy="426" r="5"/>
    <circle cx="1256" cy="540" r="5"/>
    <circle cx="966" cy="238" r="4"/>
    <circle cx="1372" cy="470" r="4"/>
  </g>

  <!-- network links -->
  <g stroke="#c4ef88" fill="none" opacity="0.45">
    <path d="M1408 248 L1310 300 M1014 426 L1082 372 M1256 540 L1218 452 M966 238 L1074 288 M1372 470 L1300 402"/>
    <path d="M1408 248 L1520 180 M1372 470 L1500 560 M966 238 L860 170" stroke="url(#lineFade)"/>
  </g>

  <!-- central core -->
  <circle cx="1180" cy="330" r="104" fill="url(#coreFill)" stroke="#c4ef88" stroke-width="2.4"/>
  <path d="M1180 262 L1239 296 L1239 364 L1180 398 L1121 364 L1121 296 Z"
        fill="none" stroke="#c4ef88" stroke-width="2" opacity="0.85"/>
  <circle cx="1180" cy="330" r="34" fill="#c4ef88" opacity="0.9"/>
  <circle cx="1180" cy="330" r="52" fill="none" stroke="#e7f9cf" stroke-width="1.2" opacity="0.6"/>

  <!-- HUD ticks -->
  <g stroke="#9feaf0" opacity="0.35" stroke-width="2">
    <path d="M1500 120 h44 M1522 98 v44"/>
    <path d="M840 600 h44 M862 578 v44"/>
  </g>

  <rect width="1600" height="700" fill="url(#scan)"/>
</svg>`;

/* ------------------------------------------------------------------ */
/* operation-raven.png — violet boot2root operation card               */
/* ------------------------------------------------------------------ */
const raven = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#17162a"/>
      <stop offset="0.6" stop-color="#211f38"/>
      <stop offset="1" stop-color="#2b2748"/>
    </linearGradient>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3d3566"/>
      <stop offset="0.55" stop-color="#2a2447"/>
      <stop offset="1" stop-color="#1c1934"/>
    </linearGradient>
    <linearGradient id="wing" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a99cff"/>
      <stop offset="1" stop-color="#5a4f96"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#a99cff" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#a99cff" stop-opacity="0"/>
    </radialGradient>
    ${hexGridPattern("hex", "#a99cff", 0.09)}
    ${scanlines(0.07)}
  </defs>

  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#hex)"/>

  <!-- HUD halo -->
  <circle cx="620" cy="430" r="330" fill="url(#halo)"/>
  <g fill="none" stroke="#a99cff">
    <circle cx="620" cy="430" r="312" opacity="0.28" stroke-width="1.4" stroke-dasharray="4 12"/>
    <circle cx="620" cy="430" r="262" opacity="0.4" stroke-width="1.6"/>
    <path d="M620 118 v-34 M620 776 v-34 M308 430 h-34 M966 430 h-34" opacity="0.6" stroke-width="2.4"/>
  </g>

  <!-- raven silhouette -->
  <g>
    <path d="M760 250 L838 278 L910 306 L836 326 L778 348 L712 392 L668 470 L652 548
             L612 606 L470 648 L330 668 L368 600 L452 566 L540 470 L616 368 L690 290 Z"
          fill="url(#body)" stroke="#c5b9ff" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- wing -->
    <path d="M646 408 L502 314 L366 272 L296 268 L406 372 L516 458 L614 468 Z"
          fill="url(#wing)" opacity="0.9" stroke="#d9d0ff" stroke-width="1.6" stroke-linejoin="round"/>
    <!-- feather facets -->
    <g stroke="#17162a" stroke-width="2" opacity="0.55" fill="none">
      <path d="M604 444 L470 356 M556 470 L438 400 M508 494 L412 448"/>
    </g>
    <!-- beak line -->
    <path d="M904 304 L832 314 L772 330" stroke="#d9d0ff" stroke-width="2" fill="none" opacity="0.8"/>
    <!-- eye -->
    <circle cx="744" cy="294" r="10" fill="#efeaff"/>
    <circle cx="744" cy="294" r="19" fill="none" stroke="#a99cff" stroke-width="2" opacity="0.8"/>
  </g>

  <!-- data accents -->
  <g stroke="#a99cff" opacity="0.5" stroke-width="2" fill="none">
    <path d="M120 150 h56 M148 122 v56"/>
    <path d="M1010 660 h56 M1038 632 v56"/>
    <path d="M980 170 q60 40 130 20" stroke-dasharray="6 8"/>
  </g>
  <g fill="#c5b9ff" opacity="0.7">
    <rect x="96" y="700" width="46" height="6"/>
    <rect x="154" y="700" width="24" height="6" opacity="0.5"/>
    <rect x="186" y="700" width="70" height="6" opacity="0.3"/>
  </g>

  <rect width="1200" height="800" fill="url(#scan)"/>
</svg>`;

/* ------------------------------------------------------------------ */
/* dfir-fieldwork.png — cyan blue-team evidence card                   */
/* ------------------------------------------------------------------ */
const dfir = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0e1c23"/>
      <stop offset="0.6" stop-color="#153038"/>
      <stop offset="1" stop-color="#1d3d47"/>
    </linearGradient>
    <radialGradient id="lensGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#9feaf0" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#9feaf0" stop-opacity="0"/>
    </radialGradient>
    ${hexGridPattern("hex", "#9feaf0", 0.07)}
    ${scanlines(0.06)}
  </defs>

  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#hex)"/>

  <!-- magnifier -->
  <circle cx="470" cy="360" r="230" fill="url(#lensGlow)"/>
  <g fill="none" stroke="#9feaf0" stroke-linecap="round">
    <circle cx="470" cy="360" r="168" stroke-width="14"/>
    <path d="M592 484 L700 592" stroke-width="30"/>
    <path d="M592 484 L700 592" stroke="#1d3d47" stroke-width="12"/>
  </g>
  <!-- fingerprint arcs inside lens -->
  <g fill="none" stroke="#9feaf0" stroke-width="4" opacity="0.85" stroke-linecap="round">
    <path d="M400 430 q70 -100 160 -40"/>
    <path d="M382 396 q84 -134 202 -56"/>
    <path d="M366 360 q96 -166 244 -72"/>
    <path d="M406 466 q64 -66 138 -30"/>
    <path d="M430 496 q50 -40 104 -20"/>
  </g>
  <circle cx="470" cy="360" r="168" fill="none" stroke="#e4fbff" stroke-width="2" opacity="0.4"/>

  <!-- evidence cards -->
  <g>
    <g transform="translate(760 170)">
      <rect width="330" height="120" rx="12" fill="#12262e" stroke="#4f8d96" stroke-width="2"/>
      <rect x="20" y="22" width="52" height="66" rx="6" fill="none" stroke="#9feaf0" stroke-width="2.5"/>
      <path d="M30 44 h32 M30 56 h32 M30 68 h20" stroke="#9feaf0" stroke-width="2.5" opacity="0.7"/>
      <path d="M92 40 h180 M92 62 h210 M92 84 h140" stroke="#5f9aa3" stroke-width="6" stroke-linecap="round"/>
      <circle cx="300" cy="30" r="8" fill="#7ef7d0"/>
    </g>
    <g transform="translate(760 320)">
      <rect width="330" height="120" rx="12" fill="#12262e" stroke="#4f8d96" stroke-width="2"/>
      <rect x="20" y="22" width="52" height="66" rx="6" fill="none" stroke="#9feaf0" stroke-width="2.5"/>
      <path d="M32 74 L46 52 L60 66 L68 44" fill="none" stroke="#9feaf0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M92 40 h210 M92 62 h160 M92 84 h196" stroke="#5f9aa3" stroke-width="6" stroke-linecap="round"/>
      <circle cx="300" cy="30" r="8" fill="#ffd166"/>
    </g>
    <g transform="translate(760 470)">
      <rect width="330" height="120" rx="12" fill="#12262e" stroke="#4f8d96" stroke-width="2"/>
      <rect x="20" y="22" width="52" height="66" rx="6" fill="none" stroke="#9feaf0" stroke-width="2.5"/>
      <path d="M32 50 h36 M32 66 h36" stroke="#9feaf0" stroke-width="3"/>
      <path d="M92 40 h150 M92 62 h210 M92 84 h120" stroke="#5f9aa3" stroke-width="6" stroke-linecap="round"/>
      <circle cx="300" cy="30" r="8" fill="#7ef7d0"/>
    </g>
  </g>

  <!-- evidence timeline -->
  <g stroke="#9feaf0" fill="none">
    <path d="M120 690 H1080" stroke-width="3" opacity="0.5"/>
    <g fill="#0e1c23" stroke-width="3.5">
      <circle cx="220" cy="690" r="13"/>
      <circle cx="470" cy="690" r="13"/>
      <circle cx="720" cy="690" r="13"/>
      <circle cx="970" cy="690" r="13"/>
    </g>
    <circle cx="470" cy="690" r="24" opacity="0.6"/>
  </g>
  <g fill="#9feaf0" font-family="monospace" font-size="0"></g>

  <!-- HUD accents -->
  <g stroke="#9feaf0" opacity="0.45" stroke-width="2" fill="none">
    <path d="M96 140 h52 M122 114 v52"/>
    <path d="M1080 640 h52 M1106 614 v52"/>
  </g>

  <rect width="1200" height="800" fill="url(#scan)"/>
</svg>`;

const targets = [
  ["hero-cyber-core.png", hero, 1600, 700],
  ["operation-raven.png", raven, 1200, 800],
  ["dfir-fieldwork.png", dfir, 1200, 800],
];

for (const [name, svg, width, height] of targets) {
  const file = path.join(outDir, name);
  await sharp(Buffer.from(svg), { density: 96 }).resize(width, height).png({ compressionLevel: 9 }).toFile(file);
  console.log(`[images] wrote ${file}`);
}

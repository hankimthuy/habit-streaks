import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");

// Fire icon SVG matching the uploaded design:
// Dark rounded-rect background (#333) with orange/yellow gradient fire
const fireSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="fire1" x1="0.5" y1="1" x2="0.5" y2="0">
      <stop offset="0%" stop-color="#e8590c"/>
      <stop offset="40%" stop-color="#f59f00"/>
      <stop offset="100%" stop-color="#fcc419"/>
    </linearGradient>
    <linearGradient id="fire2" x1="0.5" y1="1" x2="0.5" y2="0">
      <stop offset="0%" stop-color="#d9480f"/>
      <stop offset="50%" stop-color="#f76707"/>
      <stop offset="100%" stop-color="#fd7e14"/>
    </linearGradient>
    <linearGradient id="fire3" x1="0.5" y1="1" x2="0.5" y2="0">
      <stop offset="0%" stop-color="#c92a2a"/>
      <stop offset="100%" stop-color="#e8590c"/>
    </linearGradient>
  </defs>
  <!-- Dark background with rounded corners -->
  <rect width="512" height="512" rx="108" ry="108" fill="#333333"/>
  <!-- Outer flame (left) -->
  <path d="M200 380 C180 340 150 280 165 230 C175 195 195 170 210 150 C220 136 225 120 222 100 C240 130 255 160 250 200 C248 220 240 240 235 260 C232 275 238 285 250 278 C260 272 268 255 275 235 C290 190 280 145 260 105 C290 135 320 175 335 220 C350 265 345 310 320 350 C310 365 295 378 275 385 C260 390 240 388 225 385 C210 382 200 380 200 380Z" fill="url(#fire1)"/>
  <!-- Inner flame (right accent) -->
  <path d="M235 380 C225 360 215 330 220 300 C225 275 240 255 255 238 C262 230 265 218 260 205 C272 225 280 248 278 270 C276 285 270 298 268 310 C266 320 272 325 280 318 C286 312 290 298 295 282 C305 250 298 218 285 190 C305 210 322 240 330 270 C338 300 335 330 318 355 C310 367 298 376 282 380 C268 384 252 383 240 381Z" fill="url(#fire2)"/>
  <!-- Core glow -->
  <path d="M245 385 C238 370 232 350 238 328 C242 312 252 298 262 288 C266 283 268 276 265 268 C274 280 280 295 278 312 C277 322 272 330 270 340 C269 348 274 352 280 346 C284 340 288 328 292 315 C298 292 294 270 286 252 C300 268 312 290 318 312 C324 334 320 355 308 370 C302 378 292 383 280 385 C270 387 258 386 248 385Z" fill="url(#fire3)" opacity="0.7"/>
</svg>
`;

// Maskable icon needs safe zone (padding) — same fire but smaller on larger bg
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="fire1" x1="0.5" y1="1" x2="0.5" y2="0">
      <stop offset="0%" stop-color="#e8590c"/>
      <stop offset="40%" stop-color="#f59f00"/>
      <stop offset="100%" stop-color="#fcc419"/>
    </linearGradient>
    <linearGradient id="fire2" x1="0.5" y1="1" x2="0.5" y2="0">
      <stop offset="0%" stop-color="#d9480f"/>
      <stop offset="50%" stop-color="#f76707"/>
      <stop offset="100%" stop-color="#fd7e14"/>
    </linearGradient>
    <linearGradient id="fire3" x1="0.5" y1="1" x2="0.5" y2="0">
      <stop offset="0%" stop-color="#c92a2a"/>
      <stop offset="100%" stop-color="#e8590c"/>
    </linearGradient>
  </defs>
  <!-- Full bleed background for maskable -->
  <rect width="512" height="512" fill="#333333"/>
  <!-- Fire scaled down 80% and centered for safe zone -->
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <path d="M200 380 C180 340 150 280 165 230 C175 195 195 170 210 150 C220 136 225 120 222 100 C240 130 255 160 250 200 C248 220 240 240 235 260 C232 275 238 285 250 278 C260 272 268 255 275 235 C290 190 280 145 260 105 C290 135 320 175 335 220 C350 265 345 310 320 350 C310 365 295 378 275 385 C260 390 240 388 225 385 C210 382 200 380 200 380Z" fill="url(#fire1)"/>
    <path d="M235 380 C225 360 215 330 220 300 C225 275 240 255 255 238 C262 230 265 218 260 205 C272 225 280 248 278 270 C276 285 270 298 268 310 C266 320 272 325 280 318 C286 312 290 298 295 282 C305 250 298 218 285 190 C305 210 322 240 330 270 C338 300 335 330 318 355 C310 367 298 376 282 380 C268 384 252 383 240 381Z" fill="url(#fire2)"/>
    <path d="M245 385 C238 370 232 350 238 328 C242 312 252 298 262 288 C266 283 268 276 265 268 C274 280 280 295 278 312 C277 322 272 330 270 340 C269 348 274 352 280 346 C284 340 288 328 292 315 C298 292 294 270 286 252 C300 268 312 290 318 312 C324 334 320 355 308 370 C302 378 292 383 280 385 C270 387 258 386 248 385Z" fill="url(#fire3)" opacity="0.7"/>
  </g>
</svg>
`;

async function generate() {
  mkdirSync(iconsDir, { recursive: true });

  // Generate 192x192
  await sharp(Buffer.from(fireSvg))
    .resize(192, 192)
    .png()
    .toFile(join(iconsDir, "icon-192x192.png"));
  console.log("✓ icon-192x192.png");

  // Generate 512x512
  await sharp(Buffer.from(fireSvg))
    .resize(512, 512)
    .png()
    .toFile(join(iconsDir, "icon-512x512.png"));
  console.log("✓ icon-512x512.png");

  // Generate maskable 512x512
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(join(iconsDir, "icon-maskable-512x512.png"));
  console.log("✓ icon-maskable-512x512.png");

  console.log("All icons generated!");
}

generate().catch(console.error);

// Rasterize the LLM School icon (indigo square, white speech bubble, sparkle) into PNGs. No dependencies.
// usage: node tools/makeicon.js <outdir>
const fs = require("fs"), path = require("path"), zlib = require("zlib");
const outDir = process.argv[2] || ".";

const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const BG1 = hex("#4F46E5"), BG2 = hex("#7C3AED"), WHITE = [255, 255, 255], INK = hex("#4338CA");
const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

// geometry in a 64-unit space (same shapes as the inline <svg class="logo"> in index.html)
function inRoundedRect(x, y, rx, ry, w, hh, r) {
  if (x < rx || x > rx + w || y < ry || y > ry + hh) return false;
  const cx = Math.max(rx + r, Math.min(x, rx + w - r)), cy = Math.max(ry + r, Math.min(y, ry + hh - r));
  return Math.hypot(x - cx, y - cy) <= r;
}
function inPoly(pts, x, y) { let inside = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside; } return inside; }
const TAIL = [[19, 46], [15, 58], [31, 46]];
const STAR = (() => { const c = [32, 28.5], R = 12.5, r = 3.3, p = []; for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + k * Math.PI / 4, rad = k % 2 ? r : R; p.push([c[0] + rad * Math.cos(a), c[1] + rad * Math.sin(a)]); } return p; })();

function shade(x, y) {
  let c = lerp(BG1, BG2, Math.max(0, Math.min(1, (x + y) / 128)));
  if (inRoundedRect(x, y, 6, 9, 52, 38, 13) || inPoly(TAIL, x, y)) c = WHITE;
  if (inPoly(STAR, x, y) || Math.hypot(x - 46, y - 18) <= 2.6) c = INK;
  return c;
}
function render(W) {
  const SS = 4, rows = [];
  for (let py = 0; py < W; py++) {
    const row = Buffer.alloc(1 + W * 3); row[0] = 0;
    for (let px = 0; px < W; px++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) { const c = shade((px + (sx + 0.5) / SS) * 64 / W, (py + (sy + 0.5) / SS) * 64 / W); r += c[0]; g += c[1]; b += c[2]; }
      const n = SS * SS; row[1 + px * 3] = Math.round(r / n); row[2 + px * 3] = Math.round(g / n); row[3 + px * 3] = Math.round(b / n);
    }
    rows.push(row);
  }
  return png(W, W, Buffer.concat(rows));
}
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = buf => { let c = 0xFFFFFFFF; for (const b of buf) c = CRC[(c ^ b) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type, "ascii"), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }
function png(w, hh, raw) { const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(hh, 4); ihdr[8] = 8; ihdr[9] = 2; return Buffer.concat([Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]); }

for (const [name, size] of [["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]]) {
  const file = path.join(outDir, name); fs.writeFileSync(file, render(size)); console.log(name, size + "px", fs.statSync(file).size, "bytes");
}

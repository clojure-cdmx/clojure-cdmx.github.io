import QRCode from './qr/index.js';
import levels from './qr/QRErrorCorrectLevel.js';
import { lumaUrl } from '../meetup-config.js';

const destination = new URL(lumaUrl);
const demo = destination.origin === 'https://luma.com' && destination.pathname === '/';

for (const link of document.querySelectorAll('[data-luma]')) {
  link.href = destination.href;
  if (!demo) link.setAttribute('aria-label', 'Abrir el evento en Luma');
}
for (const label of document.querySelectorAll('[data-demo]')) {
  label.hidden = !demo;
}

const frame = document.querySelector('[data-qr]');
if (frame) {
  const qr = new QRCode(0, levels.M);
  qr.addData(destination.href);
  qr.make();

  const quietZone = 4;
  const side = qr.getModuleCount();
  const extent = side + quietZone * 2;
  const pixels = [];
  for (let row = 0; row < side; row++) {
    for (let col = 0; col < side; col++) {
      if (qr.isDark(row, col)) pixels.push(`M${col + quietZone} ${row + quietZone}h1v1h-1z`);
    }
  }
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${extent} ${extent}`);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('shape-rendering', 'crispEdges');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', pixels.join(''));
  path.setAttribute('fill', '#251a31');
  svg.append(path);
  frame.replaceChildren(svg);
}

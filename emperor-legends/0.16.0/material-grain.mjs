import * as THREE from './vendor/three.module.min.js';

const backgrounds = { wood: '#d6c4ad', earth: '#e1d1b6', stone: '#dad4c6', cloth: '#e5ded0', reed: '#d5c397' };

export function grain(kind, random) {
  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = canvas.height = size;
  const paint = canvas.getContext('2d');
  paint.fillStyle = backgrounds[kind];
  paint.fillRect(0, 0, size, size);
  for (let i = 0; i < 2200; i += 1) {
    paint.fillStyle = random() > 0.48 ? 'rgba(78,58,39,.055)' : 'rgba(255,247,226,.095)';
    paint.fillRect(random() * size, random() * size, 0.5 + random() * (kind === 'wood' ? 1.4 : 2.6),
      0.6 + random() * (kind === 'wood' ? 37 : 3.3));
  }
  if (kind === 'wood') {
    for (let x = 1; x < size; x += 4 + random() * 4) {
      paint.strokeStyle = x % 3 < 1 ? 'rgba(247,224,192,.18)' : 'rgba(74,52,38,.105)';
      paint.lineWidth = 0.7 + random() * 0.85;
      paint.beginPath();
      paint.moveTo(x, 0);
      paint.bezierCurveTo(x - 3, 94, x + 5, 180, x, size);
      paint.stroke();
    }
  } else if (kind === 'earth' || kind === 'stone') {
    const interval = kind === 'earth' ? 21 : 36;
    for (let y = 0; y < size; y += interval) {
      paint.fillStyle = 'rgba(91,67,51,.08)';
      paint.fillRect(0, y + random() * 7, size, 1.2 + random() * 1.2);
      paint.fillStyle = 'rgba(251,232,193,.15)';
      paint.fillRect(0, y + 4 + random() * 5, size, 1.1);
    }
  } else {
    const reed = kind === 'reed';
    for (let y = 0; y < size; y += reed ? 5 : 4) {
      paint.fillStyle = reed ? 'rgba(94,69,41,.18)' : 'rgba(76,58,44,.07)';
      paint.fillRect(0, y, size, reed ? 1.65 : 1);
    }
    for (let x = 0; x < size; x += reed ? 13 : 5) {
      paint.fillStyle = 'rgba(255,243,216,.20)';
      paint.fillRect(x, 0, 1, size);
    }
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  return map;
}

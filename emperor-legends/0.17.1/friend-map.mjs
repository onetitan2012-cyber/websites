import * as THREE from './vendor/three.module.min.js';

// A painted prop for the dedication scene. The drawing is a scenic interpretation.
export function tributeMap(parent, art) {
  const sheet = document.createElement('canvas');
  sheet.width = 640;
  sheet.height = 300;
  const g = sheet.getContext('2d');
  g.fillStyle = '#d8bc85';
  g.fillRect(0, 0, 640, 300);
  g.strokeStyle = '#8b6743';
  g.lineWidth = 3;
  g.strokeRect(12, 12, 616, 276);
  g.strokeRect(17, 17, 606, 266);
  g.strokeStyle = '#607d78';
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(20, 63);
  g.bezierCurveTo(130, 15, 180, 240, 309, 168);
  g.bezierCurveTo(448, 82, 480, 231, 622, 248);
  g.stroke();
  g.strokeStyle = '#6a6148';
  g.lineWidth = 2;
  for (const [x, y, count] of [[50, 180, 9], [218, 94, 6], [360, 123, 7]]) {
    for (let i = 0; i < count; i++) {
      const a = x + i * 13, b = y + 7 * Math.sin(i);
      g.beginPath(); g.moveTo(a, b); g.lineTo(a + 9, b - 15); g.lineTo(a + 17, b); g.stroke();
    }
  }
  g.fillStyle = '#483c31';
  g.font = '32px serif';
  g.fillText('督', 548, 73); g.fillText('亢', 548, 111);
  const texture = new THREE.CanvasTexture(sheet);
  texture.colorSpace = THREE.SRGBColorSpace;
  const group = art.groupAt(parent, -0.68, 0.512, 0.01);
  const paper = art.mesh(group, new THREE.PlaneGeometry(1.35, 0.61), art.material(0xffffff, texture), 0, 0, 0);
  paper.rotation.x = -Math.PI / 2;
  const roll = art.mesh(group, new THREE.CylinderGeometry(.045, .045, .65, 20), art.material(0xc5a474), 0, .036, 0);
  roll.rotation.x = Math.PI / 2;
  return { group, unfold(amount) {
    texture.repeat.x = amount;
    paper.scale.x = amount;
    paper.position.x = amount * .675;
    roll.position.x = amount * 1.35;
  } };
}

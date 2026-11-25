import * as THREE from './vendor/three.module.min.js';

function drawImpression(g,x,y,scale) {
  g.save();
  g.translate(x,y);
  g.scale(scale,scale);
  g.beginPath();
  for (const [i,[u,v]] of [[0,0],[9,-1],[12,-5],[14,-1],[32,-1],[42,2],[32,4],[14,4],[12,8],[9,4],[0,3]].entries()) {
    if (i === 0) g.moveTo(u,v); else g.lineTo(u,v);
  }
  g.closePath();
  g.fill();
  g.restore();
}

// The single page is repainted only when a new layer is uncovered.
export function objectLeaf(parent, art) {
  const page = document.createElement('canvas');
  page.width = 512; page.height = 288;
  const g = page.getContext('2d');
  const texture = new THREE.CanvasTexture(page);
  texture.colorSpace = THREE.SRGBColorSpace;
  const inkOnPaper = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  const paper = art.mesh(parent, new THREE.PlaneGeometry(1.07,.60), inkOnPaper, .13,.536,0);
  paper.rotation.x = -Math.PI / 2;
  let previous;
  return layers => {
    paper.visible = layers >= 0;
    if (layers < 0 || layers === previous) return;
    previous = layers;
    g.fillStyle = '#d7c399';
    g.fillRect(0,0,512,288);
    g.strokeStyle = '#937e5e'; g.lineWidth = 3; g.strokeRect(12,12,488,264);
    g.fillStyle = '#493f32'; g.font = '24px serif'; g.fillText('燕 地 物 记',32,56);
    g.fillStyle = ['#cfbc94','#a69b82','#626856','#526253'][layers];
    drawImpression(g,74,125,8.5);
    if (layers === 3) {
      g.font = 'bold 34px serif'; g.fillStyle = '#463b2e'; g.fillText('燕 匕',32,245);
      g.strokeStyle='#934f3b'; g.strokeRect(412,198,55,55);
      g.fillStyle='#934f3b'; g.font='34px serif'; g.fillText('录',423,238);
    }
    texture.needsUpdate = true;
  };
}

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
  // The same small ink impression appears in the book of objects.
  g.fillStyle = '#536052';
  drawImpression(g,579,211,1);
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

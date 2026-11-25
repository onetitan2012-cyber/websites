import * as THREE from './vendor/three.module.min.js';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';
import { addCopperLamp, addInkRows, addTileCourses } from './scene-art.mjs';
import { PETITION_TARGET } from './board.mjs';

const ease = THREE.MathUtils.smoothstep;
const mix = THREE.MathUtils.lerp;

export function createPetitionWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0x697d7c);
  const art = makeCrownArt();
  const { box, material, groupAt, beamPattern, earth, wood, matTexture } = art;
  const adobe = material(0xab9479, earth);
  const stone = [0x777b71, 0x878479, 0x8c8779].map(shade => material(shade, earth));
  const beam = material(0x403635, wood);
  const lacquer = material(0x73453d, wood, 0.65);
  const red = material(0x89554a, wood);
  const slate = material(0x535d5e);
  const reed = material(0xbbab83, matTexture);
  const jade = material(0x597c6c, wood);
  const sienna = material(0xa26747, wood);
  const slip = [0xb8a579, 0xc9b382, 0xb59b6e].map(shade => material(shade, wood));
  const ink = material(0x4c3d32);
  const bronze = material(0x927754, null, 0.45, 0.31);

  const sun = new THREE.DirectionalLight(0xffe2bb, 2.35);
  sun.position.set(-4.3, 7.1, 4.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 5.4, bottom: -5.4, near: 0.1, far: 28 });
  sun.shadow.bias = -0.00036;
  sun.shadow.normalBias = 0.024;
  const rim = new THREE.DirectionalLight(0xa2cfdb, 0.75);
  rim.position.set(4.6, 4, -2.8);
  world.add(sun, rim, new THREE.HemisphereLight(0xc6d1c9, 0x55443b, 1.65));

  box(world, adobe, 0, -0.19, 1.05, 12, 0.38, 8);
  for (let row = 0; row < 6; row += 1) {
    for (let column = 0; column < 9; column += 1) {
      box(world, stone[(row + column * 2) % 3], (column - 4) * 1.17 + (row % 2) * 0.39, 0.015,
        -1.58 + row * 0.86, 1.15, 0.029, 0.835);
    }
  }

  const outside = new THREE.MeshBasicMaterial({ color: 0x798d87 });
  box(world, outside, -1.28, 1.9, -5.70, 10, 4, 0.10);
  box(world, stone[2], -0.88, -0.069, -3.80, 9.2, 0.13, 3.90);
  for (const z of [-2.55, -3.12, -3.69, -4.26]) {
    box(world, stone[1], -2.15, 0.003, z, 3.63, 0.022, 0.042);
  }
  box(world, material(0x898977, earth), -1.0, 0.86, -4.45, 8.9, 1.71, 0.3);
  box(world, slate, -1.0, 1.755, -4.43, 9.15, 0.12, 0.49, true);
  box(world, adobe, 2.2, 1.79, -2.09, 5.1, 3.59, 0.24);
  box(world, adobe, -4.52, 1.79, -2.09, 1.20, 3.59, 0.24);
  box(world, adobe, -2.15, 3.18, -2.08, 3.58, 0.79, 0.25);
  box(world, beam, -2.15, 2.68, -1.88, 3.61, 0.17, 0.28, true);
  box(world, stone[1], -2.15, 0.07, -1.94, 3.63, 0.14, 0.61);
  for (const x of [-4.73, -0.38, 2.18, 4.72]) {
    box(world, lacquer, x, 1.88, -1.88, 0.245, 3.46, 0.258, true);
    box(world, stone[0], x, 0.13, -1.88, 0.38, 0.245, 0.42);
    box(world, beam, x, 3.34, -1.84, 0.59, 0.18, 0.43, true);
  }
  box(world, beam, 0, 3.50, -1.79, 9.8, 0.24, 0.40, true);
  box(world, lacquer, 0, 3.35, -1.54, 9.8, 0.145, 0.17);
  beamPattern(world, 0, 3.35, -1.448, 9.65, 0.091, 10);
  const roof = groupAt(world, 0, 0, -1.90);
  const roofBase = box(roof, slate, 0, 3.83, 0.02, 10.1, 0.12, 1.30, true);
  roofBase.rotation.x = 0.29;
  addTileCourses(roof, { width: 10.1, run: 1.29, rise: 0.37, eave: 3.69, z: -0.65, back: false });

  const shelves = groupAt(world, 3.20, 0, -1.75);
  box(shelves, beam, 0, 1.46, -0.035, 2.36, 2.68, 0.185);
  for (const x of [-1.14, 0, 1.14]) box(shelves, lacquer, x, 1.49, 0.16, 0.10, 2.69, 0.33);
  for (const height of [0.32, 1.00, 1.72, 2.43, 2.80]) {
    box(shelves, red, 0, height, 0.15, 2.35, 0.087, 0.47, true);
  }
  for (const y of [0.36, 1.04, 1.77]) {
    for (const x of [-0.83, -0.43, 0.31, 0.73]) {
      const roll = box(shelves, slip[(Math.round(y * 9 + x * 7) + 17) % 3], x, y + 0.061, 0.17, 0.31, 0.11, 0.32, true);
      roll.rotation.y = x * 0.16;
      box(shelves, x < 0 ? jade : sienna, x, y + 0.121, 0.17, 0.052, 0.010, 0.329);
    }
  }

  box(world, stone[0], 1.63, 0.13, -0.55, 2.43, 0.245, 1.62, true);
  box(world, adobe, 1.63, 0.249, -0.55, 2.46, 0.075, 1.65, true);
  box(world, reed, 1.84, 0.294, -0.32, 1.30, 0.032, 1.05);
  box(world, reed, -0.06, 0.045, 1.89, 5.06, 0.030, 2.24);
  for (const z of [0.80, 2.98]) box(world, lacquer, -0.06, 0.061, z, 5.06, 0.019, 0.064);
  const desk = groupAt(world, 0, 0.065, 1.92);
  box(desk, beam, 0, 0.405, 0, 4.23, 0.15, 1.36, true);
  box(desk, lacquer, 0, 0.48, 0, 4.31, 0.074, 1.43, true);
  beamPattern(desk, 0, 0.411, 0.721, 4.08, 0.080, 5);
  for (const x of [-1.88, 1.88]) for (const z of [-0.52, 0.52]) {
    box(desk, beam, x, 0.219, z, 0.14, 0.438, 0.14, true);
  }
  const files = [-1.01, 1.01].map((x, index) => {
    const file = groupAt(desk, x, 0.524, 0.01);
    const cord = index === 0 ? jade : sienna;
    box(file, reed, 0, 0.011, 0, 1.55, 0.022, 1.00);
    box(file, cord, 0, 0.021, 0.504, 1.55, 0.028, 0.047);
    const bundle = box(file, slip[1], 0, 0.069, -0.347, 1.29, 0.104, 0.23, true);
    for (const bx of [-0.36, 0.38]) box(bundle, cord, bx, 0.51, 0,
      0.065, 0.12, 1.04);
    const panels = Array.from({ length: PETITION_TARGET }, (_, count) => {
      const panel = groupAt(file, 0, 0.040, -0.37 + count * 0.29);
      for (let column = 0; column < 10; column += 1) {
        box(panel, slip[(column + count) % 3], (column - 4.5) * 0.129, 0, 0.098,
          0.115, 0.035, 0.24);
      }
      box(panel, cord, 0, 0.021, 0.206, 1.28, 0.011, 0.024);
      const inscription = groupAt(panel, 0, 0.023, 0.095);
      addInkRows(inscription, box, ink, { width: 1.14, length: 0.13, y: 0, columns: 10, rows: 2 });
      return panel;
    });
    return { bundle, panels };
  });

  const plaque = groupAt(desk, 0, 0.54, 0.42);
  box(plaque, slip[1], 0, 0, 0, 0.35, 0.045, 0.41, true);
  addInkRows(plaque, box, ink, { width: 0.26, length: 0.32, y: 0.024, columns: 4, rows: 5 });
  box(plaque, sienna, 0, 0.027, 0.14, 0.13, 0.013, 0.072);
  const canalSlip = groupAt(desk, -1.83, 0.54, 0.26);
  box(canalSlip, slip[1], 0,0.022,0,0.46,0.043,0.75,true);
  const inscription = document.createElement('canvas');
  inscription.width = 128;
  inscription.height = 256;
  const brush = inscription.getContext('2d');
  brush.font = 'bold 41px serif';
  brush.textAlign = 'center';
  brush.fillStyle = '#422f20';
  [...'韩水工郑国'].forEach((glyph,i) => brush.fillText(glyph,64,44+i*46));
  const inkFace = new THREE.Mesh(new THREE.PlaneGeometry(0.40,0.69),
    new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(inscription),transparent:true}));
  inkFace.rotation.x = -Math.PI/2;
  inkFace.position.y = 0.047;
  canalSlip.add(inkFace);
  const lampStand = groupAt(world, -3.36, 0.028, 1.63);
  box(lampStand, beam, 0, 0.29, 0, 0.63, 0.56, 0.59, true);
  box(lampStand, lacquer, 0, 0.595, 0, 0.83, 0.08, 0.68, true);
  addCopperLamp(lampStand, 0.05, 0.635, 0, 0.95);
  const glow = new THREE.PointLight(0xffbd83, 7.6, 3.9, 2);
  glow.position.set(-3.29, 1.23, 1.63);
  world.add(glow);

  const king = makeCrownFigure(world, art, 'king', 1.16);
  const clerk = makeCrownFigure(world, art, 'official', 1.06);
  const lisi = makeCrownFigure(world, art, 'lisi', 1.10);
  const palm = new THREE.Vector3();
  const slipGrip = groupAt(world);
  box(slipGrip, slip[1], 0, 0, 0, 0.34, 0.046, 0.34, true);
  addInkRows(slipGrip, box, bronze, { width: 0.26, length: 0.25, y: 0.024, columns: 4 });

  function pose(actor, x, y, z, yaw, kneel = 0, gait = 0) {
    actor.model.position.set(x, y, z);
    actor.model.rotation.y = yaw;
    actor.rig.set(kneel, gait);
    actor.arms[0].rotation.set(-0.14 - kneel * 0.58 + gait * 0.22, 0, -0.24);
    actor.arms[1].rotation.set(-0.14 - kneel * 0.58 - gait * 0.22, 0, 0.24);
  }

  let lastKey = '';
  let lastEvidence = [0, 0];
  let fromEvidence = lastEvidence;
  let started = 0;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    const { storyBeat: beat, evidence } = state;
    const key = [beat, ...evidence].join('/');
    if (key !== lastKey) {
      fromEvidence = evidence.some((count, index) => count < lastEvidence[index]) ? evidence : lastEvidence;
      lastEvidence = evidence;
      lastKey = key;
      started = time;
    }
    const age = reduced ? 2100 : time - started;
    canalSlip.visible = beat === 'canal-brief';
    const arrival = beat === 'edict';
    const dispatching = beat === 'dispatch';
    const recall = beat === 'recall';
    const delivery = dispatching ? ease(age, 200, 1430) : 0;
    const entering = recall ? ease(age, 70, 1060) : 0;
    const kneel = recall ? ease(age, 1065, 1740) : 0;
    const gait = Math.sin(delivery * 8 * Math.PI) * Math.sin(delivery * Math.PI);
    const paging = ease(age, 35, 555);
    const review = evidence.map((count, index) => mix(fromEvidence[index], count, paging));

    pose(king, 1.79, 0.304, -0.30, -0.55, 1);
    king.head.rotation.set(0.16, recall ? -0.23 : 0.16, 0);
    pose(clerk, mix(-0.48, -3.11, delivery), 0.034, mix(0.82, -2.55, delivery),
      dispatching ? mix(0.46, -2.31, ease(age, 30, 395)) : 0.48, arrival || dispatching ? 0 : 0.74, gait);
    clerk.head.rotation.set(0.23, dispatching ? 0 : 0.19, 0);
    lisi.model.visible = recall;
    const returnGait = Math.sin(entering * 7 * Math.PI) * Math.sin(entering * Math.PI);
    pose(lisi, mix(-3.36, -1.32, entering), 0.039, mix(-1.73, 0.79, entering),
      mix(0.95, 0.78, entering), kneel, returnGait);
    lisi.head.rotation.set(0.19, 0.20, 0);
    if (dispatching) {
      clerk.arms[0].rotation.set(-1.20, 0, -0.06);
      clerk.arms[0].localToWorld(palm.set(0, -0.353, 0.033));
      palm.y += 0.038;
      slipGrip.position.copy(palm);
      slipGrip.rotation.set(0.20, clerk.model.rotation.y, 0);
    }
    slipGrip.visible = dispatching;

    files.forEach(({ bundle, panels }, index) => {
      bundle.scale.z = 0.23 * (1 - review[index] * 0.24);
      bundle.scale.y = 0.104 * (1 - review[index] * 0.13);
      bundle.position.z = -0.30 + review[index] * 0.263;
      for (const [part, panel] of panels.entries()) {
        const open = THREE.MathUtils.clamp(review[index] - part, 0, 1);
        panel.visible = open > 0.012;
        panel.rotation.x = -1.12 * (1 - open);
      }
    });

    const targetX = dispatching ? mix(0.1, -0.96, delivery) : recall ? -0.12 : 0.12;
    const targetY = (arrival ? 1.44 : 1.15) - captionOffset * 0.91;
    camera.zoom = (arrival ? 1.33 : 1.50) - captionOffset * 0.15;
    camera.updateProjectionMatrix();
    camera.position.set(targetX + (arrival ? 2.64 : 1.36), targetY + (arrival ? 5.10 : 7.85), 14.6);
    camera.lookAt(targetX, targetY, 0.80 + captionOffset * 0.23);
    if (canalSlip.visible) {
      camera.zoom=3.15;
      camera.updateProjectionMatrix();
      camera.position.set(-1.72,7.8,6.6);
      camera.lookAt(-1.54,0.61-captionOffset*0.22,2.12);
    }
    camera.updateMatrixWorld();
    marker.hidden = true;
    return !reduced && age < (recall ? 1810 : dispatching ? 1500 : 575);
  }

  return { world, frame, controlsCameraZoom: true };
}

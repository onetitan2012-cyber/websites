import * as THREE from './vendor/three.module.min.js';
import { QI_GOAL, QI_GRAIN_START } from './board.mjs';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';
import { addCopperLamp, addInkRows, addTileCourses } from './scene-art.mjs';

const { lerp, smoothstep } = THREE.MathUtils;

export function createQiWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0x8c9c9a);
  const art = makeCrownArt();
  const { box, mesh, round, groupAt, material, earth, wood, cloth, matTexture } = art;
  const clay = material(0xa39781, earth);
  const rammed = [0xa99d87, 0xa39883, 0xa89a82, 0xa39882, 0xb0a38a].map(color => material(color, earth));
  const pale = material(0xc1b397, earth);
  const stone = [0x8c9388, 0x9a9c8d, 0xa5a397].map(color => material(color, earth));
  const beam = material(0x524743, wood);
  const lacquer = material(0x7d5146, wood, 0.63);
  const timber = material(0x8d6c56, wood);
  const rail = material(0xb08a61, wood);
  const blue = material(0x66878c, cloth);
  const slate = material(0x575f63);
  const reed = material(0xb1a181, matTexture);
  const hemp = material(0xa78c61, cloth);
  const grain = material(0xcdb47e, cloth);
  const bronze = material(0x877555, null, 0.57, 0.32);
  const bamboo = material(0xc3a780, wood);
  const ink = material(0x59463e);

  const sun = new THREE.DirectionalLight(0xf3e2c6, 1.97);
  sun.position.set(-4.73, 7.87, 4.82);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -7.8, right: 7.8, top: 6.0, bottom: -6.0, near: 0.1, far: 29 });
  sun.shadow.normalBias = 0.028;
  const rim = new THREE.DirectionalLight(0xaecbd1, 0.59);
  rim.position.set(4.89, 5, -4.3);
  world.add(sun, rim, new THREE.HemisphereLight(0xdce8e5, 0x645747, 1.83));

  box(world, clay, 0, -0.19, -0.12, 16.6, 0.37, 12);
  for (let row = 0; row < 9; row += 1) for (let col = 0; col < 10; col += 1) {
    box(world, stone[(row + col * 2) % 3], (col - 4.5) * 1.12 + (row % 2) * 0.238,
      0.012, -4.22 + row * 0.82, 1.09, 0.027, 0.788);
  }

  const gate = groupAt(world, 0.10, 0.03, -2.44);
  gate.name = 'market-gate';
  for (const side of [-1, 1]) {
    for (let i = 0; i < rammed.length; i += 1) {
      box(gate, rammed[i], side * (3.87 + i * 0.033), 0.29 + i * 0.58, -0.24 - i * 0.035,
        5.24 - i * 0.067, 0.582, 0.87 - i * 0.091, true);
    }
    box(gate, slate, side * 4.02, 2.95, -0.395, 5.06, 0.14, 0.59, true);
    box(gate, stone[1], side * 1.25, 0.14, 0, 0.41, 0.27, 0.43, true);
    box(gate, lacquer, side * 1.23, 1.33, -0.018, 0.25, 2.56, 0.34, true);
  }
  box(gate, pale, 0, 2.73, -0.28, 2.82, 0.42, 0.55, true);
  box(gate, beam, 0, 2.51, -0.04, 2.84, 0.21, 0.31, true);
  const roof = box(gate, slate, 0, 3.18, -0.36, 3.61, 0.13, 1.41, true);
  roof.rotation.x = 0.26;
  addTileCourses(gate, { width: 3.66, run: 1.51, rise: 0.43, eave: 2.99, z: -1.04, back: false });
  const doors = [-1, 1].map(side => {
    const hinge = groupAt(gate, side * 1.12, 0.16, -0.036);
    const x = side * -0.538;
    box(hinge, lacquer, x, 1.12, 0.0, 1.075, 2.24, 0.118, true);
    for (let col = 0; col < 5; col += 1) {
      box(hinge, beam, side * -(col + 1) * 0.175, 1.12, 0.069, 0.018, 2.09, 0.013);
    }
    for (const y of [0.47, 1.80]) box(hinge, beam, x, y, 0.093, 1.057, 0.10, 0.058, true);
    round(hinge, bronze, [0.062, 0.067, 0.040], side * -0.89, 1.07, 0.091);
    return hinge;
  });
  box(world, stone[2], 0.08, 0.075, -5.01, 2.62, 0.14, 1.83);
  for (const x of [-1.86, 1.86]) {
    box(world, pale, x, 0.80, -4.99, 1.12, 1.56, 1.95, true);
    box(world, slate, x, 1.64, -4.97, 1.28, 0.14, 2.04, true);
  }

  const market = groupAt(world, -3.14, 0.03, 0.05);
  market.name = 'market-stall';
  box(market, reed, -0.22, 0.029, 0.19, 2.36, 0.04, 2.11);
  for (const side of [-1, 1]) for (const z of [-0.96, 0.94]) {
    box(market, beam, side * 1.18, 0.91, z, 0.103, 1.75, 0.11, true);
  }
  const canopy = box(market, blue, 0, 1.86, -0.031, 2.65, 0.075, 2.27, true);
  canopy.rotation.x = 0.16;
  box(market, rail, 0, 1.677, 1.02, 2.69, 0.052, 0.082, true);
  box(market, rail, 0, 2.024, -1.08, 2.69, 0.056, 0.083, true);
  box(market, timber, -0.80, 0.28, -0.66, 0.47, 0.51, 0.44, true);

  const nook = groupAt(world, 3.62, 0.02, -1.00);
  box(nook, pale, 0, 0.97, -0.22, 2.48, 1.95, 0.30, true);
  box(nook, beam, 0, 2.08, -0.10, 2.56, 0.158, 0.43, true);
  const nookRoof = box(nook, slate, 0, 2.31, -0.37, 2.65, 0.13, 1.13, true);
  nookRoof.rotation.x = 0.22;
  box(nook, beam, 0, 1.23, -0.025, 1.17, 0.76, 0.072);
  const shutter = groupAt(nook, 0, 1.59, 0.067);
  box(shutter, timber, 0, -0.34, 0.005, 1.12, 0.67, 0.082, true);
  for (const x of [-0.36, -0.17, 0.017, 0.205, 0.39]) {
    box(shutter, beam, x, -0.34, 0.049, 0.022, 0.63, 0.017);
  }
  box(nook, rail, 0, 0.856, 0.125, 1.28, 0.079, 0.32, true);

  const desk = groupAt(world, 2.00, 0.028, 0.81);
  box(desk, lacquer, 0, 0.46, 0, 2.75, 0.087, 1.17, true);
  for (const x of [-1.18, 1.18]) for (const z of [-0.41, 0.41]) {
    box(desk, beam, x, 0.222, z, 0.113, 0.44, 0.117, true);
  }
  box(desk, reed, 0.04, 0.516, -0.04, 1.78, 0.032, 0.93);
  box(desk, blue, 0.04, 0.533, 0.424, 1.77, 0.027, 0.068);
  const pages = Array.from({ length: QI_GOAL }, (_, index) => {
    const x = -0.73 + index * 0.216;
    const page = groupAt(desk, x, 0.55, -0.41);
    box(page, bamboo, 0, 0.0, 0.36, 0.185, 0.031, 0.72, true);
    addInkRows(groupAt(page, 0, 0, 0.36), box, ink, { width: 0.15, length: 0.58, y: 0.017, columns: 2, rows: 5 });
    return page;
  });
  box(desk, bamboo, 0.99, 0.56, -0.26, 0.27, 0.066, 0.24, true);

  const cart = groupAt(world, -0.69, 0.033, 1.98);
  cart.rotation.y = -0.20;
  box(cart, timber, 0, 0.286, 0.02, 1.36, 0.12, 1.28, true);
  const wheel = new THREE.CylinderGeometry(0.28, 0.28, 0.10, 20).rotateZ(Math.PI / 2);
  const axle = new THREE.CylinderGeometry(0.09, 0.09, 0.17, 13).rotateZ(Math.PI / 2);
  for (const side of [-1, 1]) {
    box(cart, beam, side * 0.64, 0.416, 0.018, 0.081, 0.156, 1.31, true);
    box(cart, timber, side * 0.53, 0.30, -0.75, 0.094, 0.076, 0.58, true);
    mesh(cart, wheel, beam, side * 0.73, 0.256, 0.12, true);
    mesh(cart, axle, bronze, side * 0.769, 0.256, 0.12);
    for (let index = 0; index < 8; index += 1) {
      const theta = index * Math.PI / 4;
      const spoke = box(cart, rail, side * 0.784, 0.256 + Math.cos(theta) * 0.147,
        0.12 + Math.sin(theta) * 0.147, 0.028, 0.173, 0.036);
      spoke.rotation.x = theta;
    }
  }
  cart.updateWorldMatrix(true, false);
  const sacks = Array.from({ length: QI_GRAIN_START }, (_, index) => {
    const sack = groupAt(world);
    sack.name = 'market-sack-' + index;
    round(sack, grain, [0.182, 0.113, 0.149], 0, 0, 0, true);
    round(sack, grain, [0.058, 0.045, 0.047], 0.15, 0.031, 0.016);
    box(sack, hemp, 0.126, 0.043, 0.011, 0.024, 0.034, 0.097);
    const origin = new THREE.Vector3(-3.19 + (index % 3 - 1) * 0.432, 0.174 + (index === 9 ? 0.205 : 0),
      0.76 + (index === 9 ? 0.378 : Math.floor(index / 3) * 0.387));
    const ahead = QI_GRAIN_START - 1 - index;
    const end = cart.localToWorld(new THREE.Vector3((ahead % 2 - 0.5) * 0.45, 0.463 + (ahead >= 6 ? 0.222 : 0),
      -0.42 + Math.floor((ahead % 6) / 2) * 0.393));
    return { sack, origin, end };
  });

  const countRoll = groupAt(world, -3.85, 0.52, 2.12);
  box(countRoll, timber, 0, -0.061, 0, 0.77, 0.098, 0.71, true);
  box(countRoll, bamboo, 0, 0, 0, 0.53, 0.026, 0.49, true);
  addInkRows(countRoll, box, ink, { width: 0.50, length: 0.44, y: 0.015, columns: 6 });
  const countStand = box(world, beam, -3.85, 0.219, 2.12, 0.64, 0.44, 0.60, true);

  addCopperLamp(desk, -1.05, 0.507, 0.37, 0.83);
  const light = new THREE.PointLight(0xffc992, 4.9, 3.68, 2);
  light.position.set(0.95, 0.96, 1.22);
  world.add(light);

  const elder = makeCrownFigure(world, art, 'resident', 1.02);
  const envoy = makeCrownFigure(world, art, 'official', 1.12);
  const attendant = makeCrownFigure(world, art, 'keeper', 1.06);
  elder.model.position.set(-1.40, 0.033, -0.73);
  envoy.model.position.set(0.44, 0.035, -0.88);
  attendant.model.position.set(2.31, 0.034, -0.47);
  elder.model.rotation.y = 0.49;
  envoy.model.rotation.y = 0.29;
  attendant.model.rotation.y = -0.43;
  for (const person of [elder, envoy, attendant]) person.rig.set(0, 0);

  let lastBeat;
  let lastEntries = 0;
  let lastGrain = QI_GRAIN_START;
  let fromEntries = 0;
  let fromGrain = QI_GRAIN_START;
  let lastOpen = false;
  let fromOpen = false;
  let started = 0;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    const { storyBeat: beat, qiEntries, qiGrain } = state;
    const open = ['surrender', 'count', 'announce'].includes(beat);
    if (beat !== lastBeat || qiEntries !== lastEntries || qiGrain !== lastGrain) {
      fromEntries = lastEntries;
      fromGrain = lastGrain;
      fromOpen = lastOpen;
      lastEntries = qiEntries;
      lastGrain = qiGrain;
      lastBeat = beat;
      lastOpen = open;
      started = time;
    }
    const age = reduced ? 1450 : time - started;
    const motion = smoothstep(age, 25, 700);
    const gateOpen = open ? fromOpen ? 1 : smoothstep(age, 80, 1060) : 0;
    doors.forEach((leaf, index) => { leaf.rotation.y = (index ? 1 : -1) * gateOpen * 1.10; });
    sacks.forEach(({ sack, origin, end }, index) => {
      const transfer = index >= qiGrain ? index >= fromGrain ? 1 : motion : 0;
      sack.position.copy(origin).lerp(end, transfer);
      sack.position.y += 0.30 * Math.sin(transfer * Math.PI);
      sack.rotation.y = lerp((index % 3 - 1) * 0.18, 0.11 + (index % 2) * 1.24, transfer);
    });
    pages.forEach((page, index) => {
      page.visible = index < qiEntries;
      page.rotation.x = -1.18 * (index < fromEntries ? 0 : 1 - motion);
    });
    shutter.rotation.x = beat === 'announce' ? smoothstep(age, 70, 720) * 1.19 : 0;
    countRoll.visible = countStand.visible = beat === 'count';
    attendant.head.rotation.x = beat === 'register' || beat === 'count' ? 0.28 : 0.13;

    const wide = beat === 'gate' || beat === 'surrender';
    const x = beat === 'announce' ? 0.56 : beat === 'count' ? -0.52 : 0.02;
    const y = (wide ? 1.50 : 1.09) - captionOffset * 0.89;
    camera.zoom = (wide ? 1.14 : 1.24) - captionOffset * 0.065;
    camera.updateProjectionMatrix();
    camera.position.set(x + 1.31, y + (wide ? 6.06 : 8.69), 14.56);
    camera.lookAt(x, y, 0.32 + captionOffset * 0.41);
    camera.updateMatrixWorld();
    marker.hidden = true;
    return !reduced && age < (beat === 'surrender' ? 1090 : 750);
  }

  return { world, frame, controlsCameraZoom: true };
}

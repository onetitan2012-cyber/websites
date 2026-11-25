import * as THREE from './vendor/three.module.min.js';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';
import { addCopperLamp, addInkRows, addTileCourses } from './scene-art.mjs';

const shots = {
  memory: { x: -1.62, y: 1.15, z: 1.78, zoom: 2.28, height: 6.2, side: 2.8 },
  council: { x: 0, y: 2.03, z: -1.10, zoom: 0.99, height: 4.8, side: 1.0 },
  title: { x: -1.52, y: 1.10, z: 1.50, zoom: 1.86, height: 8.3, side: 2.0 },
  legend: { x: -0.68, y: 1.10, z: 1.46, zoom: 1.89, height: 8.3, side: 0.6 },
};
const { lerp, smoothstep } = THREE.MathUtils;

export function createEmperorWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0xa5a69b);
  world.fog = new THREE.Fog(0xa5a69b, 14, 30);
  const art = makeCrownArt();
  const { box, groupAt, material, round, earth, wood, cloth, beamPattern } = art;
  const stone = [0x8c8e82, 0xa4a092, 0xb2a692].map(color => material(color, earth));
  const rammed = material(0xa59273, earth);
  const lacquer = material(0x70463d, wood, 0.63);
  const beam = material(0x48403a, wood);
  const tile = material(0x565852);
  const red = material(0x7c4c40, cloth);
  const bronze = material(0xa48658, null, 0.51, 0.35);
  const reed = material(0xb1a07c, art.matTexture);
  const bamboo = [0xb59b70, 0xbfa87c, 0xc5ad83].map(color => material(color, wood));
  const ink = material(0x4b3931);
  const sun = new THREE.DirectionalLight(0xffe3b7, 2.2);
  sun.position.set(-6, 10, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 7.5, bottom: -7.5, far: 32 });
  sun.shadow.normalBias = 0.028;
  world.add(sun, new THREE.HemisphereLight(0xd7dfdb, 0x67564a, 1.67));
  const candle = new THREE.PointLight(0xffbe77, 4.5, 3.7, 2);
  candle.position.set(-2.86, 1.14, 2.13);
  world.add(candle);

  box(world, rammed, 0, -0.21, -1.9, 19, 0.4, 14);
  for (let row = 0; row < 12; row += 1) {
    for (let column = 0; column < 11; column += 1) {
      box(world, stone[(column * 2 + row) % 3], (column - 5) * 1.24 + row % 2 * 0.16,
        0.012, 4.54 - row * 0.74, 1.21, 0.044, 0.715);
    }
  }

  function roof(parent, width, run, rise, eave, z) {
    for (const side of [-1, 1]) {
      const slope = box(parent, tile, 0, eave + rise / 2, z + side * run / 2,
        width, 0.115, Math.hypot(run, rise), true);
      slope.rotation.x = side * Math.atan2(rise, run);
    }
    box(parent, tile, 0, eave + rise + 0.12, z, width + 0.19, 0.13, 0.18, true);
    addTileCourses(parent, { width, run, rise, eave, z, spacing: 0.24 });
  }

  const hall = groupAt(world, 0, 0.038, -4.27);
  hall.name = 'audience-hall';
  box(hall, rammed, 0, 0.39, 0, 11.4, 0.78, 3.5, true);
  box(hall, stone[2], 0, 0.79, 0, 11.61, 0.11, 3.61, true);
  for (let step = 0; step < 4; step += 1) {
    box(hall, stone[2 - step % 2], 0, 0.073 + step * 0.104, 2.75 - step * 0.264,
      3.37, 0.145 + step * 0.208, 0.34 + step * 0.055, true);
  }
  box(hall, rammed, 0, 2.04, -1.06, 10.2, 2.43, 0.34, true);
  for (const side of [-1, 1]) {
    box(hall, lacquer, side * 3.06, 1.99, -0.86, 3.33, 2.31, 0.10, true);
    for (let rib = 0; rib < 13; rib += 1) {
      box(hall, beam, side * (1.44 + rib * 0.258), 2.02, -0.783, 0.048, 2.18, 0.058);
    }
    box(hall, red, side * 2.49, 2.29, 1.38, 0.56, 1.32, 0.037, true);
    box(hall, bronze, side * 2.49, 2.98, 1.38, 0.72, 0.041, 0.067);
    box(hall, bronze, side * 2.49, 1.651, 1.405, 0.52, 0.035, 0.017);
  }
  for (const x of [-4.87, -3.32, -1.39, 1.39, 3.32, 4.87]) {
    box(hall, stone[1], x, 0.91, 1.19, 0.45, 0.15, 0.44, true);
    box(hall, lacquer, x, 2.06, 1.19, 0.23, 2.29, 0.24, true);
    box(hall, beam, x, 3.25, 1.18, 0.61, 0.16, 0.37, true);
  }
  box(hall, beam, 0, 3.38, 1.22, 11.05, 0.18, 0.34, true);
  beamPattern(hall, 0, 3.385, 1.401, 10.5, 0.13, 12);
  box(hall, beam, 0, 2.05, -0.839, 2.26, 2.48, 0.19, true);
  for (const side of [-1, 1]) {
    box(hall, lacquer, side * 0.52, 2.02, -0.701, 0.97, 2.18, 0.09, true);
    round(hall, bronze, [0.066, 0.073, 0.035], side * 0.20, 1.94, -0.634);
    const wing = groupAt(world, side * 6.15, 0, -6.58);
    box(wing, rammed, 0, 1.22, 0, 4.22, 2.44, 1.9, true);
    roof(wing, 4.52, 1.17, 0.47, 2.41, 0);
  }
  roof(hall, 11.58, 1.92, 0.84, 3.47, -0.19);
  addCopperLamp(hall, -4.06, 0.85, 1.36, 1.38);
  addCopperLamp(hall, 4.06, 0.85, 1.36, 1.38);

  const study = groupAt(world, -1.55, 0.04, 1.72);
  box(study, reed, -0.16, 0.009, 0, 4.62, 0.033, 2.67);
  const desk = groupAt(study, 0, 0.02, 0.04);
  desk.name = 'memory-desk';
  box(desk, lacquer, 0, 0.462, 0, 3.52, 0.113, 1.30, true);
  for (const x of [-1.53, 1.53]) {
    for (const z of [-0.48, 0.48]) box(desk, beam, x, 0.21, z, 0.135, 0.43, 0.13, true);
    box(desk, beam, x, 0.25, 0, 0.101, 0.079, 1.09, true);
  }
  box(desk, beam, 0, 0.395, 0.573, 3.32, 0.068, 0.068, true);
  beamPattern(desk, 0, 0.45, 0.656, 3.42, 0.068, 6);
  const oldTablet = groupAt(desk, 0.73, 0.548, 0.24);
  oldTablet.name = 'kept-tablet';
  oldTablet.rotation.y = -0.27;
  box(oldTablet, bamboo[1], 0, 0, 0, 0.28, 0.047, 0.63, true);
  addInkRows(oldTablet, box, ink, { width: 0.21, length: 0.53, y: 0.024, columns: 2, rows: 5 });
  const stoneBox = groupAt(desk, -0.61, 0.519, 0.21);
  stoneBox.name = 'stone-box';
  box(stoneBox, beam, 0, 0.059, 0, 0.61, 0.117, 0.40, true);
  box(stoneBox, lacquer, 0, 0.137, 0, 0.63, 0.045, 0.42, true);
  box(stoneBox, bronze, -0.01, 0.111, 0.214, 0.131, 0.063, 0.016);
  const oldStone = round(desk, stone[2], [0.117, 0.068, 0.102], -0.60, 0.588, 0.23, true);
  oldStone.name = 'handan-pebble';
  addCopperLamp(desk, -1.35, 0.519, -0.25, 1.18);

  const seal = groupAt(desk, 1.38, 0.519, -0.30);
  seal.name = 'seal';
  box(seal, lacquer, 0, 0.043, 0, 0.55, 0.082, 0.47, true);
  const sealStone = material(0xb0a886, null, 0.53);
  box(seal, sealStone, 0, 0.14, 0, 0.33, 0.11, 0.32, true);
  round(seal, sealStone, [0.112, 0.079, 0.073], 0, 0.236, 0, true);

  const folio = groupAt(desk, -0.02, 0.547, 0.035);
  folio.name = 'legend-folio';
  folio.rotation.y = -0.08;
  const slats = Array.from({ length: 12 }, (_, index) => {
    const hinge = groupAt(folio, (index - 5.5) * 0.167, 0, -0.405);
    const slat = groupAt(hinge, 0, 0, 0.365);
    box(slat, bamboo[index % 3], 0, 0, 0, 0.159, 0.03, 0.73, true);
    addInkRows(slat, box, ink, { width: 0.118, length: 0.54, y: 0.016, columns: 3, rows: 5 });
    for (const z of [-0.27, 0.27]) box(slat, red, 0, 0.019, z, 0.173, 0.013, 0.026);
    return hinge;
  });

  const emperor = makeCrownFigure(world, art, 'king', 1.38);
  emperor.model.position.set(-1.78, 0.066, 0.66);
  emperor.model.rotation.y = 0.19;
  emperor.rig.set(0, 0);
  const delegates = [
    { role: 'lisi', x: 1.28, z: -1.64, angle: -0.48 },
    { role: 'official', x: 2.00, z: -2.12, angle: -0.34 },
    { role: 'wang', x: -2.81, z: -2.11, angle: 0.42 },
  ].map(({ role, x, z, angle }) => {
    const figure = makeCrownFigure(world, art, role, 1.22);
    figure.model.position.set(x, 0.035, z);
    figure.model.rotation.y = angle;
    figure.rig.set(0, 0);
    return figure;
  });

  let lastBeat;
  let started = 0;
  let previous;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    const beat = state.storyBeat;
    const next = shots[beat] ?? shots.memory;
    if (beat !== lastBeat) {
      previous = lastBeat === 'title' && beat === 'legend' ? shots.title : next;
      lastBeat = beat;
      started = time;
    }
    const age = reduced ? 1300 : time - started;
    const slide = smoothstep(age, 0, 650);
    const x = lerp(previous.x, next.x, slide);
    const y = lerp(previous.y, next.y, slide) - captionOffset * 0.46;
    const z = lerp(previous.z, next.z, slide);
    const memory = beat === 'memory';
    const council = beat === 'council';
    oldTablet.visible = memory && state.keepsTablet;
    oldStone.visible = memory && state.finaleStone === 'record';
    stoneBox.visible = memory && state.finaleStone === 'keep';
    delegates.forEach(person => { person.model.visible = council; });
    emperor.head.rotation.x = memory ? 0.23 : 0.05;
    seal.visible = !memory && !council;
    folio.visible = beat === 'legend';
    slats.forEach((slat, index) => {
      const unfolded = smoothstep(age, index * 34, index * 34 + 300);
      slat.visible = unfolded > 0;
      slat.rotation.x = -1.18 * (1 - unfolded);
    });
    camera.zoom = lerp(previous.zoom, next.zoom, slide) * (captionOffset ? 0.80 : 1);
    camera.updateProjectionMatrix();
    camera.position.set(x + lerp(previous.side, next.side, slide), y + next.height, z + 13.27);
    camera.lookAt(x, y, z);
    camera.updateMatrixWorld();
    marker.hidden = true;
    return !reduced && beat === 'legend' && age < 705;
  }

  return { world, frame, controlsCameraZoom: true };
}

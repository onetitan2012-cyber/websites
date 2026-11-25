import * as THREE from './vendor/three.module.min.js';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';
import { addCopperLamp, addInkRows, addTileCourses } from './scene-art.mjs';

const { lerp, smoothstep } = THREE.MathUtils;

export function createReturnWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0x9ba5a1);
  const art = makeCrownArt();
  const { box, groupAt, material, mesh, wood, earth, matTexture, round, thread } = art;
  const earthWall = material(0x9b8b79, earth);
  const paleWall = material(0xb3a389, earth);
  const floor = [0x747a70, 0x858277, 0x8e8778].map(color => material(color, earth));
  const grayTile = material(0x59666b);
  const doorWood = material(0x80584e, wood);
  const beam = material(0x544747, wood);
  const reed = material(0xa29675, matTexture);
  const splitWood = material(0xc2a679, wood);
  const ink = material(0x55423b);
  const blueStone = material(0x65787b);
  const brass = material(0x9d7853, null, 0.56, 0.38);
  const pottery = material(0x806955, earth);
  const sun = new THREE.DirectionalLight(0xeff5ec, 1.52);
  sun.position.set(-3.1, 7.3, 5.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 5.6, bottom: -5.6, near: 0.1, far: 30 });
  sun.shadow.normalBias = 0.028;
  const backLight = new THREE.DirectionalLight(0xe4bf9b, 1.0);
  backLight.position.set(5, 3, -5);
  world.add(sun, backLight, new THREE.HemisphereLight(0xd6dfdf, 0x62534e, 1.64));

  box(world, earthWall, 0, -0.21, 0.04, 17, 0.41, 13);
  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      const x = (column - 3.5) * 1.21 + (row % 2) * 0.27;
      box(world, floor[(column * 3 + row + column % 2) % 3], x, 0.014, -2.05 + row * 0.66, 1.17, 0.028, 0.627);
    }
  }

  for (let row = 0; row < 5; row += 1) {
    box(world, row % 2 ? earthWall : paleWall, 1.0, 0.23 + row * 0.43, -4.92 - 0.035 * row,
      15.3, 0.425, 1.23 - row * 0.14, true);
  }
  box(world, grayTile, 1.0, 2.19, -5.06, 15.45, 0.14, 0.75);
  const house = groupAt(world, -0.87, 0, -2.06);
  box(house, floor[1], 0, 0.105, 0.05, 5.86, 0.21, 0.77, true);
  box(house, paleWall, -1.87, 1.30, -0.13, 1.96, 2.60, 0.28, true);
  box(house, paleWall, 1.83, 1.30, -0.13, 1.96, 2.60, 0.28, true);
  box(house, earthWall, 0, 2.30, -0.13, 1.83, 0.64, 0.29, true);
  for (const x of [-2.72, -0.86, 0.86, 2.72]) {
    box(house, beam, x, 1.26, 0.055, 0.15, 2.50, 0.19, true);
  }
  box(house, doorWood, 0, 2.45, 0.065, 5.75, 0.19, 0.30, true);
  addTileCourses(house, { width: 6.1, run: 1.63, rise: 0.43, eave: 2.59, z: -1.02, back: false });
  box(house, grayTile, 0, 2.67, -0.33, 5.97, 0.10, 1.32, true).rotation.x = 0.24;
  const window = groupAt(house, -1.79, 1.40, 0.026);
  box(window, beam, 0, 0, 0, 0.91, 0.69, 0.098, true);
  box(window, doorWood, 0, -0.365, 0.13, 1.02, 0.078, 0.26, true);
  for (const x of [-0.32, -0.13, 0.08, 0.30]) {
    box(window, splitWood, x, -0.016, 0.072, 0.043, x === 0.30 ? 0.39 : 0.62, 0.05).rotation.z = x === 0.30 ? -0.19 : 0;
  }
  for (const [x, height, rotation] of [[-3.62, 0.52, 0.14], [3.51, 0.35, -0.22]]) {
    const jar = art.profile(world, pottery, [[0.02, 0], [0.16, 0.03], [0.27, 0.25], [0.25, 0.43],
      [0.16, 0.52], [0.15, 0.49], [0.18, 0.41]], x, 0.03, -1.22, true);
    jar.scale.y = height / 0.52;
    jar.rotation.z = rotation;
  }
  const brokenBoard = box(world, beam, 3.41, 0.106, 0.05, 0.92, 0.065, 0.21, true);
  brokenBoard.rotation.set(0.12, 0.28, -0.13);

  const doors = [-1, 1].map(side => {
    const pivot = groupAt(house, side * 0.77, 0.195, 0.0);
    box(pivot, doorWood, -side * 0.36, 0.88, 0, 0.70, 1.76, 0.09, true);
    for (const y of [0.34, 1.34]) box(pivot, beam, -side * 0.36, y, 0.064, 0.69, 0.082, 0.067, true);
    for (const x of [0.16, 0.33, 0.51]) box(pivot, beam, -side * x, 0.88, 0.055, 0.018, 1.69, 0.015);
    return pivot;
  });

  const desk = groupAt(world, 2.18, 0.026, 0.12);
  box(desk, doorWood, 0, 0.48, 0, 1.54, 0.094, 0.81, true);
  for (const x of [-0.59, 0.59]) for (const z of [-0.28, 0.28]) {
    box(desk, beam, x, 0.219, z, 0.11, 0.438, 0.107, true);
  }
  const stone = round(desk, blueStone, [0.086, 0.054, 0.077], -0.52, 0.565, 0.205, true);
  const newRegister = groupAt(desk, 0.14, 0.54, -0.28);
  const newSlips = groupAt(newRegister, 0, 0, 0.19);
  for (let index = 0; index < 9; index += 1) {
    box(newSlips, splitWood, (index - 4) * 0.075, 0, 0, 0.067, 0.028, 0.37);
  }
  addInkRows(newSlips, box, ink, { width: 0.54, length: 0.29, y: 0.016, columns: 9 });
  box(newSlips, beam, 0, 0.016, 0.137, 0.68, 0.014, 0.026);

  const stations = [[-2.58, 0.71], [-0.49, 1.04], [1.89, 1.52]].map(([x, z]) => groupAt(world, x, 0.029, z));
  box(stations[0], beam, 0, 0.19, 0, 0.93, 0.36, 0.78, true);
  box(stations[0], doorWood, 0, 0.386, 0, 1.02, 0.065, 0.84, true);
  const lamp = groupAt(stations[0], 0, 0.423, 0.0);
  addCopperLamp(lamp, 0, 0, 0, 1);
  const glow = new THREE.PointLight(0xffb977, 0, 3.65, 2);
  glow.position.set(-2.58, 0.95, 0.72);
  world.add(glow);

  const latch = groupAt(stations[1], 0, 0.115, 0);
  box(latch, doorWood, 0, 0, 0, 1.0, 0.079, 0.31, true);
  box(latch, splitWood, 0.09, 0.055, 0, 0.58, 0.063, 0.142, true);
  for (const x of [-0.19, 0.33]) box(latch, brass, x, 0.033, 0, 0.091, 0.12, 0.21);
  latch.rotation.y = -0.21;

  const register = groupAt(stations[2], 0, 0.062, 0);
  box(stations[2], reed, 0, 0.014, 0, 1.28, 0.026, 0.66);
  for (let index = 0; index < 10; index += 1) {
    box(register, splitWood, (index - 4.5) * 0.103, 0, Math.sin(index * 2) * 0.025, 0.086, 0.029, 0.54);
  }
  addInkRows(register, box, ink, { width: 0.94, length: 0.48, y: 0.017, columns: 10 });
  thread(register, beam, [[-0.51, 0.018, 0.19], [0, 0.018, 0.19], [0.54, 0.018, 0.17]], 0.010);

  const chipGeometry = new THREE.CylinderGeometry(0.185, 0.215, 0.039, 4);
  const fragments = stations.map((station, index) => Array.from({ length: 7 }, (_, piece) => {
    const angle = piece * 2.18;
    const x = Math.cos(angle) * 0.34;
    const z = Math.sin(angle) * 0.2;
    const y = (index === 0 ? 0.478 : 0.072) + (piece % 3) * 0.047;
    const shard = mesh(station, chipGeometry, piece % 4 === 0 ? doorWood : grayTile, x, y, z, true);
    shard.rotation.set(0.12 * (piece % 3), angle, -0.21 * (piece % 2));
    return { shard, x, y, z, angle };
  }));

  const ruler = makeCrownFigure(world, art, 'king', 1.15);
  const clerk = makeCrownFigure(world, art, 'official', 1.08);
  const neighbor = makeCrownFigure(world, art, 'resident', 1.05);
  ruler.model.position.set(-0.16, 0.028, -0.72);
  ruler.model.rotation.y = -0.31;
  clerk.model.position.set(2.59, 0.028, -0.44);
  clerk.model.rotation.y = -0.48;
  neighbor.model.position.set(-2.46, 0.028, -1.24);
  neighbor.model.rotation.y = 0.62;

  let lastBeat;
  let lastFound = [false, false, false];
  let fromFound = lastFound;
  let started = 0;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    const { storyBeat: beat, found } = state;
    if (beat !== lastBeat || found.some((part, index) => part !== lastFound[index])) {
      fromFound = lastFound;
      lastFound = found;
      lastBeat = beat;
      started = time;
    }
    const age = reduced ? 1200 : time - started;
    const cleared = found.map((part, index) => part ? fromFound[index] ? 1 : smoothstep(age, 12, 700) : 0);
    fragments.forEach((pieces, index) => {
      pieces.forEach(({ shard, x, y, z, angle }) => {
        const progress = cleared[index];
        const side = x < 0 ? -1 : 1;
        shard.position.set(x + side * progress * 0.52,
          lerp(y, index === 0 ? 0.092 : 0.042, progress) + 0.055 * Math.sin(Math.PI * progress),
          z + Math.sin(angle) * progress * 0.33);
        shard.rotation.y = angle + progress * 0.74;
      });
    });
    lamp.visible = found[0];
    glow.intensity = 6.7 * cleared[0];
    latch.visible = found[1];
    register.visible = found[2];
    stone.visible = !['return', 'threshold'].includes(beat);
    const open = beat === 'open' ? smoothstep(age, 75, 850) : 0;
    doors[0].rotation.y = 0.12 - open * 0.94;
    doors[1].rotation.y = -0.28 + open * 1.08;
    const writing = beat === 'record' ? smoothstep(age, 60, 630) : 0;
    newRegister.visible = beat === 'record';
    newRegister.rotation.x = -1.17 * (1 - writing);
    ruler.rig.set(0, 0);
    clerk.rig.set(0, 0);
    neighbor.rig.set(0, 0);
    ruler.head.rotation.set(beat === 'stone' ? 0.29 : 0.10, beat === 'stone' ? 0.39 : -0.10, 0);
    clerk.head.rotation.x = 0.11 + writing * 0.26;
    clerk.arms[0].rotation.set(-0.18 - writing * 0.53, 0, -0.14);

    const broad = beat === 'return' || beat === 'threshold';
    const targetX = beat === 'stone' || beat === 'record' ? 0.59 : -0.12;
    const targetY = (broad ? 1.48 : 1.08) - captionOffset * 0.93;
    camera.zoom = (broad ? 1.15 : 1.34) - captionOffset * 0.08;
    camera.updateProjectionMatrix();
    camera.position.set(targetX + 1.46, targetY + (broad ? 5.6 : 8.05), 14.15);
    camera.lookAt(targetX, targetY, 0.31 + captionOffset * 0.29);
    camera.updateMatrixWorld();
    marker.hidden = true;
    return !reduced && age < 900;
  }
  return { world, frame, controlsCameraZoom: true };
}

import * as THREE from './vendor/three.module.min.js';
import { makeGrainCart } from './grain-cart.mjs';
import { makeFigures } from './figure.mjs';
import { grain } from './material-grain.mjs';
import { addCopperLamp, addInkRows, addTileCourses } from './scene-art.mjs';

const ease = THREE.MathUtils.smoothstep;
const mix = THREE.MathUtils.lerp;

export function createKingWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0x232727);
  let seed = 517;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const material = (color, map) => new THREE.MeshStandardMaterial({ color, map, roughness: 0.87 });
  const wood = grain('wood', random);
  const stone = grain('stone', random);
  const cloth = grain('cloth', random);
  const clay = material(0x92816c, stone);
  const paving = material(0x756d5d, stone);
  const trim = material(0x4a382c, wood);
  const lacquer = material(0x753f31, wood);
  const plank = material(0x8a684c, wood);
  const reed = material(0xb29972, grain('reed', random));
  const slate = material(0x525d5c, stone);
  const red = material(0x885146, wood);
  const bamboo = material(0xc5a46e, wood);
  const bronze = material(0xa68655);
  const ink = material(0x453b2b);
  const seal = material(0xa34e37);
  const outline = material(0x637d70);
  const cube = new THREE.BoxGeometry();
  const ball = new THREE.SphereGeometry(1, 14, 10);

  function groupAt(parent, x = 0, y = 0, z = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    parent.add(group);
    return group;
  }

  function mesh(parent, geometry, mat, x, y, z, cast = false) {
    const item = new THREE.Mesh(geometry, mat);
    item.position.set(x, y, z);
    item.castShadow = cast;
    item.receiveShadow = true;
    parent.add(item);
    return item;
  }

  function box(parent, mat, x, y, z, width, height, depth, cast = false) {
    const item = mesh(parent, cube, mat, x, y, z, cast);
    item.scale.set(width, height, depth);
    return item;
  }

  function round(parent, mat, size, x, y, z, cast = false) {
    const item = mesh(parent, ball, mat, x, y, z, cast);
    item.scale.set(...size);
    return item;
  }

  const skylight = new THREE.DirectionalLight(0xe7dcbd, 2.65);
  skylight.position.set(-4, 6, 3.5);
  skylight.castShadow = true;
  skylight.shadow.mapSize.set(1024, 1024);
  Object.assign(skylight.shadow.camera, { left: -7, right: 7, top: 5, bottom: -5, near: 0.1, far: 25 });
  skylight.shadow.bias = -0.00035;
  skylight.shadow.normalBias = 0.02;
  const rim = new THREE.DirectionalLight(0xaad1d7, 0.62);
  rim.position.set(5.2, 3.2, -1.0);
  world.add(skylight, rim, new THREE.HemisphereLight(0xbac6c0, 0x675046, 1.78));
  const warm = new THREE.PointLight(0xffbe76, 12, 7, 2);
  warm.position.set(3.85, 1.18, 0.55);
  world.add(warm);

  box(world, paving, 0, -0.15, 0.8, 17, 0.28, 10);
  const pavingColors = [0x878071, 0x938775, 0x8b806d].map(color => material(color, stone));
  for (let row = 0; row < 5; row += 1) {
    for (let i = 0; i < 9; i += 1) box(world, pavingColors[(row + i * 2) % 3],
      (i - 4) * 1.19 + (row % 2) * 0.42, -0.018, -0.78 + row * 0.85, 1.174, 0.035, 0.826);
  }
  box(world, clay, 0.78, 1.95, -2.18, 7.6, 3.9, 0.35);
  box(world, clay, -5.05, 1.95, -2.18, 1.36, 3.9, 0.35);
  const exterior = new THREE.MeshBasicMaterial({ color: 0x697e78 });
  box(world, exterior, -4.0, 1.72, -4.9, 6.8, 3.75, 0.15);
  box(world, material(0x657169, stone), -4.15, 0.74, -3.75, 4.3, 1.49, 0.25);
  for (const x of [-4.47, -2.94, 0, 2.94, 4.47]) {
    box(world, lacquer, x, 1.72, -1.94, 0.24, 3.44, 0.28, true);
    box(world, trim, x, 0.13, -1.93, 0.38, 0.26, 0.40);
  }
  for (const y of [2.77, 3.40]) box(world, trim, 0, y, -1.89, 9.3, 0.16, 0.30, true);
  for (const x of [-4.47, -2.94, 0, 2.94, 4.47]) {
    box(world, lacquer, x, 3.07, -1.86, 0.49, 0.13, 0.39, true);
    box(world, trim, x, 3.25, -1.84, 0.73, 0.15, 0.45, true);
    box(world, red, x + 0.055, 1.70, -1.779, 0.033, 3.15, 0.022);
  }
  box(world, lacquer, 0, 3.52, -1.79, 9.52, 0.132, 0.366);
  const porch = groupAt(world, 0, 0, -1.72);
  box(porch, trim, 0, 3.54, 0.58, 10.03, 0.16, 0.18, true);
  const roof = box(porch, slate, 0, 3.79, 0.03, 10.04, 0.13, 1.20, true);
  roof.rotation.x = 0.27;
  addTileCourses(porch, { width: 10.0, run: 1.19, rise: 0.32, eave: 3.62, z: -0.53, back: false });
  for (const middle of [-1.45, 1.45, 3.68]) {
    box(world, reed, middle, 1.86, -1.88, 1.40, 1.70, 0.075);
    for (let i = -3; i <= 3; i += 1) box(world, trim, middle + 0.22 * i, 1.86, -1.803, 0.030, 1.72, 0.055);
    for (const y of [1.02, 1.58, 2.14, 2.70]) box(world, lacquer, middle, y, -1.78, 1.48, 0.043, 0.07);
  }
  box(world, paving, 1.37, 0.09, -0.53, 4.0, 0.22, 2.12, true);
  box(world, trim, 1.37, 0.184, 0.56, 4.13, 0.13, 0.11);
  box(world, clay, 1.37, 0.050, 0.72, 3.44, 0.105, 0.34, true);
  box(world, lacquer, 1.37, 0.145, 0.614, 4.06, 0.032, 0.064);
  box(world, reed, 1.68, 0.225, -0.65, 1.58, 0.07, 1.02);
  box(world, reed, -0.14, 0.045, 1.52, 6.45, 0.08, 2.68);
  for (const x of [-3.39, 3.11]) box(world, lacquer, x, 0.093, 1.52, 0.060, 0.025, 2.70);
  for (const z of [0.17, 2.87]) box(world, lacquer, -0.14, 0.093, z, 6.5, 0.025, 0.066);

  const desk = groupAt(world, 0, 0.08, 1.75);
  box(desk, plank, 0, 0.40, 0, 4.62, 0.13, 1.31, true);
  box(desk, lacquer, 0, 0.30, 0.61, 4.60, 0.13, 0.065, true);
  for (const x of [-2.05, 2.05]) for (const z of [-0.44, 0.44]) {
    box(desk, trim, x, 0.17, z, 0.16, 0.36, 0.16, true);
  }
  const files = [-1.46, 0, 1.46].map((x, index) => {
    const file = groupAt(desk, x, 0.468, 0);
    box(file, trim, 0, 0.035, 0, 1.12, 0.080, 0.82, true);
    const lid = groupAt(file, 0, 0.13, -0.41);
    box(lid, [plank, reed, lacquer][index], 0, 0, 0.41, 1.11, 0.071, 0.81, true);
    box(lid, bronze, 0, 0.041, 0.61, 0.125, 0.015, 0.075);
    for (const edge of [-0.49, 0.49]) box(lid, trim, edge, 0.039, 0.407, 0.036, 0.020, 0.75);
    for (const edge of [0.050, 0.773]) box(lid, trim, 0, 0.039, edge, 0.99, 0.018, 0.030);
    for (let i = 0; i < 8; i += 1) {
      const xSlip = -0.416 + i * 0.119;
      box(file, bamboo, xSlip, 0.092, 0, 0.102, 0.038, 0.61);
      for (const [row, depth] of [-0.16, -0.048, 0.071, 0.186].entries()) {
        box(file, ink, xSlip + (row % 2 ? 0.011 : -0.006), 0.112, depth,
          0.017, 0.004, 0.049 + (i + row) % 3 * 0.012).rotation.y = (row - 1) * 0.20;
      }
    }
    for (const z of [-0.225, 0.233]) box(file, lacquer, 0, 0.111, z, 0.94, 0.013, 0.021);
    return { lid, file, x };
  });
  const marks = [-0.23, 0, 0.23].map(x => box(files[2].file, seal, x, 0.11, 0.49, 0.14, 0.026, 0.104));
  const ledger = groupAt(world, 2.31, 0.286, -0.05);
  box(ledger, bamboo, 0, 0, 0, 0.40, 0.049, 0.22, true);
  addInkRows(ledger, box, ink, { width: 0.29, length: 0.16, y: 0.025 });
  const dispatch = groupAt(world);
  box(dispatch, bamboo, 0, 0, 0, 0.35, 0.055, 0.22, true);
  addInkRows(dispatch, box, ink, { width: 0.25, length: 0.16, y: 0.028, columns: 4 });
  box(world, trim, 3.72, 0.27, 0.57, 0.44, 0.53, 0.42, true);
  box(world, lacquer, 3.72, 0.558, 0.57, 0.56, 0.094, 0.51, true);
  addCopperLamp(world, 3.72, 0.606, 0.57, 0.85);

  const figure = makeFigures({ world, material, cloth, mesh, box, round, groupAt, articulated: true });
  const king = figure(0.98, 0x3f514a, 0x837252, 'boy');
  const minister = figure(1.19, 0x66504b, 0x4c3c32, 'father');
  const clerk = figure(1.04, 0x465b65, 0x3c4144, 'father');
  const driver = figure(1.08, 0xb48655, 0x58452f, 'ran');
  const hay = groupAt(driver.arms[0], 0, -0.36, 0.015);
  for (let i = -2; i <= 2; i++) {
    box(hay, reed, i * 0.022, -0.035, 0.05, 0.021, 0.23, 0.025).rotation.z = i * 0.18;
  }
  const cart = makeGrainCart(world, {groupAt, box, mesh, round, material, wood, cloth});
  const tally = box(desk, bamboo, 0, 0.63, 0.39, 0.09, 0.025, 0.45);
  tally.rotation.y = -0.23;
  const palm = new THREE.Vector3();
  const markerPosition = new THREE.Vector3();

  function pose(actor, x, y, z, yaw, kneel = 0, gait = 0) {
    actor.model.position.set(x, y, z);
    actor.model.rotation.y = yaw;
    actor.rig.set(kneel, gait);
    actor.arms[0].rotation.set(-0.07 - kneel * 0.65 + gait * 0.18, 0, -0.20);
    actor.arms[1].rotation.set(-0.07 - kneel * 0.65 - gait * 0.18, 0, 0.20);
  }

  let lastShot = '';
  let started = 0;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    const { stage, cue, storyBeat: beat, gateHits, keepsTablet } = state;
    const key = [stage, cue, beat, gateHits].join('/');
    if (key !== lastShot) {
      lastShot = key;
      started = time;
    }
    const age = reduced ? 2200 : time - started;
    const audience = beat === 'audience';
    const sending = beat === 'send';
    const holding = beat === 'hold';
    const travel = sending ? ease(age, 250, 1450) : 0;
    const pack = holding ? ease(age, 130, 960) : 0;
    ledger.visible = keepsTablet;
    dispatch.visible = sending;
    pose(king, 1.54, 0.25, -0.58, -0.66, 1);
    pose(minister, -1.61, 0.02, -0.23, 0.74);
    const gait = Math.sin(travel * 7 * Math.PI) * Math.sin(travel * Math.PI);
    pose(clerk, mix(0.10, -3.45, travel), 0.08, mix(0.50, -0.05, travel),
      sending ? mix(0.06, -1.71, ease(age, 100, 400)) : 0.06, 0, gait);
    king.head.rotation.set(0.22, sending ? -0.28 : 0.10, 0);
    minister.head.rotation.set(0.05, 0.28, 0);
    clerk.head.rotation.set(sending ? 0.06 : 0.25, 0, 0);
    if (sending) {
      clerk.arms[0].rotation.x = -1.11;
      clerk.arms[0].rotation.z = -0.06;
      clerk.arms[0].localToWorld(palm.set(0, -0.36, 0.022));
      dispatch.position.copy(palm);
      dispatch.position.y += 0.04;
      dispatch.rotation.set(0.20, clerk.model.rotation.y, 0);
    }

    for (const [index, item] of files.entries()) {
      const opening = index < stage && cue && index === stage - 1;
      const open = opening ? ease(age, 0, 620) : Number(index < stage);
      item.lid.rotation.x = -1.34 * open * (1 - pack);
      item.file.position.x = item.x * (1 - pack * 0.14);
    }
    for (const [index, mark] of marks.entries()) {
      mark.visible = stage >= 2;
      mark.material = index < gateHits || stage === 3 ? outline : seal;
    }

    const doorway = beat.startsWith('door-');
    cart.yard.visible = doorway;
    driver.model.visible = doorway;
    tally.visible = beat === 'account-mark';
    if (tally.visible) tally.position.x = files[Math.min(stage, 2)].x;
    if (beat === 'account-open' || tally.visible) {
      minister.model.rotation.y = 0.46;
      minister.arms[1].rotation.x = -0.98;
      king.head.rotation.y = -0.54;
    }
    if (doorway) {
      const { depart, walk, unyoke, feed } = cart.show(beat, age);
      const driverX = -4.96 + 1.45 * unyoke - 2.68 * feed - 1.38 * walk - 3.50 * depart;
      const step = Math.sin((depart + unyoke + feed) * Math.PI * 6 + walk * Math.PI * 4.5);
      const yaw = feed ? mix(-1.25, 2.22, ease(feed, 0.48, 1)) : walk || depart ? -1.25 : 0.79;
      hay.visible = feed > 0.72;
      pose(driver, driverX, 0.025, 1.42 + walk * 0.65 - feed * 0.28, yaw,
        0.64 * feed, step);
      driver.arms[1].rotation.x = -0.64 - Math.sin(unyoke * Math.PI) * 0.58;
      if (feed) driver.arms[0].rotation.x = -1.12 * feed;
      driver.head.rotation.x = 0.22 * feed;
      pose(king, -2.39, 0.035, 0.24, -1.10);
      pose(clerk,-2.08,0.03,-0.80,-0.90);
      clerk.arms[1].rotation.x = feed ? -0.98 : -0.35;
      const focusX = -4.37 - 0.36 * walk - 0.67 * depart;
      camera.zoom = 1.92;
      camera.updateProjectionMatrix();
      camera.position.set(focusX + 1.48, 4.10, 12.55);
      camera.lookAt(focusX, 0.87, 0.46);
      camera.updateMatrixWorld();
      marker.hidden = true;
      return !reduced && age < 1460;
    }

    const fileX = files[Math.min(stage, files.length - 1)].x;
    const targetX = sending ? mix(0.12, -1.34, travel) : cue ? files[stage - 1].x * 0.36 : audience ? 0.10 : fileX * 0.10;
    const targetY = (audience ? 1.35 : 1.07) - captionOffset * 0.46;
    camera.zoom = (audience ? 1.25 : sending ? 1.42 : 1.58) - captionOffset * 0.17;
    camera.updateProjectionMatrix();
    camera.position.set(targetX + (audience ? 2.9 : 1.34), targetY + (audience ? 5.35 : 8.40), 14.5);
    camera.lookAt(targetX, targetY, 0.86);
    camera.updateMatrixWorld();
    marker.hidden = !cue;
    if (cue) {
      markerPosition.set(files[stage - 1].x, 0.71, 1.66).project(camera);
      marker.style.left = (markerPosition.x + 1) * 50 + '%';
      marker.style.top = (1 - markerPosition.y) * 50 + '%';
    }
    return !reduced && age < (sending ? 1500 : holding ? 1000 : cue ? 660 : 0);
  }

  return { world, frame, controlsCameraZoom: true };
}

import * as THREE from './vendor/three.module.min.js';
import { CROWN_HITS } from './board.mjs';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';

const ease = THREE.MathUtils.smoothstep;
const mix = THREE.MathUtils.lerp;

export function createCrownWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0x455d63);
  world.fog = new THREE.Fog(0x586b6b, 16.2, 34);
  const art = makeCrownArt();
  const { material, earth, wood, cloth, matTexture, random, groupAt, mesh, box, profile, round, beamPattern } = art;
  const clay = material(0xad9376, earth);
  const earthEdge = material(0x8d7158, earth);
  const paths = [material(0x776f64, earth), material(0x847b6d, earth), material(0x928575, earth)];
  const dark = material(0x3a3130, wood);
  const lacquer = material(0x703d35, wood, 0.59);
  const red = material(0x9a5547, wood, 0.60);
  const cross = material(0x654a3a, wood);
  const mat = material(0xc1a578, matTexture);
  const reed = material(0x887357, matTexture);
  const fabric = material(0x6b5550, cloth);
  const bronze = material(0x8c7152, null, 0.37, 0.36);
  const polished = material(0xad8a5c, null, 0.34, 0.42);
  const ink = material(0x493b32);
  const copperRed = material(0xa65339, null, 0.56);
  const sealDark = material(0x604439, null, 0.83);
  const roof = material(0x3a4245, null, 0.80);

  const keyLight = new THREE.DirectionalLight(0xffdfb6, 2.48);
  keyLight.position.set(-4.5, 7.8, 5.0);
  keyLight.castShadow = true;
  Object.assign(keyLight.shadow.camera, { left: -6.6, right: 6.6, top: 6.4, bottom: -5.2, near: 0.1, far: 26 });
  keyLight.shadow.bias = -0.00035;
  keyLight.shadow.normalBias = 0.027;
  keyLight.shadow.mapSize.set(1024, 1024);
  const rim = new THREE.DirectionalLight(0xa5dae5, 0.86);
  rim.position.set(5, 4.5, -1);
  world.add(keyLight, rim, new THREE.HemisphereLight(0xb7c8ca, 0x574234, 1.75));

  box(world, paths[0], 0, -0.27, 1.3, 15.9, 0.22, 12);
  box(world, earthEdge, 0, -0.105, 0.73, 9.7, 0.24, 5.70);
  box(world, clay, 0, 0.018, 0.73, 9.77, 0.047, 5.72, true);
  for (let row = 0; row < 5; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      const x = (column - 3.5) * 1.23 + (row % 2 ? -0.31 : 0);
      box(world, paths[Math.floor(random() * paths.length)], x, 0.044, -0.03 + row * 0.76, 1.21, 0.025, 0.745);
    }
  }
  for (const [y, z, width] of [[-0.085, 3.62, 4.12], [-0.028, 3.53, 3.92], [0.010, 3.43, 3.71]]) {
    box(world, clay, 0, y, z, width, 0.10, 0.30, true);
  }

  box(world, clay, 0, 1.96, -2.50, 9.85, 3.84, 0.34, true);
  box(world, earthEdge, 0, 0.25, -2.31, 9.91, 0.41, 0.18);
  const warmerBay = material(0x6f4b3a, earth);
  const coolBay = material(0x4b5655, earth);
  for (const [x, wall] of [[-2.6, coolBay], [2.6, warmerBay]]) {
    box(world, wall, x, 1.50, -2.288, 2.46, 2.87, 0.1);
    box(world, red, x, 2.93, -1.47, 2.71, 0.12, 0.22, true);
    box(world, dark, x, 2.99, -1.44, 2.81, 0.050, 0.32);
  }
  for (const x of [-4.48, -1.18, 1.18, 4.48]) {
    box(world, earthEdge, x, 0.114, -1.47, 0.51, 0.19, 0.49, true);
    box(world, clay, x, 0.215, -1.47, 0.42, 0.081, 0.42);
    box(world, lacquer, x, 1.79, -1.47, 0.265, 3.15, 0.30, true);
    box(world, red, x + 0.079, 1.83, -1.314, 0.048, 2.96, 0.019);
    for (const [y, span] of [[3.08, 0.43], [3.23, 0.72], [3.34, 0.94]]) {
      box(world, dark, x, y, -1.39, span, 0.15, 0.49, true);
    }
  }
  box(world, dark, 0, 3.43, -1.37, 9.82, 0.20, 0.49, true);
  box(world, lacquer, 0, 3.255, -1.413, 9.10, 0.145, 0.281, true);
  beamPattern(world, 0, 3.267, -1.268, 9.03, 0.097, 10);

  const porch = groupAt(world, 0, 3.78, -1.00);
  porch.rotation.x = 0.30;
  box(porch, dark, 0, -0.064, 0, 10.56, 0.206, 2.71, true);
  box(porch, roof, 0, 0.056, 0, 10.57, 0.111, 2.70, true);
  box(porch, lacquer, 0, -0.153, 1.35, 10.48, 0.105, 0.087);
  const tileMaterial = material(0xffffff, null, 0.85);
  const tileColumns = 70;
  const tileCourses = 4;
  const tiles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.071, 0.075, 0.70, 12),
    tileMaterial, tileColumns * tileCourses);
  const ends = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.076, 0.076, 0.041, 13),
    tileMaterial, tileColumns);
  const pin = new THREE.Object3D();
  pin.rotation.x = Math.PI / 2;
  const tileColor = new THREE.Color();
  for (let index = 0; index < tileColumns; index += 1) {
    const x = (index - (tileColumns - 1) / 2) * 0.150;
    const tint = random() * 0.042;
    for (let course = 0; course < tileCourses; course += 1) {
      const tile = index * tileCourses + course;
      pin.position.set(x, 0.091 + course * 0.004, -1.008 + course * 0.672);
      pin.updateMatrix();
      tiles.setMatrixAt(tile, pin.matrix);
      const firing = tint + random() * 0.025;
      tiles.setColorAt(tile, tileColor.setRGB(0.046 + firing, 0.058 + firing, 0.058 + firing));
    }
    pin.position.set(x, 0.093, 1.376);
    pin.updateMatrix();
    ends.setMatrixAt(index, pin.matrix);
    ends.setColorAt(index, tileColor.setRGB(0.082 + tint, 0.090 + tint, 0.084 + tint));
  }
  tiles.receiveShadow = true;
  porch.add(tiles, ends);

  const center = groupAt(world, 0, 0, -1.35);
  box(center, dark, 0, 1.53, -0.43, 1.95, 2.92, 0.21, true);
  for (const x of [-0.79, -0.51, -0.23, 0.23, 0.51, 0.79]) {
    box(center, lacquer, x, 1.50, -0.31, 0.22, 2.70, 0.078);
    box(center, cross, x + 0.095, 1.50, -0.263, 0.031, 2.66, 0.026);
  }
  for (const y of [0.32, 2.62]) box(center, cross, 0, y, -0.24, 1.88, 0.13, 0.100, true);
  box(center, polished, -0.11, 1.27, -0.268, 0.072, 0.117, 0.043);
  box(center, polished, 0.11, 1.27, -0.268, 0.072, 0.117, 0.043);
  box(world, earthEdge, 0, 0.135, -0.77, 2.71, 0.24, 1.72, true);
  box(world, clay, 0, 0.257, -0.77, 2.75, 0.09, 1.75, true);
  box(world, clay, 0, 0.102, 0.22, 2.28, 0.16, 0.41, true);
  box(world, mat, 0, 0.311, -0.64, 1.88, 0.032, 1.09);
  for (const x of [-0.925, 0.925]) box(world, fabric, x, 0.326, -0.64, 0.069, 0.016, 1.10);

  const posts = [-2.61, 2.61].map((x, index) => {
    const station = groupAt(world, x);
    const jamb = groupAt(station, 0, 0, -1.405);
    for (const side of [-1, 1]) box(jamb, dark, side * 1.18, 1.52, 0, 0.155, 2.82, 0.182, true);
    box(jamb, cross, 0, 0.13, 0.02, 2.52, 0.16, 0.41);
    const screen = groupAt(jamb);
    box(screen, reed, 0, 1.49, -0.015, 2.18, 2.50, 0.101);
    for (let slot = -6; slot <= 6; slot += 1) {
      box(screen, dark, slot * 0.172, 1.48, 0.052, slot % 3 === 0 ? 0.057 : 0.028, 2.53, 0.056);
    }
    for (const y of [0.24, 0.73, 1.64, 2.46, 2.75]) box(screen, lacquer, 0, y, 0.086, 2.29, 0.075, 0.081, true);
    beamPattern(screen, 0, 2.52, 0.072, 2.16, 0.072, 4);
    const stand = groupAt(station, 0, 0.074, 1.44);
    box(stand, mat, 0.05, 0.003, 0.10, 2.15, 0.026, 1.20);
    for (const side of [-1, 1]) {
      box(stand, dark, side * 0.78, 0.205, -0.27, 0.13, 0.417, 0.076, true);
      box(stand, dark, side * 0.78, 0.205, 0.29, 0.13, 0.417, 0.076, true);
    }
    box(stand, cross, 0, 0.25, 0.27, 1.62, 0.13, 0.11, true);
    box(stand, dark, 0, 0.41, 0, 1.86, 0.115, 0.72, true);
    box(stand, lacquer, 0, 0.479, 0, 1.95, 0.057, 0.78, true);
    beamPattern(stand, 0, 0.441, 0.397, 1.72, 0.066, 3);
    const tablet = groupAt(stand, -0.25, 0.506, 0.04);
    box(tablet, material(index ? 0xbb9a70 : 0xc7aa7b, wood), 0, 0.032, 0, 0.72, 0.046, 0.47, true);
    box(tablet, cross, -0.329, 0.055, 0, 0.017, 0.009, 0.458);
    for (let column = 0; column < 6; column += 1) {
      for (let row = 0; row < 4; row += 1) {
        const stroke = box(tablet, ink, -0.257 + column * 0.078, 0.057, -0.16 + row * 0.073,
          0.011 + random() * 0.012, 0.002, 0.018 + random() * 0.024);
        stroke.rotation.y = (random() - 0.5) * 1.3;
      }
    }
    const checks = [-0.16, 0.16].map(offset => box(tablet, sealDark, offset, 0.064, 0.139, 0.104, 0.017, 0.086));
    const foot = 0.62;
    const lamp = groupAt(stand, foot, 0.503, -0.01);
    profile(lamp, bronze, [[0.128, 0], [0.158, 0.014], [0.155, 0.047],
      [0.094, 0.072], [0.063, 0.16], [0.055, 0.22], [0.086, 0.29], [0.128, 0.312]], 0, 0, 0, true);
    profile(lamp, polished, [[0.126, 0.295], [0.165, 0.339], [0.167, 0.357],
      [0.134, 0.361], [0.106, 0.339], [0.010, 0.331]], 0, 0, 0, true);
    round(lamp, ink, [0.019, 0.036, 0.019], 0, 0.36, 0.018);
    const light = new THREE.PointLight(0xffbd7c, 0, 4.2, 2);
    light.position.set(x + foot, 1.17, 1.51);
    world.add(light);
    const flame = groupAt(lamp, 0, 0.37, 0.018);
    round(flame, new THREE.MeshBasicMaterial({ color: 0xf4aa56 }), [0.052, 0.128, 0.048], 0, 0.103, 0);
    round(flame, new THREE.MeshBasicMaterial({ color: 0xffeac1 }), [0.029, 0.085, 0.028], 0, 0.081, 0.022);
    return { screen, tablet, checks, light, flame };
  });

  const king = makeCrownFigure(world, art, 'king', 1.16);
  const official = makeCrownFigure(world, art, 'official', 1.06);
  const mother = makeCrownFigure(world, art, 'mother', 1.12);

  function pose(actor, x, y, z, yaw, kneel = 0, gait = 0) {
    actor.model.position.set(x, y, z);
    actor.model.rotation.y = yaw;
    actor.rig.set(kneel, gait);
    actor.arms[0].rotation.set(-0.14 - 0.58 * kneel + gait * 0.21, 0, -0.26);
    actor.arms[1].rotation.set(-0.14 - 0.58 * kneel - gait * 0.21, 0, 0.26);
  }

  let last = '';
  let lastMarks = [0, 0];
  let startingMarks = lastMarks;
  let started = 0;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    const { storyBeat: beat, marks } = state;
    const key = [beat, ...marks].join('/');
    if (last !== key) {
      last = key;
      startingMarks = marks.some((mark, index) => mark < lastMarks[index]) ? marks : lastMarks;
      lastMarks = marks;
      started = time;
    }
    const age = reduced ? 1800 : time - started;
    const rite = beat === 'rite';
    const hearingMother = beat === 'mother';
    const hearingClerk = beat === 'clerk';
    const hearing = hearingMother || hearingClerk;
    const alarm = beat === 'alarm';
    const entry = alarm ? ease(age, 40, 800) : 1;
    const switches = ease(age, 45, 560);
    pose(king, rite ? 0.03 : 0.43, 0.339, -0.60, hearingMother ? -0.57 : -0.14, rite ? 0 : 1);
    king.head.rotation.set(rite ? 0.02 : 0.15, hearingClerk ? 0.29 : -0.06, 0);
    official.model.visible = !rite && !hearingMother;
    pose(official, mix(-3.8, -0.67, entry), 0.064, mix(-0.46, 0.91, entry),
      mix(1.03, 0.69, entry), hearingClerk ? 1 : 0, Math.sin(entry * Math.PI * 7) * Math.sin(entry * Math.PI));
    official.head.rotation.set(0.13, 0.15, 0);
    mother.model.visible = hearingMother;
    pose(mother, -0.70, 0.064, 0.94, 0.72, 1);
    mother.head.rotation.set(0.09, 0.20, 0);

    for (const [index, post] of posts.entries()) {
      const mark = marks[index];
      const visual = mix(startingMarks[index], mark, switches);
      const light = Math.max(0, visual - 1);
      post.screen.position.x = (index === 0 ? -1 : 1) * light * 0.59;
      post.tablet.rotation.x = 0.12 * visual;
      post.tablet.position.y = 0.506 + 0.028 * visual;
      post.checks.forEach((tile, i) => {
        tile.material = i < mark ? copperRed : sealDark;
        tile.scale.y = i < mark ? 0.025 : 0.012;
      });
      post.light.intensity = 10.1 * light;
      post.flame.visible = light > 0.07;
      post.flame.scale.y = (0.36 + light * 0.64) * (reduced ? 1 : 0.97 + 0.044 * Math.sin(age * 0.021));
    }

    const targetX = hearing ? -0.16 : 0.0;
    const targetY = (rite ? 1.65 : hearing ? 1.30 : 1.39) - captionOffset * 0.60;
    camera.zoom = (rite ? 1.87 : hearing ? 1.48 : 1.26) - captionOffset * (rite ? 0.22 : 0.12);
    camera.updateProjectionMatrix();
    camera.position.set(targetX + (rite ? 2.89 : hearing ? 2.07 : 1.41),
      targetY + (rite ? 3.04 : hearing ? 5.43 : 6.75), 14.6);
    camera.lookAt(targetX, targetY, 0.43);
    camera.updateMatrixWorld();
    marker.hidden = true;
    return !reduced && age < (alarm ? 830 : marks.some(mark => mark === CROWN_HITS) ? 615 : 570);
  }

  return { world, frame, controlsCameraZoom: true };
}

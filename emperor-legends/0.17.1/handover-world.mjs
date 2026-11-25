import * as THREE from './vendor/three.module.min.js';
import { SIZE } from './board.mjs';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';
import { addInkRows, addTileCourses } from './scene-art.mjs';

const { lerp, smoothstep } = THREE.MathUtils;
const lastRow = SIZE - 1;
const cartStops = [[-2.45, 0.43], [2.36, 0.85]];
const keeperDuration = 1250;
const noticeDuration = 2550;
// Follow the open side of the street and turn after the low wall ends.
const noticePath = new THREE.CubicBezierCurve3(
  new THREE.Vector3(3.64, 0, 0.52), new THREE.Vector3(3.64, 0, 2.15),
  new THREE.Vector3(3.66, 0, 4.26), new THREE.Vector3(5.10, 0, 4.82),
);
// Approach the desk from the street side of the raised store platform.
const keeperPath = new THREE.CubicBezierCurve3(
  new THREE.Vector3(-0.83, 0, 0.32), new THREE.Vector3(-0.60, 0, 0.36),
  new THREE.Vector3(-0.37, 0, 0.34), new THREE.Vector3(-0.27, 0, 0.01),
);

export function createHandoverWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0xb8aaa0);
  const art = makeCrownArt();
  const { box, material, mesh, groupAt, earth, wood, cloth, matTexture, thread, round } = art;
  const soil = material(0x9b886b, earth);
  const plaster = material(0xb9a17c, earth);
  const stone = [0x77796f, 0x908675, 0xa2947b].map(color => material(color, earth));
  const oak = material(0x655044, wood);
  const doorWood = material(0x78564b, wood);
  const chestWood = material(0x90795a, wood);
  const tiles = material(0x656d69);
  const mat = material(0xb6a078, matTexture);
  const seal = material(0x9a5945, wood);
  const grain = material(0xc8ac67, cloth);
  const canvas = material(0xb1ae89, cloth);
  const dryWood = material(0xc4a87c, wood);
  const soot = material(0x44372b);
  const bronze = material(0x7a7451, null, 0.55, 0.40);

  const sun = new THREE.DirectionalLight(0xffdbb5, 2.20);
  sun.position.set(-4.0, 6.7, 4.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -7.5, right: 7.5, top: 6, bottom: -6, near: 0.1, far: 25 });
  sun.shadow.normalBias = 0.026;
  world.add(sun, new THREE.HemisphereLight(0xe5d6c4, 0x514238, 1.96));

  box(world, soil, 0, -0.2, 0.18, 17, 0.4, 11);
  const rammed = [0xa89370, 0xa48d69, 0xa9987b, 0xb09e7b, 0xa68c67].map(color => material(color, earth));
  for (let course = 0; course < rammed.length; course += 1) {
    box(world, rammed[course], 0, 0.38 + course * 0.53, -4.24 - course * 0.032,
      16.4, 0.535, 1.32 - course * 0.16, true);
  }
  box(world, soil, 0, 2.94, -4.37, 16.4, 0.16, 0.91, true);
  for (let row = 0; row < 7; row += 1) {
    for (let column = 0; column < 9; column += 1) {
      const x = (column - 4) * 1.055 + (row % 2) * 0.25;
      box(world, stone[(column * 2 + row) % 3], x, 0.013, row * 0.64 - 1.17, 1.02, 0.025, 0.609);
    }
  }
  for (const x of [-4.87, 4.87]) {
    box(world, plaster, x, 0.43, 0.89, 0.52, 0.86, 4.53, true);
    box(world, stone[0], x, 0.905, 0.89, 0.66, 0.12, 4.55, true);
  }

  const store = groupAt(world, -2.50, 0, -1.29);
  box(store, stone[0], 0, 0.101, 0.02, 3.44, 0.202, 2.28, true);
  for (const x of [-1.19, 1.19]) box(store, plaster, x, 1.19, -0.25, 0.99, 1.98, 0.24, true);
  box(store, plaster, 0, 1.97, -0.26, 3.34, 0.53, 0.26);
  box(store, soot, 0, 0.98, -0.77, 1.51, 1.62, 0.09);
  for (const x of [-0.46, 0.34]) {
    box(store, chestWood, x, 0.34, -0.48, 0.39, 0.29, 0.35, true);
    box(store, oak, x, 0.488, -0.48, 0.43, 0.028, 0.38);
  }
  box(store, oak, 0, 1.82, -0.077, 3.55, 0.17, 0.27, true);
  for (const x of [-1.60, -0.73, 0.73, 1.60]) box(store, doorWood, x, 1.02, -0.062, 0.135, 1.77, 0.18, true);
  const roof = groupAt(store, 0, 0, -0.57);
  const beamRoof = box(roof, tiles, 0, 2.26, 0.04, 3.88, 0.10, 1.62, true);
  beamRoof.rotation.x = 0.30;
  addTileCourses(roof, { width: 3.88, run: 1.62, rise: 0.48, eave: 2.11, z: -0.77, back: false });

  const doors = [-1, 1].map(side => {
    const hinge = groupAt(store, side * 0.70, 0.195, 0.02);
    const center = -side * 0.348;
    box(hinge, doorWood, center, 0.779, 0, 0.68, 1.55, 0.084, true);
    for (let column = 0; column < 4; column += 1) {
      box(hinge, oak, center + (column - 1.5) * 0.161, 0.779, 0.045, 0.018, 1.48, 0.016);
    }
    for (const y of [0.25, 1.32]) box(hinge, oak, center, y, 0.053, 0.68, 0.065, 0.075);
    round(hinge, bronze, [0.063, 0.063, 0.063], -side * 0.56, 0.83, 0.066);
    return hinge;
  });

  const depotMat = groupAt(world, 2.63, 0.055, -0.36);
  box(depotMat, mat, 0, 0, 0.25, 2.97, 0.048, 1.63);
  box(depotMat, oak, 0, 0.05, -0.45, 2.98, 0.084, 0.13);
  for (const x of [-1.53, 1.53]) box(depotMat, oak, x, 0.99, -0.62, 0.125, 2.04, 0.135, true);
  for (const x of [-1.53, 1.53]) box(depotMat, oak, x, 0.94, 0.58, 0.11, 1.92, 0.125, true);
  const canopy = box(depotMat, canvas, 0, 1.96, 0.02, 3.26, 0.07, 1.63, true);
  canopy.rotation.x = 0.13;
  for (const z of [-0.74, 0.78]) {
    box(depotMat, oak, 0, z < 0 ? 2.01 : 1.83, z, 3.39, 0.055, 0.09, true);
  }
  for (const x of [-0.96, 1.13]) {
    art.profile(depotMat, chestWood,
      [[0, 0], [0.24, 0], [0.28, 0.26], [0.23, 0.43], [0.15, 0.49], [0.15, 0.53], [0.18, 0.54]],
      x, 0.04, -0.31, true);
  }

  function sack(parent, x, y, z) {
    const body = groupAt(parent, x, y, z);
    round(body, grain, [0.29, 0.17, 0.225], 0, 0, 0, true);
    round(body, grain, [0.074, 0.052, 0.065], 0.23, 0.037, 0);
    box(body, soot, 0.192, 0.055, 0, 0.018, 0.026, 0.132);
    return body;
  }

  const sacks = [sack(world, 1.75, 0.26, 0.20), sack(world, 2.29, 0.25, 0.08), sack(world, 2.79, 0.27, 0.25)];
  const sacksAtRest = sacks.map(({ position }) => position.clone());
  const movedSack = new THREE.Vector3();
  const handoverDesk = groupAt(world, -0.19, 0.028, -0.72);
  box(handoverDesk, doorWood, 0, 0.46, 0, 1.25, 0.094, 0.67, true);
  for (const x of [-0.48, 0.48]) for (const z of [-0.24, 0.24]) {
    box(handoverDesk, oak, x, 0.22, z, 0.105, 0.44, 0.106);
  }
  box(handoverDesk, dryWood, 0, 0.522, 0, 0.51, 0.032, 0.32, true);
  addInkRows(handoverDesk, box, soot, { width: 0.43, length: 0.26, y: 0.54, columns: 6 });

  const cartRim = new THREE.CylinderGeometry(0.278, 0.278, 0.104, 20).rotateZ(Math.PI / 2);
  const cartHub = new THREE.CylinderGeometry(0.086, 0.086, 0.19, 12).rotateZ(Math.PI / 2);
  function wagon(index) {
    const model = groupAt(world);
    const load = groupAt(model, 0, 0.412, 0.04);
    box(model, chestWood, 0, 0.323, 0.025, 0.79, 0.084, 1.01, true);
    for (const x of [-0.35, 0.35]) {
      box(model, oak, x, 0.427, 0.022, 0.067, 0.194, 1.025, true);
      box(model, chestWood, x * 0.8, 0.30, -0.74, 0.065, 0.06, 0.55, true);
    }
    const wheels = [-0.46, 0.46].map(x => {
      const wheel = groupAt(model, x, 0.267, 0.05);
      mesh(wheel, cartRim, oak, 0, 0, 0, true);
      mesh(wheel, cartHub, bronze);
      for (let spoke = 0; spoke < 8; spoke += 1) {
        const radians = spoke * Math.PI / 4;
        const slat = box(wheel, dryWood, Math.sign(x) * 0.058,
          Math.cos(radians) * 0.146, Math.sin(radians) * 0.146, 0.029, 0.194, 0.033);
        slat.rotation.x = radians;
      }
      return wheel;
    });
    if (index === 0) {
      box(load, chestWood, 0, 0.14, 0, 0.56, 0.28, 0.56, true);
      box(load, doorWood, 0, 0.28, 0, 0.58, 0.067, 0.58, true);
      box(load, seal, 0, 0.317, 0.07, 0.20, 0.04, 0.21, true);
      thread(load, dryWood, [[-0.29, 0.11, 0.08], [-0.29, 0.318, 0.08], [0.29, 0.318, 0.08], [0.29, 0.11, 0.08]], 0.013);
    } else {
      sack(load, 0, 0.15, -0.20);
      sack(load, 0, 0.15, 0.23);
      sack(load, -0.04, 0.34, 0.02);
    }
    return { model, load, wheels };
  }

  const wagons = [wagon(0), wagon(1)];
  const envoy = makeCrownFigure(world, art, 'official', 1.10);
  const keeper = makeCrownFigure(world, art, 'keeper', 1.07);
  const neighbor = makeCrownFigure(world, art, 'resident', 1.06);
  const heldLedger = groupAt(keeper.arms[0], 0.008, -0.351, 0.041);
  box(heldLedger, dryWood, 0, 0, 0.039, 0.28, 0.084, 0.099, true);
  box(heldLedger, oak, 0.075, 0.044, 0.039, 0.026, 0.009, 0.105);

  function pose(actor, x, z, yaw, gait = 0) {
    actor.model.position.set(x, 0.027, z);
    actor.model.rotation.y = yaw;
    actor.rig.set(0, gait);
    actor.arms[0].rotation.set(-0.13 + gait * 0.27, 0, -0.17);
    actor.arms[1].rotation.set(-0.13 - gait * 0.27, 0, 0.17);
  }

  const walkPosition = new THREE.Vector3();
  const walkDirection = new THREE.Vector3();
  function walk(actor, path, age, duration, initialYaw, cycles) {
    const progress = smoothstep(age, 190, duration);
    path.getPointAt(progress, walkPosition);
    path.getTangentAt(progress, walkDirection);
    const yaw = Math.atan2(walkDirection.x, walkDirection.z);
    const stride = smoothstep(progress, 0, 0.09) * (1 - smoothstep(progress, 0.90, 1));
    const gait = Math.sin(progress * cycles * 2 * Math.PI) * stride;
    pose(actor, walkPosition.x, walkPosition.z, lerp(initialYaw, yaw, smoothstep(age, 0, 195)), gait);
  }

  let lastBeat;
  let lastCargo = [-1, -1];
  let fromCargo = lastCargo;
  let started = 0;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    const { storyBeat: beat, cargo } = state;
    if (beat !== lastBeat || cargo.some((row, index) => row !== lastCargo[index])) {
      fromCargo = cargo.some((row, index) => row < lastCargo[index]) ? cargo : lastCargo;
      lastCargo = cargo;
      lastBeat = beat;
      started = time;
    }
    const age = reduced ? noticeDuration : time - started;
    const travel = smoothstep(age, 20, 525);
    const opening = cargo[0] === lastRow ? fromCargo[0] === lastRow ? 1 : smoothstep(age, 455, 880) : 0;
    const unloading = cargo[1] === lastRow ? fromCargo[1] === lastRow ? 1 : smoothstep(age, 440, 935) : 0;
    wagons.forEach(({ model, load, wheels }, index) => {
      const [x, z] = cartStops[index];
      const row = lerp(fromCargo[index], cargo[index], travel);
      const progress = Math.max(0, row + 0.5) / (lastRow + 0.5);
      model.position.set(lerp(index === 0 ? -0.50 : 0.56, x, progress), 0.035, lerp(3.48, z, progress));
      model.rotation.y = index === 0 ? 0.57 : -0.53;
      wheels.forEach(wheel => { wheel.rotation.x = -progress * 14; });
      load.visible = index === 0 || unloading < 0.04;
    });
    doors.forEach((door, index) => { door.rotation.y = (index ? -1 : 1) * opening * 1.13; });
    sacks.forEach((item, index) => {
      const end = sacksAtRest[index];
      wagons[1].load.localToWorld(movedSack.set((index - 1) * 0.13, 0.19, 0.18 - index * 0.18));
      item.visible = unloading >= 0.04;
      item.position.copy(movedSack).lerp(end, unloading);
      item.position.y += Math.sin(unloading * Math.PI) * 0.24;
    });

    pose(envoy, 0.25, -1.61, -0.44);
    walk(keeper, keeperPath, beat === 'keeper' ? age : 0, keeperDuration, 0.59, 2);
    heldLedger.visible = beat === 'keeper';
    if (heldLedger.visible) keeper.arms[0].rotation.x = -0.92;
    walk(neighbor, noticePath, beat === 'notice' ? age : 0, noticeDuration, -1.07, 7);
    neighbor.model.position.y += 0.052 * (1 - smoothstep(neighbor.model.position.z, 0.76, 0.98));

    const brief = beat === 'arrival' || beat === 'briefing';
    const targetX = beat === 'notice' ? 0.43 : 0;
    const targetY = (brief ? 1.36 : 1.03) - captionOffset * 0.86;
    camera.zoom = brief ? 1.09 : 1.25 - captionOffset * 0.05;
    camera.updateProjectionMatrix();
    camera.position.set(targetX + 1.55, targetY + (brief ? 6.1 : 8.65), 14.8);
    camera.lookAt(targetX, targetY, 0.14 + captionOffset * 0.50);
    camera.updateMatrixWorld();
    marker.hidden = true;
    const duration = beat === 'notice' ? noticeDuration : beat === 'keeper' ? keeperDuration : 960;
    return !reduced && age < duration;
  }

  return { world, frame, controlsCameraZoom: true };
}

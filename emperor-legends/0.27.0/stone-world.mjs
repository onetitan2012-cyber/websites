import * as THREE from './vendor/three.module.min.js';
import { makeFigures } from './figure.mjs';
import { grain } from './material-grain.mjs';
import { addTileCourses, lathe } from './scene-art.mjs';

const smooth = THREE.MathUtils.smoothstep;
const up = new THREE.Vector3(0, 1, 0);
const down = new THREE.Vector3(0, -1, 0);
const hand = new THREE.Vector3(0, -0.345, 0.018);

export function createStoneWorld(mode) {
  const pottery = mode === 'pottery';
  const world = new THREE.Scene();
  const sky = pottery ? 0xc9b486 : 0xabb9b7;
  world.background = new THREE.Color(sky);
  world.fog = new THREE.FogExp2(sky, pottery ? 0.028 : 0.041);
  let seed = pottery ? 4341 : 5791;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  const earth = grain('earth', random);
  const wood = grain('wood', random);
  const granite = grain('stone', random);
  const cloth = grain('cloth', random);
  const material = (color, map) => new THREE.MeshStandardMaterial({ color, map, roughness: 0.94 });
  const cube = new THREE.BoxGeometry();
  const sphere = new THREE.SphereGeometry(1, 12, 9);
  const clay = material(pottery ? 0xc79b62 : 0x9a9784, earth);
  const ground = material(pottery ? 0xab926c : 0x99937c, earth);
  const stoneBase = material(pottery ? 0x8c816d : 0x7f8680, granite);
  const cedar = material(0x645041, wood);
  const plank = material(0x896b4e, wood);
  const tiles = [0x566354, 0x687063, 0x697368].map(color => material(color, granite));
  const potteryColors = [0xad6e4e, 0xb48560, 0x917254, 0x976347].map(color => material(color, granite));

  function mesh(group, geometry, mat, x, y, z, cast = false) {
    const model = new THREE.Mesh(geometry, mat);
    model.position.set(x, y, z);
    model.castShadow = cast;
    model.receiveShadow = true;
    group.add(model);
    return model;
  }

  function box(group, mat, x, y, z, sx, sy, sz, cast) {
    const model = mesh(group, cube, mat, x, y, z, cast);
    model.scale.set(sx, sy, sz);
    return model;
  }

  function round(group, mat, size, x, y, z, cast = false) {
    const model = mesh(group, sphere, mat, x, y, z, cast);
    model.scale.set(...size);
    return model;
  }

  function groupAt(parent, x = 0, y = 0, z = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    parent.add(group);
    return group;
  }

  function beam(group, mat, a, b, radius, taper, cast) {
    const start = new THREE.Vector3(...a);
    const delta = new THREE.Vector3(...b).sub(start);
    const mid = start.clone().addScaledVector(delta, 0.5);
    const body = mesh(group, new THREE.CylinderGeometry(radius * taper, radius, delta.length(), 8),
      mat, mid.x, mid.y, mid.z, cast);
    body.quaternion.setFromUnitVectors(up, delta.normalize());
  }

  const sun = new THREE.DirectionalLight(pottery ? 0xffdbac : 0xffdcb4, pottery ? 2.55 : 1.95);
  sun.position.set(pottery ? -4.9 : 2.6, 8.4, 5.3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 6.2, bottom: -6.2, near: 0.1, far: 28 });
  sun.shadow.normalBias = 0.023;
  sun.shadow.bias = -0.0003;
  world.add(sun, new THREE.HemisphereLight(pottery ? 0xd5e4db : 0xd8e6ef, 0x695343, 1.7));
  box(world, ground, 0, -0.27, 0, 34, 0.51, 22);

  function roof(frame, width, y, z, span) {
    const ridge = y + 0.69;
    const run = span / 2;
    const angle = Math.atan2(ridge - y, run);
    for (const side of [-1, 1]) {
      const slab = box(frame, tiles[0], 0, (y + ridge) / 2, z + side * run / 2,
        width, 0.10, Math.hypot(run, ridge - y), true);
      slab.rotation.x = side * angle;
      box(frame, cedar, 0, y - 0.023, z + side * run, width, 0.125, 0.12, true);
    }
    addTileCourses(frame, { width, run, rise: ridge - y, eave: y, z, spacing: 0.216 });
    box(frame, tiles[1], 0, ridge + 0.11, z, width + 0.13, 0.12, 0.16);
  }

  function wall(x, z, width, height) {
    const frame = groupAt(world, x, 0, z);
    box(frame, clay, 0, height / 2, 0, width, height, 1.79, true);
    box(frame, stoneBase, 0, 0.14, 0.08, width + 0.07, 0.28, 1.94);
    for (const edge of [-width / 2 + 0.1, width / 2 - 0.1]) {
      box(frame, cedar, edge, (height + 0.19) / 2, 0.92, 0.13, height - 0.17, 0.17, true);
    }
    box(frame, cedar, 0, height - 0.003, 0.98, width + 0.11, 0.144, 0.16, true);
    roof(frame, width + 0.51, height + 0.05, 0, 2.68);
    return frame;
  }

  function reeds() {
    const olive = material(pottery ? 0x73784c : 0x7a816a);
    const trunk = groupAt(world, 4.39, 0, -1.5);
    beam(trunk, cedar, [0, 0, 0], [0.29, 3.8, -0.13], 0.19, 0.44);
    beam(trunk, cedar, [0.19, 2.28, 0.01], [-0.71, 3.53, 0.12], 0.097, 0.43);
    const foliage = new THREE.IcosahedronGeometry(1, 2);
    for (let i = 0; i < 16; i += 1) {
      const leaf = mesh(trunk, foliage, olive, (random() - 0.5) * 2.9, 3.38 + random() * 1.04, (random() - 0.5) * 1.47);
      leaf.scale.set(0.46 + random() * 0.55, 0.34 + random() * 0.48, 0.49 + random() * 0.39);
    }
  }

  const jarShape = new THREE.LatheGeometry([
    [0, 0], [0.17, 0], [0.28, 0.16], [0.30, 0.32], [0.23, 0.50], [0.132, 0.57], [0.15, 0.60],
    [0.12, 0.60], [0.116, 0.55],
  ].map(([x, y]) => new THREE.Vector2(x, y)), 18);
  function jar(x, y, z, size, variation) {
    mesh(world, jarShape, potteryColors[variation], x, y, z, true).scale.setScalar(size);
  }

  const figure = makeFigures({ world, material, cloth, mesh, box, round, groupAt, handScale: 1.28, articulated: true });
  const zheng = figure(0.70, 0x566859, 0x806d54, 'boy');
  const dan = figure(0.76, 0xa16e50, 0x69513d, 'boy');
  const elder = pottery ? figure(1.10, 0x6a735a, 0x817254, 'ran')
    : figure(1.13, 0x815447, 0x574a3f, 'mother');

  const cart = groupAt(world, -3.1, 0.028, 1.31);
  const wheels = [];
  if (pottery) {
    cart.visible = false;
    const workshop = wall(-1.28, -0.80, 6.7, 2.82);
    box(workshop, cedar, -1.77, 1.22, 0.95, 1.30, 1.93, 0.12);
    box(workshop, material(0x5e4c39), 1.12, 1.73, 0.916, 1.47, 0.83, 0.055);
    for (let index = 0; index < 5; index += 1) {
      box(workshop, plank, -2.28 + index * 0.25, 1.22, 1.03, 0.23, 1.89, 0.074);
      box(workshop, cedar, 0.52 + index * 0.24, 1.73, 1.03, 0.074, 0.72, 0.082);
    }
    wall(-4.24, -3.31, 3.4, 2.53);
    const kiln = groupAt(world, 4.12, 0, -0.71);
    mesh(kiln, lathe([[0.72, 0], [0.76, 0.12], [0.70, 0.47], [0.54, 0.83], [0.27, 1.14], [0.14, 1.22]]),
      material(0xa16f53, earth), 0, 0, 0, true);
    box(kiln, cedar, 0, 0.23, 0.70, 0.34, 0.27, 0.10);
    box(kiln, plank, 0, 0.067, 0.72, 0.52, 0.05, 0.26);
    for (const y of [1.31, 2.15]) box(workshop, cedar, 1.12, y, 1.02, 1.52, 0.080, 0.112, true);
    for (const x of [0.39, 1.85]) box(workshop, cedar, x, 1.73, 1.02, 0.080, 0.83, 0.112, true);
    const bench = groupAt(world, -2.68, 0, 0.66);
    box(bench, plank, 0, 0.66, 0, 2.25, 0.12, 0.64, true);
    for (const x of [-0.88, 0.88]) box(bench, cedar, x, 0.30, 0, 0.12, 0.61, 0.43, true);
    for (let n = 0; n < 4; n += 1) jar(-3.45 + n * 0.49, 0.725, 0.67, 0.59 + n * 0.102, n);
    jar(2.64, 0, 0.68, 1.12, 0);
    jar(3.27, 0, 0.48, 1.44, 1);
    jar(3.88, 0, 0.38, 1.08, 2);
    for (let n = 0; n < 14; n += 1) {
      box(world, stoneBase, n * 0.58 - 4.7, 0.022, 1.22, 0.53, 0.068, 0.62);
    }
  } else {
    for (const side of [-1, 1]) {
      box(world, clay, side * 4.1, 1.60, -1.69, 5.35, 3.20, 1.05, true);
      box(world, stoneBase, side * 4.16, 3.14, -1.68, 5.46, 0.18, 1.16);
      for (let n = 0; n < 7; n += 1) {
        box(world, clay, side * (1.76 + n * 0.74), 3.35, -1.69, 0.34, 0.30, 0.66, true);
      }
    }
    const gate = groupAt(world, 0.22, 0, -1.48);
    for (const side of [-1, 1]) box(gate, cedar, side * 1.18, 1.54, 0, 0.28, 3.09, 0.30, true);
    box(gate, clay, 0, 3.35, 0, 3.30, 0.80, 1.42, true);
    box(gate, cedar, 0, 2.91, 0.64, 2.69, 0.24, 0.24, true);
    box(gate, stoneBase, 0, 0.080, 0.03, 2.56, 0.12, 1.28);
    roof(gate, 3.91, 3.80, 0, 2.63);
    const hills = [material(0x89998a), material(0x8f9e90)];
    for (let index = 0; index < 10; index += 1) {
      round(world, hills[index % 2], [2.9, 1.24 + random() * 1.2, 2],
        -8.7 + index * 1.93, 0.12, -7.6 - random() * 2.4);
    }
    box(cart, plank, 0, 0.58, 0, 1.55, 0.13, 0.94, true);
    box(cart, cedar, 0, 0.86, -0.46, 1.53, 0.47, 0.09, true);
    for (const z of [-0.48, 0.48]) {
      const wheel = groupAt(cart, -0.15, 0.40, z);
      wheels.push(wheel);
      mesh(wheel, new THREE.TorusGeometry(0.36, 0.048, 8, 20), cedar, 0, 0, 0, true);
      for (let n = 0; n < 5; n += 1) box(wheel, plank, 0, 0, 0, 0.048, 0.71, 0.055).rotation.z = n * Math.PI / 5;
    }
  }
  reeds();

  function pebble(keep, color) {
    const prop = groupAt(world);
    // A pale vein identifies the same pebble in both settings.
    const form = mesh(prop, new THREE.SphereGeometry(1, 26, 16), material(color, granite), 0, 0, 0, true);
    form.scale.set(0.139, 0.059, keep ? 0.106 : 0.087);
    if (keep) {
      const points = [];
      for (let index = 0; index <= 13; index += 1) {
        const x = -0.123 + index * 0.0189;
        const z = -0.039 + index * 0.0056 + Math.sin(index * 0.86) * 0.006;
        const y = 0.059 * Math.sqrt(Math.max(0, 1 - (x / 0.139) ** 2 - (z / 0.106) ** 2)) + 0.0015;
        points.push(new THREE.Vector3(x, y, z));
      }
      mesh(prop, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 20, 0.0100, 6, false),
        material(0xe0d1ab), 0, 0, 0);
    }
    prop.scale.setScalar(keep ? 0.70 : 0.73);
    return prop;
  }

  const gift = pebble(true, 0x637a73);
  const other = pottery ? [pebble(false, 0x9b6f58), pebble(false, 0xa69b7b)] : [];
  const leftWrist = new THREE.Vector3();
  const rightWrist = new THREE.Vector3();
  const target = new THREE.Vector3();
  const palm = new THREE.Vector3();
  let shot = '';
  let shotStart = 0;

  function pose(actor, x, z, yaw, bend, glance, pitch) {
    actor.model.position.set(x, 0.017, z);
    actor.model.rotation.set(0, yaw, 0);
    actor.rig.set(bend * 0.79, 0);
    actor.head.rotation.set(pitch, glance, 0);
    actor.arms.forEach((arm, index) => arm.rotation.set(-0.12, 0, (index === 0 ? -1 : 1) * 0.24));
  }

  function reach(actor, armNumber, at, amount, out) {
    const arm = actor.arms[armNumber];
    actor.model.updateWorldMatrix(true, true);
    const inModel = arm.parent.worldToLocal(target.copy(at)).sub(arm.position).normalize();
    const goal = new THREE.Quaternion().setFromUnitVectors(down, inModel);
    arm.quaternion.slerp(goal, amount);
    arm.localToWorld(out.copy(hand));
    out.y += 0.043;
  }

  function setCamera(camera, heightOffset, framing, x, y, z, angle) {
    camera.zoom = framing;
    camera.updateProjectionMatrix();
    camera.position.set(x + angle, y + 3.85, z + 14.0);
    camera.lookAt(x, y - heightOffset, z);
    camera.updateMatrixWorld();
  }

  function frame(state, camera, marker, time, reduced, captionOffset) {
    const nextShot = state.storyBeat || 'wide';
    if (shot !== nextShot) {
      shot = nextShot;
      shotStart = time;
    }
    const elapsed = reduced ? 5000 : time - shotStart;
    gift.visible = false;
    marker.hidden = true;
    if (pottery) {
      const activity = ['lay', 'correct', 'gather', 'gift', 'tuck'].includes(shot);
      const transfer = shot === 'gift' || shot === 'tuck';
      const bend = transfer ? 0.12 : activity ? 0.84 : 0;
      pose(zheng, transfer ? -0.44 : -0.86, 2.21, 0.89, bend, 0.15, activity ? 0.13 : 0);
      pose(dan, transfer ? 0.45 : 0.81, 2.23, -0.72, bend, -0.18, activity ? 0.16 : 0);
      pose(elder, -3.04, 1.13, 0.44, 0, 0.37, 0.03);
      const shuffle = shot === 'correct' ? smooth(elapsed, 40, 510) : ['gather', 'gift', 'tuck'].includes(shot) ? 1 : 0;
      const spread = shot === 'lay' ? smooth(elapsed, 30, 510) : 1;
      other[0].position.set(-0.12 - spread * 0.22 - shuffle * 0.11, 0.048, 2.68 - spread * 0.13 + shuffle * 0.13);
      other[1].position.set(0.15 + spread * 0.15, 0.047, 2.62 + spread * 0.05 - shuffle * 0.28);
      other.forEach(prop => { prop.visible = !transfer; });
      gift.position.set(0.04, 0.044, 2.72 + spread * 0.12);
      gift.visible = shot !== 'tuck' || elapsed < 420;
      if (activity && !transfer) {
        const pointAt = new THREE.Vector3(0.24, 0.27, 2.56);
        reach(dan, 0, pointAt, shot === 'gather' ? 0.80 : 0.69, rightWrist);
        reach(zheng, 1, pointAt, shot === 'gather' ? 0.72 : 0.45, leftWrist);
        if (shot === 'gather') {
          gift.position.lerp(rightWrist, smooth(elapsed, 110, 590));
          other[0].position.lerp(leftWrist, smooth(elapsed, 130, 550));
        }
      }
      if (transfer) {
        const slip = shot === 'tuck' ? smooth(elapsed, 130, 530) : 0;
        reach(dan, 0, palm.set(0.02, 0.81, 2.50), 0.98 - slip * 0.65, rightWrist);
        reach(zheng, 1, palm.set(-0.01 - slip * 0.36, 0.80 - slip * 0.13, 2.51 - slip * 0.21), 0.98, leftWrist);
        const exchange = shot === 'tuck' ? 1 : smooth(elapsed, 100, 690);
        gift.position.copy(rightWrist).lerp(leftWrist, exchange);
        gift.position.y += Math.sin(exchange * Math.PI) * 0.045;
        setCamera(camera, captionOffset * 0.18, 3.17, 0.02, 0.83, 2.37, 0.72);
      } else if (activity) {
        setCamera(camera, captionOffset * 0.44, 1.97, 0.02, 0.63, 2.45, 1.30);
      } else {
        setCamera(camera, captionOffset * 0.93, 1, -0.33, 1.48, 0.98, 2.07);
      }
    } else {
      const departing = shot === 'departure';
      const recall = shot === 'recall' || shot === 'keep' || shot === 'pocket';
      const t = departing ? smooth(elapsed, 60, 1710) : 0;
      cart.position.set(-2.95 + t * 7.02, 0.02, 1.71 + t * 0.30);
      wheels.forEach(wheel => { wheel.rotation.z = -t * 8.9; });
      pose(zheng, departing ? cart.position.x - 0.14 : -0.27, departing ? 1.74 : 2.35,
        departing ? 1.17 - t * 1.69 : 0.81, 0, departing ? -0.53 : 0.18, 0.04);
      pose(dan, recall ? 0.91 : 1.22, 2.22, -0.68, 0, -0.20, recall ? 0.17 : 0.02);
      pose(elder, departing ? cart.position.x - 0.68 : -1.71, departing ? 1.80 : recall ? 1.38 : 1.94,
        departing ? 1.38 : 0.77, 0, 0.16, 0.03);
      if (departing) {
        zheng.model.position.y += 0.43;
        elder.model.position.y += 0.52;
      }
      if (recall) {
        const reveal = shot === 'recall' ? smooth(elapsed, 95, 700) : 1;
        const pocket = shot === 'pocket' ? smooth(elapsed, 190, 610) : 0;
        reach(zheng, 1, palm.set(
          -0.27 + reveal * 0.27 - pocket * 0.29,
          0.52 + reveal * 0.28 - pocket * 0.21,
          2.34 + reveal * 0.31 - pocket * 0.28), 0.96, leftWrist);
        gift.position.copy(leftWrist);
        gift.visible = reveal > 0.20 && pocket < 0.68;
        setCamera(camera, captionOffset * 0.18, 3.17, 0.06, 0.86, 2.41, 0.72);
      } else {
        const departPan = departing ? t * 0.91 : 0;
        setCamera(camera, captionOffset * 0.91, 1.07, departPan - 0.2, 1.53, 0.89, 1.88);
      }
    }
    gift.rotation.set(0.23, 0.18, 0.035);
    return !reduced && (['lay', 'correct', 'gather', 'gift', 'tuck', 'recall', 'pocket'].includes(shot) && elapsed < 755
      || shot === 'departure' && elapsed < 1750);
  }

  return { world, frame, controlsCameraZoom: true };
}

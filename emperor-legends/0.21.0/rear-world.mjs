import * as THREE from './vendor/three.module.min.js';
import { makeFigures } from './figure.mjs';
import { grain } from './material-grain.mjs';
import { addTileCourses } from './scene-art.mjs';

const smooth = (value, from, to) => THREE.MathUtils.smoothstep(value, from, to);

export function createRoadWorld(path) {
  const side = path === 'own_route';
  const world = new THREE.Scene();
  world.background = new THREE.Color(side ? 0xb1a594 : 0xc6ad88);
  world.fog = new THREE.FogExp2(side ? 0xaaa391 : 0xbdab8e, 0.033);
  const material = (color, map) => new THREE.MeshStandardMaterial({ color, map, roughness: 0.94 });
  const cube = new THREE.BoxGeometry();
  const sphere = new THREE.SphereGeometry(1, 12, 9);
  const point = new THREE.Vector3();
  let seed = 4263;
  function random() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  const earth = grain('earth', random);
  const wood = grain('wood', random);
  const stone = grain('stone', random);
  const cloth = grain('cloth', random);
  const woven = grain('reed', random);
  const wallM = material(side ? 0xb6a488 : 0xd3a16f, earth);
  const fadedWall = material(side ? 0x968771 : 0xa98965, earth);
  const baseM = material(0x856d55, stone);
  const paleGround = material(side ? 0x938270 : 0xa88c64, earth);
  const farGround = material(0xa79570, earth);
  const timber = material(0x654b37, wood);
  const boards = [0x946a43, 0x805a3b, 0x9d7652, 0x8b623e].map(color => material(color, wood));
  const tiles = [0x5a645c, 0x667063, 0x717567].map(color => material(color, stone));
  const paving = [0xa09171, 0x968367, 0xac9b80, 0x958870].map(color => material(color, stone));
  const metal = material(0x594d3c);
  const inner = material(0x5b4834);
  const terracotta = [0xa96142, 0x9b6d4e, 0x84654c, 0xb17b51].map(color => material(color, stone));

  function mesh(group, geometry, mat, x, y, z, cast = false) {
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(x, y, z);
    object.castShadow = cast;
    object.receiveShadow = true;
    group.add(object);
    return object;
  }

  function box(group, mat, x, y, z, sx, sy, sz, cast) {
    const object = mesh(group, cube, mat, x, y, z, cast);
    object.scale.set(sx, sy, sz);
    return object;
  }

  function round(group, mat, size, x, y, z, cast = false) {
    const object = mesh(group, sphere, mat, x, y, z, cast);
    object.scale.set(...size);
    return object;
  }

  function groupAt(parent, x = 0, y = 0, z = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    parent.add(group);
    return group;
  }

  const sun = new THREE.DirectionalLight(side ? 0xffdbc1 : 0xffd1a0, side ? 2.02 : 2.35);
  sun.position.set(-5.9, 8.8, 5.9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 6.2, bottom: -6.2, near: 0.1, far: 30 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.028;
  world.add(sun, new THREE.HemisphereLight(0xd3dfdf, 0x675747, 1.75));
  box(world, farGround, 0, -0.42, 0, 31, 0.66, 24);
  box(world, paleGround, 0, -0.09, 2.3, 13.8, 0.14, 6.0);

  function home(x, z, width, height, clay) {
    const building = groupAt(world, x, 0, z);
    box(building, clay, 0, height / 2, 0, width, height, 1.7, true);
    box(building, baseM, 0, 0.20, 0.09, width + 0.11, 0.4, 1.91);
    for (const px of [-width * 0.5, width * 0.5]) {
      box(building, timber, px, height * 0.48, 0.88, 0.115, height * 0.96, 0.14);
    }
    for (const sign of [-1, 1]) {
      const slab = box(building, tiles[0], 0, height + 0.34, sign * 0.62, width + 0.74, 0.13, 1.52, true);
      slab.rotation.x = sign * 0.43;
      box(building, timber, 0, height + 0.018, sign * 1.28, width + 0.72, 0.127, 0.14, true);
    }
    addTileCourses(building, { width: width + 0.72, run: 1.31, rise: 0.62, eave: height + 0.058, z: 0 });
    box(building, tiles[1], 0, height + 0.75, 0, width + 0.88, 0.10, 0.14);
    return building;
  }

  // Back walls and close props establish the narrow route.
  const kilnHouse = home(-3.95, side ? -0.12 : -0.77, 3.84, side ? 2.85 : 2.63, wallM);
  box(kilnHouse, inner, 0.22, 1.32, 0.88, 1.3, 1.94, 0.06);
  for (const x of [-0.43, 0.87]) box(kilnHouse, timber, x, 1.32, 0.939, 0.12, 2.02, 0.16, true);
  box(kilnHouse, timber, 0.22, 2.31, 0.939, 1.55, 0.135, 0.18, true);
  box(kilnHouse, baseM, 0.22, 0.17, 1.02, 1.56, 0.16, 0.38);
  const facing = home(side ? 0.23 : 0.05, side ? -1.91 : -1.33, 4.11, 2.94, wallM);
  box(facing, timber, -0.50, 1.57, 0.89, 1.13, 0.71, 0.08);
  for (let n = 0; n < 6; n += 1) box(facing, boards[n % 4],
    -0.98 + n * 0.19, 1.57, 0.96, 0.071, 0.69, 0.08);
  home(4.55, -2.40, 3.62, 2.67, fadedWall);
  home(-3.63, -4.98, 4.5, 3.1, fadedWall);
  const tree = groupAt(world, 5.02, 0, -2.43);
  const trunk = mesh(tree, new THREE.CylinderGeometry(0.13, 0.26, 4.68, 10), timber, 0, 2.34, 0);
  trunk.rotation.z = -0.08;
  const crown = new THREE.IcosahedronGeometry(1, 2);
  const leaves = [0x62664a, 0x747452, 0x8e855a, 0x59654b].map(color => material(color));
  for (let n = 0; n < 19; n += 1) {
    const part = mesh(tree, crown, leaves[n % 4],
      (random() - 0.5) * 3.07, 3.45 + random() * 1.17, (random() - 0.5) * 1.68);
    part.scale.set(0.47 + random() * 0.61, 0.34 + random() * 0.48, 0.52 + random() * 0.66);
  }
  const jarGeo = new THREE.LatheGeometry([[0, 0], [0.17, 0], [0.27, 0.15], [0.295, 0.33],
    [0.23, 0.48], [0.143, 0.56], [0.16, 0.6], [0.12, 0.6], [0.116, 0.50]]
    .map(([x, y]) => new THREE.Vector2(x, y)), 18);
  if (side) {
    const stair = material(0xa39c86, stone);
    for (let step = 0; step < 3; step += 1) {
      box(world, stair, -3.15, 0.055 + step * 0.077, 1.33 - step * 0.25,
        1.77 - step * 0.11, 0.11 + step * 0.154, 0.43, true);
    }
    const clothAwning = material(0x9b604b, cloth);
    clothAwning.side = THREE.DoubleSide;
    const canopy = new THREE.PlaneGeometry(2.25, 1.13, 16, 7);
    const vertices = canopy.attributes.position;
    for (let i = 0; i < vertices.count; i += 1) {
      const x = vertices.getX(i);
      const y = vertices.getY(i);
      vertices.setZ(i, 0.055 * Math.sin(x * 9.9) + y * 0.24);
    }
    canopy.computeVertexNormals();
    const roofCloth = mesh(world, canopy, clothAwning, -3.6, 2.08, 1.37, true);
    roofCloth.rotation.x = -Math.PI / 2;
    for (const x of [-4.71, -2.48]) box(world, timber, x, 1.06, 1.91, 0.09, 2.11, 0.09, true);
    for (let i = 0; i < 4; i += 1) {
      box(world, material([0x775858, 0x8b724e, 0x556960, 0x9b8367][i], cloth),
        -4.3 + i * 0.39, 0.64, 1.67, 0.36, 0.14, 0.45, true);
    }
    box(world, timber, -3.72, 0.49, 1.65, 1.82, 0.15, 0.55, true);
    box(world, timber, -3.72, 0.23, 1.64, 1.52, 0.43, 0.45);
    for (let i = 0; i < 3; i += 1) {
      const vessel = mesh(world, jarGeo, terracotta[i], 3.72 + i * 0.43, 0.032, 0.74, true);
      vessel.scale.setScalar(0.74 + i * 0.12);
    }
  } else {
    const bench = groupAt(world, -2.77, 0, 0.42);
    box(bench, boards[0], 0, 0.55, 0, 2.35, 0.14, 0.56, true);
    for (const x of [-0.86, 0.86]) box(bench, timber, x, 0.25, 0, 0.13, 0.53, 0.38);
    for (let n = 0; n < 8; n += 1) {
      const onBench = n < 4;
      const jar = mesh(world, jarGeo, terracotta[n % 4],
        onBench ? -3.53 + n * 0.47 : -1.86 + (n - 4) * 0.44, onBench ? 0.62 : 0.025, onBench ? 0.46 : 0.77, true);
      jar.scale.setScalar(0.52 + random() * 0.54);
    }
  }
  for (let row = 0; row < 3; row += 1) {
    for (let n = 0; n < 17; n += 1) {
      const pavingStone = box(world, paving[Math.floor(random() * paving.length)],
        n * 0.67 - 5.62 + (row % 2) * 0.27, 0.014, 1.94 + row * 0.48 + Math.sin(n * 0.48) * 0.10,
        0.63 - random() * 0.069, 0.063 + random() * 0.026, 0.45 - random() * 0.055);
      pavingStone.rotation.y = (random() - 0.5) * 0.11;
    }
  }
  for (let n = 0; n < 24; n += 1) {
    const x = random() * 12 - 6;
    const z = random() > 0.49 ? 3.37 + random() * 1.1 : 1.09 + random() * 0.3;
    const s = 0.025 + random() * 0.085;
    round(world, paving[n % 4], [s, s * 0.38, s * 0.72], x, 0.014, z);
  }

  function framedDoor(x, z, yaw, height, width) {
    const frame = groupAt(world, x, 0, z);
    frame.rotation.y = yaw;
    for (const side of [-1, 1]) {
      box(frame, baseM, side * (width / 2 + 0.1), 0.16, 0, 0.31, 0.32, 0.33);
      box(frame, timber, side * (width / 2 + 0.08), height * 0.54, 0, 0.16, height + 0.12, 0.18, true);
    }
    box(frame, timber, 0, height + 0.13, 0, width + 0.42, 0.16, 0.23, true);
    const hinge = groupAt(frame, -width / 2, 0.025, 0.0);
    for (let n = 0; n < 6; n += 1) {
      box(hinge, boards[n % 4], width * (n + 0.5) / 6, height * 0.49, 0,
        width / 6 - 0.009, height * 0.98, 0.082, true);
    }
    for (const y of [height * 0.23, height * 0.73]) {
      box(hinge, timber, width / 2, y, 0.063, width * 0.96, 0.084, 0.059);
    }
    mesh(hinge, new THREE.TorusGeometry(0.053, 0.014, 7, 13), metal, width * 0.81, height * 0.49, 0.081);
    return { frame, hinge };
  }

  const rear = side ? null : framedDoor(-4.25, 2.10, -0.86, 1.86, 1.14);
  const exit = framedDoor(2.42, 2.14, -0.85, side ? 1.56 : 1.91, 1.24);
  for (const dir of [-1, 1]) {
    box(exit.frame, fadedWall, dir * 1.12, 0.59, 0, 0.78, 1.18, 0.27, true);
    box(exit.frame, baseM, dir * 1.12, 1.19, 0, 0.82, 0.10, 0.29);
  }
  const basket = groupAt(world, -2.54, 0.045, 2.31);
  const wicker = material(0xb5894f, woven);
  mesh(basket, new THREE.CylinderGeometry(0.34, 0.275, 0.36, 14, 1, true), wicker, 0, 0.22, 0, true);
  mesh(basket, new THREE.CylinderGeometry(0.27, 0.26, 0.045, 14), timber, 0, 0.065, 0);
  for (let n = 0; n < 4; n += 1) {
    const loop = mesh(basket, new THREE.TorusGeometry(0.279 + n * 0.019, 0.016, 6, 16),
      boards[n % 4], 0, 0.12 + n * 0.082, 0);
    loop.rotation.x = Math.PI / 2;
  }
  const basketArm = mesh(basket, new THREE.TorusGeometry(0.236, 0.023, 6, 15, Math.PI),
    wicker, 0, 0.39, 0, true);
  basketArm.rotation.y = 0.38;

  const cart = groupAt(world, 0.04, 0.028, 2.38);
  box(cart, timber, 0, 0.60, 0, 1.48, 0.14, 0.75, true);
  for (let n = 0; n < 4; n += 1) box(cart, boards[n], 0, 0.68, -0.27 + n * 0.18, 1.45, 0.056, 0.169);
  box(cart, boards[0], 0.11, 0.41, 0, 0.12, 0.11, 1.08);
  const wheels = [];
  for (const z of [-0.44, 0.44]) {
    const wheel = groupAt(cart, 0.10, 0.39, z);
    wheels.push(wheel);
    mesh(wheel, new THREE.TorusGeometry(0.34, 0.054, 8, 20), timber, 0, 0, 0, true);
    round(wheel, metal, [0.091, 0.091, 0.073], 0, 0, 0);
    for (let n = 0; n < 5; n += 1) {
      box(wheel, boards[n % 4], 0, 0, 0, 0.047, 0.66, 0.042).rotation.z = n * Math.PI / 5;
    }
  }
  for (const z of [-0.27, 0.27]) box(cart, boards[1], -1.00, 0.52, z, 1.04, 0.081, 0.078);

  const adult = makeFigures({ world, material, cloth, mesh, box, round, groupAt });
  const ran = side ? null : adult(1.10, 0x6a735a, 0x817254, 'ran');
  const boy = adult(0.70, 0x566859, 0x806d54, 'boy');
  const mother = adult(1.13, 0x815447, 0x574a3f, 'mother');

  const stations = side
    ? [[-3.96, 2.93], [-1.91, 2.47], [0.81, 2.22], [4.12, 2.55]]
    : [[-3.75, 2.66], [-1.73, 2.45], [0.78, 2.47], [4.12, 2.52]];
  const roadProps = [basket, cart, exit.frame];
  let stageAt = 0;
  let latestStage = 0;
  let entranceAt = 0;
  let priorEntrance = '';
  function walk(person, start, end, amount, time, yaw, gaze, relax) {
    const { model, head, arms, feet } = person;
    const walking = amount > 0 && amount < 0.996;
    const gait = walking ? Math.sin(time * 0.030) : 0;
    model.position.set(THREE.MathUtils.lerp(start[0], end[0], amount), Math.abs(gait) * 0.035,
      THREE.MathUtils.lerp(start[1], end[1], amount));
    model.rotation.y = yaw;
    model.rotation.z = relax * 0.041;
    head.rotation.y = gaze;
    head.rotation.x = relax * 0.16;
    for (let i = 0; i < 2; i += 1) {
      const stride = gait * (i === 0 ? 1 : -1);
      feet[i].rotation.x = stride * 0.49;
      arms[i].rotation.x = -stride * 0.24;
      arms[i].rotation.z = (i === 0 ? -1 : 1) * (0.27 - relax * 0.14);
    }
  }

  function frame(state, camera, marker, time, reduced, captionOffset) {
    if (state.stage !== latestStage) {
      stageAt = time;
      latestStage = state.stage;
    }
    const entranceBeat = side ? state.storyBeat : state.rearDoor;
    if (entranceBeat !== priorEntrance) {
      entranceAt = time;
      priorEntrance = entranceBeat;
    }
    const entrance = state.rearDoor === 'opening' && !reduced ? smooth(time - entranceAt, 65, 710)
      : Number(state.rearDoor === 'open' || state.rearDoor === 'opening');
    if (rear) {
      rear.hinge.rotation.y = -entrance * 1.53;
      walk(ran, [-4.0, 1.60], [-3.60, 1.16], entrance, time, -0.69 + entrance * 0.54, -0.54, 0);
      ran.arms[0].rotation.x = -1.04 * (state.rearDoor === 'opening' ? Math.sin(entrance * Math.PI) : 0);
    }

    const elapsed = reduced || !state.cue ? 2000 : time - stageAt;
    const cleared = roadProps.map((_, i) => i < state.stage - 1 ? 1
      : i === state.stage - 1 ? smooth(elapsed, 75, i === 2 ? 520 : 438) : 0);
    basket.position.set(-2.54 - cleared[0] * 0.41, 0.045, 2.31 - cleared[0] * 1.21);
    basket.rotation.y = cleared[0] * 0.45;
    cart.position.z = 2.38 - cleared[1] * 1.24;
    cart.rotation.y = -cleared[1] * 0.92;
    wheels.forEach(wheel => { wheel.rotation.z = -cleared[1] * 2.85; });
    exit.hinge.rotation.y = -cleared[2] * 1.42 - (state.stage === 2 && state.gateHits === 1 ? 0.22 : 0);

    const pointing = side && state.storyBeat === 'recognize';
    const recognizing = pointing ? reduced ? 1 : smooth(time - entranceAt, 80, 650) : 0;
    const entering = Boolean(rear) && state.stage === 0 && state.rearDoor !== 'open';
    const from = entering ? [-4.99, 2.27] : stations[Math.max(0, state.stage - 1)];
    const to = stations[state.stage];
    const entryTime = state.rearDoor === 'opening' ? reduced ? 2000 : time - entranceAt : 0;
    const childMove = entering ? smooth(entryTime, 480, 1140)
      : smooth(elapsed, 315, state.stage === 3 ? 1010 : 910);
    const adultMove = entering ? smooth(entryTime, 640, 1390)
      : smooth(elapsed, 440, state.stage === 3 ? 1260 : 1120);
    const lookBack = state.stage === 3 && !state.assisted ? smooth(elapsed, 830, 1150) : 0;
    const motherRelief = state.stage === 3 && !state.assisted ? smooth(elapsed, 1070, 1370) : 0;
    const childYaw = 1.43 + lookBack * 1.82;
    walk(boy, from, to, childMove, time, childYaw, lookBack * 0.43, 0);
    walk(mother, [from[0] - 0.60, from[1] + 0.21], [to[0] - 0.59, to[1] + 0.22],
      adultMove, time + 45, 1.40 - motherRelief * 1.05, 0.04 + motherRelief * 0.23, motherRelief);
    boy.arms[0].rotation.x += lookBack * -0.88 - recognizing * 1.19;
    if (pointing) {
      boy.model.rotation.y -= recognizing * 0.24;
      boy.head.rotation.y = recognizing * 0.44;
      mother.head.rotation.y = recognizing * 0.32;
    }

    const cuePan = state.cue && !reduced ? Math.sin(Math.PI * smooth(elapsed, 0, 1400)) : 0;
    const way = state.stage > 0 ? state.stage - 2 : 0;
    camera.position.set(1.82 + cuePan * way * 0.49, 5.18, 13.46);
    camera.lookAt(-0.22 + cuePan * way * 0.49, 1.67 - captionOffset * 1.15, 1.01);
    camera.updateMatrixWorld();
    const marked = state.nextRoad ? state.stage : state.cue ? state.stage - 1 : -1;
    marker.hidden = !roadProps[marked] || (!state.nextRoad && state.stage === 3 && elapsed > 1050);
    if (!marker.hidden) {
      roadProps[marked].getWorldPosition(point);
      point.y += state.nextRoad ? [0.84, 0.96, 2.17][marked] : [0.34, 0.40, 0.97][marked];
      point.project(camera);
      marker.style.left = (point.x + 1) * 50 + '%';
      marker.style.top = (1 - point.y) * 50 + '%';
    }

    return !reduced && ((state.cue && elapsed < 1470)
      || (rear && state.rearDoor === 'opening' && time - entranceAt < 1430)
      || (pointing && time - entranceAt < 760));
  }

  return { world, frame };
}

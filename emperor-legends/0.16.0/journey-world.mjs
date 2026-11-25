import * as THREE from './vendor/three.module.min.js';
import { makeFigures } from './figure.mjs';

export function createSideLane({ box, shape, roof, art }) {
  const world = new THREE.Scene();
  const sky = 0xb59a78;
  world.background = new THREE.Color(sky);
  world.fog = new THREE.FogExp2(sky, 0.034);
  const sun = new THREE.DirectionalLight(0xffdfab, 2.4);
  sun.position.set(-4, 6, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -7.5, right: 7.5, top: 6.2, bottom: -6.2, near: 0.1, far: 23 });
  sun.shadow.bias = -0.00035;
  sun.shadow.normalBias = 0.025;
  world.add(sun, new THREE.HemisphereLight(0xccd9ca, 0x645038, 1.65));
  box(world, 0, -0.24, 1.5, 48, 0.4, 42, 0x9c8668);
  const anchor = new THREE.Vector3();
  const cast = new THREE.Group();
  world.add(cast);

  function house(x, w, z, height, walls) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    world.add(group);
    box(group, 0, height / 2, 0, w, height, 2.1, walls).castShadow = true;
    box(group, 0, 0.16, 0.1, w + 0.12, 0.32, 2.25, 0x69685b);
    box(group, 0, height - 0.18, 1.08, w + 0.03, 0.12, 0.15, 0x564738);
    for (const at of [-w / 2 + 0.1, w / 2 - 0.1]) box(group, at, height / 2, 1.08, 0.12, height, 0.18, 0x514435);
    roof(group, w + 0.48, height + 0.02, 0, 2.8);
    return group;
  }

  function door(group, x, y, z, width, height, colors = [0x67503e, 0x745b46, 0x5e4b3c]) {
    for (let index = 0; index < 5; index += 1) {
      const plank = width / 5;
      box(group, x + (index - 2) * plank, y + height / 2, z, plank - 0.009, height, 0.11, colors[index % 3]);
    }
    for (const band of [0.23, 0.72]) box(group, x, y + height * band, z + 0.073, width, 0.09, 0.06, 0x493f35);
  }

  const potteryMesh = new THREE.LatheGeometry([
    [0, 0], [0.14, 0], [0.25, 0.18], [0.24, 0.34], [0.16, 0.43], [0.14, 0.46], [0.16, 0.49],
  ].map(([x, y]) => new THREE.Vector2(x, y)), 14);
  function jar(x, z, scale, color = 0x9c674b, y = 0) {
    const vessel = shape(world, potteryMesh, color, x, y, z);
    vessel.scale.setScalar(scale);
  }

  function wheel(group, x, y, z, size, width = 0.054) {
    shape(group, new THREE.TorusGeometry(size, width, 8, 18), 0x67523a, x, y, z);
    for (let index = 0; index < 4; index += 1) {
      box(group, x, y, z, width * 0.72, size * 1.94, width * 0.7, 0x645039).rotation.z = index * Math.PI / 4;
    }
  }

  function cart(group, size = 1) {
    box(group, 0, 0.56, 0, 1.56, 0.13, 0.90, 0x705841);
    box(group, 0, 0.72, -0.43, 1.52, 0.32, 0.13, 0x84684b);
    for (const at of [-0.49, 0.49]) wheel(group, 0.25, 0.37, at, 0.36);
    box(group, -0.99, 0.43, -0.24, 1.15, 0.105, 0.09, 0x705841);
    group.scale.setScalar(size);
  }

  const demo = [];
  let travel = 0;
  let roadStart = 0;
  let previousStage = 0;
  const stations = [-4.31, -1.82, 0.65, 3.8];
  const obstacleX = [-2.54, -0.07, 2.05];
  const first = house(-3.6, 3.2, -1.13, 2.48, 0xb49874);
  door(first, -0.28, 0.19, 1.11, 1.27, 1.83);
  const shop = house(-0.3, 3.1, -1.64, 2.77, 0xa08b71);
  box(shop, -0.13, 1.50, 1.083, 1.31, 0.89, 0.096, 0x514435);
  for (const x of [-0.72, -0.48, -0.24, 0, 0.24, 0.48]) {
    box(shop, x, 1.50, 1.135, 0.066, 0.85, 0.062, 0x745b46);
  }
  box(shop, -0.13, 1.04, 1.175, 1.45, 0.11, 0.20, 0x564738);
  const back = house(3.72, 3.72, -2.54, 2.56, 0xb09c7c);
  door(back, 0.15, 0.20, 1.11, 1.04, 1.72);
  box(world, 3.48, 0.053, -0.87, 1.72, 0.10, 0.47, 0x9d967b);
  const stall = new THREE.Group();
  stall.position.set(-1.13, 0.0, 0.98);
  world.add(stall);
  box(stall, 0, 0.41, 0, 1.17, 0.12, 0.54, 0x705841).castShadow = true;
  for (const x of [-0.44, 0.44]) box(stall, x, 0.20, 0, 0.11, 0.41, 0.41, 0x514435);
  jar(-1.47, 0.99, 0.57, 0xa67754, 0.47);
  jar(-0.94, 0.95, 0.49, 0x9b7962, 0.47);
  for (let i = 0; i < 4; i += 1) box(world, -1.45 + i * 0.48, 0.06 + 0.051 * i, 1.2, 0.56, 0.145, 0.78, 0x9d967b);
  jar(3.37, 0.73, 1.45);

  for (let index = 0; index < 12; index += 1) {
    const color = index % 3 === 0 ? 0xa59b7e : 0x988c73;
    box(world, index * 0.78 - 4.9, 0.015, 2.31 + 0.16 * Math.sin(index * 0.53), 0.74, 0.064, 1.2, color);
  }
  for (const x of obstacleX) {
    const object = new THREE.Group();
    demo.push(object);
    world.add(object);
    object.position.set(x, 0.038, 2.47);
  }
  const basket = demo[0];
  shape(basket, new THREE.CylinderGeometry(0.38, 0.28, 0.39, 12), 0x946740, 0, 0.21, 0);
  for (const y of [0.21, 0.37]) {
    const rim = shape(basket, new THREE.TorusGeometry(y > 0.3 ? 0.365 : 0.32, 0.026, 8, 15), 0xc1965d, 0, y, 0);
    rim.rotation.x = Math.PI / 2;
  }
  const handle = shape(basket, new THREE.TorusGeometry(0.259, 0.024, 7, 14, Math.PI), 0xc1965d, 0, 0.40, 0);
  handle.rotation.y = 0.28;
  cart(demo[1], 0.72);
  const hinge = demo[2];
  door(hinge, 0.625, 0.04, 0, 1.25, 1.62);
  for (const x of [-0.69, 0.70]) box(world, obstacleX[2] + x, 0.90, 2.47, 0.16, 1.82, 0.18, 0x675743);
  box(world, obstacleX[2], 1.82, 2.47, 1.65, 0.13, 0.21, 0x675743);

  const figure = makeFigures({ ...art, world: cast });
  const family = [figure(0.80, 0x515f55, 0x74654e, 'boy'), figure(1.15, 0x786050, 0x5e4841, 'mother')];

  function frame(state, camera, marker, time, reduced, captionOffset) {
    if (state.stage !== previousStage) {
      previousStage = state.stage;
      roadStart = time;
    }
    if (state.stage === 0) travel = 0;
    else if (!state.cue || reduced || time - roadStart >= 120) {
      travel = reduced ? state.stage : THREE.MathUtils.lerp(travel, state.stage, 0.16);
    }
    const clearance = demo.map((_, index) => THREE.MathUtils.clamp((travel - index) * 1.55, 0, 1));
    demo[0].position.z = 2.47 - clearance[0] * 1.25;
    demo[0].position.x = obstacleX[0] - clearance[0] * 0.35;
    demo[1].position.z = 2.47 - clearance[1] * 1.55;
    demo[1].rotation.y = clearance[1] * 0.93;
    demo[2].position.x = obstacleX[2] - 0.625;
    demo[2].rotation.y = clearance[2] * -1.45;
    const segment = Math.min(2, Math.floor(travel));
    const moving = THREE.MathUtils.clamp((travel - segment - 0.18) / 0.82, 0, 1);
    const x = THREE.MathUtils.lerp(stations[segment], stations[segment + 1], moving);
    family.forEach(({ model, feet }, index) => {
      const gait = !reduced && moving > 0 && moving < 0.985 ? Math.sin(time * 0.026 + index) : 0;
      model.position.set(x - index * 0.64, Math.abs(gait) * 0.05 + 0.041, 2.47 + index * 0.23);
      model.rotation.y = 1.28;
      feet[0].position.z = 0.02 + gait * 0.10;
      feet[1].position.z = 0.02 - gait * 0.10;
    });
    camera.position.set(1.84, 4.8, 13.5);
    camera.lookAt(-0.27, 1.66 - captionOffset * 1.11, 0.75);
    camera.updateMatrixWorld();
    const marked = state.nextRoad ? state.stage : state.cue ? state.stage - 1 : -1;
    marker.hidden = !demo[marked];
    if (!marker.hidden) {
      demo[marked].getWorldPosition(anchor);
      anchor.y += state.nextRoad ? [0.82, 0.96, 2.03][marked] : 0.50;
      if (marked === 2) anchor.x += 0.52;
      anchor.project(camera);
      marker.style.left = (anchor.x + 1) * 50 + '%';
      marker.style.top = (1 - anchor.y) * 50 + '%';
    }
  }

  return { world, frame };
}

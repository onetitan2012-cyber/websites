import * as THREE from './vendor/three.module.min.js';
import { createSideLane } from './journey-world.mjs';
import { createRoadWorld } from './rear-world.mjs';
import { createStoneWorld } from './stone-world.mjs';
import { createBirthWorld } from './birth-world.mjs';
import { createQinWorld } from './qin-world.mjs';
import { createKingWorld } from './king-world.mjs';
import { createCrownWorld } from './crown-world.mjs';
import { createPetitionWorld } from './petition-world.mjs';
import { createHandoverWorld } from './handover-world.mjs';
import { createReturnWorld } from './return-world.mjs';
import { createFriendWorld } from './old-friend-world.mjs';
import { createDaliangWorld } from './daliang-world.mjs';
import {createLettersWorld} from './letters-world.mjs';
import { createCanalWorld } from './canal-world.mjs';
import { createChuWorld } from './chu-world.mjs';
import { createZhaoWorld } from './zhao-world.mjs';
import { createYanWorld } from './yan-world.mjs';
import { createQiWorld } from './qi-world.mjs';
import { createEmperorWorld } from './emperor-world.mjs';
import { makeCrownArt } from './crown-art.mjs';
import { makeFigures } from './figure.mjs';
import { addCopperLamp, addTileCourses } from './scene-art.mjs';

const palette = {
  ground: 0x545a4f, slab: 0x6c7061, wall: 0x7d7964, wood: 0x362f26,
  roof: 0x334341, tile: 0x485955, bronze: 0x9f7550,
};

export function mountCourtyard(element) {
  const canvas = element.querySelector('canvas');
  const marker = element.querySelector('#scene-focus');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch {
    element.dataset.fallback = '';
    return { show() {} };
  }

  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.38;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x15282a);
  scene.fog = new THREE.FogExp2(0x172b2d, 0.034);
  const camera = new THREE.OrthographicCamera();
  const ambient = new THREE.HemisphereLight(0x9dbdc6, 0x392726, 1.72);
  const moonlight = new THREE.DirectionalLight(0xb2d5dd, 1.35);
  moonlight.position.set(-5, 9, 3);
  const bounce = new THREE.PointLight(0xffb675, 45, 12, 2);
  bounce.position.set(0.9, 2.2, 4);
  scene.add(ambient, moonlight, bounce);
  moonlight.castShadow = true;
  moonlight.shadow.mapSize.set(1024, 1024);
  Object.assign(moonlight.shadow.camera, { left: -7, right: 7, top: 5.4, bottom: -5.4, near: 0.1, far: 26 });
  moonlight.shadow.bias = -0.0004;
  moonlight.shadow.normalBias = 0.022;

  const art = makeCrownArt();
  const mats = new Map();
  const woods = new Set([palette.wood, 0x4a4032, 0x534238, 0x5e4a3c, 0x624e3e, 0x705d43,
    0x756249, 0x856348, 0x755941, 0x947154, 0x6f533a, 0x67503e, 0x745b46, 0x5e4b3c, 0x493f35]);
  function surface(color, map = null) {
    const key = map ? color + ':' + map.id : color;
    if (!mats.has(key)) mats.set(key, art.material(color, map, 0.86));
    return mats.get(key);
  }

  const cube = new THREE.BoxGeometry();
  function box(group, x, y, z, w, h, d, color) {
    const mesh = new THREE.Mesh(cube, surface(color, woods.has(color) ? art.wood : art.earth));
    mesh.position.set(x, y, z);
    mesh.scale.set(w, h, d);
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }

  function branch(group, from, to, width, color, taper = 0.64) {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const direction = b.clone().sub(a);
    const geometry = new THREE.CylinderGeometry(width * taper, width, direction.length(), 7);
    const mesh = new THREE.Mesh(geometry, surface(color));
    mesh.position.copy(a.addScaledVector(direction, 0.5));
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    group.add(mesh);
    return mesh;
  }

  function shape(group, geometry, color, x, y, z) {
    const mesh = new THREE.Mesh(geometry, surface(color));
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  }

  let randomState = 38;
  function random() {
    randomState = (Math.imul(1664525, randomState) + 1013904223) >>> 0;
    return randomState / 4294967296;
  }

  function roof(group, width, base, z, depth) {
    const ridge = base + 0.92;
    const half = depth / 2;
    for (const side of [-1, 1]) {
      const angle = Math.atan2(ridge - base, half) * side;
      const plane = box(group, 0, (base + ridge) / 2, z + half * side / 2,
        width, 0.14, Math.hypot(half, ridge - base), palette.roof);
      plane.rotation.x = angle;
      box(group, 0, base - 0.04, z + half * side, width + 0.1, 0.15, 0.17, palette.wood);
    }
    addTileCourses(group, { width, run: half, rise: ridge - base, eave: base + 0.02, z, spacing: 0.23 });
    branch(group, [-width / 2, ridge + 0.13, z], [width / 2, ridge + 0.13, z], 0.11, palette.tile, 1);
  }

  box(scene, 0, -0.21, 0, 48, 0.36, 40, palette.ground);
  const wall = new THREE.Group();
  scene.add(wall);
  box(wall, 0, 0.18, -0.25, 8.6, 0.33, 3.28, 0x666858);
  box(wall, 0, 1.92, -1.62, 8.3, 3.27, 1.14, 0x646050);
  box(wall, -3.52, 1.93, 0.29, 1.38, 3.18, 1.9, palette.wall);
  box(wall, 0.91, 1.94, 0.29, 4.49, 3.17, 1.9, palette.wall);
  box(wall, 3.66, 1.94, 0.29, 0.98, 3.17, 1.9, 0x6a6b59);
  for (const x of [-4.15, -2.71, -1.28, 1.36, 4.13]) {
    box(wall, x, 1.95, 1.29, 0.19, 3.25, 0.24, palette.wood);
    box(wall, x, 0.47, 1.32, 0.31, 0.28, 0.31, 0x6e7066);
  }
  box(wall, 0, 3.4, 1.3, 8.49, 0.21, 0.24, palette.wood);
  box(wall, 0, 0.40, 1.29, 8.13, 0.083, 0.067, 0x756249);
  for (let x = -4.07; x < 4.1; x += 0.36) {
    box(wall, x, 3.46, 1.56, 0.13, 0.17, 0.26, 0x4a4032);
  }
  roof(wall, 9.0, 3.56, -0.27, 4.14);

  const door = new THREE.Group();
  door.position.set(-2.66, 0.36, 1.31);
  wall.add(door);
  for (let i = 0; i < 7; i += 1) {
    box(door, 0.097 + i * 0.19, 1.22, 0, 0.179, 2.44, 0.12,
      [0x534238, 0x5e4a3c, 0x624e3e][i % 3]);
  }
  box(door, 0.665, 0.53, 0.08, 1.35, 0.115, 0.10, palette.wood);
  box(door, 0.665, 1.98, 0.08, 1.35, 0.115, 0.10, palette.wood);
  const latch = new THREE.Group();
  latch.position.set(0.8, 1.24, 0.14);
  door.add(latch);
  box(latch, 0.22, 0, 0, 0.85, 0.124, 0.118, palette.bronze);
  box(wall, -1.23, 1.6, 1.44, 0.25, 0.19, 0.13, 0x705d43);
  const doorGlow = new THREE.MeshBasicMaterial({ color: 0xe1a370, transparent: true, depthWrite: false });
  const doorGap = new THREE.Mesh(new THREE.PlaneGeometry(0.205, 2.4), doorGlow);
  doorGap.position.set(-1.47, 1.61, 1.268);
  wall.add(doorGap);
  shape(door, new THREE.TorusGeometry(0.066, 0.017, 7, 12), palette.bronze, 1.09, 0.98, 0.094);
  box(wall, -1.985, 2.9, 1.29, 1.56, 0.23, 0.24, palette.wood);

  const hotWindow = new THREE.Color(0xffd19a);
  const windowLight = new THREE.MeshBasicMaterial({ color: hotWindow });
  const window = new THREE.Mesh(new THREE.PlaneGeometry(1.67, 1.12), windowLight);
  window.position.set(2.25, 2.02, 1.257);
  wall.add(window);
  for (const y of [1.42, 1.79, 2.19, 2.61]) box(wall, 2.25, y, 1.292, 1.85, 0.066, 0.13, palette.wood);
  for (const x of [1.39, 1.72, 2.06, 2.4, 2.75, 3.1]) box(wall, x, 2.01, 1.3, 0.057, 1.19, 0.12, palette.wood);
  box(wall, 2.25, 1.39, 1.36, 1.9, 0.105, 0.25, 0x756249);
  const windowBounce = new THREE.PointLight(0xffac5f, 16, 5.5, 2);
  windowBounce.position.set(2.22, 1.9, 1.75);
  scene.add(windowBounce);

  for (let row = 0; row < 7; row += 1) {
    for (let column = 0; column < 12; column += 1) {
      if (row > 3 && random() < 0.2) continue;
      const color = [0x6b7064, 0x777866, 0x61675c, 0x6b6f60][Math.floor(random() * 4)];
      const x = (column - 5.5) * 0.72 + (row % 2) * 0.29;
      const slab = box(scene, x, 0.012, 1.76 + row * 0.58, 0.7, 0.055, 0.553, color);
      slab.rotation.y = (random() - 0.5) * 0.031;
    }
  }

  const windowSpill = new THREE.Shape();
  windowSpill.moveTo(1.55, -1.48);
  windowSpill.lineTo(3.04, -1.48);
  windowSpill.lineTo(3.60, -3.88);
  windowSpill.lineTo(1.0, -3.88);
  windowSpill.closePath();
  const spillMaterial = new THREE.MeshBasicMaterial({
    color: 0xeb9f61, transparent: true, opacity: 0.22, depthWrite: false,
  });
  const spill = new THREE.Mesh(new THREE.ShapeGeometry(windowSpill), spillMaterial);
  spill.rotation.x = -Math.PI / 2;
  spill.position.y = 0.049;
  scene.add(spill);

  const crate = new THREE.Group();
  scene.add(crate);
  for (let row = 0; row < 4; row += 1) {
    box(crate, 0, 0.095 + row * 0.124, 0, 0.86, 0.119, 0.57, row % 2 ? 0x856348 : 0x755941);
  }
  box(crate, 0, 0.57, 0, 0.91, 0.065, 0.63, 0x947154);
  for (const x of [-0.35, 0.35]) box(crate, x, 0.28, 0.295, 0.1, 0.5, 0.055, palette.wood);
  for (const x of [-0.35, 0.35]) for (const y of [0.12, 0.46]) {
    shape(crate, new THREE.SphereGeometry(0.022, 8, 7), 0x735c43, x, y, 0.329);
  }

  const table = new THREE.Group();
  table.position.set(1.37, 0, 2.51);
  scene.add(table);
  box(table, 0, 0.61, 0, 1.42, 0.14, 0.88, 0x6f533a);
  for (const x of [-0.57, 0.57]) for (const z of [-0.33, 0.33]) {
    box(table, x, 0.28, z, 0.105, 0.57, 0.12, palette.wood);
  }
  const flame = addCopperLamp(table, 0.12, 0.68, 0, 0.98);
  const lampCenter = new THREE.Vector3(0.12, 1.097, 0);
  const lamp = new THREE.PointLight(0xffa157, 13, 5.5, 2);
  lamp.position.copy(lampCenter);
  table.add(lamp);
  const shade = shape(table, new THREE.CylinderGeometry(0.14, 0.24, 0.27, 10, 1, true),
    0x976041, 0.12, 1.31, 0);
  shade.material = new THREE.MeshStandardMaterial({ color: 0xae7049, side: THREE.DoubleSide });

  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = glowCanvas.height = 64;
  const paint = glowCanvas.getContext('2d');
  const radial = paint.createRadialGradient(32, 32, 0, 32, 32, 32);
  radial.addColorStop(0, 'rgba(255,187,96,.84)');
  radial.addColorStop(0.22, 'rgba(255,149,55,.3)');
  radial.addColorStop(1, 'rgba(255,125,40,0)');
  paint.fillStyle = radial;
  paint.fillRect(0, 0, 64, 64);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(glowCanvas), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  halo.position.copy(lampCenter);
  halo.scale.setScalar(1.63);
  table.add(halo);

  const jar = new THREE.LatheGeometry([
    [0, 0], [0.19, 0], [0.32, 0.13], [0.35, 0.32], [0.28, 0.48], [0.16, 0.54], [0.16, 0.62], [0.18, 0.64],
  ].map(([x, y]) => new THREE.Vector2(x, y)), 15);
  shape(scene, jar, 0x887462, 3.26, 0.045, 1.89);
  const smallJar = shape(scene, jar, 0x6e6a55, 3.76, 0.04, 2.16);
  smallJar.scale.setScalar(0.69);
  box(scene, 0.9, 0.698, 2.6, 0.36, 0.055, 0.32, 0xb49a6b);

  const distant = new THREE.Group();
  distant.position.set(-6.4, -0.35, -6.8);
  distant.rotation.y = -0.23;
  scene.add(distant);
  box(distant, 0, 1.3, 0, 5.2, 3.1, 3, 0x424a42);
  roof(distant, 5.7, 2.88, 0, 3.72);
  box(scene, 6.4, 1.46, -3.7, 7.9, 3.26, 0.55, 0x4d5b51);
  box(scene, 6.4, 3.12, -3.7, 7.95, 0.15, 0.71, 0x394a47);
  const tree = new THREE.Group();
  tree.position.set(4.35, 0, -2.7);
  scene.add(tree);
  branch(tree, [0, 0, 0], [-0.23, 3.18, 0.05], 0.22, 0x323f32);
  branch(tree, [-0.23, 2.2, 0.035], [0.55, 3.77, -0.2], 0.12, 0x374738);
  branch(tree, [-0.24, 2.7, 0], [-1.22, 4.12, -0.52], 0.13, 0x374437);
  const leaves = new THREE.IcosahedronGeometry(1, 1);
  for (let i = 0; i < 28; i += 1) {
    const mesh = shape(tree, leaves, i % 2 ? 0x3d5042 : 0x485849,
      (random() - 0.5) * 3.75, 3.55 + random() * 1.52, (random() - 0.5) * 2.3);
    mesh.scale.set(0.63 + random() * 0.61, 0.32 + random() * 0.49, 0.55 + random() * 0.69);
    mesh.rotation.y = random() * Math.PI;
  }

  const patrolFigure = makeFigures({ ...art, world: scene });
  const { model: guard, feet, arms } = patrolFigure(1.10, 0x35484a, 0x5a5450, 'father');
  arms[0].rotation.set(-0.34, 0, -0.38);
  const lantern = new THREE.Group();
  lantern.position.set(0, -0.475, 0.022);
  arms[0].add(lantern);
  const lanternBody = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.29, 0.16),
    new THREE.MeshBasicMaterial({ color: 0xffb970 }));
  lantern.add(lanternBody);
  for (const y of [-0.15, 0.15]) box(lantern, 0, y, 0, 0.22, 0.04, 0.19, palette.bronze);
  for (const x of [-0.092, 0.092]) for (const z of [-0.074, 0.074]) {
    box(lantern, x, 0, z, 0.021, 0.30, 0.019, palette.wood);
  }
  const glow = new THREE.Sprite(halo.material.clone());
  glow.scale.setScalar(0.93);
  lantern.add(glow);
  const streetLight = new THREE.PointLight(0xff995f, 7.7, 3.4, 2);
  lantern.add(streetLight);
  guard.visible = false;

  const chapterWorlds = new Map();
  let chapterView = null;
  let chapterState = null;
  let chapterNeedsDraw = true;
  let stage = 0;
  let mode = 'opening';
  let route = '';
  let cue = false;
  let cueStart = 0;
  let patrol = '';
  let patrolStart = 0;
  let lit = 1;
  let shadeDown = 0;
  let crateShift = 0;
  let doorLock = 0;
  let blend = 0;
  let focusX = 0;
  let frameId;
  let lastFrame;
  let captionOffset = 0;
  const markerPosition = new THREE.Vector3();
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const approach = (value, target, rate = 0.14) => motion.matches ? target : THREE.MathUtils.lerp(value, target, rate);

  function size() {
    const width = element.clientWidth;
    const height = element.clientHeight;
    if (!width || !height) return;
    const aspect = width / height;
    captionOffset = aspect > 1.85 ? 0.87 : 0;
    const view = Math.max(5.65, (chapterView ? 11.65 : 9.35) / aspect);
    camera.left = -view * aspect / 2;
    camera.right = view * aspect / 2;
    camera.top = view / 2;
    camera.bottom = -view / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    chapterNeedsDraw = true;
  }

  function draw(time) {
    if (!document.hidden) frameId = requestAnimationFrame(draw);
    if (lastFrame !== undefined && time - lastFrame < 30) return;
    lastFrame = time;
    if (chapterView) {
      if (!chapterNeedsDraw) return;
      if (!chapterView.controlsCameraZoom && camera.zoom !== 1) {
        camera.zoom = 1;
        camera.updateProjectionMatrix();
      }
      chapterNeedsDraw = chapterView.frame(chapterState, camera, marker, time, motion.matches, captionOffset) !== false;
      renderer.render(chapterView.world, camera);
      return;
    }
    const actionReady = motion.matches || !cue || time - cueStart >= 190;
    blend = approach(blend, mode === 'opening' ? 0 : 1);
    crateShift = approach(crateShift, stage > 3 || (stage === 3 && actionReady) ? 1 : 0);
    shadeDown = approach(shadeDown, stage > 6 || (stage === 6 && actionReady) ? 1 : 0, 0.19);
    const lightTarget = shadeDown > 0.23 ? 1 - shadeDown * 0.91 : mode === 'travel' && route === 'wait' ? 0.42 : 1;
    lit = approach(lit, lightTarget, 0.25);
    doorLock = approach(doorLock, stage === 8 && actionReady ? 1 : 0, 0.21);
    crate.position.set(-2.08 - crateShift * 1.64, 0.045, 2.07 - crateShift * 0.13);
    crate.rotation.y = -0.13 - crateShift * 0.13;
    latch.rotation.z = (1 - doorLock) * 1.44;
    door.rotation.y = -0.15 * (1 - doorLock);
    doorGlow.opacity = Math.min(1, lit * 0.65 + 0.30) * (1 - doorLock);
    shade.position.y = 1.40 - shadeDown * 0.32;
    flame.scale.set(0.034, (motion.matches ? 0.078 : 0.078 + Math.sin(time * 0.011) * 0.013) * lit, 0.031);
    lamp.intensity = (13 + (motion.matches ? 0 : Math.sin(time * 0.006) * 0.7)) * lit;
    halo.material.opacity = lit * 0.95;
    windowLight.color.set(0x201e1a).lerp(hotWindow, Math.pow(lit, 1.42));
    windowBounce.intensity = lit * 13.5;
    spillMaterial.opacity = lit * 0.27;
    bounce.intensity = 2 + lit * 40;

    const patrolAge = motion.matches ? 2000 : time - patrolStart;
    const arriving = patrol === 'approach';
    const travel = arriving
      ? THREE.MathUtils.smoothstep(patrolAge, 365, 820)
      : 1 - THREE.MathUtils.smoothstep(patrolAge, 430, 1600);
    guard.visible = Boolean(patrol) && travel > 0.035;
    if (guard.visible) {
      const gait = Math.sin(time * 0.018) * (travel < 0.98 ? 1 : 0);
      guard.position.set(-6.05 + 4.60 * travel, Math.abs(gait) * 0.065, 3.05 - travel * 0.44);
      guard.rotation.y = arriving ? 0.55 + travel * 1.60 : -1.09;
      feet[0].rotation.x = gait * 0.46;
      feet[1].rotation.x = -gait * 0.46;
      lantern.rotation.z = gait * 0.16;
    }

    const guide = cue ? stage === 3 ? -0.88 : stage === 6 ? 1.04 : -0.68 : 0;
    focusX = approach(focusX, guide);
    const zoom = approach(camera.zoom, cue ? 1.10 : 1);
    if (Math.abs(zoom - camera.zoom) > 0.001) {
      camera.zoom = zoom;
      camera.updateProjectionMatrix();
    }
    camera.position.set(7.0 - blend * 1.8 + focusX, 4.7 - blend * 0.54, 12.2);
    camera.lookAt(0.05 + focusX, 1.95 - blend * 0.16 - captionOffset, 0.7);
    camera.updateMatrixWorld();
    if (cue) {
      const object = stage === 3 ? crate : stage === 6 ? shade : latch;
      object.getWorldPosition(markerPosition);
      if (stage === 3) markerPosition.y += 0.28;
      markerPosition.project(camera);
      marker.style.left = (markerPosition.x + 1) * 50 + '%';
      marker.style.top = (1 - markerPosition.y) * 50 + '%';
    }
    renderer.render(scene, camera);
  }

  const resize = new ResizeObserver(size);
  resize.observe(element);
  size();
  frameId = requestAnimationFrame(draw);
  motion.addEventListener('change', () => { chapterNeedsDraw = true; });
  document.addEventListener('visibilitychange', () => {
    chapterNeedsDraw = true;
    cancelAnimationFrame(frameId);
    if (!document.hidden) frameId = requestAnimationFrame(draw);
  });

  return { show(update) {
    const chapter = ['birth', 'pottery', 'lane', 'west', 'qin', 'court', 'crown', 'petition', 'handover', 'return', 'friend', 'flood', 'chu', 'yan', 'qinDesk', 'qiDesk', 'canal', 'zhao', 'qi', 'emperor'].includes(update.mode);
    const previousView = chapterView;
    if (chapter) {
      const key = update.mode + ':' + (update.mode === 'lane' ? update.path ?? 'junction' : '');
      if (!chapterWorlds.has(key)) {
        if (update.mode === 'qiDesk' || update.mode === 'qinDesk') {
          chapterWorlds.set(key, createLettersWorld(update.mode === 'qinDesk'));
        } else if (update.mode === 'canal') {
          chapterWorlds.set(key, createCanalWorld());
        } else if (update.mode === 'zhao') {
          chapterWorlds.set(key, createZhaoWorld());
        } else if (update.mode === 'birth') {
          chapterWorlds.set(key, createBirthWorld());
        } else if (update.mode === 'qin') {
          chapterWorlds.set(key, createQinWorld());
        } else if (update.mode === 'court') {
          chapterWorlds.set(key, createKingWorld());
        } else if (update.mode === 'crown') {
          chapterWorlds.set(key, createCrownWorld());
        } else if (update.mode === 'petition') {
          chapterWorlds.set(key, createPetitionWorld());
        } else if (update.mode === 'handover') {
          chapterWorlds.set(key, createHandoverWorld());
        } else if (update.mode === 'return') {
          chapterWorlds.set(key, createReturnWorld());
        } else if (update.mode === 'friend') {
          chapterWorlds.set(key, createFriendWorld());
        } else if (update.mode === 'flood') {
          chapterWorlds.set(key, createDaliangWorld());
        } else if (update.mode === 'chu') {
          chapterWorlds.set(key, createChuWorld());
        } else if (update.mode === 'yan') {
          chapterWorlds.set(key, createYanWorld());
        } else if (update.mode === 'qi') {
          chapterWorlds.set(key, createQiWorld());
        } else if (update.mode === 'emperor') {
          chapterWorlds.set(key, createEmperorWorld());
        } else if (update.mode === 'pottery' || update.mode === 'west') {
          chapterWorlds.set(key, createStoneWorld(update.mode));
        } else {
          chapterWorlds.set(key, update.path ? createRoadWorld(update.path)
            : createSideLane({ box, shape, roof, art }));
        }
      }
      chapterView = chapterWorlds.get(key);
      chapterState = update;
      chapterNeedsDraw = true;
    } else {
      chapterView = null;
    }
    if (previousView !== chapterView) size();
    if (update.cue && (!cue || stage !== update.stage)) cueStart = performance.now();
    if (patrol !== update.patrol) patrolStart = performance.now();
    ({ stage, mode, route, cue, patrol } = update);
    marker.hidden = !cue;
    canvas.dataset.stage = stage;
  } };
}

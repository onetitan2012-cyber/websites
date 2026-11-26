import * as THREE from './vendor/three.module.min.js';
import { FLOOD_START, FLOOD_THRESHOLDS } from './board.mjs';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';
import { addCopperLamp, addInkRows, addTileCourses } from './scene-art.mjs';

const { lerp, smoothstep } = THREE.MathUtils;
const surfaceHeight = level => 0.21 + 0.067 * level;

export function createDaliangWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0x75878b);
  const art = makeCrownArt();
  const { box, material, groupAt, wood, earth, cloth, matTexture } = art;
  const wetEarth = material(0x777065, earth);
  const plaster = material(0xab9a81, earth);
  const wetWall = material(0x827b69, earth);
  const slate = material(0x53666d);
  const beam = material(0x4e4140, wood);
  const timber = material(0x795649, wood);
  const bamboo = material(0xc2a67d, wood);
  const ink = material(0x4d4237);
  const rope = material(0xb1946d, cloth);
  const reed = material(0xaa9f80, matTexture);
  const dryCloth = material(0xc3b18b, matTexture);
  const masonry = [0x979b83, 0x8e978d, 0xa4a28c].map(color => material(color, earth));

  const sun = new THREE.DirectionalLight(0xe3ece7, 2.05);
  sun.position.set(-4.36, 8.4, 5.1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -7.8, right: 7.8, top: 6.2, bottom: -6.2, near: 0.1, far: 29 });
  sun.shadow.normalBias = 0.028;
  const overcast = new THREE.DirectionalLight(0x9fbeca, 0.70);
  overcast.position.set(4.6, 5, -4.3);
  world.add(sun, overcast, new THREE.HemisphereLight(0xd7e0e0, 0x70645a, 1.61));

  box(world, wetEarth, 0, -0.19, 0.0, 14.85, 0.37, 10.8);
  for (let course = 0; course < 5; course += 1) {
    box(world, course % 2 ? plaster : wetWall, 0, 0.29 + course * 0.58, -4.15 - course * 0.035,
      14.9, 0.584, 1.38 - course * 0.15, true);
  }
  box(world, slate, 0, 2.96, -4.20, 14.94, 0.154, 0.814, true);

  for (let row = 0; row < 7; row += 1) for (let col = 0; col < 9; col += 1) {
    box(world, masonry[(col * 2 + row) % 3], -4.24 + col * 1.10 + (row % 2) * 0.23,
      0.016, -2.69 + row * 0.67, 1.08, 0.032, 0.63);
  }

  const houses = groupAt(world, -2.48, 0, -2.09);
  box(houses, wetWall, 0, 0.49, -0.16, 5.31, 0.98, 0.34, true);
  box(houses, plaster, 0, 1.90, -0.16, 5.31, 1.85, 0.34, true);
  box(houses, beam, 0, 2.50, 0.10, 5.53, 0.19, 0.37, true);
  for (const x of [-2.51, -0.97, 0.92, 2.52]) {
    box(houses, timber, x, 1.27, 0.08, 0.156, 2.56, 0.201, true);
  }
  box(houses, timber, -0.03, 1.12, 0.04, 1.54, 2.05, 0.13, true);
  for (const y of [0.48, 1.72]) box(houses, beam, -0.03, y, 0.147, 1.54, 0.084, 0.102, true);
  box(houses, beam, 0, 1.10, 0.130, 0.024, 2.06, 0.036);
  box(houses, beam, 1.75, 1.86, 0.038, 1.09, 0.91, 0.108);
  for (const x of [1.41, 1.64, 1.86, 2.10]) {
    box(houses, bamboo, x, 1.87, 0.111, 0.043, 0.80, 0.054).rotation.z = x === 1.86 ? -0.20 : 0;
  }
  const roof = box(houses, slate, -0.04, 2.80, -0.03, 5.75, 0.12, 1.74, true);
  roof.rotation.x = 0.24;
  addTileCourses(houses, { width: 5.74, run: 1.72, rise: 0.47, eave: 2.62, z: -0.87, back: false });
  box(houses, timber, 0.12, 0.351, 0.67, 4.81, 0.23, 1.08, true);

  const bank = groupAt(world, 4.36, 0, -0.30);
  box(bank, wetWall, 0, 0.79, 0, 2.79, 1.58, 3.24, true);
  for (let course = 0; course < 4; course += 1) {
    box(bank, masonry[course % 3], 0.01, 0.21 + course * 0.39, 1.65,
      2.79, 0.35, 0.139, true);
  }
  box(bank, masonry[0], 0.01, 1.622, 0.03, 2.90, 0.118, 3.34, true);
  for (const x of [-1.24, 1.25]) {
    box(bank, beam, x, 2.30, -1.15, 0.113, 1.36, 0.117, true);
    box(bank, beam, x, 2.29, -0.13, 0.094, 1.33, 0.108, true);
  }
  const awning = box(bank, dryCloth, 0, 2.97, -0.65, 2.65, 0.068, 1.46, true);
  awning.name = 'bank-awning';
  awning.rotation.x = 0.09;

  // The three wide treads correspond to the three visible waterline thresholds.
  FLOOD_THRESHOLDS.forEach((threshold, index) => {
    const top = surfaceHeight(threshold) + 0.034;
    const x = 1.87 - index * 0.69;
    if (index === 0) {
      // The street-facing corner is missing through the whole stone.
      box(world, masonry[0], x, top / 2, 0.43, 0.74, top, 0.79, true);
      box(world, masonry[0], x + 0.13, top / 2, 0.973, 0.48, top, 0.296, true);
      return;
    }
    box(world, masonry[index], x, top / 2, 0.58, 0.71, top, 1.03, true);
    const tread = box(world, masonry[0], x, top - 0.029, 0.58, 0.74, 0.055, 1.09, true);
    tread.name = 'flood-step-' + index;
  });
  for (const [x, top] of [[2.40, 1.01], [2.71, 1.25], [2.97, 1.46]]) {
    box(world, masonry[1], x, top / 2, 0.58, 0.35, top, 1.06, true);
  }

  const restMat = groupAt(bank, 0.41, 1.699, -0.45);
  box(restMat, reed, 0.03, 0.016, 0.02, 1.56, 0.035, 1.24);
  const dryMat = box(restMat, dryCloth, 0.01, 0.047, 0.02, 1.44, 0.022, 1.18);
  const bankDesk = groupAt(bank, 0.20, 1.69, 0.77);
  box(bankDesk, timber, 0, 0.36, 0, 1.24, 0.072, 0.61, true);
  for (const x of [-0.45, 0.45]) for (const z of [-0.23, 0.23]) {
    box(bankDesk, beam, x, 0.175, z, 0.077, 0.35, 0.09, true);
  }
  const register = groupAt(bankDesk, 0.03, 0.408, -0.20);
  for (let index = 0; index < 9; index += 1) {
    box(register, bamboo, (index - 4) * 0.062, 0, 0.153, 0.055, 0.025, 0.30);
  }
  addInkRows(groupAt(register, 0, 0.014, 0.154), box, ink, { width: 0.50, length: 0.25, y: 0, columns: 9 });
  const flame = addCopperLamp(bank, -0.65, 1.694, -0.89, 0.95);
  const glow = new THREE.PointLight(0xffc18b, 0, 3.7, 2);
  glow.position.set(3.8, 2.14, -1.189);
  world.add(glow);

  const raft = groupAt(world, -3.44, 0, 1.71);
  raft.name = 'evacuation-raft';
  for (let index = 0; index < 7; index += 1) {
    const x = (index - 3) * 0.225;
    box(raft, index % 2 ? beam : timber, x, 0.10, 0, 0.208, 0.156, 1.04 - (index % 2) * 0.095, true);
  }
  for (const z of [-0.31, 0.31]) box(raft, rope, 0, 0.193, z, 1.592, 0.032, 0.047);
  box(raft, reed, 0.21, 0.198, 0, 0.91, 0.046, 0.75);
  const family = groupAt(raft);
  const passenger = makeCrownFigure(family, art, 'resident', 0.94);
  passenger.model.position.set(0.02, 0, -0.16);
  passenger.rig.set(0.74, 0);
  const child = makeCrownFigure(family, art, 'li', 0.64);
  child.model.position.set(0.36, 0, 0.13);
  child.rig.set(0, 0);
  const guide = makeCrownFigure(raft, art, 'keeper', 0.98);
  guide.model.position.set(-0.47, 0.197, -0.08);
  guide.model.rotation.y = 0.66;
  guide.rig.set(0.21, 0);
  const bankNeighbor = makeCrownFigure(bank, art, 'elder', 1.02);
  bankNeighbor.model.position.set(-0.78, 1.684, 0.55);
  bankNeighbor.model.rotation.y = -0.94;
  bankNeighbor.rig.set(0, 0);

  const brother = makeCrownFigure(bank, art, 'guest', 0.98);
  brother.model.visible = false;
  const foldedCorner = box(restMat, dryCloth, -0.50, 0.096, 0.43, 0.41, 0.06, 0.26);
  foldedCorner.rotation.x = -0.27;

  const fragments = [[-4.62, 1.08], [-1.15, -0.41], [0.77, -0.87]].map(([x, z], index) => {
    const shard = box(world, index % 2 ? timber : beam, x, 0, z, index === 1 ? 0.71 : 0.47, 0.067, 0.114, true);
    shard.rotation.y = 0.28 + index * 0.53;
    return shard;
  });

  const ripples = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { clock: { value: 0 } },
    vertexShader: `
      varying vec2 point;
      void main() {
        point = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 point;
      uniform float clock;
      void main() {
        float flow = sin(point.x * 19. + clock * 1.2) * 2.4
                   + sin(point.x * 37. - clock) * 0.45;
        float broad = sin(point.y * 83. + flow - clock * 1.6) * .5 + .5;
        float glint = pow(max(0., sin(point.y * 137. + flow * 1.8 + clock * 2.1)), 13.);
        glint *= smoothstep(.36, .84, sin(point.x * 56. - point.y * 10.) * .5 + .5);
        vec3 color = mix(vec3(.29,.39,.38), vec3(.43,.55,.51), broad * .37);
        color += vec3(.19,.23,.19) * glint * .52;
        gl_FragColor = vec4(color, .86);
      }
    `,
  });
  const flood = new THREE.Mesh(new THREE.PlaneGeometry(13.15, 12.0), ripples);
  flood.name = 'flood-surface';
  flood.rotation.x = -Math.PI / 2;
  flood.position.z = 0.18;
  world.add(flood);

  let lastBeat;
  let lastWater = FLOOD_START;
  let fromWater = FLOOD_START;
  let lastDocked = false;
  let fromDocked = false;
  let started = 0;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    const { storyBeat: beat, waterLevel } = state;
    const onBank = ['ask', 'list', 'shelter'].includes(beat);
    const docked = (beat === 'cross' || onBank) && waterLevel <= FLOOD_THRESHOLDS.at(-1);
    if (beat !== lastBeat || waterLevel !== lastWater) {
      fromWater = lastWater;
      fromDocked = lastDocked;
      lastWater = waterLevel;
      lastDocked = docked;
      lastBeat = beat;
      started = time;
    }
    const age = reduced ? 1850 : time - started;
    const water = lerp(fromWater, waterLevel, smoothstep(age, 10, 675));
    const height = surfaceHeight(water);
    flood.position.y = height;
    ripples.uniforms.clock.value = reduced ? 0 : time / 1000;
    fragments.forEach((item, index) => {
      item.position.y = height + 0.037;
      item.rotation.x = 0.055 * Math.sin(age * 0.009 + index);
    });
    const approach = docked ? fromDocked ? 1 : smoothstep(age, 35, 1580) : 0;
    raft.position.set(lerp(-3.44, 0.85, approach), height - 0.038, lerp(1.73, 1.70, approach));
    raft.rotation.y = lerp(-0.055, 0.025, approach);
    // Cut from the approaching raft to the family already on the terrace
    // when the brother arrives. Do not slide seated actors up through steps.
    const landed = docked && onBank;
    const recognized = state.floodWitness !== 'unknown';
    const answering = recognized && !landed;
    const handsUp = answering && (state.floodHandsUp || beat === 'hold' || onBank);
    const familyParent = landed ? bank : raft;
    if (family.parent !== familyParent) familyParent.add(family);
    if (landed) family.position.set(0.36, 1.70, -0.27);
    else family.position.set(0.08, 0.225, 0.01);
    passenger.model.rotation.y = landed ? -0.38 : 0.86;
    passenger.arms[1].rotation.z = !landed && recognized ? 0.96 : 0.12;
    const sleeping = landed && beat === 'shelter';
    child.model.position.set(sleeping ? 0.28 : 0.36, sleeping ? 0.10 : 0, 0.13);
    child.model.rotation.set(0, landed ? -0.36 : 0.72, sleeping ? 1.43 : 0);
    child.head.rotation.x = sleeping ? 0.24 : 0;
    child.arms[1].rotation.set(-0.26, 0, handsUp ? 2.57 : answering ? 1.20 : 0.15);
    bankNeighbor.model.rotation.y = answering ? -0.68 : -0.92;
    bankNeighbor.model.position.x = answering && state.stage === 0 ? -0.68 : -0.83;
    bankNeighbor.arms[0].rotation.set(-0.24, 0, handsUp ? -2.50 : answering ? -1.24 : -0.18);
    brother.model.visible = onBank && !state.legacyFlood;
    brother.model.position.set(beat === 'shelter' ? -0.28 : 0.91, 1.70, beat === 'shelter' ? 0.15 : 1.10);
    brother.model.rotation.y = beat === 'shelter' ? (landed ? 2.25 : -1.26) : beat === 'list' && landed ? 2.74 : -1.12;
    if (beat !== brother.model.userData.pose) {
      brother.rig.set(beat === 'shelter' ? 0.92 : 0, 0);
      brother.model.userData.pose = beat;
    }
    brother.arms[0].rotation.x = beat === 'list' ? -0.97 : -0.31;
    bankDesk.visible = beat === 'list';
    const shelter = beat === 'shelter' ? smoothstep(age, 45, 615) : 0;
    dryMat.visible = shelter > 0.04;
    dryMat.scale.z = 1.18 * shelter;
    foldedCorner.visible = shelter > 0.75 && !landed && recognized;
    glow.intensity = 6.4 * shelter;
    flame.visible = shelter > 0.30;
    register.visible = beat === 'list';
    register.rotation.x = -1.17 * (1 - smoothstep(age, 50, 650));

    const focusX = onBank ? 4.05 : 0.20 + approach * 0.49;
    const focusY = onBank ? 2.05 : 1.40 - captionOffset * 0.24;
    camera.zoom = onBank ? 1.82 : 1.30;
    camera.updateProjectionMatrix();
    camera.position.set(focusX + 1.51, focusY + 7.64, 14.63);
    camera.lookAt(focusX, focusY, 0.12 + captionOffset * 0.30);
    camera.updateMatrixWorld();
    marker.hidden = true;
    return !reduced && age < (beat === 'cross' ? 1650 : 740);
  }

  return { world, frame, controlsCameraZoom: true };
}

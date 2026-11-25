import * as THREE from './vendor/three.module.min.js';
import { createYishui } from './yishui-world.mjs';
import { tributeMap, objectLeaf } from './friend-map.mjs';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';
import { addCopperLamp, addInkRows, addTileCourses } from './scene-art.mjs';

const { lerp, smoothstep } = THREE.MathUtils;

export function createFriendWorld() {
  const hall = new THREE.Scene();
  const lodge = new THREE.Scene();
  hall.background = new THREE.Color(0x506366);
  lodge.background = new THREE.Color(0x647984);
  const art = makeCrownArt();
  const { box, material, mesh, groupAt, earth, wood, cloth, matTexture, beamPattern, round } = art;
  const soil = material(0x807568, earth);
  const plaster = material(0xa5977e, earth);
  const stone = [0x7d817c, 0x8c887c, 0x867b71].map(color => material(color, earth));
  const oak = material(0x50433f, wood);
  const lacquer = material(0x76483e, wood, 0.61);
  const slate = material(0x566368);
  const reed = material(0xb9a787, matTexture);
  const bamboo = material(0xbfa780, wood);
  const bronze = material(0x916f43, null, 0.55, 0.28);
  const ink = material(0x514137);
  const curtain = [0x61777a, 0x88705c].map(color => material(color, cloth));
  const curtainEdge = [0x43565b, 0x664e44].map(color => material(color, cloth));
  const pebble = material(0x5d777b, null, 0.63);

  function lights(scene, night) {
    const sun = new THREE.DirectionalLight(night ? 0xd5e5ef : 0xe5e8e3, night ? 1.23 : 1.67);
    sun.castShadow = true;
    sun.position.set(-4.0, 7.25, 5.54);
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -7.4, right: 7.4, top: 5.6, bottom: -5.6, near: 0.1, far: 28 });
    sun.shadow.normalBias = 0.027;
    const rim = new THREE.DirectionalLight(0xb4cbd4, 0.51);
    rim.position.set(4.37, 4.2, -3.5);
    scene.add(sun, rim, new THREE.HemisphereLight(0xe1ebea, 0x584946, night ? 1.55 : 1.76));
  }

  function paving(scene, width) {
    box(scene, soil, 0, -0.24, 0, 15, 0.47, 11.6);
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < width; col += 1) {
        box(scene, stone[(row + col * 2) % 3], (col - (width - 1) / 2) * 1.18 + (row % 2) * 0.19,
          0.014, -2.8 + row * 0.74, 1.139, 0.028, 0.707);
      }
    }
  }

  function table(scene, x, z, size) {
    const top = groupAt(scene, x, 0.028, z);
    box(top, lacquer, 0, 0.45, 0, size, 0.096, 0.70, true);
    for (const side of [-1, 1]) for (const front of [-1, 1]) {
      box(top, oak, side * (size * 0.5 - 0.14), 0.21, front * 0.25, 0.105, 0.42, 0.109, true);
    }
    return top;
  }

  function writing(scene, x, y, z) {
    const document = groupAt(scene, x, y, z);
    for (let index = 0; index < 9; index += 1) {
      box(document, bamboo, (index - 4) * 0.062, 0.0, 0.144, 0.053, 0.026, 0.31);
    }
    addInkRows(groupAt(document, 0, 0.015, 0.144), box, ink, { width: 0.50, length: 0.23, y: 0, columns: 9 });
    box(document, oak, 0, 0.015, 0.221, 0.57, 0.012, 0.023);
    return document;
  }

  lights(lodge, true);
  paving(lodge, 8);
  box(lodge, plaster, -0.96, 1.49, -2.28, 6.71, 2.99, 0.26, true);
  box(lodge, plaster, 4.87, 1.49, -2.28, 1.92, 2.99, 0.26, true);
  box(lodge, oak, 0.69, 2.79, -2.1, 10.12, 0.21, 0.33, true);
  box(lodge, slate, 0.69, 3.065, -2.12, 10.4, 0.11, 0.99, true);
  addTileCourses(lodge, { width: 10.3, run: 1.1, rise: 0.31, eave: 2.93, z: -2.66, back: false });
  for (const x of [-4.42, 2.34, 3.89, 5.66]) box(lodge, oak, x, 1.41, -2.08, 0.17, 2.83, 0.24, true);
  box(lodge, stone[2], 3.10, 0.068, -2.17, 1.50, 0.135, 0.54, true);
  const lattice = groupAt(lodge, -2.26, 1.53, -2.071);
  box(lattice, oak, 0, 0, 0, 1.43, 1.00, 0.10);
  for (let i = -3; i <= 3; i += 1) {
    box(lattice, bamboo, i * 0.18, 0, 0.06, 0.044, 0.88, 0.055);
  }
  box(lattice, oak, 0, 0.04, 0.077, 1.34, 0.064, 0.069);
  box(lodge, reed, -0.15, 0.047, 0.61, 4.66, 0.037, 2.62);
  const lodgeTable = table(lodge, -0.12, 0.74, 1.57);
  addCopperLamp(lodgeTable, -0.43, 0.50, 0.10, 0.94);
  const revealLeaf = objectLeaf(lodgeTable, art);
  const lodgeWriting = writing(lodgeTable, 0.23, 0.506, -0.13);
  const nightGlow = new THREE.PointLight(0xffd29c, 7.6, 4, 2);
  nightGlow.position.set(-0.55, 1.05, 0.78);
  lodge.add(nightGlow);
  const dan = makeCrownFigure(lodge, art, 'yan', 1.16);
  const guest = makeCrownFigure(lodge, art, 'guest', 1.12);
  dan.model.position.set(-1.67, 0.065, 0.35);
  dan.model.rotation.y = 0.99;
  dan.rig.set(0.89, 0);
  dan.head.rotation.x = 0.14;
  guest.model.position.set(1.47, 0.065, 0.12);
  guest.model.rotation.y = -0.86;
  guest.rig.set(0.86, 0);

  const threshold = groupAt(lodge, 2.45, .12, -2.06);
  box(threshold, oak, .69, 1.18, 0, 1.38, 2.36, .10, true);
  for (const y of [.42, 1.83]) box(threshold, lacquer, .69, y, .072, 1.31, .095, .038);
  const spare = box(lodge, reed, 1.48, .069, 1.61, 1.21, .037, .78);
  const lodgeCup = art.profile(lodgeTable, bronze, [[.059,0],[.076,.016],[.109,.075],[.096,.079]], .08,.505,.19);
  const deputy = makeCrownFigure(lodge, art, 'li', 1.10);
  deputy.model.position.set(2.49,.07,-.6);
  deputy.model.rotation.y=-.45;
  deputy.rig.set(0,0);
  let river;
  lights(hall, false);
  paving(hall, 9);
  box(hall, plaster, 0, 1.88, -3.38, 11.40, 3.76, 0.24, true);
  box(hall, oak, 0, 3.13, -1.02, 10.91, 0.26, 0.30, true);
  box(hall, lacquer, 0, 2.96, -0.84, 10.97, 0.12, 0.18);
  beamPattern(hall, 0, 2.953, -0.736, 10.6, 0.074, 11);
  for (const x of [-4.82, -1.24, 1.24, 4.82]) {
    box(hall, lacquer, x, 1.54, -1.01, 0.23, 3.02, 0.23, true);
    box(hall, stone[0], x, 0.11, -1.01, 0.37, 0.204, 0.40, true);
  }
  for (const x of [-3.1, 3.1]) {
    box(hall, oak, x, 1.83, -3.22, 2.52, 1.74, 0.14, true);
    for (let i = -5; i <= 5; i += 1) box(hall, bamboo, x + i * 0.20, 1.83, -3.13, 0.046, 1.56, 0.09);
    for (const y of [1.20, 1.80, 2.47]) box(hall, lacquer, x, y, -3.08, 2.42, 0.07, 0.068);
  }

  const mainDesk = table(hall, 0, 1.27, 1.52);
  const map = tributeMap(mainDesk, art);
  const stoneBox = groupAt(mainDesk, -0.35, 0.525, 0.02);
  box(stoneBox, lacquer, 0, 0, 0, 0.42, 0.05, 0.33, true);
  for (const x of [-0.19, 0.19]) box(stoneBox, oak, x, 0.045, 0, 0.038, 0.088, 0.329);
  for (const z of [-0.143, 0.143]) box(stoneBox, lacquer, 0, 0.041, z, 0.34, 0.085, 0.035, true);
  const keepsake = round(mainDesk, pebble, [0.093, 0.054, 0.071], -0.04, 0.556, 0.09, true);
  const lid = groupAt(stoneBox, 0, 0.10, -0.15);
  box(lid, lacquer, 0, 0.009, 0.154, 0.416, 0.038, 0.332, true);
  const fallenCup = art.profile(mainDesk, bronze, [[.045,0],[.06,.012],[.085,.082],[.076,.085]], .62,.51,.24);
  const spill = round(mainDesk, material(0x939a81), [.12,.004,.056],.5,.504,.285);
  const register = writing(mainDesk, 0.29, 0.506, -0.22);
  const ruler = makeCrownFigure(hall, art, 'king', 1.18);
  ruler.model.position.set(-0.61, 0.028, 0.12);
  ruler.model.rotation.y = 0.28;
  ruler.rig.set(0, 0);
  const clerk = makeCrownFigure(hall, art, 'official', 1.06);
  clerk.model.position.set(0.64, 0.028, 0.16);
  clerk.model.rotation.y = -0.44;
  clerk.rig.set(0, 0);

  const brush = groupAt(clerk.arms[0], 0, -0.35, 0.02);
  brush.rotation.x = 0.40;
  box(brush, bamboo, 0, 0.06, 0, 0.014, 0.27, 0.014);
  art.profile(brush, ink, [[0.002, -0.115], [0.014, -0.08], [0.007, -0.06]], 0, 0, 0);

  const lanes = [-2.99, 2.99].map((x, index) => {
    box(hall, reed, x, 0.047, 0.23, 2.77, 0.043, 3.32);
    const standX = x + (index === 0 ? -1.15 : 1.15);
    box(hall, lacquer, standX, 0.31, 0.68, 0.55, 0.57, 0.52, true);
    box(hall, oak, standX, 0.622, 0.68, 0.68, 0.075, 0.60, true);
    const flame = addCopperLamp(hall, standX, 0.663, 0.66, 1.04);
    const lampLight = new THREE.PointLight(0xffbe7e, 0, 4.15, 2);
    lampLight.position.set(standX, 1.15, 0.86);
    hall.add(lampLight);
    box(hall, oak, x, 2.46, -0.85, 2.78, 0.080, 0.10, true);
    const leaves = [-1, 1].map(side => {
      const panel = groupAt(hall, x, 0, -0.86);
      for (let fold = 0; fold < 7; fold += 1) {
        const offset = side * (fold + 0.5) * 0.187;
        const strip = box(panel, fold % 2 ? curtain[index] : curtainEdge[index], offset, 1.30, 0.041 * (fold % 2), 0.196, 2.24, 0.09, true);
        strip.rotation.y = (fold % 2 ? 1 : -1) * 0.25;
      }
      box(panel, curtainEdge[index], side * 0.654, 0.16, 0.024, 1.30, 0.119, 0.115, true);
      return { panel, side };
    });
    const person = makeCrownFigure(hall, art, index ? 'resident' : 'keeper', 0.99);
    if (index === 1) {
      const cup = groupAt(person.arms[0], 0, -0.36, 0.06);
      art.profile(cup, bronze, [[0.03, 0], [0.045, 0.015], [0.075, 0.05], [0.069, 0.055]], 0, 0, 0);
      box(cup, ink, 0.025, 0.054, 0, 0.009, 0.025, 0.008);
    }
    return { x, person, flame, lampLight, leaves };
  });

  const envoy = makeCrownFigure(hall, art, 'guest', 1.12);
  const aide = makeCrownFigure(hall, art, 'li', 1.10);
  envoy.model.position.set(1.37,.04,1.42);
  aide.model.position.set(2.14,.04,1.13);
  for (const figure of [envoy,aide]) { figure.model.rotation.y = -1.06; figure.rig.set(0,0); }
  aide.head.rotation.x = .27;
  let world = lodge;
  let lastBeat;
  let lastCounts = [0, 0];
  let fromCounts = lastCounts;
  let started = 0;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    const { storyBeat: beat, hallProgress } = state;
    const folio = beat.startsWith('folio');
    revealLeaf(folio ? Number(beat.at(-1)) : -1);
    lodgeWriting.visible = lodgeCup.visible = !folio;
    nightGlow.intensity = folio ? 1.4 : 7.6;
    const yan = folio || ['yan','door','visitor','otherYan'].includes(beat);
    const atRiver = ['river','song','departed'].includes(beat);
    if (atRiver) river ??= createYishui(art, lights);
    world = atRiver ? river.scene : yan ? lodge : hall;
    const open = beat === 'visitor';
    threshold.rotation.y = open ? -1.44 : 0;
    dan.model.visible = beat !== 'door';
    dan.rig.set(open ? 0 : .89, 0);
    dan.model.position.set(open ? 3.08 : -1.67, .065, open ? -1.99 : .35);
    dan.model.rotation.y = open ? -.28 : .99;
    guest.model.visible = beat !== 'otherYan';
    deputy.model.visible = beat !== 'otherYan';
    spare.visible = yan;
    envoy.model.visible = aide.model.visible = beat === 'audience';
    if (beat !== lastBeat || hallProgress.some((count, index) => count !== lastCounts[index])) {
      fromCounts = lastCounts;
      lastCounts = hallProgress;
      lastBeat = beat;
      started = time;
    }
    const age = reduced ? 1600 : time - started;
    if (atRiver) river.frame(beat, age);
    const mapShot = beat === 'map' || beat === 'mapEnd';
    if (!yan && !atRiver) {
      const memory = beat === 'stone' || beat === 'echo';
      const atTable = memory || beat === 'record' || beat === 'keep';
      map.group.visible = mapShot;
      stoneBox.visible = keepsake.visible = atTable;
      if (map.group.visible) map.unfold(beat === 'mapEnd' ? 1 : lerp(.12, 1, reduced ? Math.floor(state.mapProgress * 2) / 2 : state.mapProgress));
      const startle = beat === 'mapEnd' ? smoothstep(age, 0, 420) : 0;
      fallenCup.visible = mapShot;
      fallenCup.rotation.z = startle * 1.45;
      spill.visible = startle > .6;
      ruler.rig.set(atTable ? .88 : mapShot ? .88 * (1 - startle) : 0, 0);
      const recoil = beat === 'mapEnd' ? smoothstep(age, 160, 570) : 0;
      clerk.rig.set(atTable ? 0.84 : 0, Math.sin(recoil * Math.PI * 2) * 0.7);
      ruler.model.position.set(atTable ? -0.33 : -0.61, 0.028, atTable ? 0.76 : 0.12);
      clerk.model.position.set(atTable ? 0.43 : 0.64, 0.028, atTable ? 0.78 : 0.16 - recoil * 0.20);
      clerk.model.rotation.z = beat === 'mapEnd' ? -0.08 * smoothstep(age, 720, 1020) : 0;
      const reach = memory ? Math.sin(Math.PI * smoothstep(age, 50, 1010)) : beat === 'keep' ? 1 - smoothstep(age, 650, 1100) : 0;
      ruler.arms[1].rotation.set(-0.25 - 0.85 * reach, 0, -0.1);
      const stowed = beat === 'keep' ? smoothstep(age, 0, 370) : 0;
      keepsake.position.set(lerp(-0.06, -0.35, stowed), lerp(.556, .585, stowed), lerp(.09, .02, stowed));
      keepsake.rotation.y = Math.PI * (beat === 'stone' ? smoothstep(age, 140, 890) : 1);
      lanes.forEach(({ x, person, flame, lampLight, leaves }, index) => {
        const count = hallProgress[index];
        const spark = count === 0 ? 0
          : fromCounts[index] > 0 ? 1 : smoothstep(age, 100, 455);
        flame.visible = spark > 0.13;
        lampLight.intensity = 9.1 * spark;
        const drawn = count === 2 ? fromCounts[index] === 2 ? 1 : smoothstep(age, 50, 440) : 0;
        const crossing = count === 2 ? fromCounts[index] === 2 ? 1 : smoothstep(age, 395, 1095) : 0;
        leaves.forEach(({ panel, side }) => {
          const gap = count === 2 ? 0 : beat === 'curtain' && index === 0 ? 0.25 : 0.14;
          panel.scale.x = 1 - drawn * 0.71 - gap;
          panel.position.x = x + side * (drawn * 0.96 + gap * 1.15);
        });
        person.model.position.set(x, 0.076, lerp(-1.22, 0.53, crossing));
        person.model.rotation.y = lerp(0.04, index ? -0.38 : 0.28, crossing);
        const gait = Math.sin(crossing * 8 * Math.PI) * Math.sin(crossing * Math.PI);
        person.rig.set(smoothstep(crossing, 0.83, 1) * 0.72, gait);
        const signal = count === 1 && fromCounts[index] === 0 ? Math.sin(Math.PI * smoothstep(age, 0, 800)) : 0;
        person.arms[0].rotation.x = -0.10 + gait * 0.35 - (count < 2 ? index ? 0.78 : 1.04 : 0) - signal * 0.52;
        person.arms[1].rotation.x = -0.10 - gait * 0.35;
      });
      ruler.head.rotation.set(memory ? 0.28 : 0.05, memory ? -0.06 : 0.22, 0);
      const close = beat === 'keep' ? smoothstep(age, 380, 920) : 0;
      lid.rotation.x = -1.33 * (1 - close);
      const unroll = beat === 'record' ? smoothstep(age, 45, 690) : 0;
      register.visible = beat === 'record';
      register.rotation.x = -1.12 * (1 - unroll);
      clerk.arms[0].rotation.set(-0.19 - unroll * 0.48, 0, -0.12);
      clerk.head.rotation.x = 0.13 + unroll * 0.22;
      brush.visible = atTable;
      if (beat === 'record') clerk.arms[0].rotation.z += 0.12 * Math.sin(age / 85) * Math.sin(Math.PI * smoothstep(age, 80, 1010));
    }

    const near = ['stone', 'echo', 'record', 'keep'].includes(beat);
    const curtainShot = beat === 'curtain';
    const widened = beat === 'mapEnd' ? smoothstep(age, 140, 860) : 0;
    const targetX = folio ? .07 : curtainShot ? -2.99 : beat === 'audience' ? 1.6 : beat === 'door' || open ? 1.32 : near ? -.03 : 0;
    const targetZ = folio ? .75 : mapShot ? lerp(1.27, 0.75, widened) : near ? 1.27 : curtainShot ? -0.83 : 0.39;
    const focusY = folio ? .57 : mapShot ? lerp(0.52, 0.91, widened) : near ? 0.73 : curtainShot ? 1.12 : yan ? 1.26 : 1.21;
    const zoom = folio ? 5 : mapShot ? lerp(5.4, 2.85, widened) : near ? 3.30 : beat === 'audience' ? 2.25 : curtainShot ? 2.72 : yan ? 1.3 : 1.23;
    camera.zoom = zoom - captionOffset * 0.07;
    camera.updateProjectionMatrix();
    const y = focusY - captionOffset * (folio || mapShot || near ? 0.14 : 0.84);
    camera.position.set(targetX + (yan && !folio ? 2.4 : 0.6), y + (folio ? 19 : mapShot ? lerp(18, 9.8, widened) : near ? 11 : 7.4), targetZ + 13.9);
    camera.lookAt(targetX, y, targetZ);
    camera.updateMatrixWorld();
    marker.hidden = true;
    return !yan && !reduced && age < 1150;
  }
  return { get world() { return world; }, frame, controlsCameraZoom: true };
}

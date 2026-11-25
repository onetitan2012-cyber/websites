import * as THREE from './vendor/three.module.min.js';
import { makeChuFerry } from './chu-ferry.mjs';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';
import { addCopperLamp, addInkRows } from './scene-art.mjs';

const { lerp, smoothstep } = THREE.MathUtils;

export function createChuWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0xa0a5a0);
  const art = makeCrownArt();
  const { box, mesh, material, groupAt, round, earth, wood, cloth, matTexture } = art;
  const dirt = material(0x8f8272, earth);
  const dust = material(0xafa48c, earth);
  const soil = material(0x817b6e, earth);
  const timber = material(0x755749, wood);
  const beams = material(0x53433e, wood);
  const axle = material(0x746755, null, 0.64, 0.30);
  const wheelWood = material(0x9e815c, wood);
  const rush = material(0xb6a580, matTexture);
  const tentCloth = material(0xab9d80, cloth);
  const spareCanvas = material(0x788987, cloth);
  const grain = material(0xbea469, cloth);
  const binding = material(0x918068, cloth);
  const blueCloth = material(0x769296, cloth);
  const blueEdge = material(0x516f75, cloth);
  const bamboo = material(0xba9c71, wood);
  const ink = material(0x4a3c35);

  const sun = new THREE.DirectionalLight(0xf4debd, 1.83);
  sun.position.set(-4.55, 8.12, 4.94);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -7.2, right: 7.2, top: 5.4, bottom: -6, near: 0.1, far: 30 });
  sun.shadow.normalBias = 0.032;
  const fill = new THREE.DirectionalLight(0xaebfce, 0.69);
  fill.position.set(3.51, 4.74, -5.11);
  world.add(sun, fill, new THREE.HemisphereLight(0xe9e4d6, 0x6d5d50, 1.78));

  box(world, dirt, 0, -0.22, 0.15, 18.2, 0.42, 12.1);
  box(world, dust, 0, 0.007, 1.78, 15.3, 0.031, 3.27);
  for (let index = 0; index < 18; index += 1) {
    const x = (index % 9 - 4) * 1.31 + (index >= 9 ? 0.39 : 0);
    box(world, soil, x, 0.026, index >= 9 ? 3.24 : 0.31, 0.42 + (index % 3) * 0.13, 0.018, 0.17);
  }
  for (const [x, y, z, width] of [[-4.8, 0.36, -4.1, 4.5], [0.2, 0.25, -4.5, 5.7], [5.7, 0.41, -4.0, 4.5]]) {
    box(world, soil, x, y / 2, z, width, y, 1.08, true);
    for (const end of [-1, 1]) box(world, beams, x + end * (width / 2 - 0.22), y + 0.32, z + 0.36, 0.16, 0.79, 0.16, true);
    box(world, timber, x, y + 0.48, z + 0.36, width - 0.39, 0.15, 0.11, true);
  }

  function shelter(x, z, width, material, annex = false) {
    const tent = groupAt(world, x, 0.031, z);
    const wallHeight = annex ? 1.75 : 2.02;
    const depth = annex ? 1.75 : 2.32;
    box(tent, rush, 0, 0.027, 0.07, width, 0.045, depth);
    box(tent, material, 0, 0.98, -depth * 0.44, width, 1.93, 0.072, true);
    for (const side of [-1, 1]) {
      box(tent, beams, side * (width * 0.47), wallHeight / 2, depth * 0.43, 0.12, wallHeight, 0.134, true);
      box(tent, beams, side * (width * 0.47), wallHeight / 2, -depth * 0.44, 0.12, wallHeight, 0.13, true);
      const run = width * 0.55;
      const rise = annex ? 0.39 : 0.53;
      const roof = box(tent, material, side * run / 2, wallHeight + rise / 2, 0,
        Math.hypot(run, rise), 0.074, depth + 0.28, true);
      roof.rotation.z = -side * Math.atan2(rise, run);
      box(tent, timber, side * run, wallHeight, 0.011, 0.082, 0.079, depth + 0.35, true);
    }
    box(tent, beams, 0, wallHeight + (annex ? 0.40 : 0.57), 0.018, 0.082, 0.084, depth + 0.39, true);
    return tent;
  }

  const tent = shelter(-2.32, -1.78, 3.67, tentCloth);
  const annex = shelter(2.77, -1.76, 3.62, spareCanvas, true);
  const store = groupAt(annex, 0.49, 0.029, -0.42);
  for (const [x, y, z] of [[-0.49,0.22,-0.19],[0.15,0.22,-0.19],[-0.49,0.60,-0.19],[0.43,0.22,0.44]]) {
    box(store, timber, x, y, z, 0.55, 0.40, 0.58, true);
    box(store, beams, x, y + 0.212, z, 0.57, 0.064, 0.60, true);
  }
  box(tent, timber, -1.08, 0.29, -0.57, 0.57, 0.51, 0.48, true);

  const table = groupAt(world, 0.05, 0.033, -0.42);
  box(table, timber, 0, 0.437, 0, 1.46, 0.093, 0.69, true);
  for (const x of [-0.56, 0.56]) for (const z of [-0.23, 0.23]) {
    box(table, beams, x, 0.211, z, 0.109, 0.42, 0.11, true);
  }
  const copper = addCopperLamp(table, -0.47, 0.494, 0.12, 0.82).parent;
  const lamp = new THREE.PointLight(0xffcd92, 4, 3.7, 2);
  lamp.position.set(-0.43, 0.92, -0.29);
  world.add(lamp);
  const note = groupAt(table, 0.18, 0.501, -0.17);
  for (let index = 0; index < 8; index += 1) {
    box(note, bamboo, (index - 3.5) * 0.064, 0, 0.13, 0.058, 0.024, 0.28);
  }
  addInkRows(groupAt(note, 0, 0.013, 0.13), box, ink, { width: 0.48, length: 0.24, y: 0, columns: 8 });

  function sack(parent, x, y, z, angle) {
    const item = groupAt(parent, x, y, z);
    item.rotation.y = angle;
    round(item, grain, [0.158, 0.106, 0.140], 0, 0, 0, true);
    round(item, grain, [0.051, 0.039, 0.048], 0.126, 0.034, 0);
    box(item, binding, 0.108, 0.037, 0, 0.025, 0.029, 0.089);
    return item;
  }

  const rollBody = new THREE.CylinderGeometry(0.097, 0.097, 0.30, 16).rotateZ(Math.PI / 2);
  const rollFace = new THREE.CylinderGeometry(0.056, 0.056, 0.016, 14).rotateZ(Math.PI / 2);
  function roll(parent, x, y, z, angle) {
    const item = groupAt(parent, x, y, z);
    item.rotation.y = angle;
    mesh(item, rollBody, blueCloth, 0, 0, 0, true);
    for (const side of [-1, 1]) mesh(item, rollFace, blueEdge, side * 0.148, 0, 0);
    box(item, binding, -0.029, 0.092, 0, 0.032, 0.014, 0.166);
    return item;
  }

  const wheel = new THREE.CylinderGeometry(0.262, 0.262, 0.095, 22).rotateZ(Math.PI / 2);
  const hub = new THREE.CylinderGeometry(0.071, 0.071, 0.147, 14).rotateZ(Math.PI / 2);
  function wagon(x, z) {
    const model = groupAt(world, x, 0.03, z);
    model.rotation.y = x < 0 ? 0.17 : -0.19;
    box(model, timber, 0, 0.313, 0, 1.21, 0.084, 1.52, true);
    for (const x of [-0.54, 0.54]) {
      box(model, beams, x, 0.42, 0, 0.078, 0.15, 1.53, true);
      box(model, timber, x * 0.9, 0.327, -0.96, 0.09, 0.07, 0.66, true);
      mesh(model, wheel, beams, x * 1.20, 0.258, 0.15, true);
      mesh(model, hub, axle, x * 1.31, 0.258, 0.15);
      for (let index = 0; index < 8; index += 1) {
        const angle = index * Math.PI / 4;
        const slat = box(model, wheelWood, x * 1.29,
          0.258 + Math.cos(angle) * 0.132, 0.15 + Math.sin(angle) * 0.132, 0.027, 0.187, 0.028);
        slat.rotation.x = angle;
      }
    }
    const tie = groupAt(model, 0, 0.006, 0);
    for (const z of [-0.32, 0.28]) box(tie, binding, 0, 0.563, z, 1.13, 0.023, 0.050, true);
    const loose = art.thread(model, binding, [[0.48,0.51,0.18],[0.61,0.42,0.35],[0.63,0.20,0.49],[0.59,0.09,0.63]],0.025);
    return { model, tie, loose };
  }

  const carts = [wagon(-2.05, 1.69), wagon(2.18, 1.61)];
  const swiftSacks = Array.from({ length: 8 }, (_, index) => sack(carts[0].model,
    (index % 2 - 0.5) * 0.389, 0.46, -0.49 + Math.floor(index / 2) * 0.326, index % 2 ? -0.17 : 0.13));
  const loads = carts.map(({ model }) => [
    Array.from({ length: 4 }, (_, index) => sack(model, (index % 2 - 0.5) * 0.392, 0.458,
      -0.49 + Math.floor(index / 2) * 0.30, index % 2 ? -0.17 : 0.19)),
    Array.from({ length: 4 }, (_, index) => roll(model, (index % 2 - 0.5) * 0.392, 0.448,
      0.127 + Math.floor(index / 2) * 0.31, index % 2 ? 0.12 : -0.14)),
  ]);
  const rack = groupAt(world, 0.14, 0.04, 1.41);
  box(rack, timber, 0, 0.26, 0, 1.28, 0.08, 0.69, true);
  for (const x of [-0.51, 0.51]) box(rack, beams, x, 0.13, 0, 0.09, 0.27, 0.59);
  const spares = [sack, roll].map((make, type) => Array.from({length: 4}, (_, i) =>
    make(rack, (i % 2 - 0.5) * 0.40, 0.41 + type * 0.19, (Math.floor(i / 2) - 0.5) * 0.31, 0.1)));
  const restPositions = new Map([...swiftSacks, ...loads.flat(2)].map(item => [item, item.position.clone()]));

  const reserve = groupAt(world, 0.26, 0.046, 2.31);
  box(reserve, rush, 0, 0, 0, 1.40, 0.038, 0.68);
  sack(reserve, -0.34, 0.126, -0.04, -0.12);
  roll(reserve, 0.29, 0.118, 0.037, 0.17);

  const king = makeCrownFigure(world, art, 'king', 1.17);
  const li = makeCrownFigure(world, art, 'li', 1.13);
  const wang = makeCrownFigure(world, art, 'wang', 1.15);
  const clerk = makeCrownFigure(world, art, 'official', 1.04);
  king.model.position.set(-0.18, 0.033, -1.52);
  li.model.position.set(-2.36, 0.067, -1.46);
  wang.model.position.set(1.63, 0.03, -0.24);
  clerk.model.position.set(0.61, 0.034, -1.23);
  king.model.rotation.y = 0.37;
  li.model.rotation.y = 0.49;
  wang.model.rotation.y = -0.57;
  clerk.model.rotation.y = -0.38;

  const driver = makeCrownFigure(world, art, 'keeper', 1.06);
  const mate = makeCrownFigure(world, art, 'resident', 1.02);
  mate.model.position.set(-1.25, 0.04, 1.18);
  const hooks = groupAt(world, -0.34, 0.04, 1.68);
  for (const x of [-0.41, 0.41]) box(hooks, timber, x, 0.52, 0, 0.07, 1.04, 0.08, true);
  box(hooks, beams, 0, 1.03, 0, 1.05, 0.085, 0.1, true);
  const tags = [-0.23, 0.23].map((x, i) => {
    const tag = groupAt(hooks, x, 0.82, 0.064);
    box(tag, binding, 0, 0.16, 0, 0.025, 0.18, 0.025);
    box(tag, bamboo, 0, 0, 0, 0.21, 0.32, 0.045, true);
    for (let n = 0; n <= i + 1; n++) box(tag, ink, 0, 0.064 - n*0.052, 0.025, 0.09, 0.016, 0.01);
    return tag;
  });
  const basket = groupAt(world, 1.43, 0.055, 2.22);
  box(basket, timber, 0, 0.15, 0, 0.80, 0.28, 0.51, true);
  const campGrain = sack(basket, -0.18, 0.37, 0, 0);
  const campCloth = roll(basket, 0.17, 0.36, 0, 0);
  const rolledMat = mesh(world, new THREE.CylinderGeometry(0.12, 0.12, 0.73, 16).rotateZ(Math.PI/2), rush, 0.28, 0.16, 2.32, true);
  const home = groupAt(world, 0, 0.03, -1.65);
  box(home, dust, 0, 1.22, 0, 4.9, 2.44, 0.31, true);
  box(home, timber, 0, 1.05, 0.19, 1.4, 2.1, 0.12, true);
  box(home, beams, 0, 2.40, 0.08, 5.15, 0.19, 0.69, true);
  const camp = new THREE.Group();
  for (const item of [...world.children]) if (!item.isLight) camp.add(item);
  world.add(camp);
  const ferry = makeChuFerry(world, art);

  let lastMode;
  let lastBeat;
  let lastStock = [0, 0];
  let fromStock = lastStock;
  let started = 0;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    const { storyBeat: beat, supplyMode, supplyStock } = state;
    const steady = supplyMode === 'steady';
    if (supplyMode !== lastMode || beat !== lastBeat || supplyStock.some((count, index) => count !== lastStock[index])) {
      fromStock = supplyMode === lastMode ? lastStock : supplyStock;
      lastStock = supplyStock;
      lastMode = supplyMode;
      lastBeat = beat;
      started = time;
    }
    const age = reduced ? 1200 : time - started;
    const loading = smoothstep(age, 50, 625);
    function fillItems(items, type, offset = 0) {
      items.forEach((item, index) => {
        const stockIndex = offset + index;
        const present = supplyStock[type] > stockIndex;
        const progress = fromStock[type] > stockIndex ? 1 : loading;
        const rest = restPositions.get(item);
        item.visible = present;
        item.position.set(rest.x + (rest.x < 0 ? -1 : 1) * (1 - progress) * 0.27,
          rest.y + (1 - progress) * 0.45, rest.z);
      });
    }

    const onRiver = ['bank','plank','crossing','landed'].includes(beat);
    const atLamp = ['dusk','reserve','list'].includes(beat);
    const returning = ['return','counted','wheel'].includes(beat);
    camp.visible = !onRiver;
    ferry.shore.visible = onRiver;
    world.background.setHex(onRiver ? 0xc2c9b5 : atLamp ? 0x776e66 : 0xa0a5a0);
    sun.intensity = atLamp ? 0.72 : 1.83;
    if (onRiver) {
      ferry.pose(beat, smoothstep(age, 0, 1100));
      camera.zoom = 1.18;
      camera.updateProjectionMatrix();
      camera.position.set(1.1, 6.9, 13.8);
      camera.lookAt(0, 0.7 - captionOffset * 0.61, 0);
      camera.updateMatrixWorld();
      marker.hidden = true;
      return !reduced && beat === 'crossing' && age < 1150;
    }
    fillItems(swiftSacks, 0);
    if (steady) swiftSacks.forEach(item => { item.visible = false; });
    loads.forEach(([sacks, rolls], index) => {
      fillItems(sacks, 0, index * 4);
      fillItems(rolls, 1, index * 4);
      if (!steady) [...sacks, ...rolls].forEach(item => { item.visible = false; });
      carts[index].tie.visible = steady ? supplyStock.every(amount => amount >= (index + 1) * 4)
        : index === 0 && supplyStock[0] >= 8;
      carts[index].loose.visible = !carts[index].tie.visible;
    });
    const waiting = steady && supplyStock.some(n => n < 4);
    rack.visible = waiting && supplyStock.some(n => n > 4);
    spares.forEach((items, type) => items.forEach((item, i) => { item.visible = i < supplyStock[type] - 4; }));
    if (waiting) loads[1].flat().forEach(item => { item.visible = false; });
    const unroll = beat === 'list' ? smoothstep(age, 50, 635) : 0;
    reserve.visible = beat === 'reserve';
    note.rotation.x = beat === 'list' ? -1.22 * (1 - unroll) : 0;
    clerk.arms[0].rotation.x = -0.17 - unroll * 0.45;
    clerk.head.rotation.x = 0.19 + unroll * 0.12;
    for (const person of [king, li, wang, clerk]) person.rig.set(0, 0);

    const homeVisit = beat === 'summon';
    home.visible = homeVisit;
    tent.visible = !homeVisit;
    annex.visible = steady && !homeVisit;
    table.visible = !homeVisit;
    carts.forEach(({model}, i) => { model.visible = !homeVisit && (i === 0 || steady); });
    if (returning) {
      swiftSacks.forEach(item => { item.visible = false; });
      carts[0].tie.visible = false;
      carts[0].loose.visible = true;
    }
    carts[0].model.position.x = -2.05 - (beat === 'wheel' ? 1.12 * (1 - loading) : 0);
    hooks.visible = !steady;
    tags[0].position.set(beat === 'counted' ? 0.42 : -0.23, beat === 'counted' ? 0.52 : 0.82, beat === 'counted' ? -2.07 : 0.064);
    tags[0].rotation.x = beat === 'counted' ? -Math.PI / 2 : 0;
    tags[0].rotation.y = beat === 'drivers' ? (1 - loading) * 1.2 : 0;
    driver.model.visible = !homeVisit;
    mate.model.visible = !steady && !returning;
    const takingSeat = beat === 'reserve';
    driver.model.position.set(atLamp ? (takingSeat ? 0.29 : -0.79) : steady ? -1.25 : -2.96, 0.04, atLamp ? (takingSeat ? 2.45 : -0.04) : 1.47);
    driver.model.rotation.y = atLamp ? -0.2 : 0.71;
    driver.rig.set(takingSeat ? loading : 0, 0);
    driver.arms[1].rotation.x = beat === 'sleeve' || beat === 'return' ? -0.92 : -0.18;
    mate.arms[0].rotation.x = beat === 'drivers' ? -1.08 : -0.3;
    li.model.visible = !steady && !returning;
    king.model.visible = homeVisit || beat === 'council';
    king.model.position.set(homeVisit ? -1.12 : -0.18, 0.033, homeVisit ? 0.13 : -1.52);
    wang.model.visible = (steady && !atLamp) || beat === 'council';
    clerk.model.visible = !homeVisit;
    note.visible = returning || atLamp;
    basket.visible = atLamp;
    rolledMat.visible = atLamp && !takingSeat;
    campGrain.visible = campCloth.visible = !takingSeat;
    copper.position.set(takingSeat ? 0.94 : -0.47, takingSeat ? 0.035 : 0.494, takingSeat ? 2.44 : 0.12);
    lamp.position.set(copper.position.x, copper.position.y + 0.43, copper.position.z - 0.36);
    const focusX = atLamp ? 0.35 : returning ? -1.28 : steady ? 0.08 : -0.94;
    const focusY = (beat === 'council' ? 1.42 : 1.18) - captionOffset * 0.88;
    camera.zoom = (atLamp || returning || homeVisit ? 1.55 : steady ? 1.23 : 1.37) - captionOffset * 0.08;
    camera.updateProjectionMatrix();
    camera.position.set(focusX + 1.35, focusY + (beat === 'council' ? 5.8 : 8.35), 14.50);
    camera.lookAt(focusX, focusY, (atLamp || returning ? 1.04 : 0.32) + captionOffset * 0.35);
    camera.updateMatrixWorld();
    marker.hidden = true;
    return !reduced && age < 690;
  }

  return { world, frame, controlsCameraZoom: true };
}

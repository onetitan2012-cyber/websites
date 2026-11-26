import * as THREE from './vendor/three.module.min.js';
import { makeFigures } from './figure.mjs';
import { grain } from './material-grain.mjs';
import { addCopperLamp, addInkRows, addTileCourses } from './scene-art.mjs';
import { QIN_SEATING_DURATION } from './qin-seating.mjs';

const mix = THREE.MathUtils.lerp;
const ease = THREE.MathUtils.smoothstep;
function walkCycle(progress, steps) {
  return Math.sin(progress * Math.PI * steps) * Math.sin(progress * Math.PI);
}

function walkFacing(travel, before, after) {
  const towardMat = mix(before, 1.60, ease(travel, 0, 0.20));
  return mix(towardMat, after, ease(travel, 0.70, 1));
}

function approach(age, start, arrival, steps) {
  const travel = ease(age, start, arrival);
  return {
    travel,
    gait: walkCycle(travel, steps),
    kneel: ease(age, arrival + 65, arrival + 920),
  };
}

export function createQinWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0x263131);
  let seed = 251;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const material = (color, map) => new THREE.MeshStandardMaterial({ color, map, roughness: 0.93 });
  const cloth = grain('cloth', random);
  const timber = grain('wood', random);
  const earth = grain('earth', random);
  const stone = grain('stone', random);
  const plaster = material(0x8d7a5e, earth);
  const floor = material(0x7c6c57, stone);
  const beam = material(0x503d30, timber);
  const board = material(0x725439, timber);
  const reed = material(0xc2a473, grain('reed', random));
  const lacquer = material(0x70433a, timber);
  const slate = material(0x4a5354, stone);
  const ink = material(0x534133);
  const fabric = material(0x71584b, cloth);
  const bronze = material(0x8e744b);
  const clay = material(0xa27b58, stone);
  const cube = new THREE.BoxGeometry();
  const sphere = new THREE.SphereGeometry(1, 14, 10);

  function groupAt(parent, x = 0, y = 0, z = 0) {
    const child = new THREE.Group();
    child.position.set(x, y, z);
    parent.add(child);
    return child;
  }

  function mesh(parent, geometry, mat, x, y, z, cast = false) {
    const obj = new THREE.Mesh(geometry, mat);
    obj.position.set(x, y, z);
    obj.castShadow = cast;
    obj.receiveShadow = true;
    parent.add(obj);
    return obj;
  }

  function box(parent, mat, x, y, z, sx, sy, sz, cast = false) {
    const obj = mesh(parent, cube, mat, x, y, z, cast);
    obj.scale.set(sx, sy, sz);
    return obj;
  }

  function round(parent, mat, size, x, y, z, cast = false) {
    const obj = mesh(parent, sphere, mat, x, y, z, cast);
    obj.scale.set(...size);
    return obj;
  }

  const daylight = new THREE.DirectionalLight(0xb4d2d4, 1.46);
  daylight.position.set(-5.6, 6.2, 4.6);
  daylight.castShadow = true;
  daylight.shadow.mapSize.set(1024, 1024);
  daylight.shadow.normalBias = 0.025;
  daylight.shadow.bias = -0.0004;
  Object.assign(daylight.shadow.camera, { left: -7.6, right: 7.6, top: 5.2, bottom: -5.2, near: 0.1, far: 26 });
  const courtRim = new THREE.DirectionalLight(0xbdccd6, 0.61);
  courtRim.position.set(-5, 4.2, -2.8);
  world.add(daylight, courtRim, new THREE.HemisphereLight(0xc8d7ce, 0x6c5746, 1.67));
  const warm = new THREE.PointLight(0xffb66f, 16.7, 8.4, 1.85);
  warm.position.set(2.72, 1.18, 1.65);
  world.add(warm);

  box(world, floor, 0, -0.25, 2.4, 22, 0.48, 12);
  box(world, plaster, 0.78, 1.94, -0.57, 7.7, 3.9, 0.43);
  box(world, plaster, -5.34, 1.94, -0.57, 2.0, 3.90, 0.43);
  box(world, plaster, -3.80, 3.42, -0.57, 2.85, 0.85, 0.45);
  const lightCourt = new THREE.MeshBasicMaterial({ color: 0x51696a });
  box(world, lightCourt, -3.67, 1.73, -4.25, 4.78, 3.51, 0.06);
  const courtWall = material(0x6d817d, earth);
  const courtTile = material(0x465c59, stone);
  box(world, courtWall, -3.48, 0.62, -2.27, 4.47, 1.27, 0.29);
  box(world, courtTile, -3.48, 1.31, -2.27, 4.68, 0.15, 0.48, true);
  for (const x of [-5.38, -3.52, -1.66]) box(world, courtTile, x, 0.70, -2.03, 0.14, 1.40, 0.14);
  const tree = groupAt(world, -4.70, 0, -2.94);
  const branch = mesh(tree, new THREE.CylinderGeometry(0.055, 0.13, 2.85, 8),
    material(0x635744, timber), 0, 1.39, 0);
  branch.rotation.z = -0.17;
  const leaves = new THREE.IcosahedronGeometry(1, 2);
  const greens = [0x4c675e, 0x657c6b, 0x566f62].map(color => material(color));
  for (let i = 0; i < 13; i += 1) {
    const leaf = mesh(tree, leaves, greens[i % 3], (random() - 0.5) * 1.88,
      1.82 + random() * 0.84, (random() - 0.5) * 0.76);
    leaf.scale.set(0.32 + random() * 0.43, 0.30 + random() * 0.40, 0.38 + random() * 0.45);
  }
  for (const x of [-4.96, -2.59, 1.96, 4.57]) {
    box(world, beam, x, 1.68, -0.19, 0.23, 3.38, 0.26, true);
    box(world, floor, x, 0.15, -0.14, 0.36, 0.32, 0.36);
  }
  box(world, beam, -3.77, 2.86, -0.15, 2.53, 0.18, 0.25, true);
  box(world, floor, -3.77, 0.069, 0.00, 2.48, 0.16, 0.47);
  box(world, beam, 1.04, 2.86, -0.19, 9.08, 0.19, 0.25);
  for (const x of [-4.96, -2.59, 1.96, 4.57]) {
    box(world, lacquer, x, 2.69, -0.07, 0.42, 0.10, 0.26, true);
    box(world, beam, x, 2.80, -0.06, 0.60, 0.095, 0.28, true);
  }
  const eave = groupAt(world, -0.22, 0, -0.55);
  box(eave, lacquer, 0, 3.20, 0.59, 10.46, 0.13, 0.20, true);
  const roofDeck = box(eave, slate, 0, 3.45, 0.16, 10.44, 0.11, 1.19, true);
  roofDeck.rotation.x = 0.30;
  addTileCourses(eave, { width: 10.42, run: 1.14, rise: 0.35, eave: 3.28, z: -0.33, back: false });
  for (let i = 0; i < 11; i += 1) {
    box(world, floor, i * 0.71 - 3.98, 0.009, 2.99, 0.676, 0.029, 0.54);
  }
  const screen = groupAt(world, 1.71, 0.14, -0.04);
  box(screen, reed, 0, 1.14, 0, 2.85, 2.02, 0.13);
  for (let index = 0; index <= 7; index += 1) {
    box(screen, beam, 0.407 * index - 1.42, 1.14, 0.084, 0.056, 2.05, 0.071);
  }
  for (const y of [0.13, 1.1, 2.15]) box(screen, beam, 0, y, 0.09, 2.96, 0.086, 0.09);
  for (const y of [0.19, 2.08]) box(screen, lacquer, 0, y, 0.13, 2.91, 0.062, 0.033);
  for (const x of [-1.49, 1.49]) {
    box(screen, lacquer, x, 1.13, 0.088, 0.076, 2.16, 0.11, true);
    box(screen, beam, x, 0.057, 0.08, 0.18, 0.09, 0.33);
  }
  for (let i = 0; i < 9; i += 1) box(world, floor, -3.99 + i * 0.43, 0.007, 2.92, 0.401, 0.04, 0.26);
  box(world, reed, 0.53, 0.045, 1.62, 4.38, 0.083, 2.50);
  for (const x of [-1.64, 2.71]) box(world, fabric, x, 0.094, 1.62, 0.092, 0.03, 2.49);
  for (const z of [0.43, 2.80]) box(world, fabric, 0.53, 0.094, z, 4.36, 0.03, 0.10);
  for (const x of [-0.61, 0.37, 1.37]) {
    box(world, fabric, x, 0.114, 1.28, 0.657, 0.059, 0.55, true);
    box(world, reed, x, 0.142, 1.28, 0.601, 0.009, 0.49);
    box(world, lacquer, x, 0.141, 1.548, 0.639, 0.017, 0.029);
  }

  const table = groupAt(world, 0.52, 0.075, 2.38);
  box(table, board, 0, 0.35, 0, 2.97, 0.105, 0.70, true);
  box(table, lacquer, 0, 0.329, 0.349, 2.95, 0.065, 0.029, true);
  for (const x of [-1.20, 1.20]) for (const z of [-0.23, 0.23]) {
    box(table, beam, x, 0.163, z, 0.11, 0.33, 0.106, true);
  }
  const cupGeo = new THREE.LatheGeometry([
    [0, 0], [0.071, 0], [0.104, 0.034], [0.12, 0.10], [0.105, 0.103], [0.086, 0.04], [0.02, 0.024],
  ].map(([x, y]) => new THREE.Vector2(x, y)), 16);
  const cups = [-0.92, 0.21, 1.07].map(x => mesh(table, cupGeo, clay, x, 0.407, 0.12, true));
  const tray = groupAt(table, -0.76, 0.422, -0.11);
  box(tray, board, 0, 0.031, 0, 0.45, 0.057, 0.31, true);
  box(tray, beam, 0, 0.063, -0.14, 0.48, 0.039, 0.04);
  box(world, board, 2.82, 0.46, 1.56, 0.68, 0.11, 0.54, true);
  const flame = addCopperLamp(world, 2.82, 0.516, 1.56, 0.80);

  const figure = makeFigures({ world, material, cloth, mesh, box, round, groupAt, articulated: true });
  const mother = figure(1.13, 0x815447, 0x574a3f, 'mother');
  const father = figure(1.19, 0x635d54, 0x594536, 'father');
  const child = figure(0.70, 0x566859, 0x806d54, 'boy');
  const steward = figure(1.07, 0x4b5f6e, 0x37434a, 'father');
  const youth = figure(0.98, 0x3f514a, 0x70624b, 'boy');
  youth.model.name = '少年政';
  const tablet = groupAt(world);
  box(tablet, material(0xc39861, timber), 0, 0, 0, 0.39, 0.047, 0.22, true);
  box(tablet, bronze, -0.147, 0.024, 0, 0.020, 0.006, 0.210);
  addInkRows(tablet, box, ink, { width: 0.27, length: 0.16, y: 0.024, columns: 5 });
  tablet.name = '木牍';
  steward.model.name = '管事';
  const tabletGrip = new THREE.Vector3();
  const tabletOnTable = new THREE.Vector3(1.25, 0.503, 2.15);
  const departure = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0.86, 0, 1.85),
    new THREE.Vector3(0.40, 0, 0.02), new THREE.Vector3(-3.52, 0, 0.15));
  const departurePoint = new THREE.Vector3();
  const departureDirection = new THREE.Vector3();
  const down = new THREE.Vector3(0, -1, 0);
  const local = new THREE.Vector3();
  const rotation = new THREE.Quaternion();
  const palm = new THREE.Vector3();

  function pose(actor, x, z, yaw, glance, pitch, { gait = 0, kneel = 0, mat = 0 } = {}) {
    actor.model.position.set(x, mix(0.022, 0.089, mat), z);
    actor.model.rotation.y = yaw;
    actor.rig.set(kneel, gait);
    actor.head.rotation.set(pitch + 0.12 * Math.sin(kneel * Math.PI), glance, 0);
    actor.arms.forEach((arm, index) => {
      const side = index === 0 ? -1 : 1;
      arm.rotation.set(-0.10 - 0.69 * kneel - 0.15 * Math.sin(kneel * Math.PI) - side * gait * 0.19,
        0, side * mix(0.29, 0.09, kneel));
    });
  }

  function reach(actor, arm, x, y, z, strength = 1) {
    const joint = actor.arms[arm];
    actor.model.updateWorldMatrix(true, true);
    const direction = joint.parent.worldToLocal(local.set(x, y, z)).sub(joint.position).normalize();
    joint.quaternion.slerp(rotation.setFromUnitVectors(down, direction), strength);
  }

  function frameRegister(phase, camera, age, captionOffset) {
    const atTable = phase === 'register-table';
    const arrival = phase === 'register-arrival';
    const towardChild = phase === 'register-child';
    const entrance = arrival ? ease(age, 90, 770) : 1;
    const kneel = arrival ? ease(age, 815, 1460) : 1;
    const turn = arrival || atTable ? 0 : ease(age, 70, 780);
    const notice = atTable ? 0 : ease(entrance, 0.28, 0.87);
    pose(child, 0.37, 1.27, mix(0.33, -0.25, notice),
      mix(0.04, towardChild ? -0.46 : -0.70, notice), 0.02 + 0.16 * turn, { kneel: 1, mat: 1 });
    pose(mother, -0.61, 1.25, mix(0.34, -0.13, notice),
      mix(0.14, -0.55, notice), 0.06 + (towardChild ? 0 : 0.12 * turn), { kneel: 1, mat: 1 });
    pose(father, 1.37, 1.25, mix(-0.39, -0.77, notice),
      mix(-0.16, -0.54, notice), 0.06, { kneel: 1, mat: 1 });

    if (!atTable) {
      const recipient = towardChild ? child : mother;
      const x = mix(-3.65, -1.53, entrance);
      const z = mix(0.13, 1.99, entrance);
      const facing = mix(0.91, 1.63, ease(entrance, 0.62, 1));
      const recipientAngle = Math.atan2(recipient.model.position.x - x, recipient.model.position.z - z);
      const yaw = mix(facing, recipientAngle, turn);
      pose(steward, x, z, yaw, 0.20 * turn, 0.10 + 0.17 * kneel,
        { gait: walkCycle(entrance, 7), kneel, mat: ease(entrance, 0.90, 1) });

      const extend = mix(0.37, 0.63, turn);
      reach(steward, 0, x + Math.sin(yaw) * extend, mix(1.05, 0.62, kneel),
        z + Math.cos(yaw) * extend, 1);
      steward.arms[0].localToWorld(tabletGrip.set(0, -0.36, 0.02));
      tablet.position.copy(tabletGrip);
      tablet.position.y += 0.048;
      tablet.rotation.set(0.34, yaw - 0.12, 0.04);

      if (turn) {
        const arm = towardChild ? 0 : 1;
        reach(recipient, arm, tablet.position.x, tablet.position.y + 0.05, tablet.position.z,
          0.81 * Math.sin(turn * Math.PI * 0.76));
      }
    }

    const arrivalX = mix(-1.10, -0.32, entrance);
    const targetX = atTable ? 0.01 : mix(arrivalX, towardChild ? -0.12 : -0.66, turn);
    const targetY = 1.04 - captionOffset * 0.73;
    camera.zoom = atTable ? 1.50 : mix(mix(1.28, 1.48, entrance), 1.72, turn);
    camera.updateProjectionMatrix();
    camera.position.set(targetX + mix(4.12, towardChild ? 2.95 : 2.18, turn), targetY + 8.15, 14.4);
    camera.lookAt(targetX, targetY, 1.27);
    camera.updateMatrixWorld();
    return age < (arrival ? 1540 : atTable ? 0 : 800);
  }

  function frameClosing(phase, camera, age, captionOffset) {
    const exiting = phase.startsWith('closing-exit-');
    const carrying = phase.endsWith('-carry');
    const establish = phase === 'closing-empty';
    const exitWalk = exiting ? ease(age, 570, 1720) : 0;
    const rise = exiting ? ease(age, 65, 580) : 0;
    const turnAway = exiting ? ease(age, 450, 740) : 0;
    const turnToSeat = phase === 'closing-leave' ? ease(age, 0, 730) : 0;
    departure.getPoint(exitWalk, departurePoint);
    departure.getTangent(exitWalk, departureDirection);
    const youthYaw = mix(0.28 + turnToSeat * 0.26, Math.atan2(departureDirection.x, departureDirection.z), turnAway);
    pose(youth, departurePoint.x, departurePoint.z, youthYaw,
      mix(0.29, 0, turnAway), mix(0.22 + turnToSeat * 0.09, 0.07, rise),
      { kneel: 1 - rise, gait: walkCycle(exitWalk, 10), mat: 1 - ease(exitWalk, 0.50, 0.75) });
    pose(mother, -0.61, 1.25, 0.20, mix(0.77, -0.70, exitWalk), 0.12, { kneel: 1, mat: 1 });

    tablet.position.copy(tabletOnTable);
    tablet.rotation.set(0, -0.17, 0);
    if (carrying) {
      const reachOut = exiting ? 1 : ease(age, 40, 440);
      const lift = exiting ? 1 : ease(age, 420, 1080);
      const hand = youth.arms[1];
      const shoulder = hand.getWorldPosition(palm);
      reach(youth, 1, mix(tabletOnTable.x, shoulder.x + Math.sin(youthYaw) * 0.27, lift),
        mix(tabletOnTable.y, shoulder.y - 0.20, lift),
        mix(tabletOnTable.z, shoulder.z + Math.cos(youthYaw) * 0.27, lift), reachOut);
      hand.localToWorld(tabletGrip.set(0, -0.36, 0.026));
      tabletGrip.y += 0.044;
      tablet.position.lerp(tabletGrip, lift);
      tablet.rotation.set(0.24 * lift, mix(-0.17, youthYaw, lift), 0.09 * lift);
    }

    const focus = establish ? 0 : exiting ? 1 - ease(age, 100, 1430) : 1;
    const targetX = mix(mix(0.24, -2.05, exitWalk), 0.74, focus);
    const targetY = mix(1.08, 0.82, focus) - 0.57 * captionOffset;
    camera.zoom = mix(1.43, 1.95, focus);
    camera.updateProjectionMatrix();
    camera.position.set(targetX + 2.85, targetY + 7.65, 14.4);
    camera.lookAt(targetX, targetY, 1.39);
    camera.updateMatrixWorld();
    return age < (exiting ? 1800 : carrying ? 1110 : 760);
  }

  let shot = '';
  let shotAt = 0;

  function frame(state, camera, marker, time, reduced, captionOffset) {
    const phase = state.storyBeat || 'threshold';
    if (phase !== shot) {
      shot = phase;
      shotAt = time;
    }
    const age = reduced ? QIN_SEATING_DURATION : time - shotAt;
    const register = phase.startsWith('register-');
    const closing = phase.startsWith('closing-');
    steward.model.visible = register && phase !== 'register-table';
    tablet.visible = closing || steward.model.visible;
    youth.model.visible = closing;
    child.model.visible = !closing;
    father.model.visible = !closing;
    tray.visible = !closing;
    cups[0].visible = !closing;
    cups[1].visible = !closing;
    warm.intensity = closing ? 0.6 : 16.7;
    daylight.intensity = closing ? 1.95 : 1.46;
    flame.visible = !closing;
    marker.hidden = true;
    flame.scale.y = 0.065 + (reduced ? 0 : 0.007 * Math.sin(Math.min(age, 860) * 0.014));
    if (register) return frameRegister(phase, camera, age, captionOffset);
    if (closing) return frameClosing(phase, camera, age, captionOffset);

    const threshold = phase === 'threshold';
    const greet = phase === 'greeting';
    const offerSon = phase === 'offer-son';
    const offerMother = phase === 'offer-mother';
    const seated = phase === 'seated';
    const entrance = threshold ? ease(age, 100, 850) : 1;
    const greeting = greet ? ease(age, 60, 720) : threshold ? 0 : 1;
    const offer = offerSon || offerMother ? ease(age, 130, 730) : 0;
    const offeredToMother = offerMother || (seated && state.sceneChoice === 'mother');
    const offeredToSon = offerSon || (seated && state.sceneChoice === 'father');
    const offerTravel = seated ? 1 : offer;
    const fatherX = 1.45 - greeting * 0.70 + (offeredToSon ? offerTravel * 0.30 : 0)
      - (offeredToMother ? offerTravel * 0.33 : 0);
    const fatherZ = 1.18 + greeting * 0.06 + (offeredToMother ? offerTravel * 0.60 : 0);

    if (seated) {
      const childStep = approach(age, 35, 790, 7);
      const motherStep = approach(age, 120, 950, 5);
      const fatherStep = approach(age, 160, 690, offeredToMother ? 3 : 1);
      pose(child, mix(-1.59, 0.37, childStep.travel), mix(1.83, 1.27, childStep.travel),
        walkFacing(childStep.travel, 0.95, 0.33), 0.04, 0.02,
        { ...childStep, mat: childStep.travel });
      pose(mother, mix(-2.38, -0.61, motherStep.travel), mix(1.72, 1.25, motherStep.travel),
        walkFacing(motherStep.travel, 0.79, 0.34), 0.14, 0.06,
        { ...motherStep, mat: ease(motherStep.travel, 0.32, 1) });
      pose(father, mix(fatherX, 1.37, fatherStep.travel), mix(fatherZ, 1.25, fatherStep.travel),
        mix(-0.83, -0.39, fatherStep.travel), -0.16, 0.06,
        { ...fatherStep, mat: 1 });
    } else {
      pose(child, mix(-3.25, -1.59, entrance), mix(0.02, 1.83, entrance),
        0.95, -0.13 + greeting * 0.17, threshold ? 0.18 : 0.02,
        { gait: walkCycle(entrance, 7) });
      pose(mother, mix(-3.84, -2.38, entrance), mix(0.05, 1.72, entrance),
        0.79, 0.14, 0.06, { gait: -walkCycle(entrance, 5) });
      pose(father, fatherX, fatherZ, -0.83, -0.16, greet ? 0.11 : 0.06, { mat: 1 });
    }
    if (threshold) {
      child.arms[0].rotation.x = -0.50 * entrance;
      child.arms[1].rotation.x = -0.83 * ease(age, 470, 810);
      child.arms[1].rotation.z = 0.11 + 0.24 * entrance;
    }

    const moved = offeredToMother ? offerTravel : 0;
    tray.position.x = -0.76 + moved * 0.58;
    tray.position.z = -0.11 + moved * 0.07;
    if (offerMother) {
      tray.getWorldPosition(palm);
      reach(father, 0, palm.x, palm.y + 0.13, palm.z, 0.89);
    } else if (offerSon) {
      reach(father, 0, 0.47, 0.50, 1.99, 0.94 * offer);
    }

    const close = greet || offerSon || offerMother;
    camera.zoom = close ? 1.48 : seated ? 1.50 : 1.15;
    camera.updateProjectionMatrix();
    const targetX = threshold ? -0.99 : close ? -0.59 : 0.01;
    const targetY = (close ? 1.27 : seated ? 1.04 : 1.46) - captionOffset * 0.73;
    camera.position.set(targetX + (seated ? 4.12 : 1.78), targetY + (seated ? 8.15 : 3.47), 14.4);
    camera.lookAt(targetX, targetY, 1.27);
    camera.updateMatrixWorld();
    return !reduced && age < (seated ? QIN_SEATING_DURATION : 880);
  }

  return { world, frame, controlsCameraZoom: true };
}

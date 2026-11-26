import * as THREE from './vendor/three.module.min.js';
import { makeFigures } from './figure.mjs';
import { grain } from './material-grain.mjs';
import { addCopperLamp, seam } from './scene-art.mjs';

export function createBirthWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0x222322);
  let seed = 259;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const material = (color, map) => new THREE.MeshStandardMaterial({ color, map, roughness: 0.94 });
  const cloth = grain('cloth', random);
  const wood = grain('wood', random);
  const plaster = grain('earth', random);
  const floor = material(0x725a47, plaster);
  const adobe = material(0x867461, plaster);
  const darkWood = material(0x49342a, wood);
  const reed = material(0xb49970, grain('reed', random));
  const trim = material(0x6d4836, wood);
  const binding = material(0xa57a4e, cloth);
  const fabric = material(0xc6aa7d, cloth);
  const wrap = material(0x826855, cloth);
  const skin = material(0xb78867);
  const cube = new THREE.BoxGeometry();
  const ball = new THREE.SphereGeometry(1, 16, 10);

  function groupAt(parent, x = 0, y = 0, z = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    parent.add(group);
    return group;
  }

  function mesh(parent, geometry, mat, x, y, z, cast = false) {
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(x, y, z);
    object.castShadow = cast;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }

  function box(parent, mat, x, y, z, sx, sy, sz, cast = false) {
    const object = mesh(parent, cube, mat, x, y, z, cast);
    object.scale.set(sx, sy, sz);
    return object;
  }

  function round(parent, mat, size, x, y, z, cast = false) {
    const object = mesh(parent, ball, mat, x, y, z, cast);
    object.scale.set(...size);
    return object;
  }

  const fill = new THREE.DirectionalLight(0xc0cfe0, 1.24);
  fill.position.set(1.5, 3.9, 1.7);
  world.add(fill, new THREE.HemisphereLight(0xa8b9c3, 0x594332, 0.77));
  const lamplight = new THREE.PointLight(0xffbb78, 18.0, 8.8, 1.9);
  lamplight.position.set(-1.75, 1.06, 1.93);
  world.add(lamplight);
  box(world, floor, 0, -0.16, 2, 14, 0.30, 10);
  box(world, adobe, 0, 1.68, -0.25, 12, 3.38, 0.45);
  box(world, darkWood, 0, 0.205, 0.035, 11.8, 0.24, 0.13);
  for (const x of [-4.7, -2.65, 2.65, 4.7]) box(world, darkWood, x, 1.64, 0.10, 0.18, 3.27, 0.23);
  box(world, darkWood, 0, 2.82, 0.10, 10.3, 0.14, 0.27);
  for (const x of [-2.65, 2.65]) {
    box(world, trim, x, 0.20, 0.12, 0.29, 0.32, 0.34, true);
    box(world, trim, x, 2.70, 0.14, 0.36, 0.12, 0.33);
  }
  for (const x of [0.86, 2.26]) box(world, trim, x, 1.68, 0.067, 0.078, 1.35, 0.096);
  for (const y of [1.04, 2.32]) box(world, trim, 1.56, y, 0.067, 1.48, 0.078, 0.096);
  const night = new THREE.MeshBasicMaterial({ color: 0x344756 });
  box(world, night, 1.56, 1.67, 0.02, 1.24, 1.14, 0.05);
  for (let i = 0; i <= 4; i += 1) {
    box(world, darkWood, 0.94 + i * 0.31, 1.67, 0.10, 0.052, 1.17, 0.10);
  }
  for (const y of [1.09, 1.65, 2.26]) box(world, darkWood, 1.56, y, 0.12, 1.31, 0.062, 0.09);

  box(world, reed, 0.22, 0.014, 1.96, 3.80, 0.04, 2.40);
  for (const x of [-1.65, 2.08]) box(world, trim, x, 0.038, 1.96, 0.067, 0.014, 2.39);
  box(world, darkWood, 0.25, 0.205, 1.84, 2.52, 0.29, 1.26);
  box(world, trim, 0.25, 0.293, 2.48, 2.48, 0.068, 0.042);
  box(world, reed, 0.25, 0.38, 1.84, 2.46, 0.089, 1.19);
  for (const x of [-0.93, 1.42]) box(world, wrap, x, 0.449, 1.83, 0.063, 0.064, 1.15);
  box(world, fabric, 0.30, 0.435, 1.86, 0.96, 0.065, 0.66);
  box(world, darkWood, -1.76, 0.61, 1.91, 0.82, 0.11, 0.61);
  for (const x of [-2.05, -1.46]) box(world, darkWood, x, 0.29, 1.92, 0.11, 0.56, 0.43);
  const flame = addCopperLamp(world, -1.76, 0.667, 1.92, 0.75);

  const figure = makeFigures({ world, material, cloth, mesh, box, round, groupAt, articulated: true });
  const mother = figure(1.13, 0x815447, 0x574a3f, 'mother');
  const father = figure(1.19, 0x635d54, 0x594536, 'father');
  mother.model.position.set(-0.32, 0.02, 1.78);
  mother.model.rotation.y = 0.96;
  mother.rig.set(0.83, 0);
  father.model.position.set(0.84, 0.02, 1.83);
  father.model.rotation.y = -0.71;
  father.rig.set(0.77, 0);
  const child = groupAt(world);
  round(child, fabric, [0.30, 0.129, 0.151], -0.018, 0.003, 0);
  round(child, wrap, [0.20, 0.129, 0.151], -0.085, 0.014, 0);
  round(child, fabric, [0.138, 0.129, 0.139], 0.217, 0.007, 0.015);
  round(child, skin, [0.097, 0.095, 0.096], 0.222, 0.050, 0.081);
  for (const x of [-0.16, -0.02]) {
    mesh(child, seam([[x - 0.06, 0.016, 0.125], [x - 0.025, 0.095, 0.102], [x + 0.033, 0.127, 0.03]], 0.012),
      binding, 0, 0, 0);
  }
  const infantHand = round(child, skin, [0.031, 0.024, 0.029], 0.071, 0.096, 0.123);
  const fingertip = round(mother.arms[1], skin, [0.019, 0.034, 0.018], 0.015, -0.383, 0.017);
  fingertip.visible = false;

  const target = new THREE.Vector3();
  const support = new THREE.Vector3();
  const down = new THREE.Vector3(0, -1, 0);
  const handRotation = new THREE.Quaternion();
  function reach(actor, arm, worldPoint, extension = 0) {
    const joint = actor.arms[arm];
    actor.model.updateWorldMatrix(true, true);
    target.copy(joint.parent.worldToLocal(target.copy(worldPoint))).sub(joint.position);
    joint.scale.y = THREE.MathUtils.clamp(target.length() / (0.345 + extension), 0.84, 1.53);
    joint.quaternion.copy(handRotation.setFromUnitVectors(down, target.normalize()));
  }

  let cue = '';
  let started = 0;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    if (cue !== state.storyBeat) {
      started = time;
      cue = state.storyBeat;
    }
    const elapsed = reduced ? 2000 : time - started;
    const lift = cue === 'lift' ? THREE.MathUtils.smoothstep(elapsed, 80, 760)
      : ['hold', 'name', 'grasp'].includes(cue) ? 1 : 0;
    child.position.set(0.12 + 0.22 * lift, 0.56 + 0.295 * lift, 1.98 + 0.035 * lift);
    child.rotation.set(-0.11 + 0.06 * lift, -0.21 + 0.43 * lift, -0.13 + 0.20 * lift);
    mother.head.rotation.set(0.18, 0.16, 0);
    father.head.rotation.set(0.19, -0.27, 0);
    const grasp = cue === 'grasp' ? THREE.MathUtils.smoothstep(elapsed, 190, 580) : 0;
    fingertip.visible = cue === 'grasp';
    infantHand.position.z = 0.123 + grasp * 0.048;
    infantHand.rotation.y = 0.31 * grasp;
    child.updateWorldMatrix(true, true);
    reach(father, 0, child.localToWorld(support.set(0.069, -0.118, 0.055)));
    if (cue === 'grasp') {
      reach(mother, 1, child.localToWorld(support.copy(infantHand.position)), 0.043);
    } else {
      reach(mother, 1, child.localToWorld(support.set(-0.234, -0.048, 0.118)));
    }
    flame.scale.y = reduced ? 0.078 : 0.076 + Math.sin(Math.min(elapsed, 760) * 0.023) * 0.014;
    const close = cue === 'grasp' || cue === 'name';
    const comparisonShot = document.body.dataset.layout === 'new';
    const centerX = comparisonShot ? 0.24 : close ? 0.34 : -0.18;
    const centerY = comparisonShot ? 0.90 : (close ? 1.03 : 1.45) - captionOffset * (close ? 0.11 : 0.66);
    camera.zoom = close ? 2.63 : 1.55;
    if (comparisonShot) {
      const wide = (camera.right - camera.left) / (camera.top - camera.bottom) > 1.85;
      camera.zoom = wide ? (close ? 3.0 : 2.35) : (close ? 4.1 : 3.15);
    }
    camera.updateProjectionMatrix();
    camera.position.set(centerX + 0.66, centerY + 3.15, 15.40);
    camera.lookAt(centerX, centerY, comparisonShot ? 1.98 : close ? 2.06 : 1.32);
    camera.updateMatrixWorld();
    marker.hidden = true;
    return !reduced && elapsed < 800;
  }

  return { world, frame, controlsCameraZoom: true };
}

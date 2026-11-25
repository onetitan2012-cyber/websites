import * as THREE from './vendor/three.module.min.js';

export const THIGH = 0.325;
export const SHIN = 0.315;
export const QIN_SEATING_DURATION = 2050;
const ANKLE_Y = 0.081;
const HALF_STANCE = 0.105;
const UP = new THREE.Vector3(0, 1, 0);

const clamp = THREE.MathUtils.clamp;
const ease = THREE.MathUtils.smoothstep;

export function seatingPose(progress = 0, gait = 0) {
  const sit = clamp(progress, 0, 1);
  const bend = ease(sit, 0, 0.84);
  const settle = ease(sit, 0.38, 1);
  const shinPitch = 0.17 + bend * 1.37;
  const thighPitch = 0.17 + bend * 1.02 + settle * 0.05;
  const ankleZ = -0.22 * bend;
  const kneeY = ANKLE_Y + Math.cos(shinPitch) * SHIN;
  const kneeZ = ankleZ + Math.sin(shinPitch) * SHIN;
  const hip = new THREE.Vector3(0, kneeY + Math.cos(thighPitch) * THIGH, kneeZ - Math.sin(thighPitch) * THIGH);
  const legs = [-1, 1].map(side => {
    const step = sit ? 0 : gait * side;
    const joint = new THREE.Vector3(side * HALF_STANCE, hip.y, hip.z);
    const ankle = new THREE.Vector3(joint.x, ANKLE_Y + 0.053 * Math.max(0, step), ankleZ + step * 0.155);
    const delta = ankle.clone().sub(joint);
    const length = Math.min(delta.length(), THIGH + SHIN - 0.0001);
    const along = (THIGH ** 2 - SHIN ** 2 + length ** 2) / (2 * length);
    const height = Math.sqrt(Math.max(0, THIGH ** 2 - along ** 2));
    const direction = delta.normalize();
    const forward = new THREE.Vector3(0, direction.z, -direction.y);
    const knee = joint.clone().addScaledVector(direction, along).addScaledVector(forward, height);
    return { joint, knee, ankle: joint.clone().addScaledVector(direction, length) };
  });
  return { hip, legs, lean: 0.27 * Math.sin(Math.PI * sit) + 0.045 * sit, sit };
}

export function makeKneelingRig(model, torso, fabric, shoes, mesh, round) {
  const links = [-1, 1].map(() => ({
    thigh: mesh(model, new THREE.CylinderGeometry(0.096, 0.104, THIGH + 0.06, 12), fabric, 0, 0, 0, true),
    shin: mesh(model, new THREE.CylinderGeometry(0.066, 0.073, SHIN + 0.053, 11), fabric, 0, 0, 0, true),
    shoe: round(model, shoes, [0.063, 0.046, 0.112], 0, 0, 0, true),
  }));

  const hem = new THREE.CylinderGeometry(0.215, 0.292, 0.41, 20, 5, true);
  const cloth = mesh(model, hem, fabric, 0, 0, 0, true);
  cloth.frustumCulled = false;
  const points = hem.attributes.position;
  const rest = points.array.slice();
  const delta = new THREE.Vector3();
  function link(object, from, to) {
    object.position.copy(from).lerp(to, 0.5);
    object.quaternion.setFromUnitVectors(UP, delta.copy(from).sub(to).normalize());
  }

  return {
    set(sit, gait) {
      const pose = seatingPose(sit, gait);
      torso.position.copy(pose.hip);
      torso.rotation.x = pose.lean;
      pose.legs.forEach(({ joint, knee, ankle }, index) => {
        const bones = links[index];
        link(bones.thigh, joint, knee);
        link(bones.shin, knee, ankle);
        bones.shoe.position.copy(ankle);
        bones.shoe.position.y -= 0.026;
        bones.shoe.position.z += THREE.MathUtils.lerp(0.038, 0.015, sit);
        bones.shoe.rotation.x = -0.34 * sit;
      });

      const knee = pose.legs[0].knee.clone().add(pose.legs[1].knee).multiplyScalar(0.5);
      for (let i = 0; i < points.count; i += 1) {
        const index = i * 3;
        const fall = (0.205 - rest[index + 1]) / 0.41;
        const taper = THREE.MathUtils.lerp(1, 0.88, sit * fall);
        const centerY = THREE.MathUtils.lerp(pose.hip.y + 0.093,
          THREE.MathUtils.lerp(0.286, knee.y + 0.077, sit), fall);
        const centerZ = THREE.MathUtils.lerp(pose.hip.z, THREE.MathUtils.lerp(0, knee.z, sit), fall);
        points.setXYZ(i, rest[index] * taper, centerY, centerZ + rest[index + 2] * taper);
      }
      points.needsUpdate = true;
      hem.computeVertexNormals();
    },
  };
}

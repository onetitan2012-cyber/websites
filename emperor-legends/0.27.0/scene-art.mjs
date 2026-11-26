import * as THREE from './vendor/three.module.min.js';

export function lathe(points, segments = 24) {
  return new THREE.LatheGeometry(points.map(([radius, y]) => new THREE.Vector2(radius, y)), segments);
}

export function seam(points, radius) {
  const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
  return new THREE.TubeGeometry(curve, points.length * 4, radius, 6, false);
}

const up = new THREE.Vector3(0, 1, 0);
const tileMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.86 });
const shades = [0x566061, 0x4c5353, 0x515a58, 0x666965, 0x5d615b];

export function addTileCourses(parent, { width, run, rise, eave, z, spacing = 0.20, courses = 3, back = true }) {
  const columns = Math.ceil(width / spacing);
  const sides = back ? [-1, 1] : [1];
  const step = Math.hypot(run, rise) / courses;
  const ribs = new THREE.InstancedMesh(new THREE.CylinderGeometry(spacing * 0.37, spacing * 0.43, step * 1.035, 9),
    tileMaterial, columns * courses * sides.length);
  const ends = new THREE.InstancedMesh(new THREE.CylinderGeometry(spacing * 0.43, spacing * 0.43, 0.032, 12),
    tileMaterial, columns * sides.length);
  const pin = new THREE.Object3D();
  const slope = new THREE.Vector3();
  const color = new THREE.Color();
  let ribIndex = 0;
  let endIndex = 0;
  for (const side of sides) {
    pin.quaternion.setFromUnitVectors(up, slope.set(0, -rise, run * side).normalize());
    for (let column = 0; column < columns; column += 1) {
      const x = (column + 0.5) * width / columns - width / 2;
      for (let course = 0; course < courses; course += 1) {
        const fraction = (course + 0.5) / courses;
        pin.position.set(x, eave + rise * (1 - fraction) + 0.071 + 0.003 * course, z + side * run * fraction);
        pin.updateMatrix();
        ribs.setMatrixAt(ribIndex, pin.matrix);
        ribs.setColorAt(ribIndex++, color.setHex(shades[(3 * column + 2 * course) % shades.length]));
      }
      pin.position.set(x, eave + 0.069, z + side * (run + 0.016));
      pin.updateMatrix();
      ends.setMatrixAt(endIndex, pin.matrix);
      ends.setColorAt(endIndex++, color.setHex(shades[column % shades.length]));
    }
  }
  ribs.receiveShadow = true;
  ends.receiveShadow = true;
  parent.add(ribs, ends);
}

const copper = new THREE.MeshStandardMaterial({ color: 0x886b4e, metalness: 0.31, roughness: 0.52 });
const rim = new THREE.MeshStandardMaterial({ color: 0xb19a6f, metalness: 0.38, roughness: 0.43 });
const oil = new THREE.MeshStandardMaterial({ color: 0x403a28, roughness: 0.50 });
const lampFoot = lathe([[0, 0], [0.129, 0], [0.148, 0.016], [0.143, 0.043],
  [0.091, 0.072], [0.049, 0.141], [0.047, 0.207], [0.083, 0.257], [0.108, 0.281]]);
const lampBowl = lathe([[0.087, 0.255], [0.130, 0.272], [0.164, 0.315], [0.160, 0.341],
  [0.135, 0.341], [0.112, 0.316], [0, 0.309]]);
const flameShape = new THREE.SphereGeometry(1, 14, 10);
const flameColor = new THREE.MeshBasicMaterial({ color: 0xffdfa8 });

export function addCopperLamp(parent, x, y, z, scale = 1) {
  const base = new THREE.Group();
  parent.add(base);
  base.position.set(x, y, z);
  base.scale.setScalar(scale);
  const foot = new THREE.Mesh(lampFoot, copper);
  const bowl = new THREE.Mesh(lampBowl, rim);
  const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.021, 0.052, 9), oil);
  wick.position.set(-0.012, 0.351, 0.018);
  for (const object of [foot, bowl]) {
    object.castShadow = true;
    object.receiveShadow = true;
  }
  const flame = new THREE.Mesh(flameShape, flameColor);
  flame.position.set(-0.012, 0.421, 0.018);
  flame.scale.set(0.031, 0.068, 0.027);
  base.add(foot, bowl, wick, flame);
  return flame;
}

export function addInkRows(parent, box, ink, { width, length, y, columns = 5, rows = 3 }) {
  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      const x = width * ((column + 0.5) / columns - 0.5);
      const z = length * ((row + 0.5) / rows - 0.5);
      const stroke = box(parent, ink, x, y, z, width * 0.042, 0.0024, length * (0.10 + (column + row) % 3 * 0.024));
      stroke.rotation.y = ((column * 3 + 2 * row) % 7 - 3) * 0.154;
    }
  }
}

import * as THREE from './vendor/three.module.min.js';

export function makeCrownArt() {
  const cube = new THREE.BoxGeometry();
  const sphere = new THREE.SphereGeometry(1, 20, 14);
  let seed = 238;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  function material(color, map = null, roughness = 0.8, metalness = 0) {
    return new THREE.MeshStandardMaterial({ color, map, roughness, metalness });
  }

  function texture(paint, size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    paint(context, size);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    return map;
  }

  function fiber(context, count, width, height, alpha) {
    for (let index = 0; index < count; index += 1) {
      context.fillStyle = random() > 0.47 ? 'rgba(48,37,27,' + alpha + ')' : 'rgba(255,244,219,' + alpha + ')';
      context.fillRect(random() * 256, random() * 256, 0.5 + random() * width, 0.7 + random() * height);
    }
  }

  const earth = texture(context => {
    context.fillStyle = '#dfd1b7';
    context.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 19) {
      context.fillStyle = 'rgba(91,59,37,0.08)';
      context.fillRect(0, y + random() * 4, 256, 0.7 + random());
      context.fillStyle = 'rgba(248,225,178,0.13)';
      context.fillRect(0, y + 5, 256, 1.5);
    }
    fiber(context, 4300, 2, 2, 0.05);
  });

  const wood = texture(context => {
    context.fillStyle = '#d2c1ac';
    context.fillRect(0, 0, 256, 256);
    fiber(context, 2100, 1.6, 73, 0.045);
    for (let x = 0; x < 256; x += 5) {
      context.strokeStyle = x % 15 ? 'rgba(87,59,39,0.07)' : 'rgba(246,221,174,0.18)';
      context.lineWidth = 0.58 + random() * 1.1;
      context.beginPath();
      context.moveTo(x, 0);
      context.bezierCurveTo(x + 3, 77, x - 2, 178, x, 256);
      context.stroke();
    }
  });

  const cloth = texture(context => {
    context.fillStyle = '#e6dfd1';
    context.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256; i += 5) {
      context.fillStyle = 'rgba(59,42,29,0.07)';
      context.fillRect(i, 0, 1, 256);
      context.fillStyle = 'rgba(255,250,226,0.20)';
      context.fillRect(0, i, 256, 1);
    }
    fiber(context, 1900, 1.8, 2.2, 0.045);
  });

  const matTexture = texture(context => {
    context.fillStyle = '#c5ae7d';
    context.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 4) {
      context.fillStyle = 'rgba(85,58,32,0.26)';
      context.fillRect(0, y, 256, 1.0);
      context.fillStyle = 'rgba(255,229,165,0.22)';
      context.fillRect(0, y + 1, 256, 0.8);
    }
    for (let x = 0; x < 256; x += 8) {
      context.fillStyle = 'rgba(248,227,183,0.19)';
      context.fillRect(x + 1, 0, 1, 256);
    }
  });

  const trimPattern = texture((context, size) => {
    context.fillStyle = '#3c2b29';
    context.fillRect(0, 0, size, size);
    context.strokeStyle = '#9b523f';
    context.lineWidth = 2.5;
    for (const y of [13, 24, size - 13, size - 24]) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(size, y);
      context.stroke();
    }
    for (let x = 16; x < size; x += 32) {
      context.beginPath();
      context.moveTo(x - 13, 52);
      context.lineTo(x, 34);
      context.lineTo(x + 13, 52);
      context.lineTo(x, 70);
      context.closePath();
      context.stroke();
      context.fillStyle = '#bb7654';
      context.fillRect(x - 2, 50, 4, 4);
    }
  }, 104);

  function groupAt(parent, x = 0, y = 0, z = 0) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    parent.add(group);
    return group;
  }

  function mesh(parent, geometry, mat, x = 0, y = 0, z = 0, cast = false) {
    const item = new THREE.Mesh(geometry, mat);
    item.position.set(x, y, z);
    item.castShadow = cast;
    item.receiveShadow = true;
    parent.add(item);
    return item;
  }

  function box(parent, mat, x, y, z, width, height, depth, cast = false) {
    const item = mesh(parent, cube, mat, x, y, z, cast);
    item.scale.set(width, height, depth);
    return item;
  }

  function round(parent, mat, size, x, y, z, cast = false) {
    const item = mesh(parent, sphere, mat, x, y, z, cast);
    item.scale.set(...size);
    return item;
  }

  function profile(parent, mat, points, x = 0, y = 0, z = 0, cast = false, segments = 24) {
    return mesh(parent, new THREE.LatheGeometry(points.map(([radius, height]) => new THREE.Vector2(radius, height)), segments),
      mat, x, y, z, cast);
  }

  function thread(parent, mat, points, radius) {
    const path = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
    return mesh(parent, new THREE.TubeGeometry(path, points.length * 4, radius, 6, false), mat);
  }

  function beamPattern(parent, x, y, z, width, height, repeat) {
    const pattern = trimPattern.clone();
    pattern.repeat.x = repeat;
    pattern.needsUpdate = true;
    const surface = material(0xffffff, pattern, 0.7);
    return mesh(parent, new THREE.PlaneGeometry(width, height), surface, x, y, z);
  }

  return { material, random, texture, earth, wood, cloth, matTexture, groupAt, mesh, box, round, profile, thread, beamPattern };
}

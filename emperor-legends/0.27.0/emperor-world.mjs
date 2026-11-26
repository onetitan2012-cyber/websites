import * as THREE from './vendor/three.module.min.js';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';
import { addCopperLamp, addInkRows, addTileCourses } from './scene-art.mjs';

const shots = {
  memory: { x: -1.62, y: 1.15, z: 1.78, zoom: 2.28, height: 6.2, side: 2.8 },
  gate: { x:-0.59, y:1.85, z:-2.89, zoom:2.90, height:3.0, side:1.0 },
  clerks: { x:-0.95, y:1.49, z:0.86, zoom:4.45, height:2.8, side:1.0 },
  signed: { x:-1.16, y:1.12, z:1.18, zoom:3.16, height:4.5, side:0.8 },
  proposal: { x:-1.58, y:0.66, z:1.81, zoom:5.8, height:20, side:0 },
  closed: { x:-1.43, y:0.75, z:1.83, zoom:3.62, height:10, side:0.6 },
  title: { x: -1.52, y: 1.10, z: 1.50, zoom: 1.86, height: 8.3, side: 2.0 },
  legend: { x: -1.65, y: 1.54, z: 1.03, zoom: 2.65, height: 3.25, side: 4.5 },
};
const { lerp, smoothstep } = THREE.MathUtils;

export function createEmperorWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0xa5a69b);
  world.fog = new THREE.Fog(0xa5a69b, 14, 30);
  const art = makeCrownArt();
  const { box, groupAt, material, round, earth, wood, cloth, beamPattern } = art;
  const stone = [0x8c8e82, 0xa4a092, 0xb2a692].map(color => material(color, earth));
  const rammed = material(0xa59273, earth);
  const lacquer = material(0x70463d, wood, 0.63);
  const beam = material(0x48403a, wood);
  const tile = material(0x565852);
  const red = material(0x7c4c40, cloth);
  const bronze = material(0xa48658, null, 0.51, 0.35);
  const reed = material(0xb1a07c, art.matTexture);
  const bamboo = [0xb59b70, 0xbfa87c, 0xc5ad83].map(color => material(color, wood));
  const ink = material(0x4b3931);
  const sun = new THREE.DirectionalLight(0xffe3b7, 2.2);
  sun.position.set(-6, 10, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 7.5, bottom: -7.5, far: 32 });
  sun.shadow.normalBias = 0.028;
  world.add(sun, new THREE.HemisphereLight(0xd7dfdb, 0x67564a, 1.67));
  const candle = new THREE.PointLight(0xffbe77, 4.5, 3.7, 2);
  candle.position.set(-2.86, 1.14, 2.13);
  world.add(candle);

  box(world, rammed, 0, -0.21, -1.9, 19, 0.4, 14);
  for (let row = 0; row < 12; row += 1) {
    for (let column = 0; column < 11; column += 1) {
      box(world, stone[(column * 2 + row) % 3], (column - 5) * 1.24 + row % 2 * 0.16,
        0.012, 4.54 - row * 0.74, 1.21, 0.044, 0.715);
    }
  }

  function roof(parent, width, run, rise, eave, z) {
    for (const side of [-1, 1]) {
      const slope = box(parent, tile, 0, eave + rise / 2, z + side * run / 2,
        width, 0.115, Math.hypot(run, rise), true);
      slope.rotation.x = side * Math.atan2(rise, run);
    }
    box(parent, tile, 0, eave + rise + 0.12, z, width + 0.19, 0.13, 0.18, true);
    addTileCourses(parent, { width, run, rise, eave, z, spacing: 0.24 });
  }

  const hall = groupAt(world, 0, 0.038, -4.27);
  hall.name = 'audience-hall';
  box(hall, rammed, 0, 0.39, 0, 11.4, 0.78, 3.5, true);
  box(hall, stone[2], 0, 0.79, 0, 11.61, 0.11, 3.61, true);
  for (let step = 0; step < 4; step += 1) {
    box(hall, stone[2 - step % 2], 0, 0.073 + step * 0.104, 2.75 - step * 0.264,
      3.37, 0.145 + step * 0.208, 0.34 + step * 0.055, true);
  }
  box(hall, rammed, 0, 2.04, -1.06, 10.2, 2.43, 0.34, true);
  for (const side of [-1, 1]) {
    box(hall, lacquer, side * 3.06, 1.99, -0.86, 3.33, 2.31, 0.10, true);
    for (let rib = 0; rib < 13; rib += 1) {
      box(hall, beam, side * (1.44 + rib * 0.258), 2.02, -0.783, 0.048, 2.18, 0.058);
    }
    box(hall, red, side * 2.49, 2.29, 1.38, 0.56, 1.32, 0.037, true);
    box(hall, bronze, side * 2.49, 2.98, 1.38, 0.72, 0.041, 0.067);
    box(hall, bronze, side * 2.49, 1.651, 1.405, 0.52, 0.035, 0.017);
  }
  for (const x of [-4.87, -3.32, -1.39, 1.39, 3.32, 4.87]) {
    box(hall, stone[1], x, 0.91, 1.19, 0.45, 0.15, 0.44, true);
    box(hall, lacquer, x, 2.06, 1.19, 0.23, 2.29, 0.24, true);
    box(hall, beam, x, 3.25, 1.18, 0.61, 0.16, 0.37, true);
  }
  box(hall, beam, 0, 3.38, 1.22, 11.05, 0.18, 0.34, true);
  beamPattern(hall, 0, 3.385, 1.401, 10.5, 0.13, 12);
  box(hall, beam, 0, 2.05, -0.839, 2.26, 2.48, 0.19, true);
  for (const side of [-1, 1]) {
    box(hall, lacquer, side * 0.52, 2.02, -0.701, 0.97, 2.18, 0.09, true);
    round(hall, bronze, [0.066, 0.073, 0.035], side * 0.20, 1.94, -0.634);
    const wing = groupAt(world, side * 6.15, 0, -6.58);
    box(wing, rammed, 0, 1.22, 0, 4.22, 2.44, 1.9, true);
    roof(wing, 4.52, 1.17, 0.47, 2.41, 0);
  }
  roof(hall, 11.58, 1.92, 0.84, 3.47, -0.19);
  addCopperLamp(hall, -4.06, 0.85, 1.36, 1.38);
  addCopperLamp(hall, 4.06, 0.85, 1.36, 1.38);

  const study = groupAt(world, -1.55, 0.04, 1.72);
  box(study, reed, -0.16, 0.009, 0, 4.62, 0.033, 2.67);
  const desk = groupAt(study, 0, 0.02, 0.04);
  desk.name = 'memory-desk';
  box(desk, lacquer, 0, 0.462, 0, 3.52, 0.113, 1.30, true);
  for (const x of [-1.53, 1.53]) {
    for (const z of [-0.48, 0.48]) box(desk, beam, x, 0.21, z, 0.135, 0.43, 0.13, true);
    box(desk, beam, x, 0.25, 0, 0.101, 0.079, 1.09, true);
  }
  box(desk, beam, 0, 0.395, 0.573, 3.32, 0.068, 0.068, true);
  beamPattern(desk, 0, 0.45, 0.656, 3.42, 0.068, 6);
  const lacquerEdge = groupAt(desk, 0, 0.45, 0.657);
  for (const side of [-1, 1]) {
    box(lacquerEdge, red, 0, side * 0.039, 0, 3.37, 0.008, 0.006);
  }
  const oldTablet = groupAt(desk, 0.73, 0.548, 0.24);
  oldTablet.name = 'kept-tablet';
  oldTablet.rotation.y = -0.27;
  box(oldTablet, bamboo[1], 0, 0, 0, 0.28, 0.047, 0.63, true);
  addInkRows(oldTablet, box, ink, { width: 0.21, length: 0.53, y: 0.024, columns: 2, rows: 5 });
  const stoneBox = groupAt(desk, -0.61, 0.519, 0.21);
  stoneBox.name = 'stone-box';
  box(stoneBox, beam, 0, 0.059, 0, 0.61, 0.117, 0.40, true);
  box(stoneBox, lacquer, 0, 0.137, 0, 0.63, 0.045, 0.42, true);
  box(stoneBox, bronze, -0.01, 0.111, 0.214, 0.131, 0.063, 0.016);
  const oldStone = round(desk, stone[2], [0.117, 0.068, 0.102], -0.60, 0.588, 0.23, true);
  oldStone.name = 'handan-pebble';
  addCopperLamp(desk, -1.35, 0.519, -0.25, 1.18);

  const seal = groupAt(desk, 1.38, 0.519, -0.30);
  seal.name = 'seal';
  box(seal, lacquer, 0, 0.043, 0, 0.55, 0.082, 0.47, true);
  const sealStone = material(0xb0a886, null, 0.53);
  box(seal, sealStone, 0, 0.14, 0, 0.33, 0.11, 0.32, true);
  round(seal, sealStone, [0.112, 0.079, 0.073], 0, 0.236, 0, true);

  const folio = groupAt(desk, -0.02, 0.547, 0.035);
  folio.name = 'legend-folio';
  folio.rotation.y = -0.08;
  const slats = Array.from({ length: 12 }, (_, index) => {
    const hinge = groupAt(folio, (index - 5.5) * 0.167, 0, -0.405);
    const slat = groupAt(hinge, 0, 0, 0.365);
    box(slat, bamboo[index % 3], 0, 0, 0, 0.159, 0.03, 0.73, true);
    addInkRows(slat, box, ink, { width: 0.118, length: 0.54, y: 0.016, columns: 3, rows: 5 });
    for (const z of [-0.27, 0.27]) box(slat, red, 0, 0.019, z, 0.173, 0.013, 0.026);
    return hinge;
  });

  const emperor = makeCrownFigure(world, art, 'king', 1.38);
  emperor.model.position.set(-1.78, 0.066, 0.66);
  emperor.model.rotation.y = 0.19;
  emperor.rig.set(0, 0);
  // The legend is a retrospective portrait, after the court has proclaimed the title.
  const mian = groupAt(emperor.head, 0, 0.40, -0.014);
  mian.rotation.x = 0.065;
  const blackLacquer = material(0x292b28, wood, 0.45);
  box(mian, red, 0, -0.015, 0, 0.40, 0.024, 0.52);
  box(mian, blackLacquer, 0, 0.008, 0, 0.415, 0.035, 0.54, true);
  box(mian, bronze, 0, -0.088, -0.016, 0.37, 0.019, 0.019);
  const beadMaterial = material(0xd8cfad, null, 0.41);
  const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.013, 8, 6), beadMaterial, 60);
  const beadPosition = new THREE.Matrix4();
  let bead = 0;
  for (const edge of [-1,1]) {
    for (const x of [-0.175,-0.105,-0.035,0.035,0.105,0.175]) {
      const z = edge * 0.25;
      box(mian, bronze, x, -0.099, z, 0.009, 0.195, 0.009);
      for (let i=0;i<5;i++) {
        beads.setMatrixAt(bead++, beadPosition.makeTranslation(x,-0.037-i*0.039,z));
      }
    }
  }
  mian.add(beads);
  const delegates = [
    { role: 'lisi', x: 1.28, z: -1.64, angle: -0.48 },
    { role: 'official', x: 2.00, z: -2.12, angle: -0.34 },
    { role: 'wang', x: -2.81, z: -2.11, angle: 0.42 },
  ].map(({ role, x, z, angle }) => {
    const figure = makeCrownFigure(world, art, role, 1.22);
    figure.model.position.set(x, 0.035, z);
    figure.model.rotation.y = angle;
    figure.rig.set(0, 0);
    return figure;
  });

  const [lisi, colleague, courier] = delegates;
  const herald = makeCrownFigure(world, art, 'keeper', 1.18);
  herald.rig.set(0,0);
  herald.model.position.set(-1.01, 0.887, -2.68);
  herald.model.rotation.y = 0.30;
  // A chip in the lacquer exposes light wood at the messenger's shoulder.
  box(hall, bamboo[0], -1.35, 1.77, 1.318, 0.105, 0.078, 0.013).rotation.z = 0.37;

  function tiedRoll(parent, x, y, z, tie) {
    const roll = groupAt(parent,x,y,z);
    for (let i=0; i<5; i++) {
      const angle = i * 2 * Math.PI / 5;
      box(roll,bamboo[i%3],0,0.05*Math.sin(angle),0.06*Math.cos(angle),0.56,0.065,0.085,true);
    }
    for (const side of [-1,1]) box(roll,tie,side*0.14,0,0,0.037,0.163,0.16);
    return roll;
  }
  const draft = tiedRoll(world,0,0,0,bronze);
  const closedFolio = tiedRoll(desk,0.08,0.62,0.09,red);
  closedFolio.scale.set(1.9,1.15,1.35);
  const scroll = groupAt(desk,0,0.554,0.02);
  for (let i=0;i<9;i++) {
    box(scroll,bamboo[i%3],(i-4)*0.145,0,0,0.14,0.044,0.77,true);
  }
  for (const z of [-0.31,0.31]) box(scroll,bronze,0,0.026,z,1.29,0.012,0.021);
  function writeOn(parent, label, width, depth, height) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 156px "Songti SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#34271b';
    ctx.fillText(label,256,117,490);
    const brush = new THREE.CanvasTexture(canvas);
    brush.colorSpace = THREE.SRGBColorSpace;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(width,depth),
      new THREE.MeshBasicMaterial({map:brush,transparent:true,depthWrite:false,fog:false,toneMapped:false}));
    face.rotation.x = -Math.PI/2;
    face.position.y = height;
    parent.add(face);
  }
  writeOn(scroll,'泰皇',1.03,0.53,0.029);
  const newTitle = groupAt(desk,1.02,0.563,0.15);
  box(newTitle,bamboo[1],0,0,0,0.57,0.045,0.43,true);
  writeOn(newTitle,'皇帝',0.50,0.29,0.025);
  const writ = groupAt(world);
  box(writ,bamboo[1],0,0,0,0.13,0.49,0.05,true);
  for (let i=0;i<4;i++) box(writ,ink,0,0.08-i*0.057,0.027,0.065,0.012,0.004);
  const leftHand = new THREE.Vector3();
  const rightHand = new THREE.Vector3();
  const deskPoint = new THREE.Vector3();
  function palm(figure, side, target) {
    return figure.arms[side].localToWorld(target.set(0,-0.34,0.023));
  }

  // Frame the performers and the object the player is reading in this shot.
  const headroom = new THREE.Vector3();
  const bounds = new THREE.Box2();
  const screen = new THREE.Vector2();
  function protectShot(camera, beat) {
    if (beat === 'proposal' || beat === 'closed') return;
    bounds.makeEmpty();
    function include(actor, x, y, z) {
      actor.localToWorld(headroom.set(x, y, z)).project(camera);
      bounds.expandByPoint(screen.set(headroom.x, headroom.y));
    }
    if (beat === 'summons' || beat === 'edict') {
      include(herald.head, 0, 0.42, 0);
      include(courier.head, 0, 0.42, 0);
      include(herald.model, 0, 0.55, 0);
    } else {
      include(emperor.head, 0, 0.46, 0);
      if (['present', 'signed', 'title'].includes(beat)) {
        include(lisi.head, 0, 0.42, 0);
        include(colleague.head, 0, 0.42, 0);
      }
      if (beat === 'present') include(lisi.model, 0, 0.72, 0.28);
      else {
        include(desk, -0.84, 0.52, 0.36);
        include(desk, 0.87, 0.52, 0.36);
      }
    }
    const {min, max} = bounds;
    const factor = Math.min(1, 1.68 / Math.max(0.01, max.x - min.x),
      1.48 / Math.max(0.01, max.y - min.y));
    camera.zoom *= factor;
    camera.updateProjectionMatrix();
    // Move only as far as necessary, leaving headroom and a band for captions.
    const shiftX = Math.max(0, max.x * factor - 0.84) + Math.min(0, min.x * factor + 0.84);
    const shiftY = Math.max(0, max.y * factor - 0.78) + Math.min(0, min.y * factor + 0.70);
    camera.translateX(shiftX * (camera.right - camera.left) / (2 * camera.zoom));
    camera.translateY(shiftY * (camera.top - camera.bottom) / (2 * camera.zoom));
    camera.updateMatrixWorld();
  }

  let lastBeat;
  let started = 0;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    const beat = state.storyBeat;
    lacquerEdge.visible = document.body.dataset.layout === 'new';
    if (beat !== lastBeat) {
      lastBeat = beat;
      started = time;
    }
    const age = reduced ? 2500 : time - started;
    const give = smoothstep(age,60,800);
    const door = beat === 'summons' || beat === 'edict';
    const presenting = beat === 'present' || beat === 'signed';
    const reading = beat === 'proposal' || beat === 'title';
    const shot = door ? shots.gate : beat === 'present' ? shots.clerks : shots[beat] ?? shots.memory;
    const memory = beat === 'memory';
    oldTablet.visible = memory && state.keepsTablet;
    oldStone.visible = memory && state.finaleStone === 'record';
    stoneBox.visible = memory && state.finaleStone === 'keep';
    mian.visible = beat === 'legend';
    emperor.model.visible = !door;
    emperor.model.position.x = memory || beat === 'legend' ? -1.78 : -2.49;
    emperor.head.rotation.x = beat === 'legend' ? -0.025 : beat === 'title' || memory ? 0.23 : 0.08;
    emperor.arms[1].rotation.set(beat === 'title' ? -1.33 : -0.16,0,beat === 'title' ? 0.58 : 0.21);
    lisi.model.visible = colleague.model.visible = presenting || reading;
    lisi.model.position.set(-1.16,0.065,0.91);
    lisi.model.rotation.y = -0.10;
    colleague.model.position.set(-0.39,0.048,0.74);
    colleague.model.rotation.y = -0.77;
    const settle = beat === 'signed' ? smoothstep(age,0,650) : Number(reading);
    lisi.head.rotation.set(0.14+settle*0.10,beat === 'present' ? 0.21*(1-give) : -0.13,0);
    lisi.arms[0].rotation.set(-1.26+0.91*settle,0,0.36);
    lisi.arms[1].rotation.set(-1.37+0.97*settle,0,-0.45);
    colleague.arms[0].rotation.set(-1.03+0.45*give,0,-0.32);
    colleague.arms[1].rotation.set(beat === 'title' ? -1.25 : -0.40,0,0.16);

    draft.visible = presenting;
    if (presenting) {
      palm(lisi,0,leftHand);
      palm(lisi,1,rightHand);
      leftHand.lerp(rightHand,0.5);
      if (beat === 'present') {
        palm(colleague,0,rightHand);
        draft.position.copy(rightHand).lerp(leftHand,give);
      } else {
        desk.localToWorld(deskPoint.set(0.05,0.61,0.08));
        draft.position.copy(leftHand).lerp(deskPoint,settle);
      }
      draft.rotation.y = -0.18;
    }
    herald.model.visible = courier.model.visible = writ.visible = door;
    if (door) {
      const summons = beat === 'summons';
      const pass = summons ? 0 : smoothstep(age,600,1350);
      const step = summons ? smoothstep(age,180,1100) : smoothstep(age,1350,2050);
      courier.model.position.set(0.08 + (summons ? -0.16 : 0.27)*step,
        summons ? lerp(0.32,0.65,step) : lerp(0.67,0.32,step),
        summons ? lerp(-1.77,-2.24,step) : lerp(-2.26,-1.80,step));
      courier.model.rotation.y = summons ? -2.40 : lerp(-1.71,0.65,step);
      courier.rig.set(0,Math.sin(step*2*Math.PI));
      const steady = smoothstep(age,0,390);
      herald.model.rotation.y = lerp(0.06,0.32,steady);
      herald.arms[0].rotation.set(-0.87-0.25*steady+0.85*pass,0,0.43);
      herald.arms[1].rotation.set(-0.98+0.70*pass,0,-0.39);
      courier.arms[0].rotation.set(summons ? -0.14 : -1.16,0,0.31);
      palm(herald,1,leftHand);
      palm(courier,0,rightHand);
      writ.position.copy(leftHand).lerp(rightHand,pass);
      writ.position.y += 0.12;
      writ.rotation.z = -0.25;
    }
    scroll.visible = reading;
    scroll.scale.x = beat === 'proposal' ? lerp(0.13,1,smoothstep(age,0,500)) : 1;
    newTitle.visible = beat === 'title';
    seal.visible = beat === 'title' || beat === 'legend';
    closedFolio.visible = beat === 'closed';
    folio.visible = beat === 'legend';
    if (folio.visible) slats.forEach((slat, index) => {
      const open = smoothstep(age, index*34, index*34+300);
      slat.visible = open > 0;
      slat.rotation.x = -1.18*(1-open);
    });
    const y = shot.y - captionOffset*(door || presenting ? 0.12 : 0.30);
    camera.zoom = shot.zoom * (captionOffset ? 0.86 : 1);
    camera.updateProjectionMatrix();
    const distance = beat === 'proposal' ? 0.46 : 1;
    camera.position.set(shot.x+shot.side*distance,y+shot.height*distance,shot.z+13.27*distance);
    camera.lookAt(shot.x,y,shot.z);
    camera.updateMatrixWorld();
    if (document.body.dataset.layout === 'new') protectShot(camera, beat);
    if (beat === 'signed') {
      draft.getWorldPosition(deskPoint).project(camera);
      const target = document.getElementById('proposal-roll');
      // A fast text reveal can finish while the physical scroll is still moving.
      target.hidden = document.body.dataset.layout === 'new' && settle < 1;
      target.style.left = (deskPoint.x+1)*50+'%';
      target.style.top = (1-deskPoint.y)*50+'%';
    }
    marker.hidden = true;
    return !reduced && age < (door ? 2100 : 840);
  }
  return {world,frame,controlsCameraZoom:true};
}

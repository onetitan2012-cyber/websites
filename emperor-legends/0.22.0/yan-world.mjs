import * as THREE from './vendor/three.module.min.js';
import { tablet } from './zhao-world.mjs';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';
import { addCopperLamp, addInkRows, addTileCourses } from './scene-art.mjs';

const { lerp, smoothstep } = THREE.MathUtils;

export function createYanWorld() {
  const ferry = new THREE.Scene();
  const study = new THREE.Scene();
  ferry.background = new THREE.Color(0x899ea2);
  study.background = new THREE.Color(0x6d7e7b);
  const art = makeCrownArt();
  const { box, groupAt, mesh, round, material, wood, earth, matTexture, cloth } = art;
  const ground = material(0x898981, earth);
  const hillside = material(0x979b94, earth);
  const river = material(0x536f77);
  const plaster = material(0xa6a198, earth);
  const stone = [0x7d8583, 0x95978d, 0xa2a093].map(color => material(color, earth));
  const beams = material(0x4a4645, wood);
  const woodwork = material(0x74605d, wood);
  const lacquer = material(0x745148, wood, 0.58);
  const anchorMat = material(0xa79a7f, matTexture);
  const sleeve = material(0x798983, cloth);
  const slips = [0xc7ad83, 0xb99d76, 0xcebb91].map(color => material(color, wood));
  const ink = material(0x554a3e);
  const jade = material(0x5d777b, null, 0.58);
  const roof = material(0x626b70);

  function lights(scene, indoor) {
    const sun = new THREE.DirectionalLight(indoor ? 0xf4ddbc : 0xe8f0ec, indoor ? 2.04 : 1.68);
    sun.position.set(-4.8, 7.44, 5.09);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -7.9, right: 7.9, top: 5.8, bottom: -6.0, near: 0.05, far: 28 });
    sun.shadow.normalBias = 0.033;
    const rim = new THREE.DirectionalLight(0xa9c0ce, 0.76);
    rim.position.set(4.0, 4.2, -4.1);
    scene.add(sun, rim, new THREE.HemisphereLight(0xdfe9e5, 0x62574a, indoor ? 1.56 : 1.73));
  }

  function lamp(scene, parent, x, y, z, power) {
    addCopperLamp(parent, x, y, z, 0.95);
    parent.updateWorldMatrix(true, false);
    const glow = new THREE.PointLight(0xffca8e, power, 4.02, 2);
    glow.position.copy(parent.localToWorld(new THREE.Vector3(x, y + 0.53, z)));
    scene.add(glow);
  }

  function deskFor(scene, x, z, width) {
    const desk = groupAt(scene, x, 0.03, z);
    box(desk, lacquer, 0, 0.45, 0, width, 0.098, 1.31, true);
    for (const side of [-1, 1]) for (const front of [-1, 1]) {
      box(desk, beams, side * (width / 2 - 0.18), 0.217, front * 0.49, 0.116, 0.435, 0.112, true);
    }
    return desk;
  }

  lights(ferry, false);
  box(ferry, ground, 0, -0.24, 0.69, 16.5, 0.47, 7.64);
  box(ferry, river, 0, -0.268, -4.67, 24, 0.166, 4.38);
  box(ferry, hillside, 0, -0.077, -6.29, 22, 0.44, 2.09);
  const hill = new THREE.SphereGeometry(1, 20, 12);
  for (const [x, y, z, width, height] of [[-5.5,-0.16,-7.01,4.7,1.13], [1.2,-0.19,-7.51,4.0,1.47], [7.0,-0.12,-7.05,4.5,0.91]]) {
    mesh(ferry, hill, hillside, x, y, z).scale.set(width, height, 1.46);
  }
  for (let row = 0; row < 7; row += 1) for (let col = 0; col < 9; col += 1) {
    box(ferry, stone[(row * 2 + col) % 3], (col - 4) * 1.1 + (row % 2) * 0.22,
      0.013, -2.26 + row * 0.68, 1.075, 0.027, 0.647);
  }
  for (const x of [-4.29, 4.32]) {
    box(ferry, plaster, x, 0.38, -2.75, 3.47, 0.76, 0.49, true);
    box(ferry, stone[0], x, 0.786, -2.75, 3.53, 0.11, 0.62, true);
  }
  box(ferry, stone[1], 0.02, 0.018, -3.22, 3.47, 0.09, 0.51);

  const pavilion = groupAt(ferry, -0.25, 0, -0.83);
  box(pavilion, anchorMat, 0.10, 0.028, 0.36, 5.95, 0.03, 2.19);
  for (const x of [-3.01, 3.01]) for (const z of [-1.17, 1.06]) {
    box(pavilion, stone[0], x, 0.10, z, 0.37, 0.20, 0.36, true);
    box(pavilion, woodwork, x, 1.48, z, 0.164, 2.72, 0.179, true);
  }
  for (const z of [-1.15, 1.06]) {
    box(pavilion, beams, 0, 2.81, z, 6.46, 0.19, 0.24, true);
  }
  box(pavilion, sleeve, 0.76, 1.86, -1.22, 3.4, 1.26, 0.067, true);
  for (const x of [-0.77, 0.11, 0.99, 1.88]) {
    box(pavilion, beams, x, 1.83, -1.17, 0.025, 1.22, 0.054);
  }
  const pitch = box(pavilion, roof, 0, 3.015, -0.28, 6.52, 0.11, 2.30, true);
  pitch.rotation.x = 0.23;
  addTileCourses(pavilion, { width: 6.53, run: 2.31, rise: 0.51, eave: 2.83, z: -1.43, back: false });

  const ferryDesk = deskFor(ferry, 0, 0.96, 4.21);
  const studyLamp = groupAt(ferry, -3.79, 0.027, 0.69);
  box(studyLamp, beams, 0, 0.23, 0.02, 0.63, 0.47, 0.64, true);
  box(studyLamp, lacquer, 0, 0.49, 0.028, 0.79, 0.079, 0.75, true);
  lamp(ferry, studyLamp, 0.035, 0.537, 0.036, 8.5);

  const packets = [-1.13, 1.13].map((x, index) => {
    const group = groupAt(ferryDesk, x, 0.529, -0.01);
    box(group, anchorMat, 0, 0.001, 0.023, 1.46, 0.019, 1.02);
    const document = groupAt(group, 0, 0.028, 0);
    if (index) document.rotation.y = Math.PI / 2;
    const pieces = [-1, 1].map(side => {
      const half = groupAt(document, side * 0.44, 0, 0);
      for (let line = 0; line < 5; line += 1) {
        const z = -0.35 + line * 0.172;
        const slat = box(half, slips[(line + index) % 3], 0, 0.0, z, 0.423, 0.033, 0.141, true);
        slat.rotation.y = side * (line === 2 ? 0.035 : 0.010);
      }
      addInkRows(half, box, ink, { width: 0.371, length: 0.71, y: 0.019, columns: 4, rows: 5 });
      return half;
    });
    const border = box(group, index ? woodwork : sleeve, 0, 0.014, 0.53, 1.40, 0.019, 0.047);
    return { group, pieces, x, border };
  });
  const carry = box(ferryDesk, woodwork, 0, 0.506, 0, 3.08, 0.026, 1.09, true);
  const crest = box(ferryDesk, slips[0], 0, 0.539, 0.485, 0.22, 0.023, 0.21, true);

  const clerk = makeCrownFigure(ferry, art, 'official', 1.05);
  const traveler = makeCrownFigure(ferry, art, 'resident', 1.08);
  const elder = makeCrownFigure(ferry, art, 'keeper', 1.09);
  clerk.model.position.set(-0.36, 0.054, -0.47);
  traveler.model.position.set(-2.13, 0.054, -0.31);
  elder.model.position.set(1.98, 0.054, -0.45);
  clerk.model.rotation.y = 0.15;
  traveler.model.rotation.y = 0.52;
  elder.model.rotation.y = -0.45;
  for (const actor of [clerk, traveler, elder]) actor.rig.set(0, 0);

  lights(study, true);
  box(study, stone[0], 0, -0.15, 0.23, 11.6, 0.32, 8.6);
  box(study, plaster, 0, 1.39, -2.72, 11.5, 2.83, 0.208, true);
  for (const x of [-3.60, -1.35, 1.35, 3.60]) box(study, lacquer, x, 1.41, -2.53, 0.18, 2.83, 0.23, true);
  box(study, beams, 0, 2.76, -2.51, 11.46, 0.25, 0.24, true);
  box(study, beams, 2.49, 1.60, -2.57, 1.63, 1.27, 0.11);
  for (let index = 0; index < 7; index += 1) {
    box(study, slips[0], 1.83 + index * 0.22, 1.63, -2.487, 0.045, 1.08, 0.047);
  }
  box(study, anchorMat, 0, 0.032, 0.03, 4.80, 0.04, 3.01);
  const stoneDesk = deskFor(study, 0, 0.96, 2.23);
  lamp(study, stoneDesk, -0.73, 0.506, -0.05, 6.6);
  const keepsake = groupAt(stoneDesk, 0.26, 0.522, 0.14);
  box(keepsake, lacquer, 0, 0.02, 0, 0.49, 0.043, 0.42, true);
  for (const x of [-0.224, 0.224]) box(keepsake, woodwork, x, 0.075, 0, 0.048, 0.108, 0.433, true);
  for (const z of [-0.19, 0.19]) box(keepsake, woodwork, 0, 0.075, z, 0.42, 0.108, 0.038, true);
  round(keepsake, jade, [0.10, 0.042, 0.088], 0, 0.065, 0.018, true);
  const keepsakeLid = groupAt(keepsake, 0, 0.129, -0.203);
  box(keepsakeLid, lacquer, 0, 0.019, 0.202, 0.495, 0.034, 0.42, true);
  const king = makeCrownFigure(study, art, 'king', 1.17);
  king.model.position.set(0.09, 0.06, -0.50);
  king.model.rotation.y = -0.12;
  king.head.rotation.x = 0.24;
  king.rig.set(0.94, 0);

  const zhaoTablet = tablet(ferryDesk,art,0,.57,.10);
  const copy = groupAt(ferryDesk,-1.72,.54,.24);
  for (let i=0;i<5;i++) box(copy,slips[i%3],i*.055,0,0,.05,.028,.34);
  addInkRows(copy,box,ink,{width:.22,length:.3,y:.02,columns:4});
  const messenger = makeCrownFigure(ferry,art,'guest',1.05);
  messenger.model.position.set(-2.84,.054,.72);
  messenger.model.rotation.y=1.09;messenger.rig.set(0,0);
  const carried = tablet(messenger.arms[0],art,0,-.34,.16);
  carried.group.scale.setScalar(.52);
  let world = ferry;
  let lastBeat;
  let lastBound = [false, false];
  let fromBound = lastBound;
  let started = 0;
  function frame(state, camera, marker, time, reduced, captionOffset) {
    const { storyBeat: beat, registerBound, yanStoneKept } = state;
    const memory = beat === 'stone';
    world = memory ? study : ferry;
    if (beat !== lastBeat || registerBound.some((bound, index) => bound !== lastBound[index])) {
      fromBound = lastBound;
      lastBound = registerBound;
      lastBeat = beat;
      started = time;
    }
    const age = reduced ? 1100 : time - started;
    const assemble = smoothstep(age, 45, 655);
    const combine = beat === 'companions' ? smoothstep(age, 72, 845) : 0;
    if (memory) {
      keepsakeLid.rotation.x = -1.25 * (yanStoneKept ? smoothstep(age, 65, 760) : 1);
    } else {
      carry.visible = combine > 0.16;
      crest.visible = beat === 'origin' || combine > 0.65;
      crest.position.x = beat === 'origin' ? -0.21 : 0;
      packets.forEach(({ group, pieces, x, border }, index) => {
        const amount = registerBound[index] ? fromBound[index] ? 1 : assemble : 0;
        group.position.x = lerp(x, Math.sign(x) * 0.76, combine);
        border.visible = combine < 0.72;
        for (const [i, half] of pieces.entries()) {
          const side = i ? 1 : -1;
          half.position.x = side * lerp(0.43, 0.219, amount);
          half.rotation.y = side * lerp(0.15, 0, amount);
        }
      });
      clerk.head.rotation.x = 0.18 + 0.18 * combine;
      traveler.head.rotation.y = 0.12 - combine * 0.18;
      elder.head.rotation.y = combine * 0.21;
    }
    const close = beat === 'zhao-front' || beat === 'zhao-reply';
    zhaoTablet.group.visible = close || beat === 'zhao-proof';
    zhaoTablet.show(beat === 'zhao-reply' ? 'reply' : 'front',false,state.replyText);
    zhaoTablet.group.rotation.x = beat === 'zhao-reply' ? -Math.PI * (1-smoothstep(age,0,440)) : 0;
    copy.visible = Boolean(state.zhaoProof === 'record' && !memory);
    messenger.model.visible = beat === 'zhao-send' || Boolean(state.zhaoProof === 'open' && !memory);
    carried.group.visible = beat === 'zhao-send';
    if (carried.group.visible) carried.show('reply',true,state.replyText);
    if (close) {
      for (const packet of packets) packet.group.visible=false;
      camera.zoom=4.4;camera.updateProjectionMatrix();
      const y=.63-captionOffset*.13;
      camera.position.set(.33,y+16,15.1);camera.lookAt(0,y,1.07);camera.updateMatrixWorld();
      marker.hidden=true;return !reduced && age<500;
    }
    for(const packet of packets) packet.group.visible=true;
    const opening = beat === 'winter';
    const focusX = memory ? 0.02 : -0.17;
    const focusY = (opening ? 1.42 : 1.13) - captionOffset * 0.89;
    camera.zoom = (memory ? 1.58 : opening ? 1.20 : 1.36) - captionOffset * 0.07;
    camera.updateProjectionMatrix();
    camera.position.set(focusX + 1.39, focusY + (opening ? 5.99 : 8.24), 14.4);
    camera.lookAt(focusX, focusY, 0.36 + captionOffset * 0.33);
    camera.updateMatrixWorld();
    marker.hidden = true;
    return (!memory || yanStoneKept) && !reduced && age < 875;
  }

  return { get world() { return world; }, frame, controlsCameraZoom: true };
}

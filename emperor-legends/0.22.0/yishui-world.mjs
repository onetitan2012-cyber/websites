import * as THREE from './vendor/three.module.min.js';
import { makeCrownFigure } from './crown-figures.mjs';

export function createYishui(art, lights) {
  const scene = new THREE.Scene();
  const { material, box, round, groupAt, mesh } = art;
  scene.background = new THREE.Color(0xb2c0b8);
  scene.fog = new THREE.FogExp2(0xb2c0b8, .045);
  lights(scene, false);
  const sand = material(0xab9c7c, art.earth);
  const water = material(0x70948f, null, .6);
  const reed = material(0x807c50);
  const willow = material(0x616f55);
  const wood = material(0x66513e, art.wood);
  box(scene, water, 0, -.34, -6.5, 36,.30,13);
  box(scene,sand,0,-.25,4.1,30,.47,8.6);
  const hill = material(0x728579,art.earth);
  for (let i = 0; i < 8; i++) round(scene,hill,[3.4,1.2 + .6*Math.cos(i*2),1.8],i*3.3-11,-.42,-5.8-Math.sin(i)*1.1);
  const glint = material(0xb6c3ae);
  for (let i = 0; i < 27; i++) box(scene,glint, Math.sin(2.6*i)*9,-.18,-.62-(i%9)*.74,.52+.33*Math.cos(i),.012,.032);
  for (const x of [-4,-3.55,3.32,4.2]) {
    for (let j=0;j<7;j++) {
      const stalk = box(scene,reed,x+.11*j,.26+.06*Math.sin(j),.08+.11*Math.cos(j),.025,.73,.023);
      stalk.rotation.z = Math.sin(j*2)*.28;
    }
  }
  const trunk = box(scene,wood,-3.5,1,.45,.23,2.1,.2);
  trunk.rotation.z=-.16;
  for (let i=0;i<4;i++) round(scene,willow,[.9,.38,.51],-3.3+Math.cos(i)*.57,2.12+.13*Math.sin(i),.31+Math.sin(i)*.39);
  const bard = makeCrownFigure(scene,art,'mourner',1.13);
  bard.model.position.set(-.84,.01,1.43);
  bard.rig.set(.85,0);
  bard.model.rotation.y=.24;
  const singer = makeCrownFigure(scene,art,'guest',1.13);
  singer.model.position.set(1.08,.01,1.14);
  singer.model.rotation.y=-.81;
  singer.rig.set(0,0);
  const zhu = groupAt(scene,-.71,.57,1.76);
  zhu.rotation.y=-.24;
  box(zhu,wood,0,0,0,.95,.1,.20);
  const string = material(0xd9c992);
  for(let i=0;i<5;i++) box(zhu,string,.03,.055,-.071+i*.034,.84,.009,.008);
  for (const side of [-1,1]) box(zhu,wood,side*.34,-.27,0,.08,.47,.16);
  const mallet = box(bard.arms[1],wood,0,-.36,.12,.022,.025,.30);
  mallet.rotation.y=.35;
  for (const x of [1.65,2.3]) box(scene,material(0x877a63),x,.003,2.3,.046,.013,4.7);
  const cart = groupAt(scene,2.6,.03,.6);
  box(cart,wood,0,.57,0,1.18,.13,.71);
  for(const z of [-.40,.40]){
    box(cart,wood,0,.77,z,1.14,.27,.055);
    const wheel = mesh(cart,new THREE.TorusGeometry(.34,.041,6,20),wood,-.05,.35,z*1.18);
    for(let i=0;i<4;i++) box(wheel,wood,0,0,0,.036,.64,.031).rotation.z=i*Math.PI/4;
  }
  return { scene, frame(beat,age) {
    const left = beat === 'departed';
    const travel = left ? Math.min(age / 1120, 1) : 0;
    cart.position.x = 2.6 + 6.4 * travel;
    cart.visible = singer.model.visible = travel < 1;
    singer.rig.set(left ? .92 : 0, 0);
    singer.model.position.set(left ? cart.position.x : 1.08, left ? .67 : .01, left ? .60 : 1.14);
    singer.model.rotation.y = left ? 1.33 : -.81;
    const sound = beat === 'song' ? Math.sin(Math.min(1,age/920)*Math.PI*3) : 0;
    bard.arms[1].rotation.x=-.8-.27*sound;
    bard.head.rotation.y=left ? .6 : .1;
    singer.head.rotation.x=beat === 'song' ? -.16 : .08;
  } };
}

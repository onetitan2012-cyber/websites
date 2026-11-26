import * as THREE from './vendor/three.module.min.js';
import {makeCrownArt} from './crown-art.mjs';
import {makeCrownFigure} from './crown-figures.mjs';
import {addCopperLamp, addInkRows} from './scene-art.mjs';

export function createLettersWorld(qin) {
  const world = new THREE.Scene();
  const art = makeCrownArt();
  const {box, material, groupAt, profile} = art;
  world.background = new THREE.Color(qin ? 0x30393d : 0xbebaa1);
  const wood = material(qin ? 0x65483d : 0x806449,art.wood);
  const earth = material(qin ? 0x75685a : 0xc6b89b,art.earth);
  const mat = material(qin ? 0xb29361 : 0xc1ab7a,art.matTexture);
  const ink = material(0x4c4436);
  const light = new THREE.DirectionalLight(qin ? 0xffda9c : 0xffedc9, qin ? 2.0 : 2.6);
  light.position.set(-3,6,3); light.castShadow = true;
  world.add(light, new THREE.HemisphereLight(qin ? 0xc6cbd0 : 0xfff4dd,0x786959,1.55));
  box(world,earth,0,-0.12,0,18,0.24,17);
  box(world,earth,0,1.3,-2.1,18,2.6,0.24);
  for (const x of [-3.0,0.1,3.0]) box(world,wood,x,1.35,-1.92,0.14,2.7,0.19);
  box(world,wood,0,2.35,-1.89,13,0.13,0.17);
  const windowPanel = material(qin ? 0x485358 : 0xdaca9b);
  box(world,windowPanel,-1.45,1.46,-1.92,2.52,1.29,0.09);
  for (let i=0;i<9;i++) box(world,wood,-2.7+i*0.31,1.46,-1.80,0.044,1.32,0.055);
  const curtain = box(world,material(qin ? 0x625650 : 0x87948a,art.cloth),2.04,1.21,-1.77,1.05,2.35,0.04);
  for (const x of [-1.5,1.5]) for (const z of [-0.52,0.52]) box(world,wood,x,0.23,z,0.14,0.46,0.14);
  box(world,wood,0,0.49,0,3.55,0.16,1.62,true);
  box(world,mat,0,0.586,0.03,2.53,0.035,1.25);
  for (const x of [-1.19,1.19]) box(world,wood,x,0.608,0.03,0.024,0.009,1.24);
  const rope = [material(qin ? 0x8a4638 : 0x916242),material(qin ? 0x665846 : 0x526e70)];
  function tablet(x,which) {
    const node = groupAt(world,x,0.612,0.08);
    const slip = material(which ? 0xc4a16b : 0xcbb385,art.wood);
    for (let j=0;j<6;j++) box(node,slip,(j-2.5)*0.116,0.035,0,0.112,0.07,0.82);
    addInkRows(node,box,ink,{width:0.66,length:0.66,y:0.072,columns:6,rows:4});
    const tie = box(node,rope[which],0,0.082,0.14,0.72,0.022,0.085);
    return {node,tie};
  }
  const left = tablet(-0.60,0), right = tablet(0.60,1);
  const flame = addCopperLamp(world,-1.52,0.58,-0.24,0.90);
  const clerk = makeCrownFigure(world,art,qin?'official':'keeper',1.13);
  clerk.model.position.set(-0.65,0,-0.93); clerk.model.rotation.y=0.24;
  const reader = makeCrownFigure(world,art,qin?'king':'li',1.12);
  reader.model.position.set(0.51,0,-0.99); reader.model.rotation.y=-0.35;
  const visitor = makeCrownFigure(world,art,'resident',1.08);
  visitor.model.position.set(1.91,0,-0.98); visitor.model.rotation.y=-0.77;
  const elder = makeCrownFigure(world,art,'elder',1.03);
  elder.model.position.set(2.37,0,-1.26); elder.model.rotation.y=-0.73;
  clerk.rig.set(0.9,0);
  reader.rig.set(qin ? 1 : 0.82,0);
  visitor.rig.set(0,0);
  elder.rig.set(0,0);
  const measure = groupAt(world,1.97,0,0.41);
  measure.scale.setScalar(1.38);
  profile(measure,wood,[[0.01,0],[0.18,0],[0.23,0.32],[0.20,0.32],[0.15,0.04],[0.01,0.04]],0,0,0);
  art.thread(measure,wood,[[-0.18,0.23,0],[-0.15,0.49,0],[0.14,0.49,0],[0.18,0.23,0]],0.021);
  profile(measure,material(0x695647),[[0.20,0.13],[0.204,0.16]]);
  const docket = groupAt(world,-0.03,0.61,0.52);
  box(docket,mat,0,0.04,0,0.44,0.06,0.18);
  addInkRows(docket,box,ink,{width:0.35,length:0.15,y:0.072,columns:3,rows:2});
  if (!qin) {
    for (const h of [0.47,0.98,1.48]) {
      box(world,wood,-2.12,h,-1.43,1.12,0.07,0.49);
      for(let i=0;i<7;i++) box(world,mat,-2.53+i*0.13,h+0.12,-1.41,0.10,0.18,0.33);
    }
  }
  const tags = [-2.38,-1.91].map(x=>box(world,mat,x,1.47,-1.16,0.15,0.28,0.03));
  function looseTie(tie,open) {
    tie.rotation.y = open ? 0.9 : 0;
    tie.position.z = open ? 0.46 : 0.14;
    tie.position.x = open ? 0.20 : 0;
    tie.position.y = open ? 0.018 : 0.082;
  }
  let previous, started;
  return {world, controlsCameraZoom:true,frame({storyBeat},camera,marker,time,reduced,offset) {
    const [beat,read=''] = storyBeat.split('-');
    if (previous !== storyBeat) { previous=storyBeat; started=time; }
    const t = reduced ? 1 : THREE.MathUtils.smoothstep(time-started,0,400);
    const atDoor = beat === 'door' || beat==='market';
    left.node.visible = !atDoor;
    right.node.visible = !atDoor && (!qin || beat==='later');
    looseTie(left.tie,qin ? beat!=='watch' : read.includes('w'));
    looseTie(right.tie,qin || read.includes('y'));
    right.node.position.z = beat==='later' ? 0.08-(1-t)*0.32 : 0.08;
    docket.visible = beat==='register' || beat==='years';
    visitor.model.visible = atDoor || qin && beat==='watch';
    elder.model.visible = beat==='market' && read.startsWith('y');
    measure.visible = beat==='market' && read.startsWith('w');
    curtain.rotation.z = beat==='door' ? -0.15*t : atDoor ? -0.15 : 0;
    flame.scale.y = beat==='later' ? 0.035 : 0.068;
    tags.forEach(tag=>{tag.visible=!qin; tag.position.y = beat==='years' ? 1.47-0.99*t : atDoor ? 0.48 : 1.47;});
    reader.arms[0].rotation.x = beat==='first' || atDoor ? -0.91 : -0.24;
    camera.zoom=2.08; camera.updateProjectionMatrix();
    camera.position.set(0.44,4.0,7.0); camera.lookAt(beat==='market' ? 0.52 : 0.09,0.73+offset*0.06,-0.15);
    camera.updateMatrixWorld(); marker.hidden=true; return t<1 && ['later','years','door'].includes(beat);
  }};
}

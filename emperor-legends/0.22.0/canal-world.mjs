import * as THREE from './vendor/three.module.min.js';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';

export function makeFieldMarker(parent, art, faded = false) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.24, 0);
  shape.lineTo(0.24, 0);
  shape.lineTo(0.24, 0.77);
  shape.lineTo(0.06, 0.99);
  shape.lineTo(-0.24, 0.99);
  shape.closePath();
  const node = art.groupAt(parent);
  art.mesh(node, new THREE.ExtrudeGeometry(shape, { depth:0.07, bevelEnabled:false }),
    art.material(faded ? 0x998062 : 0xbe955e, art.wood), 0, 0, 0, true);
  const stain = art.box(node, art.material(faded ? 0x755543 : 0x60462f, art.earth), 0, 0.12, 0.072, 0.48, 0.24, 0.009);
  art.thread(node, art.material(faded ? 0x966f50 : 0x945631), [[-0.19,0.84,0.078],[-0.03,0.80,0.086],[0.10,0.82,0.076]], 0.021);
  return {node, stain};
}

export function createCanalWorld() {
  const world = new THREE.Scene();
  world.background = new THREE.Color(0xd9d4bb);
  const art = makeCrownArt();
  const {box, round, material, groupAt} = art;
  const soil = material(0xb69b71, art.earth), bank = material(0x99845e, art.earth);
  const mud = material(0x6c6248, art.earth), green = material(0x797e4d);
  const water = material(0x6b9385), glint = material(0xbac7aa);
  const light = new THREE.DirectionalLight(0xffe6ba, 2.1);
  light.position.set(-4,7,5);
  light.castShadow = true;
  world.add(light, new THREE.HemisphereLight(0xfff2db,0x82735e,1.8));
  box(world, bank, 0,-0.22,0,20,0.4,13);
  for (const z of [-1.65,1.71]) {
    box(world, soil, 0,0.018,z,16,0.16,2.7,true);
    for (let i=0;i<5;i++) box(world, bank, 0,0.109,z+(i-2)*0.49,16,0.034,0.062);
  }
  // A raised cross-bank ends the watered plot. The next field stays dry.
  box(world, bank, 0.96,0.12,0,0.45,0.31,6.85,true);
  box(world, bank, 0,0.16,-3.65,17,0.44,0.9,true);
  const ridge = material(0xb09c79,art.earth);
  for(let i=0;i<12;i++){
    round(world,ridge,[1.8,0.55+(i%4)*0.23,0.96],(i-5.5)*1.62,0.02,-5.1-Math.sin(i));
  }
  for(let i=0;i<74;i++){
    const x=(art.random()-0.5)*10;
    const z=(i%2 ? -1 : 1)*(0.47+art.random()*2.65);
    round(world,bank,[0.04+art.random()*0.09,0.029,0.052],x,0.103,z);
  }
  for(let i=0;i<34;i++){
    const x=(i%17-8)*0.73, z=i<17?-2.55:2.75;
    const tuft = groupAt(world,x+(art.random()-0.5)*0.35,0.11,z+(art.random()-0.5)*0.31);
    for (const side of [-1,0,1]) round(tuft,green,[0.026,0.13+art.random()*0.11,0.038],side*0.038,0.12,0).rotation.z=-side*0.47;
  }
  const run = groupAt(world,-6.7,0.061,0);
  box(run, water,0.5,0,0,1,0.028,0.54);
  for(let i=1;i<6;i++) box(run, glint,i/7,0.018,(i%2-0.5)*0.21,0.028,0.004,0.024);
  const margin = box(world, mud,-3.04,0.108,0.38,7.3,0.012,0.19);
  const farmer = makeCrownFigure(world,art,'resident',1.06);
  const engineer = makeCrownFigure(world,art,'keeper',1.10);
  const worker = makeCrownFigure(world,art,'guest',1.06);
  farmer.model.position.set(1.07,0.28,-0.28);
  farmer.model.rotation.y=-0.75;
  engineer.model.position.set(-0.86,0.11,-0.90);
  engineer.model.rotation.y=0.46;
  worker.model.position.set(-2.05,0.11,-0.38);
  worker.model.rotation.y=0.62;
  worker.rig.set(0,0);
  engineer.rig.set(0.74,0);
  const clod = round(farmer.arms[0],soil,[0.064,0.05,0.055],0,-0.38,0.045);
  const split = round(farmer.arms[1],soil,[0.056,0.042,0.045],0,-0.36,0.035);
  const offered = makeFieldMarker(engineer.arms[1],art);
  offered.node.position.set(0,-0.34,0.06);
  offered.node.scale.setScalar(0.7);
  offered.stain.visible=false;
  const carried = makeFieldMarker(worker.arms[1],art);
  carried.node.position.set(0,-0.34,0.05);
  carried.node.scale.setScalar(0.67);
  const stake = makeFieldMarker(world,art);
  stake.node.position.set(0.60,0.035,0.21);
  stake.node.rotation.z=0.06;
  stake.node.scale.setScalar(0.80);
  const branch = box(world,material(0x63513b,art.wood),0.60,0.28,0.21,0.052,0.55,0.049);
  branch.rotation.z=0.11;
  let lastBeat, start;
  return { world, controlsCameraZoom:true, frame({storyBeat:beat},camera,marker,time,reduced,offset) {
    if(lastBeat!==beat){ lastBeat=beat; start=time; }
    const t = reduced ? 1 : THREE.MathUtils.smoothstep(time-start,0,1050);
    const later = beat==='later', carry = beat==='carry';
    const watering = beat==='watering';
    const extent = watering ? t : beat==='wet' || carry || later ? 1 : 0;
    run.scale.x=3.9+3.45*extent;
    margin.visible=extent>0;
    margin.scale.x=7.3*extent;
    margin.position.x=-6.7+3.65*extent;
    stake.node.visible=watering || beat==='wet';
    stake.node.position.y=0.035+(watering ? (1-t)*0.25 : 0);
    stake.stain.visible=extent>0.91;
    offered.node.visible=beat==='offer';
    carried.node.visible=carry;
    branch.visible=carry || later;
    engineer.model.visible=worker.model.visible=!later;
    farmer.model.position.x=later ? 2.2 : 1.07;
    farmer.rig.set(later ? 0 : 0.82,0);
    farmer.arms[0].rotation.x=-0.76;
    farmer.arms[1].rotation.x=-0.73;
    clod.material = split.material = extent > 0.92 ? mud : soil;
    engineer.arms[1].rotation.x=beat==='offer' ? -1.06 : -0.29;
    camera.zoom=1.86;
    camera.updateProjectionMatrix();
    camera.position.set(1.25,5.05,10.6);
    camera.lookAt(-0.14,0.60-offset*0.65,0.05);
    camera.updateMatrixWorld();
    marker.hidden=true;
    return watering && !reduced && t<1;
  }};
}

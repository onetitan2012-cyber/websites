import * as THREE from './vendor/three.module.min.js';

const { lerp, smoothstep } = THREE.MathUtils;

// Doorway tableau, facing left along the paved street. The axle runs across z.
export function makeGrainCart(world, { groupAt, box, mesh, round, material, wood, cloth }) {
  const yard = groupAt(world, -3.30, 0.02, 0.49);
  const cart = groupAt(yard);
  const oak = material(0x78583a, wood);
  const edge = material(0xb68d54, wood);
  const dark = material(0x473c2c, wood);
  const sack = material(0xc3a271, cloth);
  const hide = material(0x876244);
  const horn = material(0xd9c5a0);
  const straw = material(0xb8a267);
  box(cart, oak, 0, 0.37, 0, 1.29, 0.11, 0.81, true);
  for (const side of [-1, 1]) {
    box(cart, edge, 0, 0.49, side * 0.37, 1.32, 0.20, 0.055, true);
    box(cart, oak, -0.96, 0.43, side * 0.26, 1.64, 0.07, 0.065, true).rotation.z = -0.14;
  }
  const wheels = [-0.47,0.47].map(z => {
    const wheel = groupAt(cart, 0, 0.34, z);
    mesh(wheel, new THREE.TorusGeometry(0.295,0.044,8,24), dark, 0,0,0,true);
    for (let i=0; i<5; i++) box(wheel, edge,0,0,0,0.035,0.57,0.045).rotation.z = i*Math.PI/5;
    round(wheel, oak,[0.08,0.08,0.10],0,0,0);
    return wheel;
  });
  const bags = groupAt(cart);
  const sacks = [[-0.28,0.57,0.03],[0.28,0.58,-0.06],[0,0.80,0]].map(([x,y,z]) => {
    const bag = groupAt(bags,x,y,z);
    round(bag,sack,[0.32,0.19,0.27],0,0,0,true);
    round(bag,dark,[0.055,0.038,0.04],0.27,0.08,0);
    return bag;
  });
  const ox = groupAt(yard);
  round(ox,hide,[0.53,0.29,0.23],0,0.61,0,true);
  const head = groupAt(ox,-0.39,0.76,0);
  round(head,hide,[0.27,0.18,0.17],-0.12,-0.005,0,true);
  round(head,dark,[0.12,0.09,0.15],-0.31,-0.08,0);
  for (const side of [-1,1]) {
    mesh(head,new THREE.ConeGeometry(0.045,0.22,9),horn,-0.13,0.15,side*0.14).rotation.x=side*0.68;
    round(head,dark,[0.025,0.022,0.014],-0.21,0.035,side*0.151);
  }
  const legs=[];
  for(const x of [-0.32,0.33]) for(const z of [-0.14,0.14]){
    const hip=groupAt(ox,x,0.52,z);
    box(hip,hide,0,-0.22,0,0.089,0.44,0.085,true);
    box(hip,dark,-0.02,-0.46,0,0.11,0.09,0.10);
    legs.push(hip);
  }
  const yoke=groupAt(yard);
  box(yoke,edge,0,0,0,0.11,0.11,0.75,true);
  for(const z of [-0.28,0.28]) box(yoke,oak,0,-0.095,z,0.095,0.22,0.09,true);
  const fodder = groupAt(yard,-2.57,0.12,0.17);
  round(fodder,oak,[0.27,0.12,0.23],0,0,0);
  for(let i=0;i<9;i++) box(fodder,straw,0.038*(i-4),0.13,0,0.03,0.22,0.04).rotation.z=(i-4)*0.14;
  yard.visible=false;

  return { yard, show(beat, age) {
    const settled=beat.startsWith('door-end-');
    const action=beat.replace('door-end-','').replace('door-','');
    const t=settled ? 1 : smoothstep(age,60,1390);
    const depart=action==='send' ? t : 0;
    const walk=action==='defer' ? t : 0;
    const unyoke=action==='unyoke' ? t : Number(action==='hold');
    const feed=action==='hold' ? t : 0;
    cart.position.x=-3.50*depart;
    wheels.forEach(w=>{w.rotation.z=3.50*depart/0.34;});
    bags.visible=action==='send' || action==='load';
    const loading = action === 'load' ? t : 1;
    sacks[0].position.set(lerp(-1.43,-0.28,loading),
      lerp(0.91,0.57,loading) + 0.18*Math.sin(loading*Math.PI), lerp(0.81,0.03,loading));
    sacks[1].visible = sacks[2].visible = action === 'send';
    ox.position.x=-1.48+cart.position.x-0.49*feed;
    head.rotation.z=0.53*feed;
    legs.forEach((leg,i)=>{leg.rotation.z=(i===1||i===2?-1:1)*0.29*Math.sin(depart*8*Math.PI);});
    yoke.position.set(lerp(-1.71+cart.position.x,-0.17,unyoke),lerp(0.80,0.36,unyoke)+Math.sin(Math.PI*unyoke)*0.22,lerp(0,0.60,unyoke));
    yoke.rotation.x=-1.08*unyoke;
    fodder.visible=action==='hold';
    return {depart, walk, unyoke, feed};
  }};
}

import * as THREE from './vendor/three.module.min.js';
import { makeCrownArt } from './crown-art.mjs';
import { makeCrownFigure } from './crown-figures.mjs';
import { addTileCourses } from './scene-art.mjs';

export function markedBowl(parent, art, x, y, z) {
  const pot=art.groupAt(parent,x,y,z);
  const clay=art.material(0xa97150,art.earth);
  art.profile(pot,clay,[[.08,0],[.10,.018],[.13,.04],[.21,.12],[.22,.15],[.20,.15],[.18,.115],[.09,.055],[.005,.05]],0,0,0,true);
  const ink=art.material(0x513e32);
  art.thread(pot,ink,[[.06,.139,.203],[.07,.115,.177],[.055,.102,.17],[.052,.078,.15]],.005);
  art.thread(pot,ink,[[-.11,.123,.16],[-.091,.095,.165],[-.063,.090,.17],[-.035,.111,.194]],.008);
  art.thread(pot,ink,[[-.054,.061,0],[-.039,.057,.029],[.006,.055,.043],[.045,.06,.027],[.056,.062,.001]],.006);
  return pot;
}

function face(parent,art,message) {
  const canvas=document.createElement('canvas');
  canvas.width=640;canvas.height=240;
  const c=canvas.getContext('2d');
  c.fillStyle='#c9a16e';c.fillRect(0,0,640,240);
  for(let i=0;i<20;i++) {
    c.strokeStyle=i%2?'#bd9666':'#d3ae7e';c.lineWidth=2;c.beginPath();
    c.moveTo(0,12*i);c.bezierCurveTo(180,12*i-8,340,12*i+11,640,12*i);c.stroke();
  }
  c.strokeStyle='#755237';c.lineWidth=5;c.beginPath();c.arc(556,163,30,.12,Math.PI*.91);c.stroke();
  c.fillStyle='#49372b';c.font='38px "Songti SC",serif';
  message.forEach((text,i)=>c.fillText(text,36,76+i*59));
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const surface=art.mesh(parent,new THREE.PlaneGeometry(1.32,.5),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}),0,.042,0);
  surface.rotation.x=-Math.PI/2;
  return surface;
}

export function tablet(parent,art,x,y,z) {
  const group=art.groupAt(parent,x,y,z);
  art.box(group,art.material(0xa2784c,art.wood),0,0,0,1.35,.078,.52,true);
  const faces=[face(group,art,['肥下那年','邯郸西巷又开过火','陶人平谢']),face(group,art,[]),face(group,art,['阿禾','碗还认得，窑也认得'])];
  let lastReply;
  const cord=art.groupAt(group,.38,0,0);
  art.box(cord,art.material(0x604638),0,.055,0,.032,.012,.53);
  function show(side='front',tied=false,reply='') {
    if (side === 'reply' && reply && reply !== lastReply) {
      const old = faces[2];
      group.remove(old);
      old.geometry.dispose(); old.material.map.dispose(); old.material.dispose();
      faces[2] = face(group,art,reply.match(/.{1,12}/gu));
      lastReply = reply;
    }
    faces.forEach((f,i)=>f.visible=i===(side==='reply'?2:side==='blank'?1:0));
    cord.visible=tied;
  }
  show();
  return {group,show};
}

export function createZhaoWorld() {
  const art=makeCrownArt(),world=new THREE.Scene();
  const {box,material,wood,earth,matTexture,groupAt}=art;
  world.background=new THREE.Color(0xa7a69a);
  world.add(new THREE.HemisphereLight(0xfff0d8,0x8a7366,1.85));
  const sun=new THREE.DirectionalLight(0xffdfac,2.25);sun.position.set(-4,7,5);sun.castShadow=true;world.add(sun);
  const timber=material(0x695140,wood), ochre=material(0xba9a76,earth), reed=material(0xbba877,matTexture);
  box(world,ochre,0,-.13,0,13,.24,10);
  box(world,ochre,0,1.28,-2.2,10,2.6,.25,true);
  addTileCourses(world,{width:10,run:1.1,rise:.28,eave:2.66,z:-2.64,back:false});
  for(const x of [-3.3,2.8]) box(world,timber,x,1.23,-1.5,.14,2.5,.15,true);
  box(world,timber,-.25,2.45,-1.50,6.3,.14,.17);
  const brick = material(0xa5856a,earth);
  const kiln = groupAt(world,-2.83,0,-1.12);
  art.round(kiln,brick,[.70,.79,.56],0,.34,0,true);
  box(kiln,material(0x4c3d34),0,.23,.54,.55,.43,.06);
  const shelf = box(world,timber,1.11,.49,-1.41,2.12,.09,.63,true);
  for (const x of [-.76,.76]) box(shelf,timber,x,-.27,0,.10,.48,.47);
  const jar = material(0x91755b,earth);
  for (let i=0;i<4;i++) art.profile(shelf,jar,[[.09,0],[.17,.10],[.18,.24],[.105,.31],[.116,.34],[.095,.34]],i*.41-.63,.05,.02,true);
  for (let i=0;i<6;i++) box(world,timber,-.99+i*.15,1.4,-2.04,.04,.75,.07);
  for (const y of [1.01,1.79]) box(world,timber,-.61,y,-2.04,1.02,.07,.08);
  const stall=groupAt(world,0,0,.48);
  box(stall,timber,0,.64,0,2.92,.12,1.17,true);
  for(const x of [-1.24,1.24]) for(const z of [-.46,.46])box(stall,timber,x,.3,z,.12,.60,.12,true);
  const bowls=[-.97,-.46].map(x=>markedBowl(stall,art,x,.70,-.04));
  markedBowl(stall,art,.91,.70,.18);
  const cloth=groupAt(stall,-.64,.87,0);
  box(cloth,reed,0,0,0,1.34,.048,.86,true);
  for(let i=0;i<19;i++) box(cloth,reed,i*.07-.63,.023,0,.026,.019,.86);
  for(const z of [-.31,.31])box(cloth,timber,0,.037,z,1.31,.011,.018);
  const letter=tablet(stall,art,-.05,.715,.02);
  const people=[['keeper',-.76,-.76],['resident',1.28,-.81],['guest',-1.95,.43]].map(([role,x,z],i)=>{
    const actor=makeCrownFigure(world,art,role,1.08);
    actor.model.position.set(x,0,z);actor.model.rotation.y=[.39,-.42,1.04][i];actor.rig.set(0,0);return actor;
  });
  let last,started;
  return {world,controlsCameraZoom:true,frame(state,camera,marker,time,reduced,captionOffset){
    const beat=state.storyBeat;
    if(beat!==last){last=beat;started=time;}
    const progress=reduced?1:THREE.MathUtils.smoothstep(time-started,0,470);
    const letterClose=['thanks','blank','returned'].includes(beat);
    const close = letterClose || beat === 'rim';
    cloth.visible=beat==='covered'||(beat==='uncovered'&&progress<1);
    cloth.position.x=-.64-(beat==='uncovered'?1.2*progress:0);
    cloth.scale.x=beat==='uncovered'?1-.81*progress:1;
    letter.group.visible=letterClose;
    letter.show(beat==='blank'?'blank':'front',beat==='returned');
    for(const pot of bowls)pot.visible=!close&&beat!=='gone';
    people[0].model.visible=beat!=='gone';people[2].model.visible=['covered','uncovered','chipped','returned'].includes(beat);
    const y=(close ? .76 : 1.15)-captionOffset*(close ? .14 : .7),z=close ? .52 : .12;
    camera.zoom=close?4.4:1.61;camera.updateProjectionMatrix();
    const focusX = beat === 'rim' ? .91 : 0;
    camera.position.set(focusX + (close ? .36 : 2.1),y+(close ? 17 : 7.3),z+13.5);
    camera.lookAt(focusX,y,z);camera.updateMatrixWorld();
    marker.hidden=true;return !reduced&&progress<1;
  }};
}

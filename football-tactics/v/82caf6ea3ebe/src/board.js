import * as T from 'three';
import {QUALITY} from './quality.js';
import {OrbitControls} from '../vendor/OrbitControls.js';
import {moves,player,carrier,keeper,TYPES} from './engine.js';
const V=(x,y,z)=>new T.Vector3(x,y,z);
export const world=(c,r)=>V((c-2.5)*1.12,0,(5.5-r)*1.04);
const mat=(color,metalness=0,roughness=.55)=>new T.MeshStandardMaterial({color,metalness,roughness,flatShading:true});
const skin={wolf:0x9ba7ae,goat:0xe8dfc9,panther:0x242c38,keeper:0x655545};
function mesh(g,m,parent,pos=[0,0,0],scale=null){const o=new T.Mesh(g,m);o.position.set(...pos);if(scale)o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
const sphere=(p,m,pos,sc)=>mesh(new T.IcosahedronGeometry(1,1),m,p,pos,sc);
const cyl=(p,m,pos,top,bot,h)=>mesh(new T.CylinderGeometry(top,bot,h,32),m,p,pos);
function line(parent,points,color,width=.012){const path=new T.CatmullRomCurve3(points.map(a=>V(...a)));return mesh(new T.TubeGeometry(path,Math.max(10,points.length*5),width,5,false),mat(color,.3),parent);}
function labelTexture(text,color='#ffffff',background=null){const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');if(background){x.fillStyle=background;x.fillRect(0,0,256,256);}x.fillStyle=color;x.font='bold 120px Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(text,128,130);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return tex;}
export function figurine(kind,team){
 const g=new T.Group(),blue=team==='blue',fur=mat(kind==='wolf'?0x99b7c3:kind==='goat'?0xffecc9:kind==='panther'?0x303c53:0xb99167),light=mat(kind==='panther'?0x66748a:0xfff3da),kit=mat(blue?0x359cef:0xf26759),shorts=mat(blue?0x254575:0x9d3740),dark=mat(0x182b43),white=mat(0xfff5df),gold=mat(0xffd26d,.15),accent=mat(blue?0x8be9fc:0xffb69a,.15);
 cyl(g,dark,[0,.07,0],.40,.44,.14);cyl(g,kit,[0,.15,0],.39,.40,.07);cyl(g,gold,[0,.195,0],.365,.365,.02);
 for(const x of [-.125,.125]){sphere(g,dark,[x,.27,-.075],[.11,.085,.16]);cyl(g,white,[x,.36,0],.07,.075,.17);sphere(g,shorts,[x,.47,0],[.12,.15,.12]);}
 sphere(g,kit,[0,.66,0],[.24,.235,.17]);
 for(const side of [-1,1]){sphere(g,kit,[side*.25,.70,0],[.12,.145,.13]);const arm=sphere(g,fur,[side*.29,.56,-.04],[.095,.13,.10]);arm.rotation.z=side*.2;}
 cyl(g,white,[0,.83,0],.12,.14,.075);
 sphere(g,fur,[0,1.1,0],[.295,.295,.255]);
 if(kind==='goat'){
  for(const k of [-1,1]){line(g,[[k*.18,1.28,.025],[k*.29,1.39,.045],[k*.28,1.51,.12],[k*.16,1.48,.16]],0xe5ad61,.053);const ear=sphere(g,fur,[k*.32,1.15,.01],[.16,.065,.085]);ear.rotation.z=k*.32;}
  const beard=mesh(new T.ConeGeometry(.105,.20,5),white,g,[0,.84,-.19]);beard.rotation.z=Math.PI;
 }else if(kind==='wolf'){
  for(const k of [-1,1]){const ear=mesh(new T.ConeGeometry(.135,.27,4),fur,g,[k*.18,1.4,.015]);ear.rotation.z=-k*.13;mesh(new T.ConeGeometry(.072,.17,4),mat(0xe6a59d),g,[k*.18,1.405,-.045]);sphere(g,fur,[k*.22,1.03,0],[.16,.13,.15]);}
 }else {for(const k of [-1,1]){sphere(g,fur,[k*.24,1.31,0],[.12,.125,.07]);sphere(g,mat(kind==='panther'?0xa1889a:0xf0ceaa),[k*.24,1.32,-.057],[.063,.070,.022]);}if(kind==='panther'){line(g,[[0,.5,.13],[.23,.45,.29],[.33,.63,.3],[.29,.75,.25]],0x303c53,.045);}}
 sphere(g,light,[0,1.0,-.218],[.16,.105,.11]);sphere(g,dark,[0,1.065,-.3],[.06,.045,.028]);
 for(const k of [-1,1]){sphere(g,dark,[k*.12,1.16,-.225],[.068,.071,.034]);sphere(g,mat(kind==='panther'?0xeee083:0x7acfe3),[k*.12,1.157,-.251],[.037,.043,.015]);sphere(g,dark,[k*.12,1.16,-.266],[.017,.030,.009]);sphere(g,white,[k*.107,1.183,-.270],[.012,.012,.007]);const brow=mesh(new T.BoxGeometry(.12,.025,.03),dark,g,[k*.13,1.25,-.21]);brow.rotation.z=k*.16;}
 for(const z of [-.174,.174]){const badge=new T.Mesh(new T.PlaneGeometry(.23,.23),new T.MeshBasicMaterial({map:labelTexture(String(TYPES[kind]?.number||1),'#fff8db'),transparent:true}));badge.position.set(0,.68,z);badge.rotation.y=z<0?Math.PI:0;g.add(badge);}
 return g;
}
export function makePortraits(){
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setSize(180,230);renderer.setPixelRatio(1);renderer.toneMapping=T.ACESFilmicToneMapping;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(30,180/230,.1,10);camera.position.set(.25,1.22,2.35);camera.lookAt(0,.98,0);scene.add(new T.HemisphereLight(0xffffff,0x8b9eb2,3));const light=new T.DirectionalLight(0xffe6b7,3);light.position.set(-2,3,4);scene.add(light);const out={};
 for(const kind of ['wolf','goat','panther']){const g=figurine(kind,'blue');g.rotation.y=Math.PI;scene.add(g);renderer.render(scene,camera);out[kind]=renderer.domElement.toDataURL();scene.remove(g);g.traverse(o=>{o.geometry?.dispose();if(o.material){o.material.map?.dispose();o.material.dispose();}});}
 renderer.dispose();renderer.forceContextLoss();return out;
}
export class Board{
 constructor(container,onPick,quality='standard'){
  this.container=container;this.onPick=onPick;this.objects=new Map();this.targets=new Map();this.hit=[];this.view='perspective';this.alive=true;this.quality=quality;this.lastFrame=0;
  this.scene=new T.Scene();this.scene.background=new T.Color(0x172e3b);this.scene.fog=new T.Fog(0x172e3b,32,70);
  this.camera=new T.PerspectiveCamera(35,1,.1,90);this.camera.position.set(0,13.8,16.8);this.camera.lookAt(0,0,1.0);
  this.renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.18;container.append(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-label','三维足球棋盘；点击棋子选择，点击发光点移动。亦可使用左右球员卡和行动按钮。');
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(0,0,1);this.controls.enablePan=false;this.controls.enableDamping=true;this.controls.dampingFactor=.09;this.controls.minDistance=13;this.controls.maxDistance=30;this.controls.minPolarAngle=.05;this.controls.maxPolarAngle=1.23;this.controls.rotateSpeed=.65;this.controls.zoomSpeed=.8;this.controls.update();this.controls.saveState();
  this.scene.add(new T.HemisphereLight(0xd7ecf2,0x28302a,2.4));const key=new T.DirectionalLight(0xffe8c2,3.8);key.position.set(-6,14,7);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-10,right:10,top:12,bottom:-12,near:.5,far:40});key.shadow.bias=-.0005;this.scene.add(key);
  for(const [color,x,z] of [[0x218eff,7,3],[0xf8523c,-5,-7]]){const l=new T.PointLight(color,22,20);l.position.set(x,5,z);this.scene.add(l);}
  this.buildField();
  this.markerLayer=document.createElement('div');this.markerLayer.className='target-layer';this.markerLayer.setAttribute('aria-hidden','true');container.append(this.markerLayer);this.markers=[];
  this.highlights=new T.Group();this.scene.add(this.highlights);
  this.pathPreview=new T.Line(new T.BufferGeometry(),new T.LineBasicMaterial({color:0xffad32,transparent:true,opacity:.9}));this.scene.add(this.pathPreview);
  this.ball=sphere(this.scene,mat(0xf2ead5,.15,.35),[0,.29,0],[.105,.105,.105]);for(let i=0;i<7;i++){const spot=mesh(new T.CircleGeometry(.037,5),mat(0x18232a),this.ball);const phi=i*2.4,z=1-2*(i+.5)/7,r=Math.sqrt(1-z*z);spot.position.set(Math.cos(phi)*r,Math.sin(phi)*r,z);spot.lookAt(spot.position.clone().multiplyScalar(2));spot.scale.setScalar(9);}
  this.ray=new T.Raycaster();this.mouse=new T.Vector2();this.pointers=new Set();this.renderer.domElement.addEventListener('pointerdown',e=>{this.pointers.add(e.pointerId);this.down=[e.clientX,e.clientY];if(this.pointers.size===1)this.dragged=false;else this.dragged=true;});this.renderer.domElement.addEventListener('pointermove',e=>{if(this.pointers.size&&this.down&&Math.hypot(e.clientX-this.down[0],e.clientY-this.down[1])>5)this.dragged=true;});this.renderer.domElement.addEventListener('pointercancel',e=>{this.pointers.delete(e.pointerId);this.dragged=true;});this.renderer.domElement.addEventListener('pointerup',e=>{this.pointers.delete(e.pointerId);if(e.button!==0||this.dragged)return;if(!this.down||Math.hypot(e.clientX-this.down[0],e.clientY-this.down[1])>10)return;const rect=this.renderer.domElement.getBoundingClientRect();this.mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);this.ray.setFromCamera(this.mouse,this.camera);const p=player(this.state,this.selected);if(this.state?.phase==='play'&&this.state.active==='blue'&&p&&(this.mode==='move'||this.mode==='skill'&&p.kind==='panther')){const point=this.pickDestination(e.clientX,e.clientY,e.pointerType==='touch');if(point){this.onPick({c:point.c,r:point.r});return;}}const hits=this.ray.intersectObjects(this.hit,false);if(hits[0])this.onPick(hits[0].object.userData);});
  this.renderer.domElement.addEventListener('pointermove',e=>{if(!this.state||this.state.active!=='blue')return;const rect=this.renderer.domElement.getBoundingClientRect();this.mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);this.ray.setFromCamera(this.mouse,this.camera);const hit=this.ray.intersectObjects(this.hit,false)[0]?.object.userData;const p=player(this.state,this.selected);const m=p&&(this.mode==='move'||this.mode==='skill'&&p.kind==='panther')?this.pickDestination(e.clientX,e.clientY,false):null;const points=m?[p,...m.path].map(q=>{const v=world(q.c,q.r);v.y=.08;return v;}):[];this.pathPreview.geometry.dispose();this.pathPreview.geometry=new T.BufferGeometry().setFromPoints(points);this.renderer.domElement.style.cursor=hit||m?'pointer':'default';});
  this.resize=new ResizeObserver(()=>this.fit());this.resize.observe(container);this.setQuality(quality);this.fit();this.frame=this.frame.bind(this);requestAnimationFrame(this.frame);
 }
 buildField(){
  const metal=mat(0x243f55,.15,.5),trim=mat(0xf0c878,.2,.5),board=new T.Group();this.scene.add(board);
  mesh(new T.BoxGeometry(7.4,.35,14.4),metal,board,[0,-.28,0]);for(const x of [-3.6,3.6]){mesh(new T.BoxGeometry(.11,.12,14.25),trim,board,[x,-.025,0]);mesh(new T.BoxGeometry(.025,.015,13.8),mat(0x7a674a,.7),board,[x-.10*Math.sign(x),.04,0]);}for(const z of [-7.08,7.08])mesh(new T.BoxGeometry(7.3,.12,.11),trim,board,[0,-.025,z]);
  const c=document.createElement('canvas');c.width=512;c.height=1024;const ctx=c.getContext('2d');ctx.fillStyle='#4f9769';ctx.fillRect(0,0,512,1024);let rand=33;for(let i=0;i<18000;i++){rand=(Math.imul(rand,1664525)+1013904223)>>>0;const x=rand%512;rand=(Math.imul(rand,1664525)+1013904223)>>>0;const y=rand%1024;ctx.fillStyle=i%2?'#ffffff06':'#00000009';ctx.fillRect(x,y,1,3);}const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=this.renderer.capabilities.getMaxAnisotropy();const pitch=new T.MeshStandardMaterial({map:texture,roughness:.94});mesh(new T.BoxGeometry(6.9,.08,13.8),pitch,board,[0,-.08,0]);
  for(let i=0;i<12;i++)if(i%2===0)mesh(new T.PlaneGeometry(6.85,1.04),new T.MeshBasicMaterial({color:0xb9df9a,transparent:true,opacity:.04,depthWrite:false}),board,[0,-.03,(5.5-i)*1.04]).rotation.x=-Math.PI/2;
  const ink=0xf4f1ce;const straight=(a,b,color=ink,w=.011)=>line(board,[a,b],color,w);
  const y=.008;for(const x of [-3.19,3.19])straight([x,y,-6.1],[x,y,6.1]);for(const z of [-6.1,0,6.1])straight([-3.19,y,z],[3.19,y,z]);
  const circle=mesh(new T.TorusGeometry(.94,.012,6,80),mat(ink),board,[0,y,0]);circle.rotation.x=Math.PI/2;
  for(const side of [-1,1]){const z=side*6.1;for(const x of [-1.5,1.5])straight([x,y,z],[x,y,z-side*1.25]);straight([-1.5,y,z-side*1.25],[1.5,y,z-side*1.25]);this.goal(board,side);}
  for(let r=0;r<12;r++)for(let c=0;c<6;c++){
   const p=world(c,r);const dot=mesh(new T.CylinderGeometry(.043,.043,.009,14),mat(0xf7f2d7),board,[p.x,.014,p.z]);
   const hit=mesh(new T.PlaneGeometry(.93,.9),new T.MeshBasicMaterial({visible:false,side:T.DoubleSide}),board,[p.x,.025,p.z]);hit.rotation.x=-Math.PI/2;hit.userData={c,r};this.hit.push(hit);
   if(c<5)straight([p.x,.005,p.z],[p.x+1.12,.005,p.z],0x87b887,.003);if(r<11)straight([p.x,.005,p.z],[p.x,.005,p.z-1.04],0x87b887,.003);
  }
  for(const r of [1.5,3.5,5.5,7.5,9.5]){const p=world(0,r);for(let x=-3.12;x<3.1;x+=.24)straight([x,.02,p.z],[x+.12,.02,p.z],r<5.5?0x428ba5:r>5.5?0xb3665a:ink,.009);}
  for(let c=0;c<6;c++){const p=world(c,0);this.fieldLabel(board,String.fromCharCode(65+c),p.x,6.02,.27);}
  for(let r=0;r<12;r++)this.fieldLabel(board,String(r+1),-3.35,world(0,r).z,.21);
  for(const [text,z,col] of [['DEF',5.1,'#62bcdf'],['MID',3.05,'#62bcdf'],['ATK',.98,'#62bcdf'],['ATK',-.98,'#ef917c'],['MID',-3.05,'#ef917c'],['DEF',-5.1,'#ef917c']])this.fieldLabel(board,text,3.35,z,.33,col);
  mesh(new T.PlaneGeometry(200,200),mat(0x203b48,.2,.7),this.scene,[0,-.48,0]).rotation.x=-Math.PI/2;
 }
 fieldLabel(g,text,x,z,size,color='#c2d1b7'){const p=mesh(new T.PlaneGeometry(size,size),new T.MeshBasicMaterial({map:labelTexture(text,color),transparent:true,depthWrite:false}),g,[x,.03,z]);p.rotation.x=-Math.PI/2;}
 goal(g,side){const frame=mat(0xcdc9ac,.65,.25),z=side*6.30;for(const x of [-1,1])cyl(g,frame,[x,.40,z],.025,.025,.8);const bar=cyl(g,frame,[0,.80,z],.025,.025,2.05);bar.rotation.z=Math.PI/2;
  for(let x=-1;x<=1.01;x+=.2)line(g,[[x,.03,z],[x,.03,z+side*.43],[x,.74,z+side*.43],[x,.80,z]],0x748184,.006);
  for(let y=.04;y<=.8;y+=.13)line(g,[[-1,y,z+side*.43],[1,y,z+side*.43]],0x748184,.006);
 }
 setQuality(name){this.quality=QUALITY[name]?name:'standard';const q=QUALITY[this.quality];this.renderer.setPixelRatio(Math.min(devicePixelRatio,q.pixelRatio));this.renderer.shadowMap.enabled=q.shadows;this.scene.traverse(o=>{if(o.material){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.needsUpdate=true);}});this.fit();}
 fit(){const w=this.container.clientWidth,h=this.container.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.fov=this.view==='top'?41:(w/h<.85?46:35);this.camera.updateProjectionMatrix();}
 setView(view){this.controls.enableDamping=false;this.controls.update();this.controls.enableDamping=true;this.view=view;this.controls.target.set(0,0,view==='top'?0:1);if(view==='top')this.camera.position.set(0,21,.02);else this.camera.position.set(0,13.8,16.8);this.controls.update();this.fit();}
 rotateBy(angle){const v=this.camera.position.clone().sub(this.controls.target);v.applyAxisAngle(new T.Vector3(0,1,0),angle);this.camera.position.copy(this.controls.target).add(v);this.controls.update();}

 update(s,selected,mode){
  this.state=s;this.selected=selected;this.mode=mode;this.pathPreview.geometry.dispose();this.pathPreview.geometry=new T.BufferGeometry();
  for(const p of [...s.players,keeper('blue'),keeper('red')]){
   let obj=this.objects.get(p.id);const dst=world(p.c,p.r);
   if(!obj){obj=figurine(p.kind,p.team);obj.rotation.y=p.team==='blue'?0:Math.PI;obj.position.copy(dst);this.scene.add(obj);this.objects.set(p.id,obj);const hit=mesh(new T.CylinderGeometry(.33,.4,1.5,12),new T.MeshBasicMaterial({visible:false}),obj,[0,.75,0]);hit.userData={id:p.id,c:p.c,r:p.r};this.hit.push(hit);}
   this.targets.set(p.id,dst);const h=this.hit.find(x=>x.userData.id===p.id);if(h){h.userData.c=p.c;h.userData.r=p.r;}
  }
  this.markerLayer.replaceChildren();this.markers=[];
  for(const ch of [...this.highlights.children]){this.highlights.remove(ch);ch.geometry?.dispose();ch.material?.dispose();}
  const ring=(c,r,color,radius=.17)=>{const p=world(c,r),m=new T.MeshBasicMaterial({color,transparent:true,opacity:.9,depthWrite:false});const o=mesh(new T.TorusGeometry(radius,.018,6,36),m,this.highlights,[p.x,.04,p.z]);o.rotation.x=Math.PI/2;return o;};
  const p=player(s,selected);if(p){ring(p.c,p.r,p.team==='blue'?0x63d6ff:0xff9b76,.45);}
  if(s.phase==='deploy'&&p?.team==='blue'){for(let r=0;r<6;r++)for(let c=0;c<6;c++)if(!s.players.some(x=>x.c===c&&x.r===r))this.addMarker(c,r,false);}
  if(s.phase==='play'&&s.active==='blue'&&p?.team==='blue'){
   if(mode==='move'||mode==='skill'&&p.kind==='panther')for(const m of moves(s,p.id,mode==='skill'))this.addMarker(m.c,m.r,m.risk);
   if(mode==='pass'||mode==='skill'&&p.kind==='goat')for(const t of s.players.filter(t=>t.team==='blue'&&t.id!==p.id))(ring(t.c,t.r,0xe7c47e,.47),this.addMarker(t.c,t.r,false,'pass'));
  }
 }
 addMarker(c,r,risk,kind='move'){
  const el=document.createElement('span');el.className=`destination ${kind}${risk?' risk':''}`;el.textContent=kind==='pass'?'⇢':risk?'!':'';this.markerLayer.append(el);this.markers.push({c,r,el,kind});
 }
 gridSpacing(c,r){const a=this.project(c,r);let distance=Infinity;for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1]]){if(c+dc<0||c+dc>5||r+dr<0||r+dr>11)continue;const b=this.project(c+dc,r+dr);distance=Math.min(distance,Math.hypot(a.x-b.x,a.y-b.y));}return distance;}
 pickDestination(x,y,touch){
  const p=player(this.state,this.selected);if(!p)return null;
  const candidates=moves(this.state,p.id,this.mode==='skill').map(m=>{const v=this.project(m.c,m.r);return {m,d:Math.hypot(v.x-x,v.y-y),limit:Math.min(touch?22:13,this.gridSpacing(m.c,m.r)*.46)};}).sort((a,b)=>a.d-b.d);
  const nearest=candidates[0];return nearest&&nearest.d<=nearest.limit?nearest.m:null;
 }
 updateMarkers(){const rect=this.renderer.domElement.getBoundingClientRect();for(const m of this.markers){const v=this.project(m.c,m.r);const x=v.x-rect.left,y=v.y-rect.top;const size=Math.min(22,Math.max(8,this.gridSpacing(m.c,m.r)*.78));m.el.style.width=m.el.style.height=`${size}px`;m.el.style.fontSize=`${Math.max(8,size*.7)}px`;m.el.style.left=`${x}px`;m.el.style.top=`${y}px`;m.el.hidden=x<0||y<0||x>rect.width||y>rect.height;}}
 project(c,r,height=.05){const p=world(c,r);p.y=height;p.project(this.camera);const rect=this.renderer.domElement.getBoundingClientRect();return {x:rect.left+(p.x+1)*rect.width/2,y:rect.top+(1-p.y)*rect.height/2};}
 frame(now=0){if(!this.alive)return;requestAnimationFrame(this.frame);if(document.hidden||now-this.lastFrame<1000/QUALITY[this.quality].fps-1)return;this.lastFrame=now;for(const [id,obj] of this.objects){obj.position.lerp(this.targets.get(id),.16);}if(this.state){const p=carrier(this.state),v=world(p.c,p.r);v.y=.30;v.x+=.29;v.z+=p.team==='blue'?-.31:.31;this.ball.position.lerp(v,.17);this.ball.rotation.y+=.012;}this.controls.update();this.updateMarkers();this.renderer.render(this.scene,this.camera);}
}

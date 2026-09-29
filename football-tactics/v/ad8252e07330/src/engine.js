export const VERSION=2, COLS=6, ROWS=12, MAX_TURNS=24;
export const TEAM={blue:'阿尔法联队',red:'赤曜竞技'};
export const TYPES={
 wolf:{name:'苍穹之狼',star:'RONALDO',role:'终结者',number:7,spd:4,tec:3,pas:2,sho:5,def:3,skill:'苍穹重炮',skillText:'一次射门判定 +3。',icon:'wolf'},
 goat:{name:'天启山羊',star:'MESSI',role:'组织核心',number:10,spd:3,tec:5,pas:5,sho:4,def:2,skill:'穿云直塞',skillText:'本次传球跳过线路拦截，传球判定 +2。',icon:'goat'},
 panther:{name:'暗影黑豹',star:'MBAPPÉ',role:'反击箭头',number:9,spd:5,tec:4,pas:3,sho:4,def:3,skill:'疾影突进',skillText:'本次移动距离 +1，仍受分区限制。',icon:'panther'}
};
export const other=t=>t==='blue'?'red':'blue';
export const distance=(a,b)=>Math.abs(a.c-b.c)+Math.abs(a.r-b.r);
export const zone=r=>Math.floor(r/2);
export const inside=(c,r)=>Number.isInteger(c)&&Number.isInteger(r)&&c>=0&&c<COLS&&r>=0&&r<ROWS;
export const forward=(p)=>p.team==='blue'?p.r:11-p.r;
export const stats=p=>TYPES[p.kind];
export function player(s,id){return s.players.find(p=>p.id===id);}
export function keeper(team){return {id:team+'-gk',team,kind:'keeper',c:2.5,r:team==='blue'?-1:12};}
export function carrier(s){return player(s,s.ball)||keeper(s.ball.startsWith('blue')?'blue':'red');}
export function createGame(seed=Date.now()){
 const players=[];
 for(const team of ['blue','red']) for(const [kind,c,r] of [['wolf',4,3],['goat',2,2],['panther',1,4]]) players.push({id:team+'-'+kind,team,kind,c:team==='blue'?c:5-c,r:team==='blue'?r:11-r,actions:0,skills:2});
 return {version:VERSION,phase:'deploy',players,ball:'blue-goat',active:'blue',turn:0,ap:3,score:{blue:0,red:0},protected:true,seed:(Number(seed)>>>0)||1,log:[],serial:0,metrics:{blue:{shots:0,passes:0,tackles:0},red:{shots:0,passes:0,tackles:0}}};
}
function note(s,text,type='info',roll=null){s.serial++;s.log.push({id:s.serial,turn:s.turn,team:s.active,text,type,roll});if(s.log.length>160)s.log.shift();}
export function dice(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return 1+Math.floor(s.seed/4294967296*6);}
export class DiceRequired extends Error {
 constructor(spec,seed){super('等待掷骰');this.spec=spec;this.seed=seed;}
}
function rollEvent(s,spec){
 if(!s._diceQueue)return Array.from({length:spec.count},()=>dice(s));
 const event=s._diceQueue[s._diceIndex++];
 if(!event)throw new DiceRequired(spec,s.seed);
 if(!Array.isArray(event)||event.length!==spec.count)throw Error('骰子事件不匹配');
 return event.map(value=>{const expected=dice(s);if(value!==expected)throw Error('骰子点数与已保存的随机状态不匹配');return value;});
}
function duel(s,label,a,d,bonus=0,defBonus=0,participants={}){
 const [ar,dr]=rollEvent(s,{label,count:2,a,d,bonus,defBonus,...participants});
 const av=a*2+ar+bonus,dv=d*2+dr+defBonus,won=av>dv;
 note(s,`${label} · ${av} : ${dv} · ${won?'进攻成功':'守方胜出'}`,'roll',{a,ar,bonus,av,d,dr,defBonus,dv,won});return won;
}
function finishDice(s){delete s._diceQueue;delete s._diceIndex;return s;}

function clone(s){return structuredClone(s);}
export function deploy(s,id,c,r){if(s.phase!=='deploy'||!inside(c,r)||r>5)throw Error('请在蓝方半场的空点位布阵。');const n=clone(s),p=player(n,id);if(!p||p.team!=='blue')throw Error('只能布置自己的球员。');if(n.players.some(x=>x.id!==id&&x.c===c&&x.r===r))throw Error('这个点位已有球员。');p.c=c;p.r=r;return n;}
function kickoff(s,team){const p=player(s,team+'-goat'),c=team==='blue'?2:3,r=team==='blue'?5:6;const at=s.players.find(x=>x.id!==p.id&&x.c===c&&x.r===r);if(at){at.c=p.c;at.r=p.r;}p.c=c;p.r=r;s.ball=p.id;s.protected=true;note(s,`${TEAM[team]} 中圈开球，本行动阶段不可射门。`,'kickoff');}
export function startMatch(s,rolls=null){
 if(s.phase!=='deploy')throw Error('比赛已经开始。');
 const n=clone(s);if(rolls){n._diceQueue=rolls;n._diceIndex=0;}
 const [face]=rollEvent(n,{label:'开球权抽签',count:1,kickoff:true,a:0,d:0,bonus:0,defBonus:0});
 n.phase='play';n.active=face<=3?'blue':'red';note(n,`开球骰 ${face} 点：${TEAM[n.active]} 先开球。`);kickoff(n,n.active);return finishDice(n);
}
function defenseBonus(p){const own=p.team==='blue'?p.r<=5:p.r>=6;const box=p.team==='blue'?p.r<=1:p.r>=10;return own?(box?2:1):0;}
function canAct(s,p){return s.phase==='play'&&p&&p.team===s.active&&s.ap>0&&p.actions<2;}
export function moves(s,id,skill=false){
 const p=player(s,id);if(!canAct(s,p)||skill&&(p.kind!=='panther'||p.skills<1))return [];
 const max=(stats(p).spd<3?1:stats(p).spd<5?2:3)+(skill?1:0),occupied=new Set(s.players.filter(x=>x.id!==id).map(x=>`${x.c},${x.r}`));
 const seen=new Set([`${p.c},${p.r}`]),queue=[{c:p.c,r:p.r,path:[],cross:0}],out=[];
 while(queue.length){const q=queue.shift();if(q.path.length>=max)continue;
  for(const [dc,dr] of [[0,p.team==='blue'?1:-1],[-1,0],[1,0],[0,p.team==='blue'?-1:1]]){
   const c=q.c+dc,r=q.r+dr,key=`${c},${r}`,cross=q.cross+(zone(r)!==zone(q.r)?1:0);
   if(!inside(c,r)||cross>1||occupied.has(key)||seen.has(key))continue;
   seen.add(key);const path=[...q.path,{c,r}],risk=s.ball===p.id&&path.some(v=>s.players.some(x=>x.team!==p.team&&distance(x,v)===1));const v={c,r,path,cross,risk};out.push(v);queue.push(v);
  }
 }
 return out;
}
export function interceptors(s,p,target){
 const dx=target.c-p.c,dy=target.r-p.r,l2=dx*dx+dy*dy;
 return s.players.filter(x=>x.team!==p.team).map(x=>{const t=((x.c-p.c)*dx+(x.r-p.r)*dy)/l2;return {p:x,t,d:Math.hypot(x.c-(p.c+t*dx),x.r-(p.r+t*dy))};}).filter(x=>x.t>0&&x.t<1&&x.d<=.7).sort((a,b)=>stats(b.p).def-stats(a.p).def||a.t-b.t||a.p.id.localeCompare(b.p.id)).map(x=>x.p);
}
export function shotInfo(s,id,skill=false){const p=player(s,id);if(!canAct(s,p)||s.ball!==id||s.protected||forward(p)<8||skill&&(p.kind!=='wolf'||p.skills<1))return null;const bonus=skill?3:0,defBonus=forward(p)>=10?1:3;let wins=0;for(let a=1;a<=6;a++)for(let d=1;d<=6;d++)if(2*stats(p).sho+a+bonus>8+d+defBonus)wins++;return {bonus,defBonus,chance:Math.round(wins/36*100)};}
export function legalActions(s){
 if(s.phase!=='play')return [];
 const out=[];
 for(const p of s.players.filter(p=>canAct(s,p))){
  for(const m of moves(s,p.id))out.push({type:'move',id:p.id,c:m.c,r:m.r});
  if(p.kind==='panther'&&p.skills)for(const m of moves(s,p.id,true))out.push({type:'skill',id:p.id,c:m.c,r:m.r});
  if(s.ball===p.id){
   for(const t of s.players.filter(x=>x.team===p.team&&x.id!==p.id)){out.push({type:'pass',id:p.id,target:t.id});if(p.kind==='goat'&&p.skills)out.push({type:'skill',id:p.id,target:t.id});}
   if(shotInfo(s,p.id))out.push({type:'shoot',id:p.id});if(shotInfo(s,p.id,true))out.push({type:'skill',id:p.id});
  }else {const ball=player(s,s.ball);if(ball&&ball.team!==p.team&&distance(ball,p)===1)out.push({type:'tackle',id:p.id});}
 }
 out.push({type:'end'});return out;
}
function resetShape(s){for(const p of s.players){const c={wolf:4,goat:2,panther:1}[p.kind],r={wolf:3,goat:2,panther:4}[p.kind];p.c=p.team==='blue'?c:5-c;p.r=p.team==='blue'?r:11-r;}}
function end(s,afterGoal=false){
 s.turn++;
 if(s.turn>=MAX_TURNS){s.phase='ended';s.ap=0;note(s,'终场哨响！'+(s.score.blue===s.score.red?'双方握手言和。':`${TEAM[s.score.blue>s.score.red?'blue':'red']} 获胜。`),'finish');return;}
 s.active=other(s.active);s.ap=3;s.protected=false;for(const p of s.players)p.actions=0;
 if(afterGoal){resetShape(s);kickoff(s,s.active);}else{
  note(s,`${TEAM[s.active]} 行动 · 3 AP`,'turn');
  if(s.ball===s.active+'-gk'){const t=s.players.filter(p=>p.team===s.active).sort((a,b)=>forward(a)-forward(b)||a.id.localeCompare(b.id))[0];s.ball=t.id;note(s,`门将短传出球 → ${stats(t).name}（免费）。`,'pass');}
 }
}
export function act(s,a,rolls=null){
 if(s.phase!=='play')throw Error('当前不在比赛阶段。');
 if(a.type==='end'){const n=clone(s);end(n);return n;}
 const p=player(s,a.id);if(!canAct(s,p))throw Error('该球员已经用完行动，或当前不是你的回合。');
 const skill=a.type==='skill';if(skill&&p.skills<1)throw Error('本场技能次数已用完。');
 const type=skill?({wolf:'shoot',goat:'pass',panther:'move'}[p.kind]):a.type;
 let move,target,info;
 if(type==='move'){move=moves(s,p.id,skill).find(m=>m.c===a.c&&m.r===a.r);if(!move)throw Error('该位置不可到达。');}
 else if(type==='pass'){target=player(s,a.target);if(s.ball!==p.id||!target||target.team!==p.team||target.id===p.id)throw Error('只能向队友传球。');}
 else if(type==='shoot'){info=shotInfo(s,p.id,skill);if(!info)throw Error(s.protected?'开球保护阶段不能射门。':'持球进入对方中场或后场后才能射门。');}
 else if(type==='tackle'){target=player(s,s.ball);if(!target||target.team===p.team||distance(target,p)!==1)throw Error('需要与对方持球者四向相邻。');}
 else throw Error('未知行动。');
 const n=clone(s),q=player(n,p.id);if(rolls){n._diceQueue=rolls;n._diceIndex=0;}q.actions++;n.ap--;if(skill){q.skills--;note(n,`${stats(q).name} 发动「${stats(q).skill}」`,'skill');}
 let scored=false;
 if(type==='move'){
  const checked=new Set();const hadBall=n.ball===q.id;note(n,`${stats(q).name}${hadBall?'盘带':'跑位'} → ${String.fromCharCode(65+a.c)}${a.r+1}`,'move');
  for(const step of move.path){q.c=step.c;q.r=step.r;
   if(n.ball===q.id){const defenders=n.players.filter(x=>x.team!==q.team&&distance(x,q)===1&&!checked.has(x.id)).sort((a,b)=>stats(b).def-stats(a).def||a.id.localeCompare(b.id));
    for(const d of defenders){checked.add(d.id);if(!duel(n,'过人 / 自动抢断',stats(q).tec,stats(d).def,0,defenseBonus(d),{attack:q.id,defend:d.id,c:q.c,r:q.r})){n.ball=d.id;n.metrics[d.team].tackles++;note(n,`${TEAM[d.team]} ${stats(d).name} 夺得球权。`,'turnover');break;}}
    if(n.ball!==q.id)break;
   }
  }
 }else if(type==='pass'){
  n.metrics[q.team].passes++;const d=skill?null:interceptors(n,q,target)[0];let ok;
  if(d)ok=duel(n,'传球 / 拦截',stats(q).pas,stats(d).def,skill?2:0,defenseBonus(d),{attack:q.id,defend:d.id});
  else if(distance(q,target)<=4){ok=true;note(n,'短中传线路畅通，传球成功。','pass');}
  else {const [roll]=rollEvent(n,{label:'长传落点',count:1,a:stats(q).pas,d:0,bonus:skill?2:0,defBonus:0,threshold:9}),value=2*stats(q).pas+roll+(skill?2:0);ok=value>9;note(n,`长传落点检定：${stats(q).pas}×2 + ${roll}${skill?' + 2':''} = ${value}，需 > 9 · ${ok?'成功':'出界'}`,'pass');}
  if(ok){n.ball=target.id;note(n,`${stats(q).name} → ${stats(target).name}，接球成功。`,'pass');}
  else{const receiver=d||n.players.filter(x=>x.team!==q.team).sort((a,b)=>distance(a,target)-distance(b,target)||a.id.localeCompare(b.id))[0];n.ball=receiver.id;note(n,d?`${stats(receiver).name} 截下传球。`:`传球出界，${TEAM[receiver.team]} 就近接管球权（简化界外球）。`,'turnover');}
 }else if(type==='tackle'){
  if(duel(n,'主动抢断',stats(q).def,stats(target).tec,defenseBonus(q),0,{attack:q.id,defend:target.id})){n.ball=q.id;n.metrics[q.team].tackles++;note(n,`${stats(q).name} 抢断成功。`,'turnover');}else note(n,'持球者护住了球。','info');
 }else if(type==='shoot'){
  n.metrics[q.team].shots++;if(duel(n,'射门 / 门将扑救',stats(q).sho,4,info.bonus,info.defBonus,{attack:q.id,defend:other(q.team)+'-gk'})){n.score[q.team]++;scored=true;note(n,`GOAL！${TEAM[q.team]} ${stats(q).name} 破门！`,'goal');}else{n.ball=other(q.team)+'-gk';note(n,'门将稳稳抱住足球，下次行动阶段免费出球。','save');}
 }
 if(scored||n.ap===0||n.players.filter(p=>p.team===n.active).every(p=>p.actions>=2))end(n,scored);
 return finishDice(n);
}
export function validateState(s){
 try{
  if(!s||s.version!==VERSION||!['deploy','play','ended'].includes(s.phase)||!['blue','red'].includes(s.active)||!Number.isInteger(s.turn)||s.turn<0||s.turn>24||!Number.isInteger(s.ap)||s.ap<0||s.ap>3||!Number.isInteger(s.seed)||s.seed<0||s.seed>4294967295||typeof s.protected!=='boolean')return false;
  if(s.phase==='ended'&&(s.turn!==24||s.ap!==0)||s.phase==='play'&&s.turn>=24)return false;
  if(!Array.isArray(s.players)||s.players.length!==6)return false;
  const ids=new Set(),pos=new Set();for(const p of s.players){if(!TYPES[p.kind]||!['blue','red'].includes(p.team)||p.id!==p.team+'-'+p.kind||!inside(p.c,p.r)||!Number.isInteger(p.actions)||p.actions<0||p.actions>2||!Number.isInteger(p.skills)||p.skills<0||p.skills>2||ids.has(p.id)||pos.has(`${p.c},${p.r}`))return false;ids.add(p.id);pos.add(`${p.c},${p.r}`);}
  if(!ids.has(s.ball)&&!['blue-gk','red-gk'].includes(s.ball))return false;
  if(!s.score||!['blue','red'].every(t=>Number.isInteger(s.score[t])&&s.score[t]>=0&&s.score[t]<=24))return false;
  if(!Array.isArray(s.log)||s.log.length>160||!s.log.every(l=>l&&typeof l.text==='string'&&l.text.length<600&&Number.isInteger(l.id)&&l.id>=0&&Number.isInteger(l.turn)&&l.turn>=0&&l.turn<=24&&['blue','red'].includes(l.team)&&['info','roll','kickoff','turn','pass','finish','skill','move','turnover','goal','save'].includes(l.type)&&(!l.roll||(['a','ar','bonus','av','d','dr','defBonus','dv'].every(k=>Number.isInteger(l.roll[k])&&l.roll[k]>=0&&l.roll[k]<=50)&&typeof l.roll.won==='boolean'))))return false;
  if(!Number.isInteger(s.serial)||s.serial<0||!['blue','red'].every(t=>['shots','passes','tackles'].every(k=>Number.isInteger(s.metrics?.[t]?.[k])&&s.metrics[t][k]>=0)))return false;
  return true;
 }catch{return false;}
}

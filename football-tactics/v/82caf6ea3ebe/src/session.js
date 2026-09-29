import {createGame,startMatch,act,DiceRequired,dice,validateState} from './engine.js';
export const SAVE_KEY='qg-football-astra-session-v2';
export const newSession=(seed)=>({schema:2,game:createGame(seed),pending:null});
function replay(game,action,rolls){
 try{return {game:action.type==='kickoff'?startMatch(game,rolls):act(game,action,rolls)};}
 catch(e){if(e instanceof DiceRequired)return {spec:e.spec,seed:e.seed};throw e;}
}
export function begin(s,action){
 if(s.pending)throw Error('请先完成当前掷骰判定。');
 const r=replay(s.game,action,[]);
 return r.game?{...s,game:r.game}:{...s,pending:{action:structuredClone(action),rolls:[],thrown:null}};
}
export function pendingView(s){
 if(!s.pending)return null;
 const r=replay(s.game,s.pending.action,s.pending.rolls);if(r.game)throw Error('无效的等待判定');
 const spec=r.spec,values=s.pending.thrown;let result=null;
 if(values){
  if(spec.kickoff)result={text:values[0]<=3?'蓝方先开球':'红方先开球',won:values[0]<=3};
  else{const av=spec.a*2+values[0]+spec.bonus,dv=spec.count===2?spec.d*2+values[1]+spec.defBonus:spec.threshold;
   result={av,dv,won:av>dv,text:spec.count===1?(av>dv?'传球到位':'传球失误'):(av>dv?'进攻成功':'防守成功')};}
 }
 return {...spec,seed:r.seed,values,result,actor:s.game.active,index:s.pending.rolls.length};
}
export function throwDice(s){
 const v=pendingView(s);if(!v||v.values)throw Error('本次骰子已掷出或没有待判定行动。');
 const rng={seed:v.seed};const values=Array.from({length:v.count},()=>dice(rng));
 return {...s,pending:{...s.pending,thrown:values}};
}
export function confirmDice(s){
 const v=pendingView(s);if(!v?.values)throw Error('请先掷骰。');
 const rolls=[...s.pending.rolls,s.pending.thrown],r=replay(s.game,s.pending.action,rolls);
 return r.game?{...s,game:r.game,pending:null}:{...s,pending:{...s.pending,rolls,thrown:null}};
}
export function validateSession(s){
 try{
  if(s?.schema!==2||!validateState(s.game))return false;
  if(s.pending===null)return true;
  const p=s.pending;if(!p||!Array.isArray(p.rolls)||p.rolls.length>18||!p.action||typeof p.action.type!=='string')return false;
  for(const roll of [...p.rolls,...(p.thrown===null?[]:[p.thrown])])if(!Array.isArray(roll)||roll.length<1||roll.length>2||roll.some(x=>!Number.isInteger(x)||x<1||x>6))return false;
  const v=pendingView(s);if(p.thrown){const rng={seed:v.seed};if(p.thrown.length!==v.count||p.thrown.some(x=>x!==dice(rng)))return false;}
  return true;
 }catch{return false;}
}
export function loadSession(storage){try{const raw=storage.getItem(SAVE_KEY);if(!raw)return {session:newSession(),notice:''};const s=JSON.parse(raw);if(!validateSession(s))throw Error();return {session:s,notice:s.pending?'已恢复未完成的掷骰判定':'已恢复本机对局'};}catch{return {session:newSession(),notice:'存档不可读取，已建立新对局。'};}}
export function saveSession(storage,s){try{storage.setItem(SAVE_KEY,JSON.stringify(s));return true;}catch{return false;}}

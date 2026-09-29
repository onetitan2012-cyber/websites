import {legalActions, player, carrier, forward, distance, stats, shotInfo, interceptors, moves} from './engine.js';
// The AI reads the public board only, never the random seed or future rolls.
export function chooseAction(s){
 const ball=carrier(s),own=ball.team===s.active;
 let best={type:'end'},high=-Infinity;
 for(const a of legalActions(s)){
  if(a.type==='end'){if(high<0){best=a;high=0;}continue;}
  const p=player(s,a.id),skill=a.type==='skill',type=skill?{wolf:'shoot',goat:'pass',panther:'move'}[p.kind]:a.type;
  let value=-5;
  if(type==='shoot')value=30+shotInfo(s,p.id,skill).chance*.5-(skill?1:0);
  if(type==='tackle')value=22+stats(p).def*2-stats(ball).tec;
  if(type==='pass'){
   const t=player(s,a.target),gain=forward(t)-forward(p),blocked=interceptors(s,p,t).length;
   value=gain*4+(t.actions<2?3:-18)+(forward(t)>=8&&!s.protected?12:0)+(p.actions===1?5:0)-5-(blocked&&!skill?12:0)-(skill?2:0);
   if(distance(p,t)>4&&stats(p).pas<4)value-=8;
  }
  if(type==='move'){
   const dest={...p,c:a.c,r:a.r},gain=forward(dest)-forward(p);
   if(s.ball===p.id){
    const risk=moves(s,p.id,skill).find(m=>m.c===a.c&&m.r===a.r)?.risk;
    const nearest=Math.min(...s.players.filter(x=>x.team!==p.team).map(x=>distance(x,dest)));
    value=8+gain*5+(forward(dest)>=8?8:0)-(risk?Math.max(2,10-stats(p).tec*1.3):0)+Math.min(nearest,3)-Math.abs(a.c-2.5)*.3;
    if(gain<=0)value-=12;
   }else if(!own){
    value=(distance(p,ball)-distance(dest,ball))*4+(distance(dest,ball)===1?12:0)+3;
   }else{
    const targetRow=Math.min(10,forward(ball)+3),old=Math.abs(forward(p)-targetRow),now=Math.abs(forward(dest)-targetRow);
    value=(old-now)*2+gain+(Math.abs(a.c-ball.c)>=1?1:0)-1;
   }
   if(skill)value-=1.5;
  }
  if(value>high){high=value;best=a;}
 }
 return best;
}

import {createGame,deploy,startMatch,act,player,carrier,stats,TEAM,moves,shotInfo,distance,legalActions} from './engine.js';
import {chooseAction} from './ai.js';
import {newSession,begin,pendingView,throwDice,confirmDice,loadSession,saveSession} from './session.js';
import {chooseQuality,QUALITY,QUALITY_KEY} from './quality.js';
import {DiceTray} from './dice.js';
import {Board,makePortraits} from './board.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw Error();},setItem(){throw Error();}};}
let savedQuality;try{savedQuality=storage.getItem(QUALITY_KEY);}catch{}
let quality=chooseQuality({requested:new URLSearchParams(location.search).get('quality'),saved:savedQuality,coarse:matchMedia('(pointer: coarse)').matches,width:innerWidth});
const loaded=loadSession(storage);let session=loaded.session,state=session.game,selected='blue-goat',mode='move',board,tray,timer,toastTimer,epoch=0,resultShown=false,rolling=false,holdStart=0,powerFrame=0,sound=false;
let portraits={};
const modal=$('#modal');
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3300);}
function portrait(kind){if(portraits[kind])return `<img src="${portraits[kind]}" alt="" draggable="false">`;const goat=kind==='goat',wolf=kind==='wolf',color=goat?'#d9d5c5':wolf?'#a1afb4':'#35424d',light=goat?'#f1ead5':wolf?'#d9ddda':'#53626b';return `<svg viewBox="0 0 100 130" aria-hidden="true"><path d="M10 130L18 100 37 88 64 88 84 99 92 130Z" fill="#e5e7da"/><path d="M10 130L21 100 29 108 25 130M92 130L82 101 72 108 76 130" fill="#2b6a96"/><path d="M36 91L50 105 65 91" fill="#254963"/>${goat?'<path d="M31 41C12 18 19 5 28 12L33 38M68 40C87 18 81 4 72 12L66 38" fill="#a59772" stroke="#e7d5a5" stroke-width="2"/>':wolf?'<path d="M28 48L20 8 43 31M58 31L80 8 74 51" fill="'+color+'" stroke="#d8dbcf" stroke-width="1"/>':'<ellipse cx="27" cy="34" rx="13" ry="14" fill="'+color+'"/><ellipse cx="75" cy="34" rx="13" ry="14" fill="'+color+'"/>'}<path d="M24 44Q27 25 50 26Q76 26 78 48L75 70 62 88 50 93 36 86 23 68Z" fill="${color}"/>${goat?'<path d="M23 46L6 42 18 59 28 59M75 46L93 42 82 59 73 59" fill="#c5c3b4"/><path d="M40 76L50 103 61 77" fill="#e5e1d2"/>':''}<path d="M24 50L37 56 43 66 33 69 23 62M77 50L64 56 58 66 69 69 78 62" fill="${light}" opacity=".6"/><path d="M28 50L44 55 40 59 31 58M72 50L56 55 60 59 69 58" fill="#14232c"/><path d="M32 55L40 56M60 56L68 55" stroke="#e5ce7a" stroke-width="2.6"/><path d="M43 61L57 61 63 77 50 86 36 77Z" fill="${light}"/><path d="M43 69L57 69 50 76Z" fill="#18262d"/><path d="M50 76V81M50 80L44 82M50 80L56 82" stroke="#35414a" fill="none"/><text x="50" y="126" fill="#234a69" text-anchor="middle" font-size="18" font-family="Arial" font-weight="bold">${goat?'10':wolf?'7':'9'}</text></svg>`;}
function renderRoster(){
 $('#roster').innerHTML=state.players.filter(p=>p.team==='blue').map(p=>{const t=stats(p);return `<button class="player-card ${p.id===selected?'selected':''}" data-player="${p.id}" aria-pressed="${p.id===selected}" aria-label="选择${t.name}"><div class="portrait">${portrait(p.kind)}<span class="jersey-number">${String(t.number).padStart(2,'0')}</span></div><div class="player-info"><b class="player-name">${t.name}</b><span class="player-role">${t.star} / ${t.role}</span><div class="stats">${[['SPD','spd'],['TEC','tec'],['PAS','pas'],['SHO','sho'],['DEF','def']].map(([l,k])=>`<span class="stat">${l}<b>${t[k]}</b></span>`).join('')}<span class="stat">GK<b>—</b></span></div></div><div class="card-footer"><span class="action-dots">${'●'.repeat(2-p.actions)}${'○'.repeat(p.actions)} <span>${state.ball===p.id?'持球':'可用行动'}</span></span><span class="charges">✦ ${p.skills}/2</span></div></button>`;}).join('');
 $$('[data-player]').forEach(el=>el.onclick=()=>select(el.dataset.player));
}
function entry(l){let formula='';if(l.roll){const r=l.roll;formula=`<span class="formula">攻 ${r.a}×2 + D6(${r.ar}) + ${r.bonus} = ${r.av}<br>守 ${r.d}×2 + D6(${r.dr}) + ${r.defBonus} = ${r.dv}</span>`;}return `<div class="log-entry ${esc(l.type)}"><span class="stamp">R${Math.min(12,Math.floor(l.turn/2)+1).toString().padStart(2,'0')}</span>${esc(l.text)}${formula}</div>`;}
function render(){
 const p=player(state,selected),t=p&&stats(p),human=state.phase==='play'&&state.active==='blue'&&!session.pending,can=human&&p?.team==='blue'&&p.actions<2,has=state.ball===selected;
 renderRoster();$('#score').innerHTML=`${state.score.blue} <em>:</em> ${state.score.red}`;$('#round').innerHTML=`${Math.min(12,Math.floor(state.turn/2)+1).toString().padStart(2,'0')} <small>/ 12</small>`;
 $('#turn-label').textContent=state.phase==='deploy'?'赛前 · 自由布阵':state.phase==='ended'?'全场比赛结束':human?'你的行动阶段':'赤曜竞技 · 思考中';if(session.pending)$('#turn-label').textContent='掷骰判定中';$('#turn-label').classList.toggle('ai',state.phase==='play'&&state.active==='red');
 $('#ap-dots').textContent='● '.repeat(state.ap)+'○ '.repeat(3-state.ap);$('#ap-label').textContent=`${state.ap} ACTION POINTS`;
 $('#selected-name').textContent=t?.name||'固定门将';$('#selected-detail').textContent=p?`${p.team==='blue'?'蓝方':'红方'} · ${t.role} · ${String.fromCharCode(65+p.c)}${p.r+1} · 已行动 ${p.actions}/2`:'门前驻守 · GK 4 · 自动扑救';
 const owner=carrier(state);$('#possession').textContent=`◉ ${TEAM[owner.team]} · ${owner.kind==='keeper'?'门将持球':stats(owner).name+'持球'}`;
 $('#deployment').classList.toggle('hidden',state.phase!=='deploy');$('#actions').classList.toggle('hidden',state.phase==='deploy');
 const enabled={move:can&&moves(state,selected).length>0,pass:can&&has,tackle:can&&owner.team!==p?.team&&owner.kind!=='keeper'&&distance(p,owner)===1,shoot:can&&!!shotInfo(state,selected),skill:can&&p.skills>0&&(p.kind==='panther'||has&&(p.kind==='goat'||!!shotInfo(state,selected,true)))};
 $$('[data-action]').forEach(el=>{el.disabled=!enabled[el.dataset.action];el.classList.toggle('active',mode===el.dataset.action);el.setAttribute('aria-pressed',String(mode===el.dataset.action));});
 const regularShot=shotInfo(state,selected),powerShot=p?.kind==='wolf'?shotInfo(state,selected,true):null;
 const shotButton=$('[data-action="shoot"]');shotButton.innerHTML=`<span>◎</span><span class="action-label">射门${regularShot?'<small>'+regularShot.chance+'%</small>':''}</span><kbd>F</kbd>`;shotButton.title=regularShot?`成功率 ${regularShot.chance}%，点击立即射门，消耗 1 AP。`:state.protected?'开球行动阶段禁止射门。':'需持球进入对方中场或后场，且有剩余行动。';
 $('#skill b').textContent=t?.skill||'专属技能';$('#skill small').textContent=`${p?.skills??0} / 2${powerShot?' · '+powerShot.chance+'%':''}`;
 $('#end').disabled=!human;$('#new').disabled=rolling;$('#start').disabled=!board||!!session.pending;
 const chance=p&&shotInfo(state,selected,mode==='skill');
 const descriptions={move:'点击蓝色光圈移动。金色点位表示路径上可能遭遇自动抢断。',pass:'点击己方接球球员。线路遇敌将进行拦截判定。',tackle:'对相邻持球者发动抢断，消耗 1 AP。',shoot:`射门成功率 ${chance?.chance??'—'}% · 守方平点获胜。`,skill:t?.skillText};
 $('#action-description').textContent=session.pending?'当前行动已锁定。掷出骰子并确认结果后继续。':!human?(state.phase==='ended'?'比赛已结束，可查看实况或开始新对局。':'AI 使用同一套行动与判定规则。'):!can?'选择还有行动次数的蓝方球员。':descriptions[mode];
 $('#board-status').textContent=state.phase==='deploy'?'选择球员，在蓝方半场布阵':state.protected?'中圈开球 · 本阶段禁止射门':`${TEAM[state.active]} ${state.phase==='ended'?'':'控场'} · 点位制 6 × 12`;
 $('#hint').textContent=state.phase==='deploy'?'使用默认阵型可直接开赛':human?`${t?.name||'选择球员'} / ${mode==='skill'?t?.skill:{move:'选择移动落点',pass:'选择接球队友',tackle:'抢断',shoot:'射门'}[mode]} · 1 AP`:'观察对手走位，准备下一步';
 $('#log').innerHTML=state.log.slice(-5).reverse().map(entry).join('')||'<div class="log-entry">球场已就绪。<br>你执蓝方，AI 执红方。<br>选择默认阵型，或自由调整站位。</div>';
 board?.update(state,selected,session.pending?'waiting':mode);renderDice();
 if(state.phase==='ended'&&!resultShown){resultShown=true;showResult();}
}
function select(id){if(id.endsWith('-gk')){toast('门将固定在球门前，自动扑救并在己方阶段免费出球。');return;}if(!player(state,id))return;selected=id;mode='move';render();}
function commit(next){
 const oldScore=state.score.blue+state.score.red;
 session=next.schema===2?next:{schema:2,game:next,pending:null};state=session.game;
 const saved=saveSession(storage,session);$('#save-status').textContent=saved?'● 本机自动保存':'○ 存储不可用 · 请保持页面开启';
 if(state.score.blue+state.score.red>oldScore){$('#goal-banner').textContent='GOAL!';$('#goal-banner').classList.add('show');setTimeout(()=>$('#goal-banner').classList.remove('show'),1700);}
 if(state.active==='blue'&&state.phase==='play'&&player(state,selected)?.team!=='blue')selected=state.ball.startsWith('blue')&&!state.ball.endsWith('gk')?state.ball:'blue-goat';
 render();scheduleAI();
}
function perform(a){if(state.phase!=='play'||state.active!=='blue')return toast('请等待你的行动阶段。');try{commit(begin(session,a));mode='move';render();}catch(e){toast(e.message);}}
function pick(v){
 if(session.pending)return toast('请先掷骰并确认当前判定；你仍可拖动旋转棋盘。');
 if(state.phase==='deploy'){if(v.id){select(v.id);return;}try{commit(deploy(state,selected,v.c,v.r));}catch(e){toast(e.message);}return;}
 if(state.phase!=='play')return;
 const p=player(state,selected),passMode=mode==='pass'||mode==='skill'&&p?.kind==='goat';
 if(v.id){if(passMode&&v.id!==selected&&v.id.startsWith('blue')&&!v.id.endsWith('gk')){perform({type:mode,id:selected,target:v.id});return;}select(v.id);return;}
 if(mode==='move'||mode==='skill'&&p?.kind==='panther')perform({type:mode,id:selected,c:v.c,r:v.r});else toast('请点击场上的接球球员，或选择另一项行动。');
}
function action(type){const button=$(`[data-action="${type}"]`);if(button?.disabled)return;mode=type;const p=player(state,selected);if(type==='shoot'||type==='tackle'||type==='skill'&&p.kind==='wolf'){perform({type,id:selected});return;}render();}
function scheduleAI(){
 clearTimeout(timer);if(modal.open||rolling||document.hidden)return;
 if(session.pending){const v=pendingView(session);if(v.count===1&&!v.kickoff&&v.actor==='red'){const token=epoch;timer=setTimeout(()=>{if(token!==epoch||modal.open)return;if(session.pending?.thrown)acceptRoll();else doRoll(.5);},v.values?1300:900);}return;}
 if(state.phase!=='play'||state.active!=='red')return;
 const token=epoch;timer=setTimeout(()=>{if(token!==epoch||modal.open||session.pending||state.active!=='red')return;try{commit(begin(session,chooseAction(state)));}catch(e){console.error(e);toast('AI 行动异常，已暂停。');}},850);
}
function openModal(html){clearTimeout(timer);$('#modal-content').innerHTML=html;if(!modal.open)modal.showModal();}
function closeModal(){modal.close();}
modal.addEventListener('close',scheduleAI);$('#close-modal').onclick=closeModal;
$('#help').onclick=()=>openModal(`<div class="micro">PLAYBOOK / 规则手册</div><h2>一块球场，十二轮较量。</h2><p>你执蓝方，对抗红方 AI。目标是在 12 轮结束时进球更多。每轮双方各行动一次；进球会提前结束当前行动阶段，由失球方开球。平局保留。</p><h3>01 · 球场与行动</h3><ul><li>6 列 × 12 行，棋子落在交点；每队 3 名球员与 1 名固定门将。蓝方向上进攻。</li><li>每方每阶段 3 AP，每名球员最多行动 2 次。移动、传球、射门、主动抢断或技能各消耗 1 AP。</li><li>四向移动，不能穿过棋子。SPD 1–2 / 3–4 / 5 分别可走 1 / 2 / 3 步。每次移动最多跨过一条分区边界，每区为 2 行。</li><li>持球移动接近对手时自动进行过人判定，每名防守者每次移动最多触发一次，不额外消耗 AP；失败立即停步并失球。</li></ul><h3>02 · 传、抢、射</h3><ul><li>对抗公式：属性 × 2 + 六面骰 + 加成，攻方必须严格大于守方；平点守方胜。</li><li>过人 TEC 对 DEF；主动抢断 DEF 对 TEC。防守球员在己方半场 DEF +1 加成，己方最后两行 +2（加在总值上）。</li><li>传球线路 0.7 格内的对手可拦截，取 DEF 最高者判定 PAS 对 DEF。无拦截且距离 ≤4 步自动成功；更远需 PAS×2+D6 >9，失败按简化界外球交给离接球点最近的对手。</li><li>进入对方中场或后场（向前第 9–12 行）可射门：SHO 对固定门将 GK 4。中场射门守方总值 +3，最后两行 +1。开球的整个行动阶段禁止射门。</li><li>扑救后门将持球；到己方行动阶段，免费交给位置最靠后的队友。无手动门将、越位、犯规或角球。</li></ul><h3>03 · 三位兽星</h3><ul><li>苍穹之狼：苍穹重炮，本次射门总值 +3。</li><li>天启山羊：穿云直塞，忽略线路拦截，长传判定 +2。</li><li>暗影黑豹：疾影突进，本次移动 +1 步，仍遵守分区限制。</li><li>每人每场 2 次；使用技能占用一次行动与 1 AP。</li></ul><h3>04 · 亲手掷骰</h3><p>开球、射门、抢断、过人和有风险传球进入掷骰台。按住蓝色按钮或骰盘蓄力，松开投掷；也可按空格。动画停下后查看顶面点数和双方算式，点击确认（或回车）结算。AI 进攻时，你仍须操作蓝色防守骰；AI 的红骰同步掷出。无对手参与的 AI 长传会自动展示单骰。安全短传和无对抗跑位不需要掷骰。</p><p>蓄力只改变投掷动画，不改变概率。点数在投掷触发时产生并立即保存；骰子动画顶面与判定数值一致。一次行动有多个对抗时，需要逐次掷骰与确认；AP 和技能只在整次行动提交时扣一次。</p><h3>操作与保存</h3><p>拖动棋盘可水平 360° 旋转，滚轮或双指缩放；复位按钮回到蓝方视角。点球员卡或棋子选择角色，点行动按钮后再选目标。M 移动 / P 传球 / T 抢断 / F 射门 / S 技能；1–3 选择己方角色。射门与抢断按下即执行。打开规则时 AI 暂停。进度与待掷骰事件保存在当前浏览器本机，刷新可继续；已掷出的点数不会重掷。</p><p>首版数值是可玩的测试规则，尚待人工对局调平；AI 使用公开棋面启发式决策。</p>`);
$('#full-log').onclick=()=>openModal(`<div class="micro">MATCH JOURNAL</div><h2>比赛实况与掷骰记录</h2>${state.log.length?state.log.slice().reverse().map(entry).join(''):'<p>比赛尚未开始。</p>'}`);
function showResult(){const winner=state.score.blue===state.score.red?'势均力敌 · 平局':state.score.blue>state.score.red?'阿尔法联队获胜':'赤曜竞技获胜';openModal(`<div class="micro">FULL TIME / 全场结束</div><h2>${winner}</h2><div class="score-final">${state.score.blue} : ${state.score.red}</div><div class="result-metrics">${[['shots','射门'],['passes','传球'],['tackles','成功抢断']].map(([k,n])=>`<div>${n}<b>${state.metrics.blue[k]} / ${state.metrics.red[k]}</b>蓝方 / 红方</div>`).join('')}</div><p>十二轮战术较量结束。关闭此窗口可继续回看棋盘与判定记录。</p><button class="primary" id="play-again">再战一场 →</button>`);$('#play-again').onclick=newGame;}
function newGame(){epoch++;clearTimeout(timer);resultShown=false;session=newSession();state=session.game;selected='blue-goat';mode='move';modal.close();commit(session);toast('新球场已就绪。');}
$('#new').onclick=()=>{openModal('<div class="micro">NEW MATCH</div><h2>开始一场新的较量？</h2><p>当前本机对局将被替换。</p><button class="primary" id="confirm-new">确认新对局 →</button>');$('#confirm-new').onclick=newGame;};
$('#start').onclick=()=>{try{commit(begin(session,{type:'kickoff'}));toast('掷出开球骰：1–3 蓝方先手，4–6 红方先手。');}catch(e){toast(e.message);}};
$('#end').onclick=()=>perform({type:'end'});$$('[data-action]').forEach(b=>b.onclick=()=>action(b.dataset.action));
$('#camera').onclick=()=>{if(!board)return;board.setView(board.view==='top'?'perspective':'top');$('#camera').textContent=board.view==='top'?'透视':'俯视';};
$('#reset-camera').onclick=()=>{board?.setView('perspective');$('#camera').textContent='俯视';};$('#rotate-left').onclick=()=>board?.rotateBy(-Math.PI/4);$('#rotate-right').onclick=()=>board?.rotateBy(Math.PI/4);
document.addEventListener('keydown',e=>{const control=e.target.closest?.('button,a,input,textarea');if(session.pending&&control&&!['roll','confirm-roll'].includes(control.id))return;if(session.pending&&!modal.open&&(e.code==='Space'||e.key==='Enter')&&!e.repeat){e.preventDefault();session.pending.thrown?acceptRoll():doRoll(.6);return;}if(modal.open||e.metaKey||e.ctrlKey||e.altKey||/INPUT|TEXTAREA/.test(e.target.tagName))return;const key=e.key.toLowerCase();if(['1','2','3'].includes(key)){select(['blue-wolf','blue-goat','blue-panther'][Number(key)-1]);return;}if(key==='?')$('#help').click();const a={m:'move',p:'pass',t:'tackle',f:'shoot',s:'skill'}[key];if(a){e.preventDefault();action(a);}});
function renderDice(){
 const dock=$('#dice-dock'),v=pendingView(session);dock.classList.toggle('hidden',!v);if(!v)return;
 const auto=v.actor==='red'&&v.count===1&&!v.kickoff;
 $('#dice-title').textContent=v.kickoff?'谁来开球？掷骰决定！':v.label;
 const name=id=>id?.endsWith('-gk')?'门将':stats(player(state,id)||{kind:'wolf'}).name;
 const matchup=v.attack?`${name(v.attack)} 对 ${name(v.defend)}`:'';
 $('#dice-counter').textContent=`第 ${v.index+1} 次判定 · ${auto?'AI 投掷':v.actor==='red'&&!v.kickoff?'轮到你防守':'轮到你掷骰'}`;
 if(!rolling)tray?.present(v.values,v.count,v.kickoff?'blue':v.actor);
 $('#dice-title').title=matchup;
 const names=v.kickoff?['开球骰']:v.count===1?['传球骰']:v.actor==='blue'?['蓝方 · 你的进攻骰','红方 · AI 防守骰']:['红方 · AI 进攻骰','蓝方 · 你的防守骰'];
 $('#dice-labels').innerHTML=names.map((n,i)=>`<span class="${v.kickoff?'blue':i===0?v.actor:v.actor==='blue'?'red':'blue'}">${n} ${!rolling&&v.values?' / '+v.values[i]:' / —'}</span>`).join('');
 const result=$('#dice-result');
 if(v.result&&!rolling){const r=v.result;result.innerHTML=v.kickoff?`<strong>${r.text}</strong>`:`攻 ${v.a}×2 + 骰 ${v.values[0]} + ${v.bonus} = <b>${r.av}</b>${v.count===2?`<br>守 ${v.d}×2 + 骰 ${v.values[1]} + ${v.defBonus} = <b>${r.dv}</b>`:` · 目标 > ${r.dv}`}<strong>${r.text}${r.av===r.dv?' · 平点守方胜':''}</strong>`;}
 else result.textContent=rolling?'骰子滚动中…':v.kickoff?'1–3 蓝方先手 · 4–6 红方先手':v.count===2?`攻 ${v.a}×2 + D6 + ${v.bonus}  /  守 ${v.d}×2 + D6 + ${v.defBonus}`:`传球 ${v.a}×2 + D6 + ${v.bonus} > 9`;
 $('#dice-instruction').textContent=rolling?'落定后展示点数，再确认结算。':v.values?'点数已保存，确认后执行判定。':auto?'AI 正在准备掷骰。':v.kickoff?'按住蓄力，松开投掷。空格也可以掷骰。':v.count===2?`${matchup}。你掷蓝骰，AI 同步掷红骰。`:'按住蓄力，松开投掷；空格也可以掷骰。';
 $('#roll').classList.toggle('hidden',!!v.values&&!rolling);$('#roll').disabled=rolling||auto;$('#confirm-roll').classList.toggle('hidden',!v.values||rolling);$('#confirm-roll').disabled=rolling||auto;
 dock.classList.toggle('rolling',rolling);if(session.pending)$('#hint').textContent='当前行动等待掷骰确认 · 拖动仍可旋转棋盘';
}
function diceSound(){if(!sound)return;try{const ctx=new (window.AudioContext||window.webkitAudioContext)();for(let i=0;i<5;i++){const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='triangle';osc.frequency.setValueAtTime(160+i*37,ctx.currentTime+i*.13);gain.gain.setValueAtTime(.035,ctx.currentTime+i*.13);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.13+.07);osc.connect(gain).connect(ctx.destination);osc.start(ctx.currentTime+i*.13);osc.stop(ctx.currentTime+i*.13+.08);}setTimeout(()=>ctx.close(),1100);}catch{}}
async function doRoll(power=.6){
 if(!session.pending||session.pending.thrown||rolling||modal.open)return;
 clearTimeout(timer);holdStart=0;cancelAnimationFrame(powerFrame);$('#power-fill').style.width='0%';
 try{session=throwDice(session);rolling=true;const saved=saveSession(storage,session);$('#save-status').textContent=saved?'● 点数已保存':'○ 存储不可用 · 请保持页面开启';render();diceSound();const token=epoch;await tray.roll(session.pending.thrown,power);if(token!==epoch)return;rolling=false;render();scheduleAI();}catch(e){rolling=false;toast(e.message);}
}
function acceptRoll(){if(rolling||!session.pending?.thrown||modal.open)return;try{commit(confirmDice(session));}catch(e){toast(e.message);}}
function charge(){if(!holdStart)return;$('#power-fill').style.width=`${Math.min(1,(performance.now()-holdStart)/1000)*100}%`;powerFrame=requestAnimationFrame(charge);}
function startHold(e){const v=pendingView(session);if(!v||v.values||rolling||v.actor==='red'&&v.count===1&&!v.kickoff||e.button>0)return;e.preventDefault();holdStart=performance.now();charge();}
$('#roll').addEventListener('pointerdown',startHold);$('#dice-tray').addEventListener('pointerdown',startHold);
window.addEventListener('pointerup',()=>{if(holdStart){const power=Math.min(1,(performance.now()-holdStart)/1000);doRoll(power);}});
window.addEventListener('pointercancel',()=>{holdStart=0;cancelAnimationFrame(powerFrame);$('#power-fill').style.width='0%';});
$('#roll').onclick=e=>{if(e.detail===0)doRoll(.6);};$('#confirm-roll').onclick=acceptRoll;
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(timer);holdStart=0;cancelAnimationFrame(powerFrame);$('#power-fill').style.width='0%';}else scheduleAI();});
$('#quality').onclick=()=>{quality=quality==='low'?'standard':'low';board?.setQuality(quality);tray?.setQuality(quality);try{storage.setItem(QUALITY_KEY,quality);}catch{}const url=new URL(location.href);url.searchParams.delete('quality');history.replaceState(null,'',url);$('#quality').textContent='画质：'+QUALITY[quality].label;toast(quality==='low'?'轻量画质：关闭阴影，降低分辨率，最高 30 帧。':'标准画质：开启阴影，最高 60 帧。');};
$('#quality').textContent='画质：'+QUALITY[quality].label;
$('#sound').onclick=()=>{sound=!sound;$('#sound').textContent=sound?'音效开':'音效关';$('#sound').setAttribute('aria-pressed',String(sound));};
try{board=new Board($('#board'),pick,quality);portraits=makePortraits();tray=new DiceTray($('#dice-tray'),quality);$('#loader').remove();}catch(e){console.error(e);$('#loader').innerHTML='无法启动三维棋盘。<br>请启用浏览器硬件加速，或使用支持 WebGL 2 的浏览器。<br><a href="./">返回作品介绍</a> · <a href="https://www.ponghood.com/">返回 Ponghood</a>';$('#start').disabled=true;board=null;$('#loader').className='error-state';}
render();if(loaded.notice)toast(loaded.notice);scheduleAI();

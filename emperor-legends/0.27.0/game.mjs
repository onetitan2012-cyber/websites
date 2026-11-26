import { cargoRows, chargeCells, createCouncilGame, createCrownGame, createFloodGame, createGame, createHallGame, createHandoverGame, createPetitionGame, createQiGame, createRegisterGame, createReturnGame, createRoadGame, createSupplyGame,
  createTrialGame, legalMoves, playMove, useCharge, gateHitsRemaining, roadCells, CARGO, CARGO_DESTINATIONS, COUNCIL_REVIEW_HITS, COUNCIL_STEPS,
  CROWN_HITS, CROWN_POSTS, CROWN_STEPS, HANDOVER_STEPS, MILESTONES, PETITION_STEPS, PETITION_TARGET, ROADBLOCK, ROAD_GOAL,
  floodStages, hallCounts, hallSide, FLOOD_RISE, FLOOD_START, FLOOD_STEPS, FLOOD_THRESHOLDS, HALL_COLUMNS, HALL_GOAL, HALL_STEPS,
  QI_GOAL, QI_GRAIN, QI_GRAIN_FLOOR, QI_GRAIN_START, QI_REGISTER, QI_STEPS, REGISTER_AXES, REGISTER_STEPS,
  RETURN_CELLS, RETURN_STEPS, SIZE, SUPPLY_PIECES, SUPPLY_SCHEMES, TARGET, TRIAL_STEPS, WATER_PIECE } from './board.mjs';
import { OPENING, ROUTES, STAGES, ending } from './story.mjs';
import { BIRTH, CHAPTER, CHAPTER_REVIEW, CHOICES, PATHS, ROAD, STONE_SHOTS, chapterLines } from './chapter.mjs';
import { QIN_PLACE, QIN_RESPONSES, qinGreeting } from './qin-opening.mjs';
import { QIN_REGISTER_RESPONSES, qinRegisterOpening } from './qin-register.mjs';
import { QIN_CLOSING_DATE, QIN_CLOSING_REPLIES, QIN_SUCCESSION, QIN_SUCCESSION_SOURCES, qinClosingOpening } from './qin-closing.mjs';
import { QIN_SEATING_DURATION } from './qin-seating.mjs';
import { councilHint } from './council-hint.mjs';
import { crownHint } from './crown-hint.mjs';
import { petitionHint } from './petition-hint.mjs';
import { handoverHint } from './handover-hint.mjs';
import { returnHint } from './return-hint.mjs';
import { hallHint } from './hall-hint.mjs';
import { floodHint } from './flood-hint.mjs';
import { supplyHint } from './supply-hint.mjs';
import { registerHint } from './register-hint.mjs';
import { qiHint } from './qi-hint.mjs';
import { COUNCIL_FILES, KING_CASE, KING_DATE, driverReply, DRIVER_MEMORY, KING_HISTORY, KING_ORDERS, KING_PLACE, KING_VERIFIED, kingOpening } from './king.mjs';
import { CROWN_CASE, CROWN_DATE, delayedHearing, NEXT_YEAR, crownProgress, crownResponse, CROWN_HISTORY, CROWN_NAMES, CROWN_PLACE, CROWN_HEARINGS, CROWN_VERIFIED, crownOpening } from './crown.mjs';
import { PETITION_ANCHOR, PETITION_DECISION, NAME_ORDERS, rosterVisible, PETITION_CASE, PETITION_COMPLETE_NOTES, PETITION_DATE,
  PETITION_HISTORY, PETITION_NAMES, PETITION_ORDERS, PETITION_PLACE, PETITION_READINGS, petitionOpening } from './petition.mjs';
import { CARGO_ARRIVED, CARGO_NAMES, HANDOVER_ANCHOR, HANDOVER_CASE, HANDOVER_DATE, HANDOVER_HISTORY, HANDOVER_ORDERS,
  HANDOVER_PLACE, HANDOVER_ROUTES, handoverOpening, handoverOutcome } from './handover.mjs';
import { RELIC_MARKS, RELIC_NAMES, RELIC_NOTES, RETURN_ANCHOR, RETURN_CASE, RETURN_DATE, RETURN_HISTORY, RETURN_ORDERS, RETURN_PLACE,
  returnOpening, returnOutcome } from './handan-return.mjs';
import { FRIEND_ANCHOR, FRIEND_DATE, FRIEND_HISTORY, FRIEND_ORDERS, hallOrderText, FRIEND_PLACE, HALL_CASE, HALL_NAMES, YAN_PLACE,
  friendOpening, hallOutcome } from './old-friend.mjs';
import { FLOOD_ANCHOR, FLOOD_CASE, FLOOD_DATE, FLOOD_HISTORY, FLOOD_ORDERS, FLOOD_PLACE, STEP_NAMES,
  BROTHER_QUESTION, familyAnswer, floodOpening, floodOutcome, nextWitness, SIGNAL } from './daliang.mjs';
import { CHU_ANCHOR, CHU_DATE, CHU_HISTORY, CHU_ORDERS, STEADY_CASE, STEADY_PLACE, SUPPLY_NAMES, SWIFT_CASE, SWIFT_PLACE,
  chuEnding, returnLines, countedLines, steadyOutcome, swiftOpening } from './chu-supplies.mjs';
import { REGISTER_CASE, REGISTER_NAMES, REGISTER_NOTES, YAN_ANCHOR, YAN_DATE, YAN_FERRY, YAN_HISTORY, YAN_ORDERS, YAN_STUDY,
  yanOpening, yanOutcome } from './yan-dai.mjs';
import { QI_ANCHOR, QI_CASE, QI_DATE, QI_HISTORY, QI_ORDERS, QI_PLACE, qiOpening, qiOutcome } from './qi.mjs';
import { EMPEROR_ANCHOR, EMPEROR_DATE, EMPEROR_HISTORY, EMPEROR_PLACE, emperorStory } from './emperor.mjs';
import { playFriendExpansion, readOtherHistory, folioLabel, showFolioCard } from './friend-expansion.mjs';
import { playMarket, playReturnedTablet, ferryLetter, ZHAO_HISTORY } from './zhao-letter.mjs';
import { fieldApproach, fieldAfterPlanting, canalInquiry, readingEcho, fieldLater, keepsakeLines, streetReply, canalHistory } from './canal.mjs';
import {letterPages, qinPage, firstEcho, letterMemory, reportHistory, archiveHistory} from './letters.mjs';
import { buildLegend } from './legend.mjs';
import { openCheckpointStore } from './checkpoint.mjs';
import { mountStoryReading, mountComparison, addPortrait } from './layout-compare.mjs?v=mobile-reading1';
import { mountReadingHeader, openTitleScreen } from './reading-header.mjs?v=bronze1';
import { mountCourtyard } from './courtyard.mjs';

const $ = id => document.getElementById(id);
const preview = new URLSearchParams(location.search).get('preview');
const compareSample = ['layout-birth', 'layout-board', 'layout-orders', 'layout-emperor'].includes(preview);
const reading = mountStoryReading();
const compare = compareSample ? mountComparison(preview.slice(7), reading) : null;
const checkpointStore = preview === null ? openCheckpointStore(() => window.localStorage) : null;
const chuSampleStore = preview === 'chu' ? openCheckpointStore(() => window.localStorage, true) : null;
const canalStore = preview === 'canal' ? openCheckpointStore(() => window.localStorage, 'canal') : null;
const letterStore = preview === 'letters' ? openCheckpointStore(() => window.localStorage, 'letters') : null;
const floodStore = preview === 'flood' ? openCheckpointStore(() => window.localStorage, 'flood') : null;
const crownStore = preview === 'crown' ? openCheckpointStore(() => window.localStorage, 'crown') : null;
let hearing;
let letterState = {page:'entry',read:[]};
let sampleHeard = false;
let sawField = false;
let campaignSnapshot = checkpointStore?.initial;
let chuLoad;
let savedChapter = checkpointStore?.initial?.chapters.length ?? 0;
const tacticsPreview = preview === 'tactics';
const trialPreview = tacticsPreview || preview === 'control';
const roadPreview = trialPreview || preview === 'rear' || preview === 'side';
const zhaoSample = preview === 'zhao-story';
const friendSample = preview === 'friend-story';
const stonePreview = preview === 'stones';
const qinPreview = ['qin', 'qin-register', 'qin-closing'].includes(preview);
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const content = $('content');
const scene = $('scene');
const stageDisplay = $('scene-progress');
const board = $('board');
const view = mountCourtyard(scene);
const pieces = [
  { name: '遮蔽', style: 'shade' }, { name: '陶', style: 'earth' },
  { name: '木', style: 'wood' }, { name: '布', style: 'cloth' },
];

let phase;
const LEVELS = {
  shelter: { title: '灯下藏身', goal: TARGET, create: createGame, milestones: MILESTONES, beats: STAGES,
    labels: ['挪箱', '遮灯', '扣门'], stat: '遮蔽棋子', mode: 'game' },
  road: { title: '穿过巷口', goal: ROAD_GOAL, create: createRoadGame, milestones: [1, 2, 3], beats: ROAD,
    labels: Object.values(ROAD).map(beat => beat.chip), stat: '已通路段', mode: 'lane' },
  council: { title: KING_CASE, goal: ROAD_GOAL, create: createCouncilGame, milestones: [1, 2, 3], beats: [null, ...COUNCIL_FILES],
    labels: COUNCIL_FILES.map(beat => beat.chip), stat: '已核案卷', mode: 'court' },
  crown: { title: CROWN_CASE, goal: CROWN_POSTS.length, create: createCrownGame,
    milestones: [1, 2], labels: CROWN_NAMES, stat: '已回令', mode: 'crown' },
  petition: { title: PETITION_CASE, goal: 2, create: createPetitionGame,
    milestones: [1, 2], labels: PETITION_NAMES, stat: '已核案卷', mode: 'petition' },
  handover: { title: HANDOVER_CASE, goal: CARGO.length, create: createHandoverGame,
    milestones: [1, 2], labels: CARGO_NAMES, stat: '已运抵', mode: 'handover' },
  return: { title: RETURN_CASE, goal: RETURN_CELLS.length, create: createReturnGame,
    milestones: [1, 2, 3], labels: RELIC_NAMES, stat: '已找到', mode: 'return' },
  friend: { title: HALL_CASE, goal: HALL_GOAL, create: createHallGame,
    milestones: [1, 2], labels: HALL_NAMES, stat: '已完成', mode: 'friend' },
  flood: { title: FLOOD_CASE, goal: FLOOD_THRESHOLDS.length, create: createFloodGame,
    milestones: [1, 2, 3], labels: STEP_NAMES, stat: '积水水位', mode: 'flood' },
  swift: { title: SWIFT_CASE, goal: SUPPLY_SCHEMES.swift.targets.length, create: () => createSupplyGame('swift'),
    milestones: [1, 2, 3], labels: ['装入 3 份', '装入 6 份', '装满 8 份'], stat: '已装粮', mode: 'chu' },
  steady: { title: STEADY_CASE, goal: SUPPLY_SCHEMES.steady.targets.length, create: () => createSupplyGame('steady'),
    milestones: [1, 2], labels: ['第一批', '第二批'], stat: '已装批次', mode: 'chu' },
  yan: { title: REGISTER_CASE, goal: REGISTER_AXES.length, create: createRegisterGame,
    milestones: [1, 2], labels: REGISTER_NAMES, stat: '已合简', mode: 'yan' },
  qi: { title: QI_CASE, goal: QI_GOAL, create: createQiGame,
    milestones: [1, 2], labels: ['民籍', '市粮'], stat: '已核民籍', mode: 'qi' },
};
const petitionPieces = [{ name: '青简，旧例', style: 'precedent' }, { name: '赭简，名籍', style: 'roster' },
  ...pieces.slice(2)];
const cargoPieces = CARGO_NAMES.map((name, index) => ({ name, style: index ? 'grain-cargo' : 'seal-cargo' }));
const cargoInstruction = '封签和粮筹不能交换。消除它们下方的棋子，物资就会下落。';
const waterPiece = { name: '蓝色水波', style: 'water-chip' };
const supplyPieces = [{ name: '粮袋', style: 'supply-grain' }, { name: '干布', style: 'supply-cloth' }];
const qiPieces = pieces.map((piece, index) => index === QI_REGISTER ? { name: '蓝色民籍', style: 'qi-register' }
  : index === QI_GRAIN ? { name: '市粮袋，消除会调走', style: 'supply-grain' } : piece);
const qiRules = '蓝简计入民籍。消金色粮袋会扣市粮，点选后有感叹号的交换会跌破留粮底线。';
let route = '';
let journey = {};
let act;
let level;
let game;
let stage;
let selected;
let suggested;
let tiles;
let busy;
let trialUses = [];
let chargePreview = [];
let logs;
let chapterOneLogs;
let chapterTwoLogs;
let chapterThreeLogs;
let chapterFourLogs;
let chapterFiveLogs;
let chapterSixLogs;
let chapterSevenLogs;
let chapterEightLogs;
let chapterNineLogs;
let chapterTenLogs;
let chapterElevenLogs;
let chapterTwelveLogs;
let kingResult;
let crownResult;
let petitionResult;
let handoverResult;
let handanResult;
let sawReturnScene = false;
let friendResult;
let collectedFolio = null;
let mapProgress = 0;
let floodResult;
let swiftResult;
let chuResult;
let yanResult;
let qiResult;
let crownMarks = [0, 0];
let jadeMoved = false;
let clerkOpenedName = false;
let evidence = [0, 0];
let firstReview = 0;
let cargo = [-1, -1];
let firstCargo = 0;
let found = RETURN_CELLS.map(() => false);
let firstHall = 0;
let hallHintState = null;
let hallProgress = [0, 0];
let waterLevel = FLOOD_START;
let floodWitness = 'unknown';
let floodLogStart = 0;
let floodHandsUp = false;
let supplyMode = 'swift';
let supplyStock = [0, 0];
let registerBound = [false, false];
let qiEntries = 0;
let qiGrain = QI_GRAIN_START;
let qinRegisterLogStart;
let qinClosingLogStart;
let origin;
let ignoreClicksUntil = 0;
let sound;
let audio;
let footstep;

function tag(name, className, text) {
  const element = document.createElement(name);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function button(label, style, action) {
  const item = tag('button', style, label);
  item.type = 'button';
  item.addEventListener('click', action);
  return item;
}

function actions(...buttons) {
  const list = tag('div', 'actions');
  list.append(...buttons);
  return list;
}

function setPhase(next, kicker, title) {
  phase = next;
  document.body.dataset.phase = next;
  $('desk-slips').hidden = true;
  const chapter = act === 'emperor' ? ['finale', '终章', '始皇帝'] : act === 'qi' ? ['twelve', '第十二章', '天下最后一国'] : act === 'yan' ? ['eleven', '第十一章', '燕代余烬'] : act === 'chu' ? ['ten', '第十章', '伐楚两策']
    : act === 'flood' ? ['nine', '第九章', '大梁之水'] : act === 'friend' ? ['eight', '第八章', '故人之刃']
    : act === 'return' ? ['seven', '第七章', '邯郸旧梦'] : act === 'handover' ? ['six', '第六章', '第一国']
    : act === 'petition' ? ['five', '第五章', '逐客与纳才']
    : act === 'crown' ? ['four', '第四章', '加冠之变'] : act === 'king' ? ['three', '第三章', '少年秦王']
    : act === 'qin' ? ['two', '第二章', '西归秦关'] : ['one', '第一章', '邯郸孤子'];
  document.body.dataset.chapter = chapter[0];
  $('chapter-number').textContent = chapter[1];
  $('chapter-name').textContent = chapter[2];
  document.title = chapter[2] + ' · 帝王传说';
  $('chapter-region').textContent = chapter[0] === 'finale' ? EMPEROR_PLACE : chapter[0] === 'twelve' ? '齐国 · 临淄' : chapter[0] === 'eleven' ? '燕地 · 咸阳' : chapter[0] === 'ten' ? '秦营 · 楚地以北'
    : chapter[0] === 'nine' ? '魏故都 · 大梁' : chapter[0] === 'eight' ? '燕国 · 秦国'
    : chapter[0] === 'seven' ? '赵故都 · 邯郸' : chapter[0] === 'six' ? '韩故都 · 新郑'
    : chapter[0] === 'one' ? '赵国 · 邯郸' : '秦国';
  $('panel-kicker').textContent = kicker;
  $('panel-title').textContent = title;
  $('flood-witness').hidden = act !== 'flood' || next !== 'game';
  content.hidden = next === 'game';
  $('play').hidden = next !== 'game';
  stageDisplay.hidden = !['game', 'lost', 'ending'].includes(next) || act === 'crown' && next === 'ending';
  $('log').hidden = next === 'game';
  $('restart-campaign').hidden = !checkpointStore || next !== 'complete';
  document.querySelectorAll('.route-strip span').forEach(item => {
    if (item.dataset.act === act) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  if (scrollY > 35 && matchMedia('(max-width: 820px)').matches) window.scrollTo(0, 0);
}

function updateScene(mode, place, note, { cue = false, patrol = '', storyBeat = '', assisted = false, replyText = '',
  rearDoor = phase === 'travel' ? 'closed' : 'open' } = {}) {
  const nextRoad = phase === 'game' && mode === 'lane' && !cue && stage < ROAD_GOAL ? ROAD[stage + 1].chip : '';
  const pin = $('scene-focus');
  pin.textContent = nextRoad;
  pin.classList.toggle('next-road', Boolean(nextRoad));
  const gateHits = (mode === 'court' && phase === 'complete' ? kingResult?.gateHits : game?.gateHits) ?? 0;
  view.show({ mode, replyText, zhaoYard: sawReturnScene, zhaoProof: handanResult?.sawTablet && handanResult.key, mapProgress, route, stage, cue, patrol, path: journey.c3, storyBeat, nextRoad, rearDoor, assisted,
    gateHits, sceneChoice: journey.q1, keepsTablet: journey.q3 === 'carry', marks: crownMarks, evidence, jadeMoved, clerkOpenedName, cargo, found, hallProgress, waterLevel, floodWitness, floodHandsUp, legacyFlood: phase === 'complete' && floodResult?.recognized === undefined,
    supplyMode, supplyStock, registerBound, yanStoneKept: friendResult?.key === 'keep', qiEntries, qiGrain, finaleStone: friendResult?.key });
  if (mode !== 'petition' || storyBeat !== 'jade') $('jade-target').hidden = true;
  if (mode !== 'emperor' || storyBeat !== 'signed') $('proposal-roll').hidden = true;
  scene.dataset.storyBeat = storyBeat;
  scene.dataset.gateHits = stage === ROAD_GOAL - 1 ? gateHits : 0;
  scene.dataset.rearDoor = rearDoor;
  scene.dataset.world = mode;
  scene.dataset.path = journey.c3 ?? '';
  scene.querySelector('canvas').setAttribute('aria-label', place + '三维场景');
  scene.dataset.stage = stage;
  scene.dataset.cue = cue ? stage : '';
  scene.dataset.patrol = patrol;
  scene.dataset.marks = mode === 'crown' ? crownMarks.join(',') : '';
  const showSlips = mode === 'petition' && jadeMoved && (['game','lost'].includes(phase) || ['signature','spread','canal-brief'].includes(storyBeat));
  $('desk-slips').hidden = !showSlips;
  if (showSlips) $('roster-line').textContent = rosterVisible(evidence[1], clerkOpenedName) ? '楚客　李斯' : '尚未展到此行';
  scene.dataset.evidence = mode === 'petition' ? evidence.join(',') : '';
  scene.dataset.cargo = mode === 'handover' ? cargo.join(',') : '';
  scene.dataset.found = mode === 'return' ? found.map(Number).join(',') : '';
  scene.dataset.hallProgress = mode === 'friend' ? hallProgress.join(',') : '';
  if (mode === 'flood' && phase === 'game') {
    const caption = $('flood-witness');
    caption.firstElementChild.textContent = '石阶 ' + stage + '/3 · ' + (floodWitness === 'unknown' ? '隔水未辨' : '两边已相认');
    caption.lastElementChild.textContent = floodWitness === 'unknown' ? '陶婶循声张望，还看不清排上的人。'
      : floodWitness === 'answered' && stage === 0 ? '小满「我还在这儿！」　陶婶「看见你的手了。」'
      : note;
  }
  scene.dataset.waterLevel = mode === 'flood' ? waterLevel : '';
  scene.dataset.supplyMode = mode === 'chu' ? supplyMode : '';
  scene.dataset.supplyStock = mode === 'chu' ? supplyStock.join(',') : '';
  scene.dataset.registerBound = mode === 'yan' ? registerBound.map(Number).join(',') : '';
  scene.dataset.qiEntries = mode === 'qi' ? qiEntries : '';
  scene.dataset.qiGrain = mode === 'qi' ? qiGrain : '';
  $('place').textContent = place;
  $('scene-note').textContent = note;
  if (['crown','court','petition','emperor'].includes(mode)) $('desk-caption').textContent = note;
  stageDisplay.querySelectorAll('li').forEach(item => {
    if (mode === 'qi') {
      const entries = item.dataset.count === '1';
      item.classList.toggle('done', entries && qiEntries === QI_GOAL);
      item.classList.toggle('danger', !entries && qiGrain < QI_GRAIN_FLOOR);
      item.classList.remove('next');
      item.textContent = entries ? `民籍 ${qiEntries} / ${QI_GOAL}` : `市粮 ${qiGrain} 份`;
      return;
    }
    if (mode === 'yan') {
      const index = Number(item.dataset.count) - 1;
      if (index >= registerBound.length) return;
      item.classList.toggle('done', registerBound[index]);
      item.classList.remove('next');
      item.textContent = REGISTER_NAMES[index] + (registerBound[index] ? ' 已合简' : ' 待拼');
      return;
    }
    if (mode === 'chu') {
      const index = Number(item.dataset.count) - 1;
      const activeLevel = LEVELS[supplyMode];
      if (!activeLevel.labels[index]) return;
      item.classList.toggle('done', stage > index);
      item.classList.toggle('next', stage === index && phase === 'game');
      const batchSize = SUPPLY_SCHEMES.steady.targets[0][0];
      const loaded = supplyStock.map(amount => Math.max(0, Math.min(batchSize, amount - index * batchSize)));
      item.textContent = activeLevel.labels[index] + (supplyMode === 'steady'
        ? stage > index ? ' 已封车' : ` 粮 ${loaded[0]} · 布 ${loaded[1]}` : '');
      return;
    }
    if (mode === 'flood') {
      const index = Number(item.dataset.count) - 1;
      const exposed = waterLevel <= FLOOD_THRESHOLDS[index];
      item.classList.toggle('done', exposed);
      item.classList.toggle('next', !exposed && stage === index);
      item.textContent = STEP_NAMES[index] + (exposed ? ' 已露出' : ' 水下');
      return;
    }
    if (mode === 'friend') {
      const index = Number(item.dataset.count) - 1;
      item.classList.toggle('done', hallProgress[index] === 2);
      item.classList.toggle('next', phase === 'game' && stage < HALL_GOAL && hallSide(firstHall, stage, game?.priority) === index);
      item.textContent = HALL_NAMES[index] + ' ' + hallStatus(hallProgress[index]);
      return;
    }
    if (mode === 'return') {
      const index = Number(item.dataset.count) - 1;
      item.classList.toggle('done', found[index]);
      item.classList.remove('next');
      item.textContent = RELIC_NAMES[index] + (found[index] ? ' 已找到' : ' 待找');
      return;
    }
    if (mode === 'handover') {
      const index = Number(item.dataset.count) - 1;
      if (index >= cargo.length) return;
      item.classList.toggle('done', cargo[index] === SIZE - 1);
      item.classList.remove('next');
      item.textContent = CARGO_NAMES[index] + ' ' + cargoStatus(cargo[index]);
      return;
    }
    if (mode === 'petition') {
      const index = Number(item.dataset.count) - 1;
      if (index >= evidence.length) return;
      item.classList.toggle('done', evidence[index] === PETITION_TARGET);
      item.classList.remove('next');
      item.textContent = PETITION_NAMES[index] + ' ' + evidence[index] + ' / ' + PETITION_TARGET;
      return;
    }
    if (mode === 'crown') {
      const index = Number(item.dataset.count) - 1;
      if (index >= crownMarks.length) return;
      const mark = crownMarks[index];
      item.classList.toggle('done', mark === CROWN_HITS);
      item.classList.remove('next');
      item.textContent = CROWN_NAMES[index] + ' ' + (mark === CROWN_HITS ? '已回令' : mark + ' / ' + CROWN_HITS);
      return;
    }
    item.classList.toggle('done', stage >= Number(item.dataset.count));
  });
}

function showDialogue(entry, buttons, ready) {
  const bubble = tag('div', 'dialogue');
  bubble.append(tag('div', 'speaker', entry.speaker), tag('p', 'line', entry.line));
  if (entry.action) bubble.append(tag('p', 'action', entry.action));
  addPortrait(bubble, scene, entry.speaker);
  content.replaceChildren(bubble, buttons);
  reading.reveal(entry, buttons, ready);
}

function sequence(entries, onEnd, finalButton = '继续', onShow) {
  function next(index, focus = false) {
    const last = index === entries.length - 1;
    const entry = entries[index];
    logs.push(entry);
    onShow?.(index);
    const advance = button(last ? finalButton : '继续', 'action-button primary', () => {
      if (last) onEnd();
      else next(index + 1, true);
    });
    const row = actions(advance);
    showDialogue(entry, row);
    if (focus) advance.focus({ preventScroll: true });
  }
  next(0);
}

const chapterNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const chapterLabel = chapter => chapter === 13 ? '终章' : '第' + chapterNumbers[chapter - 1] + '章';

const saveHint = '每章结算自动保存，下次打开同一链接可继续。';
const notice = $('save-notice');
const noticeKey = 'emperor-legends:save-hint-seen';
let hintSeen = false;
try { hintSeen = localStorage.getItem(noticeKey) === '1'; } catch { /* Session only. */ }

function dismissSaveHint(event) {
  if (notice.hidden || notice.textContent !== saveHint || event.repeat ||
      (event.type === 'keydown' && !['Enter',' '].includes(event.key))) return;
  notice.hidden = true;
  hintSeen = true;
  try { localStorage.setItem(noticeKey, '1'); } catch { /* Session only. */ }
}
$('game-shell').addEventListener('click', dismissSaveHint, true);
$('game-shell').addEventListener('keydown', dismissSaveHint, true);
window.addEventListener('keydown', event => {
  if (event.target === document.body) dismissSaveHint(event);
});

function checkpointStatus(text, warning = false) {
  $('checkpoint-status').textContent = text;
  notice.textContent = text;
  notice.hidden = !warning && (text !== saveHint || hintSeen);
}

function reportSaveFailure(result) {
  checkpointStatus(result === 'conflict' ? '另一标签页更新了进度，刷新可读取最新存档。'
    : '本次进度未保存，仍可继续试玩。', true);
}

function rememberChapter(chapter) {
  if (!checkpointStore) return;
  const chapters = [
    { logs: chapterOneLogs },
    { logs: chapterTwoLogs, closingLogStart: qinClosingLogStart },
    { logs: chapterThreeLogs, result: kingResult },
    { logs: chapterFourLogs, result: crownResult },
    { logs: chapterFiveLogs, result: petitionResult },
    { logs: chapterSixLogs, result: handoverResult },
    { logs: chapterSevenLogs, result: handanResult },
    { logs: chapterEightLogs, result: friendResult },
    { logs: chapterNineLogs, result: floodResult },
    { logs: chapterTenLogs, result: chuResult },
    { logs: chapterElevenLogs, result: yanResult },
    { logs: chapterTwelveLogs, result: qiResult },
    { logs },
  ].slice(0, chapter);
  chapters[chapter - 1].logs = logs;
  const { q1, q2, q3, ...firstChoices } = journey;
  const snapshot = { journey: chapter === 1 ? firstChoices : journey, chapters };
  const result = checkpointStore.save(snapshot);
  if (result === 'saved') {
    campaignSnapshot = snapshot;
    savedChapter = chapter;
    checkpointStatus(chapterLabel(chapter) + '已保存 · 可关页后续玩');
  } else {
    reportSaveFailure(result);
  }
}

function restoreCheckpoint(snapshot) {
  campaignSnapshot = snapshot;
  const { journey: choices, chuFold } = snapshot;
  const chapters = snapshot.hearing ? snapshot.chapters.slice(0,3) : snapshot.lettersAt ? snapshot.chapters.slice(0,qinPage(snapshot.lettersAt.page) ? 3 : 11) : snapshot.canalAt ? snapshot.chapters.slice(0, 4) : chuFold ? snapshot.chapters.slice(0, 9) : snapshot.chapters;
  journey = { q1: null, q2: null, q3: null, ...choices };
  route = journey.c1 === 'wait_route' ? 'wait' : 'family';
  stage = 0;
  [chapterOneLogs, chapterTwoLogs, chapterThreeLogs, chapterFourLogs, chapterFiveLogs, chapterSixLogs,
    chapterSevenLogs, chapterEightLogs, chapterNineLogs, chapterTenLogs, chapterElevenLogs, chapterTwelveLogs] =
    chapters.map(chapter => chapter.logs);
  [kingResult, crownResult, petitionResult, handoverResult, handanResult, friendResult, floodResult,
    chuResult, yanResult, qiResult] = chapters.slice(2, 12).map(chapter => chapter.result);
  sawReturnScene = Boolean(handanResult?.sawTablet);
  qinClosingLogStart = chapters[1]?.closingLogStart;
  logs = chapters.at(-1).logs;
  const showResult = [complete, showQinClosingResult, showKingResult, showCrownResult, showPetitionResult,
    showHandoverResult, showReturnResult, showFriendResult, showFloodResult, showChuResult, showYanResult, showQiResult, showLegend];
  if (snapshot.hearing) {
    resumeHearing(snapshot.hearing);
    checkpointStatus('已续玩 · 冠礼之后');
    return;
  }
  if (snapshot.lettersAt) {
    openDesk(snapshot.lettersAt.page,snapshot.lettersAt.read,false);
    checkpointStatus('已续玩 · 等下一封');
    return;
  }
  if (snapshot.canalAt) { petition(snapshot.canalAt); return; }
  if (chuFold) { resumeChuFold(chuFold); return; }
  showResult[chapters.length - 1]();
  checkpointStatus('已续玩 · ' + chapterLabel(chapters.length) + '结算');
}

function chapterAction(label, style, chapter, action) {
  return button(label, style, () => {
    if (chapter < savedChapter && !window.confirm('从这里重玩，完成新的章节后会替换后续存档。继续吗？')) return;
    action();
  });
}

function restartCampaign() {
  if (savedChapter && !window.confirm('从头开始会清除本浏览器的章节进度和传说卷。确定吗？')) return;
  if (savedChapter) {
    const result = checkpointStore.clear();
    if (result !== 'saved') {
      reportSaveFailure(result);
      return;
    }
    campaignSnapshot = null;
    savedChapter = 0;
    checkpointStatus(saveHint);
  }
  $('journey-sheet').close();
  start();
  content.querySelector('button').focus({ preventScroll: true });
}

function start() {
  route = '';
  journey = { c1: null, c2: null, c3: null, g1: null, g2: null, q1: null, q2: null, q3: null };
  act = 'escape';
  $('chapter-date').textContent = '公元前 257 年前后';
  stage = 0;
  selected = null;
  suggested = [];
  logs = [];
  chapterOneLogs = null;
  chapterTwoLogs = null;
  chapterThreeLogs = null;
  chapterFourLogs = null;
  chapterFiveLogs = null;
  chapterSixLogs = null;
  chapterSevenLogs = null;
  chapterEightLogs = null;
  chapterNineLogs = null;
  chapterTenLogs = null;
  chapterElevenLogs = null;
  chapterTwelveLogs = null;
  kingResult = null;
  crownResult = null;
  petitionResult = null;
  handoverResult = null;
  handanResult = null;
  friendResult = null;
  floodResult = null;
  chuResult = null;
  yanResult = null;
  qiResult = null;
  sawReturnScene = false;
  if (letterStore) {
    sampleHeard=false;
    openDesk('watch');
    return;
  }
  if (zhaoSample) {
    act = 'petition';
    runMarket();
    return;
  }
  if (compare?.sample === 'orders') {
    act = 'petition';
    $('chapter-date').textContent = PETITION_DATE;
    setPhase('chapter', '书室', '秦王抬头');
    playPetitionLines(PETITION_DECISION, () => choosePetitionOrder(false), '议定停令');
    return;
  }
  if (compare?.sample === 'board') {
    route = 'wait';
    $('chapter-date').textContent = '约公元前 257 年';
    beginGame();
    return;
  }
  if (preview === 'emperor' || compare?.sample === 'emperor') {
    startEmperor();
    return;
  }
  if (preview === 'qi') {
    startQi();
    return;
  }
  if (preview === 'yan') {
    startYan();
    return;
  }
  if (preview === 'chu') {
    startChu();
    return;
  }
  if (preview === 'flood') {
    startFlood();
    return;
  }
  if (preview === 'hall') {
    act = 'friend';
    $('chapter-date').textContent = FRIEND_DATE;
    chooseFirstHall();
    updateScene('friend', FRIEND_PLACE, '左廊有人扶帘，右廊有人捧灯。两队都在等你。', { storyBeat: 'waiting' });
    return;
  }
  if (preview === 'friend') {
    oldFriend();
    return;
  }
  if (preview === 'return') {
    returnToHandan();
    return;
  }
  if (preview === 'handover') {
    handover();
    return;
  }
  if (preview === 'canal' || preview === 'petition') {
    petition();
    return;
  }
  if (preview === 'crown') {
    crown();
    return;
  }
  if (preview === 'king') {
    king();
    return;
  }
  if (preview === 'qin-closing') {
    beginQinClosing();
    return;
  }
  if (preview === 'qin-register') {
    beginQinRegister();
    return;
  }
  if (qinPreview) {
    qin();
    return;
  }
  if (roadPreview) {
    previewRoad();
    return;
  }
  if (stonePreview || friendSample) {
    act = 'friends';
    $('chapter-date').textContent = '数年后';
    updateScene('pottery', '邯郸 · 陶坊', '丹在陶坊问政来自哪里。');
    chooseChapter('c2', stone);
    return;
  }
  prologue();
}

function prologue() {
  act = 'birth';
  $('chapter-date').textContent = '公元前 259 年';
  setPhase('prologue', '剧情', '邯郸新生');
  sequence(BIRTH, compare ? () => compare.visit('board') : escape, compare ? '试玩灯下藏身' : '两年后', index => {
    const entry = BIRTH[index];
    if (!entry.beat) return;
    const outside = entry.beat === 'night';
    updateScene(outside ? 'opening' : 'birth',
      outside ? '邯郸 · 入夜' : '邯郸 · 居所', entry.note, { storyBeat: entry.beat });
  });
}

function escape() {
  act = 'escape';
  $('chapter-date').textContent = '两年后 · 约公元前 257 年';
  setPhase('opening', '剧情', '西去之人');
  updateScene('opening', '邯郸 · 原居所', '入夜，街口尚有脚步声。');
  sequence(OPENING, choose, '作出选择');
}

function fullStoryLink() {
  const link = tag('a', 'text-button preview-link', '从头玩完整故事');
  link.href = './';
  return link;
}

function previewRoad() {
  const rear = preview === 'rear';
  act = 'lane';
  journey.c3 = rear ? 'trust_ran' : 'own_route';
  $('chapter-date').textContent = '数年后';
  const path = PATHS[journey.c3];
  setPhase('travel', '场景试玩', path.place);
  const shot = rear ? 'S04-A02' : 'S04-B01';
  const entry = CHAPTER.route3.entries.find(line => line.shot === shot);
  updateScene('lane', path.place,
    rear ? '冉伯推开后门，让政和母亲先走。' : '政指向石阶后面。他记得那条路。',
    { rearDoor: rear ? 'opening' : 'closed', storyBeat: rear ? '' : 'recognize' });
  sequence([entry], () => beginGame(false, 'road'), '开始清障');
  content.querySelector('.actions').append(fullStoryLink());
  if (trialPreview) {
    const explanation = tacticsPreview
      ? '四连留下符牌，发动花一步。巷门要消除两次，符牌正中门所在的行列可以一次打开。'
      : '同一副盘面，限 4 步。前两段各消除一次，最后的巷门要在旁边消除两次。';
    content.insertBefore(tag('p', 'trial-explanation', explanation), content.querySelector('.actions'));
    content.querySelector('.actions').append(comparisonLink());
  }
}

function comparisonLink() {
  const link = tag('a', 'text-button preview-link', tacticsPreview ? '同盘普通对照' : '回到符牌试验');
  link.href = tacticsPreview ? '?preview=control' : '?preview=tactics';
  return link;
}

function choose() {
  setPhase('choice', '剧情选择', '先走，还是等一等？');
  const options = tag('div', 'choices');
  for (const [key, option] of Object.entries(ROUTES)) {
    const choice = button('', 'choice', () => travel(key));
    choice.append(tag('strong', '', option.title), tag('small', '', option.summary));
    options.append(choice);
  }
  content.replaceChildren(tag('p', 'body-text', '两种办法都能到旧院。你来替赵氏决定何时动身。'), options);
  options.firstElementChild.focus({ preventScroll: true });
}

function travel(key) {
  route = key;
  journey.c1 = key === 'wait' ? 'wait_route' : 'family_route';
  setPhase('travel', '转移', ROUTES[key].title);
  updateScene('travel', '邯郸 · 侧巷', key === 'wait' ? '田伯在后窗轻敲两下。' : '田伯沿侧巷领路。');
  if (route === 'wait') {
    tone(119, 0.11, 0.022);
    tone(105, 0.13, 0.022, 0.18);
  } else {
    playFootsteps([0.05, 0.038, 0.024]);
  }
  sequence([ROUTES[key].transition], () => beginGame(), '进旧院');
  content.querySelector('button').focus({ preventScroll: true });
}

function setStats(moves, collected) {
  $('moves').textContent = moves;
  $('target').textContent = level === LEVELS.swift ? `${supplyStock[0]} / ${SUPPLY_SCHEMES.swift.targets.at(-1)[0]}`
    : level === LEVELS.flood ? `${waterLevel} 格` : collected + ' / ' + level.goal;
}

function showObjective(collected, active = null) {
  const next = active ?? level.milestones.find(count => count > stage);
  const label = $('instructions');
  label.classList.toggle('resolving', active !== null);
  if (level === LEVELS.qi) {
    label.firstElementChild.textContent = qiEntries === QI_GOAL ? '民籍已核齐' : '蓝简 · 核民籍';
    label.lastElementChild.textContent = qiGrain < QI_GRAIN_FLOOR ? `市粮 ${qiGrain} 份 · 不足`
      : `留粮 ${qiGrain} 份 · 至少 ${QI_GRAIN_FLOOR}`;
    return;
  }
  if (level === LEVELS.yan) {
    label.firstElementChild.textContent = registerBound[0] ? '姓名已合简' : '横向四连 · 姓名';
    label.lastElementChild.textContent = registerBound[1] ? '来处已合简' : '纵向四连 · 来处';
    return;
  }
  if (level.mode === 'chu') {
    if (level === LEVELS.swift) {
      label.firstElementChild.textContent = '消掉粮袋，装满一车';
      label.lastElementChild.textContent = stage === level.goal ? '已备齐' : '三步共需 8 份';
    } else {
      const target = Math.min(8, 4 * (stage + 1));
      const missing = supplyStock.flatMap((n, i) => n < target ? [(target - n) + ' 份' + SUPPLY_NAMES[i]] : []);
      label.firstElementChild.textContent = stage === 2 ? '两车已封' : (stage ? '第二车' : '第一车') + '还差 ' + missing.join('、');
      label.lastElementChild.textContent = `粮 ${supplyStock[0]} / 8 · 布 ${supplyStock[1]} / 8`;
    }
    return;
  }
  if (level === LEVELS.flood) {
    label.firstElementChild.textContent = stage === level.goal ? '三段石阶都已露出' : '消掉蓝色水波';
    label.lastElementChild.textContent = '目标 ≤ ' + FLOOD_THRESHOLDS.at(-1) + ' 格';
    return;
  }
  if (level === LEVELS.friend) {
    const side = hallSide(firstHall, stage, game.priority);
    const task = side === null ? '' : HALL_NAMES[side] + (hallProgress[side] ? '接人' : '点灯');
    label.firstElementChild.textContent = stage === HALL_GOAL ? '两队宫人已接出'
      : side === null ? HALL_NAMES[firstHall] + '灯亮了' : task;
    label.lastElementChild.textContent = side === null ? '选好再落子' : stage < 2 ? '任意三消即可' : stage < HALL_GOAL ? '点棋子看落点结果' : '';
    return;
  }
  if (level === LEVELS.return) {
    label.firstElementChild.textContent = collected === level.goal ? '三件旧物已找到' : '让框内棋子参与消除';
    label.lastElementChild.textContent = collected === level.goal ? '' : '标记留在原处';
    return;
  }
  if (level === LEVELS.petition) {
    label.firstElementChild.textContent = collected === level.goal ? '两卷证据已齐' : '青简旧例 · 赭简名籍';
    label.lastElementChild.textContent = collected === level.goal ? '已核清' : '每卷需 ' + PETITION_TARGET + ' 条';
    return;
  }
  if (level === LEVELS.handover) {
    label.firstElementChild.textContent = '消除物资下方的棋子';
    label.lastElementChild.textContent = '落到底行即运抵';
    return;
  }
  if (level === LEVELS.crown) {
    label.firstElementChild.textContent = collected === level.goal ? '两处已回令' : '核验两处令印';
    label.lastElementChild.textContent = collected === level.goal ? '已核清' : '每处需 ' + CROWN_HITS + ' 次';
    return;
  }
  const council = level === LEVELS.council;
  label.firstElementChild.textContent = next ? level.beats[next].title
    : council ? '三卷已核清' : level === LEVELS.road ? '三段路都通了' : '藏身准备完成';
  const remaining = Math.max(0, (next ?? level.goal) - collected);
  const gate = gateHitsRemaining(game);
  label.lastElementChild.textContent = council
    ? active ? '已核清' : stage === 2 ? '还差 ' + (gate || COUNCIL_REVIEW_HITS) + ' 次复核' : next ? '在案卷旁消除' : '已核清'
    : level === LEVELS.road
    ? active ? '已打开' : gate ? '巷门还需 ' + gate + ' 次相邻消除' : next ? '在路障旁消除' : ''
    : active ? '已集满 ' + active + ' 枚' : remaining ? '还差 ' + remaining + ' 枚' : next ? '已集满' : '';
  stageDisplay.querySelectorAll('li').forEach(item => {
    item.classList.toggle('next', Number(item.dataset.count) === next && active === null);
  });
}

function levelPlace() {
  if (level === LEVELS.qi) return QI_PLACE;
  if (level === LEVELS.yan) return YAN_FERRY;
  if (level.mode === 'chu') return level === LEVELS.swift ? SWIFT_PLACE : STEADY_PLACE;
  if (level === LEVELS.flood) return FLOOD_PLACE;
  if (level === LEVELS.friend) return FRIEND_PLACE;
  if (level === LEVELS.return) return RETURN_PLACE;
  if (level === LEVELS.handover) return HANDOVER_PLACE;
  if (level === LEVELS.petition) return PETITION_PLACE;
  if (level === LEVELS.crown) return CROWN_PLACE;
  if (level === LEVELS.council) return KING_PLACE;
  return level === LEVELS.road ? PATHS[journey.c3].place : '旧院 · 东厢';
}

async function playStage(milestone, collected) {
  stage = milestone;
  const { action, result } = level.beats[stage];
  const clearingRoad = level === LEVELS.road;
  const patrol = !clearingRoad && stage === TARGET ? 'approach' : '';
  updateScene(level.mode, levelPlace(), action, { cue: true, patrol });
  showObjective(collected, stage);
  message(clearingRoad ? '路障旁的消除打通了这一段。' : '已收集 ' + stage + ' 枚。' + action);
  const detailed = clearingRoad || level === LEVELS.council;
  if (clearingRoad) {
    soundRoad(stage);
    playFootsteps([0.049, 0.038, 0.028], 0.39);
  } else tone(stage === level.goal ? 122 : 156, 0.22, 0.022, 0.19);
  await pause(detailed && stage === level.goal ? 1050 : clearingRoad ? 800 : stage === TARGET ? 830 : 640, 120);
  $('scene-note').textContent = result;
  message(result);
  await pause(detailed ? 460 : 580, 440);
}

function message(text) {
  $('feedback').textContent = text;
}

function setHighlights() {
  const showNeighbors = game?.road && !stage && suggested.length;
  const blocker = showNeighbors ? game.board.indexOf(ROADBLOCK) : -1;
  const outcomes = new Map();
  if (game?.hall && stage >= 2 && phase === 'game' && selected !== null) {
    const side = hallSide(firstHall, stage, game.priority);
    for (const index of [selected - SIZE, selected + SIZE, selected - 1, selected + 1]) {
      if (!tiles[index] || !adjacent(selected, index)) continue;
      const turn = playMove(game, selected, index);
      if (turn) outcomes.set(index, turn.state.collected === stage ? '整盘' : hallProgress[side] ? '接出' : '点灯');
    }
  }
  const qiRisk = new Set();
  if (game?.qi && phase === 'game' && selected !== null) {
    for (const offset of [-SIZE, -1, 1, SIZE]) {
      const index = selected + offset;
      if (!tiles[index] || !adjacent(selected, index)) continue;
      const turn = playMove(game, selected, index);
      if (turn && turn.state.grain < QI_GRAIN_FLOOR) qiRisk.add(index);
    }
  }
  tiles.forEach((cell, index) => {
    cell.classList.toggle('charge-line', chargePreview.includes(index));
    cell.classList.toggle('near-obstacle', blocker >= 0 && adjacent(index, blocker));
    cell.classList.toggle('selected', selected === index);
    cell.classList.toggle('suggested', suggested.includes(index));
    if (outcomes.has(index)) {
      cell.dataset.hallEffect = outcomes.get(index);
      cell.setAttribute('aria-description', '交换后：' + outcomes.get(index));
    } else if (cell.hasAttribute('data-hall-effect')) {
      delete cell.dataset.hallEffect;
      cell.removeAttribute('aria-description');
    }
    if (qiRisk.has(index)) {
      cell.dataset.qiRisk = 'true';
      cell.setAttribute('aria-description', '这次交换会让市粮低于底线');
    } else if (cell.hasAttribute('data-qi-risk')) {
      delete cell.dataset.qiRisk;
      cell.removeAttribute('aria-description');
    }
    cell.setAttribute('aria-pressed', String(selected === index));
  });
}

function renderPieces(values) {
  const nextBlock = game.trial || game.council ? roadCells(game)[stage + 1] : undefined;
  const finalFile = game.council && stage < 2 ? roadCells(game).at(-1) : undefined;
  const gate = gateHitsRemaining(game) || (game.council && stage === 2 && game.collected < stage ? COUNCIL_REVIEW_HITS : 0);
  const cargoPositions = game.handover ? CARGO.map(piece => values.indexOf(piece)) : [];
  const hallIndex = game.hall && game.collected >= 2 && game.collected < HALL_GOAL ? hallSide(firstHall, game.collected, game.priority) : -1;
  tiles.forEach((cell, index) => {
    const obstacle = values[index] === ROADBLOCK;
    const future = !obstacle && index === nextBlock;
    const cargoIndex = CARGO.indexOf(values[index]);
    const supplyIndex = game.supply ? SUPPLY_PIECES.indexOf(values[index]) : -1;
    const supplyPiece = supplyIndex === 0 || supplyIndex === 1 && game.supply === 'steady' ? supplyPieces[supplyIndex] : null;
    const piece = obstacle ? null : cargoIndex >= 0 ? cargoPieces[cargoIndex] : game.qi ? qiPieces[values[index]]
      : game.flood && values[index] === WATER_PIECE ? waterPiece : supplyPiece ?? (game.petition ? petitionPieces : pieces)[values[index]];
    cell.classList.toggle('cargo-destination', game.handover === true && CARGO_DESTINATIONS.includes(index));
    cell.classList.toggle('cargo-locked', cargoIndex >= 0);
    const relicIndex = game.returned ? RETURN_CELLS.indexOf(index) : -1;
    const relicMarked = relicIndex >= 0 && !found[relicIndex];
    if (relicMarked) cell.dataset.relic = RELIC_MARKS[relicIndex];
    else delete cell.dataset.relic;
    const activeHall = HALL_COLUMNS[hallIndex] === index % SIZE;
    if (activeHall) cell.dataset.hall = HALL_NAMES[hallIndex];
    else delete cell.dataset.hall;
    const lane = cargoPositions.findIndex(position => index > position && index % SIZE === position % SIZE);
    if (lane >= 0) cell.dataset.cargoLane = lane ? 'grain' : 'seal';
    else delete cell.dataset.cargoLane;
    cell.classList.toggle('obstacle', obstacle);
    cell.classList.toggle('future-obstacle', future);
    cell.classList.toggle('review-obstacle', index === finalFile);
    const post = game.crown && obstacle ? CROWN_POSTS.indexOf(index) : -1;
    const remaining = post >= 0 ? CROWN_HITS - crownMarks[post] : gate;
    if (post >= 0) cell.dataset.post = CROWN_NAMES[post].slice(0, 1);
    else delete cell.dataset.post;
    if (obstacle && remaining) cell.dataset.gate = remaining;
    else delete cell.dataset.gate;
    cell.firstElementChild.className = obstacle ? 'chip barricade' : 'chip ' + piece.style;
    const obstacleName = post >= 0 ? CROWN_NAMES[post] + '令印'
      : obstacle ? (game.council ? '案卷，' : '路障，') + level.beats[stage + 1].chip : '';
    cell.setAttribute('aria-label', '第 ' + (Math.floor(index / SIZE) + 1)
      + ' 行，第 ' + (index % SIZE + 1) + ' 列，' + (obstacle ? obstacleName : piece.name)
      + (cargoIndex >= 0 ? '，' + cargoStatus(Math.floor(index / SIZE)) + '，不可直接交换' : '')
      + (relicMarked ? '，清除此格找回' + RELIC_NAMES[relicIndex] : '')
      + (activeHall ? '，当前接引列' : '')
      + (obstacle && remaining ? '，还需' + remaining + '次相邻消除' : '')
      + (index === finalFile ? '，调拨原卷将在这里出现' : future ? '，下一处路障' : ''));
  });
  setHighlights();
}

function suggestedMove() {
  const firstTurn = trialPreview && game.road && game.moves === TRIAL_STEPS;
  const moves = legalMoves(game.board, firstTurn);
  if (firstTurn) {
    const example = moves.find(move => move.charges?.includes('column-3') && move.opens);
    if (example) return example;
  }
  return moves[0];
}

function chargeLabel(charge) {
  return '第 ' + (charge.line + 1) + (charge.axis === 'row' ? ' 行' : ' 列');
}

function highlightCharge(charge) {
  chargePreview = charge ? chargeCells(charge) : [];
  setHighlights();
}

function renderTrial() {
  const trial = (trialPreview && game.road) || game.council || game.crown;
  $('trial-tools').hidden = !trial;
  if (!trial) return;
  const next = roadCells(game)[game.collected + 1];
  const nextLabel = game.collected === 1 ? '重门' : ROAD[game.collected + 2]?.chip;
  const finalFile = roadCells(game).at(-1);
  $('trial-next').textContent = game.crown ? '两处令印 · 同在第 ' + (Math.floor(CROWN_POSTS[0] / SIZE) + 1) + ' 行'
    : game.council
    ? '调拨原卷 · 第 ' + (Math.floor(finalFile / SIZE) + 1) + ' 行第 ' + (finalFile % SIZE + 1) + ' 列'
    : next === undefined ? '最后一段 · 重门' : '下一段 · '
    + nextLabel + ' · ' + (Math.floor(next / SIZE) + 1) + ' 行 ' + (next % SIZE + 1) + ' 列';
  const rack = $('charges');
  rack.hidden = !game.charges;
  if (!game.charges) return;
  const tokens = game.charges;
  const single = tokens.length === 1 ? tokens[0] : null;
  highlightCharge(single);
  const gate = gateHitsRemaining(game);
  const signature = [level.mode, gate, game.marks?.join(','), tokens.map(charge => charge.id).join(',')].join(':');
  if (rack.dataset.state === signature) return;
  rack.dataset.state = signature;
  const focused = rack.contains(document.activeElement);
  const list = tokens.map(charge => {
    const cells = chargeCells(charge);
    const postCount = game.crown ? CROWN_POSTS.filter((position, index) => game.marks[index] < CROWN_HITS && cells.includes(position)).length : 0;
    const coversGate = gate > 1 && cells.includes(roadCells(game)[ROAD_GOAL - 1]);
    const label = chargeLabel(charge) + (postCount === 2 ? ' · 同核两处' : postCount || coversGate ? ' · 直击' : '');
    const use = button(label, 'charge-button', () => activateCharge(charge.id));
    use.classList.toggle('direct-gate', Boolean(postCount) || coversGate);
    use.dataset.charge = charge.id;
    use.type = 'button';
    use.title = '清除' + chargeLabel(charge) + ' · 消耗一步';
    use.setAttribute('aria-label', '发动' + chargeLabel(charge) + '符牌，消耗一步'
      + (postCount ? '，可核清 ' + postCount + ' 处' : coversGate ? game.council ? '，可一次复核原卷' : '，可一次打开重门' : ''));
    use.addEventListener('focus', () => { if (!busy) highlightCharge(charge); });
    use.addEventListener('blur', () => { if (!busy) highlightCharge(single); });
    use.addEventListener('pointerenter', () => { if (!busy) highlightCharge(charge); });
    use.addEventListener('pointerleave', () => {
      if (!busy && document.activeElement !== use) highlightCharge(single);
    });
    return use;
  });
  rack.replaceChildren(tag('span', '', tokens.length ? '发动耗 1 步' : '四连留下符牌'), ...list);
  if (focused) tiles.find(cell => cell.tabIndex === 0).focus({ preventScroll: true });
}

function beginGame(retry = false, kind = 'shelter') {
  level = LEVELS[kind];
  const council = kind === 'council';
  const dual = kind === 'crown';
  const twoFiles = kind === 'petition';
  const delivery = kind === 'handover';
  const search = kind === 'return';
  const rescue = kind === 'friend';
  const flood = kind === 'flood';
  const supply = level.mode === 'chu';
  const register = kind === 'yan';
  const qi = kind === 'qi';
  act = supply ? 'chu' : qi || register || flood || rescue || search || delivery || twoFiles ? kind
    : dual ? 'crown' : council ? 'king' : kind === 'road' ? 'lane' : 'shelter';
  game = rescue ? level.create(firstHall) : delivery ? level.create(firstCargo) : twoFiles ? level.create(firstReview)
    : trialPreview && kind === 'road' ? createTrialGame(tacticsPreview) : level.create();
  stage = 0;
  selected = null;
  busy = false;
  origin = null;
  ignoreClicksUntil = 0;
  trialUses = [];
  chargePreview = [];
  if (dual) crownMarks = game.marks.slice();
  if (twoFiles) { evidence = game.evidence.slice(); clerkOpenedName = false; }
  if (delivery) cargo = cargoRows(game.board);
  if (search) found = game.found;
  if (rescue) hallProgress = [0, 0];
  $('hall-order').hidden = true;
  board.inert = false;
  if (flood) {
    waterLevel = game.water;
    floodWitness = 'unknown';
    floodHandsUp = false;
    if (retry) logs.length = floodLogStart;
    floodLogStart = logs.length;
  }
  if (supply) {
    supplyMode = game.supply;
    supplyStock = game.stock;
  }
  if (register) registerBound = game.bound;
  if (qi) {
    qiEntries = game.collected;
    qiGrain = game.grain;
  }
  hallHintState = null;
  const opening = council || dual || twoFiles || delivery || search || rescue || flood || supply || register || qi ? null : suggestedMove();
  suggested = opening ? [opening.a, opening.b] : [];
  setPhase('game', trialPreview ? tacticsPreview ? '符牌试验' : '普通对照' : '三消', level.title);
  $('target-name').textContent = level.stat;
  $('target-name').previousElementSibling.className = 'chip ' + (qi ? 'qi-register' : register ? 'register-chip' : supply ? 'supply-grain' : flood ? 'water-chip'
    : rescue ? 'hall-chip' : search ? 'relic-chip' : delivery ? 'seal-cargo'
    : twoFiles ? 'precedent' : game.road ? 'barricade' : 'shade');
  stageDisplay.setAttribute('aria-label', qi ? '民籍和留粮进度' : register ? '拼简进度' : supply ? '装车进度' : flood ? '石阶露出情况' : rescue ? '两廊进度'
    : search ? '旧物搜寻进度' : delivery ? '物资运送进度' : twoFiles ? '证据进度' : dual ? '回令进度'
    : council ? '核册进度' : kind === 'road' ? '道路进度' : '藏身准备');
  stageDisplay.replaceChildren(...level.milestones.map((count, index) => {
    const item = tag('li');
    item.dataset.count = count;
    item.append(tag('b', '', String(count)), document.createTextNode(' ' + level.labels[index]));
    return item;
  }));
  const sceneText = qi ? '右案核民籍，左边留市粮。金色粮袋消得越多，旁车带走的粮越多。'
    : register ? '两组散简在案上。左边拼姓名，右边拼来处。'
    : supply ? kind === 'swift' ? '这辆车等着装粮。每消掉一枚粮袋，就装上一份。' : '先配齐第一车。多出的粮布先放到架上，封好第一车再装第二车。'
    : flood ? '石阶还在水下。把水位压到 ' + FLOOD_THRESHOLDS.at(-1) + ' 格，木排就能靠近。'
    : rescue ? '先给' + HALL_NAMES[firstHall] + '点灯。随意连成三枚，再决定把灯用在哪里。'
    : search ? '残瓦下有旧灯、门闩和户简。棋盘上有三个对应的标记。'
    : delivery ? HANDOVER_ROUTES[firstCargo].note : twoFiles ? PETITION_READINGS[firstReview].note
    : dual ? '左边的侍从等着交班，右边的宫人还抱着外衣。'
    : council ? '三卷已经上案。在案卷上下左右形成消除，依次核册。'
    : kind === 'road' ? PATHS[journey.c3].arrival : '箱子挡着门，窗边还亮着。';
  updateScene(level.mode, levelPlace(), sceneText);
  setStats(game.moves, 0);
  showObjective(0);
  renderPieces(game.board);
  renderTrial();
  message(qi ? qiRules
    : register ? '四枚及以上同类棋子连成一线才能拼简。可先用三连整盘，连消形成的四连也算。'
    : supply ? kind === 'swift' ? '三步内消掉 8 枚粮袋。连消也计入。' : '每批需要粮和布各 4 份。超出当前一批的物资计入下一批。'
    : flood ? '每次有效交换涌入 ' + FLOOD_RISE + ' 格水，每消掉一枚水波抵消 1 格。连消也计入。'
    : rescue ? '先走你看中的一手，灯就会亮。'
    : search ? '标记格的棋子可以交换。匹配或连消清掉标记格，就能找到旧物。'
    : delivery ? '封签和粮筹不能交换。清掉它们下方的棋子，两件物资就会往底行落。'
    : twoFiles ? '每步每种简最多记一条。若同一步消除两种简，两卷各记一条。'
    : dual ? '在令印相邻格消除可验印。四连留符，覆盖两处可同时核清。'
    : council ? '四连留符，发动耗一步。让符牌的行或列覆盖调拨原卷，可一次复核。'
    : trialPreview && tacticsPreview ? '交换亮框里的棋子，可以开路并留下列符。看看它能否留到重门。'
    : kind === 'road'
    ? '交换亮框棋子。在路障上下左右形成三连，就能开路。'
    : retry ? '回到同一盘。试试交换亮框里的两枚棋子。' : '交换亮框里的棋子，消掉带灯罩的青色棋子。');
  const focus = tiles[opening?.a ?? 0];
  setTabStop(focus);
  focus.focus({ preventScroll: true });
}

function finishGame(assisted) {
  if (level === LEVELS.qi) {
    finishQi(assisted);
    return;
  }
  if (level === LEVELS.yan) {
    finishYan(assisted);
    return;
  }
  if (level.mode === 'chu') {
    if (level === LEVELS.swift) finishSwift(assisted);
    else finishSteady(assisted);
    return;
  }
  if (level === LEVELS.flood) {
    finishFlood(assisted);
    return;
  }
  if (level === LEVELS.friend) {
    finishFriend(assisted);
    return;
  }
  if (level === LEVELS.return) {
    finishReturn(assisted);
    return;
  }
  if (level === LEVELS.handover) {
    finishHandover(assisted);
    return;
  }
  if (level === LEVELS.petition) {
    finishPetition(assisted);
    return;
  }
  if (level === LEVELS.crown) {
    finishCrown(assisted);
    return;
  }
  if (level === LEVELS.council) {
    finishCouncil(assisted);
    return;
  }
  if (level === LEVELS.road) {
    finishRoad(assisted);
    return;
  }
  journey.g1 = assisted ? 'assisted' : 'clear';
  stage = TARGET;
  setPhase('ending', '剧情', '天亮再点');
  let patrol = assisted ? '' : 'approach';
  updateScene('game', '旧院 · 东厢', assisted ? '田伯收拾妥当，把门闩扣上。' : STAGES[8].result, { patrol });
  function leave() {
    if (patrol !== 'approach') return;
    patrol = 'leave';
    updateScene('game', '旧院 · 东厢', '门没开。巡吏提灯离开了。', { patrol });
    playFootsteps([0.062, 0.048, 0.029, 0.012]);
  }
  sequence(ending(route, assisted), () => {
    leave();
    if (compare) compare.visit('emperor');
    else pottery();
  }, compare ? '试玩终章' : '数年后', index => {
    if (index === 1) leave();
  });
  content.querySelector('button').focus({ preventScroll: true });
}

function playChapter(key, onEnd, lastLabel, onShow) {
  const lines = chapterLines(key, journey);
  sequence(lines, onEnd, lastLabel, index => onShow?.(lines[index]));
  content.querySelector('button').focus({ preventScroll: true });
}

function pottery() {
  act = 'friends';
  stage = 0;
  $('chapter-date').textContent = '数年后';
  setPhase('chapter', '剧情', CHAPTER.s03.title);
  updateScene('pottery', '邯郸 · 陶坊', '冉伯在门前晒陶坯。一个少年站在门口。');
  playChapter('s03', () => chooseChapter('c2', stone), '回答丹');
}

function chooseChapter(flag, after) {
  const data = CHOICES[flag];
  setPhase('choice', '剧情选择', data.title);
  const options = tag('div', 'choices');
  for (const option of data.options) {
    const pick = button('', 'choice', () => {
      journey[flag] = option.value;
      after();
    });
    pick.append(tag('strong', '', option.text), tag('small', '', option.sub));
    options.append(pick);
  }
  content.replaceChildren(tag('p', 'body-text', data.prompt), options);
  options.firstElementChild.focus({ preventScroll: true });
}

function useStoneShot(mode, place, entry) {
  const shot = STONE_SHOTS[entry.shot];
  if (!shot) return;
  const outside = shot.beat === 'departure';
  updateScene(mode, outside ? '邯郸 · 城外' : place, shot.note, { storyBeat: shot.beat });
}

function stone() {
  setPhase('chapter', '剧情', CHAPTER.stone.title);
  const place = '邯郸 · 陶坊门槛';
  updateScene('pottery', place, '丹和政在陶坊门前说起了路。');
  if (friendSample) {
    playChapter('stone', () => {
      sequence([{ speaker: '叙事', line: '多年以后，政已是秦王。赵国覆亡，秦军到了燕国近旁。' }], oldFriend, '去燕国驿舍');
    }, '多年以后', entry => useStoneShot('pottery', place, entry));
    return;
  }
  playChapter('stone', stonePreview ? west : lane, stonePreview ? '去城门' : '去巷口',
    entry => useStoneShot('pottery', place, entry));
}

function lane() {
  act = 'lane';
  setPhase('chapter', '剧情', CHAPTER.s04.title);
  updateScene('lane', '邯郸 · 街口', '市快散了，岔路口仍挤着人。');
  playChapter('s04', () => chooseChapter('c3', routeToLane), '选择路线');
}

function routeToLane() {
  const path = PATHS[journey.c3];
  const rear = journey.c3 === 'trust_ran';
  setPhase('travel', '转移', path.place);
  updateScene('lane', path.place, rear ? '冉伯把手搭在陶坊后门上。' : path.arrival);
  playChapter('route3', () => beginGame(false, 'road'), '开始清障', entry => {
    if (entry.shot === 'S04-A02') {
      updateScene('lane', path.place, '冉伯推开后门，让政和母亲先走。', { rearDoor: 'opening' });
      soundRoad(3);
    } else if (entry.shot === 'S04-B01') {
      updateScene('lane', path.place, '政指向石阶后面。他记得那条路。', { storyBeat: 'recognize' });
    }
  });
}

function finishRoad(assisted) {
  journey.g2 = assisted ? 'assisted' : 'clear';
  stage = ROAD_GOAL;
  setPhase('ending', '剧情', CHAPTER.post2.title);
  updateScene('lane', levelPlace(), assisted ? '人群散开，赵氏领着政走出巷口。' : ROAD[3].result, { assisted });
  playFootsteps([0.040, 0.029, 0.018]);
  if (roadPreview) {
    playChapter('post2', completeRoadPreview, '结束试玩');
  } else {
    playChapter('post2', west, '往西去');
  }
}

function completeRoadPreview() {
  setPhase('complete', '场景试玩', '走出巷口');
  const outcome = tag('p', 'body-text', journey.g2 === 'assisted'
    ? '人群散开，母子走出了巷口。' : ROAD[3].result);
  const controls = actions(button('重玩本段', 'action-button primary', start), fullStoryLink());
  content.replaceChildren(outcome, controls);
  if (trialPreview) {
    const summary = tag('p', 'trial-explanation', '用了 ' + (TRIAL_STEPS - game.moves) + ' 步。');
    if (tacticsPreview) summary.append(document.createTextNode(trialUses.length
      ? '符牌用在' + trialUses.join('、') + '。' : '本次保留或未获得符牌。'));
    content.insertBefore(summary, controls);
    controls.append(comparisonLink());
  }
  content.querySelector('button').focus({ preventScroll: true });
}

function west() {
  act = 'west';
  $('chapter-date').textContent = '约公元前 251—250 年';
  setPhase('chapter', '剧情', CHAPTER.s05.title);
  const place = '邯郸 · 城门';
  updateScene('west', place, '赵国同意送母子归秦。');
  playChapter('s05', () => {
    rememberChapter(1);
    complete();
  }, stonePreview ? '结束试玩' : '回顾这一章', entry => {
    if (entry.shot === 'S05-R01' || entry.shot === 'S05-O01') {
      const sceneNote = journey.c3 === 'trust_ran' ? '走到陶坊外，母子向冉伯告别。' : '政回头认出了那条侧巷。';
      updateScene('lane', PATHS[journey.c3].place, sceneNote, { assisted: journey.g2 === 'assisted' });
    } else {
      useStoneShot('west', place, entry);
    }
  });
}

function complete() {
  act = 'west';
  $('chapter-date').textContent = '约公元前 251—250 年';
  setPhase('complete', stonePreview ? '场景试玩' : '第一章完', '先往前走');
  if (scene.dataset.storyBeat !== 'departure') {
    updateScene('west', '邯郸 · 城外', '政收好了那颗石子。母子踏上归秦的路。', { storyBeat: 'departure' });
  }
  if (stonePreview) {
    content.replaceChildren(tag('p', 'body-text', '政把圆石子收回袖袋，和母亲坐上了西行的车。'),
      actions(button('重玩三颗石子', 'action-button primary', start), fullStoryLink()));
    content.querySelector('button').focus({ preventScroll: true });
    return;
  }
  const memories = tag('ul', 'memories');
  const rows = [
    ['藏身', (route === 'wait' ? '等脚步过去才动身' : '沿侧巷赶到旧院') + (journey.g1 === 'assisted' ? '，田伯帮忙收拾。' : '，亲手完成藏身准备。')],
    ['陶坊', journey.c2 === 'father_qin' ? '政告诉丹，父亲是秦人。' : '政告诉丹，自己生在邯郸。'],
    ['巷口', (journey.c3 === 'trust_ran' ? '记住冉伯指的路' : '走自己认出的侧巷') + (journey.g2 === 'assisted' ? '，等人群散开才走通。' : '，带母亲走过三段路。')],
  ];
  for (const [label, text] of rows) {
    const item = tag('li');
    item.append(tag('strong', '', label), tag('span', '', text));
    memories.append(item);
  }
  const review = tag('section', 'chapter-review');
  review.append(tag('h3', '', '章末回顾'));
  for (const card of Object.values(CHAPTER_REVIEW)) {
    const open = button('', 'review-card', () => showNotes(card.title, reviewEntries(card)));
    open.append(tag('span', '', card.kind), tag('strong', '', card.title));
    review.append(open);
  }
  content.replaceChildren(memories, review,
    actions(chapterAction('继续第二章', 'action-button primary', 2, qin)));
  content.querySelector('.actions .primary').focus({ preventScroll: true });
}

function qin() {
  if (act !== 'qin') chapterOneLogs = logs;
  logs = [];
  act = 'qin';
  journey.q1 = null;
  journey.q2 = null;
  journey.q3 = null;
  $('chapter-date').textContent = '母子归秦后';
  setPhase('chapter', '第一幕', '门内的人');
  playQinLines(qinGreeting(journey.c2), chooseQinReply, '作出回应');
}

function playQinLines(lines, after, finalButton) {
  sequence(lines, after, finalButton, index => {
    const entry = lines[index];
    if (entry.beat) updateScene('qin', QIN_PLACE, entry.note, { storyBeat: entry.beat });
  });
  content.querySelector('button').focus({ preventScroll: true });
}

function chooseQinReply() {
  setPhase('choice', '剧情选择', '政先说什么？');
  const options = Object.entries(QIN_RESPONSES).map(([choice, reply]) =>
    button(reply.title, 'choice', () => {
      journey.q1 = choice;
      setPhase('chapter', '第一幕', '门内的人');
      playQinLines(reply.lines, () => qinSeat(reply.table), '坐下来');
    }));
  const list = tag('div', 'choices');
  list.append(...options);
  content.replaceChildren(list);
  options[0].focus({ preventScroll: true });
}

async function qinSeat(lines) {
  const advance = content.querySelector('.action-button.primary');
  advance.disabled = true;
  advance.textContent = '落座中…';
  updateScene('qin', QIN_PLACE, '三人走到席边，依次落座。', { storyBeat: 'seated' });
  if (!scene.hasAttribute('data-fallback') && !document.hidden) await pause(QIN_SEATING_DURATION, 0);
  playQinLines(lines, completeQin, '结束首幕');
}

function completeQin() {
  setPhase('complete', '第一幕完', '一张席');
  updateScene('qin', QIN_PLACE, '三个人在同一张席上坐下来。', { storyBeat: 'seated' });
  content.replaceChildren(tag('p', 'body-text', journey.q1 === 'father'
    ? '政先叫了父亲。坐定后，他问起父亲在邯郸住过的院子。'
    : '政先问母亲坐在哪里。子楚给她留了座，赵氏先提起邯郸的旧院。'),
  actions(button('继续第二幕', 'action-button primary', beginQinRegister),
    button('重玩首幕', 'action-button', qin), qinReturnLink()));
  content.querySelector('button').focus({ preventScroll: true });
}

function qinReturnLink() {
  return qinPreview ? fullStoryLink() : button('回看第一章', 'action-button', () => {
    act = 'west';
    logs = chapterOneLogs;
    $('chapter-date').textContent = '约公元前 251—250 年';
    complete();
  });
}

function beginQinRegister() {
  qinRegisterLogStart = logs.length;
  qinRegister();
}

function qinRegister() {
  act = 'qin';
  logs.length = qinRegisterLogStart;
  journey.q2 = null;
  $('chapter-date').textContent = '母子归秦后';
  setPhase('chapter', '第二幕', '来处');
  playQinLines(qinRegisterOpening(journey.q1), chooseQinRegisterReply, '作出回应');
}

function chooseQinRegisterReply() {
  setPhase('choice', '剧情选择', '谁来答？');
  const choices = tag('div', 'choices');
  for (const [choice, reply] of Object.entries(QIN_REGISTER_RESPONSES)) {
    choices.append(button(reply.title, 'choice', () => {
      journey.q2 = choice;
      setPhase('chapter', '第二幕', '来处');
      playQinLines(reply.lines, () => completeQinRegister(reply), '结束第二幕');
    }));
  }
  content.replaceChildren(choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function completeQinRegister(reply) {
  setPhase('complete', '第二幕完', '木牍上的来处');
  content.replaceChildren(tag('p', 'body-text', reply.ending),
    actions(button('继续第三幕', 'action-button primary', beginQinClosing), button('重玩第二幕', 'action-button', qinRegister),
      button('重玩首幕', 'action-button', qin), qinReturnLink()));
  content.querySelector('button').focus({ preventScroll: true });
}

function beginQinClosing() {
  qinClosingLogStart = logs.length;
  qinClosing();
}

function qinClosing() {
  act = 'qin';
  logs.length = qinClosingLogStart;
  journey.q3 = null;
  $('chapter-date').textContent = QIN_CLOSING_DATE;
  setPhase('chapter', '第三幕', '空席');
  playQinLines(qinClosingOpening(journey.q2), chooseQinClosingReply, '决定木牍去留');
}

function chooseQinClosingReply() {
  setPhase('choice', '剧情选择', '这块木牍怎么安放？');
  const choices = tag('div', 'choices');
  for (const [choice, reply] of Object.entries(QIN_CLOSING_REPLIES)) {
    choices.append(button(reply.title, 'choice', () => {
      journey.q3 = choice;
      setPhase('chapter', '第三幕', '空席');
      playQinLines(reply.lines, () => completeQinClosing(), '走出门槛');
    }));
  }
  content.replaceChildren(choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function completeQinClosing() {
  rememberChapter(2);
  showQinClosingResult();
}

function showQinClosingResult() {
  const reply = QIN_CLOSING_REPLIES[journey.q3];
  act = 'qin';
  $('chapter-date').textContent = QIN_CLOSING_DATE;
  setPhase('complete', '第二章完', '少年秦王');
  updateScene('qin', QIN_PLACE, reply.ending, { storyBeat: reply.exit });
  const memories = tag('ul', 'memories');
  const rows = [
    ['门内的人', QIN_RESPONSES[journey.q1]?.title],
    ['来处', QIN_REGISTER_RESPONSES[journey.q2]?.title],
    ['空席', reply.title],
  ];
  for (const [label, choice] of rows) {
    if (!choice) continue;
    const item = tag('li');
    item.append(tag('strong', '', label), tag('span', '', choice));
    memories.append(item);
  }
  content.replaceChildren(tag('p', 'body-text', QIN_SUCCESSION), memories,
    actions(chapterAction('继续第三章', 'action-button primary', 3, king), chapterAction('重玩第三幕', 'action-button', 2, qinClosing),
      chapterAction('重玩第二章', 'action-button', 2, qin), qinReturnLink()));
  content.querySelector('button').focus({ preventScroll: true });
}

function king() {
  if (act === 'qin') chapterTwoLogs = logs;
  logs = [];
  kingResult = null;
  stage = 0;
  act = 'king';
  $('chapter-date').textContent = KING_DATE;
  setPhase('chapter', '朝议', '门外等令的人');
  playKingLines(kingOpening(journey.q3), () => beginGame(false, 'council'), '开始核册');
}

function playKingLines(lines, after, finalButton) {
  sequence(lines, after, finalButton, index => {
    const entry = lines[index];
    if (entry.beat) updateScene('court', KING_PLACE, entry.note, { storyBeat: entry.beat });
  });
  content.querySelector('button').focus({ preventScroll: true });
}

function finishCouncil(deferred) {
  setPhase('ending', '朝议', deferred ? '留案待核' : '三卷核清');
  if (deferred) {
    answerDriver('defer');
    return;
  }
  updateScene('court', KING_PLACE, COUNCIL_FILES[2].result, { storyBeat: 'verified' });
  playKingLines(KING_VERIFIED, chooseKingOrder, '决定如何发粮');
}

function chooseKingOrder() {
  setPhase('choice', '政务选择', '这一批粮何时发？');
  const choices = tag('div', 'choices');
  for (const [key, order] of Object.entries(KING_ORDERS)) {
    choices.append(button(order.title, 'choice', () => answerDriver(key)));
  }
  content.replaceChildren(choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function answerDriver(key) {
  setPhase('chapter', '门口', '车夫等着回话');
  playKingLines(driverReply(key, game.collected), () => completeKing(key), '结束本章');
}

function completeKing(key) {
  kingResult = { key, sawDriver: true, collected: game.collected, moves: game.moves, gateHits: game.gateHits, charges: trialUses.slice() };
  rememberChapter(3);
  showKingResult();
}

function showKingResult() {
  act = 'king';
  stage = kingResult.collected;
  const order = KING_ORDERS[kingResult.key];
  const note = kingResult.sawDriver ? DRIVER_MEMORY[kingResult.key] : order?.note ?? '未核完的案卷留在案上。吕不韦等文书再报，发粮暂缓。';
  $('chapter-date').textContent = KING_DATE;
  setPhase('complete', '第三章完', order ? order.title : '留案待核');
  updateScene('court', KING_PLACE, note, { storyBeat: kingResult.sawDriver ? 'door-end-' + kingResult.key : kingResult.key });
  const memories = tag('ul', 'memories');
  for (const [label, value] of [
    ['案卷', `已核 ${kingResult.collected} / ${ROAD_GOAL} 卷`],
    ...(kingResult.sawDriver && stage === 2 ? [['原卷', '已复核 ' + kingResult.gateHits + ' / 3 处']] : []),
    ['步数', `已用 ${COUNCIL_STEPS - kingResult.moves} 步`],
    ['符牌', kingResult.charges.join('、') || '未发动'],
  ]) {
    const item = tag('li');
    item.append(tag('strong', '', label), tag('span', '', value));
    memories.append(item);
  }
  const previous = chapterTwoLogs ? button('回看第二章', 'action-button', () => {
    act = 'qin';
    logs = chapterTwoLogs;
    $('chapter-date').textContent = QIN_CLOSING_DATE;
    showQinClosingResult();
  }) : fullStoryLink();
  content.replaceChildren(tag('p', 'body-text', note), memories,
    actions(chapterAction('继续第四章', 'action-button primary', 4, crown),
      chapterAction('随小吏值一夜', 'action-button', 3, () => {
        chapterThreeLogs = logs;
        openDesk('watch');
      }), chapterAction('重玩第三章', 'action-button', 3, king), previous));
  content.querySelector('button').focus({ preventScroll: true });
}

function crown() {
  if (act === 'king') chapterThreeLogs = logs;
  logs = [];
  crownResult = null;
  stage = 0;
  crownMarks = CROWN_POSTS.map(() => 0);
  act = 'crown';
  $('chapter-date').textContent = CROWN_DATE;
  setPhase('chapter', '雍城', '冠礼之后');
  hearing = null;
  const [rite,...after] = crownOpening(kingResult?.key);
  playCrownLines([rite], () => playCrownLines(after, () => beginGame(false,'crown'), '核验两处令印'), '下阶');
}

function playCrownLines(lines, after, finalButton) {
  sequence(lines, after, finalButton, index => {
    const entry = lines[index];
    if (entry.beat) updateScene('crown', CROWN_PLACE, entry.note, { storyBeat: entry.beat });
  });
  content.querySelector('button').focus({ preventScroll: true });
}

function storeCrownSample(record) {
  const result = crownStore.save(record);
  if (result === 'saved') checkpointStatus('冠礼之后 · 独立试玩进度已保存');
  else reportSaveFailure(result);
}

function markHearing(at) {
  hearing = {...hearing, at, logs:logs.slice()};
  if (crownStore) storeCrownSample({hearing});
  else if (checkpointStore && campaignSnapshot) {
    const result = checkpointStore.save({journey:campaignSnapshot.journey, chapters:campaignSnapshot.chapters, hearing});
    if (result === 'saved') checkpointStatus('第四章问询已保存 · 可关页续玩');
    else reportSaveFailure(result);
  }
}

function finishCrown(delayed) {
  hearing = {marks:crownMarks.slice(), moves:game.moves, charges:trialUses.slice()};
  markHearing(delayed ? 'delayed' : 'verified');
  resumeHearing(hearing);
}

function resumeHearing(fold) {
  hearing = fold;
  logs = fold.logs.slice();
  act = 'crown';
  crownMarks = fold.marks.slice();
  stage = crownMarks.filter(n=>n===CROWN_HITS).length;
  $('chapter-date').textContent = CROWN_DATE;
  if (fold.at === 'choice') { chooseCrownResponse(); return; }
  if (fold.at === 'delayed') {
    setPhase('ending','回令','迟复记案');
    playCrownLines(delayedHearing(crownMarks), () => completeCrown('delayed'), '收起此卷');
    return;
  }
  if (fold.at === 'verified') {
    setPhase('ending','事定后 · 雍','两处都已回令');
    playCrownLines(CROWN_VERIFIED, () => {
      markHearing('choice');
      chooseCrownResponse();
    }, '决定先问谁');
    return;
  }
  const response = CROWN_HEARINGS[fold.at];
  setPhase('chapter','事后问询',response.title);
  playCrownLines(response.lines, () => completeCrown(fold.at), '收起此卷');
}

function chooseCrownResponse() {
  setPhase('choice','事定后 · 雍','门槛前，先问谁？');
  updateScene('crown',CROWN_PLACE,'宫人想听一遍证言，太后也给政留了席。',{storyBeat:'threshold'});
  const choices = tag('div','choices');
  for (const [key,response] of Object.entries(CROWN_HEARINGS)) {
    choices.append(button(response.title,'choice',()=>{
      markHearing(key);
      resumeHearing(hearing);
    }));
  }
  content.replaceChildren(choices);
  choices.firstElementChild.focus({preventScroll:true});
}

function completeCrown(key) {
  crownResult = {key, hearing:1, marks:hearing.marks, moves:hearing.moves, charges:hearing.charges};
  if (crownStore) storeCrownSample({fourth:{result:crownResult,logs}});
  rememberChapter(4);
  showCrownResult();
}

function showCrownResult() {
  act = 'crown';
  crownMarks = crownResult.marks;
  stage = crownMarks.filter(mark => mark === CROWN_HITS).length;
  const response = crownResponse(crownResult);
  $('chapter-date').textContent = CROWN_DATE;
  setPhase('complete', '第四章完', response ? '灯下问询' : '迟复记案');
  const ended = response?.ending ?? '未回令处转为当面复核，迟复的缘由记入案中。';
  const closingBeat = {mother:'waited',clerk:'tea',delayed:'lateBoth'};
  updateScene('crown', CROWN_PLACE, ended, {storyBeat:crownResult.hearing ? closingBeat[crownResult.key] : 'old-'+crownResult.key});
  const previous = chapterThreeLogs ? button('回看第三章', 'action-button', () => {
    logs = chapterThreeLogs;
    showKingResult();
  }) : fullStoryLink();
  const memories = tag('ul', 'memories');
  const rows = CROWN_NAMES.map((name, index) => [name,
    crownMarks[index] === CROWN_HITS ? '已回令' : `核验 ${crownMarks[index]} / ${CROWN_HITS}，转为当面复核`]);
  rows.push(['步数', `已用 ${CROWN_STEPS - crownResult.moves} 步`], ['符牌', crownResult.charges.join('、') || '未发动']);
  for (const [label, value] of rows) {
    const item = tag('li');
    item.append(tag('strong', '', label), tag('span', '', value));
    memories.append(item);
  }
  content.replaceChildren(tag('p', 'body-text', ended),
    ...(crownResult.hearing ? [tag('p','body-text year-slip','前237年 · ' + NEXT_YEAR)] : []), memories, actions(chapterAction('继续第五章', 'action-button primary', 5, petition), chapterAction('重玩第四章', 'action-button', 4, crownStore ? restartCrownSample : crown), previous));
  content.querySelector('button').focus({ preventScroll: true });
}

function restartCrownSample() {
  const result=crownStore.clear();
  if (result !== 'saved') { reportSaveFailure(result); return; }
  checkpointStatus('冠礼之后 · 第四章至第五章独立试玩');
  crown();
}

function resumeCrownSample(sample) {
  if (sample.hearing) { resumeHearing(sample.hearing); return; }
  crownResult=sample.fourth.result;
  chapterFourLogs=sample.fourth.logs;
  logs=chapterFourLogs;
  if (sample.canalAt) { petition(sample.canalAt); return; }
  if (sample.fifth) {
    petitionResult=sample.fifth.result;
    logs=sample.fifth.logs;
    showPetitionResult();
  } else showCrownResult();
}

function petition(resumeAt) {
  if (act === 'crown') chapterFourLogs = logs;
  logs = [];
  stage = 0;
  evidence = [0, 0];
  firstReview = 0;
  petitionResult = null;
  jadeMoved = false;
  clerkOpenedName = false;
  act = 'petition';
  $('chapter-date').textContent = PETITION_DATE;
  sawField = resumeAt === 'planted';
  if (resumeAt === 'planted') {
    logs.push(...fieldApproach);
    showWetField();
    return;
  }
  if (resumeAt === 'court' || preview === 'petition') { openCourt(); return; }
  if (!resumeAt) saveCanalStage('entry');
  setPhase('choice', '泾水边', '水到哪一畦');
  $('chapter-region').textContent = '关中 · 泾水边';
  $('chapter-date').textContent = '逐客议起前后';
  updateScene('canal', '关中 · 泾水边', '远处传来水声。田尾还有人在等。', {storyBeat:'upstream'});
  content.replaceChildren(tag('p','body-text','入咸阳之前，田边还有一段路可以走。'),
    actions(button('去渠边看看','choice', approachField), button('直接入咸阳','choice', () => {
      saveCanalStage('court');
      openCourt();
    })));
  content.querySelector('button').focus({preventScroll:true});
}

function saveCanalStage(canalAt) {
  let result;
  if (crownStore) {
    storeCrownSample({fourth:{result:crownResult,logs:chapterFourLogs},canalAt});
    return;
  }
  if (canalStore) result = canalStore.save({canalAt});
  else if (checkpointStore && campaignSnapshot?.chapters.length >= 4) {
    result = checkpointStore.save({journey:campaignSnapshot.journey, chapters:campaignSnapshot.chapters, canalAt});
  }
  if (result === 'saved') checkpointStatus(canalAt === 'planted' ? '已记下渠边亲见 · 可从农妇验土续玩' : '已保存第五章入口 · 可关页续玩');
  else if (result) reportSaveFailure(result);
}

function canalLines(lines, after, last) {
  $('chapter-region').textContent = '关中 · 泾水边';
  $('chapter-date').textContent = lines[0] === fieldLater ? '后来，渠上' : '逐客议起前后';
  sequence(lines, after, last, index => {
    const e = lines[index];
    updateScene('canal', '关中 · 泾水边', e.note, {storyBeat:e.beat});
  });
  content.querySelector('button').focus({preventScroll:true});
}

function approachField() {
  setPhase('chapter', '泾水边', '水到哪一畦');
  playRill();
  canalLines(fieldApproach, () => {
    sawField = true;
    saveCanalStage('planted');
    playRill();
    if (motion.matches) { showWetField(); return; }
    updateScene('canal','关中 · 泾水边','水顺着浅沟往田尾走。', {storyBeat:'watering'});
    const finish = () => { clearTimeout(timer); showWetField(); };
    const timer = setTimeout(finish, 1150);
    const skip = button('看水到畦口', 'action-button primary', finish);
    content.replaceChildren(tag('p','body-text','木牌立稳了。农妇低下头，等着看水。'),actions(skip));
    skip.focus({preventScroll:true});
  }, '把田牌立在畦口');
}

function showWetField() {
  setPhase('chapter', '泾水边', '田尾的水印');
  canalLines(fieldAfterPlanting, openCourt, '入咸阳');
}

$('jade-target').addEventListener('click', () => {
  if (scene.dataset.storyBeat === 'jade') content.querySelector('.primary')?.click();
});

function openCourt() {
  $('chapter-date').textContent = PETITION_DATE;
  setPhase('chapter', '秦廷', '一封上书');
  const lines = petitionOpening(crownResult?.key);
  if (sawField) lines.splice(1, 0, canalInquiry);
  playPetitionLines(lines, () => {
    jadeMoved = true;
    choosePetitionReading();
  }, '移开压简的青玉');
}

function saveCanalSampleResult(sixth) {
  if (!canalStore) return;
  const fifth = {logs: sixth ? chapterFiveLogs : logs, result:petitionResult};
  const result = canalStore.save(sixth ? {fifth, sixth:{logs, result:handoverResult}} : {fifth});
  if (result === 'saved') checkpointStatus(sixth ? '韩国水工线已完 · 可重看或重玩' : '独立试玩已保存 · 可从第五章结算续玩');
  else reportSaveFailure(result);
}

function resumeCanalSample(sample) {
  if (sample.canalAt) { petition(sample.canalAt); return; }
  petitionResult = sample.fifth.result;
  chapterFiveLogs = sample.fifth.logs;
  sawField = Boolean(petitionResult.sawField);
  if (sample.sixth) {
    handoverResult = sample.sixth.result;
    logs = sample.sixth.logs;
    showHandoverResult();
  } else {
    logs = chapterFiveLogs;
    showPetitionResult();
  }
}

function playPetitionLines(lines, after, finalButton) {
  sequence(lines, after, finalButton, index => {
    const entry = lines[index];
    if (entry.beat) updateScene('petition', entry.beat.startsWith('gate-') ? '秦国 · 关口' : PETITION_PLACE, entry.note, { storyBeat: entry.beat });
  });
  content.querySelector('button').focus({ preventScroll: true });
}

function choosePetitionReading() {
  stage = 0;
  evidence = [0,0];
  clerkOpenedName = false;
  setPhase('choice', '查证', '从哪卷读起？');
  updateScene('petition', PETITION_PLACE, '玉移到案角，文书摊平简尾。', { storyBeat:'signature' });
  const choices = tag('div', 'choices');
  for (const [index, reading] of PETITION_READINGS.entries()) {
    choices.append(button(reading.title, 'choice', () => {
      firstReview = index;
      if (sawField) {
        setPhase('chapter', '秦廷 · 书室', PETITION_NAMES[index]);
        playPetitionLines([{speaker:'文书', line:readingEcho[index], beat:'canal-brief', note:'事由简仍搁在两卷旁。'}],
          () => beginGame(false, 'petition'), '开始核卷');
      } else beginGame(false, 'petition');
    }));
  }
  content.replaceChildren(tag('p', 'body-text', '先读的那卷会先核过一条。接下来把两卷的证据都补齐。'), choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function finishPetition(assisted) {
  setPhase('ending', '书室', '案上的简');
  clerkOpenedName = assisted && !rosterVisible(evidence[1]);
  const note = clerkOpenedName ? '文书把名籍摊到这一行。余下的条目仍要续核。'
    : assisted ? '文书留下摊开的名籍，把尚待核阅的卷放在手边。' : '文书搁下简绳。两件简文并排留在案上。';
  updateScene('petition', PETITION_PLACE, note, {storyBeat:'spread'});
  const lookUp = button('抬头', 'action-button primary', () => {
    setPhase('chapter', '书室', '秦王抬头');
    playPetitionLines(PETITION_DECISION, () => choosePetitionOrder(assisted), '议定停令');
  });
  lookUp.setAttribute('aria-describedby', 'desk-slips');
  content.replaceChildren(actions(lookUp));
  lookUp.focus({preventScroll:true});
}

function choosePetitionOrder(assisted) {
  setPhase('choice', '停令', '先办哪一件事？');
  const choices = tag('div', 'choices');
  for (const [key, order] of Object.entries(NAME_ORDERS)) {
    choices.append(button(order.title, 'choice', () => {
      setPhase('chapter', '停令', order.title);
      if (compare?.sample === 'orders') {
        playPetitionLines(order.lines, () => {
          setPhase('complete', '第五章 · 停令', order.title);
          content.replaceChildren(tag('p', 'body-text', order.ending),
            actions(button('再试另一种处置', 'action-button primary', () => compare.visit('orders')),
              button('去终章', 'action-button', () => compare.visit('emperor'))));
        }, '看处置结果');
        return;
      }
      if (sawField) playPetitionLines(order.lines, () => {
        setPhase('chapter', '后来，渠上', '水工的下文');
        canalLines([fieldLater], () => completePetition(key, assisted), '结束本章');
      }, '再看渠上');
      else playPetitionLines(order.lines, () => completePetition(key, assisted), '结束本章');
    }));
  }
  content.replaceChildren(choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function completePetition(key, assisted) {
  petitionResult = { key, assisted, nameScene:1, ...(sawField ? {sawField:true} : {}), evidence: evidence.slice(), firstReview, moves: game.moves };
  rememberChapter(5);
  if (crownStore) storeCrownSample({fourth:{result:crownResult,logs:chapterFourLogs},fifth:{result:petitionResult,logs}});
  saveCanalSampleResult(false);
  showPetitionResult();
}

function showPetitionResult() {
  const { key, assisted, moves } = petitionResult;
  act = 'petition';
  sawField = Boolean(petitionResult.sawField);
  evidence = petitionResult.evidence;
  firstReview = petitionResult.firstReview;
  stage = evidence.filter(count => count === PETITION_TARGET).length;
  $('chapter-date').textContent = PETITION_DATE;
  const order = (petitionResult.nameScene ? NAME_ORDERS : PETITION_ORDERS)[key];
  setPhase('complete', '第五章完', '客得留秦');
  const last = order.lines.at(-1);
  updateScene('petition', petitionResult.nameScene && key === 'dispatch' ? '秦国 · 关口' : PETITION_PLACE,
    petitionResult.nameScene ? last.note : order.lines[0].note, { storyBeat: petitionResult.nameScene ? last.beat : key });
  const previous = chapterFourLogs ? button('回看第四章', 'action-button', () => {
    logs = chapterFourLogs;
    showCrownResult();
  }) : fullStoryLink();
  const memories = tag('ul', 'memories');
  const rows = [
    ...(sawField ? [['渠边', '在田尾见过郑国，水到了这一畦']] : []),
    ['先读', PETITION_NAMES[firstReview]],
    ...PETITION_NAMES.map((name, index) => [name, `${evidence[index]} / ${PETITION_TARGET}`]),
    ['核阅', assisted ? '余下的交文书补核' : `已用 ${PETITION_STEPS - moves} 步核齐`],
  ];
  for (const [label, value] of rows) {
    const item = tag('li');
    item.append(tag('strong', '', label), tag('span', '', value));
    memories.append(item);
  }
  content.replaceChildren(tag('p', 'body-text', PETITION_ANCHOR), tag('p', 'body-text', order.ending),
    memories, actions(chapterAction('继续第六章', 'action-button primary', 6, handover), chapterAction('重玩第五章', 'action-button', 5, petition), previous));
  if (crownStore) {
    content.querySelector('.actions').replaceChildren(button('再从冠礼试玩','action-button primary',restartCrownSample),previous);
    content.querySelector('button').focus({preventScroll:true});
    return;
  }
  const market = chapterAction(petitionResult.sawMarket ? '重看邯郸陶摊' : '去邯郸赶一回集', 'action-button', 6, runMarket);
  content.querySelector('.actions').firstElementChild.after(market);
  content.querySelector('button').focus({ preventScroll: true });
}

function zhaoUI() {
  return { setPhase, updateScene, sequence, button, content, tone, sample: zhaoSample,
    date: value => { $('chapter-date').textContent = value; } };
}

function runMarket() {
  const oldLogs = logs.filter(entry => !entry.market);
  logs = [];
  playMarket(zhaoUI(), () => {
    logs = [...oldLogs, ...logs.map(entry => ({ ...entry, market:true }))];
    if (zhaoSample) {
      returnToHandan();
      return;
    }
    petitionResult = {...petitionResult, sawMarket:true};
    saveCanalSampleResult(false);
    if (savedChapter === 5) rememberChapter(5);
    handover();
  });
}

function handover() {
  if (act === 'petition') chapterFiveLogs = logs;
  handoverResult = null;
  act = 'handover';
  logs = [];
  stage = 0;
  cargo = [-1, -1];
  firstCargo = 0;
  $('chapter-date').textContent = HANDOVER_DATE;
  setPhase('chapter', '韩亡之后', '新郑换印');
  const opening = handoverOpening(petitionResult?.key);
  if (petitionResult?.sawField) playHandoverLines(opening, () =>
    playHandoverLines(keepsakeLines, chooseHandoverRoute, '安排两车先后'), '看看街边');
  else playHandoverLines(opening, chooseHandoverRoute, '安排两车先后');
}

function playHandoverLines(lines, after, finalButton) {
  sequence(lines, after, finalButton, index => {
    const entry = lines[index];
    if (entry.beat) updateScene('handover', HANDOVER_PLACE, entry.note, { storyBeat: entry.beat });
  });
  content.querySelector('button').focus({ preventScroll: true });
}

function cargoStatus(row) {
  if (row < 0) return '待出发';
  return row === SIZE - 1 ? '已运抵' : `距底行 ${SIZE - 1 - row} 格`;
}

function chooseHandoverRoute() {
  setPhase('choice', '安排先后', '哪一车先走？');
  const choices = tag('div', 'choices');
  HANDOVER_ROUTES.forEach((route, index) => {
    choices.append(button(route.title, 'choice', () => {
      firstCargo = index;
      beginGame(false, 'handover');
    }));
  });
  content.replaceChildren(tag('p', 'body-text', '先走的物资起点更靠近底行。四步内，把封签和粮筹都送到。'), choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function finishHandover(assisted) {
  setPhase('ending', '街口', assisted ? '留到明日' : '两车运抵');
  playHandoverLines(handoverOutcome(assisted, game.collected), chooseHandoverOrder, '安排交接后续');
}

function chooseHandoverOrder() {
  setPhase('choice', '交接后续', '先请谁办一件事？');
  const choices = tag('div', 'choices');
  for (const [beat, order] of Object.entries(HANDOVER_ORDERS)) {
    choices.append(button(order.title, 'choice', () => {
      setPhase('chapter', '新郑', order.title);
      const lines = [{ ...order, beat }];
      if (petitionResult?.sawField) lines.push(streetReply(beat, cargo, SIZE - 1));
      playHandoverLines(lines, () => completeHandover(beat), '结束本章');
    }));
  }
  content.replaceChildren(choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function completeHandover(key) {
  handoverResult = { key, cargo: cargo.slice(), firstCargo, moves: game.moves };
  rememberChapter(6);
  saveCanalSampleResult(true);
  showHandoverResult();
}

function showHandoverResult() {
  const { key, moves } = handoverResult;
  const order = HANDOVER_ORDERS[key];
  act = 'handover';
  cargo = handoverResult.cargo;
  firstCargo = handoverResult.firstCargo;
  stage = cargo.filter(row => row === SIZE - 1).length;
  $('chapter-date').textContent = HANDOVER_DATE;
  setPhase('complete', '第六章完', '新郑换印');
  updateScene('handover', HANDOVER_PLACE, order.note, { storyBeat: key });
  const previous = chapterFiveLogs ? button('回看第五章', 'action-button', () => {
    logs = chapterFiveLogs;
    showPetitionResult();
  }) : fullStoryLink();
  const memories = tag('ul', 'memories');
  const rows = [
    ['先发', CARGO_NAMES[firstCargo]],
    ...CARGO_NAMES.map((name, index) => [name, cargo[index] === SIZE - 1 ? '已运抵' : '未运抵，次日再送']),
    ['步数', `已用 ${HANDOVER_STEPS - moves} 步`],
  ];
  for (const [label, value] of rows) {
    const item = tag('li');
    item.append(tag('strong', '', label), tag('span', '', value));
    memories.append(item);
  }
  content.replaceChildren(tag('p', 'body-text', HANDOVER_ANCHOR), tag('p', 'body-text', order.ending), memories,
    actions(canalStore ? button('从渠边重玩', 'action-button primary', () => petition()) : chapterAction('继续第七章', 'action-button primary', 7, returnToHandan), chapterAction('重玩第六章', 'action-button', 6, handover), previous));
  content.querySelector('button').focus({ preventScroll: true });
}

function returnToHandan() {
  if (act === 'handover') chapterSixLogs = logs;
  handanResult = null;
  act = 'return';
  logs = [];
  stage = 0;
  found = RETURN_CELLS.map(() => false);
  $('chapter-date').textContent = RETURN_DATE;
  sawReturnScene = false;
  playReturnedTablet(zhaoUI(), zhaoSample || petitionResult?.sawMarket, () => {
    sawReturnScene = true;
    $('chapter-date').textContent = RETURN_DATE;
    setPhase('chapter', '邯郸旧事', '回到旧院');
    const lines = returnOpening(journey, handoverResult?.key);
    lines.at(-1).speaker = '阿禾';
    playReturnLines(lines, () => beginGame(false, 'return'), '进院翻找');
  });
}

function playReturnLines(lines, after, finalButton) {
  sequence(lines, after, finalButton, index => {
    const entry = lines[index];
    if (entry.beat) updateScene('return', RETURN_PLACE, entry.note, { storyBeat: entry.beat });
  });
  content.querySelector('button').focus({ preventScroll: true });
}

function finishReturn(assisted) {
  setPhase('ending', '旧院', assisted ? '等到天亮' : '瓦下旧物');
  playReturnLines(returnOutcome(assisted, found), () => chooseReturnOrder(assisted), '决定旧院后续');
}

function chooseReturnOrder(assisted) {
  setPhase('choice', '旧院后续', '先做哪一件事？');
  const choices = tag('div', 'choices');
  for (const [beat, order] of Object.entries(RETURN_ORDERS)) {
    choices.append(button(order.title, 'choice', () => {
      setPhase('chapter', '邯郸', order.title);
      const proof = found[2] ? '户简上找到了平住过的那一户。' : '书佐另记“本人所述”。阿禾把带半月记的陶碗递给他看。';
      const witness = beat === 'record' ? {speaker:'阿禾',line:'就一个“平”字。旁边留点地方，他还没回话。'}
        : {speaker:'卖薪人',line:'这碗底我见过。他走时问了北路，还欠我半捆柴。'};
      playReturnLines([order.lines[0], {speaker:'叙事',line:proof}, witness], () => completeReturn(beat, assisted), '结束本章');
    }));
  }
  content.replaceChildren(choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function completeReturn(key, assisted) {
  handanResult = { key, assisted, sawTablet: sawReturnScene, found: found.slice(), moves: game.moves };
  rememberChapter(7);
  showReturnResult();
}

function storyMemory(label, text) {
  const item = tag('li', 'story-memory');
  item.append(tag('strong', '', label), tag('span', '', text));
  return item;
}

function showReturnResult() {
  const { key, assisted, moves } = handanResult;
  const order = RETURN_ORDERS[key];
  act = 'return';
  sawReturnScene = Boolean(handanResult.sawTablet);
  found = handanResult.found;
  stage = found.filter(Boolean).length;
  $('chapter-date').textContent = RETURN_DATE;
  setPhase('complete', '第七章完', '邯郸旧院');
  updateScene('return', RETURN_PLACE, order.lines[0].note, { storyBeat: key });
  const previous = chapterSixLogs ? button('回看第六章', 'action-button', () => {
    logs = chapterSixLogs;
    showHandoverResult();
  }) : fullStoryLink();
  const memories = tag('ul', 'memories');
  const rows = [
    ...RELIC_NAMES.map((name, index) => [name, found[index] ? '已找到' : '天亮再找']),
    ['翻找', assisted ? '未找到的留待白天' : `已用 ${RETURN_STEPS - moves} 步找齐`],
  ];
  for (const [label, value] of rows) {
    const item = tag('li');
    item.append(tag('strong', '', label), tag('span', '', value));
    memories.append(item);
  }
  if (handanResult.sawTablet) memories.append(storyMemory('阿禾寻兄',
    key === 'open' ? '卖薪人进了院门，留下去北路的口信。' : '书佐留下了平的姓名，音信一栏还空着。'));
  content.replaceChildren(tag('p', 'body-text', RETURN_ANCHOR), tag('p', 'body-text', order.ending), memories,
    actions(zhaoSample ? button('六年后 · 到燕地渡亭', 'action-button primary', startYan) : chapterAction('继续第八章', 'action-button primary', 8, oldFriend), chapterAction('重玩第七章', 'action-button', 7, returnToHandan), previous));
  content.querySelector('button').focus({ preventScroll: true });
}

function oldFriend() {
  if (act === 'return') chapterSevenLogs = logs;
  friendResult = null;
  act = 'friend';
  logs = [];
  firstHall = 0;
  hallProgress = [0, 0];
  stage = 0;
  $('chapter-date').textContent = FRIEND_DATE;
  collectedFolio = null;
  mapProgress = 0;
  const original = friendOpening(handanResult?.key);
  playFriendExpansion({ tag, button, actions, content, setPhase, sequence, updateScene, pieces, tone,
    map: value => { mapProgress = value; }, collect: value => { collectedFolio = value; } },
    original.slice(0, 2), () => playFriendLines(original.slice(3), chooseFirstHall, '安排两廊'));
}

function playFriendLines(lines, after, finalButton) {
  sequence(lines, after, finalButton, index => {
    const entry = lines[index];
    if (!entry.beat) return;
    if (entry.beat === 'map') setPhase('chapter', '咸阳', '燕使献图');
    if (entry.beat === 'stone') setPhase('chapter', '咸阳', '案边圆石');
    if (entry.beat === 'curtain') setPhase('chapter', '殿后', '帘边应声');
    if (entry.beat === 'aftermath') setPhase('chapter', '咸阳', '殿中事变之后');
    const place = entry.beat === 'yan' ? YAN_PLACE : entry.beat === 'map' ? '咸阳 · 秦廷' : FRIEND_PLACE;
    updateScene('friend', place, entry.note, { storyBeat: entry.beat });
  });
  content.querySelector('button').focus({ preventScroll: true });
}

function renderHallOrder() {
  const field = $('hall-order');
  field.hidden = stage !== 1 || phase !== 'game';
  board.inert = !field.hidden && !game.priority;
  if (field.hidden) return;
  const side = HALL_NAMES[firstHall], other = HALL_NAMES[1 - firstHall];
  for (const button of field.querySelectorAll('[data-order]')) {
    const order = button.dataset.order;
    const effect = order === 'lead' ? other + '继续等灯' : side + '继续等开帘';
    button.replaceChildren(tag('strong', '', hallOrderText(firstHall, order)), tag('small', '', effect));
    button.setAttribute('aria-pressed', String(game.priority === order));
  }
}

$('hall-order').addEventListener('click', event => {
  const pick = event.target.closest('[data-order]');
  if (!pick || busy || phase !== 'game' || !game.hall || stage !== 1) return;
  game = { ...game, priority: pick.dataset.order };
  selected = null;
  suggested = [];
  renderHallOrder();
  renderPieces(game.board);
  showObjective(stage);
  message('任意三消就能' + hallOrderText(firstHall, game.priority) + '。落子前可以改选。');
});

function hallStatus(progress) {
  return ['待点灯', '灯已亮', '人已接出'][progress];
}

function chooseFirstHall() {
  setPhase('choice', '接引宫人', '哪边先亮灯？');
  const choices = tag('div', 'choices');
  HALL_NAMES.forEach((name, index) => {
    choices.append(button('先点' + name, 'choice', () => {
      firstHall = index;
      beginGame(false, 'friend');
    }));
  });
  content.replaceChildren(tag('p', 'body-text', '左边有人扶着帘，右边有人捧着熄了的灯。先让哪边看见你？灯一亮，你来定先开帘还是把火传过去。'), choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function finishFriend(assisted) {
  setPhase('ending', '后续', assisted ? '还有人待接回' : '两队都回来了');
  playFriendLines(hallOutcome(assisted, hallProgress, journey.c2), () => chooseFriendOrder(assisted), '处置案上旧物');
}

function chooseFriendOrder(assisted) {
  setPhase('choice', '旧物与新简', '案前先做哪件事？');
  const choices = tag('div', 'choices');
  for (const [key, order] of Object.entries(FRIEND_ORDERS)) {
    choices.append(button(order.title, 'choice', () => {
      setPhase('chapter', '事后', order.title);
      playFriendLines(order.lines, () => completeFriend(key, assisted), '结束本章');
    }));
  }
  content.replaceChildren(choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function completeFriend(key, assisted) {
  friendResult = { key, folio: collectedFolio, assisted, firstHall, priority: game.collected >= 2 ? game.priority : null, progress: hallProgress.slice(), moves: game.moves };
  rememberChapter(8);
  showFriendResult();
}

function showFriendResult() {
  const { key, assisted, moves } = friendResult;
  const order = FRIEND_ORDERS[key];
  act = 'friend';
  hallProgress = friendResult.progress;
  firstHall = friendResult.firstHall;
  stage = hallProgress[0] + hallProgress[1];
  $('chapter-date').textContent = FRIEND_DATE;
  setPhase('complete', '第八章完', '席散之后');
  updateScene('friend', FRIEND_PLACE, order.lines[0].note, { storyBeat: key });
  const previous = chapterSevenLogs ? button('回看第七章', 'action-button', () => {
    logs = chapterSevenLogs;
    showReturnResult();
  }) : fullStoryLink();
  const memories = tag('ul', 'memories');
  const rows = [
    ...(friendResult.folio ? [['燕匕', folioLabel(friendResult.folio)]] : []),
    ['先亮灯', HALL_NAMES[firstHall]],
    ...(friendResult.priority ? [['接应顺序', hallOrderText(firstHall, friendResult.priority)]] : []),
    ...HALL_NAMES.map((name, index) => [name, hallStatus(hallProgress[index])]),
    ['结果', assisted ? '余下的由值守人接应' : `已用 ${HALL_STEPS - moves} 步接回两队`],
  ];
  for (const [label, value] of rows) {
    const item = tag('li');
    item.append(tag('strong', '', label), tag('span', '', value));
    memories.append(item);
  }
  if (friendSample) {
    previous.textContent = '再从陶坊试玩';
    previous.href = '?preview=friend-story';
  }
  content.replaceChildren(tag('p', 'body-text', FRIEND_ANCHOR), tag('p', 'body-text', order.ending), memories,
    actions(chapterAction('继续第九章', 'action-button primary', 9, startFlood), chapterAction('重玩第八章', 'action-button', 8, oldFriend), previous));
  addFriendPages(content, showFriendResult);
  content.querySelector('button').focus({ preventScroll: true });
}

function addFriendPages(parent, back) {
  if (!friendResult) return;
  if (friendResult.folio) {
    const leaf = tag('details', 'folio-collection');
    leaf.append(tag('summary', '', '燕地物记 · 燕匕'), showFolioCard(tag, 3, friendResult.folio));
    parent.append(leaf);
  }
  const open = button('翻开异闻 · 如果秦王没有走出那座殿', 'action-button other-leaf', () => {
    readOtherHistory({ tag, button, actions, content, setPhase, updateScene }, () => {
      back();
      const entry = content.querySelector('.other-leaf');
      const details = entry?.closest('details');
      if (details) details.open = true;
      entry?.focus({ preventScroll: true });
    });
  });
  parent.append(open);
}

function startFlood() {
  if (act === 'friend') chapterEightLogs = logs;
  floodResult = null;
  floodWitness = 'unknown';
  floodHandsUp = false;
  if (floodStore && floodStore.status !== 'unavailable') checkpointStatus('独立试玩 · 大梁街口至楚营');
  act = 'flood';
  logs = [];
  waterLevel = FLOOD_START;
  stage = floodStages(waterLevel);
  $('chapter-date').textContent = FLOOD_DATE;
  setPhase('chapter', '魏亡之后', '水到了门前');
  playFloodLines(floodOpening(friendResult?.key), () => beginGame(false, 'flood'), '稳住水位');
}

function playFloodLines(lines, after, finalButton) {
  sequence(lines, after, finalButton, index => {
    const entry = lines[index];
    if (entry.beat) updateScene('flood', FLOOD_PLACE, entry.note, { storyBeat: entry.beat });
  });
  content.querySelector('button').focus({ preventScroll: true });
}

function finishFlood(assisted) {
  setPhase('ending', '水边', assisted ? '暂留高处' : '木排靠阶');
  playFloodLines(floodOutcome(assisted, floodWitness !== 'unknown'), () => chooseFloodOrder(assisted), '安排高台后续');
}

function chooseFloodOrder(assisted) {
  setPhase('choice', '高台', '先安排什么？');
  const choices = tag('div', 'choices');
  for (const beat of Object.keys(FLOOD_ORDERS)) {
    choices.append(button(beat === 'list' ? '先登记姓名' : '先铺干席', 'choice', () => {
      setPhase('chapter', '大梁', beat === 'list' ? '先登记姓名' : '先铺干席');
      const answer = familyAnswer({ key: beat, assisted, recognized: floodWitness !== 'unknown' });
      playFloodLines([{ ...answer, beat, action: answer.note }], () => completeFlood(beat, assisted), '结束本章');
    }));
  }
  content.replaceChildren(tag('p', 'body-text', '哥哥问：「' + BROTHER_QUESTION + '」'), choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function completeFlood(key, assisted) {
  floodResult = { key, assisted, recognized: floodWitness !== 'unknown', water: waterLevel, moves: game.moves };
  if (floodStore) {
    const saved = floodStore.save({ ninth: { result: floodResult, logs } });
    if (saved === 'saved') checkpointStatus('第九章已保存 · 可接续到楚营');
    else reportSaveFailure(saved);
  }
  rememberChapter(9);
  showFloodResult();
}

function showFloodResult() {
  const { key, assisted, moves } = floodResult;
  const order = FLOOD_ORDERS[key];
  const answer = familyAnswer(floodResult);
  floodWitness = floodResult.recognized ? 'seen' : 'unknown';
  floodHandsUp = Boolean(assisted && floodResult.recognized);
  act = 'flood';
  waterLevel = floodResult.water;
  stage = floodStages(waterLevel);
  $('chapter-date').textContent = FLOOD_DATE;
  setPhase('complete', '第九章完', '水边留人');
  updateScene('flood', FLOOD_PLACE, answer?.note ?? order.note, { storyBeat: key });
  const previous = chapterEightLogs ? button('回看第八章', 'action-button', () => {
    logs = chapterEightLogs;
    showFriendResult();
  }) : fullStoryLink();
  const memories = tag('ul', 'memories');
  const rows = [
    ['水位', `${waterLevel} 格`],
    ['石阶', `${stage} / ${FLOOD_THRESHOLDS.length} 段露出`],
    ['结果', assisted ? '木排暂留原处' : `已用 ${FLOOD_STEPS - moves} 步，木排靠阶`],
  ];
  for (const [label, value] of rows) {
    const item = tag('li');
    item.append(tag('strong', '', label), tag('span', '', value));
    memories.append(item);
  }
  content.replaceChildren(tag('p', 'body-text', FLOOD_ANCHOR), tag('p', 'body-text', answer?.ending ?? order.ending), memories,
    actions(chapterAction('继续第十章', 'action-button primary', 10, startChu), chapterAction('重玩第九章', 'action-button', 9, startFlood), previous));
  content.querySelector('button').focus({ preventScroll: true });
}

function startChu() {
  if (act === 'flood') chapterNineLogs = logs;
  chuResult = null;
  act = 'chu';
  logs = [];
  stage = 0;
  supplyMode = 'swift';
  supplyStock = [0, 0];
  swiftResult = null;
  chuLoad = null;
  $('chapter-date').textContent = CHU_DATE;
  setPhase('chapter', '上折 · 送车', '等车的人');
  playChuLines(swiftOpening(floodResult?.key), () => beginGame(false, 'swift'), '为李信备粮');
}

function playChuLines(lines, after, finalButton) {
  sequence(lines, after, finalButton, index => {
    const entry = lines[index];
    if (!entry.beat) return;
    let place = supplyMode === 'swift' ? SWIFT_PLACE : STEADY_PLACE;
    if (['wheel','return','counted'].includes(entry.beat)) place = '秦营 · 归人木牌';
    if (entry.beat === 'wheel') { tone(113, 0.19, 0.026); tone(92, 0.22, 0.021, 0.2); }
    if (entry.beat === 'summon') {
      supplyMode = 'steady';
      supplyStock = [0, 0];
      stage = 0;
      setPhase('chapter', '中折 · 等人', '再请王翦');
      place = '频阳 · 王翦门前';
    }
    if (['bank','plank','crossing','landed'].includes(entry.beat)) {
      place = '楚地 · 旧渡';
      setPhase('chapter', '下折 · 接人', '有人喊船');
      $('chapter-region').textContent = '楚地 · 旧渡';
    }
    if (['list','reserve'].includes(entry.beat)) place = '秦营 · 暮灯';
    updateScene('chu', place, entry.note, { storyBeat: entry.beat });
  });
  content.querySelector('button').focus({ preventScroll: true });
}

// Save at scene boundaries, before sequence() appends its first line.
function enterChuFold(at, order) {
  const fold = { at, swift: swiftResult, logs: logs.slice(), load: chuLoad, order };
  let result;
  if (chuSampleStore) result = chuSampleStore.save({ chuFold: fold });
  else if (checkpointStore && campaignSnapshot?.chapters.length >= 9) {
    result = checkpointStore.save({ ...campaignSnapshot, chuFold: fold });
  }
  if (result === 'saved') checkpointStatus('楚线折间已保存 · 当前棋盘从本盘开头续玩');
  else if (result) reportSaveFailure(result);
  showChuFold(at, order);
}

function resumeChuFold(fold) {
  act = 'chu';
  logs = fold.logs.slice();
  swiftResult = fold.swift;
  chuLoad = fold.load;
  $('chapter-date').textContent = CHU_DATE;
  checkpointStatus('已接续楚线 · 当前棋盘从本盘开头续玩');
  showChuFold(fold.at, fold.order);
}

function showChuFold(at, order) {
  if (at === 'return' || at === 'counted') {
    supplyMode = 'swift';
    supplyStock = [swiftResult.grain, 0];
    stage = SUPPLY_SCHEMES.swift.targets.filter(([grain]) => swiftResult.grain >= grain).length;
    setPhase('chapter', '中折 · 等人', at === 'return' ? '车回来了' : '灯下的木牌');
    if (at === 'return') playChuLines(returnLines(swiftResult), () => enterChuFold('counted'), '记下亲见的人');
    else playChuLines(countedLines, () => enterChuFold('board'), '为王翦分批备物');
    return;
  }
  if (at === 'board') { beginGame(false, 'steady'); return; }
  supplyMode = 'steady';
  supplyStock = chuLoad.stock;
  stage = chuLoad.batches;
  if (at === 'shore') {
    setPhase('chapter', '下折 · 接人', '库场交班');
    playChuLines(steadyOutcome(chuLoad.assisted, stage), chooseChuOrder, '回营看灯');
  } else {
    setPhase('chapter', '营口暮灯', CHU_ORDERS[order].title);
    playChuLines([{ ...CHU_ORDERS[order], beat: order }], () => completeChu(order), '结束本章');
  }
}

function finishSwift(assisted) {
  swiftResult = { grain: supplyStock[0], assisted };
  enterChuFold('return');
}

function finishSteady(assisted) {
  chuLoad = { stock: supplyStock.slice(), batches: stage, moves: game.moves, assisted };
  enterChuFold('shore');
}

function chooseChuOrder() {
  setPhase('choice', '营口暮灯', '先办哪一件事？');
  updateScene('chu', '秦营 · 暮灯', '案上摊着归人牍。门边有卷席，营用筐里另留着一份粮和干布。', { storyBeat: 'dusk' });
  const choices = tag('div', 'choices');
  for (const [key, order] of Object.entries(CHU_ORDERS)) {
    choices.append(button(order.title, 'choice', () => enterChuFold('lamp', key)));
  }
  content.replaceChildren(tag('p', 'body-text', '来人袖口湿透，先问：“你们见过我的同伴吗？” 一盏灯，先照哪边？'), choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function completeChu(key) {
  chuResult = { key, swift: swiftResult, ...chuLoad, counted: true };
  rememberChapter(10);
  if (chuSampleStore) {
    const result = chuSampleStore.clear();
    if (result === 'saved') checkpointStatus('楚线试玩已完成 · 可继续第十一章，或重玩本章');
    else reportSaveFailure(result);
  }
  showChuResult();
}
function showChuResult() {
  const { key, assisted, moves } = chuResult;
  const order = CHU_ORDERS[key];
  act = 'chu';
  supplyMode = 'steady';
  supplyStock = chuResult.stock;
  swiftResult = chuResult.swift;
  stage = chuResult.batches;
  $('chapter-date').textContent = CHU_DATE;
  setPhase('complete', '第十章完', '归来的人');
  updateScene('chu', '秦营 · 暮灯', order.note, { storyBeat: key });
  const previous = chapterNineLogs ? button('回看第九章', 'action-button', () => {
    logs = chapterNineLogs;
    showFloodResult();
  }) : fullStoryLink();
  const memories = tag('ul', 'memories');
  const rows = [
    ['李信行前', `粮 ${swiftResult.grain} / 8` + (swiftResult.assisted ? '，缺额记下' : '，按时备齐')],
    ...(chuResult.counted ? [['归营木牌', '亲见一人，另一人未得信']] : []),
    ['王翦库场', `${stage} / 2 批已装`],
    ['粮布', `粮 ${supplyStock[0]} / 8 · 布 ${supplyStock[1]} / 8`],
    ['结果', assisted ? '缺项交给后班' : `已用 ${SUPPLY_SCHEMES.steady.moves - moves} 步装齐`],
  ];
  for (const [label, value] of rows) {
    const item = tag('li');
    item.append(tag('strong', '', label), tag('span', '', value));
    memories.append(item);
  }
  content.replaceChildren(tag('p', 'body-text', CHU_ANCHOR), tag('p', 'body-text', chuEnding(chuResult)), memories,
    actions(chapterAction('继续第十一章', 'action-button primary', 11, startYan), chapterAction('重玩第十章', 'action-button', 10, startChu), previous));
  content.querySelector('button').focus({ preventScroll: true });
}

function startYan() {
  if (act === 'chu') chapterTenLogs = logs;
  yanResult = null;
  act = 'yan';
  logs = [];
  stage = 0;
  registerBound = [false, false];
  $('chapter-date').textContent = YAN_DATE;
  setPhase('chapter', '燕代交替', '渡亭留名');
  const lines = yanOpening(journey, friendResult?.key, chuResult?.key);
  if (handanResult?.sawTablet) {
    lines.at(-1).speaker = '平';
    lines.push({speaker:'叙事', beat:'zhao-proof', note:'平用拇指摸过旧牍边的半月记。', line:handanResult.key === 'record'
      ? '书佐把邯郸捎来的寻人抄件压在案左，渡亭的散简放在案右。'
      : '带口信的北行客领平来到案前。他认得阿禾门边那只裂碗。'});
  }
  playYanLines(lines, () => beginGame(false, 'yan'), '开始拼简');
}

function playYanLines(lines, after, finalButton) {
  sequence(lines, after, finalButton, index => {
    const entry = lines[index];
    if (entry.beat) updateScene('yan', entry.beat === 'stone' ? YAN_STUDY : YAN_FERRY, entry.note, { storyBeat: entry.beat, replyText:entry.replyText });
  });
  content.querySelector('button').focus({ preventScroll: true });
}

function finishYan(assisted) {
  setPhase('ending', '渡亭', assisted ? '留空待问' : '两栏已合');
  playYanLines(yanOutcome(assisted, registerBound), () => chooseYanOrder(assisted), '决定怎样入册');
}

function chooseYanOrder(assisted) {
  setPhase('choice', '渡亭名册', '这些名字怎么放？');
  const choices = tag('div', 'choices');
  for (const [beat, order] of Object.entries(YAN_ORDERS)) {
    choices.append(button(order.title, 'choice', () => {
      setPhase('chapter', '渡亭', order.title);
      const letter = ferryLetter(handanResult, beat, registerBound);
      const finish = () => completeYan(beat, assisted);
      if (!letter) {
        playYanLines([{ ...order, beat }], finish, '结束本章');
        return;
      }
      const flip = () => playYanLines([
        {speaker:'平', line:letter.reply, replyText:letter.reply, beat:'zhao-reply', note:'书佐翻到背面写下回话。'},
        {speaker:'叙事', line:'南行人接过旧牍，收进怀里。阿禾还在远方。', replyText:letter.reply, beat:'zhao-send', note:'案边空了。南行人带走了回信。'}
      ], finish, '结束本章');
      const check = () => playYanLines([
        {speaker:'书佐', line:letter.check, beat:'zhao-front', note:'木牍正面仍是当年给李牧的谢辞。'}
      ], flip, '翻过旧牍');
      playYanLines([{ ...order, beat }, {speaker:'叙事',line:letter.proof}], check, '看书佐怎样落笔');
    }));
  }
  content.replaceChildren(choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function completeYan(key, assisted) {
  yanResult = { key, assisted, ...(handanResult?.sawTablet ? {sentReply:true} : {}), bound: registerBound.slice(), moves: game.moves };
  rememberChapter(11);
  showYanResult();
}

function showYanResult() {
  const { key, assisted, moves } = yanResult;
  const order = YAN_ORDERS[key];
  act = 'yan';
  registerBound = yanResult.bound;
  stage = registerBound.filter(Boolean).length;
  $('chapter-date').textContent = YAN_DATE;
  setPhase('complete', '第十一章完', '渡亭留名');
  updateScene('yan', YAN_FERRY, order.note, { storyBeat: key });
  const previous = chapterTenLogs ? button('回看第十章', 'action-button', () => {
    logs = chapterTenLogs;
    showChuResult();
  }) : fullStoryLink();
  const memories = tag('ul', 'memories');
  const rows = [
    ...REGISTER_NAMES.map((name, index) => [name, registerBound[index] ? '已合简' : '留空待问']),
    ['结果', assisted ? '未合简的部分留待复核' : `已用 ${REGISTER_STEPS - moves} 步合齐`],
  ];
  for (const [label, value] of rows) {
    const item = tag('li');
    item.append(tag('strong', '', label), tag('span', '', value));
    memories.append(item);
  }
  if (yanResult.sentReply) {
    const letter = ferryLetter(handanResult,key,yanResult.bound);
    if (letter) memories.append(storyMemory('托出的回话', letter.check + ' “' + letter.reply + '”'));
  }
  content.replaceChildren(tag('p', 'body-text', YAN_ANCHOR), tag('p', 'body-text', order.ending), memories,
    actions(zhaoSample ? button('再从邯郸陶摊试玩','action-button primary',start) : chapterAction('继续第十二章', 'action-button primary', 12, startQi), chapterAction('重玩第十一章', 'action-button', 11, startYan), previous));
  content.querySelector('button').focus({ preventScroll: true });
}

function startQi() {
  if (act === 'yan') chapterElevenLogs = logs;
  qiResult = null;
  act = 'qi';
  logs = [];
  stage = 0;
  qiEntries = 0;
  qiGrain = QI_GRAIN_START;
  openDesk('entry');
}

function saveLetterPage() {
  const result = letterStore ? letterStore.save({heard:sampleHeard, lettersAt:letterState})
    : checkpointStore && campaignSnapshot ? checkpointStore.save({
      journey:campaignSnapshot.journey, chapters:campaignSnapshot.chapters, lettersAt:letterState,
    }) : null;
  if (result === 'saved') checkpointStatus('已保存 · 等下一封，可从此处续玩');
  else if (result) reportSaveFailure(result);
}

function deskLogs(page, read) {
  const pages = qinPage(page)
    ? ['watch','first','later'].slice(0,['watch','first','later'].indexOf(page)+1)
    : ['entry', ...(page==='entry' || page==='market' && !read.length ? [] : ['shelf']), ...read,
      ...(['register','years','door','market'].includes(page) && read.length ? ['register'] : []),
      ...(['years','door','market'].includes(page) && read.length ? ['years'] : []),
      ...(['door','market'].includes(page) && read.length ? ['door'] : [])];
  return pages.flatMap(id => letterPages[id].lines.map(entry=>({...entry, desk:true})));
}

function openDesk(page, read = [], persist = true) {
  const qin = qinPage(page);
  act = qin ? 'king' : 'qi';
  stage = 0;
  letterState = {page,read};
  if (qin) {
    logs = [...(chapterThreeLogs ?? logs ?? []).filter(entry=>!entry.desk), ...deskLogs(page,read)];
  } else {
    qiEntries = 0;
    qiGrain = QI_GRAIN_START;
    logs = deskLogs(page,read);
  }
  if (letterStore && page==='later') sampleHeard=true;
  if (persist) {
    saveLetterPage();
    if (page==='door') { tone(176,0.08,0.09); tone(147,0.10,0.06,0.17); }
  }
  const echo = page==='market' && firstEcho[read[0]];
  if (page==='market' && !echo) { openQiMarket(); return; }
  if (echo) logs.push(echo);
  const block = echo ? {title:'坊门将启',note:echo.note,lines:[echo]} : letterPages[page];
  $('chapter-date').textContent = qin ? '秦王政六年 · 前241年' : QI_DATE;
  setPhase('chapter',qin ? '咸阳 · 值夜' : '临淄 · 清晨',block.title);
  updateScene(qin ? 'qinDesk' : 'qiDesk',qin ? '咸阳 · 值房' : '临淄 · 旧书房门内',block.note,
    {storyBeat:[page,read.map(id=>id[0]).join('')].filter(Boolean).join('-')});
  $('desk-caption').textContent=block.note;
  const body = tag('div','desk-lines');
  for (const entry of block.lines) {
    const line=tag('div','dialogue');
    line.append(tag('div','speaker',entry.speaker),tag('p','line',entry.line));
    addPortrait(line, scene, entry.speaker);
    body.append(line);
  }
  const row = actions();
  function option(label,action) {
    row.append(button(label,row.childElementCount ? 'action-button' : 'action-button primary',action));
  }
  function next(label,destination) {
    option(label,()=>openDesk(destination,read));
  }
  function offerLetter(id) {
    const name = id==='wei' ? '大梁来书' : '燕地来书';
    option((read.length ? '再读' : '先拆') + name,()=>openDesk(id,[...read,id]));
  }
  switch (page) {
    case 'watch':
      next('拆开先到的边报','first');
      if (letterStore) option('略过值夜，去临淄',()=>openDesk('entry'));
      break;
    case 'first': next('翻到后来的边报','later'); break;
    case 'later':
      if (letterStore) option('二十年后 · 去临淄',()=>openDesk('entry'));
      else option('收好抄件，继续第四章',()=>{
        kingResult={...kingResult,heardReport:true};
        rememberChapter(3);
        crown();
      });
      break;
    case 'entry':
      next('随掌书入旧书房','shelf'); next('直接去市坊','market'); break;
    case 'shelf': offerLetter('wei'); offerLetter('yan'); break;
    case 'wei': case 'yan':
      next('查看收书簿','register');
      if (read.length===1) offerLetter(page==='wei' ? 'yan' : 'wei');
      break;
    case 'register': next('翻过收书簿的年签','years'); break;
    case 'years': next('听门外是谁','door'); break;
    case 'door': next('带市人去坊门','market'); break;
    case 'market': option('去坊门交接',openQiMarket); break;
  }
  content.replaceChildren(body,row);
  reading.reveal(block.lines, row);
  row.firstElementChild.focus({preventScroll:true});
}

function openQiMarket() {
  $('chapter-date').textContent = QI_DATE;
  setPhase('chapter', '齐国', '临淄交接');
  playQiLines(qiOpening(yanResult?.key), () => beginGame(false, 'qi'), '开始交籍留粮');
}

function resumeLetterSample(sample) {
  sampleHeard = sample.heard;
  if (sample.finished) {
    qiResult=sample.finished.result;
    logs=sample.finished.logs;
    showQiResult();
  } else openDesk(sample.lettersAt.page,sample.lettersAt.read,false);
  checkpointStatus('已续玩 · 等下一封独立试玩');
}

function restartLetters() {
  const result = letterStore.clear();
  if (result !== 'saved') { reportSaveFailure(result); return; }
  start();
}

function playQiLines(lines, after, finalButton) {
  sequence(lines, after, finalButton, index => {
    const entry = lines[index];
    if (entry.beat) updateScene('qi', QI_PLACE, entry.note, { storyBeat: entry.beat });
  });
  content.querySelector('button').focus({ preventScroll: true });
}

function finishQi(assisted) {
  setPhase('ending', '临淄', assisted ? '余项留待复核' : '交接已核清');
  playQiLines(qiOutcome(assisted, qiEntries, qiGrain, QI_GRAIN_FLOOR), () => chooseQiOrder(assisted), '安排市坊后续');
}

function chooseQiOrder(assisted) {
  setPhase('choice', '坊门前', '先让市坊知道什么？');
  const choices = tag('div', 'choices');
  for (const [beat, order] of Object.entries(QI_ORDERS)) {
    choices.append(button(order.title, 'choice', () => {
      setPhase('chapter', '临淄', order.title);
      playQiLines([{ ...order, beat }], () => completeQi(beat, assisted), '结束本章');
    }));
  }
  content.replaceChildren(choices);
  choices.firstElementChild.focus({ preventScroll: true });
}

function completeQi(key, assisted) {
  qiResult = { key, assisted, entries: qiEntries, grain: qiGrain, moves: game.moves,
    ...(letterState.read.length ? {letters:letterState.read.slice()} : {}) };
  if (letterStore) {
    const result=letterStore.save({heard:sampleHeard,finished:{result:qiResult,logs}});
    if (result==='saved') checkpointStatus('已保存 · 等下一封独立试玩结算');
    else reportSaveFailure(result);
  }
  rememberChapter(12);
  showQiResult();
}

function showQiResult() {
  const { key, assisted, entries, grain, moves } = qiResult;
  const order = QI_ORDERS[key];
  act = 'qi';
  qiEntries = entries;
  qiGrain = grain;
  stage = entries;
  $('chapter-date').textContent = QI_DATE;
  setPhase('complete', '第十二章完', '六国归秦');
  updateScene('qi', QI_PLACE, order.note, { storyBeat: key });
  const previous = chapterElevenLogs ? button('回看第十一章', 'action-button', () => {
    logs = chapterElevenLogs;
    showYanResult();
  }) : fullStoryLink();
  const memories = tag('ul', 'memories');
  const rows = [
    ['民籍', `已核 ${qiEntries} / ${QI_GOAL} 条`],
    ['市粮', `实留 ${qiGrain} 份`],
    ['结果', assisted ? '余项留待复核' : `已用 ${QI_STEPS - moves} 步完成交接`],
  ];
  for (const [label, value] of rows) {
    const item = tag('li');
    item.append(tag('strong', '', label), tag('span', '', value));
    memories.append(item);
  }
  const recollection=letterMemory(letterStore ? sampleHeard : kingResult?.heardReport, qiResult.letters);
  if (recollection) {
    const item = tag('li','desk-memory');
    item.append(tag('strong','','等下一封'),tag('span','',recollection));
    memories.append(item);
  }
  content.replaceChildren(tag('p', 'body-text', QI_ANCHOR), tag('p', 'body-text', order.ending), memories,
    actions(letterStore ? button('再玩一次首尾线','action-button primary',restartLetters) : chapterAction('继续终章', 'action-button primary', 13, startEmperor), chapterAction('重玩第十二章', 'action-button', 12, startQi), previous));
  content.querySelector('button').focus({ preventScroll: true });
}

function startEmperor() {
  if (act === 'qi') chapterTwelveLogs = logs;
  act = 'emperor';
  logs = [];
  stage = 0;
  $('chapter-date').textContent = EMPEROR_DATE;
  const lines = emperorStory(journey, friendResult?.key);
  function read(index) {
    const entry = lines[index];
    logs.push(entry);
    setPhase('chapter', '咸阳', entry.title);
    if (!['title','edict'].includes(entry.beat)) {
      $('chapter-name').textContent = '咸阳议号';
      document.title = '咸阳议号 · 帝王传说';
    }
    updateScene('emperor', EMPEROR_PLACE, entry.note, {storyBeat:entry.beat});
    const advance = button(entry.button ?? '继续', 'action-button primary', () => {
      if (entry.beat === 'edict') returnToDesk();
      else read(index + 1);
    });
    const row = actions(advance);
    let timer;
    function afterReading() {
      if (entry.beat === 'edict') timer = setTimeout(returnToDesk, 2200);
    }
    if (entry.beat === 'proposal') {
      content.replaceChildren(tag('p','decree-reading',entry.line), row);
      reading.reveal(entry, row);
    } else if (entry.beat === 'present') {
      content.replaceChildren(tag('p','body-text',entry.line), row);
      reading.reveal(entry, row);
    } else showDialogue(entry, row, afterReading);
    advance.focus({preventScroll:true});
    if (entry.beat !== 'edict') return;
    // Keep the spoken caption intact while only the shot and action change.

    function returnToDesk() {
      clearTimeout(timer);
      if (!advance.isConnected || scene.dataset.storyBeat !== 'edict') return;
      updateScene('emperor', EMPEROR_PLACE, '传诏的人已下了台阶。案边的卷还系着。', {storyBeat:'closed'});
      const open = button('展开传说卷','action-button primary',() => {
        if (savedChapter !== 13) rememberChapter(13);
        showLegend();
      });
      // A second tap from the preceding gesture must not open the roll.
      open.disabled = true;
      advance.replaceWith(open);
      setTimeout(() => {
        if (!open.isConnected) return;
        open.disabled = false;
        if (!$('notes').open && document.activeElement === document.body) open.focus({preventScroll:true});
      }, 330);
    }
  }
  read(0);
}

$('proposal-roll').addEventListener('click', () => {
  if (scene.dataset.storyBeat === 'signed') content.querySelector('.primary')?.click();
});

function journeyEntries() {
  return buildLegend({
    journey, kingResult, crownResult, petitionResult, handoverResult, handanResult,
    friendResult, floodResult, chuResult, yanResult, qiResult,
  });
}

function showLegend() {
  act = 'emperor';
  $('chapter-date').textContent = EMPEROR_DATE;
  setPhase('complete', '始皇篇完', '传说卷');
  const entries = journeyEntries();
  updateScene('emperor', EMPEROR_PLACE, entries.length ? '案上的简册展开，记着你一路做过的选择。' : '案上的简册展开。', { storyBeat: 'legend' });
  const text = entries.length
    ? '从邯郸到咸阳。翻开各章，回看这次旅程里的选择和结果。'
    : '串联试玩可在这里回看一路做过的选择。';
  const roll = tag('ol', 'legend-roll');
  for (const entry of entries) {
    const item = tag('li');
    item.dataset.chapter = entry.chapter;
    const details = tag('details');
    const title = tag('span', 'legend-chapter', entry.title);
    const previewText = tag('span', 'legend-choice', entry.choices.at(-1) ?? entry.consequence);
    const summary = tag('summary');
    summary.append(title, previewText);
    const body = tag('div', 'legend-entry');
    if (entry.choices.length > 1) {
      const choices = tag('ul', 'legend-choices');
      for (const choice of entry.choices) choices.append(tag('li', '', choice));
      body.append(choices);
    }
    if (entry.choices.length && entry.consequence) body.append(tag('p', '', entry.consequence));
    if (entry.outcome) body.append(tag('p', 'legend-outcome', entry.outcome));
    if (entry.chapter === 11 && yanResult?.sentReply) {
      const letter = ferryLetter(handanResult, yanResult.key, yanResult.bound);
      if (letter) body.append(tag('p','legend-outcome','退回的信 · ' + letter.check + ' 平托话：“' + letter.reply + '”'));
    }
    if (entry.chapter === 8) addFriendPages(body, showLegend);
    details.append(summary, body);
    item.append(details);
    roll.append(item);
  }
  const previous = chapterTwelveLogs ? button('回看第十二章', 'action-button', () => {
    logs = chapterTwelveLogs;
    showQiResult();
  }) : fullStoryLink();
  content.replaceChildren(tag('p', 'body-text emperor-anchor', EMPEROR_ANCHOR), tag('p', 'body-text', text));
  if (entries.length) content.append(roll);
  content.append(actions(previous, button('重看终章', 'action-button', startEmperor)));
  const heading = $('panel-title');
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
}

function showLoss() {
  if (level === LEVELS.qi) {
    const shortfall = qiGrain < QI_GRAIN_FLOOR;
    setPhase('lost', '关卡结果', shortfall ? '留粮低于底线' : '还有民籍未核');
    updateScene('qi', QI_PLACE, shortfall ? `市粮只留 ${qiGrain} 份，低于 ${QI_GRAIN_FLOOR} 份底线。`
      : `已核 ${qiEntries} 条民籍，余下的仍留在案上。`, { storyBeat: 'pending' });
    content.replaceChildren(tag('p', 'body-text', '可以重试，或留下已经核过的民籍和市粮实数，交给后班复核。'),
      actions(button('重试同一盘', 'action-button primary', () => beginGame(true, 'qi')),
        button('照实记下，继续交接', 'action-button', () => finishGame(true))));
    content.querySelector('button').focus({ preventScroll: true });
    return;
  }
  if (level === LEVELS.yan) {
    setPhase('lost', '关卡结果', '案上还有散简');
    updateScene('yan', YAN_FERRY, '已经合上的照原样放好，余下的留在案上。', { storyBeat: 'pending' });
    content.replaceChildren(tag('p', 'body-text', '步数用完了。可以重试，也可以保留已合的部分，让书佐再问到渡口的人。'),
      actions(button('重试同一盘', 'action-button primary', () => beginGame(true, 'yan')),
        button('让书佐留空待问', 'action-button', () => finishGame(true))));
    content.querySelector('button').focus({ preventScroll: true });
    return;
  }
  if (level.mode === 'chu') {
    const swift = supplyMode === 'swift';
    const title = swift ? '粮车还未备齐' : stage ? '还有一批未封' : '两批物资尚未配齐';
    setPhase('lost', '关卡结果', title);
    updateScene('chu', levelPlace(), swift ? '粮车只装上已备好的粮，缺额照实记下。' : '车旁留下实收的粮和布，缺项记给后班。');
    content.replaceChildren(tag('p', 'body-text', swift ? '步数用完了。可以重试，或把缺额记在牍上继续。'
      : '步数用完了。可以重试这一局，或把缺项交给后班。'),
      actions(button('重试同一盘', 'action-button primary', () => beginGame(true, supplyMode)),
        button(swift ? '记下缺额' : '交给后班补齐', 'action-button', () => finishGame(true))));
    content.querySelector('button').focus({ preventScroll: true });
    return;
  }
  if (level === LEVELS.flood) {
    setPhase('lost', '关卡结果', '石阶还未全露出');
    updateScene('flood', FLOOD_PLACE, `水位仍有 ${waterLevel} 格，木排暂留。${floodWitness === 'unknown' ? '岸上还没看清。' : '小满和陶婶仍隔水回应。'}`, { storyBeat: 'hold' });
    content.replaceChildren(tag('p', 'body-text', '步数用完了。可以重试，或让木排暂留，先在高台安排后续。'),
      actions(button('重试同一盘', 'action-button primary', () => beginGame(true, 'flood')),
        button('让木排暂留', 'action-button', () => finishFlood(true))));
    content.querySelector('button').focus({ preventScroll: true });
    return;
  }
  if (level === LEVELS.friend) {
    setPhase('lost', '关卡结果', '还有人未归');
    updateScene('friend', FRIEND_PLACE, '亮过的灯继续照着。还在帘后的人，由值守接应。', { storyBeat: 'pending' });
    content.replaceChildren(tag('p', 'body-text', '步数已用完。可以重试，改从另一廊开始，或让值守沿已经亮起的灯继续接人。'),
      actions(button('重试同一盘', 'action-button primary', () => beginGame(true, 'friend')),
        button('改从另一廊开始', 'action-button', chooseFirstHall),
        button('请值守接应', 'action-button', () => finishGame(true))));
    content.querySelector('button').focus({ preventScroll: true });
    return;
  }
  if (level === LEVELS.return) {
    setPhase('lost', '关卡结果', '院里光线暗下来了');
    updateScene('return', RETURN_PLACE, '找出的旧物留在原处，剩下的等天亮再翻找。', { storyBeat: 'pending' });
    content.replaceChildren(tag('p', 'body-text', '步数用完了。可以重试，或留下已经找到的东西，等到明早再找。'),
      actions(button('重试同一盘', 'action-button primary', () => beginGame(true, 'return')),
        button('改为明早再找', 'action-button', () => finishGame(true))));
    content.querySelector('button').focus({ preventScroll: true });
    return;
  }
  if (level === LEVELS.handover) {
    setPhase('lost', '关卡结果', '还有车未到');
    updateScene('handover', HANDOVER_PLACE, '已运抵的留在交接处，未到的车暂留街上。', { storyBeat: 'pending' });
    content.replaceChildren(tag('p', 'body-text', '步数用完了。可以重试、改派另一车先走，或把余下的交接留到明日。'),
      actions(button('重试同一盘', 'action-button primary', () => beginGame(true, 'handover')),
        button('改派另一车先走', 'action-button', chooseHandoverRoute),
        button('改为明日续送', 'action-button', () => finishGame(true))));
    content.querySelector('button').focus({ preventScroll: true });
    return;
  }
  if (level === LEVELS.petition) {
    setPhase('lost', '关卡结果', '案头还有简未核');
    updateScene('petition', PETITION_PLACE, '已核证据留在案上，未核部分仍卷着。', { storyBeat: 'pending' });
    content.replaceChildren(tag('p', 'body-text', '步数用完了。可以按这一卷重新开始，或换个开头。也可以请文书续核，接着看到停令。'),
      actions(button('重试同一盘', 'action-button primary', () => beginGame(true, 'petition')),
        button('改选先读的卷', 'action-button', choosePetitionReading),
        button('请文书续核', 'action-button', () => finishGame(true))));
    content.querySelector('button').focus({ preventScroll: true });
    return;
  }
  if (level === LEVELS.crown) {
    setPhase('lost', '关卡结果', '尚未全数回令');
    updateScene('crown', CROWN_PLACE, '灯亮的地方已回令，仍暗的地方还在等。', { storyBeat: 'delayed' });
    content.replaceChildren(tag('p', 'body-text', '步数用完了。可以重试同一盘，也可以保留已核进度，派人当面确认余下的令牍。'),
      actions(button('重试同一盘', 'action-button primary', () => beginGame(true, 'crown')),
        button('转为当面确认', 'action-button', () => finishGame(true))));
    content.querySelector('button').focus({ preventScroll: true });
    return;
  }
  if (level === LEVELS.council) {
    setPhase('lost', '关卡结果', '尚未核完');
    updateScene('court', KING_PLACE, '合着的还是未核清的案卷。', { storyBeat: 'defer' });
    content.replaceChildren(tag('p', 'body-text', '步数用完了。可以从同一盘再试，也可以照已核进度留案，等文书继续查。'),
      actions(button('重试同一盘', 'action-button primary', () => beginGame(true, 'council')),
        button('留案待核', 'action-button', () => finishGame(true))));
    content.querySelector('button').focus({ preventScroll: true });
    return;
  }
  const road = level === LEVELS.road;
  setPhase('lost', '关卡结果', road ? '先等一等' : '门外有脚步');
  updateScene(level.mode, levelPlace(), road ? '人群仍堵着路。赵氏拉住政。' : '赵氏抱紧政。田伯还在门边。');
  content.replaceChildren(tag('p', 'body-text', road
    ? '步数用完了。可以从同一盘重试，也可以听赵氏的话，等路口空下来再走。'
    : '步数用完了。你可以从同一盘重试，也可以由田伯把剩下的物件收好。'),
    actions(button('重试同一盘', 'action-button primary', () => beginGame(true, road ? 'road' : 'shelter')),
      button(road ? '等人群散开' : '请田伯帮忙', 'action-button', () => finishGame(true))));
  content.querySelector('button').focus({ preventScroll: true });
}

function pause(duration, reduced = 30) {
  return new Promise(resolve => setTimeout(resolve, motion.matches ? reduced : duration));
}

function animate(element, keyframes, duration) {
  if (motion.matches) return Promise.resolve();
  return element.animate(keyframes, { duration, easing: 'ease-out' }).finished.catch(() => {});
}

function swapMotion(a, b, invalid = false) {
  const first = tiles[a].getBoundingClientRect();
  const second = tiles[b].getBoundingClientRect();
  const motionFor = (index, direction) => {
    const translate = 'translate(' + (second.x - first.x) * direction + 'px,'
      + (second.y - first.y) * direction + 'px)';
    const frames = [{ transform: 'none' }, { transform: translate }];
    if (invalid) frames.push({ transform: 'none' });
    return animate(tiles[index].firstElementChild, frames, invalid ? 230 : 115);
  };
  return Promise.all([motionFor(a, 1), motionFor(b, -1)]);
}

async function move(a, b) {
  if (busy || phase !== 'game') return;
  if (CARGO.includes(game.board[a]) || CARGO.includes(game.board[b])) {
    message(cargoInstruction);
    return;
  }
  if (game.board[a] === ROADBLOCK || game.board[b] === ROADBLOCK) {
    explainObstacle();
    return;
  }
  await runTurn(playMove(game, a, b), { a, b });
}

async function activateCharge(id) {
  if (busy || phase !== 'game') return;
  const result = useCharge(game, id);
  if (!result) return;
  const charge = game.charges.find(item => item.id === id);
  if (game.crown) {
    const completed = result.state.marks.flatMap((mark, index) => mark === CROWN_HITS && game.marks[index] < mark ? [CROWN_NAMES[index]] : []);
    trialUses.push(chargeLabel(charge) + (completed.length ? ' · ' + completed.join('与') : ''));
  } else trialUses.push(level.beats[stage + 1].chip + '处' + chargeLabel(charge));
  await runTurn(result, { charge });
}

async function showCrownProgress(nextMarks, collected) {
  const changed = crownProgress(crownMarks,nextMarks);
  if (!changed) return '';
  stage = collected;
  crownMarks = nextMarks;
  const note = changed + '。';
  updateScene('crown', CROWN_PLACE, note, { cue: true });
  showObjective(collected, true);
  message(note);
  tone(320 + stage * 76, 0.15, 0.026);
  await pause(670, 120);
  return note;
}

async function showPetitionProgress(nextEvidence, collected, initialEvidence) {
  if (nextEvidence.every((count, index) => count === evidence[index])) return '';
  const reviewed = [0, 1].filter(index => nextEvidence[index] > initialEvidence[index]);
  const summary = reviewed.map(index => PETITION_NAMES[index]
    + (nextEvidence[index] === PETITION_TARGET ? '核齐' : '添一条证据'));
  const index = reviewed[0];
  const note = reviewed.length === 1 && nextEvidence[index] === PETITION_TARGET
    ? PETITION_COMPLETE_NOTES[index] : summary.join('，') + '。';
  stage = collected;
  evidence = nextEvidence;
  updateScene('petition', PETITION_PLACE, note, { cue: true });
  showObjective(collected, stage);
  message(note);
  tone(262 + stage * 68, 0.15, 0.026);
  await pause(660, 110);
  return note;
}

async function showHandoverProgress() {
  const rows = cargoRows(game.board);
  const notes = rows.flatMap((row, index) => {
    const distance = row - cargo[index];
    if (!distance) return [];
    return [row === SIZE - 1 ? CARGO_ARRIVED[index] : CARGO_NAMES[index] + '前进 ' + distance + ' 格。'];
  });
  if (!notes.length) return '';
  cargo = rows;
  stage = game.collected;
  const note = notes.join('');
  updateScene('handover', HANDOVER_PLACE, note, { cue: true });
  message(note);
  tone(278 + stage * 85, 0.16, 0.026);
  await pause(960, 110);
  return note;
}

async function showReturnProgress(nextFound, collected, initialFound) {
  if (nextFound.every((part, index) => part === found[index])) return '';
  const gained = RELIC_NAMES.filter((_, index) => nextFound[index] && !initialFound[index]);
  const index = RELIC_NAMES.indexOf(gained[0]);
  const note = gained.length === 1 ? RELIC_NOTES[index] : '从残瓦下找到了' + gained.join('、') + '。';
  found = nextFound;
  stage = collected;
  updateScene('return', RETURN_PLACE, note, { cue: true });
  showObjective(collected, true);
  message(note);
  tone(286 + stage * 62, 0.16, 0.026);
  await pause(780, 120);
  return note;
}

async function showHallProgress(previous) {
  if (game.collected === previous) return '';
  const side = hallSide(firstHall, previous, game.priority);
  stage = game.collected;
  hallProgress = hallCounts(firstHall, stage, game.priority);
  const crossed = hallProgress[side] === 2;
  let note = HALL_NAMES[side] + (crossed ? '帘开了，人已走到外廊。' : '应声：「看见了。」');
  if (stage === 2) note += crossed ? HALL_NAMES[1 - side] + '还在暗处等灯。' : '两边都看见了灯，人还在帘后。';
  updateScene('friend', FRIEND_PLACE, note, { cue: true });
  renderPieces(game.board);
  showObjective(stage, true);
  message(note);
  tone(260 + stage * 62, 0.16, 0.026);
  await pause(crossed ? 1160 : 590, 125);
  return note;
}

async function showFloodProgress(previous, cleared) {
  const prevStage = stage;
  stage = game.collected;
  waterLevel = game.water;
  const extent = stage > prevStage ? STEP_NAMES.slice(prevStage, stage).join('、') + '石阶露出。'
    : stage < prevStage ? STEP_NAMES.slice(stage, prevStage).join('、') + '石阶又没入水中。' : '';
  const detail = `涌水 +${FLOOD_RISE}，消去 ${cleared} 枚水波。水位 ${previous.water} → ${waterLevel} 格。`;
  const witness = nextWitness(floodWitness, prevStage, stage);
  const signal = witness !== floodWitness ? SIGNAL[witness] : null;
  if (signal || stage < prevStage) floodHandsUp = true;
  else if (stage > prevStage) floodHandsUp = false;
  if (signal) logs.push(signal);
  floodWitness = witness;
  const shore = signal ? signal.line : stage === 0 && witness !== 'unknown' ? '水盖住了缺角。小满和陶婶仍隔水举着手。'
    : stage > 0 ? '小满指着缺角，陶婶望着排头。' : '隔着水面，陶婶还没认出他们。';
  updateScene('flood', FLOOD_PLACE, shore, { cue: stage !== prevStage });
  setStats(game.moves, stage);
  showObjective(stage, true);
  message(detail);
  if (waterLevel !== previous.water) await pause(710, 110);
  return extent ? detail + extent : detail;
}

async function showSupplyProgress(previous) {
  const additions = game.stock.flatMap((count, index) => count > previous.stock[index]
    ? [`${count - previous.stock[index]} 份${SUPPLY_NAMES[index]}`] : []);
  if (!additions.length) return '这一步没有装入新物资。留意还缺的那一种。';
  stage = game.collected;
  supplyStock = game.stock;
  const newlyPacked = stage - previous.collected;
  let note = '装入 ' + additions.join('和 ') + '。';
  if (game.supply === 'steady') {
    if (newlyPacked) note += stage === 2 ? '两根绳都已扎紧。' : '第一车封好，余料转到下一车。';
    else if (game.stock[0] > 4 && game.stock[1] < 4) note += '余粮暂留架上，第一车还差 ' + (4 - game.stock[1]) + ' 份布。';
    else if (game.stock[1] > 4 && game.stock[0] < 4) note += '余布暂留架上，第一车还差 ' + (4 - game.stock[0]) + ' 份粮。';
  }
  updateScene('chu', levelPlace(), note, { cue: newlyPacked > 0 });
  setStats(game.moves, stage);
  showObjective(stage, true);
  message(note);
  tone(280 + stage * 65, 0.16, 0.026);
  if (game.supply === 'steady' && newlyPacked) tone(132, 0.13, 0.035, 0.14);
  await pause(690, 115);
  return note;
}

async function showRegisterProgress(nextBound, collected, initialBound) {
  if (nextBound.every((part, index) => part === registerBound[index])) return '';
  const newParts = nextBound.flatMap((part, index) => part && !initialBound[index] ? [index] : []);
  const note = newParts.length > 1 ? '横竖两向各成四连，姓名与来处都已合简。' : REGISTER_NOTES[newParts[0]];
  registerBound = nextBound;
  stage = collected;
  updateScene('yan', YAN_FERRY, note, { cue: true });
  showObjective(collected, true);
  message(note);
  tone(246 + 100 * stage, 0.17, 0.026);
  await pause(725, 120);
  return note;
}

async function showQiProgress(previous) {
  const verified = game.collected - previous.collected;
  const removed = previous.grain - game.grain;
  if (!verified && !removed) return '民籍与市粮数量未变。可以利用这次落子找下一组蓝简。';
  qiEntries = game.collected;
  qiGrain = game.grain;
  stage = qiEntries;
  const parts = [];
  if (verified) parts.push(`核过 ${verified} 条民籍`);
  if (removed) parts.push(`调走 ${removed} 份市粮，实留 ${qiGrain} 份`);
  const note = parts.join('。') + '。';
  updateScene('qi', QI_PLACE, note, { cue: true });
  showObjective(qiEntries, true);
  message(note);
  tone(286 + qiEntries * 26, 0.16, 0.026);
  await pause(740, 125);
  return note;
}

async function runTurn(result, { a, b, charge }) {
  busy = true;
  board.setAttribute('aria-busy', 'true');
  selected = null;
  suggested = [];
  highlightCharge(charge ?? null);
  const before = game;
  const previousCount = before.collected;
  try {
    if (charge) {
      await pause(180);
      highlightCharge(null);
    } else {
      await swapMotion(a, b, !result);
    }
    if (!result) {
      message('需要连成三个同类。这次没有扣步。');
      return;
    }
    renderPieces(result.swap);
    let collected = game.collected;
    let crownFeedback = '';
    let petitionFeedback = '';
    let returnFeedback = '';
    let registerFeedback = '';
    setStats(result.state.moves, collected);
    for (const [index, wave] of result.waves.entries()) {
      const duration = index > 2 ? 65 : 135;
      tone(225 + index * 43, 0.12, 0.023);
      await Promise.all(wave.removed.map(cell => animate(tiles[cell].firstElementChild,
        [{ opacity: 1, scale: 1 }, { opacity: 0.15, scale: 0.28 }], duration)));
      renderPieces(wave.board);
      const gain = wave.collected - collected;
      collected = wave.collected;
      setStats(result.state.moves, collected);
      if (gain && !game.road && !game.petition && !game.handover && !game.returned && !game.hall && !game.flood
          && !game.supply && !game.register && !game.qi) {
        void animate($('target'), [{ color: '#b9fbe0', scale: 1.17 }, { color: 'inherit', scale: 1 }], 360);
        message('收集 +' + gain + ' 枚遮蔽棋子。');
      }
      const pitch = tiles[SIZE].offsetTop - tiles[0].offsetTop || tiles[0].offsetHeight;
      const falling = wave.drops.map((drop, cell) => drop > 0
        ? animate(tiles[cell].firstElementChild,
          [{ transform: 'translateY(' + (-drop * pitch) + 'px)', opacity: 0.62 },
            { transform: 'translateY(0)', opacity: 1 }], duration + 35)
        : Promise.resolve());
      await Promise.all(falling);
      if (wave.bound) registerFeedback = await showRegisterProgress(wave.bound, collected, before.bound) || registerFeedback;
      if (wave.found) {
        const revealed = showReturnProgress(wave.found, collected, before.found);
        renderPieces(wave.board);
        returnFeedback = await revealed || returnFeedback;
      }
      for (const milestone of wave.milestones) {
        await playStage(milestone, collected);
      }
      if (wave.milestones.length && (game.road || stage < level.goal)) {
        updateScene(level.mode, levelPlace(), level.beats[stage].result);
      }
      showObjective(collected);
    }
    game = result.state;
    if (game.petition) petitionFeedback = await showPetitionProgress(game.evidence, game.collected, before.evidence);
    if (game.crown) crownFeedback = await showCrownProgress(game.marks,game.collected);
    const cargoFeedback = game.handover ? await showHandoverProgress() : '';
    const hallFeedback = game.hall ? await showHallProgress(previousCount) : '';
    const floodFeedback = game.flood ? await showFloodProgress(before, result.waterCleared) : '';
    const supplyFeedback = game.supply ? await showSupplyProgress(before) : '';
    const qiFeedback = game.qi ? await showQiProgress(before) : '';
    const loosened = gateHitsRemaining(before) > 1 && gateHitsRemaining(game) === 1;
    const partialReview = game.council && gateHitsRemaining(game) > 0 && game.gateHits > before.gateHits;
    const reviewNote = partialReview ? '已验 ' + game.gateHits + ' 处，还差 ' + gateHitsRemaining(game) + ' 次复核。' : '';
    if (partialReview) updateScene(level.mode, levelPlace(), reviewNote);
    else if (loosened) updateScene(level.mode, levelPlace(), '巷门松开一半，还差一次相邻消除。');
    renderPieces(game.board);
    renderTrial();
    showObjective(game.collected);
    if (game.qi && game.grain < QI_GRAIN_FLOOR) {
      showLoss();
    } else if (game.collected >= level.goal) {
      finishGame(false);
    } else if (!game.moves) {
      showLoss();
    } else if (result.reshuffled) {
      message('棋盘已重新铺开，重排没有扣步。');
    } else {
      const crossed = result.waves.flatMap(wave => wave.milestones).at(-1);
      const gain = collected - previousCount;
      const earned = game.charges ? result.waves.flatMap(wave => wave.earned ?? []) : [];
      const resultText = crossed ? level.beats[crossed].result
        : partialReview ? reviewNote
        : game.qi ? qiFeedback
        : game.register ? registerFeedback || '这次没有补上散简。留意还缺横向还是纵向四连。'
        : game.supply ? supplyFeedback
        : game.flood ? floodFeedback
        : game.hall ? hallFeedback || '这一步没有碰到亮列。可以在亮列里连消，也可以横向消除经过它。'
        : game.returned ? returnFeedback || '这一步没有清到标记格。留意仍有字的标记框。'
        : game.handover ? cargoFeedback || '车还没往前走。试着清掉物资下方同列的棋子。'
        : game.petition ? petitionFeedback || '这一步清了盘面。下一步留意还缺哪种简。'
        : game.crown ? crownFeedback || '留意两处还差几次，符牌能同时推进所覆盖的令印。'
        : game.council ? '看清案卷的位置，考虑把符牌留给原卷。'
        : loosened ? '巷门松开了一半。'
        : game.road ? '留意路障的上下左右。'
        : gain ? '收集 +' + gain + ' 枚遮蔽棋子。' : '盘面变了，留意带灯罩的青色棋子。';
      message(earned.length ? resultText + ' 留下' + earned.map(chargeLabel).join('、') + '的符牌。' : resultText);
    }
  } finally {
    busy = false;
    board.removeAttribute('aria-busy');
    if (game.hall) {
      renderHallOrder();
      if (board.inert) {
        const field = $('hall-order');
        field.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        field.querySelector('button').focus({ preventScroll: true });
      }
    }
  }
}

function adjacent(a, b) {
  return Math.abs(Math.floor(a / SIZE) - Math.floor(b / SIZE)) + Math.abs(a % SIZE - b % SIZE) === 1;
}

function select(index) {
  if (busy || phase !== 'game') return;
  if (CARGO.includes(game.board[index])) {
    message(cargoInstruction);
    return;
  }
  if (game.board[index] === ROADBLOCK) {
    explainObstacle();
    return;
  }
  if (selected !== null && adjacent(selected, index)) {
    void move(selected, index);
    return;
  }
  selected = selected === index ? null : index;
  if (selected !== null && !suggested.includes(selected)) suggested = [];
  const hadQiRisk = game.qi && board.querySelector('[data-qi-risk]');
  setHighlights();
  if (game.qi && board.querySelector('[data-qi-risk]')) message('带感叹号的交换会让市粮低于底线。');
  else if (hadQiRisk) message(qiRules);
}

function explainObstacle() {
  message(game.crown ? '令印不能交换。请在它的上下左右消除。'
    : game.council ? '案卷不能交换。请在它的上下左右消除。' : '路障不能交换。在它的上下左右消除棋子就能开路。');
}

function setTabStop(cell) {
  const current = board.querySelector('[tabindex="0"]');
  if (current) current.tabIndex = -1;
  cell.tabIndex = 0;
}

tiles = Array.from({ length: SIZE * SIZE }, (_, index) => {
  const cell = button('', 'cell', () => {
    if (performance.now() >= ignoreClicksUntil) select(index);
  });
  cell.dataset.index = index;
  cell.tabIndex = index ? -1 : 0;
  cell.append(tag('span', 'chip'));
  cell.addEventListener('focus', () => setTabStop(cell));
  return cell;
});
board.append(...tiles);

board.addEventListener('keydown', event => {
  const index = Number(event.target.dataset.index);
  const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -SIZE, ArrowDown: SIZE }[event.key];
  if (delta === undefined || !Number.isInteger(index)) return;
  event.preventDefault();
  const next = index + delta;
  if (tiles[next] && adjacent(index, next)) tiles[next].focus();
});

board.addEventListener('pointerdown', event => {
  const tile = event.target.closest('.cell');
  if (!tile || busy || !event.isPrimary || event.button !== 0) return;
  ignoreClicksUntil = 0;
  origin = { x: event.clientX, y: event.clientY, index: Number(tile.dataset.index), id: event.pointerId };
});

window.addEventListener('pointerup', event => {
  if (!origin || origin.id !== event.pointerId) return;
  const { x, y, index } = origin;
  origin = null;
  const dx = event.clientX - x;
  const dy = event.clientY - y;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 15) return;
  ignoreClicksUntil = performance.now() + 220;
  const next = index + (Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) : Math.sign(dy) * SIZE);
  if (tiles[next] && adjacent(index, next)) void move(index, next);
});

window.addEventListener('pointercancel', event => {
  if (origin?.id === event.pointerId) origin = null;
});

$('hint').addEventListener('click', () => {
  if (busy || phase !== 'game') return;
  if (game.qi) {
    const hint = qiHint(game);
    selected = null;
    suggested = hint ? [hint.a, hint.b] : [];
    setHighlights();
    message(hint ? '交换亮框棋子。这条走法可以保住所需市粮。'
      : '余步内已无法兼顾两项条件。可以尽量多核一些民籍。');
    return;
  }
  if (game.register) {
    const hint = registerHint(game);
    selected = null;
    suggested = hint ? [hint.a, hint.b] : [];
    setHighlights();
    message(hint ? '交换亮框棋子。若这一手只形成三连，可以给下一步四连腾位置。'
      : '余步已无法合齐两栏。还可以先拼好其中一栏。');
    return;
  }
  if (game.supply) {
    const hint = supplyHint(game);
    selected = null;
    suggested = hint ? [hint.a, hint.b] : [];
    setHighlights();
    message(hint ? '试试交换亮框棋子，再看还缺哪种物资。' : '余步已不够备齐，仍可先装手边的物资。');
    return;
  }
  if (game.flood) {
    const hint = floodHint(game);
    selected = null;
    suggested = hint ? [hint.a, hint.b] : [];
    setHighlights();
    message(hint ? '试试交换亮框棋子。清掉的水波越多，退水越多。'
      : '当前盘面余步不够让石阶全露出。仍可尽量压低水位。');
    return;
  }
  if (game.hall) {
    if (stage === 1 && !game.priority) {
      message('先在棋盘上方选定接应对象。');
      $('hall-order').querySelector('button').focus();
      return;
    }
    if (hallHintState !== game) {
      hallHintState = game;
      const name = HALL_NAMES[hallSide(firstHall, stage, game.priority)];
      const canAdvance = legalMoves(game.board).some(({ a, b }) => playMove(game, a, b).state.collected > stage);
      message((stage < 2 ? '任意有效交换都能推进选定的一侧。' : canAdvance ? '找能碰到' + name + '实线列的消除。' : name + '还在等，先给那一列腾个位置。') + '再点提示可查看交换位置。');
      return;
    }
    const hint = hallHint(game);
    selected = null;
    suggested = hint ? [hint.a, hint.b] : [];
    setHighlights();
    message(hint ? '交换亮框的两枚棋子。这手之后，看看帘后的两队人。'
      : '余下步数不够接齐两队。还可以为当前亮列推进一轮。');
    return;
  }
  if (game.returned) {
    const hint = returnHint(game);
    selected = null;
    suggested = hint ? [hint.a, hint.b] : [];
    setHighlights();
    message(hint ? '交换亮框棋子。标记固定在格子上，消到它，旧物才会露出来。'
      : '余下步数已找不齐三件，仍可先清到一件旧物。');
    return;
  }
  if (game.petition || game.handover) {
    const hint = game.handover ? handoverHint(game) : petitionHint(game);
    selected = null;
    suggested = hint ? [hint.a, hint.b] : [];
    setHighlights();
    if (game.handover) {
      message(hint ? '交换亮框棋子，留意两件物资下方能腾出哪些空格。' : '剩余步数已不够两车都运抵。仍可试着先送到一车。');
    } else {
      message(hint ? '交换亮框棋子，留意这一步能推进哪一卷。' : '剩余步数已不够核齐两卷。可以先收手边的简。');
    }
    return;
  }
  if (game.council || game.crown) {
    const hint = game.crown ? crownHint(game) : councilHint(game);
    selected = null;
    suggested = hint && !hint.charge ? [hint.a, hint.b] : [];
    setHighlights();
    if (hint?.charge) {
      $('charges').querySelector('[data-charge="' + hint.charge + '"]').focus({ preventScroll: true });
      message(game.crown ? '试试亮起的符牌，可以核清所覆盖的令印。' : '试试亮起的符牌。这一步可以推进核册。');
    } else {
      message(hint ? game.crown ? '试试交换亮框棋子，留意两处的剩余核验次数。' : '试试交换亮框棋子，给下一卷留出可用的符牌。'
        : game.crown ? '这盘剩下的步数已不够两处回令。可以先核完手边这一处。' : '这盘剩下的步数已不够核清三卷。仍可核到最后，结算后重试。');
    }
    return;
  }
  const { a, b, target, opens, charges } = suggestedMove();
  selected = null;
  suggested = [a, b];
  setHighlights();
  message(tacticsPreview && charges?.length ? '亮框这一步能开路并留下列符。' : game.road
    ? opens ? gateHitsRemaining(game) > 1 ? '交换亮框棋子，先让重门松开一半。' : '交换亮框里的两枚棋子，可以打开眼前的路。' : '交换亮框里的棋子，给路障旁腾出机会。'
    : target ? '交换亮框里的两枚棋子，可以收集遮蔽棋子。' : '交换亮框里的两枚棋子，让上面的棋子落下来。');
});

function tone(frequency, length, volume, delay = 0) {
  if (!sound || !audio || audio.state !== 'running') return;
  const time = audio.currentTime + delay;
  const oscillator = audio.createOscillator();
  const envelope = audio.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, time);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.64, time + length);
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(volume, time + 0.026);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + length);
  oscillator.connect(envelope).connect(audio.destination);
  oscillator.start(time);
  oscillator.stop(time + length);
}

function playRill() {
  if (!sound || audio?.state !== 'running') return;
  const noise = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
  const data = noise.getChannelData(0);
  let ripple = 0;
  for (let i = 0; i < data.length; i++) {
    ripple = 0.90 * ripple + 0.10 * (Math.random() * 2 - 1);
    data[i] = ripple * Math.sin(Math.PI * i / data.length) * 0.16;
  }
  const source = audio.createBufferSource();
  source.buffer = noise;
  source.connect(audio.destination);
  source.onended = () => source.disconnect();
  source.start();
}

function playFootsteps(volumes, firstDelay = 0) {
  if (!sound || !audio || audio.state !== 'running') return;
  if (!footstep) {
    footstep = audio.createBuffer(1, Math.ceil(audio.sampleRate * 0.14), audio.sampleRate);
    const samples = footstep.getChannelData(0);
    let muffled = 0;
    samples.forEach((_, index) => {
      muffled = 0.86 * muffled + 0.14 * (Math.random() * 2 - 1);
      const elapsed = index / samples.length;
      samples[index] = muffled * Math.sin(Math.PI * elapsed) * (1 - elapsed);
    });
  }
  volumes.forEach((volume, index) => {
    const source = audio.createBufferSource();
    const level = audio.createGain();
    source.buffer = footstep;
    level.gain.value = volume;
    source.connect(level).connect(audio.destination);
    source.start(audio.currentTime + firstDelay + index * 0.27);
  });
}

function soundRoad(segment) {
  if (segment === 1) {
    tone(92, 0.17, 0.020, 0.09);
    tone(136, 0.12, 0.014, 0.25);
  } else if (segment === 2) {
    tone(103, 0.28, 0.018, 0.10);
    tone(71, 0.16, 0.023, 0.34);
  } else {
    tone(112, 0.29, 0.019, 0.06);
    tone(154, 0.12, 0.014, 0.27);
  }
}

$('sound').addEventListener('click', async () => {
  sound = !sound;
  if (sound) {
    try {
      const AudioEngine = window.AudioContext || window.webkitAudioContext;
      audio ??= new AudioEngine();
      await audio.resume();
      tone(246, 0.16, 0.023);
    } catch {
      sound = false;
    }
  }
  $('sound').textContent = '声音：' + (sound ? '开' : '关');
  $('sound').setAttribute('aria-pressed', String(Boolean(sound)));
});

function showNotes(title, entries) {
  $('notes-title').textContent = title;
  $('notes-body').replaceChildren(...entries);
  if (!$('notes').open) $('notes').showModal();
}

function reviewEntries(card) {
  const entries = [tag('h3', '', card.kind), ...card.paragraphs.map(text => tag('p', '', text))];
  for (const [label, href] of card.sources ?? []) {
    const source = tag('a', '', label);
    source.href = href;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    const row = tag('p');
    row.append(source);
    entries.push(row);
  }
  return entries;
}

function showHistory() {
  if (['qiDesk','qinDesk'].includes(scene.dataset.world)) {
    showNotes('等下一封 · 史实与演绎',reviewEntries(act==='king' ? reportHistory : archiveHistory));
    return;
  }
  if (scene.dataset.world === 'zhao' || act === 'return' && sawReturnScene || act === 'yan' && handanResult?.sawTablet) {
    const cards = act === 'yan' ? [YAN_HISTORY,ZHAO_HISTORY] : act === 'return' ? [RETURN_HISTORY,ZHAO_HISTORY] : [ZHAO_HISTORY];
    showNotes('退回的信 · 史实与演绎', cards.flatMap(reviewEntries));
    return;
  }
  if (phase === 'other-history') {
    showNotes('故人之刃 · 史实与卷后异闻', reviewEntries(FRIEND_HISTORY));
    return;
  }
  if (act === 'emperor') {
    if (phase !== 'complete' && !['title','edict','closed'].includes(scene.dataset.storyBeat)) {
      showNotes('咸阳议号', [tag('p','','前221年，六国初并。群臣奉命议定尊号。')]);
    } else showNotes('始皇帝 · 史实与演绎', reviewEntries(EMPEROR_HISTORY));
    return;
  }
  if (act === 'qi') {
    showNotes('天下最后一国 · 史实与演绎', (qiResult?.letters?.length || letterState.read.length ? [QI_HISTORY,archiveHistory] : [QI_HISTORY]).flatMap(reviewEntries));
    return;
  }
  if (act === 'yan') {
    showNotes('燕代余烬 · 史实与演绎', reviewEntries(YAN_HISTORY));
    return;
  }
  if (act === 'chu') {
    showNotes('伐楚两策 · 史实与演绎', [...reviewEntries(CHU_HISTORY), ...(petitionResult?.sawField ? [tag('h3','','渠边物记'),tag('p','','那天，水只走到一畦。后来渠成，关中更多田地得灌。这辆粮车上的粮出自何田，已无从指认。')] : [])]);
    return;
  }
  if (act === 'flood') {
    showNotes('大梁之水 · 史实与演绎', reviewEntries(FLOOD_HISTORY));
    return;
  }
  if (act === 'friend') {
    showNotes('故人之刃 · 史实与演绎', reviewEntries(FRIEND_HISTORY));
    return;
  }
  if (act === 'return') {
    showNotes('邯郸旧梦 · 史实与演绎', reviewEntries(RETURN_HISTORY));
    return;
  }
  if (act === 'handover') {
    showNotes('第一国 · 史实与演绎', (petitionResult?.sawField ? [HANDOVER_HISTORY,canalHistory] : [HANDOVER_HISTORY]).flatMap(reviewEntries));
    return;
  }
  if (act === 'petition') {
    const entries = (sawField || scene.dataset.world === 'canal' ? [PETITION_HISTORY,canalHistory] : [PETITION_HISTORY]).flatMap(reviewEntries);
    const history = tag('details');
    history.append(tag('summary','','展开史书记载与章末演绎'), ...entries);
    showNotes('逐客与纳才 · 史实与演绎', [tag('p','','秦王政十年，秦下令逐客。书室里送进一封上书。'),history]);
    return;
  }
  if (act === 'crown') {
    showNotes('加冠之变 · 史实与演绎', reviewEntries(CROWN_HISTORY));
    return;
  }
  if (act === 'king') {
    showNotes('少年秦王 · 史实与演绎', reviewEntries(KING_HISTORY));
    return;
  }
  if (act === 'qin') {
    showNotes('西归秦关 · 史实与演绎', [
      ...reviewEntries(CHAPTER_REVIEW.history),
      ...reviewEntries({ kind: '秦王政继位', paragraphs: [QIN_SUCCESSION], sources: QIN_SUCCESSION_SOURCES }),
      tag('h3', '', '本章演绎'),
      tag('p', '', '此处父子相认的房间、对白、座席安排及石子的细节，来自本作创作。'),
      tag('p', '', '席间来人用木牍询问名字和来处，以及由谁作答的情节，来自本作创作。'),
      tag('p', '', '庄襄王去世后，赵氏和政回到这间旧屋、在父亲的空席前决定木牍去留，是本作演绎。'),
      ...reviewEntries({ kind: '美术取材',
        paragraphs: ['秦屋的木构、铜灯与木牍参考战国秦地的建筑和器物材料。屋内布局、袍服颜色和木牍墨迹是本作美术演绎。'],
        sources: [
          ['《陕西省志·建设志》秦雍城宫殿建筑', 'https://dfz.shaanxi.gov.cn/zslm/fzzlk/xbsxsz/szdylpdf/201404/P020240923623109161543.pdf'],
          ['河南博物院 · 跽坐人漆绘灯', 'https://www.chnmus.net/ch/collection/appraise/details.html?id=512154985453423215'],
          ['青川战国木牍', 'https://www.chinatax.gov.cn/chinatax/c103144/c5251333/content.html'],
        ] }),
    ]);
    return;
  }
  showNotes('史实与演绎', [
    ...reviewEntries(CHAPTER_REVIEW.history),
    ...reviewEntries(CHAPTER_REVIEW.drama),
  ]);
}

$('history').addEventListener('click', showHistory);
$('log').addEventListener('click', () => {
  showNotes('回看对白', logs.map(entry => {
    const row = tag('p', '');
    row.append(tag('strong', '', entry.speaker + '　'), document.createTextNode(entry.line));
    if (entry.action) row.append(tag('span', 'action', '（' + entry.action + '）'));
    return row;
  }));
});
$('restart-campaign').addEventListener('click', restartCampaign);
$('checkpoint-bar').hidden = !checkpointStore && !chuSampleStore && !canalStore && !letterStore && !crownStore && !floodStore;
mountReadingHeader({sample: preview !== null, recent: () => {
  if (compare) return compare.recent;
  const number = $('chapter-number').textContent;
  const dates = ['公元前 259 年起', '母子归秦后', KING_DATE, CROWN_DATE, PETITION_DATE, HANDOVER_DATE,
    RETURN_DATE, FRIEND_DATE, FLOOD_DATE, CHU_DATE, YAN_DATE, QI_DATE];
  const current = dates.findIndex((_, index) => chapterLabel(index + 1) === number);
  return journeyEntries().filter(entry => entry.chapter < (current < 0 ? 13 : current + 1)).slice(-2)
    .map(entry => ({when: dates[entry.chapter - 1], title: chapterLabel(entry.chapter) + '　' + entry.title,
      note: entry.choices.at(-1) || entry.consequence}));
}});
if ((preview === null && !checkpointStore.initial && !checkpointStore.previous()) || compare?.sample === 'birth') {
  document.title = '帝王传说 · 始皇篇';
  await openTitleScreen();
}
if (floodStore?.initial) {
  ({ result: floodResult, logs } = floodStore.initial.ninth);
  showFloodResult();
  checkpointStatus('已续玩 · 第九章结算');
} else if (crownStore?.initial) {
  resumeCrownSample(crownStore.initial);
  checkpointStatus('已续玩 · 冠礼之后独立试玩');
} else if (letterStore?.initial) {
  resumeLetterSample(letterStore.initial);
} else if (canalStore?.initial) {
  checkpointStatus('已续玩 · 韩国水工线');
  resumeCanalSample(canalStore.initial);
} else if (chuSampleStore?.initial) {
  resumeChuFold(chuSampleStore.initial.chuFold);
} else if (checkpointStore?.initial) {
  restoreCheckpoint(checkpointStore.initial);
} else {
  start();
  if (floodStore) checkpointStatus(floodStore.status === 'unavailable' ? '本浏览器暂时无法保存进度' : '独立试玩 · 大梁街口至楚营', floodStore.status === 'unavailable');
  if (crownStore) checkpointStatus(crownStore.status === 'unavailable' ? '本浏览器暂时无法保存进度' : '冠礼之后 · 第四章至第五章独立试玩', crownStore.status === 'unavailable');
  if (chuSampleStore) checkpointStatus(chuSampleStore.status === 'unavailable' ? '本浏览器暂时无法保存试玩进度' : '独立试玩 · 从首车离营起分折保存', chuSampleStore.status === 'unavailable');
  if (checkpointStore) {
    const messages = {
      empty: saveHint,
      invalid: '旧进度无法读取，本次将从第一章开始。',
      unavailable: '此浏览器暂时无法保存进度，仍可试玩。',
    };
    checkpointStatus(messages[checkpointStore.status], ['invalid','unavailable'].includes(checkpointStore.status));
    const previous = checkpointStore.previous();
    if (previous) {
      const importButton = button('接续 0.26.0 · ' + chapterLabel(previous.chapters.length), 'action-button', () => {
        const result = checkpointStore.save(previous);
        if (result !== 'saved') { reportSaveFailure(result); return; }
        savedChapter = previous.chapters.length;
        restoreCheckpoint(previous);
      });
      content.querySelector('.actions').append(importButton);
    }
  }
}

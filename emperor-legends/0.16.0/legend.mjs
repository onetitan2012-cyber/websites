import { CROWN_HITS, HALL_GOAL, PETITION_TARGET, QI_GOAL, ROAD_GOAL, SIZE } from './board.mjs';
import { CHOICES } from './chapter.mjs';
import { ROUTES } from './story.mjs';
import { QIN_RESPONSES } from './qin-opening.mjs';
import { QIN_REGISTER_RESPONSES } from './qin-register.mjs';
import { QIN_CLOSING_REPLIES } from './qin-closing.mjs';
import { KING_ORDERS } from './king.mjs';
import { CROWN_NAMES, CROWN_RESPONSES } from './crown.mjs';
import { PETITION_NAMES, PETITION_ORDERS, PETITION_READINGS } from './petition.mjs';
import { CARGO_NAMES, HANDOVER_ORDERS, HANDOVER_ROUTES } from './handover.mjs';
import { RELIC_NAMES, RETURN_ORDERS } from './handan-return.mjs';
import { FRIEND_ORDERS, HALL_NAMES } from './old-friend.mjs';
import { FLOOD_ORDERS } from './daliang.mjs';
import { CHU_ORDERS } from './chu-supplies.mjs';
import { YAN_ORDERS } from './yan-dai.mjs';
import { QI_ORDERS } from './qi.mjs';

const shelter = { family_route: ROUTES.family.title, wait_route: ROUTES.wait.title };
const routeOption = (key, value) => CHOICES[key].options.find(option => option.value === value)?.text;
const parts = (names, describe) => names.map((name, index) => name + describe(index)).join('，');

export function buildLegend({
  journey, kingResult: king, crownResult: crown, petitionResult: petition, handoverResult: handover,
  handanResult: handan, friendResult: friend, floodResult: flood, chuResult: chu, yanResult: yan, qiResult: qi,
}) {
  const entries = [];
  function add(chapter, title, choices, consequence, outcome = '') {
    entries.push({ chapter, title, choices: choices.filter(Boolean), consequence, outcome });
  }

  if (journey.c1 || journey.c2 || journey.c3) {
    const outcomes = [
      journey.g1 === 'assisted' ? '田伯帮忙收拾，母子藏进旧院' : journey.g1 === 'clear' ? '母子亲手做好藏身准备' : '',
      journey.g2 === 'assisted' ? '等人群散开才走通巷口' : journey.g2 === 'clear' ? '政带母亲走过三段路' : '',
    ].filter(Boolean);
    add(1, '邯郸孤子', [shelter[journey.c1], routeOption('c2', journey.c2), routeOption('c3', journey.c3)],
      '', outcomes.length ? outcomes.join('；') + '。' : '');
  }

  if (journey.q1 || journey.q2 || journey.q3) {
    const greeting = QIN_RESPONSES[journey.q1];
    const register = QIN_REGISTER_RESPONSES[journey.q2];
    const tablet = QIN_CLOSING_REPLIES[journey.q3];
    add(2, '西归秦关', [greeting?.title, register?.title, tablet?.title],
      [register?.ending, tablet?.ending].filter(Boolean).join(''));
  }

  if (king) {
    const order = KING_ORDERS[king.key];
    add(3, '少年秦王', [order?.title], order?.note ?? '留案待核，发粮暂缓。',
      `查核 ${king.collected} / ${ROAD_GOAL} 卷。`);
  }
  if (crown) {
    const response = CROWN_RESPONSES[crown.key];
    add(4, '加冠之变', [response?.title], response?.lines[0].note ?? '迟到的回令转为当面复核。',
      parts(CROWN_NAMES, index => crown.marks[index] === CROWN_HITS ? '已回令' : '待复核') + '。');
  }
  if (petition) {
    const order = PETITION_ORDERS[petition.key];
    add(5, '逐客与纳才', [PETITION_READINGS[petition.firstReview].title, order.title], order.ending,
      parts(PETITION_NAMES, index => `核过 ${petition.evidence[index]} / ${PETITION_TARGET} 条`)
        + (petition.assisted ? '，余下交文书补核。' : '。'));
  }
  if (handover) {
    const order = HANDOVER_ORDERS[handover.key];
    add(6, '第一国', [HANDOVER_ROUTES[handover.firstCargo].title, order.title], order.ending,
      parts(CARGO_NAMES, index => handover.cargo[index] === SIZE - 1 ? '已运抵' : '次日再送') + '。');
  }
  if (handan) {
    const order = RETURN_ORDERS[handan.key];
    add(7, '邯郸旧梦', [order.title], order.ending,
      parts(RELIC_NAMES, index => handan.found[index] ? '已找到' : '天亮再找') + '。');
  }
  if (friend) {
    const order = FRIEND_ORDERS[friend.key];
    add(8, '故人之刃', [`先点亮${HALL_NAMES[friend.firstHall]}的灯`, order.title], order.ending,
      `${friend.progress.filter(count => count === HALL_GOAL / HALL_NAMES.length).length} / ${HALL_NAMES.length} 队宫人已接出`
        + (friend.assisted ? '，余下由值守接应。' : '。'));
  }
  if (flood) {
    const order = FLOOD_ORDERS[flood.key];
    add(9, '大梁之水', [order.title], order.ending,
      `水位 ${flood.water} 格，${flood.assisted ? '木排暂留原处' : '木排已靠阶'}。`);
  }
  if (chu) {
    const order = CHU_ORDERS[chu.key];
    add(10, '伐楚两策', [order.title], order.ending,
      `李信行前备粮 ${chu.swift.grain} / 8 份${chu.swift.assisted ? '，缺额记下' : ''}；王翦库场装好 ${chu.batches} / 2 批`
        + (chu.assisted ? '，缺项由后班补齐。' : '。'));
  }
  if (yan) {
    const order = YAN_ORDERS[yan.key];
    add(11, '燕代余烬', [order.title], order.ending,
      `合简 ${yan.bound.filter(Boolean).length} / ${yan.bound.length} 栏`
        + (yan.assisted ? '，未合处留待复核。' : '。'));
  }
  if (qi) {
    const order = QI_ORDERS[qi.key];
    add(12, '天下最后一国', [order.title], order.ending,
      `核过民籍 ${qi.entries} / ${QI_GOAL} 条，市粮实留 ${qi.grain} 份`
        + (qi.assisted ? '，余项留待复核。' : '。'));
  }
  return entries;
}

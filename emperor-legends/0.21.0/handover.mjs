export const HANDOVER_DATE = '秦王政十七年 · 前230年';
export const HANDOVER_PLACE = '新郑 · 府库街口';
export const HANDOVER_CASE = '两车交接';
export const CARGO_NAMES = ['府库封签', '里巷粮筹'];
export const CARGO_ARRIVED = ['封签送达，府库开门对账。', '粮筹送达，粮袋卸到里巷席上。'];

export const HANDOVER_ROUTES = [
  { title: '先发府库封签', note: '左边的封签车先行，右边的粮车还在后头。' },
  { title: '先发里巷粮筹', note: '右边的粮车先行，左边的封签车还在后头。' },
];

export function handoverOpening(previousOrder) {
  return [
    { speaker: '叙事', line: '秦王政十七年，内史腾攻韩，韩王安被俘。秦将韩地置为颍川郡。',
      beat: 'arrival', note: '战事已毕。新郑街口，旧日的府库和里巷还等着交接。' },
    { speaker: '秦使', line: previousOrder === 'recall'
      ? '当年逐客令撤下时，李斯先回到案前。今日换了主事的人，这份旧账也得从识得它的人手里接。'
      : previousOrder === 'dispatch'
        ? '当年停逐客的文书先送到了关口。今日新郑换了主事的人，也要让城里先知道何处还能照常领粮。'
        : '颍川已有新令。封签要送到府库，粮筹要送到里巷。两边都到，账和粮才能对起来。',
      beat: 'briefing', note: '左边是府库，右边是等粮的里巷。' },
    { speaker: '韩籍库吏', line: '我能认出这些户名。库门清点时，我留在这里。右边那些等粮的人，也得有个准信。' },
  ];
}

export function handoverOutcome(assisted, delivered) {
  if (!assisted) return [
    { speaker: '韩籍库吏', line: '府库开了，里巷也收到粮。旧册上的实数我都认，交接时还得拿它对一遍。' },
    { speaker: '里人', line: '原来那册上有我母亲的名字。换哪国的印，眼下我只想知道她还能领多少。' },
  ];
  return [
    { speaker: '韩籍库吏', line: delivered
      ? '到的一车先记在册上。另一车要等到明日再送，今夜仍找原来值守的人。'
      : '两车都没能赶到。名册先封存，明早由熟路的人领着，重新送这一趟。',
      beat: 'pending', note: '已经运到的照常交接，未到的物资留待次日。' },
    { speaker: '里人', line: '那就先告诉我们，今夜到哪里领粮。街东还有人在等。' },
  ];
}

export const HANDOVER_ORDERS = {
  keeper: {
    title: '请原来的库吏留下对账',
    line: '我把旧册摊开。先对库里实有多少，再写下交到谁手里。',
    speaker: '韩籍库吏',
    note: '原来的库吏带着旧册走到秦使案前。',
    ending: '旧库吏和新任书佐共同清点实存，交割结果留在旧册旁。',
  },
  notice: {
    title: '先给里人报明领粮安排',
    line: '我去沿街传话。今日开到哪一处、哪一处要等明日，都说清楚。',
    speaker: '里人',
    note: '里人走出街口，把领粮的安排带回巷里。',
    ending: '里人带着消息回巷，等候的人知道了领粮地点和日期。',
  },
};

export const HANDOVER_ANCHOR = '《史记》记载，秦灭韩、俘韩王安，以韩地置颍川郡。';
export const HANDOVER_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《史记·秦始皇本纪》载，秦王政十七年（前230年），内史腾攻韩，得韩王安，以韩地为颍川郡。',
    '秦使、韩籍库吏和里人为本章虚构角色。封签粮筹、先后次序、延期与交接对白属于演绎，场景表现的是战后的接收难题。',
    '新郑场景参考郑韩故城的层夯城墙与夯土遗址。府库、街巷及各处的相对布局按游戏视野设计。',
  ],
  sources: [
    ['《史记·秦始皇本纪》', 'https://cn.jic.io/topic/shiji/006'],
    ['郑州市文物局 · 郑韩故城', 'https://wwj.zhengzhou.gov.cn/country/3176064.jhtml'],
  ],
};

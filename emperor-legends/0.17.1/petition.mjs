export const PETITION_PLACE = '秦廷 · 书室';
export const PETITION_DATE = '秦王政十年';
export const PETITION_CASE = '两卷证据';
export const PETITION_NAMES = ['用客旧例', '待遣名籍'];

export const PETITION_READINGS = [
  { title: '先查秦国用客的旧例', note: '文书先展左边的旧例，核过其中一条。' },
  { title: '先看谁在待遣名籍上', note: '文书先展右边的名籍，核过其中一条。' },
];

export function petitionOpening(crownChoice) {
  const echoes = {
    mother: '上次，政先听当事人说。这一次，待遣的人也有一封书。',
    clerk: '上次，政先核两处的记录。这一次，案上也有两卷要比。',
    delayed: '雍城的旧案已收。书室里，待遣的名籍又摆上了案。',
  };
  return [
    { speaker: '叙事', line: '秦王政十年，秦下令逐客。楚人李斯也在被逐之列，便上书进谏。',
      beat: 'edict', note: echoes[crownChoice] ?? '逐客的文书还在案上，李斯的上书送进书室。' },
    { speaker: '文书', line: '李斯说，秦从前正是用了别国的人，才有今日。可逐客名籍已经送到门下。', beat: 'read',
      note: '左边是过去的用客旧例，右边是眼下的待遣名籍。' },
    { speaker: '政', line: '先把两卷拿来。过去是怎么用人的，今日又要赶走谁？我都要看清。' },
  ];
}

export const PETITION_COMPLETE_NOTES = [
  '旧例核齐。李斯所举的商鞅等人来自秦外，曾受秦国任用。',
  '名籍核齐。名单上的人一旦离秦，他们的才干也可能为别国所用。',
];

export const PETITION_VERIFIED = [
  { speaker: '文书', line: '旧例和名籍都核过了。过去靠客卿做成的事，今日名籍上的人也还在做。' },
  { speaker: '政', line: '李斯这封书说得有理。逐客令当停，已经发下去的文书也得收回来。' },
];

export const PETITION_ASSISTED = [
  { speaker: '文书', line: '这两卷还没有全核完。已查到的先留在案上，余下的由我再对。', beat: 'pending',
    note: '未核完的简册保留在原来的位置。' },
  { speaker: '政', line: '按李斯书里的话，先停逐客。查到谁已经出城，再分别去请回来。' },
];

export const PETITION_ORDERS = {
  dispatch: {
    title: '先把停令送到关口',
    lines: [
      { speaker: '政', line: '先送回令，让关口停止送客。已经办了多少，逐条回报。', beat: 'dispatch',
        note: '传令官带着新的木牍离开书室，先往关口。' },
      { speaker: '传令官', line: '臣这就送去。名籍留在案上，回头逐一对照。' },
    ],
    ending: '停令先送至关口。文书留着名籍，等关口回报已遣出的人。',
  },
  recall: {
    title: '先召李斯回到案前',
    lines: [
      { speaker: '政', line: '先请李斯回来。停令一并发出，名籍上的人请他和文书一同核对。', beat: 'recall',
        note: '李斯回到案前，和文书一道看待遣名籍。' },
      { speaker: '李斯', line: '臣愿同他们一条条核对。先把已经离秦的人找出来。' },
    ],
    ending: '李斯先回到案前。待遣名籍由他和文书复核，停令同时传出。',
  },
};

export const PETITION_ANCHOR = '《史记》记载，秦王撤销逐客令，恢复李斯的官职。';

export const PETITION_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《史记·秦始皇本纪》在秦王政十年记载吕不韦免相，以及秦国逐客、李斯上书后止令。《李斯列传》也记载秦王恢复了李斯的官职。',
    '旧例中的商鞅等人、逐客可能让别国获益，都来自李斯上书的论证。游戏里的两卷案头查证、待遣名籍细节、传令先后与对白属于演绎。',
    '书室与袍服采用战国风格化造型，青川出土秦木牍作为文书材质参考。简册上的墨迹为笔画示意。',
  ],
  sources: [
    ['《史记·李斯列传》', 'https://www.shidianguji.com/book/HY2905/chapter/1kvmkn4p422a1'],
    ['《史记·秦始皇本纪》', 'https://cn.jic.io/topic/shiji/006'],
    ['青川郝家坪墓地与秦木牍', 'https://www.sckg.com/shangzhou/1579.html'],
  ],
};

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
    mother: '上回，政让当事人先说完。今日案前也留着陈言的位置。',
    clerk: '上次，政先核两处的记录。这一次，案上也有两卷要比。',
    delayed: '雍城的旧案已收。书室里，待遣的名籍又摆上了案。',
  };
  return [
    { speaker: '叙事', line: '秦王政十年，秦下令逐客。有人赶在逐客文书送到门下时，递进一封上书。',
      beat: 'edict', note: echoes[crownChoice] ?? '逐客的文书还在案上，一封上书送进书室。' },
    { speaker: '文书', line: '劳烦把玉挪一挪，我好把这头铺平。', beat: 'jade', note: '简上露着「昆山之玉」四个字，简尾还压在玉下。' },
  ];
}

export const PETITION_COMPLETE_NOTES = [
  '旧例核齐。商鞅等人来自秦外，曾受秦国任用。',
  '名籍核齐。名单上的人一旦离秦，他们的才干也可能为别国所用。',
];

export function rosterVisible(count, openedByClerk = false) {
  return count >= 2 || openedByClerk;
}

export const PETITION_DECISION = [
  { speaker:'政', line:'这封书我还没答。他自己倒要先出关了？', beat:'answer', note:'政抬起头，望向门下。' },
  { speaker:'政', line:'把逐客令收回来。', beat:'stop', note:'文书取来传令的木牍。' },
];

export const NAME_ORDERS = {
  recall: {
    title:'先召李斯回到案前',
    lines:[
      {speaker:'李斯',line:'还要臣报来处吗？',beat:'lisi-door',note:'文书从席边起身。李斯仍站在门口。'},
      {speaker:'政',line:'进来。你认得这册里的人，替我看一眼，谁已经走了？',beat:'lisi-seat',note:'李斯走到让出的位置，俯身坐下。'},
      {speaker:'李斯',line:'此人今早还在。先遣人去关门问，别把他记成已经出关。',beat:'lisi-point',note:'李斯的手越过自己的名字，停在下一行。'},
    ],
    ending:'李斯先回到案前。他指着自己名字的下一行，请人去问那人走到哪儿了。',
  },
  dispatch: {
    title:'先把停令送到关口',
    lines:[
      {speaker:'守吏',line:'这道令收回了。你的行李可以放下了。',beat:'gate-order',note:'守吏搁笔，叫住提着白布包袱的客士。'},
      {speaker:'客士',line:'我还能回昨夜住的地方？',beat:'gate-turn',note:'客士收回迈向门外的脚，转身等他答。'},
      {speaker:'守吏',line:'能。你还在关内，我就照实回。',beat:'gate-rest',note:'客士把行李放在城内这一侧，揉了揉被提手勒过的掌心。'},
    ],
    ending:'关口先收到停令。那名客士松开白布提手，把包袱放在了关内。',
  },
};
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
    '旧例中的商鞅等人、逐客可能让别国获益，都来自李斯上书的论证。玉压简尾、两处署名的写法、关口客士与白布包袱皆为演绎。游戏里的两卷案头查证、待遣名籍细节、传令先后与对白属于演绎。',
    '书室与袍服采用战国风格化造型，青川出土秦木牍作为文书材质参考。简册上的墨迹为笔画示意。',
  ],
  sources: [
    ['《史记·李斯列传》', 'https://www.shidianguji.com/book/HY2905/chapter/1kvmkn4p422a1'],
    ['《史记·秦始皇本纪》', 'https://cn.jic.io/topic/shiji/006'],
    ['青川郝家坪墓地与秦木牍', 'https://www.sckg.com/shangzhou/1579.html'],
  ],
};

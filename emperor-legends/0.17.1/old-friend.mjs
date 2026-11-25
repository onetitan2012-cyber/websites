export const FRIEND_DATE = '秦王政二十年 · 前227年';
export const FRIEND_PLACE = '咸阳 · 秦廷回廊';
export const YAN_PLACE = '燕国 · 驿舍';
export const HALL_CASE = '两廊接引';
export const HALL_NAMES = ['左廊', '右廊'];

export function hallOrderText(first, priority) {
  if (priority === 'lead') return '先接' + HALL_NAMES[first] + '出帘';
  if (priority === 'share') return '先给' + HALL_NAMES[1 - first] + '传灯';
  return '';
}

export function stoneEcho(answer) {
  if (answer === 'born_here') return { speaker: '记忆中的丹', line: '那你该认得很多路。' };
  if (answer === 'father_qin') return { speaker: '记忆中的丹', line: '哦。那你呢？' };
  return { speaker: '政', line: '小时候，丹挑了最圆的一颗给我。' };
}

export function friendOpening(precedingOrder) {
  const memory = precedingOrder === 'record' ? '在邯郸，旧册上还有没音信的人。先别拿空着的位置当作无人。'
    : precedingOrder === 'open' ? '在邯郸，开了院门才有人敢回来。叫他们认得回廊里亮的是哪盏灯。'
      : '逐个应声。有人没回来，就给他留着地方，别让队伍散了。';
  return [
    { speaker: '叙事', line: '赵亡之后，燕国担心秦军继续北进。燕太子丹把荆轲请来。',
      beat: 'yan', note: '一盏小灯还亮着。燕国的消息从边地传来。' },
    { speaker: '丹', line: '这几天，来的人都问我，秦军到哪儿了。' },
    { speaker: '叙事', line: '咸阳。燕使呈上督亢的地图。秦王将图徐徐展开。', beat: 'map', note: '卷尾展尽，殿上的人忽然向后让开。' },
    { speaker: '叙事', line: '荆轲刺秦未成。秦王无恙，荆轲死于秦廷。', beat: 'aftermath', note: '脚步声渐远。殿后的两道帘，还没有人敢掀。' },
    { speaker: '左廊宫人', line: '那边看得见我么？', beat: 'curtain', note: '一只手扶着左帘。右边有人应声：「我在这儿。」' },
    { speaker: '内侍', line: '等灯亮了，你就朝我走。', beat: 'waiting', note: '隔着过道，两廊各有人在等灯。' },
    { speaker: '政', line: memory },
  ];
}

export function hallOutcome(assisted, counts, answer) {
  const met = HALL_NAMES.filter((_, index) => counts[index] === 2);
  return [
    { speaker: '内侍', line: assisted
      ? met.length ? met.join('、') + '的人已经回来。余下的人还在帘后，由值守的人再去接。'
        : '两队人还没有接回来。已亮的灯留着，余下由值守的人再去接。'
      : '两队宫人都到外廊了。我让他们先坐下，有人还在发抖。' },
    { speaker: '书佐', line: '王上，今日的事，要写进简里了。', beat: 'stone', note: '政的拇指在圆石上一拨。它转了半圈，停在案边。' },
    { ...stoneEcho(answer), beat: 'echo', note: '书佐悬着笔，等秦王开口。' },
  ];
}

export const FRIEND_ORDERS = {
  record: {
    title: '先把丹的名字照实记下',
    lines: [
      { speaker: '政', line: '写燕太子丹。另起一行，写荆轲。', beat: 'record',
        note: '书佐在案前展开木简，圆石还搁在原处。' },
      { speaker: '书佐', line: '臣把两个人的名字分开记。' },
    ],
    ending: '事发经过留在新简上。秦王起身时，圆石还在案边。',
  },
  keep: {
    title: '先把当年的圆石收好',
    lines: [
      { speaker: '政', line: '这一件，我自己收。你记今日殿上的事。', beat: 'keep',
        note: '案上木匣合上，圆石收在匣中。' },
      { speaker: '书佐', line: '臣明白。册里只写今日所见。' },
    ],
    ending: '圆石留在木匣里，书佐另记今日经过。',
  },
};

export const FRIEND_ANCHOR = '《史记》记载，燕太子丹遣荆轲行刺秦王，事未成。';
export const FRIEND_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《史记·秦始皇本纪》记载，秦王政二十年（前227年），燕太子丹因惧秦兵至燕，遣荆轲刺秦王，事未成。燕太子丹在此次事变时仍在燕国，次年发生的燕都失守和丹之死属于后续事件。',
    '《刺客列传》写秦王展图，也记丹与政少时相善。两人在邯郸如何交往、圆石、燕国驿舍对白、事后接引和如何写入册中，都是本作演绎。',
  ],
  sources: [
    ['《史记·秦始皇本纪》', 'https://cn.jic.io/topic/shiji/006'],
    ['《史记·刺客列传》', 'https://www.shidianguji.com/book/HY2905/chapter/1kvmkn1rxsaat'],
  ],
};

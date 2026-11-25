export const FRIEND_DATE = '秦王政二十年 · 前227年';
export const FRIEND_PLACE = '咸阳 · 秦廷回廊';
export const YAN_PLACE = '燕国 · 驿舍';
export const HALL_CASE = '两廊接引';
export const HALL_NAMES = ['左廊', '右廊'];

export function friendOpening(answers, precedingOrder) {
  const stone = answers.c2 === 'born_here' ? '在邯郸，我说自己生在那里。丹蹲下来，把那颗最圆的石子推给我。'
    : answers.c2 === 'father_qin' ? '在邯郸，我说父亲是秦人。丹听完，把最圆的石子推给我。'
      : '那时丹和我都还小。他从地上挑出一颗圆石，推到我面前。';
  const memory = precedingOrder === 'record' ? '在邯郸，旧册上还有没音信的人。先别拿空着的位置当作无人。'
    : precedingOrder === 'open' ? '在邯郸，开了院门才有人敢回来。叫他们认得回廊里亮的是哪盏灯。'
      : '逐个应声。有人没回来，就给他留着地方，别让队伍散了。';
  return [
    { speaker: '叙事', line: '赵亡之后，燕国担心秦军继续北进。燕太子丹把荆轲请来。',
      beat: 'yan', note: '一盏小灯还亮着。燕国的消息从边地传来。' },
    { speaker: '丹', line: '我在邯郸认得他。可今天，赵已经亡了，燕人问我秦军几时会到。' },
    { speaker: '荆轲', line: '我听见的是燕人的问话。你认得那个人的旧事，也留在燕国吧。' },
    { speaker: '政', line: stone, beat: 'stone', note: '秦王案上，搁着一颗从邯郸带来的圆石。' },
    { speaker: '叙事', line: '秦王政二十年，荆轲在秦廷行刺，未能得手。秦王无恙，荆轲死于秦廷。',
      beat: 'aftermath', note: '变故之后，回廊里两盏引路灯都灭了。' },
    { speaker: '内侍', line: '两廊里还有两队宫人未回来。先轮流点灯叫他们看见，再轮流掀开帘，把人接出。' },
    { speaker: '政', line: memory },
  ];
}

export function hallOutcome(assisted, counts) {
  const met = HALL_NAMES.filter((_, index) => counts[index] === 2);
  return [
    { speaker: '内侍', line: assisted
      ? met.length ? met.join('、') + '的人已经回来。余下的人还在帘后，由值守的人再去接。'
        : '两队人还没有接回来。已亮的灯留着，余下由值守的人再去接。'
      : '两队宫人都到外廊了。我让他们先坐下，有人还在发抖。' },
    { speaker: '书佐', line: '事发经过要入册。案上还有王从邯郸带回的那颗石头。' },
  ];
}

export const FRIEND_ORDERS = {
  record: {
    title: '先把丹的名字照实记下',
    lines: [
      { speaker: '政', line: '写燕太子丹，也把荆轲的名字写清。今日的事，自有今日的案。', beat: 'record',
        note: '书佐在案前展开木简，圆石还搁在原处。' },
      { speaker: '书佐', line: '臣把两个人的名字分开记。' },
    ],
    ending: '事发经过留在新简上。秦王起身时，圆石还在案边。',
  },
  keep: {
    title: '先把当年的圆石收好',
    lines: [
      { speaker: '政', line: '把石子先收好。今日的事，你只按自己见到的记。', beat: 'keep',
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
    '《刺客列传》记载丹与秦王少时相善。两人在邯郸如何交往、圆石、燕国驿舍对白、事后接引和如何写入册中，都是本作演绎。',
  ],
  sources: [
    ['《史记·秦始皇本纪》', 'https://cn.jic.io/topic/shiji/006'],
    ['《史记·刺客列传》', 'https://www.shidianguji.com/book/HY2905/chapter/1kvmkn1rxsaat'],
  ],
};

export const QIN_CLOSING_DATE = '庄襄王三年';
export const QIN_SUCCESSION = '秦庄襄王去世，政继位为秦王。《史记》记载，他当时十三岁。';
export const QIN_SUCCESSION_SOURCES = [
  ['《史记·秦本纪》', 'https://ctext.org/shiji/qin-ben-ji/zhs'],
  ['《史记·秦始皇本纪》', 'https://ctext.org/shiji/qin-shi-huang-ben-ji/zhs'],
];

const ORIGIN_MEMORIES = {
  child: '你那天自己报了名字，说你从邯郸来。这块木牍还在这里。',
  mother: '那天你请我来说。我说，我们从邯郸来。你父亲让他们这么记下。',
};

export function qinClosingOpening(registerReply) {
  return [
    { speaker: '赵氏', line: '你父亲走了。外面的人在等你。', beat: 'closing-empty', note: '几年后，母子又回到那间屋子。子楚的席位空着。' },
    { speaker: '赵氏', line: ORIGIN_MEMORIES[registerReply] ?? '你刚归秦那年，他们把你的名字和来处记在这块木牍上。',
      beat: 'closing-item', note: '写着政的名字与来处的木牍，还放在子楚的席前。' },
  ];
}

export const QIN_CLOSING_REPLIES = {
  carry: {
    title: '带走木牍',
    lines: [
      { speaker: '政', line: '我带着它。若有人再问，我还是这样答。', beat: 'closing-carry', note: '政伸手拿起木牍，将它收在臂弯里。' },
      { speaker: '赵氏', line: '好。你走在前面。' },
    ],
    exit: 'closing-exit-carry',
    ending: '政带上记着邯郸的木牍，走向门外。',
  },
  leave: {
    title: '把木牍留在父亲的席前',
    lines: [
      { speaker: '政', line: '就让它留在这儿吧。我记得上面写了什么。', beat: 'closing-leave', note: '政望着父亲的空席。木牍仍放在席前。' },
      { speaker: '赵氏', line: '好。你走在前面。' },
    ],
    exit: 'closing-exit-leave',
    ending: '政走向门外，把木牍留在父亲的席前。',
  },
};

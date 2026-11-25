const TABLE_REPLIES = {
  father: { speaker: '子楚', line: '那扇侧门响得很。人在屋里，一听就知道有人来了。' },
  mother: { speaker: '赵氏', line: '那时候你在院里玩，我就在门边等你。' },
};

export function qinRegisterOpening(firstReply) {
  return [
    {
      ...(TABLE_REPLIES[firstReply] ?? { speaker: '子楚', line: '饭还热，再吃两口。' }),
      beat: 'register-table',
      note: '门外响起脚步。',
    },
    {
      speaker: '管事',
      line: '孩子住的屋子已备好了。这枚木牍要记他的名字和来处。该怎么写？',
      beat: 'register-arrival',
      note: '来人走到席边，手里托着一枚木牍。',
    },
  ];
}

export const QIN_REGISTER_RESPONSES = {
  child: {
    title: '自己说出从哪儿来',
    lines: [
      { speaker: '政', line: '我叫政。我从邯郸来。', beat: 'register-child', note: '来人把木牍转向政，等他说完。' },
      { speaker: '子楚', line: '听见了？就照他说的写。' },
    ],
    ending: '政自己报了名字和来处。子楚让来人照他的原话写下。',
  },
  mother: {
    title: '请母亲说出两人的来处',
    lines: [
      { speaker: '政', line: '娘，你和我一起来的。你来说。', beat: 'register-mother', note: '来人转向赵氏，把木牍递到她面前。' },
      { speaker: '赵氏', line: '他叫政。我们从邯郸来。' },
      { speaker: '子楚', line: '照她说的写。' },
    ],
    ending: '政请母亲开口。赵氏替他说了名字，也说了两人共同的来处。',
  },
};

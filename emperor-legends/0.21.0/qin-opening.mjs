export const QIN_PLACE = '秦国 · 子楚居处';

const MEMORY_LINES = {
  born_here: '走了很久，最后就看不见城门了。',
  father_qin: '娘说，走到这边就能见到您。',
};

export function qinGreeting(identity) {
  return [
    {
      speaker: '赵氏',
      line: '政，这是你父亲。',
      beat: 'threshold',
      note: '政随母亲跨过门槛，手停在袖口。',
    },
    {
      speaker: '子楚',
      line: '路上累了吧？',
      beat: 'greeting',
      note: '子楚迎上前，停在席边。',
    },
    {
      speaker: '政',
      line: MEMORY_LINES[identity] ?? '走了很久。',
      note: '他抬头，看了子楚一眼。',
    },
  ];
}

export const QIN_RESPONSES = {
  father: {
    title: '先叫一声父亲',
    lines: [
      { speaker: '政', line: '……父亲。' },
      { speaker: '子楚', line: '在。来，坐这儿。', beat: 'offer-son', note: '子楚向旁挪了一步，腾出身边的位置。' },
    ],
    table: [
      { speaker: '政', line: '父亲从前在邯郸，也住过有侧门的院子吗？', beat: 'seated', note: '三人坐定，政先问起邯郸。' },
      { speaker: '子楚', line: '住过。那扇门一推就响。' },
    ],
  },
  mother: {
    title: '先问母亲坐哪里',
    lines: [
      { speaker: '政', line: '我娘坐哪儿？' },
      { speaker: '子楚', line: '坐这边，一起吃。', beat: 'offer-mother', note: '子楚把席前的木盘移开，请赵氏留下。' },
    ],
    table: [
      { speaker: '赵氏', line: '在邯郸，他也总问我坐在哪里。', beat: 'seated', note: '三人坐定，赵氏先提起邯郸。' },
      { speaker: '政', line: '在旧院里，我一转头就能看见娘。' },
    ],
  },
};

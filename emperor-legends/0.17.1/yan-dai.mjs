export const YAN_DATE = '秦王政二十五年 · 前222年';
export const YAN_FERRY = '燕地 · 渡亭';
export const YAN_STUDY = '咸阳 · 书案';
export const REGISTER_CASE = '拼接散简';
export const REGISTER_NAMES = ['姓名', '来处'];
export const REGISTER_NOTES = [
  '姓名简横向并齐。被隔开的名字能接着读了。',
  '来处简纵向接拢。失散的人可以按旧里查找。',
];

export function yanOpening(journey, friendOrder, chuOrder) {
  const memory = journey.c2 === 'born_here' ? '我当年说自己生在邯郸。丹听了，给我挑了一颗最圆的石子。'
    : journey.c2 === 'father_qin' ? '我当年说父亲是秦人。丹把石子推给我时，只问我要走哪边。'
      : '丹当年把这颗石子推给我。他说，先把岔路摆出来，再看看要走哪一边。';
  const fromChu = chuOrder === 'reserve' ? '楚地营口给未归的人留了粮布。这里也留着干席，先让渡口的人坐一坐。'
    : chuOrder === 'list' ? '楚地归乡的名册还有空行。现在又送来这些散简，也有名字要等人来认。'
      : '这批散简是渡口的人送来的。姓名和原籍都得接上，否则天亮就认不出哪家找的是谁。';
  const stoneNote = friendOrder === 'keep' ? '木匣重新打开，圆石还在里面。'
    : '案边是当年从邯郸带回的圆石。';
  return [
    { speaker: '叙事', line: '秦王政二十五年，王贲在辽东俘燕王喜，随后又俘代王嘉。燕、代余部覆亡。',
      beat: 'winter', note: '渡口风冷，燕人和代人在同一座亭下等着登记。' },
    { speaker: '政', line: memory, beat: 'stone', note: stoneNote },
    { speaker: '叙事', line: '这时蓟城失守已有数年，丹也早已身死。渡亭收来的简上，写的是还在路上的人。',
      beat: 'shelter', note: '案头两组散简，有的写姓名，有的写原来的乡里。' },
    { speaker: '书佐', line: fromChu },
    { speaker: '燕人', line: '我原住蓟城。他们几个从代地来，一路都扶着我走。名字能挨在一处么？' },
    { speaker: '代人', line: '我想先把乡里接上。也许还有人来找我，只知道我原先住哪儿。' },
  ];
}

export function yanOutcome(assisted, bound) {
  if (!assisted) return [
    { speaker: '书佐', line: '姓名与来处都合上了。现在照原籍也能找，照一路同行的人也能找。' },
    { speaker: '燕人', line: '我总得知道下一渡还能不能见到他们。你说，先把他们记在哪一册？' },
  ];
  return [
    { speaker: '书佐', line: bound[0] ? '姓名已经接好，来处还须听本人来认。'
      : bound[1] ? '来处已经接好，余下还有几个名字认不全。'
        : '简还没有合齐。能读出的先原样留着，等人来认。',
      beat: 'pending', note: '拼好的保留，缺失的地方留空待问。' },
    { speaker: '代人', line: '明早还有人到。先把他们能问到的那几行留下。' },
  ];
}

export const YAN_ORDERS = {
  origin: {
    title: '按燕、代原籍分册',
    line: '从旧地来找的人，还是按乡里翻得快。两册都留在亭里。',
    speaker: '代人',
    note: '燕、代旧简分放在案的两边。',
    ending: '渡亭分存燕、代两册。已知的乡里写在名下，缺的留给后来到亭里的人。',
  },
  companions: {
    title: '把眼下一起走的人合写一册',
    line: '回头要是换了渡口，也知道和我一块儿走的是谁。',
    speaker: '燕人',
    note: '同行人的简收拢到案中央，旧籍还各自记在简上。',
    ending: '同行的人写在同一册里，查明的原籍也留在名下。',
  },
};

export const YAN_ANCHOR = '《史记》记载，秦先得燕王喜，继而俘代王嘉。';
export const YAN_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《史记·秦始皇本纪》记载，秦王政二十一年秦军取蓟城，太子丹死，燕王东走辽东。二十五年（前222年），王贲攻燕辽东，得燕王喜，随后攻代并俘代王嘉。',
    '王案上的圆石、渡亭人物与登记安排，均为本作演绎。渡亭场景借用燕地夯土、木构、陶瓦等考古材料中的造型元素。',
  ],
  sources: [
    ['《史记·秦始皇本纪》', 'https://cn.jic.io/topic/shiji/006'],
    ['河北省文物考古研究院 · 燕下都', 'https://www.hbswwkg.com/2021-05/26/content_8502773.html'],
  ],
};

export const RETURN_PLACE = '邯郸 · 藏身旧院';
export const RETURN_DATE = '秦王政十九年 · 前228年';
export const RETURN_CASE = '翻找旧院';
export const RELIC_NAMES = ['旧灯', '门闩', '户简'];
export const RELIC_MARKS = ['灯', '闩', '简'];

export const RELIC_NOTES = [
  '旧灯露出来了。田伯曾用灯罩遮住火光。',
  '门闩还在。那年，就是它挡住了门外的脚步。',
  '清出了几枚户简。上面记着从前住在附近的人。',
];

export function returnOpening(journey, handoverOrder) {
  const roadMemory = journey.c3 === 'trust_ran' ? '那年冉伯挪开陶坊的门板，母亲牵着我走过去。'
    : journey.c3 === 'own_route' ? '那年我认出了这条侧巷。母亲拉着我的手，没有回头。'
      : '我记得这条巷。小时候，母亲牵着我走过。';
  const legacy = handoverOrder === 'keeper' ? '在新郑，秦吏请原来的库吏一起对账。这座院子也有人认得旧户简。'
    : handoverOrder === 'notice' ? '在新郑，里人可以自己沿街传话。在这座院子里，得先弄清还有谁能回家。'
      : '旧院里还有人认得从前的住户。有些人去了哪里，谁也说不准。';
  const danMemory = journey.c2 === 'father_qin' ? '我告诉丹，父亲是秦人。他还是把最圆的一颗递给了我。'
    : journey.c2 === 'born_here' ? '我告诉丹我生在邯郸。他把最圆的一颗递给了我。'
      : '丹从地上捡出最圆的一颗，放进我手里。';
  return [
    { speaker: '叙事', line: '秦王政十九年，秦军攻破赵国都城。赵王被俘，政重返出生之地邯郸。',
      beat: 'return', note: '街巷冷清。幼年藏过身的旧院还在。' },
    { speaker: '政', line: roadMemory, beat: 'threshold', note: '秦王在旧院前停了下来。' },
    { speaker: '政', line: danMemory, beat: 'stone', note: '那颗圆石搁在案边。' },
    { speaker: '叙事', line: '《史记》记载，政回到邯郸后，杀害了当年与母家结怨的人。',
      beat: 'account', note: '旧怨有人记得，死去的人也各有家人。' },
    { speaker: '书佐', line: legacy },
    { speaker: '邻人', line: '残瓦盖住了几处。灯和门闩还找得着，屋角那几枚户简也要找。要是有人回来，总得知道去哪里问。',
      beat: 'inspect', note: '院里有三处残瓦，底下压着旧物。' },
  ];
}

export function returnOutcome(assisted, found) {
  const recovered = RELIC_NAMES.filter((_, index) => found[index]);
  return [
    { speaker: '邻人', line: assisted
      ? recovered.length ? '找出的' + recovered.join('、') + '先放好。剩下的等白天再找，别把瓦底下的东西踩碎了。'
        : '瓦底下还没看清。先把院口留出来，等天亮再找。'
      : '旧灯、门闩、户简都找出来了。户简上有几家后来搬走了，还有几家一直没有音信。' },
    { speaker: '书佐', line: '册里留空，明日还得问。但旧院今晚怎么办，请王定下。' },
  ];
}

export const RETURN_ORDERS = {
  record: {
    title: '把没有音信的住户留在册上',
    ending: '书佐把已知和未明的住户分别记下，留了几行给后来回到旧院的人。',
    lines: [
      { speaker: '政', line: '没音信的也写上。名字留在那里，有人回来便再问。', beat: 'record', note: '书佐在门旁摊开新简，空处留给还不知去向的人。' },
      { speaker: '邻人', line: '那就把我兄长的名字也写一遍。我认得他那只烧裂的陶碗。' },
    ],
  },
  open: {
    title: '把旧院打开，留给邻里碰面',
    ending: '院门敞开，书佐留在院内。晚些回来的人有一处可以相认、问话的地方。',
    lines: [
      { speaker: '政', line: '院门开着。还有人回来，就让他们进来问。', beat: 'open', note: '半掩的旧门推开，邻里可以到院里等人。' },
      { speaker: '邻人', line: '我去招呼隔壁。她一直以为，再也进不了这扇门。' },
    ],
  },
};

export const RETURN_ANCHOR = '《史记》记下了秦王返邯郸及其报复。旧院的相认、查找和章末安排属于本作演绎。';
export const RETURN_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《史记·秦始皇本纪》载，秦王政十九年，秦军俘赵王，秦王到邯郸，对当年与母家有旧怨者实施杀戮。赵公子嘉后来在代自立，赵地残余势力仍在。',
    '旧院、圆石、邻人与书佐沿用本作的创作线索。找旧物、登记失散住户和开放院门均为剧情演绎。',
    '街巷保留第一章的土墙、青瓦与木门。远景城垣参考赵邯郸故城的夯土遗存。',
  ],
  sources: [
    ['《史记·秦始皇本纪》', 'https://cn.jic.io/topic/shiji/006'],
    ['河北省文物考古研究院 · 赵王城遗址考古', 'https://www.hbswwkg.com/2024-07/19/content_9209483.html'],
  ],
};

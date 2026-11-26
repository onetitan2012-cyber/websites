export const FLOOD_PLACE = '大梁 · 水边街口';
export const FLOOD_DATE = '秦王政二十二年 · 前225年';
export const FLOOD_CASE = '水退见阶';
export const STEP_NAMES = ['上段', '中段', '下段'];

export function floodOpening(friendOrder) {
  const friendMemory = friendOrder === 'keep' ? '秦廷那颗圆石收起来以后，蓟城失守的消息还是到了。丹死了，燕王退往辽东。'
    : friendOrder === 'record' ? '秦廷的简上先记了丹的名字。次年蓟城失守，丹死了，燕王退往辽东。'
      : '秦王政二十一年，秦军攻取蓟城，燕太子丹死。燕王退往辽东。';
  return [
    { speaker: '叙事', line: friendMemory, beat: 'distant', note: '北方的消息还在案上，秦军已转向魏国。' },
    { speaker: '叙事', line: '秦王政二十二年，王贲攻魏。大梁遭水灌淹，城毁，魏王请降。',
      beat: 'flooded', note: '魏国旧都大梁。沿街的石阶都没在积水里。' },
    { speaker: '撑排人', line: '排上还有个大人，带着娃！', beat: 'street', note: '陶婶在高台上循声找人。排头的孩子伏在母亲膝边。' },
    { speaker: '小满', line: '娘，那级石头缺了个角。我就坐在那儿穿鞋。', action: '他指着水面，小声说给娘听。', beat: 'street', note: '水盖住了街口的石阶。陶婶还看不清排上是谁。' },
    { speaker: '撑排人', line: '帮我看一眼石沿。三段都露出来，我就把排靠过去。' },
  ];
}

export const BROTHER_QUESTION = '我妹子阿荇，带着小满。你见着他们了吗？';
export const SIGNAL = {
  seen: { speaker: '小满、陶婶', line: '「陶婆婆！」　「阿荇！小满也在！」', action: '阿荇托起孩子的手，朝岸上应道：「婶，我们俩都在。」' },
  answered: { speaker: '小满、陶婶', line: '「我还在这儿！」　「看见你的手了，小满。」', action: '陶婶退开半步，手仍举着，小满也举起手。' },
};

export function nextWitness(witness, before, after) {
  if (witness === 'unknown' && after > 0) return 'seen';
  if (witness === 'seen' && after < before) return 'answered';
  return witness;
}

export function floodOutcome(assisted, recognized) {
  const first = assisted ? {
    speaker: '撑排人', line: '石沿还没露全。排先留这儿，等水缓一缓。',
    beat: 'hold', note: recognized ? '排还在水上。陶婶朝小满举着手。' : '排暂留街口，岸上仍辨不清排上的人。',
  } : {
    speaker: '陶婶', line: '小满，手给我。阿荇，你也上来。', beat: 'cross', note: '木排靠阶。小满先上，阿荇随后。',
  };
  return [first, { speaker: '哥哥', line: BROTHER_QUESTION, beat: 'ask',
    note: '另一个街口来了人。他只看见高台上的陶婶。' }];
}

const familyAnswers = {
  landed: {
    shelter: {speaker:'阿荇', line:'哥，轻点，小满才睡。', note:'哥哥掀起帘角，听见妹妹的声音，蹲在干席边。', ending:'阿荇从席里唤了声哥。他把湿鞋留在帘外，坐到了妹妹身边。'},
    list: {speaker:'陶婶', line:'阿荇母子，已登台。是我扶的小满。往里边廊下找。', note:'陶婶指住简行。哥哥念了一遍，转身去找内廊。', ending:'简上有母子的落脚处。哥哥问清了内廊怎么走，起身去找。'},
  },
  seen: {
    shelter: {speaker:'陶婶', line:'刚才小满还喊我呢。坐我这儿，排再过来，一眼就看见。', note:'哥哥把临街的席角折起，和陶婶一起守着街口。', ending:'小满隔水应过声。哥哥把临街的席角折起，给妹妹和孩子留了位。'},
    list: {speaker:'陶婶', line:'我在岸上，听见娘俩应过声。就写「母子在排上应声，未见登阶」。证人写我。', note:'哥哥记住陶婶的名字，往街口去问撑排的人。', ending:'陶婶留下了最后一次亲见的消息。哥哥知道该去问谁，简上仍等着登阶的回音。'},
  },
  unknown: {
    shelter: {speaker:'陶婶', line:'没看清。你坐朝街这一头，有人过来，你先瞧。', note:'哥哥坐到干席外沿，侧身给身边的人也让了一块。', ending:'哥哥有了等人的干处。席头正对街口，他仍在找妹妹的身影。'},
    list: {speaker:'哥哥', line:'我来寻阿荇、小满。她若也来问，就说我在高台口等。', note:'记名人念还给他：「去处待问；兄候高台口。」', ending:'哥哥留下了母子的姓名和自己等候的地方。母子的去处那一栏仍空着。'},
  },
};

export function familyAnswer({key, assisted, recognized}) {
  if (recognized === undefined) return null;
  return familyAnswers[assisted ? recognized ? 'seen' : 'unknown' : 'landed'][key];
}

export const FLOOD_ORDERS = {
  list: {
    title: '先登记仍未到的人',
    line: '知道去了哪儿的和没有音信的，分开记。明早还得再问一遍。',
    speaker: '街坊',
    note: '撑开的席案上摊出一卷新简，邻里逐一报名字。',
    ending: '新简记下了地点和名字，还空着几行等后来的人。',
  },
  shelter: {
    title: '先给高台上的人腾一处歇脚',
    line: '先把干席铺开。抱孩子的坐里边，排上的人有了落脚的地方再上来。',
    speaker: '撑排人',
    note: '高台上铺开干席，靠里的一盏灯亮了。',
    ending: '居民在高台暂歇，留出一处空地给后来靠岸的人。',
  },
};

export const FLOOD_ANCHOR = '《史记》记载，大梁城毁，魏王请降，秦取得魏地。';
export const FLOOD_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《史记·秦始皇本纪》记载，秦王政二十一年，秦军取蓟，燕太子丹死，燕王退往辽东。二十二年（前225年），王贲攻魏，大梁被水灌淹，魏王请降。',
    '陶婶、阿荇母子、寻亲的哥哥、撑排人、缺角石阶和具体撤离经过是本作演绎。棋盘水位为随步数变化的游戏数值。',
    '大梁旧址是今开封城市叠压遗存的一部分。街口、木排和高台采用战国微缩场景的风格化设计。',
  ],
  sources: [
    ['《史记·秦始皇本纪》', 'https://cn.jic.io/topic/shiji/006'],
    ['河南博物院 · 开封城下城', 'https://www.chnmus.net/ch/information/dynamic/details.html?id=510172655053866677'],
  ],
};

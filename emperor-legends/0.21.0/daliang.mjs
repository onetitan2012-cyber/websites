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
    { speaker: '街坊', line: '西边屋檐下还有人。那家的媳妇抱着孩子，等了一昼夜。高台上有地方，水里看不见下脚的石阶。' },
    { speaker: '撑排人', line: '我带他们上了木排。水退一点才能贴近台阶，水再涌来，低处还会盖住。得等台阶都露出来。' },
    { speaker: '街坊', line: '你先照着石沿看。我守着高台，哪里露出来就告诉你。' },
  ];
}

export function floodOutcome(assisted, stages) {
  if (!assisted) return [
    { speaker: '撑排人', line: '三段阶都看得见了。排靠着石沿，孩子先扶上去。', beat: 'cross',
      note: '木排沿露出的石阶靠向高台。' },
    { speaker: '街坊', line: '上来的人先往里坐。还有没到的，能记名字的就记下来。' },
  ];
  return [
    { speaker: '撑排人', line: stages ? '露出来的石沿先记下。剩下的还看不见，木排先靠在高处，等水缓了再走。'
      : '阶沿又全盖住了。先把木排留在能停的地方，天亮再看水势。', beat: 'hold',
      note: '木排暂留原处，居民等着下一次可通行的时机。' },
    { speaker: '街坊', line: '先问排上的人还有谁没到，也让高台上留出落脚的地方。' },
  ];
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
    '居民、撑排人、台阶和具体撤离经过是本作演绎。棋盘水位为随步数变化的游戏数值。',
    '大梁旧址是今开封城市叠压遗存的一部分。街口、木排和高台采用战国微缩场景的风格化设计。',
  ],
  sources: [
    ['《史记·秦始皇本纪》', 'https://cn.jic.io/topic/shiji/006'],
    ['河南博物院 · 开封城下城', 'https://www.chnmus.net/ch/information/dynamic/details.html?id=510172655053866677'],
  ],
};

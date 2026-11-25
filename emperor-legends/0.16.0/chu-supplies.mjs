export const CHU_DATE = '约前225—前223年';
export const SWIFT_PLACE = '秦营 · 行前';
export const STEADY_PLACE = '秦营 · 库场';
export const SWIFT_CASE = '三步备粮';
export const STEADY_CASE = '两批装车';
export const SUPPLY_NAMES = ['粮', '布'];

export function swiftOpening(floodOrder) {
  const memory = floodOrder === 'list'
    ? '大梁的名册上还有没到的人。如今又要往楚地去，随车的粮和人也各有一个数。'
    : floodOrder === 'shelter'
      ? '大梁高台上还留着一块干席。那头刚能歇一歇，这头的车又催着要走。'
      : '大梁刚降，秦廷已议攻楚。叫随车的人来，听清楚各自领什么。';
  return [
    { speaker: '叙事', line: '秦王议攻楚。李信说二十万人足以成事，王翦认为非六十万不可。秦王采用李信的主张。',
      beat: 'council', note: '小帐前停着一辆粮车，装车的吏员在等。' },
    { speaker: '书佐', line: memory },
    { speaker: '李信', line: '出发的时辰已经定下。先把手边的粮装车，来不及备齐的，照实记着。', beat: 'swift',
      note: '粮袋随收集上车，车旁的人在清点。' },
  ];
}

export function chuTurnaround(assisted, grain) {
  return [
    { speaker: '书佐', line: assisted ? `这一车只备到 ${grain} 份。先前的数我留在牍上，缺的也写明。`
      : '八份粮都装进这辆车，出门前的账已经对上。',
      beat: 'depart', note: assisted ? '车上留下实有的粮袋，账上记着缺额。' : '粮车装好，待人领车出营。' },
    { speaker: '叙事', line: '李信与蒙恬出征。此后秦军在楚地失利，李信退回秦国。',
      beat: 'return', note: '送回营中的简上，记下了退回和未归的人。' },
    { speaker: '政', line: '寡人当初没有听将军的话。如今还请将军回来，再领兵往楚地。',
      beat: 'summon', note: '秦王复请王翦。这次库前摆着两辆待装的车。' },
    { speaker: '王翦', line: '这一次每批都配齐粮和布再封车。先装足一批，剩下的接着装第二批。' },
  ];
}

export function steadyOutcome(assisted, batches) {
  return [
    { speaker: '库吏', line: assisted ? (batches ? '第一批已经封好。余下的布和粮分开码着，还缺的让后班再补。'
      : '两批还没配齐。已到的物资先留在车边，缺项都写在册上。')
      : '两批物资都对过了，车上的粮袋和布卷也绑在了一起。',
      beat: 'loaded', note: assisted ? '已备物资留在库场，缺项由后班补齐。' : '两辆车都配齐粮布，可以封车。' },
    { speaker: '叙事', line: '王翦再度领兵伐楚。秦最终攻灭楚国。边地送回的名册，还需要人继续核对。' },
  ];
}

export const CHU_ORDERS = {
  list: {
    title: '先清点已返乡和仍未归的人',
    line: '把已经归来的逐一勾明。还有谁没回来，那一行先留着。',
    speaker: '书佐', note: '营前展开归乡名册，未归的几行仍空着。',
    ending: '书佐留下尚无消息的人名，等后来的回报。',
  },
  reserve: {
    title: '先留下粮布接应还在路上的人',
    line: '库旁先留一席。人回到营里，能领到粮，也有干布可换。',
    speaker: '王翦', note: '一份粮和一卷干布放到营口的席上。',
    ending: '营口留了粮布，等还在路上的人回来。',
  },
};

export const CHU_ANCHOR = '《史记》记载，李信伐楚失利，秦王复用王翦，秦最终灭楚。';
export const CHU_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《白起王翦列传》记载李信和王翦对用兵人数看法不同，秦王先用李信，李信失利后复请王翦。《秦始皇本纪》记载秦王政二十三年复召王翦，二十四年秦攻楚并定楚地。',
    '粮车、两批粮布、库吏和末尾登记与留物安排是本作演绎。三消成绩改变的是局部准备与记录。',
  ],
  sources: [
    ['《史记·白起王翦列传》', 'https://ctext.org/shiji/bai-qi-wang-jian-lie-zhuan/zh'],
    ['《史记·秦始皇本纪》', 'https://cn.jic.io/topic/shiji/006'],
  ],
};

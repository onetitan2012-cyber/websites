export const CHU_DATE = '约前225—前223年';
export const SWIFT_PLACE = '秦营 · 行前';
export const STEADY_PLACE = '秦营 · 库场';
export const SWIFT_CASE = '三步备粮';
export const STEADY_CASE = '两批装车';
export const SUPPLY_NAMES = ['粮', '布'];

export function swiftOpening(floodOrder) {
  const memory = floodOrder === 'list' ? '大梁那页还有空行。来，送车的人另起一页。'
    : floodOrder === 'shelter' ? '车夫从干席上站起来，拍拍草屑。大梁的人才刚歇下，他又要领车了。'
      : '两位车夫在帐外等着。他们的木牌挂在同一根横木上。';
  return [
    { speaker: '叙事', line: '帐里议攻楚。李信答二十万，王翦答六十万。秦王决定先用李信。帐外有人低声问：“是今天走吗？”', beat: 'council', note: '粮车边，两枚刻名的木牌并排挂着。' },
    { speaker: '叙事', line: memory, beat: 'drivers', note: '赭衣车夫把木牌转过来，青衣同伴俯身理绳。' },
    { speaker: '车夫', line: '你把名字朝外头挂。回营时，书佐好认。' },
    { speaker: '李信', line: '装到多少就记多少。车到了，别叫接车的人还猜里头有什么。', beat: 'swift', note: '粮袋随收集上车，车旁的人等着领车。' },
  ];
}

export function returnLines({ grain }) {
  return [
    { speaker: '书佐', line: grain === 8 ? '八份，一袋不少。你们可以领车了。' : '车上实有' + grain + '份粮。缺的我写在这里，接车时对着看。', beat: 'depart', note: '这一车的实数落在出营牍上。' },
    { speaker: '叙事', line: '李信、蒙恬出征。后来战报传回，秦军在楚地失利。又过了一阵，营口响起熟悉的车轮声。', beat: 'wheel', note: '仍是送车时的营门。先听见轮声，车才停稳。' },
    { speaker: '书佐', line: '你回来了。同车的那位呢？', beat: 'return', note: '赭衣车夫站在空车旁。两枚木牌都还挂着。' },
    { speaker: '车夫', line: '我在渡头下的车。他走的哪条路，我没看见。' },
  ];
}
export const countedLines = [
  { speaker: '书佐', line: '我见到你了。另一枚先挂着，等确切的消息。', beat: 'counted', note: '灯下落了一枚木牌，钩上那枚仍记作「未得信」。' },
  { speaker: '政', line: '上次是寡人决断的。如今亲来请将军，还要多少人？', beat: 'summon', note: '王翦门前，秦王重新问起领兵的人数。' },
  { speaker: '王翦', line: '臣所请，仍是六十万。' },
  { speaker: '车夫', line: '上趟回来，袖口湿了几天。新到的布，哪一车能领？', beat: 'sleeve', note: '车夫摊开袖口，库吏在每辆车边各空出四个布位。' },
  { speaker: '库吏', line: '粮和干布配齐才系绳。多出的先搁架上，第二辆也用得着。' },
];

export function steadyOutcome(assisted, batches) {
  const line = !assisted ? '两辆车的粮布都配齐了。两根绳，都是我看着扎的。'
    : batches ? '第一辆封好了。第二辆到多少留多少，交给接班的人。' : '绳还松着。实到的粮布留在原处，让后班接着配。';
  return [
    { speaker: '库吏', line, beat: 'loaded', note: '库吏核对实数，扎好的车才能领走。' },
    { speaker: '叙事', line: '王翦再度领兵，驻营相持。过了许久，楚王被俘，楚地易手。河对岸的人，仍照旧渡的名字喊船。', beat: 'bank', note: '楚岸芦苇压向水面。渡妇已把搭船的板收起。' },
    { speaker: '渡妇', line: '听见了。把孩子带过来，我再送一趟。', beat: 'plank', note: '渡妇把板搭回岸边，等岸上的一家人上船。' },
    { speaker: '孩子', line: '那明天，还从这儿叫你吗？', beat: 'crossing', note: '一家人都上了船，船板收回舷内。' },
    { speaker: '渡妇', line: '你还记得怎么叫，我就知道你在哪一岸。', beat: 'landed', note: '船抵对岸，渡妇搭板送客。' },
  ];
}
export const CHU_ORDERS = {
  list: { title: '先清点已返乡和仍未归的人', speaker: '书佐', line: '你看这行，他回来过。我亲眼见的。下面这个，还得等消息。',
    note: '灯照在摊开的牍上。来人看到了名字，门边的席还卷着。', ending: '那一夜，你把灯留在归人名册旁。问路的人先得了一条确切消息，门边的席还卷着。' },
  reserve: { title: '先留下粮布接应还在路上的人', speaker: '库吏', line: '先坐，换块干布。你问的那个人？等我把案上的牍拿过来。',
    note: '一灯照着门边的席。来人领了营用粮布，案上的名册仍待核。', ending: '那一夜，你把灯移到了营口。来人先有了口粮和干布，同伴的消息要再等一会儿。' },
};
export function chuEnding(result) {
  if (result.counted) return CHU_ORDERS[result.key].ending;
  return result.key === 'list' ? '书佐留下尚无消息的人名，等后来的回报。' : '营口留了粮布，等还在路上的人回来。';
}
export const CHU_ANCHOR = '《史记》记载，李信伐楚失利，秦王复用王翦，秦最终灭楚。';
export const CHU_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《白起王翦列传》记李信答二十万、王翦答六十万。秦王先用李信，失利后亲请王翦。王翦领军后在楚地久驻。',
    '《秦始皇本纪》在秦王政二十三年记俘荆王，二十四年记昌平君、项燕之死。《楚世家》在负刍四年记项燕死，五年记虏负刍。二十五年江南地置会稽郡。本章用初征、再征、楚地易手交代先后。',
    '两车、木牌、渡妇一家与营用粮布是本作演绎。出营牍只记实收物资，空牌只表示暂未得信。',
  ],
  sources: [['《史记·白起王翦列传》','https://zh.wikisource.org/wiki/史記/卷073'],['《史记·秦始皇本纪》','https://zh.wikisource.org/wiki/史記/卷006'],['《史记·楚世家》','https://zh.wikisource.org/wiki/史記/卷040']],
};

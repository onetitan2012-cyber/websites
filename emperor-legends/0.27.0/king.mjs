export const KING_PLACE = '秦廷 · 议事厅';
export const KING_DATE = '秦王政初立';
export const KING_CASE = '校核仓粮';

export const COUNCIL_FILES = [
  { chip: '入仓旧册', title: '打开入仓旧册', action: '入仓旧册打开，露出原来的入库记录。', result: '旧册记的是入仓总数，其中一批粮后来已经调出。' },
  { chip: '余粮新报', title: '打开余粮新报', action: '余粮新报打开，和旧册并排。', result: '新报记的是实存余粮。少掉的一批，恰好是账上调出的数。' },
  { chip: '调拨原卷', title: '复核调拨原卷', action: '原卷开封，露出印记和回执栏。', result: '原卷有调拨印记，缺收粮回执。仓里能拨多少，已经核清。' },
];

export function kingOpening(qinChoice) {
  const entryNotes = {
    carry: '政把从旧屋带来的木牍放在身侧，抬头看向丞相。',
    leave: '政从旧屋空手来到殿上。这次，等着他开口的是群臣。',
  };
  return [
    { speaker: '车夫', line: '今儿赶得回去吗？', beat: 'door-wait', note: entryNotes[qinChoice] ?? '车夫攥着缰绳，望进议事厅。' },
    { speaker: '政', line: '你这车，等的是哪一批？', beat: 'door-ask', note: '文书先看吕不韦。吕不韦把案卷推到政手边。' },
    { speaker: '车夫', line: '说叫我来领粮。我只知道这些。' },
    { speaker: '吕不韦', line: '大王，两份仓粮记录数目不一样。郡县在等这批粮。', beat: 'inspect', note: '入仓旧册和余粮新报摆在同一张案上。' },
    { speaker: '政', line: '一个写入仓，一个写剩下的粮。中间调出那一笔，谁签收了？',
      beat: 'inspect', note: '政让文书把两份记录摆在同一张案上。' },
    { speaker: '吕不韦', line: '调拨原卷还封着。先核旧册和新报，再开原卷，才能知道哪笔还没有回执。',
      beat: 'inspect', note: '旧册、新报、调拨原卷依次摆开。' },
  ];
}

export const KING_VERIFIED = [
  { speaker: '文书', line: '两份数都对。一份是入仓总数，一份是眼下实存。差的那笔有调拨印记，却没有收粮回执。' },
  { speaker: '吕不韦', line: '眼下能发的数已经核清。可以先发这一批，再追回执；也可以等回执到了，再一并发粮。' },
];

export const KING_ORDERS = {
  send: {
    title: '先发已核清的余粮',
    line: '先按实存的数给郡县发粮。缺的回执，丞相另派人去追。',
    reply: '臣先发这一批。回执到了，再带原卷来复命。',
    note: '已核清的余粮先行拨出，调拨原卷留案追查。',
  },
  hold: {
    title: '等回执到了再一并发粮',
    line: '请丞相先派人去问回执的下落。回执到了，带着这三卷一起来见我。',
    reply: '臣这就派人。郡县那边，也会告知为何晚发。',
    note: '文书收回三份案卷。粮令暂缓，先追缺失的回执。',
  },
};

const driverQuestion = { speaker: '车夫', line: '大王，我这车，什么时候来装？', beat: 'door-ask', note: '他扶住车辕，等政自己开口。' };
const grainCount = ['从入仓的数查起。', '入仓数有了。接着看眼下还剩多少。', '前两卷对得上。原卷从这儿接着核。'];
export const DRIVER_MEMORY = {
  send: '车夫当天装粮出门。政回头时，丞相还在等先前那批粮的回执。',
  hold: '粮数已清。车夫卸了轭，到车棚喂牛。回执一到，文书就去喊他装车。',
  defer: '车夫留下空车，步行回去传话。政还给不了装车的日子，先回案前把数查清。',
};
export function driverReply(key, collected) {
  if (key === 'send') return [
    driverQuestion,
    { speaker: '政', line: '就现在。仓里点清的那批，你先装。', beat: 'door-load', note: '车夫回身接过粮袋，放上车板。' },
    { speaker: '政', line: '车都走了，相邦还等谁？', beat: 'door-send', note: '车夫牵牛出门，载粮的车轮滚过门口。' },
    { speaker: '吕不韦', line: '等先前收粮的人回话。是另一笔。', beat: 'account-open', note: '三卷都已打开。吕不韦的手还按在调拨原卷上。' },
  ];
  if (key === 'hold') return [
    driverQuestion,
    { speaker: '政', line: '仓里能给你的粮，已经点清了。是我让它先留在仓里。' },
    { speaker: '车夫', line: '那我明早套车？' },
    { speaker: '政', line: '先卸了吧。前一批是谁收的，我还在等他的回执。回执一到，我叫文书去车棚喊你。', beat: 'door-unyoke', note: '他双手抬起车轭，把它斜靠在轮旁。' },
    { speaker: '车夫', line: '好，我去喂牛。来车棚找我。', beat: 'door-hold', note: '空车停在门边，车夫给牛添草。文书记下车棚的位置。' },
  ];
  return [
    driverQuestion,
    { speaker: '政', line: '我还说不准，仓里有多少能装上你的车。' },
    { speaker: '车夫', line: '那我回去，人家问我明早有没有粮，我怎么说？' },
    { speaker: '政', line: '就说我还没查清。明早能不能装，我现在答不了你。等数核清，我先叫人给你个信。' },
    { speaker: '车夫', line: '明早先别往仓门来。等信。', beat: 'door-defer', note: '他留下空车，转身徒步回去传话。' },
    { speaker: '吕不韦', line: grainCount[collected], beat: 'account-mark', note: '政回到席前。窄签夹在这次查到的位置。' },
  ];
}

export const KING_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《史记·秦始皇本纪》记载秦王政年少初立，国事交由大臣处理，吕不韦为相。',
    '本章的车夫、仓粮疑案、三份案卷、具体对白和处置结果是围绕这段背景创作的。',
    '议事厅的台阶、瓦作与卷盒陈设借鉴秦地建筑和简牍资料。空间布置、盒形与印记都是美术演绎。',
  ],
  sources: [
    ['《史记·秦始皇本纪》', 'https://ctext.org/shiji/qin-shi-huang-ben-ji/zhs'],
    ['《陕西省志·建设志》秦雍城宫殿建筑', 'https://dfz.shaanxi.gov.cn/zslm/fzzlk/xbsxsz/szdylpdf/201404/P020240923623109161543.pdf'],
    ['青川战国木牍', 'https://www.chinatax.gov.cn/chinatax/c103144/c5251333/content.html'],
  ],
};

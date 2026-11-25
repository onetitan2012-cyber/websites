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
    { speaker: '吕不韦', line: '大王，两份仓粮记录数目不一样。郡县来催，问这批粮什么时候能发。',
      beat: 'audience', note: entryNotes[qinChoice] ?? '秦王初立。丞相把待议的仓粮案呈到案前。' },
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

export const KING_DEFERRED = [
  { speaker: '吕不韦', line: '原卷还没有核完。数目没查清，今日不能定下来。', beat: 'defer', note: '案卷按已经核到的位置留在原处。' },
  { speaker: '政', line: '那就先别发令。请文书把没核完的地方记好，等核清了再报。' },
];

export const KING_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《史记·秦始皇本纪》记载秦王政年少初立，国事交由大臣处理，吕不韦为相。',
    '本章的仓粮疑案、三份案卷、具体对白和处置结果是围绕这段背景创作的。',
    '议事厅的台阶、瓦作与卷盒陈设借鉴秦地建筑和简牍资料。空间布置、盒形与印记都是美术演绎。',
  ],
  sources: [
    ['《史记·秦始皇本纪》', 'https://ctext.org/shiji/qin-shi-huang-ben-ji/zhs'],
    ['《陕西省志·建设志》秦雍城宫殿建筑', 'https://dfz.shaanxi.gov.cn/zslm/fzzlk/xbsxsz/szdylpdf/201404/P020240923623109161543.pdf'],
    ['青川战国木牍', 'https://www.chinatax.gov.cn/chinatax/c103144/c5251333/content.html'],
  ],
};

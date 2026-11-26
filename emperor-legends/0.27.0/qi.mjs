export const QI_PLACE = '临淄 · 市坊门前';
export const QI_DATE = '秦王政二十六年 · 前221年';
export const QI_CASE = '交籍留粮';

export function qiOpening(yanOrder) {
  const echo = yanOrder === 'origin' ? '燕、代渡亭的两册分开存着，寻人时还能按旧乡找。临淄这本册，原来的里名也得留下。'
    : yanOrder === 'companions' ? '燕、代渡亭把同行的人写在一册。临淄的坊门开了，也要让一起生活的人还能找到彼此。'
      : '民籍一条条合上，家住哪里、还有几口人，都得让熟悉的人认过。';
  return [
    { speaker: '叙事', line: '秦王政二十六年，秦军进逼齐地。韩、赵、魏、楚、燕的旧地先后入秦，齐成了最后一国。',
      beat: 'gate', note: '临淄坊门尚关着。左边堆着市粮，右边摆着民籍。' },
    { speaker: '齐吏', line: '门里的人还没散。今日若换了官，明早谁来开市？谁把街上这些人记下来？' },
    { speaker: '秦使', line: echo, beat: 'register', note: '蓝简对应右案的民籍。每核完一条，就摊开一枚。' },
    { speaker: '市人', line: '调走一袋，就少一袋能留给街坊。门一旦开了，至少得有四份市粮。' },
    { speaker: '齐吏', line: '那就两边一起看。把该对的八条户籍对过，市粮还要留足。', beat: 'terms',
      note: '市粮一旦被调拨，就会从左席移到旁车。' },
  ];
}

export function qiOutcome(assisted, entries, grain, floor) {
  if (!assisted) return [
    { speaker: '齐吏', line: `八条都对完了。市上还留着 ${grain} 份粮，够留下第一日的份额。` },
    { speaker: '叙事', line: '齐王建降秦，齐国归秦。六国的旧地至此都归入秦。', beat: 'surrender',
      note: '临淄城门打开，齐国归秦。' },
  ];
  return [
    { speaker: '齐吏', line: grain < floor
      ? `只剩 ${grain} 份粮了。核过的 ${entries} 条先留着，缺的市粮要另报，开市时辰也得再问。`
      : `市粮还有 ${grain} 份，民籍只核到 ${entries} 条。已查过的写明，余下留给后班。`,
      beat: 'pending', note: '已核的名籍和实存市粮都照实留下。' },
    { speaker: '叙事', line: '齐王建降秦，齐国归秦。尚未交接的事项留给后来的人继续核对。', beat: 'surrender',
      note: '城门已经打开，市坊的交接仍留待复核。' },
  ];
}

export const QI_ORDERS = {
  count: {
    title: '先把坊里的留粮实数贴在案前',
    line: '留下多少就写多少。坊里的人到了，能自己看，也知道还缺多少。',
    speaker: '市人',
    note: '余粮旁摊开核量简，实存的数照原样留下。',
    ending: '留粮实数记在案边，市民来时可以查问。',
  },
  announce: {
    title: '先把开市的安排传给各坊',
    line: '哪一坊先开，哪一坊仍需等，把时辰分别告诉他们。别让人白跑一趟。',
    speaker: '齐吏',
    note: '交接小窗推开，各坊的人可以到窗前听安排。',
    ending: '开市安排由齐吏传给各坊。还待核对的事项继续留案。',
  },
};

export const QI_ANCHOR = '《史记》记载，齐王建降秦。至此，秦完成对六国的兼并。';
export const QI_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《史记·秦始皇本纪》载，秦王政二十六年（前221年），王贲攻齐，得齐王建。《田敬仲完世家》写齐王建听从相国后胜，未战而降。',
    '齐吏、秦使、市人和坊门前核籍留粮的经过是本作演绎。八条民籍、四份留粮及开市安排属于本章玩法和剧情。',
    '临淄坊门参考齐故城的夯土城垣与木构、瓦饰的战国微缩美术方案，场景布局为游戏创作。',
  ],
  sources: [
    ['《史记·秦始皇本纪》', 'https://cn.jic.io/topic/shiji/006'],
    ['《史记·田敬仲完世家》', 'https://www.shidianguji.com/zh/book/HY2905/chapter/1kvmkkx4ys2zf'],
    ['《山东省志》· 临淄齐国故城', 'https://shandong-chorography.org/database/a/section/70/article/75/'],
  ],
};

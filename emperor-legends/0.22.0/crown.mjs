export const CROWN_PLACE = '雍 · 蕲年宫';
export const CROWN_DATE = '秦王政九年';
export const CROWN_CASE = '双印回令';
export const CROWN_NAMES = ['外门', '内署'];

export function crownOpening(kingOrder) {
  const notes = {
    send: '冠礼之后，政想起第一次核清仓粮时，也是先给出能给的答复。',
    hold: '冠礼之后，政想起第一次发粮前，自己曾等过一张回执。',
    defer: '冠礼之后，政想起那次留在案上、等人复核的仓粮簿。',
  };
  return [
    { speaker: '叙事', line: '数年后，秦王政在雍行冠礼。礼毕，宫人匆匆来报。', beat: 'rite',
      note: notes[kingOrder] ?? '冠礼刚毕，廊下传来急促的脚步。' },
    { speaker: '传令官', line: '外门和内署各收到一道急令，印文都有疑点。两处还等着回信。', beat: 'alarm',
      note: '两处都悬着待核的令牍，值守的人尚未回令。' },
    { speaker: '政', line: '两处都核。先让无关的侍从退开，核清一处便回一处。', beat: 'alarm',
      note: '外门与内署各自验印。两处的回令可以同时推进。' },
  ];
}

export const CROWN_VERIFIED = [
  { speaker: '传令官', line: '两处都验过了。先前送到的急令有假，真正的回令已送到两处值守手上。' },
  { speaker: '叙事', line: '秦王得知嫪毐作乱，命人平乱。事态平息后，政要问清传令经过。' },
];

export const CROWN_RESPONSES = {
  mother: {
    title: '先听太后那边的经过',
    lines: [
      { speaker: '政', line: '内署那道令送来时，母亲在何处？我想先听她亲口说。', beat: 'mother', note: '政先听母亲说起内署收到急令时的情形。' },
      { speaker: '赵太后', line: '人来得急，只说是照印传话。把原牍留着，我愿同他们一处对问。' },
    ],
    ending: '政先听太后的陈述。两处令牍都保留下来，等值守的人对证。',
  },
  clerk: {
    title: '先调两处的传令记录',
    lines: [
      { speaker: '政', line: '先把两处收到急令的时刻和当值人的话排在一起。母亲那里，我稍后亲自去问。', beat: 'clerk', note: '政先让传令官并列两处记录。' },
      { speaker: '传令官', line: '臣把原牍和两份记录都留在案上。谁说了什么，可以逐项对问。' },
    ],
    ending: '政先查两处传令记录，把与太后的谈话留到核对之后。',
  },
};

export const CROWN_DELAYED = [
  { speaker: '传令官', line: '还有令牍没有验完。等不到回信，那边也不肯贸然照令行事。', beat: 'delayed', note: '未核清的令牍仍留在原处。' },
  { speaker: '政', line: '已经核清的，照原令答复。余下的派人去当面确认，把迟复的缘由记下来。' },
  { speaker: '叙事', line: '秦王命人平乱。两处传令的经过，也被另行记入案中。' },
];

export const CROWN_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《史记》记秦王政八年，长安君成蟜在屯留反。次年，秦王政赴雍。',
    '《史记·秦始皇本纪》记秦王政九年在雍加冠，嫪毐矫用秦王与太后的玺作乱，随后被平定。',
    '双印回令、两处值守的传令细节、宫中人物对白和先后问询均为本作演绎。',
    '三维画面参考秦雍城遗存的台基与瓦作、战国秦地铜灯及木牍。袍服缘边参考同期楚墓实物，作为跨地域比较。蕲年宫布局、冠服和令牍墨迹均为本作美术演绎。',
  ],
  sources: [
    ['《史记·秦始皇本纪》', 'https://www.chinese-classics.org/read/history/shi-ji/shi-ji-006'],
    ['《陕西省志·建设志》秦雍城宫殿建筑', 'https://dfz.shaanxi.gov.cn/zslm/fzzlk/xbsxsz/szdylpdf/201404/P020240923623109161543.pdf'],
    ['河南博物院 · 跽坐人漆绘灯', 'https://www.chnmus.net/ch/collection/appraise/details.html?id=512154985453423215'],
    ['青川战国木牍', 'https://www.chinatax.gov.cn/chinatax/c103144/c5251333/content.html'],
    ['湖北省博物馆 · 马山战国楚墓锦袍', 'https://hbww.org.cn/xwdt/p/11338.html'],
  ],
};

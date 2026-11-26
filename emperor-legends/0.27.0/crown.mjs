export const CROWN_PLACE = '雍 · 蕲年宫';
export const CROWN_DATE = '秦王政九年四月 · 前238年';
export const CROWN_CASE = '双印回令';
export const CROWN_NAMES = ['外门', '内署'];

export function crownOpening(kingOrder) {
  const notes = {
    send: '冠礼之后，政想起第一次核清仓粮时，也是先给出能给的答复。',
    hold: '冠礼之后，政想起第一次发粮前，自己曾等过一张回执。',
    defer: '冠礼之后，政想起那次留在案上、等人复核的仓粮簿。',
  };
  return [
    { speaker:'叙事', line:'礼毕。政站在阶沿，回头看向母亲。她抬了抬手，又收回袖里。礼官也站着。他们都在等他先走。', beat:'rite',
      note:notes[kingOrder] ?? '母亲让开半步。政脚下，还有最后一级台阶。' },
    { speaker:'传令官', line:'大王，两处都送来了话。外门的人等着交班，内署的人还在帘外。', beat:'descend', note:'政先迈下台阶，礼官才跟上来。' },
    { speaker:'值守领班', line:'鞋穿好，别急。得了回话，我就让你们回家。我留下交代经过。', beat:'outer', note:'外门的年轻侍从提着鞋，回头望了一眼廊口。' },
    { speaker:'近侍宫人', line:'这件外衣还在我手里。她在里面等着穿。', beat:'inner', note:'宫人托着叠好的外衣。帘里伸出一只手，又收了回去。' },
    { speaker:'政', line:'哪边查清，就先回哪边。', beat:'alarm', note:'外门待交班，内署待送衣。两案上的灯都还暗着。' },
  ];
}

export const CROWN_VERIFIED = [
  {speaker:'叙事',line:'嫪毐之乱平息。事定后，雍。传令官把当值的人叫到廊下。',beat:'settled',note:'外门已经换班，外衣也送到了。领班留下作证。'},
  {speaker:'近侍宫人',line:'大王，能把记下来的那句念给我听么？',beat:'witness',note:'传令官正要收笔，宫人仍站在席边。'},
  {speaker:'叙事',line:'帘内，太后遣开身边的人，亲手给政留出一个坐席。',beat:'threshold',note:'政站在门槛旁。两边都在等他开口。'},
];

export const CROWN_HEARINGS = {
  mother:{
    title:'先进去问母亲',
    lines:[
      {speaker:'叙事',line:'太后穿着刚送进来的外衣，抬手想替他理冠。政俯了一下身，两人又各自把手放下。',beat:'inside',note:'门槛内，两人相对落座。'},
      {speaker:'政',line:'母亲，那道令送来时，谁同您在一起？'},
      {speaker:'赵太后',line:'替我收礼衣的孩子在。我还让她往阶上看一眼，怕你踩着衣摆。'},
      {speaker:'政',line:'她回来怎么说？'},
      {speaker:'赵太后',line:'她还没回来，外面已经有人传话了。隔着这道帘，我也想知道是谁说的。'},
      {speaker:'政',line:'方才让你等了。你从自己听见的那一句说。',beat:'waited',note:'政走出内室，宫人已在廊下坐了许久。他也坐下来。'},
    ],
    ending:'你让母亲先说完，宫人在廊下等你出来。',
  },
  clerk:{
    title:'先听当值的人',
    lines:[
      {speaker:'叙事',line:'领班铺开记录。传令官念到“太后说”，刚才送衣的宫人往前挪了一步。',beat:'record',note:'政把席子转向宫人。传令官的笔停在简上。'},
      {speaker:'近侍宫人',line:'这三个字，别替我写。我听见的是门外有人说“太后有话”。'},
      {speaker:'政',line:'你听见她自己的声音了么？'},
      {speaker:'近侍宫人',line:'没有。若记成我听见了，明日再来问我，我还是只能说没有。'},
      {speaker:'政',line:'照她刚才的话记。把这句念给她听。'},
      {speaker:'赵太后',line:'门口那孩子说完了？',beat:'tea',note:'政走进内室。太后一直给他留着席，茶已经搁凉了。'},
      {speaker:'政',line:'她说完了。那时候，您自己听见什么？'},
    ],
    ending:'你让宫人改正了记录，随后才进内室。',
  },
};

const oldResponses = {
  mother:{title:'先听太后那边的经过',ending:'政先听太后的陈述。两处令牍都保留下来，等值守的人对证。'},
  clerk:{title:'先调两处的传令记录',ending:'政先查两处传令记录，把与太后的谈话留到核对之后。'},
};
export function crownResponse(result) {
  return (result.hearing === 1 ? CROWN_HEARINGS : oldResponses)[result.key];
}
export const NEXT_YEAR = '次年，秦王迎太后入咸阳，太后复居甘泉宫。';

export function delayedHearing(marks) {
  const lines=[];
  if (marks[0]<2) lines.push({speaker:'值守领班',line:'都坐下吧。回话到了，我叫你们。',beat:'lateOuter',note:'领班把鞋放到阶边，年轻侍从坐下来。'});
  if (marks[1]<2) lines.push({speaker:'近侍宫人',line:'衣服在我这儿，我陪您等。',beat:'lateInner',note:'帘内有人问起外衣，宫人仍抱着衣服。'});
  lines.push({speaker:'政',line:'去告诉他们，我知道他们还在等。余下的，你亲自去问。',beat:'lateBoth',note:'未回令处转为当面复核。传令官领命。'},
    {speaker:'叙事',line:'嫪毐之乱平息。雍城的卷里，照实记下了迟复的缘由。'});
  return lines;
}

export function crownProgress(before,after) {
  return after.flatMap((n,i)=>n === before[i] ? [] :
    [n === 2 ? ['外门已交班','内署已送衣'][i] : CROWN_NAMES[i]+'已验一次']).join('，');
}

export const CROWN_HISTORY = {
  kind: '史实与本章演绎',
  paragraphs: [
    '《史记》记秦王政八年，长安君成蟜在屯留反。次年，秦王政赴雍。',
    '《史记·秦始皇本纪》记秦王政九年在雍加冠，嫪毐矫用秦王与太后的玺作乱，随后被平定。',
    NEXT_YEAR + '《本纪》将迎太后系于茅焦进言之后。',
    '冠礼阶旁的母子、交班、送衣和事后两场问询均为本作演绎。宫人只说自己听见的那句话。',
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

export const fieldApproach = [
  { speaker: '叙事', line: '泾水边，渠工禾生放下木耒。上游已经响起水声，田尾的农妇却还蹲着。', beat: 'upstream', note: '浅沟的上游已有水光。两畦之间，一道土埂还是干的。' },
  { speaker: '农妇', line: '渠边的人都说来了。我这头，还能扬起灰。', beat: 'dry', note: '她把土块掰开，里头还是浅白的。' },
  { speaker: '郑国', line: '把牌立在你脚跟前。等水碰着它，我们再说到了哪儿。', beat: 'offer', note: '水工递来一块短木牌，右上角削去了一截。' },
];

export const fieldAfterPlanting = [
  { speaker: '农妇', line: '这畦到了。明早我再往下头走走。', beat: 'wet', note: '水沿浅沟抵到木牌，牌底沾了泥。另一畦仍然干着。' },
  { speaker: '禾生', line: '我娘总问我在秦地做什么。这块托人捎回新郑，她认得我削的角。', beat: 'carry', note: '禾生收起试水的田牌。农妇在原处插下一根短枝。' },
];

export const canalInquiry = {
  speaker: '文书', beat: 'canal-brief', note: '案边另搁一枚事由简，墨书「韩水工郑国」。两卷仍在案心。',
  line: '韩国原想借修渠牵住秦国。事情败露，宗室大臣便请逐客。追问的是郑国来秦的缘故，关口收到的却是一道逐客令。',
};
export const readingEcho = [
  '文书读到商鞅，又看了一眼郑国的事由简：“这一件，还在做。”',
  '文书指着李斯的名字：“连上这封书的人，也在待遣之列。”',
];
export const fieldLater = {
  speaker: '叙事', beat: 'later', note: '后来，渠上。短枝还在，农妇已走到下一畦。',
  line: '郑国承认自己受韩所遣，也说渠修成了，秦地便能得利。秦最终让他把渠修完了。',
};

export const keepsakeLines = [
  { speaker: '叙事', beat: 'sewing-basket', note: '旧府库门前，老妇揭开针线筐上的麻布。', line: '里人扶母亲在街边坐下。她从针线筐底摸出一样东西，搁在膝前。' },
  { speaker: '老妇', beat: 'old-marker', note: '缺角还在右上边。木纹里的泥线已经干透。', line: '我儿禾生托人捎回来的。摸到这儿，就是水到的地方。' },
  { speaker: '禾生的弟弟', line: '旧册上我娘那一行，今天还有人认得么？' },
];

export function streetReply(order, cargo, lastRow) {
  if (order === 'keeper') return { speaker: '旧库吏', line: '我记得你们住哪条巷。老人家，过来认认旧册里这一行。巷口那头，还得劳你们稍等。' };
  const [seal, grain] = cargo.map(row => row === lastRow);
  const stock = grain ? '粮车已到里巷。' : '粮车今夜没到，明早到街口听信。';
  return { speaker: '禾生的弟弟', line: stock + (seal ? '府库已经开门，娘名下的数等对账。' : '封签还在路上，娘名下的数等交接时再对。') };
}

export const canalHistory = {
  kind: '水到哪一畦 · 史实与演绎',
  paragraphs: ['《河渠书》记韩遣水工郑国入秦作渠，事泄后秦仍使他完成工程，关中田地得灌。《李斯列传》将事情败露与宗室大臣请逐客相连。郑国为渠申辩，李斯为逐客上书。',
    '禾生一家、田边农妇、支沟试水和这块田牌均为演绎。田牌是家中纪念物，领粮户名仍凭旧册核认。'],
  sources: [['《史记·河渠书》','https://zh.wikisource.org/zh-hans/史記集解_(裴駰,_四庫全書本)/卷029'],['《史记·李斯列传》','https://www.shidianguji.com/book/NGJ892411999031668219503/chapter/1lwwkkzuid0y1']],
};

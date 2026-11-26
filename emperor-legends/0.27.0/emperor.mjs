export const EMPEROR_DATE = '公元前 221 年';
export const EMPEROR_PLACE = '秦国 · 咸阳';
export const EMPEROR_ANCHOR = '秦初并六国，秦王政定名号为「皇帝」，自称「始皇帝」。';
export const EMPEROR_HISTORY = {
  kind: '史实｜称帝与建制',
  paragraphs: [
    '公元前 221 年，秦灭齐。《史记·秦始皇本纪》记载，群臣议请尊称「泰皇」，秦王政定名号为「皇帝」，其后自称「始皇帝」。',
    '秦在新领土推行郡县，并统一度量衡、车轨及文字。',
    '《秦始皇本纪》记秦定号后尚黑。《后汉书·舆服志下》追述秦的郊祀服色，又记东汉祭礼中的旒冕。卷首画像借玄色冕板、垂珠表现始皇身份，议号当日的冠式和旒数无从据此确定。',
    '廷尉李斯参与群臣议号见于本纪。递简、门边两次传话、案前旧物与传说卷为本作演绎。传说卷记录玩家本次走过的游戏分支。',
  ],
  sources: [['《史记·秦始皇本纪》称帝与建制', 'https://zh.wikisource.org/wiki/史記/卷006'], ['《后汉书·舆服志下》冠服', 'https://www.shidianguji.com/book/LS0003/chapter/1j7lpp7fwp1kq_297']],
};

const tablets = {
  carry: { line: '回秦的那年，他们在木牍上写下我的来处。这一块，我后来也带走了。', note: '大殿议号前，政把从子楚屋里带走的木牍放在案边。' },
  leave: { line: '记着邯郸的木牍还在父亲的席前。上面写了什么，我一直记得。', note: '案上没有那块木牍。政把它留在了父亲的旧席前。' },
};

const stones = {
  record: '当年丹给的圆石仍露在案边。',
  keep: '那颗圆石还收在木匣里。',
};

export function emperorStory(journey, stoneChoice) {
  const tablet = tablets[journey.q3];
  return [
    {
      speaker: '政',
      beat: 'memory',
      title: '案前旧物',
      line: tablet?.line ?? '从邯郸走到咸阳，已经很多年了。',
      note: (tablet?.note ?? '咸阳，群臣在殿外等候。') + (stones[stoneChoice] ?? ''),
    },
    { beat:'summons', title:'殿门传令', speaker:'门下小吏', line:'秦王有令，请诸位入殿议号。',
      note:'小吏立在左门柱缺口旁，右手扶正牍首，向阶下转身。' },
    { beat:'present', title:'群臣入殿', speaker:'叙事', line:'青褐袍的廷臣从同僚手里接过简，把简首转向政。',
      note:'赭色袖缘收在腕上。他用拇指稳住了卷边。' },
    { beat:'signed', title:'案前递简', speaker:'廷尉李斯', line:'臣等的议稿在这里。',
      note:'合简落到案上。廷臣撤回了手。', button:'展简' },
    { beat:'proposal', title:'群臣所议', speaker:'议简', line:'泰皇',
      note:'简面铺平。政垂眼读着简上的两个字。', button:'抬眼' },
    { beat:'title', title:'咸阳定号', speaker:'政', line:'留下这个“皇”字，再取古时的“帝”字，称皇帝。朕为始皇帝。',
      note:'政指向议简。书吏另取一牍，记下定号。' },
    { beat:'edict', title:'殿门传诏', speaker:'门下小吏', line:'皇帝有诏。尊号已定，传告郡县。',
      note:'同一处门柱旁，小吏扶正牍首。阶下的人接过定稿。', button:'回到案边' },
  ];
}

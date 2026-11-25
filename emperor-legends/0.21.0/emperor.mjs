export const EMPEROR_DATE = '公元前 221 年';
export const EMPEROR_PLACE = '秦国 · 咸阳';
export const EMPEROR_ANCHOR = '秦初并六国，秦王政定名号为「皇帝」，自称「始皇帝」。';
export const EMPEROR_HISTORY = {
  kind: '史实｜称帝与建制',
  paragraphs: [
    '公元前 221 年，秦灭齐。《史记·秦始皇本纪》记载，群臣议请尊称「泰皇」，秦王政定名号为「皇帝」，其后自称「始皇帝」。',
    '秦在新领土推行郡县，并统一度量衡、车轨及文字。',
    '案前旧物、人物对白与传说卷为本作演绎。传说卷记录玩家本次走过的游戏分支。',
  ],
  sources: [['《史记·秦始皇本纪》称帝与建制', 'https://cn.jic.io/topic/shiji/006']],
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
    {
      speaker: '廷尉李斯',
      beat: 'council',
      title: '咸阳议号',
      line: '六国初并，群臣议请上尊号，称「泰皇」。',
      note: '视线越过书案，群臣在咸阳殿前等候议号。',
    },
    {
      speaker: '始皇帝',
      beat: 'title',
      title: '始皇帝',
      line: '取「皇」，用古时的「帝」。此后称皇帝。朕为始皇帝。',
      note: '名号议定。从邯郸到咸阳走过的路，也随案上的简册展开。',
    },
  ];
}

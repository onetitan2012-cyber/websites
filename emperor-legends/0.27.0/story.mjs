export const OPENING = [
  { speaker: '旁白', line: '秦军围邯郸。城里传来消息，秦国的质子子楚，今夜就要离开赵国。' },
  { speaker: '田伯', line: '夫人，吕先生替公子设了法。这次……带不走你们。' },
  { speaker: '赵氏', line: '政呢？他问过孩子没有？', action: '赵氏攥住那件小衣，停了一会儿，又把它叠好。' },
  { speaker: '田伯', line: '家里还留着一处旧院。门小，院深。只是街上已不太平。' },
];

export const ROUTES = {
  family: {
    title: '现在走，去旧院',
    summary: '请田伯带路，趁街口还能走，从侧巷转移。',
    transition: { speaker: '田伯', line: '出了门向左。旧院的人会留门。', action: '赵氏把小衣裹在孩子身上。三人沿窄巷走，绕过货车，从侧门进了旧院。' },
    memory: '幸亏侧门还留着。',
  },
  wait: {
    title: '等脚步过去再走',
    summary: '先遮住灯，收好随身物件，等田伯敲窗。',
    transition: { speaker: '赵氏', line: '门外脚步太多。等这一拨过去。', action: '灯光压低，脚步渐远。田伯敲了两下窗。赵氏抱起政，从空下来的侧巷进了旧院。' },
    memory: '晚一点走，倒避过了街口那拨人。',
  },
};

export const STAGES = {
  3: {
    title: '挪开门边的箱子',
    action: '田伯把箱子拖开。',
    result: '门口腾出来了，门扇可以合上。',
  },
  6: {
    title: '遮住灯火',
    action: '赵氏压下灯罩。',
    result: '窗缝暗了，巷里看不见灯光。',
  },
  8: {
    title: '合上门、扣紧门闩',
    action: '田伯合上门，扣紧门闩。',
    result: '巡吏提灯停在门外。',
  },
};

export function ending(route, assisted) {
  const resolution = assisted
    ? [{ speaker: '田伯', line: '剩下的我来。夫人，你先抱政进里间。', action: '田伯收好物件，压低灯罩，掩上门。母子在里间等到脚步远去。' }]
    : [
      { speaker: '巡吏', line: '这宅里有人吗？', action: '巡吏提灯停在门外。赵氏把政往里抱了抱。' },
      { speaker: '田伯', line: '这宅里住着几位妇人，没见生人经过。', action: '田伯隔门应答。门没开。巡吏停了片刻，提灯走了。' },
    ];
  return [
    ...resolution,
    { speaker: '田伯', line: ROUTES[route].memory },
    { speaker: '政', line: '灯呢？' },
    { speaker: '赵氏', line: '天亮再点。' },
  ];
}

const scene = (title, note, lines) => ({
  title, note, lines: lines.map(([speaker, line]) => ({speaker, line})),
});

export const letterPages = {
  watch: scene('案上留一处', '夜里，驿人把一封边报搁在席左，抖掉袖口的尘土。', [
    ['值夜小吏','还湿着。灯挪过来些，我好抄一份给门外的人。'],
  ]),
  first: scene('先到的边报', '封绳已经解开。右半边的席子还空着。', [
    ['边报','诸侯合兵攻秦，寿陵已失。'],
    ['政','他们退了么？'],
    ['值夜小吏','送这封信的人动身时，还没退。再往后的事，我不敢替他写。'],
    ['政','那一处留着。'],
  ]),
  later: scene('后来，又来了一封', '后来的一次值夜，短灯芯照着席右的新牍。两处日次各异。', [
    ['后报','秦已出兵，诸侯罢兵退去。'],
    ['值夜小吏','上回空着的那个字，今天才写得下。'],
    ['政','现在可以抄给门外的人了。'],
  ]),
  entry: scene('临淄清晨', '坊门尚闭，街上传来挪筐声。书房里有人开了窗。', [
    ['掌书','你去坊门么？若得空，先替我认认这两束旧书上的地名。'],
  ]),
  shelf: scene('旧书还能寄往哪里', '蒲席上的两束旧来书，一束有指印，一束系着认人的短结。', [
    ['新吏','这束写着大梁。那一束的绳子，怎么还多打了个结？'],
    ['掌书','你先拆一封。'],
  ]),
  wei: scene('大梁来书', '新吏翻过封背，旧指印旁有两个小字「已收」。', [
    ['旧书','若齐地能接济这批粮，烦把回书仍交大梁当值人。'],
    ['新吏','这指印是送粮的人按的么？'],
    ['掌书','是我们收书的人按的。那时还知道回给谁。'],
  ]),
  yan: scene('燕地来书', '另一色的绳结系在封上。收书簿里也记着「已收」。', [
    ['旧书','留在齐地的几位使者，还能一道北归么？回程相认，就凭这个结。'],
    ['掌书','结还好好的。认这个结的人，后来去了哪里？'],
  ]),
  register: scene('候议', '收书簿的下一页夹着一枚窄签，上面写着「候议」。', [
    ['掌书','那几年，临淄的市照开。朝里说，再看一看，还来得及。'],
    ['新吏','收书簿翻完了。后来的回书放在哪一格？'],
    ['掌书','把底下那几枚年签翻过来。'],
  ]),
  years: scene('旧簿上的年签', '写着魏廷、燕廷的收处木签，已从寄送格移到存档格。', [
    ['前225年 · 大梁','魏亡。大梁仍是许多人的故乡，给魏廷的回书却已无处投递。'],
    ['燕地旧记','蓟失守后，燕廷北迁。到前222年，燕王喜被俘，簿上的燕廷收处也撤下了。'],
    ['前221年 · 临淄','新吏提起笔，又放下：“地名我会写。交给谁？”'],
  ]),
  door: scene('门外有人', '掌书把旧书归了架，铺平席角。门帘一动，席上仍空着。', [
    ['市人','明早，坊门还开么？'],
    ['掌书','进来说。'],
  ]),
};

export const firstEcho = {
  wei: {speaker:'市人', line:'这只斗是空的。坊门开了，我在哪儿量明早的粮？', beat:'gate', note:'市人把空粮斗搁在门内，等掌书点头。'},
  yan: {speaker:'市人', line:'这位老人和我同坊。他说的那个旧里名，我认得，先替他报上。', beat:'register', note:'老人跟到书房门前，市人替他报出旧里名。'},
};

export function validRead(read) {
  return Array.isArray(read) && read.length <= 2 && read.every(id => ['wei','yan'].includes(id)) && new Set(read).size === read.length;
}
export const qinPage = page => ['watch','first','later'].includes(page);
export function validLetterState(state) {
  if (!state || !validRead(state.read)) return false;
  const {page, read} = state;
  if (qinPage(page) || ['entry','shelf'].includes(page)) return !read.length;
  if (['wei','yan'].includes(page)) return read.at(-1) === page;
  if (['register','years','door'].includes(page)) return read.length > 0;
  return page === 'market';
}
export function letterMemory(heard, read = []) {
  if (!read.length) return heard ? '咸阳值夜时，你亲眼见到第二封边报填上了空席。' : '';
  const first = read[0] === 'wei' ? '大梁问粮' : '燕地问使';
  return '你先拆了' + first + '的旧书。' + (heard ? '咸阳等来了后报；临淄来问的是坊里人。' : '临淄的旧书归了架，来问明早开市的是坊里人。');
}

export const reportHistory = {
  kind:'合纵攻秦与两封边报', paragraphs:[
    '《史记·秦始皇本纪》在秦王政六年记诸国攻秦、取寿陵，秦出兵后诸侯退去。不同篇目的参战名单有异，这里的边报只称“诸侯”。',
    '值夜、两次报信、案席和对话为本作演绎。两封之间经过多少天，未设定确切日数。',
  ], sources:[['《史记·秦始皇本纪》','https://www.shidianguji.com/book/SK0699/chapter/1l9xmhdlbg8wa']],
};
export const archiveHistory = {
  kind:'齐廷观望与两封旧书', paragraphs:[
    '《田敬仲完世家》记齐地久未受兵，也写君王后周旋于秦与诸侯之间。君王后去世后，篇中把不助五国与后胜及宾客相联系，这是史家的解释。',
    '前225年魏亡，前222年燕王喜被俘，前221年齐降。撤下的是两处朝廷的收书签。地名和生活在那里的人仍然存在。',
    '两封来书、指印、绳结及候议签为本作拟写，未给旧书设定具体寄信日。',
  ], sources:[['《史记·田敬仲完世家》','https://www.chinakongzi.org/kzsf/wxxs/mingpian/shiji/200705/t20070524_25200.htm'],...reportHistory.sources],
};

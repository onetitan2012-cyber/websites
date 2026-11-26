export const ZHAO_HISTORY = {
  kind: '赵地记事 · 史实与演绎',
  paragraphs: [
    '《赵世家》记赵王迁三年李牧在肥下退秦，四年又在番吾退秦。《廉颇蔺相如列传》叙李牧遭杀、司马尚去职。秦随后取邯郸，俘赵王迁。',
    '《秦始皇本纪》十九年另记政返邯郸报复、公子嘉在代自立。二十五年，秦在辽东得燕王喜，随后俘代王嘉。两地的事相隔六年。',
    '阿禾、平、陶摊、半月记以及两次托信均为本作演绎。平随迁居的人去代地。渡亭见于游戏中的燕地。'
  ],
  sources: [['《史记·赵世家》','https://zh.wikisource.org/wiki/史記/卷043'],
    ['《史记·廉颇蔺相如列传》','https://zh.wikisource.org/wiki/史記/卷081'],
    ['《史记·秦始皇本纪》','https://zh.wikisource.org/wiki/史記/卷006']]
};
export const thankYou = '肥下那年，邯郸西巷的窑又开过火。陶人平谢。';
export function ferryLetter(yard, order, [name, place]) {
  if (!yard?.sawTablet) return null;
  const proof = yard.key === 'record'
    ? '书佐取出邯郸寻人的抄件。那行“平”字旁边，还空着一格。'
    : '北行客提起半捆柴。平一下说出了卖薪人的称呼，还记得他家门槛缺了一个角。';
  const check = name ? place ? '姓名与旧里都已对上。' : '姓名可读，旧里待核。'
    : place ? '旧里相合，姓名待核。' : '两栏未齐，身份待核。';
  const reply = order === 'companions'
    ? '阿禾，碗还认得。再问起我，找同船过来的人。'
    : place ? '阿禾，碗还认得。让人照邯郸旧里来翻这册。' : '阿禾，碗还认得。来处那一栏，等我自己来指。';
  return { proof, check, reply };
}

const line = (speaker, text) => ({ speaker, line: text });
function sceneSwipe(trigger) {
  const scene = document.getElementById('scene');
  const controller = new AbortController();
  const options = {signal:controller.signal};
  let start;
  scene.classList.add('zhao-swipe');
  scene.addEventListener('pointerdown', e => {
    if (!e.isPrimary || e.target.closest('button,a')) return;
    start = {x:e.clientX,y:e.clientY};
    scene.setPointerCapture(e.pointerId);
  }, options);
  scene.addEventListener('pointerup', e => {
    if (start && Math.abs(e.clientX-start.x)>36 && Math.abs(e.clientY-start.y)<45) trigger.click();
    start = null;
  }, options);
  scene.addEventListener('pointercancel', () => { start=null; }, options);
  return () => { controller.abort(); scene.classList.remove('zhao-swipe'); };
}

function passage(ui, title, beat, note, lines, action, next, swipe=false) {
  ui.setPhase('chapter','赵地记事',title);
  document.getElementById('chapter-name').textContent = '退回的信';
  document.getElementById('chapter-region').textContent = '赵国 · 邯郸';
  document.title = '退回的信 · 帝王传说';
  ui.updateScene('zhao','邯郸 · 西巷陶摊',note,{storyBeat:beat});
  let release;
  ui.sequence(lines, () => { release?.(); next(); }, action);
  const advance=ui.content.querySelector('.primary');
  if (swipe) release=sceneSwipe(advance);
  advance.focus({preventScroll:true});
}
export function playMarket(ui, finish) {
  ui.date('约前233年 · 肥下之后');
  passage(ui,'碗敢摆出来了','covered','肥下退秦的消息传到邯郸。向旁边揭开苇席，看第一位客人来取什么。',
    [line('客人','听说李牧把秦军挡回去了。上回说等下个集。还算数么？')],'把碗摆出来',() => {
      ui.tone(330,.09,.020); ui.tone(412,.12,.016,.22);
      passage(ui,'西巷开集','uncovered','两只碗落了案。阿禾把裂了一道细纹的那只留下。',
        [line('平','算。你翻过来，底下刻着你的那一只。'),line('阿禾','哥，刚才你念的那句，我替你写下来。')],
        '看牍尾的记号',() => {
          passage(ui,'写给李牧','thanks','平在牍尾刻下半月记，和碗底的是同一个记号。',
            [line('木牍正面',thankYou)],'到下一年集日',() => {
              ui.date('约前232年 · 番吾之后');
              passage(ui,'又过了一次集日','chipped','番吾再次退秦。去年买碗的人带着缺口的碗回来了。',
                [line('阿禾','哥，那枚牍还搁在你案角呢。')],'听平收摊',closing);
              ui.content.querySelector('.actions').append(ui.button('看看碗口','text-button',() => {
                passage(ui,'磨平碗口','rim','平把碗在指间转了一下，缺口在拇指下停住。',
                  [line('客人','用了一年，不舍得扔。这个口，你替我磨平些。')],'听平收摊',closing);
              }));
            });
        });
    },true);
  function closing() {
    passage(ui,'收摊','thanks','谢牍收进陶作的木匣里。',[
      line('平','等哪天碰上个往营里去的，捎过去。就这几句话，用不着专门跑。')
    ],ui.sample?'几年后 · 回到邯郸':'继续第六章 · 去新郑',finish);
  }
}

export function playReturnedTablet(ui, sawMarket, done) {
  ui.date('前229年至前228年 · 邯郸');
  passage(ui,'收件人的名字还在','sent','赵地再次告急。平这回请往营里去的熟人带上了谢牍。',[
    line('阿禾',sawMarket?'那封信，你总算让人捎去了。':'我哥叫平，在这条巷里烧碗。李牧守住肥下那年，他请人写了封谢信。'),
    line('叙事','次日，门外又响起那个人的脚步。')
  ],'听门外的人说',() => {
    passage(ui,'退回的信','returned','送信人将系着原结的木牍放回案上。',
      [line('送信人','没人收。我想，还是还给你哥。')],'翻看退牍',() => {
        passage(ui,'旧牍正面','thanks','绳结从牍边褪下，半月记已经磨浅。',[
          line('木牍正面',thankYou),line('叙事','赵廷撤换将领，李牧被杀，司马尚去职。')
        ],'翻到背面',() => {
          passage(ui,'背面留着','blank','背面尚无一字。阿禾把同记号的裂碗握在手里。',[
            line('叙事','前228年，秦军攻破邯郸，俘赵王迁。'),
            line('平','碗你留着。等我在北边找到落脚的地方，就给你捎话。')
          ],'送兄长出门',() => {
            passage(ui,'向北的人','gone','平带走了旧牍，摊上只剩一只裂碗。',[
              line('叙事','同年，赵公子嘉率宗族到代地自立。阿禾留在邯郸，兄长平随迁居的人北去。')
            ],'推开旧院门',done);
          });
        });
      },true);
  });
}

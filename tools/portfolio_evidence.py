"""Public project stories and self-contained demonstration markup."""

ACT_SCENE = '''<section class="game-stage" id="motion" aria-label="浅滩场景实机片段"><figure class="game-film"><video controls playsinline preload="none" width="1280" height="720" poster="../assets/showcase/images/act-water-motion.jpg" aria-label="浅滩场景实机片段，约十二秒"><source src="../assets/showcase/motion/shallow-water.mp4" type="video/mp4">浏览器无法播放时，可<a href="../assets/showcase/motion/shallow-water.mp4">打开实机片段</a>。</video><figcaption><strong>浅滩场景 · 12 秒实机片段</strong><span>角色动作与水面互动 · 静音</span></figcaption></figure></section>'''

ACT_DEMO = '''<section class="case-section" id="mechanics"><h2>拿盾的对手，<br>怎样应对？</h2><div>
<div class="motion-player" data-frames="96" data-fps="12" data-base="../assets/showcase/motion/shield/" aria-label="剑盾防守与反击演示">
<img class="motion-frame" src="../assets/showcase/motion/shield/000.jpg" alt="测试场景中的剑盾对手，演示格挡后的反击动作" width="1280" height="720">
<div class="motion-controls"><button type="button" data-play aria-pressed="false">播放演示</button><label class="sr-only" for="motion-seek">动作演示进度</label><input id="motion-seek" type="range" min="0" max="95" value="0" step="1"><output data-time for="motion-seek">0.0 / 8.0 秒</output></div><p data-status aria-live="polite">点击播放，观察举盾、出手和收势。</p></div>
<p class="media-caption">剑盾防守与反击 · 8 秒机制演示。测试场景中按固定条件触发格挡，展示一次反击的动作衔接。</p>
<div class="decision-story"><h3>同一种进攻，遇到不同的应对。</h3><p>我给剑盾对手设计了明确的防守规则：挡住轻击后有机会反击，面对重劈则会消耗防守。玩家可以继续压盾，也可以闪身或绕侧找空档。</p><p>我调整了防守规则、反击时机和动作衔接，并把镜像、长柄、剑盾放进同一场景比较。上面展示的是机制测试；完整对战的手感需要结合实际试玩判断。</p></div>
</div></section>'''

MONEY_STORY = '''<section class="case-section"><h2>保存之前，<br>留一次确认。</h2><div class="decision-story"><h3>说一句，再看一眼。</h3><p>语音输入很方便，但金额和内容仍需要核对。我把确认和修改放在保存之前，录入有误就当场改好，不用存下来后再回去找。</p></div></section>'''

QG_STORY = '''<section class="case-section"><h2>以巴西这一款为例。</h2><div class="decision-story"><span class="section-number">一个具体的视觉选择</span><h3>把雨林的印象，放进鞋本身。</h3><p>Amazon Samba 用黄绿蓝确定第一眼的气质，再把叶脉和羽毛般的纹理放进鞋面，让自然主题进入造型和材质。森林背景负责补充气氛，鞋本身也要能讲清主题。</p><p>我负责主题设定、视觉方向和画面取舍，并借助 AI 工具制作与调整。主视觉、多角度画面和上脚场景，一起呈现这一款概念设计。这里展示的是视觉概念，不代表实物样鞋或已经完成生产验证。</p></div></section>'''

SPORTS_FLOW = '''<section class="sports-showcase sports-flow-compact" aria-label="我的足球生涯使用流程示意"><div class="sports-flow-heading"><span class="section-number">WATCH → IPHONE</span><h2>场上少操作，赛后慢慢看。</h2><p>使用流程示意</p></div><ol class="sports-steps"><li><span class="flow-number">01 / APPLE WATCH</span><h3>在手表上记录</h3><p>开始一次足球运动，把注意力留在球场上。</p></li><li><span class="flow-number">02 / IPHONE</span><h3>整理这场比赛</h3><p>导入运动记录，补充比赛信息和自己的感受。</p></li><li><span class="flow-number">03 / REVIEW</span><h3>留下比赛回顾</h3><p>回看跑动与运动强度，把高光时刻整理进战报。</p></li></ol></section>'''

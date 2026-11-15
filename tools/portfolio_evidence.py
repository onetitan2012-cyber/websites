"""Public project stories and self-contained demonstration markup."""

ACT_DEMO = '''<section class="case-section" id="motion"><h2>看一段动作，<br>再聊我是怎么做的。</h2><div>
<div class="motion-player" data-frames="96" data-fps="12" data-base="../assets/showcase/motion/shield/" aria-label="剑盾防守与反击演示">
<img class="motion-frame" src="../assets/showcase/motion/shield/000.jpg" alt="测试场景中的剑盾对手，演示格挡后的反击动作" width="1280" height="720">
<div class="motion-controls"><button type="button" data-play aria-pressed="false">播放演示</button><label class="sr-only" for="motion-seek">动作演示进度</label><input id="motion-seek" type="range" min="0" max="95" value="0" step="1"><output data-time for="motion-seek">0.0 / 8.0 秒</output></div><p data-status aria-live="polite">点击播放，观察举盾、出手和收势。</p></div>
<p class="media-caption">剑盾防守与反击 · 8 秒机制演示。画面来自游戏测试场景，格挡接触按固定条件触发，用来展示动作和节奏。</p>
<div class="decision-story"><span class="section-number">一个具体的设计选择</span><h3>让拿盾的对手，真的有自己的打法。</h3><p>如果对手只是换了武器，玩家仍然可以用同一种方式打。我给剑盾对手设计了更明确的防守特点：挡住轻击后，有机会快速反击；面对重劈，盾防会被明显消耗。玩家可以继续压盾，也可以闪身或绕侧找空档。</p><p>我完成了防守规则、反击时机和动作衔接，并把镜像、长柄、剑盾放进同一场景切换比较。上面的片段展示了其中一次反击；完整对战的手感仍需要结合实际试玩判断。</p></div>
<figure class="scene-film"><video controls playsinline preload="none" poster="../assets/showcase/images/act-water.jpg" aria-label="浅滩场景动态演示"><source src="../assets/showcase/motion/shallow-water.mp4" type="video/mp4">浏览器无法播放时，可<a href="../assets/showcase/motion/shallow-water.mp4">打开浅滩演示</a>。</video><figcaption>浅滩场景动态片段 · 静音。看角色进入水面后，水纹怎样随动作变化。</figcaption></figure>
</div></section>'''

MONEY_STORY = '''<section class="case-section"><h2>一句话之后，<br>还要能放心存下来。</h2><div class="decision-story"><span class="section-number">一个具体的设计选择</span><h3>把确认和修改留在保存之前。</h3><p>语音输入很方便，但金额和内容仍需要核对。我把流程做成“说一句 → 看一眼 → 确认保存”：录入后先展示这笔账，金额或分类不对，可以当场修改，不用保存后再回去找。</p><p>上面的两张界面正好对应录入和确认。我完成了这段交互、iOS 功能开发，以及用于上架的产品介绍和支持页面。现在别人可以直接从 App Store 下载使用。</p></div></section>'''

QG_STORY = '''<section class="case-section"><h2>以巴西这一款为例。</h2><div class="decision-story"><span class="section-number">一个具体的视觉选择</span><h3>把雨林的印象，放进鞋本身。</h3><p>Amazon Samba 用黄绿蓝确定第一眼的气质，再把叶脉和羽毛般的纹理放进鞋面，让自然主题进入造型和材质。森林背景负责补充气氛，鞋本身也要能讲清主题。</p><p>我负责主题设定、视觉方向和画面取舍，并借助 AI 工具制作与调整。主视觉、多角度画面和上脚场景，一起呈现这一款概念设计。这里展示的是视觉概念，不代表实物样鞋或已经完成生产验证。</p></div></section>'''

SPORTS_FLOW = '''<section class="sports-showcase" aria-label="我的足球生涯使用流程示意"><div class="sports-flow-heading"><span class="section-number">WATCH → IPHONE</span><h2>场上记录，<br>赛后慢慢看。</h2><p>使用流程示意 · 非 App 截图</p></div><ol class="sports-steps"><li><span class="flow-number">01 / APPLE WATCH</span><div class="watch-illustration" aria-hidden="true"><span>足球运动</span><strong>准备开始</strong><i>开始记录</i></div><h3>开始记录</h3><p>在手表上开始一次足球运动，踢球时让记录在腕上进行。</p></li><li><span class="flow-number">02 / IPHONE</span><div class="phone-illustration" aria-hidden="true"><strong>比赛档案</strong><span>一次比赛或训练</span><div class="route-symbol">↗</div><span>路线 · 运动记录 · 回顾</span></div><h3>整理成一场比赛</h3><p>结束后，在手机上导入、归档，再补充自己的赛后回顾。</p></li><li><span class="flow-number">03 / REVIEW</span><div class="review-illustration" aria-hidden="true"><span>跑到哪里</span><span>运动强度</span><span>这场的感受</span></div><h3>把数据和感受放一起</h3><p>回看路线与表现，逐渐积累自己的足球运动档案。</p></li></ol></section>'''

SPORTS_STORY = '''<section class="case-section"><h2>复杂的部分，<br>留在产品背后。</h2><div class="decision-story"><span class="section-number">一个具体的产品选择</span><h3>踢球时，尽量不用拿出手机。</h3><p>我把场上开始和保存运动交给 Watch，把归档、路线处理和赛后回顾放在 iPhone。这样使用者可以先踢球，结束后再整理这场比赛。</p><p>我正在完成这两个端的界面和开发，也在处理记录导入、位置数据和球场映射等衔接。位置记录不足以支持可靠展示时，产品需要把这个限制告诉使用者，避免让一张热图显得比数据本身更确定。</p></div></section>'''

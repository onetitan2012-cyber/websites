#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the static portfolio from public-facing content only."""
from pathlib import Path
from html import escape as e
from urllib.parse import quote
import json
import sys
from portfolio_evidence import ACT_DEMO, MONEY_STORY, QG_STORY, SPORTS_FLOW, SPORTS_STORY
ROOT=Path(__file__).resolve().parents[1]
SLUGS=('act-demo','isavemoney','visual-creation','qg','sportsperformance','fantasy-creatures')
DATA={s:json.loads((ROOT/'content/projects'/s/'metadata.yaml').read_text(encoding='utf-8')) for s in SLUGS}
CAT=json.loads((ROOT/'content/catalog.json').read_text(encoding='utf-8'))
BOOTS='images/Soccer-boots/'
PREVIEW='--preview' in sys.argv
PUBLIC_URL='https://www.ponghood.com/'

def image(src,alt,p='',cls='',eager=False):
    dimensions=' width="1536" height="1024"' if src.endswith(('fantasy-rose-antlers.jpg','fantasy-fern-creature.jpg')) else ' width="1672" height="941"' if src.startswith('assets/showcase/images/fantasy-') else ''
    return f'<img src="{p}{quote(src,safe="/")}" alt="{e(alt)}" class="{cls}"{dimensions} loading="{"eager" if eager else "lazy"}" decoding="async">'
def img(name,alt,p='',cls='',eager=False):return image('assets/showcase/images/'+name,alt,p,cls,eager)
def button(url,label,cls='button'):return f'<a class="{cls}" href="{e(url)}">{e(label)} <span aria-hidden="true">↗</span></a>'
def heading(n,title,extra=''):return f'<div class="section-heading"><div><span class="section-number">{n}</span><h2>{title}</h2></div>{extra}</div>'
def section(title,content,id=''):return f'<section class="case-section"'+(f' id="{id}"' if id else '')+f'><h2>{title}</h2><div>{content}</div></section>'
def story(title,text):return f'<article><h3>{title}</h3><p>{text}</p></article>'

def shell(title,desc,body,p='',library=False,legacy=False,social=None):
    scripts=(f'<script src="{p}assets/showcase/library.js" defer></script>' if library else '')+(f'<script src="{p}assets/showcase/navigation.js" defer></script>' if legacy else '')
    socialbase=p if PREVIEW else PUBLIC_URL
    socialtag=f'<meta property="og:image" content="{socialbase}{quote(social,safe="/")}">' if social else ''
    return f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#101615"><title>{e(title)} · PONGHOOD</title><meta name="description" content="{e(desc)}"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}">{socialtag}<link rel="stylesheet" href="{p}assets/showcase/style.css">{scripts}</head><body>
<a class="skip" href="#main">跳到正文</a><div class="preview-line">本地预览 · 尚未发布</div><header class="site-header"><div class="wrap nav"><a class="brand" href="{p}index.html" aria-label="PONGHOOD 首页"><span class="brand-mark" aria-hidden="true"></span><span class="brand-name">PONGHOOD<span class="brand-sub">ONETITAN’S CREATIVE LAB</span></span></a><nav class="nav-links" aria-label="主导航"><a href="{p}index.html">首页</a><a href="{p}works.html">作品</a><a href="{p}reading.html">文章与研究</a><a href="{p}index.html#about">关于我</a></nav></div></header>{body}
<footer class="wrap footer"><span>© 2026 ONETITAN / 张谦 · PONGHOOD</span><div class="footer-links"><a href="{p}works.html">作品</a><a href="{p}reading.html">文章与研究</a><a href="{p}collections/calligraphy.html">张毅书法</a><a href="{p}support.html">产品支持与隐私</a></div></footer></body></html>'''

def featured(slug):
    d=DATA[slug];url=f'projects/{slug}.html'
    if slug=='act-demo':media=img('act-desert.jpg','动作游戏中的沙漠对战');cls='';label='独立开发三维动作游戏'
    elif slug=='isavemoney':
        media='<div class="money-word">'+img('isavemoney-icon.jpg','小钱图标')+'<span>一句话<br>记下每一笔</span></div>'+img('isavemoney-use-4.jpg','小钱的语音记账界面',cls='store-screen');cls=' money-media';label='独立完成 iOS App 全流程'
    else:media=image(BOOTS+'Amazon samba.jpg','NationKicks 巴西主题概念足球鞋');cls=' visual-media';label='视觉设计与资产制作'
    series='<div class="series-links"><a href="projects/fantasy-creatures.html">幻想生物 ↗</a><a href="projects/qg.html">NationKicks ↗</a></div>' if slug=='visual-creation' else ''
    action=button(url+'#motion','看 8 秒动作演示','card-link') if slug=='act-demo' else button(url,'看作品','card-link')
    return f'<article class="work-card"><a class="work-media{cls}" href="{url}" aria-label="查看{e(d["title"])}">{media}</a><div class="work-body"><div class="card-meta"><span>{e(d["title"])}</span><span class="badge">{e(d["status"])}</span></div><h3><a href="{url}">{label}</a></h3><p>{e(d["summary"])}</p>{series}{action}</div></article>'

def homepage():
    body=f'''<main id="main"><div class="wrap"><section class="hero compact-hero portfolio-hero"><div class="hero-copy"><div class="eyebrow">ONETITAN / 张谦 · 设计师，独立开发者</div><h1>我做设计，<br>也开发<em>游戏和 App</em>。</h1><p>从三维动作游戏、上架的记账 App，到视觉概念设计。<br>这里是我的作品，以及做它们的过程。</p><div class="actions">{button('#works','看我的作品')}{button('#about','认识我','text-link')}</div></div><figure class="hero-art"><a href="projects/fantasy-creatures.html" aria-label="查看幻想生物系列">{img('fantasy-orchid-birds.jpg','兰花的形态融入蜂鸟的羽翼，栖息在雨林枝头',cls='hero-shot',eager=True)}</a><figcaption class="shot-caption"><div><strong>给想象，一个可信的模样。</strong><span>幻想生物 · 动植物融合概念</span></div><a class="shot-arrow" href="projects/fantasy-creatures.html" aria-label="查看幻想生物作品">↗</a></figcaption></figure></section>
<section id="works" class="section featured-section">{heading('01 / SELECTED WORKS','先看这三组作品。')}<div class="works-grid">{''.join(featured(s) for s in SLUGS[:3])}</div></section>
<section id="now" class="section now"><div><span class="section-number">02 / IN PROGRESS</span><h2>最近在做</h2><p>一个给踢球的人用的 App。</p></div><article class="now-row"><div class="pitch" aria-hidden="true"></div><div><span class="badge">开发中 · 内测</span><h3>SportsPerformance</h3><p>把 Apple Watch 的场上记录和 iPhone 的赛后回顾接起来。我正在把产品设计、双端开发和运动数据，做成一次顺手的使用体验。</p>{button('projects/sportsperformance.html','了解这个项目','card-link')}</div></article></section>
<section class="section more-section">{heading('03 / MORE TO EXPLORE','还有一些不同的尝试。',button('works.html','浏览全部作品','text-link'))}<div class="notes"><a class="note" href="works.html#spatial"><span>互动空间</span><h3>把城市、园林和建筑，<br>做成可以逛的地方。</h3><p>牛津、西湖、圆厅别墅等作品 ↗</p></a><a class="note" href="works.html#game"><span>游戏与互动</span><h3>几分钟就能上手，<br>也能玩出点意思。</h3><p>兽星球场、诗人三缺一与小游戏 ↗</p></a><a class="note" href="works.html#app"><span>独立 App</span><h3>生活里的小麻烦，<br>试着用自己的工具解决。</h3><p>记账、物品定位与个人记录 ↗</p></a></div></section>
<section id="notes" class="section">{heading('04 / READING','做东西，也写点东西。',button('reading.html','文章与研究','text-link'))}<div class="notes"><a class="note" href="collections/technology.html"><span>产品体验</span><h3>一副智能眼镜，<br>戴久了才知道的事。</h3><p>日常使用、比较与产品观察 ↗</p></a><a class="note" href="collections/vr.html"><span>VR 研究</span><h3>走进虚拟世界，<br>什么决定了体验好不好？</h3><p>沉浸感、舒适度与交互 ↗</p></a><a class="note" href="collections/game-design.html"><span>游戏与设计</span><h3>喜欢一个作品之后，<br>再想想它为什么成立。</h3><p>游戏评论与设计思考 ↗</p></a></div></section></div>
<section id="about" class="about"><div class="wrap about-inner"><div><span class="eyebrow">ABOUT ME</span><h2>你好，我是张谦。<br>也叫 ONETITAN。</h2><p>我学过工业设计和游戏设计，也长期做智能硬件与产品研发。现在，我把这些经验用在自己的游戏、App 和视觉作品里。PONGHOOD 是放这些作品的地方，也记录我一路做下来的想法。</p><a class="text-link" href="alumni-interview-zhangqian.html">读一篇关于我的采访 ↗</a></div><div class="about-detail"><h3>有具体的想法，欢迎一起聊聊。</h3><p>可以聊产品、游戏、视觉设计，<br>也欢迎讨论项目合作、分享和讲座。</p><a class="contact-link" href="mailto:onetitan@hotmail.com">onetitan@hotmail.com ↗</a><p class="about-more"><a href="qian-skills-showcase.html">更多背景与经历 ↗</a></p></div></div></section></main>'''
    return shell('张谦 ONETITAN · 设计、游戏与 App','我做设计，也开发游戏和 App。欢迎看看我的作品。',body,legacy=True,social='assets/showcase/images/fantasy-orchid-birds.jpg')

def act_content():
    gallery='<div class="gallery">'+''.join(f'<figure><a href="../assets/showcase/images/{f}">{img(f,a,"../")}</a><figcaption>{a} · 实机画面</figcaption></figure>' for f,a in [('act-desert.jpg','荒沙孤杨'),('act-roof.jpg','檐脊对月'),('act-water.jpg','雾岭浅滩')])+'</div>'
    return f'<figure class="project-cover">{img("act-desert.jpg","沙漠场景中的角色对战","../",eager=True)}<figcaption>游戏实机画面</figcaption></figure>'+section('这个 Demo 里，<br>我完成了什么？','<div class="timeline">'+story('把角色做进游戏','从角色素材的整理、装配和材质，到动作接入与操作控制，我把角色一步步做成了能在场景里行动和战斗的人物。')+story('把动作做成玩法','攻击、防守、闪避和拳腿动作需要互相配合。我反复调整出手的节奏、命中的时机，以及对手怎样应对。')+story('让不同对手有不同打法','镜像、长柄和剑盾带来不同的距离和节奏。换一个对手，玩家也需要换一种应对方式。')+story('搭建能承载战斗的场景','沙漠、月夜屋顶和浅滩有不同的空间与气氛。我把它们和角色、镜头、战斗一起调整，最后做成可运行的 Demo。')+'</div>','journey')+section('换一个地方，<br>看看这场交锋。',gallery,'scenes')+ACT_DEMO+section('做下来，<br>最花心思的部分','<div class="lessons">'+story('让每一次出手都说得通','动作看着顺，还要打得合理。长柄武器的距离、盾牌的防守、攻击后的空档，都要放到实际对战里反复体会。')+story('让场景和玩法一起成立','场景需要有气氛，也要看得清、站得住、打得起来。角色放进去之后，很多构图和空间关系都需要重新考虑。')+'</div>','lessons')+section('关于这个作品','<p>这是我独立开发的个人游戏 Demo，目前暂未开放下载。制作中使用了 AI 工具及第三方角色、动作素材；这里主要展示我的制作、整合和玩法开发工作。</p>','boundaries')

def money_content():
    cover=f'<section class="app-showcase"><div>{img("isavemoney-icon.jpg","小钱图标","../",cls="app-icon",eager=True)}<h2>记录，确认，存下来。</h2><p>语音录入后，金额和内容都可以再检查一遍。</p></div><div class="phone-pair">{img("isavemoney-use-4.jpg","小钱语音录入界面","../",eager=True)}{img("isavemoney-use-5.jpg","小钱确认与修改记录界面","../",eager=True)}</div></section>'
    return cover+MONEY_STORY+section('从自己的需要出发','<p>我希望记账这件事足够简单。拿起手机，说清楚花了什么钱，确认一下，就可以继续忙自己的事。需要回看时，又能很快找到那一笔。</p>','intent')+section('从想法到上架，<br>我自己走了一遍。','<div class="timeline">'+story('产品与界面设计','确定日常记账最需要的流程，再把语音录入、确认修改和账单回看放到容易理解的界面里。')+story('iOS 开发','完成语音记账、记录查看、原声回放，以及本地备份和恢复等功能。')+story('把细节做顺','不断检查输入、修改、保存和回看之间的衔接，让一个小工具用起来尽量省心。')+story('完成 App Store 上架','整理产品介绍、展示图片、支持与隐私页面，完成应用上架，让别人也能下载使用。')+'</div>')+section('你可以这样用它','<p>手动输入或说一句话，保存前确认；按日回看账单，需要时听原声，也可以导出本地备份。小钱无需注册账号。</p>','boundaries')+section('下载与使用帮助','<div class="actions">'+button(DATA['isavemoney']['cta_url'],'前往 App Store')+button('../isavemoney-support.html','使用帮助','text-link')+button('../privacy-policy-isavemoney.html','隐私说明','text-link')+'</div>')

def boots_gallery(p='../'):
    return '<div class="visual-gallery">'+''.join('<figure>'+image(BOOTS+f,a,p)+'<figcaption>'+a+'</figcaption></figure>' for f,a in [('Amazon samba.jpg','巴西主题 · Amazon Samba'),('dragon vein rise.jpg','中国主题 · Dragon Vein Rise'),('black forest engine.jpg','德国主题 · Black Forest Engine')])+'</div>'

def visual_content():
    fantasy='<article class="series-feature" id="visual-series"><a href="fantasy-creatures.html" aria-label="浏览幻想生物系列">'+img('fantasy-orchid-birds.jpg','兰花与蜂鸟融合的幻想生物，栖息在雨林里','../',eager=True)+'</a><div class="series-copy"><span class="eyebrow">01 / FANTASY CREATURES</span><h2>让人相信，<br>它真的存在。</h2><p>我最在意的是融合的合理性。花与鸟、树与象，要成为一个说得通的生命，让人看到后觉得它可能真的存在。</p><p class="series-focus">生物概念 · 形态融合 · 场景气氛</p>'+button('fantasy-creatures.html','看幻想生物 · 7 幅作品','card-link')+'</div></article>'
    qg='<article class="series-feature"><a href="qg.html" aria-label="浏览 Q&G NationKicks 系列">'+image(BOOTS+'dragon vein rise.jpg','NationKicks 中国主题概念足球鞋，红金配色与蜿蜒的鞋身线条','../')+'</a><div class="series-copy"><span class="eyebrow">02 / Q&G · NATIONKICKS</span><h2>把文化印象，<br>变成鞋的性格。</h2><p>中国主题用红金与蜿蜒的线条，回应龙与山川；巴西主题把叶脉和羽毛般的纹理放进鞋面。主题也体现在鞋的造型与材质里。</p><p class="series-focus">主题设定 · 视觉方向 · AI 辅助制作</p>'+button('qg.html','看 Q&G 代表系列','card-link')+'</div></article>'
    contrast='<div class="theme-comparison"><figure>'+image(BOOTS+'Amazon samba.jpg','巴西主题：黄绿蓝与叶脉般的鞋面纹理','../')+'<figcaption><strong>巴西 · Amazon Samba</strong>黄绿蓝、叶脉与羽毛般的纹理，让鞋本身带出雨林的气质。</figcaption></figure><figure>'+image(BOOTS+'black forest engine.jpg','德国主题：黑银配色与硬朗的结构线条','../')+'<figcaption><strong>德国 · Black Forest Engine</strong>黑银配色与硬朗线条，让同一个产品有了更冷静的性格。</figcaption></figure></div>'
    game='<section class="case-section visual-in-use"><h2>再把画面，<br>放进能运行的游戏。</h2><div><figure class="scene-film"><video controls playsinline preload="none" poster="../assets/showcase/images/act-water.jpg" aria-label="浅滩场景动态演示"><source src="../assets/showcase/motion/shallow-water.mp4" type="video/mp4">浏览器无法播放时，可<a href="../assets/showcase/motion/shallow-water.mp4">打开浅滩演示</a>。</video><figcaption>动作游戏 Demo · 浅滩实机片段，静音</figcaption></figure><p class="application-note">我把角色素材、材质、动作和场景整合到游戏里，再结合镜头与玩法调整。这里可以看到角色进入水面后，水纹如何随动作变化。</p>'+button('act-demo.html#motion','看动作演示与制作过程','card-link')+'</div></section>'
    return fantasy+qg+contrast+game

def fantasy_content():
    def art(name,alt,caption,eager=False):
        src='fantasy-'+name+'.jpg'
        return '<figure><a href="../assets/showcase/images/'+src+'" aria-label="查看完整画面：'+e(alt)+'">'+img(src,alt,'../',eager=eager)+'</a><figcaption>'+caption+'</figcaption></figure>'
    birds=art('orchid-birds','兰花花瓣与蜂鸟羽翼融合，停在湿润的雨林枝头','01 / 花与羽翼 · 点开图片看完整画面',True)
    judgment='<aside class="design-note"><div><span class="eyebrow">我的设计判断</span><h2>融合得合理，<br>才让人相信。</h2></div><div><p>我最在意的是动植物融合的合理性。不是简单地把两种东西加在一起，而是让人看到后觉得：这个生物可能真的存在。</p><p>看这组作品时，可以留意形态怎样相接：花瓣顺着羽翼展开，枝条沿着鹿角分叉，树干延伸成象鼻。它们的连接方式，是理解这组设计的线索。</p></div></aside>'
    deer='<div class="art-study">'+art('rose-antlers','雾林中的鹿，角上生出带刺的枝条与玫瑰','02 / 花枝鹿角')+'<div><span class="eyebrow">看形态怎样连接</span><h2>从鹿角，<br>长出花枝。</h2><p>鹿角和枝条都有分叉的结构。花沿着这些分叉生长，保留了鹿角的轮廓，也延续了植物的生长方向。</p><p>融合的线索就在连接处：先看清一只鹿，再发现它的角有些不同。</p></div></div>'
    tree=art('banyan-elephant','巨大的榕树长出象鼻，伸入河水，岸边站着一只小鹿','03 / 榕树与象鼻 · 树干的走势延伸到水面，岸边的小鹿带出尺度。')
    more='<div class="gallery-interlude"><h2>同一个想法，<br>也有轻巧和有力的模样。</h2><p>蕨叶小兽靠轮廓让人联想到耳朵和尾巴；松羽之鹰则把松针、树皮与羽翼的层次交织在一起。</p></div><div class="fantasy-pair">'+art('fern-creature','林地上的蕨叶呈现小兽的耳朵与卷曲的尾巴','04 / 蕨叶小兽 · 叶片与卷曲的嫩芽，勾出小兽的轮廓。')+art('pine-eagle','松针与松果融入鹰的羽翼，在云雾山间展开','05 / 松羽之鹰 · 从羽翼的层次里，看到松林的形态。')+'</div>'
    water='<section class="habitat-pair" aria-labelledby="habitat-title"><div class="gallery-interlude"><h2 id="habitat-title">从一个生物，<br>看到一片生境。</h2><p>像叶片，也像展开双翼的鳐。两张画面放在一起，从水面的细节，看到它们与水鸟、莲花共同组成的湿地。</p></div><div class="fantasy-pair">'+art('leaf-wings-water','晨光中的水面，巨大叶片呈现鳐鱼般的双翼','06 / 水上叶翼 · 近看叶脉、水珠和水面的关系。')+art('leaf-wings-aerial','从空中俯瞰湿地，叶翼形态的幻想生物分布在莲花与水鸟之间','07 / 水上叶翼 · 俯瞰它们栖息的湿地。')+'</div></section>'
    return '<div class="fantasy-gallery" id="fantasy-gallery">'+birds+judgment+deer+tree+more+water+'</div><div class="actions">'+button('visual-creation.html','返回视觉创作')+button('qg.html','也看看 NationKicks','text-link')+'</div>'

def qg_content():
    return f'<figure class="project-cover">{image(BOOTS+"Amazon samba.jpg","Q&G 巴西主题概念足球鞋主视觉","../",eager=True)}<figcaption>NationKicks · 巴西主题概念设计</figcaption></figure>'+section('从足球文化，<br>找到造型的线索。','<p>巴西的雨林与鲜明色彩、中国的山川与建筑轮廓、德国的森林与机械印象，被转化成鞋面的纹理、结构和材质。这个系列里，我负责主题设定和视觉方向，并借助 AI 工具完成画面制作与调整。</p>')+QG_STORY+section('让一个想法，<br>看得更完整。','<div class="visual-gallery pair">'+''.join('<figure>'+image(BOOTS+f,a,'../')+'<figcaption>'+a+'</figcaption></figure>' for f,a in [('Amazon samba 3view.jpg','从不同角度看造型'),('Amazon samba on foot.jpg','放回使用场景里')])+'</div>')+section('八个主题，<br>各有自己的性格。','<p>完整系列还包括阿根廷、法国、荷兰、英格兰、日本等主题，也有巴西主题的短片。它们都是概念设计作品。</p><div class="actions">'+button('../nationkicks.html','浏览 NationKicks 完整系列')+button('visual-creation.html','返回视觉创作','text-link')+'</div>')

def sports_content():
    return SPORTS_FLOW+SPORTS_STORY+section('为什么想做它','<p>踢完一场球，除了比分，我也想知道自己跑得怎么样、运动强度如何，以及不同场次之间有什么变化。这个项目希望把场上的记录和赛后的理解接在一起。</p>')+section('我正在完成的，<br>是一整个使用过程。','<div class="timeline">'+story('场上用手表记录','让 Apple Watch 承担运动、心率和路线记录，尽量少打断踢球。')+story('赛后用手机回顾','在 iPhone 上整理运动记录、查看路线与表现，把数据放回一场具体的比赛或训练。')+story('让两端配合得自然','从开始记录到保存和查看，需要手机、手表和运动数据一起工作。我正在把这些部分做成连贯的体验。')+story('带到实际运动里继续改','通过内测观察记录是否方便、信息是否好懂，再调整产品。接下来会继续围绕真实使用完善。')+'</div>','progress')+section('目前的进展','<p>项目正在开发和内测中，目前没有公开下载入口。后续有适合分享的进展，会继续更新在这里。</p>','boundaries')

def project(slug):
    d=DATA[slug];content={'act-demo':act_content,'isavemoney':money_content,'visual-creation':visual_content,'qg':qg_content,'sportsperformance':sports_content,'fantasy-creatures':fantasy_content}[slug]()
    parent='visual-creation.html' if slug in ['qg','fantasy-creatures'] else '../works.html';parentlabel='视觉创作' if slug in ['qg','fantasy-creatures'] else '作品'
    if slug in ['visual-creation','fantasy-creatures','qg']:
        body=f'<main id="main" class="wrap art-page"><header class="art-intro"><div class="breadcrumb"><a href="{parent}">{parentlabel}</a> / {e(d["title"])}</div><span class="eyebrow">{e(d["type"])} · {e(d["status"])}</span><h1>{e(d["headline"]).replace(chr(10),"<br>")}</h1><p>{e(d["intro"])}</p></header>{content}<div class="backline">{button("../works.html","浏览其他作品","text-link")}{button("../reading.html","读一些文章","text-link")}</div></main>'
        social=BOOTS+'Amazon samba.jpg' if slug=='qg' else 'assets/showcase/images/fantasy-orchid-birds.jpg'
        return shell(d['title'],d['summary'],body,'../',social=social)
    body=f'<main id="main" class="wrap"><section class="project-hero"><div class="breadcrumb"><a href="{parent}">{parentlabel}</a> / {e(d["title"])}</div><span class="eyebrow">{e(d["type"])} · {e(d["status"])}</span><h1>{e(d["headline"]).replace(chr(10),"<br>")}</h1><p class="intro">{e(d["intro"])}</p><p class="contribution">{"我正在做的：" if slug=="sportsperformance" else "我完成的部分："}{e(d["contribution"])}</p><div class="actions">{button(d["cta_url"],d["cta_label"])}</div></section>{content}<div class="backline">{button("../works.html","浏览其他作品","text-link")}{button("../reading.html","读一些文章","text-link")}</div></main>'
    if slug=='act-demo': body += '<script src="../assets/showcase/motion.js" defer></script>'
    social=BOOTS+'Amazon samba.jpg' if slug=='qg' else 'assets/showcase/images/fantasy-orchid-birds.jpg' if slug in ['visual-creation','fantasy-creatures'] else None
    return shell(d['title'],d['summary'],body,'../',social=social)

CATEGORIES=[('all','全部'),('app','App'),('game','游戏'),('spatial','互动空间'),('visual','视觉设计'),('experience','体验设计')]
def search_ui(filters=None):
    btns=''.join(f'<button type="button" id="{key}" data-filter="{e(label)}" data-key="{key}" aria-pressed="{"true" if key=="all" else "false"}">{label}</button>' for key,label in filters) if filters else ''
    label='找一个作品或主题' if filters else '找一篇文章或一个主题'
    return f'<div class="catalog-controls"><label class="search-label" for="catalog-search">{label}</label><div class="search-box"><input id="catalog-search" type="search" placeholder="输入名称或关键词" autocomplete="off"><button type="button" data-clear>清空</button></div><div class="filters" aria-label="内容分类">{btns}</div><p class="result-count" data-count aria-live="polite"></p></div>'
def entry_card(x,p='',collection=False):
    url=p+x['url'];title=x['title'];cat=x.get('category') or CAT['collections'][x['collection']]['title'];desc=x.get('summary','') if not collection else ''
    thumb=image(x['thumbnail'],x.get('thumbnail_alt',title),p,cls='catalog-thumb') if x.get('thumbnail') and not collection else ''
    return f'<article class="catalog-item{" has-thumb" if thumb else ""}" data-category="{e(cat)}"><a href="{e(url)}">{thumb}<div class="catalog-copy"><span class="catalog-kicker">{e(cat)}</span><h2>{e(title)}</h2>{"<p>"+e(desc)+"</p>" if desc else ""}<span class="catalog-arrow" aria-hidden="true">↗</span></div></a></article>'
def listing_intro(kicker,title,intro):return f'<section class="listing-hero"><span class="eyebrow">{kicker}</span><h1>{title}</h1><p>{intro}</p></section>'
def works():
    body='<main id="main" class="wrap">'+listing_intro('WORKS','做过的作品，<br>都放在这里。','游戏、App、视觉设计，还有可以亲自逛一逛的互动空间。')+search_ui(CATEGORIES)+'<section data-catalog-group><h2 class="directory-group-title">先看作品画面</h2><div class="catalog-grid">'+''.join(entry_card(x) for x in CAT['works'] if x.get('thumbnail'))+'</div></section><section data-catalog-group><h2 class="directory-group-title">更多项目</h2><div class="catalog-grid compact-catalog">'+''.join(entry_card(x) for x in CAT['works'] if not x.get('thumbnail'))+'</div></section><p class="empty-results" data-empty hidden>没有找到相关作品。试试其他关键词，或清空搜索。</p><div class="backline">'+button('projects/visual-creation.html','单独看看视觉创作','text-link')+button('reading.html','文章与研究','text-link')+'</div></main>'
    return shell('作品','张谦的游戏、App、视觉设计与互动空间作品。',body,library=True)
def collection_card(key,p=''):
    d=CAT['collections'][key];n=sum(x['collection']==key for x in CAT['articles'])
    return f'<a class="collection-card" href="{p}collections/{key}.html"><span class="mono">{n} 篇</span><h2>{e(d["title"])}</h2><p>{e(d["summary"])}</p><span aria-hidden="true">↗</span></a>'
def reading():
    body='<main id="main" class="wrap">'+listing_intro('READING','做东西之外，<br>也想弄明白为什么。','这里有产品体验、游戏和设计研究，也有足球、文化与生活里的兴趣。可以按主题慢慢看。')+'<section class="section">'+heading('START HERE','先挑一个你感兴趣的主题。')+'<div class="collection-grid">'+''.join(collection_card(k) for k in ['technology','game-design','vr','culture','football','life'])+'</div></section><section class="section">'+heading('SPECIAL COLLECTIONS','另外两个独立栏目。')+'<div class="collection-grid">'+collection_card('calligraphy')+collection_card('intel')+'</div></section><section class="section">'+heading('ARTICLES','也可以直接找一篇。')+search_ui()+'<div class="catalog-grid reading-list">'+''.join(entry_card(x,collection=True) for x in CAT['articles'] if x['collection'] not in ['intel','calligraphy'])+'</div><p class="empty-results" data-empty hidden>没有找到相关文章。试试其他关键词。</p></section></main>'
    return shell('文章与研究','按主题阅读张谦的产品体验、设计研究与个人文章。',body,library=True)
def collection(key):
    d=CAT['collections'][key];items=[x for x in CAT['articles'] if x['collection']==key]
    if key=='intel':items.sort(key=lambda x:x['url'],reverse=True)
    body='<main id="main" class="wrap"><div class="breadcrumb top-breadcrumb"><a href="../reading.html">文章与研究</a> / '+e(d['title'])+'</div>'+listing_intro('COLLECTION',e(d['title']),e(d['summary']))+search_ui()+'<div class="catalog-grid reading-list">'+''.join(entry_card(x,'../',True) for x in items)+'</div><p class="empty-results" data-empty hidden>没有找到相关文章。试试其他关键词。</p><div class="backline">'+button('../reading.html','返回文章与研究','text-link')+'</div></main>'
    return shell(d['title'],d['summary'],body,'../',library=True)
def archive():
    body='<main id="main" class="wrap">'+listing_intro('EXPLORE','换个入口，继续逛。','作品和文章已经按内容重新整理。旧文章和作品仍然可以打开。')+'<div class="collection-grid"><a class="collection-card" href="works.html"><h2>作品</h2><p>App、游戏、视觉设计与互动空间。</p><span>↗</span></a><a class="collection-card" href="reading.html"><h2>文章与研究</h2><p>按主题阅读，或直接搜索一篇文章。</p><span>↗</span></a></div><section class="section">'+heading('TOPICS','也可以从熟悉的主题开始。')+'<div class="collection-grid">'+''.join(collection_card(k) for k in CAT['collections'])+'</div></section></main>'
    return shell('浏览全部内容','作品与文章的分类入口。',body,legacy=True)
def support():
    links=''.join(f'<li><a href="{e(x["url"])}">{e(x["title"])} ↗</a></li>' for x in CAT['product_help'])
    body='<main id="main" class="wrap">'+listing_intro('PRODUCT HELP','产品支持与隐私','使用中遇到问题，或想了解数据如何保存，可以在这里找到对应说明。')+f'<ul class="support-links">{links}</ul></main>'
    return shell('产品支持与隐私','查阅各产品的使用支持及隐私说明。',body)
def main():
    pages={'index.html':homepage(),'works.html':works(),'reading.html':reading(),'archive.html':archive(),'support.html':support()}
    pages.update({f'projects/{s}.html':project(s) for s in SLUGS});pages.update({f'collections/{s}.html':collection(s) for s in CAT['collections']})
    for name,html in pages.items():
        if not PREVIEW:
            url=PUBLIC_URL+('' if name=='index.html' else name)
            html=html.replace('<meta name="robots" content="noindex,nofollow">','<meta name="robots" content="index,follow">')
            html=html.replace('<div class="preview-line">本地预览 · 尚未发布</div>','')
            html=html.replace('</head>',f'<link rel="canonical" href="{url}"><meta property="og:url" content="{url}"><meta property="og:type" content="website"></head>')
        f=ROOT/name;f.parent.mkdir(parents=True,exist_ok=True);f.write_text(html,encoding='utf-8')
    print(f'Generated {len(pages)} public-facing pages.')
if __name__=='__main__':main()

/**
 * Cursor Particles Effect
 * 鼠标跟随星光粒子效果
 * 适配深色和浅色背景
 */

(function() {
  'use strict';

  // 配置
  const config = {
    particleCount: 180,       // 粒子数量（略微减少，避免拥挤）
    particleSize: 1.2,        // 粒子基础大小（更小更细）
    particleLife: 8000,       // 粒子生命周期(ms)（更长）
    spawnRate: 1,             // 每帧生成粒子数（极少，稀疏感）
    spreadRadius: 400,        // 扩散半径（更大范围）
    bgStarCount: 150,         // 背景静态星星数量（更多更细）
    connectionDistance: 0,    // 关闭连线
    followDelay: 0.02,        // 跟随延迟系数（极大延迟，像拖着走）
    driftSpeed: 0.08,         // 自然漂移速度（极慢）
    breathSpeed: 0.08,        // 呼吸速度（极慢）
    idleTimeout: 5000,        // 鼠标静止5秒后暂停动画
    lowPowerMode: false,      // 是否启用低功耗模式
    colors: {
      dark: ['#5E9CEA', '#7AB8FF', '#9ED0FF', '#64B5F6', '#42A5F5', '#90CAF9', '#A8D5FF'],  // 深色背景配色（更多蓝色层次）
      light: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#9B5DE5', '#F472B6']
    }
  };

  class CursorParticles {
    constructor(options = {}) {
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.bgStars = [];       // 背景静态星星
      this.mouseX = 0;
      this.mouseY = 0;
      this.lastMouseX = 0;     // 上次鼠标位置
      this.lastMouseY = 0;
      this.smoothMouseX = 0;   // 平滑后的鼠标位置（延迟跟随）
      this.smoothMouseY = 0;
      this.isActive = true;
      this.animationId = null;
      this.lastSpawn = 0;
      this.time = 0;           // 全局时间
      this.lastMouseMove = Date.now();  // 上次鼠标移动时间
      this.isIdle = false;     // 是否处于空闲状态
      this.frameCount = 0;     // 帧计数器（用于降低帧率）
      this.targetFPS = 60;     // 目标帧率
      
      // 合并配置
      this.config = { ...config, ...options };
      
      // 检测设备性能并调整配置
      this.detectDeviceCapabilities();
      
      this.init();
    }

    // 检测设备性能（E方案：设备适配）
    detectDeviceCapabilities() {
      // 检测是否为低端设备
      const isLowEnd = (
        navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
      
      // 检测是否省电模式（部分浏览器支持）
      const isSaveData = navigator.connection && navigator.connection.saveData;
      const isLowPower = navigator.getBattery ? false : false; // 异步检测，先设为false
      
      if (isLowEnd || isSaveData) {
        this.config.lowPowerMode = true;
        this.targetFPS = 30;
        this.config.particleCount = 100;
        this.config.bgStarCount = 80;
        console.log('[CursorParticles] 低功耗模式已启用');
      }
      
      // 检测电池状态
      if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
          if (battery.level < 0.2 && !battery.charging) {
            this.config.lowPowerMode = true;
            this.targetFPS = 30;
            console.log('[CursorParticles] 低电量模式已启用');
          }
        });
      }
    }

    init() {
      // 创建canvas
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'cursor-particles';
      this.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
      `;
      
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      
      // 设置canvas尺寸
      this.resize();
      window.addEventListener('resize', () => this.resize());
      
      // 监听鼠标移动
      document.addEventListener('mousemove', (e) => {
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.lastMouseMove = Date.now();
        
        // 从空闲状态恢复
        if (this.isIdle) {
          this.isIdle = false;
          this.animate();
        }
      });
      
      // 监听触摸移动
      document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          this.mouseX = e.touches[0].clientX;
          this.mouseY = e.touches[0].clientY;
          this.lastMouseMove = Date.now();
          
          if (this.isIdle) {
            this.isIdle = false;
            this.animate();
          }
        }
      });
      
      // 监听页面可见性变化（D方案：智能暂停）
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.isIdle = true;
          if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
          }
        } else {
          this.isIdle = false;
          this.lastMouseMove = Date.now();
          this.animate();
        }
      });
      
      // 初始化背景星星
      this.initBgStars();
      
      // 开始动画
      this.animate();
    }

    // 初始化背景静态星星
    initBgStars() {
      for (let i = 0; i < this.config.bgStarCount; i++) {
        this.bgStars.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 0.8 + 0.2,  // 更小的背景星星
          alpha: Math.random() * 0.4 + 0.1,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02,  // 更慢的闪烁
          driftX: (Math.random() - 0.5) * 0.1,  // 自然漂移
          driftY: (Math.random() - 0.5) * 0.1
        });
      }
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    // 检测背景颜色
    getBackgroundType(x, y) {
      // 获取鼠标位置下的元素
      const element = document.elementFromPoint(x, y);
      if (!element) return 'dark';
      
      // 获取计算样式
      const style = window.getComputedStyle(element);
      const bgColor = style.backgroundColor;
      
      // 解析颜色
      const rgb = bgColor.match(/\d+/g);
      if (!rgb || rgb.length < 3) return 'dark';
      
      // 计算亮度
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      return brightness > 128 ? 'light' : 'dark';
    }

    // 创建粒子
    createParticle(x, y, bgType) {
      const colors = this.config.colors[bgType];
      const color = colors[Math.floor(Math.random() * colors.length)];

      // 随机角度和距离，形成从中心向外的分布
      const angle = Math.random() * Math.PI * 2;
      // 使用平方根分布让粒子更均匀
      const distance = Math.sqrt(Math.random()) * this.config.spreadRadius;

      // 大小不均匀（0.3x ~ 2x），更多小粒子
      const sizeVariation = 0.3 + Math.random() * 1.7;
      const baseSize = this.config.particleSize * sizeVariation;

      // 计算从中心向外的方向（用于光芒效果）
      const centerX = x;
      const centerY = y;
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);

      // 每个粒子有独立的"个性"运动参数
      const driftAngle = Math.random() * Math.PI * 2;
      const driftSpeed = Math.random() * 0.5 + 0.2;

      return {
        x: x + dirX * distance,
        y: y + dirY * distance,
        vx: 0,
        vy: 0,
        size: baseSize,
        baseSize: baseSize,
        color: color,
        life: this.config.particleLife,
        maxLife: this.config.particleLife,
        bgType: bgType,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,  // 更慢的呼吸
        // 从中心向外的方向
        dirX: dirX,
        dirY: dirY,
        distance: distance,
        // 水母式蠕动参数
        driftAngle: driftAngle,
        driftSpeed: driftSpeed,
        driftPhase: Math.random() * Math.PI * 2,
        driftAmplitude: Math.random() * 0.5 + 0.3,
        // 光芒拖尾长度
        tailLength: Math.random() * 8 + 4,
        // 独立运动周期
        cycleX: Math.random() * 100 + 50,
        cycleY: Math.random() * 100 + 50
      };
    }

    // 更新粒子
    updateParticles() {
      const now = Date.now();
      
      // 生成新粒子
      if (now - this.lastSpawn > 16) { // 约60fps
        const bgType = this.getBackgroundType(this.mouseX, this.mouseY);
        
        for (let i = 0; i < this.config.spawnRate; i++) {
          if (this.particles.length < this.config.particleCount) {
            this.particles.push(this.createParticle(this.mouseX, this.mouseY, bgType));
          }
        }
        this.lastSpawn = now;
      }
      
      // 更新时间
      this.time += 0.016;

      // 平滑鼠标位置（延迟跟随效果）
      this.smoothMouseX += (this.mouseX - this.smoothMouseX) * this.config.followDelay;
      this.smoothMouseY += (this.mouseY - this.smoothMouseY) * this.config.followDelay;

      // 更新现有粒子
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        // 计算粒子相对于中心的位置
        const dx = p.x - this.smoothMouseX;
        const dy = p.y - this.smoothMouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 极简运动：只有极缓慢的漂移，没有弹簧拉回
        // 粒子一旦生成就在自己的轨道上缓慢漂移
        
        // 极慢的切向漂移（像浮游生物随波逐流）
        const tangentX = -dy / (distance + 0.001);
        const tangentY = dx / (distance + 0.001);
        const drift = Math.sin(this.time * 0.05 + p.driftPhase) * 0.02; // 极慢的正弦漂移
        
        // 极慢的径向呼吸（几乎感觉不到）
        const breath = Math.sin(this.time * 0.03 + p.pulsePhase) * 0.01;
        const radialX = (dx / (distance + 0.001)) * breath;
        const radialY = (dy / (distance + 0.001)) * breath;
        
        // 更新位置（极小的位移）
        p.x += tangentX * drift + radialX;
        p.y += tangentY * drift + radialY;
        
        // 极慢的跟随鼠标（像拖着长长的尾巴）
        p.x += (this.smoothMouseX - p.x) * 0.005;
        p.y += (this.smoothMouseY - p.y) * 0.005;

        // 更新呼吸相位
        p.pulsePhase += p.pulseSpeed;

        // 减少生命值
        p.life -= 16;

        // 移除死亡粒子
        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    // 绘制连线
    drawConnections(bgType) {
      const colors = this.config.colors[bgType];
      const baseColor = colors[0];
      
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const p1 = this.particles[i];
          const p2 = this.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < this.config.connectionDistance) {
            const alpha = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = this.hexToRgba(baseColor, alpha);
            this.ctx.lineWidth = 0.3;
            this.ctx.stroke();
          }
        }
      }
    }

    // 绘制背景星星
    drawBgStars(bgType) {
      const colors = this.config.colors[bgType];
      const color = colors[Math.floor(colors.length / 2)];

      for (const star of this.bgStars) {
        // 缓慢闪烁
        const pulse = 0.6 + 0.4 * Math.sin(this.time + star.pulsePhase);
        const alpha = star.alpha * pulse;

        // 自然漂移
        star.x += star.driftX;
        star.y += star.driftY;

        // 边界循环
        if (star.x < 0) star.x = this.canvas.width;
        if (star.x > this.canvas.width) star.x = 0;
        if (star.y < 0) star.y = this.canvas.height;
        if (star.y > this.canvas.height) star.y = 0;

        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.hexToRgba(color, alpha * 0.6);
        this.ctx.fill();
      }
    }

    // 绘制粒子
    drawParticles() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      const bgType = this.getBackgroundType(this.mouseX, this.mouseY);
      
      // 先绘制背景星星
      this.drawBgStars(bgType);
      
      // 绘制连线（在粒子下面）
      this.drawConnections(bgType);
      
      // 绘制粒子
      for (const p of this.particles) {
        const progress = p.life / p.maxLife;
        
        // 呼吸效果：大小随时间脉动
        const pulse = 0.6 + 0.4 * Math.sin(p.pulsePhase);
        const size = p.baseSize * progress * pulse;
        
        // 透明度：生命周期 + 呼吸
        const alpha = progress * (0.5 + 0.3 * Math.sin(p.pulsePhase * 0.5));
        
        // 计算拖尾方向（从圆心向外）
        // 计算当前位置相对于中心的方向
        const dx = p.x - this.smoothMouseX;
        const dy = p.y - this.smoothMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const dirX = dx / (dist + 0.001);
        const dirY = dy / (dist + 0.001);
        
        // 拖尾从粒子位置向外延伸
        const tailX = p.x + dirX * p.tailLength * size;
        const tailY = p.y + dirY * p.tailLength * size;
        
        // 创建渐变（从粒子亮到尾部淡）
        const gradient = this.ctx.createLinearGradient(p.x, p.y, tailX, tailY);
        gradient.addColorStop(0, this.hexToRgba(p.color, alpha));
        gradient.addColorStop(0.5, this.hexToRgba(p.color, alpha * 0.5));
        gradient.addColorStop(1, this.hexToRgba(p.color, 0));
        
        // 绘制光芒线条（从圆心向外）
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(tailX, tailY);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = size;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
        
        // 绘制发光核心（圆点）
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, size * 0.8, 0, Math.PI * 2);
        this.ctx.fillStyle = this.hexToRgba(p.color, Math.min(alpha * 1.5, 1));
        this.ctx.fill();
        
        // 绘制光晕
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = this.hexToRgba(p.color, alpha * 0.25);
        this.ctx.fill();
      }
    }

    // 颜色转换
    hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // 动画循环
    animate() {
      if (!this.isActive || this.isIdle) return;
      
      // D方案：智能暂停 - 检测鼠标静止时间
      const now = Date.now();
      if (now - this.lastMouseMove > this.config.idleTimeout) {
        this.isIdle = true;
        // 清空粒子，释放资源
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return;
      }
      
      // E方案：设备适配 - 降低帧率
      this.frameCount++;
      const frameSkip = this.targetFPS === 30 ? 2 : 1;
      
      if (this.frameCount % frameSkip === 0) {
        this.updateParticles();
        this.drawParticles();
      }
      
      this.animationId = requestAnimationFrame(() => this.animate());
    }

    // 销毁
    destroy() {
      this.isActive = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }

  // 暴露到全局
  window.CursorParticles = CursorParticles;

  // 自动初始化（如果页面有data-cursor-particles属性）
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.hasAttribute('data-cursor-particles')) {
      new CursorParticles();
    }
  });
})();
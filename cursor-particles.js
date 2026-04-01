/**
 * Cursor Particles Effect
 * 鼠标跟随星光粒子效果
 * 适配深色和浅色背景
 */

(function() {
  'use strict';

  // 配置
  const config = {
    particleCount: 150,       // 粒子数量（大幅增加）
    particleSize: 1.5,        // 粒子基础大小（变小）
    particleLife: 2000,       // 粒子生命周期(ms)（延长）
    spawnRate: 5,             // 每帧生成粒子数（增加）
    spreadRadius: 300,        // 扩散半径（大幅增加）
    bgStarCount: 100,         // 背景静态星星数量
    connectionDistance: 80,   // 连线距离
    colors: {
      dark: ['#5E9CEA', '#7AB8FF', '#9ED0FF', '#64B5F6', '#42A5F5', '#90CAF9'],  // 深色背景配色（蓝系）
      light: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8C42', '#9B5DE5', '#F472B6']  // 浅色背景配色（彩系）
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
      this.isActive = true;
      this.animationId = null;
      this.lastSpawn = 0;
      
      // 合并配置
      this.config = { ...config, ...options };
      
      this.init();
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
      });
      
      // 监听触摸移动
      document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          this.mouseX = e.touches[0].clientX;
          this.mouseY = e.touches[0].clientY;
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
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.2,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03
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
      
      // 计算鼠标移动方向
      const dx = x - this.lastMouseX;
      const dy = y - this.lastMouseY;
      const moveAngle = Math.atan2(dy, dx);
      const moveSpeed = Math.sqrt(dx * dx + dy * dy);
      
      // 随机角度和距离，形成大范围扩散
      const angle = (Math.random() - 0.5) * Math.PI * 2; // 全方向扩散
      const distance = Math.random() * this.config.spreadRadius;
      
      // 根据鼠标移动速度调整扩散范围
      const speedFactor = Math.min(moveSpeed * 0.5, 50);
      
      return {
        x: x + Math.cos(angle) * distance * 0.5,
        y: y + Math.sin(angle) * distance * 0.5,
        vx: Math.cos(angle) * (Math.random() * 3 + 1) + Math.cos(moveAngle) * speedFactor * 0.1,
        vy: Math.sin(angle) * (Math.random() * 3 + 1) + Math.sin(moveAngle) * speedFactor * 0.1,
        size: Math.random() * this.config.particleSize + 0.5,
        baseSize: Math.random() * this.config.particleSize + 0.5,
        color: color,
        life: this.config.particleLife,
        maxLife: this.config.particleLife,
        bgType: bgType,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.03 + Math.random() * 0.04
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
      
      // 更新现有粒子
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        
        // 更新位置 - 添加漂移感
        p.x += p.vx;
        p.y += p.vy;
        
        // 模拟空气阻力，速度逐渐减小
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        // 添加轻微的随机漂移（呼吸感）
        p.x += Math.sin(Date.now() * 0.001 + p.pulsePhase) * 0.3;
        p.y += Math.cos(Date.now() * 0.001 + p.pulsePhase) * 0.2;
        
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
            const alpha = (1 - distance / this.config.connectionDistance) * 0.3;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = this.hexToRgba(baseColor, alpha);
            this.ctx.lineWidth = 0.5;
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
        // 闪烁效果
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.001 + star.pulsePhase);
        const alpha = star.alpha * pulse;
        
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.hexToRgba(color, alpha * 0.5);
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
        
        // 绘制发光核心（更亮）
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.hexToRgba(p.color, alpha);
        this.ctx.fill();
        
        // 绘制内层光晕
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = this.hexToRgba(p.color, alpha * 0.3);
        this.ctx.fill();
        
        // 绘制外层光晕（更淡更广）
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, size * 6, 0, Math.PI * 2);
        this.ctx.fillStyle = this.hexToRgba(p.color, alpha * 0.1);
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
      if (!this.isActive) return;
      
      this.updateParticles();
      this.drawParticles();
      
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
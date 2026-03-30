/**
 * Ponghood 点赞系统 - LocalStorage 版本
 * 简单能用，匿名点赞，无需登录
 */

(function() {
  'use strict';

  // 获取当前页面唯一ID
  function getPageId() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return filename.replace('.html', '');
  }

  // 获取存储的点赞数据
  function getLikesData() {
    try {
      return JSON.parse(localStorage.getItem('ponghood-likes') || '{}');
    } catch (e) {
      return {};
    }
  }

  // 获取用户已点赞的页面列表
  function getLikedPages() {
    try {
      return JSON.parse(localStorage.getItem('ponghood-liked') || '[]');
    } catch (e) {
      return [];
    }
  }

  // 保存点赞数据
  function saveLikesData(data) {
    localStorage.setItem('ponghood-likes', JSON.stringify(data));
  }

  // 保存已点赞页面
  function saveLikedPages(pages) {
    localStorage.setItem('ponghood-liked', JSON.stringify(pages));
  }

  // 获取当前页面点赞数
  function getCurrentLikes() {
    const data = getLikesData();
    const pageId = getPageId();
    return data[pageId] || 0;
  }

  // 检查是否已点赞
  function hasLiked() {
    const likedPages = getLikedPages();
    const pageId = getPageId();
    return likedPages.includes(pageId);
  }
  
  // 获取所有页面点赞排行
  function getAllLikesRanking() {
    const data = getLikesData();
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .map(([pageId, count]) => ({ pageId, count }));
  }

  // 点赞功能
  function like() {
    const pageId = getPageId();
    
    // 检查是否已点赞
    if (hasLiked()) {
      return { success: false, message: '您已经点过赞了', count: getCurrentLikes() };
    }

    // 更新点赞数
    const data = getLikesData();
    data[pageId] = (data[pageId] || 0) + 1;
    saveLikesData(data);

    // 记录已点赞
    const likedPages = getLikedPages();
    likedPages.push(pageId);
    saveLikedPages(likedPages);

    return { success: true, message: '点赞成功', count: data[pageId] };
  }

  // 创建点赞按钮 DOM
  function createLikeButton() {
    const container = document.createElement('div');
    container.className = 'like-container';
    container.innerHTML = `
      <button class="like-btn ${hasLiked() ? 'liked' : ''}" id="likeBtn">
        <svg class="like-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span class="like-count">${getCurrentLikes()}</span>
      </button>
      <span class="like-hint">${hasLiked() ? '已点赞' : '喜欢就点个赞吧~'}</span>
    `;
    return container;
  }

  // 初始化点赞组件
  function initLikeComponent(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // 插入点赞按钮
    const likeComponent = createLikeButton();
    container.appendChild(likeComponent);

    // 绑定点击事件
    const btn = likeComponent.querySelector('#likeBtn');
    const countEl = likeComponent.querySelector('.like-count');
    const hintEl = likeComponent.querySelector('.like-hint');

    btn.addEventListener('click', function() {
      const result = like();
      
      if (result.success) {
        // 更新UI
        countEl.textContent = result.count;
        btn.classList.add('liked');
        hintEl.textContent = '感谢点赞~';
        
        // 添加动画效果
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
          btn.style.transform = 'scale(1)';
        }, 200);
      } else {
        // 已点赞提示
        btn.style.animation = 'shake 0.5s';
        setTimeout(() => {
          btn.style.animation = '';
        }, 500);
      }
    });
  }

  // 添加CSS样式
  function addStyles() {
    if (document.getElementById('like-system-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'like-system-styles';
    style.textContent = `
      .like-container {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 32px 0;
        padding: 20px;
        background: linear-gradient(135deg, rgba(26,115,232,.08) 0%, rgba(107,63,160,.08) 100%);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 16px;
        justify-content: center;
      }
      
      .like-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 50px;
        color: #E8EBF4;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        user-select: none;
      }
      
      .like-btn:hover {
        background: rgba(255,255,255,.1);
        border-color: rgba(255,255,255,.2);
        transform: translateY(-2px);
      }
      
      .like-btn.liked {
        background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%);
        border-color: transparent;
        color: white;
      }
      
      .like-btn.liked .like-icon {
        fill: white;
        stroke: white;
      }
      
      .like-icon {
        width: 20px;
        height: 20px;
        transition: all 0.3s ease;
      }
      
      .like-btn:not(.liked) .like-icon {
        fill: transparent;
      }
      
      .like-count {
        font-weight: 600;
        min-width: 20px;
        text-align: center;
      }
      
      .like-hint {
        font-size: 0.85rem;
        color: #6B7499;
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      
      @media (max-width: 640px) {
        .like-container {
          padding: 16px;
        }
        .like-btn {
          padding: 10px 20px;
          font-size: 0.9rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 暴露全局API
  window.PonghoodLike = {
    like,
    getCurrentLikes,
    hasLiked,
    getAllLikesRanking,
    init: initLikeComponent
  };

  // 页面加载完成后自动添加样式
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addStyles);
  } else {
    addStyles();
  }

})();

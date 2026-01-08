---
title: 打砖块
description: 经典的打砖块游戏，控制挡板反弹球消除所有砖块。
date: 2026-01-07
tags:
  - 经典游戏
  - 反应
  - 休闲
---

使用方向键或鼠标移动挡板，反弹球消除所有砖块。不要让球掉落！

<div id="game-wrapper">
  <div id="game-info">
    <div class="score-display">
      <span class="score-label">得分：</span>
      <span id="score" class="score-value">0</span>
    </div>
    <div class="score-display">
      <span class="score-label">最高分：</span>
      <span id="high-score" class="score-value">0</span>
    </div>
    <div class="score-display">
      <span class="score-label">生命：</span>
      <span id="lives" class="score-value">3</span>
    </div>
  </div>
  <canvas id="breakout-game"></canvas>
  <div id="game-controls">
    <button id="start-btn" class="game-btn">开始游戏</button>
    <button id="pause-btn" class="game-btn" disabled>暂停</button>
  </div>
  <div id="game-message"></div>
</div>

<div class="game-instructions">
  <h3>游戏说明</h3>
  <ul>
    <li>使用 <strong>方向键</strong> 或 <strong>鼠标</strong> 左右移动挡板</li>
    <li>反弹球消除砖块，得分</li>
    <li>不同颜色的砖块有不同的分数</li>
    <li>球掉落底部会失去一条生命</li>
    <li>消除所有砖块获胜</li>
    <li>按 <strong>空格键</strong> 暂停/继续游戏</li>
  </ul>
</div>

<div class="game-instructions">
  <h3>图片砖块功能</h3>
  <p>游戏支持使用一张图片作为砖块背景，每个砖块显示图片的一部分。启用此功能：</p>
  <ol>
    <li>打开 <code>assets/js/games/breakout.js</code></li>
    <li>找到 <code>CONFIG</code> 对象</li>
    <li>将 <code>useImageBricks</code> 设置为 <code>true</code></li>
    <li>修改 <code>backgroundImage</code> 路径为你想要的图片</li>
  </ol>
  <p><strong>推荐图片尺寸：</strong>3:1 比例，如 1500×500px 或 1800×600px</p>
  <p>砖块消除后，图片会逐渐显现，类似拼图效果！</p>
</div>

<script>
  // 定义 Jekyll baseurl 全局变量，供 JavaScript 使用
  window.siteBaseurl = '{{ site.baseurl }}';
</script>
<script src="{{ '/assets/js/games/breakout.js' | relative_url }}"></script>
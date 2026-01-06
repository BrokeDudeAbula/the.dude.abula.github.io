---
title: 网页小游戏
layout: page
permalink: /games/
lead: 闲暇时光，放松心情
---

## 贪吃蛇游戏

使用方向键或 WASD 控制蛇的移动，吃到食物得分。小心不要撞到墙壁或自己的身体！

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
  </div>
  <canvas id="snake-game"></canvas>
  <div id="game-controls">
    <button id="start-btn" class="game-btn">开始游戏</button>
    <button id="pause-btn" class="game-btn" disabled>暂停</button>
  </div>
  <div id="game-message"></div>
</div>

<div class="game-instructions">
  <h3>游戏说明</h3>
  <ul>
    <li>使用 <strong>方向键</strong> 或 <strong>WASD</strong> 控制蛇的移动方向</li>
    <li>吃到红色食物增加得分和蛇的长度</li>
    <li>撞到墙壁或自己的身体，游戏结束</li>
    <li>按 <strong>空格键</strong> 暂停/继续游戏</li>
  </ul>
</div>

<script src="{{ '/assets/js/games/snake.js' | relative_url }}"></script>
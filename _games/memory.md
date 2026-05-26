---
title: 记忆翻牌
description: 经典的记忆翻牌游戏，翻开卡片找到配对，锻炼你的记忆力！
date: 2026-01-22
tags:
  - 记忆
  - 休闲
  - 益智
---

翻开所有配对的卡片，考验你的记忆力！

<div id="game-wrapper">
  <div id="game-info">
    <div class="score-display">
      <span class="score-label">步数：</span>
      <span id="moves" class="score-value">0</span>
    </div>
    <div class="score-display">
      <span class="score-label">配对：</span>
      <span id="pairs" class="score-value">0/8</span>
    </div>
    <div class="score-display">
      <span class="score-label">时间：</span>
      <span id="timer" class="score-value">0:00</span>
    </div>
  </div>
  <div id="memory-game" class="memory-grid"></div>
  <div id="game-controls">
    <button id="start-btn" class="game-btn">重新开始</button>
  </div>
  <div id="game-message"></div>
</div>

<div class="game-instructions">
  <h3>游戏说明</h3>
  <ul>
    <li>点击卡片翻开查看内容</li>
    <li>每次只能翻开两张卡片</li>
    <li>如果两张卡片内容相同，它们会保留翻开状态</li>
    <li>如果不同，会在1秒后自动翻回去</li>
    <li>目标是用最少的步数和最短的时间翻完所有配对</li>
  </ul>
</div>

<script src="{{ '/assets/js/games/memory.js' | relative_url }}"></script>

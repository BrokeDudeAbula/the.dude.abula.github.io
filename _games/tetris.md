---
title: 俄罗斯方块
description: 经典俄罗斯方块游戏，堆叠方块完成行消除，支持等级加速、高对比度配色和消行动画。
date: 2026-01-20
tags:
  - 经典游戏
  - 策略
  - 休闲
---

使用方向键移动和旋转方块，堆叠方块并消除完整行！

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
      <span class="score-label">等级：</span>
      <span id="level" class="score-value">1</span>
    </div>
    <div class="score-display">
      <span class="score-label">行数：</span>
      <span id="lines" class="score-value">0</span>
    </div>
  </div>
  <div id="game-canvases">
    <canvas id="tetris-game"></canvas>
    <div id="side-panel">
      <div id="next-piece-container">
        <span class="preview-label">下一个</span>
        <canvas id="next-piece"></canvas>
      </div>
      <div id="theme-switch-container">
        <span class="preview-label">主题</span>
        <button id="theme-btn" class="game-btn small">切换主题</button>
        <span id="current-theme" class="theme-name">高对比度深色</span>
      </div>
    </div>
  </div>
  <div id="game-controls">
    <button id="start-btn" class="game-btn">开始游戏</button>
    <button id="pause-btn" class="game-btn" disabled>暂停</button>
  </div>
  <div id="game-message"></div>
</div>

<div class="game-instructions">
  <h3>游戏说明</h3>
  <ul>
    <li><strong>方向键 ← →</strong> 左右移动方块</li>
    <li><strong>方向键 ↑</strong> 旋转方块</li>
    <li><strong>方向键 ↓</strong> 加速下落</li>
    <li><strong>空格键</strong> 硬降（直接落下）</li>
    <li><strong>P 键</strong> 暂停/继续</li>
    <li><strong>T 键</strong> 切换配色主题</li>
    <li>消除完整行得分，达到一定分数升级</li>
  </ul>

  <h3>配色主题</h3>
  <ul>
    <li><strong>高对比度深色</strong> - 深色背景，高亮方块，适合暗光环境</li>
    <li><strong>高对比度浅色</strong> - 浅色背景，清晰方块，适合亮光环境</li>
    <li><strong>色盲友好</strong> - 增强对比度与形状区分，兼容红绿色盲</li>
  </ul>

  <h3>游戏特色</h3>
  <ul>
    <li><strong>消行动画</strong> - 消除行时有闪烁动画效果</li>
    <li><strong>幽灵块预览</strong> - 显示方块下落位置</li>
    <li><strong>下一个方块</strong> - 预览下一个出现的方块</li>
    <li><strong>最高分记录</strong> - 自动保存最高分</li>
  </ul>
</div>

<script src="{{ '/assets/js/games/tetris.js' | relative_url }}"></script>

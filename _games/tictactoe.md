---
title: 井字棋
description: 经典的策略游戏，三子连线获胜！支持人机对战和双人对战。
date: 2026-01-08
tags:
  - 策略
  - 逻辑
  - 休闲
---

点击棋盘放置棋子，先连成三子的玩家获胜！支持人机对战和双人对战。

<div id="game-wrapper">
  <div id="game-info">
    <div class="score-display">
      <span class="score-label">玩家 X：</span>
      <span id="score-x" class="score-value">0</span>
    </div>
    <div class="score-display">
      <span class="score-label">玩家 O：</span>
      <span id="score-o" class="score-value">0</span>
    </div>
    <div class="score-display">
      <span class="score-label">平局：</span>
      <span id="score-draw" class="score-value">0</span>
    </div>
  </div>
  <div id="game-mode">
    <button id="mode-ai" class="game-btn active">人机对战</button>
    <button id="mode-pvp" class="game-btn">双人对战</button>
  </div>
  <div id="game-difficulty" style="display: none;">
    <span class="score-label">难度：</span>
    <button id="difficulty-easy" class="game-btn active">简单</button>
    <button id="difficulty-hard" class="game-btn">困难</button>
  </div>
  <canvas id="tictactoe-game"></canvas>
  <div id="game-controls">
    <button id="start-btn" class="game-btn">新游戏</button>
  </div>
  <div id="game-message"></div>
</div>

<div class="game-instructions">
  <h3>游戏说明</h3>
  <ul>
    <li>点击棋盘格子放置棋子</li>
    <li>玩家 X 先手，玩家 O 后手</li>
    <li>先在横、竖或斜方向连成三子的玩家获胜</li>
    <li>棋盘填满且无人获胜则为平局</li>
    <li>支持人机对战（AI 对手）和双人对战</li>
    <li>人机模式下可选择简单或困难难度</li>
  </ul>
</div>

<script src="{{ '/assets/js/games/tictactoe.js' | relative_url }}"></script>
---
title: 猜数字
description: 经典的猜数字游戏，在1-100之间猜出神秘数字，考验你的逻辑推理能力！
date: 2026-01-23
tags:
  - 逻辑
  - 休闲
  - 益智
---

在 1 到 100 之间猜出一个神秘数字，看看你需要几次才能猜中！

<div id="game-wrapper">
  <div id="game-info">
    <div class="score-display">
      <span class="score-label">猜测次数：</span>
      <span id="attempts" class="score-value">0</span>
    </div>
    <div class="score-display">
      <span class="score-label">最少次数：</span>
      <span id="best-score" class="score-value">-</span>
    </div>
  </div>
  <div id="guess-game">
    <div id="game-display">
      <div id="hint-display">🎯 我想好了一个 1-100 之间的数字</div>
      <div id="result-display"></div>
    </div>
    <div id="input-section">
      <input type="number" id="guess-input" min="1" max="100" placeholder="输入你的猜测" />
      <button id="guess-btn" class="game-btn">猜测</button>
    </div>
    <div id="history-section">
      <div id="history-title">猜测历史</div>
      <div id="history-list"></div>
    </div>
  </div>
  <div id="game-controls">
    <button id="start-btn" class="game-btn">重新开始</button>
  </div>
  <div id="game-message"></div>
</div>

<div class="game-instructions">
  <h3>游戏说明</h3>
  <ul>
    <li>系统会随机生成一个 1 到 100 之间的整数</li>
    <li>在输入框中输入你的猜测数字</li>
    <li>点击"猜测"按钮或按回车键确认</li>
    <li>系统会提示你的猜测是偏大还是偏小</li>
    <li>根据提示调整你的猜测，直到猜中为止</li>
    <li>目标是使用最少的猜测次数找到神秘数字</li>
  </ul>
</div>

<script src="{{ '/assets/js/games/guess-number.js' | relative_url }}"></script>

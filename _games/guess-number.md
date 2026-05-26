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

<style>
  #guess-game {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }

  #game-display {
    margin-bottom: 20px;
    text-align: center;
  }

  #hint-display {
    font-size: 1.1rem;
    color: #26312f;
    margin-bottom: 15px;
    padding: 15px;
    background: #e8eeeb;
    border-radius: 8px;
    border: 1px solid rgba(85, 121, 111, 0.22);
  }

  #result-display {
    font-size: 1.5rem;
    font-weight: bold;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  #result-display.hint-high {
    color: #6f7f8d;
  }

  #result-display.hint-low {
    color: #55796f;
  }

  #result-display.correct {
    color: #355b52;
  }

  #input-section {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  #guess-input {
    flex: 1;
    padding: 12px 16px;
    font-size: 1.1rem;
    border: 1px solid rgba(85, 121, 111, 0.24);
    border-radius: 6px;
    background: #ffffff;
    color: #26312f;
    outline: none;
    transition: border-color 0.2s;
  }

  #guess-input:focus {
    border-color: #55796f;
  }

  #guess-input::placeholder {
    color: #68736f;
  }

  #guess-btn {
    padding: 12px 24px;
    font-size: 1rem;
    background: #55796f;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  #guess-btn:hover {
    background: #355b52;
  }

  #guess-btn:disabled {
    background: #b9c7c2;
    cursor: not-allowed;
  }

  #history-section {
    background: #ffffff;
    border-radius: 8px;
    padding: 15px;
    border: 1px solid rgba(85, 121, 111, 0.22);
  }

  #history-title {
    font-size: 0.9rem;
    color: #68736f;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  #history-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-height: 150px;
    overflow-y: auto;
  }

  .history-item {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    animation: fadeIn 0.3s ease;
  }

  .history-item.hint-high {
    background: rgba(111, 127, 141, 0.14);
    color: #4f6676;
    border: 1px solid rgba(111, 127, 141, 0.24);
  }

  .history-item.hint-low {
    background: rgba(85, 121, 111, 0.14);
    color: #355b52;
    border: 1px solid rgba(85, 121, 111, 0.24);
  }

  .history-item.correct {
    background: rgba(139, 163, 151, 0.18);
    color: #355b52;
    border: 1px solid rgba(85, 121, 111, 0.28);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    #guess-game {
      padding: 15px;
    }

    #input-section {
      flex-direction: column;
    }

    #guess-btn {
      width: 100%;
    }
  }
</style>

<script src="{{ '/assets/js/games/guess-number.js' | relative_url }}"></script>

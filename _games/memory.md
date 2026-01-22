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

<style>
  .memory-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    max-width: 450px;
    margin: 0 auto;
    padding: 20px;
  }

  .memory-card {
    aspect-ratio: 1;
    perspective: 1000px;
    cursor: pointer;
  }

  .memory-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    border-radius: 12px;
  }

  .memory-card.flipped .memory-card-inner {
    transform: rotateY(180deg);
  }

  .memory-card.matched .memory-card-front {
    background: #10b981;
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
  }

  .memory-card-front,
  .memory-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    border-radius: 12px;
    user-select: none;
  }

  .memory-card-front {
    background: #1e293b;
    color: white;
    transform: rotateY(180deg);
    border: 2px solid #334155;
  }

  .memory-card-back {
    background: #374151;
    color: #94a3b8;
    font-size: 2rem;
    font-weight: bold;
    border: 2px solid #4b5563;
  }

  .memory-card:hover .memory-card-back {
    background: #4b5563;
  }

  @media (max-width: 480px) {
    .memory-grid {
      gap: 8px;
      padding: 12px;
    }

    .memory-card-front {
      font-size: 2rem;
    }

    .memory-card-back {
      font-size: 1.5rem;
    }
  }
</style>

<script src="{{ '/assets/js/games/memory.js' | relative_url }}"></script>

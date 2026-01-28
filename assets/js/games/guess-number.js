(function() {
  const CONFIG = {
    minNumber: 1,
    maxNumber: 100
  };

  let targetNumber = 0;
  let attempts = 0;
  let bestScore = null;
  let gameOver = false;
  let history = [];

  const attemptsElement = document.getElementById('attempts');
  const bestScoreElement = document.getElementById('best-score');
  const hintDisplay = document.getElementById('hint-display');
  const resultDisplay = document.getElementById('result-display');
  const guessInput = document.getElementById('guess-input');
  const guessBtn = document.getElementById('guess-btn');
  const startBtn = document.getElementById('start-btn');
  const historyList = document.getElementById('history-list');
  const messageElement = document.getElementById('game-message');

  function initGame() {
    targetNumber = Math.floor(Math.random() * (CONFIG.maxNumber - CONFIG.minNumber + 1)) + CONFIG.minNumber;
    attempts = 0;
    gameOver = false;
    history = [];

    attemptsElement.textContent = '0';
    hintDisplay.textContent = '🎯 我想好了一个 1-100 之间的数字';
    resultDisplay.textContent = '';
    resultDisplay.className = '';
    guessInput.value = '';
    guessInput.disabled = false;
    guessBtn.disabled = false;
    historyList.innerHTML = '';
    messageElement.innerHTML = '';

    guessInput.focus();
  }

  function handleGuess() {
    if (gameOver) return;

    const guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < CONFIG.minNumber || guess > CONFIG.maxNumber) {
      hintDisplay.textContent = `⚠️ 请输入 ${CONFIG.minNumber} 到 ${CONFIG.maxNumber} 之间的数字`;
      hintDisplay.style.color = '#fbbf24';
      setTimeout(() => {
        hintDisplay.textContent = '🎯 我想好了一个 1-100 之间的数字';
        hintDisplay.style.color = '';
      }, 2000);
      return;
    }

    attempts++;
    attemptsElement.textContent = attempts;

    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';

    if (guess < targetNumber) {
      resultDisplay.textContent = '📈 猜大了！';
      resultDisplay.className = 'hint-high';
      historyItem.textContent = `↓ ${guess}`;
      historyItem.classList.add('hint-high');
    } else if (guess > targetNumber) {
      resultDisplay.textContent = '📉 猜小了！';
      resultDisplay.className = 'hint-low';
      historyItem.textContent = `↑ ${guess}`;
      historyItem.classList.add('hint-low');
    } else {
      resultDisplay.textContent = `🎉 正确！答案是 ${targetNumber}`;
      resultDisplay.className = 'correct';
      historyItem.textContent = `✓ ${guess}`;
      historyItem.classList.add('correct');
      gameOver = true;
      guessInput.disabled = true;
      guessBtn.disabled = true;

      if (bestScore === null || attempts < bestScore) {
        bestScore = attempts;
        bestScoreElement.textContent = bestScore;
      }

      let rating = '';
      if (attempts <= 3) {
        rating = '🌟 太厉害了！';
      } else if (attempts <= 5) {
        rating = '👍 非常棒！';
      } else if (attempts <= 7) {
        rating = '💪 不错！';
      } else {
        rating = '🎮 再接再厉！';
      }

      messageElement.innerHTML = `
        <div class="game-over">
          <h3>🎉 恭喜你猜中了！</h3>
          <p>你用了 <strong>${attempts}</strong> 次猜中答案。</p>
          <p>${rating}</p>
        </div>
      `;
    }

    historyList.insertBefore(historyItem, historyList.firstChild);
    guessInput.value = '';
    guessInput.focus();
  }

  guessBtn.addEventListener('click', handleGuess);

  guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  });

  startBtn.addEventListener('click', () => {
    initGame();
  });

  initGame();
})();

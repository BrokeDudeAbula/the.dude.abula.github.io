(function() {
  const CONFIG = {
    gridSize: 4,
    totalPairs: 8,
    colors: {
      background: '#111827',
      cardBack: '#374151',
      cardFront: '#1e293b',
      matched: '#10b981',
      text: '#ffffff'
    },
    emojiSymbols: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑']
  };

  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let gameStarted = false;
  let isLocked = false;

  const gameContainer = document.getElementById('memory-game');
  const movesElement = document.getElementById('moves');
  const pairsElement = document.getElementById('pairs');
  const timerElement = document.getElementById('timer');
  const startBtn = document.getElementById('start-btn');
  const messageElement = document.getElementById('game-message');

  let timerInterval = null;
  let seconds = 0;

  function initGame() {
    gameContainer.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameStarted = false;
    isLocked = false;
    seconds = 0;

    updateDisplay();
    stopTimer();
    timerElement.textContent = '0:00';
    messageElement.innerHTML = '';

    const pairs = CONFIG.emojiSymbols.slice(0, CONFIG.totalPairs);
    const cardSymbols = [...pairs, ...pairs];

    for (let i = cardSymbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardSymbols[i], cardSymbols[j]] = [cardSymbols[j], cardSymbols[i]];
    }

    cardSymbols.forEach((symbol, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.symbol = symbol;
      card.dataset.index = index;

      const cardInner = document.createElement('div');
      cardInner.className = 'memory-card-inner';

      const cardFront = document.createElement('div');
      cardFront.className = 'memory-card-front';
      cardFront.textContent = symbol;

      const cardBack = document.createElement('div');
      cardBack.className = 'memory-card-back';
      cardBack.textContent = '?';

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      card.appendChild(cardInner);

      card.addEventListener('click', () => handleCardClick(card));
      gameContainer.appendChild(card);
      cards.push(card);
    });
  }

  function handleCardClick(card) {
    if (isLocked) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    if (!gameStarted) {
      gameStarted = true;
      startTimer();
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      moves++;
      updateDisplay();
      checkMatch();
    }
  }

  function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.symbol === card2.dataset.symbol;

    if (isMatch) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedPairs++;
      updateDisplay();
      flippedCards = [];

      if (matchedPairs === CONFIG.totalPairs) {
        gameWon();
      }
    } else {
      isLocked = true;
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
        isLocked = false;
      }, 1000);
    }
  }

  function gameWon() {
    stopTimer();
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeStr = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

    messageElement.innerHTML = `
      <div class="game-over">
        <h3>🎉 恭喜！</h3>
        <p>你用 <strong>${moves}</strong> 步完成了游戏</p>
        <p>用时：<strong>${timeStr}</strong></p>
      </div>
    `;
  }

  function updateDisplay() {
    movesElement.textContent = moves;
    pairsElement.textContent = `${matchedPairs}/${CONFIG.totalPairs}`;
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      timerElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  startBtn.addEventListener('click', initGame);

  initGame();
})();

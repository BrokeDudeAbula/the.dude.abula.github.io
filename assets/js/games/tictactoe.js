(function() {
  // 游戏配置
  const CONFIG = {
    canvasWidth: 400,
    canvasHeight: 400,
    gridSize: 3,
    cellPadding: 10,
    colors: {
      background: '#111827',
      grid: '#374151',
      x: '#38bdf8',
      o: '#f472b6',
      winningLine: '#10b981',
      text: '#ffffff'
    }
  };

  // 游戏状态
  let board = [];
  let currentPlayer = 'X';
  let gameMode = 'ai'; // 'ai' 或 'pvp'
  let difficulty = 'easy'; // 'easy' 或 'hard'
  let scores = { X: 0, O: 0, draw: 0 };
  let isGameOver = false;
  let winningLine = null;

  // DOM 元素
  const canvas = document.getElementById('tictactoe-game');
  const ctx = canvas.getContext('2d');
  const scoreXElement = document.getElementById('score-x');
  const scoreOElement = document.getElementById('score-o');
  const scoreDrawElement = document.getElementById('score-draw');
  const startBtn = document.getElementById('start-btn');
  const modeAiBtn = document.getElementById('mode-ai');
  const modePvpBtn = document.getElementById('mode-pvp');
  const difficultyEasyBtn = document.getElementById('difficulty-easy');
  const difficultyHardBtn = document.getElementById('difficulty-hard');
  const difficultyDiv = document.getElementById('game-difficulty');
  const messageElement = document.getElementById('game-message');

  let cellSize = 0;

  // 初始化 Canvas
  function initCanvas() {
    canvas.width = CONFIG.canvasWidth;
    canvas.height = CONFIG.canvasHeight;
    cellSize = CONFIG.canvasWidth / CONFIG.gridSize;
  }

  // 初始化游戏
  function initGame() {
    board = Array(CONFIG.gridSize).fill(null).map(() => Array(CONFIG.gridSize).fill(null));
    currentPlayer = 'X';
    isGameOver = false;
    winningLine = null;
    draw();
    messageElement.textContent = '';
  }

  // 绘制游戏
  function draw() {
    // 绘制背景
    ctx.fillStyle = CONFIG.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    drawGrid();

    // 绘制棋子
    drawPieces();

    // 绘制获胜线
    if (winningLine) {
      drawWinningLine();
    }
  }

  // 绘制网格
  function drawGrid() {
    ctx.strokeStyle = CONFIG.colors.grid;
    ctx.lineWidth = 3;

    // 绘制竖线
    for (let i = 1; i < CONFIG.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
    }

    // 绘制横线
    for (let i = 1; i < CONFIG.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }
  }

  // 绘制棋子
  function drawPieces() {
    for (let row = 0; row < CONFIG.gridSize; row++) {
      for (let col = 0; col < CONFIG.gridSize; col++) {
        const piece = board[row][col];
        if (piece) {
          const x = col * cellSize + cellSize / 2;
          const y = row * cellSize + cellSize / 2;
          const size = cellSize / 2 - CONFIG.cellPadding;

          if (piece === 'X') {
            drawX(x, y, size);
          } else {
            drawO(x, y, size);
          }
        }
      }
    }
  }

  // 绘制 X
  function drawX(x, y, size) {
    ctx.strokeStyle = CONFIG.colors.x;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.stroke();
  }

  // 绘制 O
  function drawO(x, y, size) {
    ctx.strokeStyle = CONFIG.colors.o;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 绘制获胜线
  function drawWinningLine() {
    if (!winningLine) return;

    ctx.strokeStyle = CONFIG.colors.winningLine;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    const startCell = winningLine[0];
    const endCell = winningLine[1];

    const startX = startCell.col * cellSize + cellSize / 2;
    const startY = startCell.row * cellSize + cellSize / 2;
    const endX = endCell.col * cellSize + cellSize / 2;
    const endY = endCell.row * cellSize + cellSize / 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  // 处理点击
  function handleClick(e) {
    if (isGameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    // 检查是否在有效范围内
    if (row < 0 || row >= CONFIG.gridSize || col < 0 || col >= CONFIG.gridSize) {
      return;
    }

    // 检查该位置是否已有棋子
    if (board[row][col]) {
      return;
    }

    // 放置棋子
    board[row][col] = currentPlayer;
    draw();

    // 检查胜负
    const winner = checkWinner();
    if (winner) {
      isGameOver = true;
      scores[winner]++;
      updateScores();
      messageElement.innerHTML = `
        <div class="game-over">
          <h3>🎉 ${winner === 'X' ? '玩家 X' : '玩家 O'} 获胜！</h3>
        </div>
      `;
      return;
    }

    // 检查平局
    if (checkDraw()) {
      isGameOver = true;
      scores.draw++;
      updateScores();
      messageElement.innerHTML = `
        <div class="game-over">
          <h3>🤝 平局！</h3>
        </div>
      `;
      return;
    }

    // 切换玩家
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    // 如果是人机模式且轮到 AI
    if (gameMode === 'ai' && currentPlayer === 'O' && !isGameOver) {
      setTimeout(() => aiMove(), 300);
    }
  }

  // 检查获胜
  function checkWinner() {
    // 检查行
    for (let row = 0; row < CONFIG.gridSize; row++) {
      if (board[row][0] && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
        winningLine = [
          { row: row, col: 0 },
          { row: row, col: 2 }
        ];
        return board[row][0];
      }
    }

    // 检查列
    for (let col = 0; col < CONFIG.gridSize; col++) {
      if (board[0][col] && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
        winningLine = [
          { row: 0, col: col },
          { row: 2, col: col }
        ];
        return board[0][col];
      }
    }

    // 检查对角线
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      winningLine = [
        { row: 0, col: 0 },
        { row: 2, col: 2 }
      ];
      return board[0][0];
    }

    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      winningLine = [
        { row: 0, col: 2 },
        { row: 2, col: 0 }
      ];
      return board[0][2];
    }

    return null;
  }

  // 检查平局
  function checkDraw() {
    for (let row = 0; row < CONFIG.gridSize; row++) {
      for (let col = 0; col < CONFIG.gridSize; col++) {
        if (!board[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  // AI 移动
  function aiMove() {
    if (isGameOver) return;

    let move;

    if (difficulty === 'easy') {
      move = getRandomMove();
    } else {
      move = getBestMove();
    }

    if (move) {
      board[move.row][move.col] = 'O';
      draw();

      const winner = checkWinner();
      if (winner) {
        isGameOver = true;
        scores[winner]++;
        updateScores();
        messageElement.innerHTML = `
          <div class="game-over">
            <h3>🎉 ${winner === 'X' ? '玩家 X' : '玩家 O'} 获胜！</h3>
          </div>
        `;
        return;
      }

      if (checkDraw()) {
        isGameOver = true;
        scores.draw++;
        updateScores();
        messageElement.innerHTML = `
          <div class="game-over">
            <h3>🤝 平局！</h3>
          </div>
        `;
        return;
      }

      currentPlayer = 'X';
    }
  }

  // 随机移动（简单 AI）
  function getRandomMove() {
    const emptyCells = [];
    for (let row = 0; row < CONFIG.gridSize; row++) {
      for (let col = 0; col < CONFIG.gridSize; col++) {
        if (!board[row][col]) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    return null;
  }

  // 最佳移动（困难 AI - Minimax 算法）
  function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let row = 0; row < CONFIG.gridSize; row++) {
      for (let col = 0; col < CONFIG.gridSize; col++) {
        if (!board[row][col]) {
          board[row][col] = 'O';
          const score = minimax(board, 0, false);
          board[row][col] = null;

          if (score > bestScore) {
            bestScore = score;
            bestMove = { row, col };
          }
        }
      }
    }

    return bestMove;
  }

  // Minimax 算法
  function minimax(board, depth, isMaximizing) {
    const winner = checkWinnerForMinimax();
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (checkDrawForMinimax()) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let row = 0; row < CONFIG.gridSize; row++) {
        for (let col = 0; col < CONFIG.gridSize; col++) {
          if (!board[row][col]) {
            board[row][col] = 'O';
            const score = minimax(board, depth + 1, false);
            board[row][col] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let row = 0; row < CONFIG.gridSize; row++) {
        for (let col = 0; col < CONFIG.gridSize; col++) {
          if (!board[row][col]) {
            board[row][col] = 'X';
            const score = minimax(board, depth + 1, true);
            board[row][col] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }

  // 检查获胜（用于 Minimax）
  function checkWinnerForMinimax() {
    // 检查行
    for (let row = 0; row < CONFIG.gridSize; row++) {
      if (board[row][0] && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
        return board[row][0];
      }
    }

    // 检查列
    for (let col = 0; col < CONFIG.gridSize; col++) {
      if (board[0][col] && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
        return board[0][col];
      }
    }

    // 检查对角线
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return board[0][0];
    }

    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return board[0][2];
    }

    return null;
  }

  // 检查平局（用于 Minimax）
  function checkDrawForMinimax() {
    for (let row = 0; row < CONFIG.gridSize; row++) {
      for (let col = 0; col < CONFIG.gridSize; col++) {
        if (!board[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  // 更新分数
  function updateScores() {
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
    scoreDrawElement.textContent = scores.draw;
  }

  // 切换游戏模式
  function setGameMode(mode) {
    gameMode = mode;

    if (mode === 'ai') {
      modeAiBtn.classList.add('active');
      modePvpBtn.classList.remove('active');
      difficultyDiv.style.display = 'block';
    } else {
      modePvpBtn.classList.add('active');
      modeAiBtn.classList.remove('active');
      difficultyDiv.style.display = 'none';
    }

    // 重置游戏
    scores = { X: 0, O: 0, draw: 0 };
    updateScores();
    initGame();
  }

  // 切换难度
  function setDifficulty(diff) {
    difficulty = diff;

    if (diff === 'easy') {
      difficultyEasyBtn.classList.add('active');
      difficultyHardBtn.classList.remove('active');
    } else {
      difficultyHardBtn.classList.add('active');
      difficultyEasyBtn.classList.remove('active');
    }

    // 重置游戏
    scores = { X: 0, O: 0, draw: 0 };
    updateScores();
    initGame();
  }

  // 事件监听
  canvas.addEventListener('click', handleClick);
  startBtn.addEventListener('click', () => {
    scores = { X: 0, O: 0, draw: 0 };
    updateScores();
    initGame();
  });
  modeAiBtn.addEventListener('click', () => setGameMode('ai'));
  modePvpBtn.addEventListener('click', () => setGameMode('pvp'));
  difficultyEasyBtn.addEventListener('click', () => setDifficulty('easy'));
  difficultyHardBtn.addEventListener('click', () => setDifficulty('hard'));

  // 初始化
  initCanvas();
  initGame();
})();
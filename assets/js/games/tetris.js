(function() {
  const CONFIG = {
    canvasWidth: 240,
    canvasHeight: 480,
    blockSize: 24,
    nextCanvasWidth: 100,
    nextCanvasHeight: 100,
    themeName: 'darkHighContrast',
    inputLockDuringClear: true,

    THEMES: {
      darkHighContrast: {
        name: '高对比度深色',
        background: '#0a0a0f',
        gridLine: 'rgba(80, 80, 100, 0.25)',
        gridLineAlpha: 0.25,
        activeFill: null,
        activeStroke: '#ffffff',
        activeStrokeWidth: 2,
        activeShadow: true,
        activeShadowColor: 'rgba(255, 255, 255, 0.5)',
        activeShadowBlur: 8,
        lockedFill: null,
        lockedStroke: '#ffffff',
        lockedStrokeWidth: 1.5,
        lockedShadow: true,
        lockedShadowColor: 'rgba(255, 255, 255, 0.2)',
        lockedShadowBlur: 4,
        lockedInnerHighlight: true,
        ghostFill: 'rgba(255, 255, 255, 0.12)',
        ghostStroke: 'rgba(255, 255, 255, 0.35)',
        ghostStrokeWidth: 1,
        uiText: '#ffffff',
        uiAccent: '#00f0f0',
        blockColors: {
          I: '#00f0f0',
          O: '#f0f000',
          T: '#a000f0',
          S: '#00f000',
          Z: '#f00000',
          J: '#0060ff',
          L: '#f0a000'
        },
        clearAnimType: 'flash',
        clearAnimDuration: 300
      },
      lightHighContrast: {
        name: '高对比度浅色',
        background: '#e8e8e8',
        gridLine: 'rgba(100, 100, 120, 0.3)',
        gridLineAlpha: 0.3,
        activeFill: null,
        activeStroke: '#000000',
        activeStrokeWidth: 2,
        activeShadow: true,
        activeShadowColor: 'rgba(0, 0, 0, 0.3)',
        activeShadowBlur: 6,
        lockedFill: null,
        lockedStroke: '#000000',
        lockedStrokeWidth: 1.5,
        lockedShadow: false,
        lockedInnerHighlight: true,
        ghostFill: 'rgba(0, 0, 0, 0.08)',
        ghostStroke: 'rgba(0, 0, 0, 0.2)',
        ghostStrokeWidth: 1,
        uiText: '#1a1a2e',
        uiAccent: '#0060ff',
        blockColors: {
          I: '#0080a0',
          O: '#c0a000',
          T: '#8000c0',
          S: '#00a000',
          Z: '#c00000',
          J: '#0040c0',
          L: '#c08000'
        },
        clearAnimType: 'flash',
        clearAnimDuration: 300
      },
      colorBlindFriendly: {
        name: '色盲友好',
        background: '#1a1a2e',
        gridLine: 'rgba(100, 100, 120, 0.25)',
        gridLineAlpha: 0.25,
        activeFill: null,
        activeStroke: '#ffffff',
        activeStrokeWidth: 3,
        activeShadow: true,
        activeShadowColor: 'rgba(255, 255, 255, 0.6)',
        activeShadowBlur: 10,
        lockedFill: null,
        lockedStroke: '#ffffff',
        lockedStrokeWidth: 2,
        lockedShadow: true,
        lockedShadowColor: 'rgba(255, 255, 255, 0.25)',
        lockedShadowBlur: 6,
        lockedInnerHighlight: true,
        ghostFill: 'rgba(255, 255, 255, 0.08)',
        ghostStroke: 'rgba(255, 255, 255, 0.4)',
        ghostStrokeWidth: 2,
        uiText: '#ffffff',
        uiAccent: '#ff9500',
        blockColors: {
          I: '#00bfff',
          O: '#ffd700',
          T: '#9932cc',
          S: '#32cd32',
          Z: '#ff4500',
          J: '#1e90ff',
          L: '#ff8c00'
        },
        clearAnimType: 'flash',
        clearAnimDuration: 350
      }
    },

    ANIMATION: {
      clearAnimDuration: 300,
      clearAnimType: 'flash',
      easeOut: function(t) {
        return 1 - Math.pow(1 - t, 3);
      }
    }
  };

  function getTheme() {
    return CONFIG.THEMES[CONFIG.themeName];
  }

  function switchTheme(themeName) {
    if (CONFIG.THEMES[themeName]) {
      CONFIG.themeName = themeName;
      draw();
      drawNextPiece();
    }
  }

  const SHAPES = {
    I: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
    O: [[1,1], [1,1]],
    T: [[0,1,0], [1,1,1], [0,0,0]],
    S: [[0,1,1], [1,1,0], [0,0,0]],
    Z: [[1,1,0], [0,1,1], [0,0,0]],
    J: [[1,0,0], [1,1,1], [0,0,0]],
    L: [[0,0,1], [1,1,1], [0,0,0]]
  };

  const SHAPE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  let board = [];
  let boardState = [];
  let currentPiece = null;
  let nextPiece = null;
  let score = 0;
  let highScore = 0;
  let level = 1;
  let lines = 0;
  let dropInterval = 1000;
  let lastDrop = 0;
  let isGameRunning = false;
  let isPaused = false;
  let isGameOver = false;
  let animationId = null;
  let gameState = 'IDLE';
  let clearingRows = [];
  let clearAnimStartTime = 0;

  const canvas = document.getElementById('tetris-game');
  const ctx = canvas.getContext('2d');
  const nextCanvas = document.getElementById('next-piece');
  const nextCtx = nextCanvas.getContext('2d');
  const scoreElement = document.getElementById('score');
  const highScoreElement = document.getElementById('high-score');
  const levelElement = document.getElementById('level');
  const linesElement = document.getElementById('lines');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const messageElement = document.getElementById('game-message');

  function loadHighScore() {
    const saved = localStorage.getItem('tetris-high-score');
    if (saved) {
      highScore = parseInt(saved, 10);
      highScoreElement.textContent = highScore;
    }
  }

  function saveHighScore() {
    if (score > highScore) {
      highScore = score;
      highScoreElement.textContent = highScore;
      localStorage.setItem('tetris-high-score', highScore.toString());
    }
  }

  class Piece {
    constructor(type) {
      this.type = type;
      this.matrix = SHAPES[type].map(row => [...row]);
      this.x = 0;
      this.y = 0;
      this.spawn();
    }

    spawn() {
      const matrix = this.matrix;
      this.x = Math.floor((10 - matrix[0].length) / 2);
      this.y = 0;

      if (this.hasCollision(0, 0)) {
        return false;
      }
      return true;
    }

    rotate() {
      const matrix = this.matrix;
      const N = matrix.length;
      const rotated = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - 1 - j][i])
      );

      const originalMatrix = this.matrix;
      this.matrix = rotated;

      if (this.hasCollision(0, 0)) {
        let kicks = 0;
        const kickOffsets = [-1, 1, -2, 2, 0];

        for (const offset of kickOffsets) {
          if (!this.hasCollision(offset, 0)) {
            this.x += offset;
            return true;
          }
        }

        this.matrix = originalMatrix;
        return false;
      }
      return true;
    }

    move(dx, dy) {
      if (!this.hasCollision(dx, dy)) {
        this.x += dx;
        this.y += dy;
        return true;
      }
      return false;
    }

    hasCollision(dx, dy) {
      const matrix = this.matrix;
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          if (matrix[row][col] !== 0) {
            const newX = this.x + col + dx;
            const newY = this.y + row + dy;

            if (newX < 0 || newX >= 10 || newY >= 20) {
              return true;
            }

            if (newY >= 0 && board[newY][newX] !== 0) {
              return true;
            }
          }
        }
      }
      return false;
    }

    getGhostPosition() {
      let ghostY = this.y;
      while (!this.hasCollision(0, ghostY - this.y + 1)) {
        ghostY++;
      }
      return ghostY;
    }
  }

  function initCanvas() {
    canvas.width = CONFIG.canvasWidth;
    canvas.height = CONFIG.canvasHeight;
    nextCanvas.width = CONFIG.nextCanvasWidth;
    nextCanvas.height = CONFIG.nextCanvasHeight;
  }

  function initBoard() {
    board = [];
    boardState = [];
    for (let i = 0; i < 20; i++) {
      board.push(Array(10).fill(0));
      boardState.push(Array(10).fill('normal'));
    }
  }

  function initGame() {
    initBoard();
    score = 0;
    level = 1;
    lines = 0;
    dropInterval = 1000;
    isGameOver = false;
    isPaused = false;
    gameState = 'PLAYING';
    clearingRows = [];
    clearAnimStartTime = 0;

    updateScore();
    updateLevel();
    updateLines();

    currentPiece = new Piece(SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)]);
    nextPiece = new Piece(SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)]);
    if (!currentPiece.spawn()) {
      gameOver();
    }

    draw();
    drawNextPiece();

    messageElement.textContent = '';
  }

  function spawnPiece() {
    currentPiece = nextPiece;
    nextPiece = new Piece(SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)]);

    if (!currentPiece.spawn()) {
      gameOver();
    }

    drawNextPiece();
  }

  function merge() {
    const matrix = currentPiece.matrix;
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] !== 0) {
          const boardY = currentPiece.y + row;
          const boardX = currentPiece.x + col;
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            board[boardY][boardX] = matrix[row][col];
          }
        }
      }
    }
  }

  function checkLines() {
    const fullRows = [];
    for (let row = 19; row >= 0; row--) {
      if (board[row].every(cell => cell !== 0)) {
        fullRows.push(row);
      }
    }
    return fullRows;
  }

  function startClearAnimation(rows) {
    if (rows.length === 0) {
      removeRowsAndCollapse(rows);
      return;
    }

    clearingRows = rows;
    clearAnimStartTime = performance.now();
    gameState = 'CLEARING';

    if (CONFIG.inputLockDuringClear) {
      messageElement.textContent = '';
    }
  }

  function removeRowsAndCollapse(rowsToRemove) {
    const rowsToRemoveSet = new Set(rowsToRemove);
    const newBoard = [];
    const newBoardState = [];

    for (let row = 19; row >= 0; row--) {
      if (!rowsToRemoveSet.has(row)) {
        newBoard.unshift([...board[row]]);
        newBoardState.unshift([...boardState[row]]);
      }
    }

    while (newBoard.length < 20) {
      newBoard.unshift(Array(10).fill(0));
      newBoardState.unshift(Array(10).fill('normal'));
    }

    board = newBoard;
    boardState = newBoardState;
  }

  function completeClearAnimation() {
    removeRowsAndCollapse(clearingRows);

    let linesCleared = clearingRows.length;
    clearingRows = [];
    clearAnimStartTime = 0;

    if (linesCleared > 0) {
      lines += linesCleared;

      const points = [0, 100, 300, 500, 800];
      score += points[linesCleared] * level;

      const newLevel = Math.floor(lines / 10) + 1;
      if (newLevel > level) {
        level = newLevel;
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);
      }

      updateScore();
      updateLevel();
      updateLines();
    }

    spawnPiece();
    gameState = 'PLAYING';
    if (isPaused) {
      messageElement.textContent = '游戏已暂停';
    } else {
      messageElement.textContent = '';
    }
  }

  function clearLines() {
    const fullRows = checkLines();
    if (fullRows.length > 0) {
      startClearAnimation(fullRows);
    } else {
      spawnPiece();
    }
  }

  function hardDrop() {
    while (currentPiece.move(0, 1)) {
      score += 2;
    }
    lockPiece();
  }

  function lockPiece() {
    merge();
    clearLines();
  }

  function updateScore() {
    scoreElement.textContent = score;
  }

  function updateLevel() {
    levelElement.textContent = level;
  }

  function updateLines() {
    linesElement.textContent = lines;
  }

  function getBlockColor(type) {
    const theme = getTheme();
    return theme.blockColors[type] || type;
  }

  function drawBlock(ctx, x, y, colorType, size, state = 'normal') {
    const theme = getTheme();
    const color = getBlockColor(colorType);
    const isActive = state === 'active';
    const isGhost = state === 'ghost';
    const isClearing = state === 'clearing';

    const fillColor = theme.blockColors[colorType] || color;
    let alpha = 1;
    let scale = 1;

    if (isClearing && clearingRows.length > 0) {
      const now = performance.now();
      const elapsed = now - clearAnimStartTime;
      const progress = Math.min(elapsed / CONFIG.ANIMATION.clearAnimDuration, 1);
      const eased = CONFIG.ANIMATION.easeOut(progress);

      if (theme.clearAnimType === 'flash') {
        const flashFreq = 8;
        alpha = (Math.sin(progress * flashFreq * Math.PI) > 0) ? 1 : 0.3;
        alpha = alpha * 0.7 + 0.3;
      } else {
        alpha = 1 - eased;
      }

      scale = 1 + eased * 0.15;
    }

    const drawX = x + (size - size * scale) / 2;
    const drawY = y + (size - size * scale) / 2;
    const drawSize = size * scale;

    ctx.save();
    ctx.globalAlpha = alpha;

    if (isActive) {
      if (theme.activeShadow) {
        ctx.shadowColor = theme.activeShadowColor;
        ctx.shadowBlur = theme.activeShadowBlur;
      }
    } else if (isGhost) {
      ctx.fillStyle = theme.ghostFill;
    } else if (isClearing) {
    } else {
      if (theme.lockedShadow) {
        ctx.shadowColor = theme.lockedShadowColor;
        ctx.shadowBlur = theme.lockedShadowBlur;
      }
    }

    if (!isGhost && !isClearing) {
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.roundRect(drawX + 1, drawY + 1, drawSize - 2, drawSize - 2, 3);
      ctx.fill();
    }

    ctx.shadowBlur = 0;

    let strokeColor, strokeWidth;
    if (isActive) {
      strokeColor = theme.activeStroke;
      strokeWidth = theme.activeStrokeWidth;
    } else if (isGhost) {
      strokeColor = theme.ghostStroke;
      strokeWidth = theme.ghostStrokeWidth;
    } else if (isClearing) {
      strokeColor = fillColor;
      strokeWidth = 2;
    } else {
      strokeColor = theme.lockedStroke;
      strokeWidth = theme.lockedStrokeWidth;
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.roundRect(drawX + 1, drawY + 1, drawSize - 2, drawSize - 2, 3);
    ctx.stroke();

    if (!isGhost && !isClearing) {
      if (isActive) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.roundRect(drawX + 2, drawY + 2, drawSize / 3.5, drawSize / 3.5, 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.roundRect(drawX + 2, drawY + 2, drawSize / 4, drawSize / 4, 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.roundRect(drawX + drawSize - drawSize / 3 - 2, drawY + drawSize - drawSize / 3 - 2, drawSize / 4, drawSize / 4, 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function drawGrid() {
    const theme = getTheme();
    ctx.strokeStyle = theme.gridLine;
    ctx.lineWidth = 1;
    ctx.globalAlpha = theme.gridLineAlpha;

    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CONFIG.blockSize, 0);
      ctx.lineTo(i * CONFIG.blockSize, canvas.height);
      ctx.stroke();
    }

    for (let j = 0; j <= 20; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * CONFIG.blockSize);
      ctx.lineTo(canvas.width, j * CONFIG.blockSize);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  function draw() {
    const theme = getTheme();

    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    const clearingSet = new Set(clearingRows);

    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        if (board[row][col] !== 0) {
          const state = clearingSet.has(row) ? 'clearing' : 'locked';
          drawBlock(ctx, col * CONFIG.blockSize, row * CONFIG.blockSize, board[row][col], CONFIG.blockSize, state);
        }
      }
    }

    if (currentPiece && gameState !== 'CLEARING') {
      const ghostY = currentPiece.getGhostPosition();
      const ghostMatrix = currentPiece.matrix;
      for (let row = 0; row < ghostMatrix.length; row++) {
        for (let col = 0; col < ghostMatrix[row].length; col++) {
          if (ghostMatrix[row][col] !== 0) {
            const theme = getTheme();
            ctx.fillStyle = theme.ghostFill;
            ctx.fillRect(
              (currentPiece.x + col) * CONFIG.blockSize,
              (ghostY + row) * CONFIG.blockSize,
              CONFIG.blockSize,
              CONFIG.blockSize
            );
            ctx.strokeStyle = theme.ghostStroke;
            ctx.lineWidth = theme.ghostStrokeWidth;
            ctx.strokeRect(
              (currentPiece.x + col) * CONFIG.blockSize,
              (ghostY + row) * CONFIG.blockSize,
              CONFIG.blockSize,
              CONFIG.blockSize
            );
          }
        }
      }

      const matrix = currentPiece.matrix;
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          if (matrix[row][col] !== 0) {
            const drawY = currentPiece.y + row;
            if (drawY >= 0) {
              drawBlock(ctx, (currentPiece.x + col) * CONFIG.blockSize, drawY * CONFIG.blockSize, matrix[row][col], CONFIG.blockSize, 'active');
            }
          }
        }
      }
    }
  }

  function drawNextPiece() {
    const theme = getTheme();

    nextCtx.fillStyle = theme.background;
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (!nextPiece) return;

    const matrix = nextPiece.matrix;
    const blockSize = 20;
    const offsetX = (nextCanvas.width - matrix[0].length * blockSize) / 2;
    const offsetY = (nextCanvas.height - matrix.length * blockSize) / 2;

    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] !== 0) {
          const color = getBlockColor(matrix[row][col]);
          nextCtx.fillStyle = theme.blockColors[matrix[row][col]];
          nextCtx.beginPath();
          nextCtx.roundRect(
            offsetX + col * blockSize,
            offsetY + row * blockSize,
            blockSize - 1,
            blockSize - 1,
            2
          );
          nextCtx.fill();

          nextCtx.strokeStyle = theme.activeStroke;
          nextCtx.lineWidth = 1;
          nextCtx.stroke();
        }
      }
    }
  }

  function gameLoop(timestamp) {
    if (!isGameRunning) return;

    if (gameState === 'CLEARING') {
      const elapsed = timestamp - clearAnimStartTime;
      if (elapsed >= CONFIG.ANIMATION.clearAnimDuration) {
        completeClearAnimation();
      }
    } else if (!isPaused && !isGameOver) {
      if (timestamp - lastDrop > dropInterval) {
        if (!currentPiece.move(0, 1)) {
          lockPiece();
        }
        lastDrop = timestamp;
      }
    }

    draw();
    animationId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    if (isGameRunning) {
      cancelAnimationFrame(animationId);
    }

    loadHighScore();
    initGame();
    isGameRunning = true;
    isPaused = false;
    isGameOver = false;
    startBtn.textContent = '重新开始';
    pauseBtn.disabled = false;
    pauseBtn.textContent = '暂停';
    lastDrop = performance.now();

    gameLoop(lastDrop);
  }

  function togglePause() {
    if (!isGameRunning || isGameOver) return;

    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '继续' : '暂停';

    if (isPaused) {
      messageElement.textContent = '游戏已暂停';
    } else {
      messageElement.textContent = '';
      lastDrop = performance.now();
      gameLoop(performance.now());
    }
  }

  function gameOver() {
    isGameRunning = false;
    isGameOver = true;
    cancelAnimationFrame(animationId);
    saveHighScore();

    messageElement.innerHTML = `
      <div class="game-over">
        <h3>游戏结束！</h3>
        <p>最终得分：${score}</p>
        <p>最高分：${highScore}</p>
        <p>消除行数：${lines}</p>
      </div>
    `;

    startBtn.textContent = '重新开始';
    pauseBtn.disabled = true;
  }

  function isInputLocked() {
    return gameState === 'CLEARING' && CONFIG.inputLockDuringClear;
  }

  function handleKeyDown(e) {
    if (!isGameRunning || isGameOver) return;

    if (isInputLocked()) return;

    if (isPaused && e.key.toLowerCase() !== 'p') return;

    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        if (!isPaused && currentPiece) currentPiece.move(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        if (!isPaused && currentPiece) currentPiece.move(1, 0);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        if (!isPaused && currentPiece) {
          if (currentPiece.move(0, 1)) {
            score += 1;
            updateScore();
          }
        }
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        if (!isPaused && currentPiece) currentPiece.rotate();
        break;
      case ' ':
        e.preventDefault();
        if (!isPaused) hardDrop();
        break;
      case 'p':
      case 'P':
        e.preventDefault();
        togglePause();
        break;
      case 't':
      case 'T':
        e.preventDefault();
        const themes = Object.keys(CONFIG.THEMES);
        const currentIndex = themes.indexOf(CONFIG.themeName);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        switchTheme(nextTheme);
        break;
    }

    if (!isPaused) {
      draw();
    }
  }

  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (!isGameRunning || isGameOver || isPaused) return;

    if (isInputLocked()) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    const minSwipeDistance = 30;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          currentPiece.move(1, 0);
        } else {
          currentPiece.move(-1, 0);
        }
      }
    } else {
      if (Math.abs(diffY) > minSwipeDistance) {
        if (diffY > 0) {
          if (currentPiece.move(0, 1)) {
            score += 1;
            updateScore();
          }
        } else {
          currentPiece.rotate();
        }
      }
    }

    draw();
  }

  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', togglePause);
  document.addEventListener('keydown', handleKeyDown);

  const themeBtn = document.getElementById('theme-btn');
  const themeNameDisplay = document.getElementById('current-theme');

  if (themeBtn && themeNameDisplay) {
    const themeDisplayNames = {
      darkHighContrast: '高对比度深色',
      lightHighContrast: '高对比度浅色',
      colorBlindFriendly: '色盲友好'
    };

    themeBtn.addEventListener('click', function() {
      const themes = Object.keys(CONFIG.THEMES);
      const currentIndex = themes.indexOf(CONFIG.themeName);
      const nextTheme = themes[(currentIndex + 1) % themes.length];
      switchTheme(nextTheme);
      themeNameDisplay.textContent = themeDisplayNames[nextTheme] || nextTheme;
    });

    themeNameDisplay.textContent = themeDisplayNames[CONFIG.themeName] || CONFIG.themeName;
  }

  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

  window.tetrisSwitchTheme = switchTheme;

  loadHighScore();
  initCanvas();
  initBoard();
  draw();
})();

(function() {
  // 游戏配置
  const CONFIG = {
    gridSize: 20,
    canvasWidth: 400,
    canvasHeight: 400,
    initialSpeed: 150,
    speedIncrease: 2,
    colors: {
      snakeHead: '#38bdf8',
      snakeBody: '#0ea5e9',
      food: '#ef4444',
      background: '#111827',
      grid: '#1f2937'
    }
  };

  // 游戏状态
  let snake = [];
  let food = {};
  let direction = 'right';
  let nextDirection = 'right';
  let score = 0;
  let highScore = 0;
  let gameLoop = null;
  let isGameRunning = false;
  let isPaused = false;
  let speed = CONFIG.initialSpeed;

  // DOM 元素
  const canvas = document.getElementById('snake-game');
  const ctx = canvas.getContext('2d');
  const scoreElement = document.getElementById('score');
  const highScoreElement = document.getElementById('high-score');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const messageElement = document.getElementById('game-message');

  // 初始化 Canvas
  function initCanvas() {
    canvas.width = CONFIG.canvasWidth;
    canvas.height = CONFIG.canvasHeight;
    drawGrid();
  }

  // 绘制网格
  function drawGrid() {
    ctx.fillStyle = CONFIG.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = CONFIG.colors.grid;
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += CONFIG.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += CONFIG.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  // 初始化游戏
  function initGame() {
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    speed = CONFIG.initialSpeed;
    updateScore();
    generateFood();
    draw();
  }

  // 生成食物
  function generateFood() {
    const maxX = Math.floor(canvas.width / CONFIG.gridSize);
    const maxY = Math.floor(canvas.height / CONFIG.gridSize);

    do {
      food = {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY)
      };
    } while (isSnakePosition(food.x, food.y));
  }

  // 检查是否是蛇的位置
  function isSnakePosition(x, y) {
    return snake.some(segment => segment.x === x && segment.y === y);
  }

  // 绘制蛇
  function drawSnake() {
    snake.forEach((segment, index) => {
      const x = segment.x * CONFIG.gridSize;
      const y = segment.y * CONFIG.gridSize;

      // 蛇头颜色不同
      if (index === 0) {
        ctx.fillStyle = CONFIG.colors.snakeHead;
      } else {
        ctx.fillStyle = CONFIG.colors.snakeBody;
      }

      // 绘制圆角矩形
      const radius = 4;
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, CONFIG.gridSize - 2, CONFIG.gridSize - 2, radius);
      ctx.fill();
    });
  }

  // 绘制食物
  function drawFood() {
    const x = food.x * CONFIG.gridSize;
    const y = food.y * CONFIG.gridSize;

    ctx.fillStyle = CONFIG.colors.food;
    ctx.beginPath();
    ctx.arc(
      x + CONFIG.gridSize / 2,
      y + CONFIG.gridSize / 2,
      CONFIG.gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 添加光晕效果
    ctx.shadowColor = CONFIG.colors.food;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 绘制游戏
  function draw() {
    drawGrid();
    drawFood();
    drawSnake();
  }

  // 移动蛇
  function moveSnake() {
    direction = nextDirection;

    const head = { ...snake[0] };

    switch (direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
    }

    // 检查碰撞
    if (checkCollision(head)) {
      gameOver();
      return;
    }

    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      updateScore();
      generateFood();
      // 加速
      if (speed > 50) {
        speed -= CONFIG.speedIncrease;
      }
    } else {
      snake.pop();
    }
  }

  // 检查碰撞
  function checkCollision(head) {
    // 撞墙
    const maxX = Math.floor(canvas.width / CONFIG.gridSize);
    const maxY = Math.floor(canvas.height / CONFIG.gridSize);

    if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY) {
      return true;
    }

    // 撞自己
    return isSnakePosition(head.x, head.y);
  }

  // 更新分数
  function updateScore() {
    scoreElement.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreElement.textContent = highScore;
    }
  }

  // 游戏循环
  function gameLoopFn() {
    if (!isPaused) {
      moveSnake();
      draw();
    }
  }

  // 开始游戏
  function startGame() {
    if (isGameRunning) {
      return;
    }

    initGame();
    isGameRunning = true;
    isPaused = false;
    startBtn.textContent = '重新开始';
    pauseBtn.disabled = false;
    pauseBtn.textContent = '暂停';
    messageElement.textContent = '';

    if (gameLoop) {
      clearInterval(gameLoop);
    }

    gameLoop = setInterval(gameLoopFn, speed);
  }

  // 暂停游戏
  function togglePause() {
    if (!isGameRunning) {
      return;
    }

    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '继续' : '暂停';

    if (isPaused) {
      messageElement.textContent = '游戏已暂停';
    } else {
      messageElement.textContent = '';
    }
  }

  // 游戏结束
  function gameOver() {
    clearInterval(gameLoop);
    isGameRunning = false;
    gameLoop = null;

    messageElement.innerHTML = `
      <div class="game-over">
        <h3>游戏结束！</h3>
        <p>最终得分：${score}</p>
        <p>最高分：${highScore}</p>
      </div>
    `;

    startBtn.textContent = '重新开始';
    pauseBtn.disabled = true;
  }

  // 键盘控制
  function handleKeyDown(e) {
    const key = e.key.toLowerCase();

    // 暂停/继续
    if (key === ' ') {
      e.preventDefault();
      if (isGameRunning) {
        togglePause();
      }
      return;
    }

    // 方向控制
    if (!isGameRunning || isPaused) {
      return;
    }

    switch (key) {
      case 'arrowup':
      case 'w':
        if (direction !== 'down') {
          nextDirection = 'up';
        }
        break;
      case 'arrowdown':
      case 's':
        if (direction !== 'up') {
          nextDirection = 'down';
        }
        break;
      case 'arrowleft':
      case 'a':
        if (direction !== 'right') {
          nextDirection = 'left';
        }
        break;
      case 'arrowright':
      case 'd':
        if (direction !== 'left') {
          nextDirection = 'right';
        }
        break;
    }
  }

  // 事件监听
  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', togglePause);
  document.addEventListener('keydown', handleKeyDown);

  // 初始化
  initCanvas();
  initGame();
})();
(function() {
  // 游戏配置
  const CONFIG = {
    canvasWidth: 480,
    canvasHeight: 400,
    paddleWidth: 80,
    paddleHeight: 12,
    ballRadius: 6,
    ballSpeed: 5,
    paddleSpeed: 8,
    brickRowCount: 5,
    brickColumnCount: 8,
    brickPadding: 8,
    brickOffsetTop: 50,
    brickOffsetLeft: 35,
    colors: {
      background: '#111827',
      paddle: '#38bdf8',
      ball: '#f472b6',
      bricks: ['#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985'],
      text: '#ffffff'
    }
  };

  // 游戏状态
  let paddle = {};
  let ball = {};
  let bricks = [];
  let particles = [];
  let score = 0;
  let highScore = 0;
  let lives = 3;
  let isGameRunning = false;
  let isPaused = false;
  let rightPressed = false;
  let leftPressed = false;
  let animationId = null;

  // DOM 元素
  const canvas = document.getElementById('breakout-game');
  const ctx = canvas.getContext('2d');
  const scoreElement = document.getElementById('score');
  const highScoreElement = document.getElementById('high-score');
  const livesElement = document.getElementById('lives');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const messageElement = document.getElementById('game-message');

  // 计算砖块宽度
  const brickWidth = (CONFIG.canvasWidth - 2 * CONFIG.brickOffsetLeft - (CONFIG.brickColumnCount - 1) * CONFIG.brickPadding) / CONFIG.brickColumnCount;
  const brickHeight = 20;

  // 粒子类
  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 6;
      this.speedY = (Math.random() - 0.5) * 6;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.02;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      this.size *= 0.98;
    }

    draw() {
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // 初始化 Canvas
  function initCanvas() {
    canvas.width = CONFIG.canvasWidth;
    canvas.height = CONFIG.canvasHeight;
  }

  // 初始化游戏
  function initGame() {
    // 初始化挡板
    paddle = {
      x: (CONFIG.canvasWidth - CONFIG.paddleWidth) / 2,
      y: CONFIG.canvasHeight - CONFIG.paddleHeight - 10
    };

    // 初始化球
    ball = {
      x: CONFIG.canvasWidth / 2,
      y: CONFIG.canvasHeight - 30,
      dx: CONFIG.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
      dy: -CONFIG.ballSpeed
    };

    // 初始化砖块
    bricks = [];
    for (let c = 0; c < CONFIG.brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < CONFIG.brickRowCount; r++) {
        bricks[c][r] = {
          x: 0,
          y: 0,
          status: 1,
          color: CONFIG.colors.bricks[r]
        };
      }
    }

    // 重置状态
    score = 0;
    lives = 3;
    particles = [];
    updateScore();
    updateLives();
  }

  // 创建粒子效果
  function createParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
      particles.push(new Particle(x, y, color));
    }
  }

  // 绘制挡板
  function drawPaddle() {
    ctx.fillStyle = CONFIG.colors.paddle;
    ctx.shadowColor = CONFIG.colors.paddle;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, CONFIG.paddleWidth, CONFIG.paddleHeight, 6);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 绘制球
  function drawBall() {
    ctx.fillStyle = CONFIG.colors.ball;
    ctx.shadowColor = CONFIG.colors.ball;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, CONFIG.ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 绘制砖块
  function drawBricks() {
    for (let c = 0; c < CONFIG.brickColumnCount; c++) {
      for (let r = 0; r < CONFIG.brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = c * (brickWidth + CONFIG.brickPadding) + CONFIG.brickOffsetLeft;
          const brickY = r * (brickHeight + CONFIG.brickPadding) + CONFIG.brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;

          ctx.fillStyle = bricks[c][r].color;
          ctx.beginPath();
          ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 4);
          ctx.fill();
        }
      }
    }
  }

  // 绘制粒子
  function drawParticles() {
    particles.forEach((particle, index) => {
      particle.update();
      particle.draw();

      // 移除消失的粒子
      if (particle.life <= 0 || particle.size <= 0.5) {
        particles.splice(index, 1);
      }
    });
  }

  // 碰撞检测
  function collisionDetection() {
    for (let c = 0; c < CONFIG.brickColumnCount; c++) {
      for (let r = 0; r < CONFIG.brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (
            ball.x > b.x &&
            ball.x < b.x + brickWidth &&
            ball.y > b.y &&
            ball.y < b.y + brickHeight
          ) {
            ball.dy = -ball.dy;
            b.status = 0;
            score += 10 * (CONFIG.brickRowCount - r);
            updateScore();

            // 创建粒子效果
            createParticles(
              b.x + brickWidth / 2,
              b.y + brickHeight / 2,
              b.color
            );

            // 检查是否获胜
            if (checkWin()) {
              gameWin();
            }
          }
        }
      }
    }
  }

  // 检查是否获胜
  function checkWin() {
    for (let c = 0; c < CONFIG.brickColumnCount; c++) {
      for (let r = 0; r < CONFIG.brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          return false;
        }
      }
    }
    return true;
  }

  // 移动挡板
  function movePaddle() {
    if (rightPressed && paddle.x < CONFIG.canvasWidth - CONFIG.paddleWidth) {
      paddle.x += CONFIG.paddleSpeed;
    } else if (leftPressed && paddle.x > 0) {
      paddle.x -= CONFIG.paddleSpeed;
    }
  }

  // 更新球的位置
  function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 左右墙壁碰撞
    if (ball.x + ball.dx > CONFIG.canvasWidth - CONFIG.ballRadius || ball.x + ball.dx < CONFIG.ballRadius) {
      ball.dx = -ball.dx;
    }

    // 顶部碰撞
    if (ball.y + ball.dy < CONFIG.ballRadius) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > CONFIG.canvasHeight - CONFIG.ballRadius) {
      // 底部碰撞检测
      if (ball.x > paddle.x && ball.x < paddle.x + CONFIG.paddleWidth) {
        // 根据碰撞位置改变反弹角度
        const hitPoint = ball.x - (paddle.x + CONFIG.paddleWidth / 2);
        const normalizedHit = hitPoint / (CONFIG.paddleWidth / 2);
        const angle = normalizedHit * (Math.PI / 3); // 最大 60 度

        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = speed * Math.sin(angle);
        ball.dy = -speed * Math.cos(angle);
      } else {
        // 球掉落
        lives--;
        updateLives();

        if (lives <= 0) {
          gameOver();
          return;
        } else {
          // 重置球的位置
          ball.x = CONFIG.canvasWidth / 2;
          ball.y = CONFIG.canvasHeight - 30;
          ball.dx = CONFIG.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
          ball.dy = -CONFIG.ballSpeed;
          paddle.x = (CONFIG.canvasWidth - CONFIG.paddleWidth) / 2;
        }
      }
    }
  }

  // 更新分数
  function updateScore() {
    scoreElement.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreElement.textContent = highScore;
    }
  }

  // 更新生命值
  function updateLives() {
    livesElement.textContent = lives;
  }

  // 游戏循环
  function gameLoop() {
    if (!isPaused && isGameRunning) {
      // 清除画布
      ctx.fillStyle = CONFIG.colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制游戏元素
      drawBricks();
      drawPaddle();
      drawBall();
      drawParticles();

      // 更新游戏状态
      collisionDetection();
      movePaddle();
      moveBall();

      animationId = requestAnimationFrame(gameLoop);
    }
  }

  // 开始游戏
  function startGame() {
    if (isGameRunning) {
      // 重新开始
      cancelAnimationFrame(animationId);
    }

    initGame();
    isGameRunning = true;
    isPaused = false;
    startBtn.textContent = '重新开始';
    pauseBtn.disabled = false;
    pauseBtn.textContent = '暂停';
    messageElement.textContent = '';

    gameLoop();
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
      gameLoop();
    }
  }

  // 游戏结束
  function gameOver() {
    isGameRunning = false;
    cancelAnimationFrame(animationId);

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

  // 游戏胜利
  function gameWin() {
    isGameRunning = false;
    cancelAnimationFrame(animationId);

    messageElement.innerHTML = `
      <div class="game-over">
        <h3>🎉 恭喜获胜！</h3>
        <p>最终得分：${score}</p>
        <p>剩余生命：${lives}</p>
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
    if (key === 'arrowright' || key === 'd') {
      rightPressed = true;
    } else if (key === 'arrowleft' || key === 'a') {
      leftPressed = true;
    }
  }

  function handleKeyUp(e) {
    const key = e.key.toLowerCase();

    if (key === 'arrowright' || key === 'd') {
      rightPressed = false;
    } else if (key === 'arrowleft' || key === 'a') {
      leftPressed = false;
    }
  }

  // 鼠标控制
  function handleMouseMove(e) {
    if (!isGameRunning || isPaused) return;

    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddle.x = relativeX - CONFIG.paddleWidth / 2;

      // 边界检查
      if (paddle.x < 0) {
        paddle.x = 0;
      } else if (paddle.x + CONFIG.paddleWidth > canvas.width) {
        paddle.x = canvas.width - CONFIG.paddleWidth;
      }
    }
  }

  // 事件监听
  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', togglePause);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  canvas.addEventListener('mousemove', handleMouseMove);

  // 初始化
  initCanvas();
  initGame();
  drawBricks();
  drawPaddle();
  drawBall();
})();
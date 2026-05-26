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
    // 图片砖块配置
    useImageBricks: true,  // 设置为 true 启用图片砖块
    backgroundImage: (window.siteBaseurl || '') + '/assets/img/background.png',  // 背景图片路径（推荐 3:1 比例，如 1500x500px）
    colors: {
      background: '#ffffff',
      paddle: '#55796f',
      ball: '#6f7f8d',
      bricks: ['#e8eeeb', '#b8c7c2', '#8ba397', '#55796f', '#7f9eb2'],
      text: '#26312f'
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
  let backgroundImage = new Image();
  let isImageLoaded = false;

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

  // 加载背景图片
  function loadBackgroundImage() {
    if (CONFIG.useImageBricks) {
      backgroundImage.src = CONFIG.backgroundImage;
      backgroundImage.onload = () => {
        isImageLoaded = true;
        console.log('背景图片加载成功，路径：', CONFIG.backgroundImage);
        // 图片加载完成后重新绘制砖块
        if (!isGameRunning) {
          drawBricks();
        }
      };
      backgroundImage.onerror = () => {
        console.warn('背景图片加载失败，将使用纯色砖块');
        isImageLoaded = false;
      };
    }
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
    // 根据配置选择绘制模式
    if (CONFIG.useImageBricks && isImageLoaded) {
      drawImageBricks();
    } else {
      drawColorBricks();
    }
  }

  // 绘制图片砖块
  function drawImageBricks() {
    // 计算砖块区域实际尺寸
    const bricksAreaWidth = CONFIG.brickColumnCount * brickWidth + (CONFIG.brickColumnCount - 1) * CONFIG.brickPadding;
    const bricksAreaHeight = CONFIG.brickRowCount * brickHeight + (CONFIG.brickRowCount - 1) * CONFIG.brickPadding;

    for (let c = 0; c < CONFIG.brickColumnCount; c++) {
      for (let r = 0; r < CONFIG.brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = c * (brickWidth + CONFIG.brickPadding) + CONFIG.brickOffsetLeft;
          const brickY = r * (brickHeight + CONFIG.brickPadding) + CONFIG.brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;

          // 计算原图中对应的位置（使用 object-fit: cover 逻辑）
          const sourceX = (c / CONFIG.brickColumnCount) * backgroundImage.width;
          const sourceY = (r / CONFIG.brickRowCount) * backgroundImage.height;
          const sourceWidth = backgroundImage.width / CONFIG.brickColumnCount;
          const sourceHeight = backgroundImage.height / CONFIG.brickRowCount;

          // 绘制图片的对应部分
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 4);
          ctx.clip();
          ctx.drawImage(
            backgroundImage,
            sourceX, sourceY, sourceWidth, sourceHeight,  // 源矩形
            brickX, brickY, brickWidth, brickHeight       // 目标矩形
          );
          ctx.restore();
        }
      }
    }
  }

  // 绘制纯色砖块
  function drawColorBricks() {
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
          // AABB 碰撞检测（考虑球的半径）
          const ballLeft = ball.x - CONFIG.ballRadius;
          const ballRight = ball.x + CONFIG.ballRadius;
          const ballTop = ball.y - CONFIG.ballRadius;
          const ballBottom = ball.y + CONFIG.ballRadius;

          // 检查是否碰撞
          if (
            ballRight > b.x &&
            ballLeft < b.x + brickWidth &&
            ballBottom > b.y &&
            ballTop < b.y + brickHeight
          ) {
            // 计算碰撞深度
            const overlapLeft = ballRight - b.x;
            const overlapRight = (b.x + brickWidth) - ballLeft;
            const overlapTop = ballBottom - b.y;
            const overlapBottom = (b.y + brickHeight) - ballTop;

            // 找出最小重叠方向
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            // 根据最小重叠方向反弹
            if (minOverlap === overlapTop) {
              // 从上方撞击
              ball.y = b.y - CONFIG.ballRadius; // 修正位置
              ball.dy = -Math.abs(ball.dy); // 向上反弹
            } else if (minOverlap === overlapBottom) {
              // 从下方撞击
              ball.y = b.y + brickHeight + CONFIG.ballRadius; // 修正位置
              ball.dy = Math.abs(ball.dy); // 向下反弹
            } else if (minOverlap === overlapLeft) {
              // 从左侧撞击
              ball.x = b.x - CONFIG.ballRadius; // 修正位置
              ball.dx = -Math.abs(ball.dx); // 向左反弹
            } else if (minOverlap === overlapRight) {
              // 从右侧撞击
              ball.x = b.x + brickWidth + CONFIG.ballRadius; // 修正位置
              ball.dx = Math.abs(ball.dx); // 向右反弹
            }

            // 消除砖块
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

            // 每次只处理一个碰撞，避免多重碰撞
            return;
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
    if (ball.x + CONFIG.ballRadius > CONFIG.canvasWidth) {
      ball.x = CONFIG.canvasWidth - CONFIG.ballRadius;
      ball.dx = -Math.abs(ball.dx);
    } else if (ball.x - CONFIG.ballRadius < 0) {
      ball.x = CONFIG.ballRadius;
      ball.dx = Math.abs(ball.dx);
    }

    // 顶部碰撞
    if (ball.y - CONFIG.ballRadius < 0) {
      ball.y = CONFIG.ballRadius;
      ball.dy = Math.abs(ball.dy);
    } else if (ball.y + CONFIG.ballRadius > canvas.height - 10) {
      // 底部碰撞检测
      const paddleTop = paddle.y;
      const paddleBottom = paddle.y + CONFIG.paddleHeight;

      // 检查球是否与挡板碰撞（考虑球的半径）
      if (
        ball.y + CONFIG.ballRadius >= paddleTop &&
        ball.y - CONFIG.ballRadius <= paddleBottom &&
        ball.x >= paddle.x - CONFIG.ballRadius &&
        ball.x <= paddle.x + CONFIG.paddleWidth + CONFIG.ballRadius
      ) {
        // 只有当球向下移动时才反弹
        if (ball.dy > 0) {
          // 修正球的位置到挡板上方
          ball.y = paddleTop - CONFIG.ballRadius;

          // 根据碰撞位置改变反弹角度
          const hitPoint = ball.x - (paddle.x + CONFIG.paddleWidth / 2);
          const normalizedHit = hitPoint / (CONFIG.paddleWidth / 2);
          const angle = normalizedHit * (Math.PI / 3); // 最大 60 度

          const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
          ball.dx = speed * Math.sin(angle);
          ball.dy = -speed * Math.cos(angle);
        }
      } else if (ball.y - CONFIG.ballRadius > canvas.height) {
        // 球掉落
        lives--;
        updateLives();

        if (lives <= 0) {
          gameOver();
          return;
        } else {
          // 重置球的位置
          ball.x = CONFIG.canvasWidth / 2;
          ball.y = canvas.height - 30;
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
  loadBackgroundImage();
  initGame();
  drawBricks();
  drawPaddle();
  drawBall();
})();

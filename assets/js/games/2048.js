(function() {
  // 游戏配置
  const CONFIG = {
    gridSize: 4,
    canvasWidth: 400,
    canvasHeight: 400,
    animationDuration: 150, // 动画持续时间（毫秒）
    colors: {
      background: '#111827',
      grid: '#1f2937',
      empty: '#374151',
      2: '#38bdf8',
      4: '#0ea5e9',
      8: '#0284c7',
      16: '#0369a1',
      32: '#075985',
      64: '#0c4a6e',
      128: '#f472b6',
      256: '#ec4899',
      512: '#db2777',
      1024: '#be185d',
      2048: '#9d174d',
      textLight: '#ffffff',
      textDark: '#0f172a'
    }
  };

  // 游戏状态
  let board = [];
  let tiles = []; // 存储所有方块对象
  let score = 0;
  let highScore = 0;
  let isGameOver = false;
  let isWon = false;
  let isAnimating = false;
  let animationId = null;

  // DOM 元素
  const canvas = document.getElementById('game2048');
  const ctx = canvas.getContext('2d');
  const scoreElement = document.getElementById('score');
  const highScoreElement = document.getElementById('high-score');
  const startBtn = document.getElementById('start-btn');
  const messageElement = document.getElementById('game-message');

  let tileIdCounter = 0;

  // 方块类
  class Tile {
    constructor(row, col, value) {
      this.id = tileIdCounter++;
      this.row = row;
      this.col = col;
      this.value = value;
      this.previousRow = row;
      this.previousCol = col;
      this.scale = 0; // 用于出现动画
      this.isNew = true;
      this.mergedFrom = null; // 记录合并来源
      this.toDelete = false; // 标记删除（合并后的旧方块）
    }

    // 保存当前位置用于动画
    savePosition() {
      this.previousRow = this.row;
      this.previousCol = this.col;
    }

    // 更新位置
    updatePosition(row, col) {
      this.row = row;
      this.col = col;
    }

    // 获取当前动画位置
    getAnimatedPosition(progress) {
      const tileSize = (canvas.width - (CONFIG.gridSize + 1) * 10) / CONFIG.gridSize;
      const startX = 10 + this.previousCol * (tileSize + 10);
      const startY = 10 + this.previousRow * (tileSize + 10);
      const endX = 10 + this.col * (tileSize + 10);
      const endY = 10 + this.row * (tileSize + 10);

      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;

      return { x, y };
    }

    // 获取出现动画的缩放比例
    getScale(progress) {
      if (this.isNew) {
        return Math.min(1, progress * 2);
      }
      if (this.mergedFrom) {
        return 1 + Math.sin(progress * Math.PI) * 0.1; // 合并时的弹跳效果
      }
      return 1;
    }

    // 移动到新位置
    moveTo(row, col) {
      this.savePosition();
      this.row = row;
      this.col = col;
      this.isNew = false;
    }
  }

  // 缓动函数
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // 初始化 Canvas
  function initCanvas() {
    canvas.width = CONFIG.canvasWidth;
    canvas.height = CONFIG.canvasHeight;
  }

  // 初始化游戏
  function initGame() {
    board = Array(CONFIG.gridSize).fill(null).map(() => Array(CONFIG.gridSize).fill(0));
    tiles = [];
    score = 0;
    isGameOver = false;
    isWon = false;
    isAnimating = false;
    updateScore();
    addRandomTile();
    addRandomTile();
    draw();
    messageElement.textContent = '';
  }

  // 添加随机方块
  function addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < CONFIG.gridSize; i++) {
      for (let j = 0; j < CONFIG.gridSize; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4;
      board[randomCell.row][randomCell.col] = value;
      const tile = new Tile(randomCell.row, randomCell.col, value);
      tiles.push(tile);
    }
  }

  // 获取方块颜色
  function getTileColor(value) {
    return CONFIG.colors[value] || CONFIG.colors[2048];
  }

  // 获取文字颜色
  function getTextColor(value) {
    return value <= 4 ? CONFIG.colors.textDark : CONFIG.colors.textLight;
  }

  // 绘制游戏
  function draw() {
    // 绘制背景
    ctx.fillStyle = CONFIG.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tileSize = (canvas.width - (CONFIG.gridSize + 1) * 10) / CONFIG.gridSize;

    // 绘制网格背景
    for (let i = 0; i < CONFIG.gridSize; i++) {
      for (let j = 0; j < CONFIG.gridSize; j++) {
        const x = 10 + j * (tileSize + 10);
        const y = 10 + i * (tileSize + 10);

        ctx.fillStyle = CONFIG.colors.empty;
        ctx.beginPath();
        ctx.roundRect(x, y, tileSize, tileSize, 6);
        ctx.fill();
      }
    }

    // 绘制方块
    tiles.forEach(tile => {
      const position = tile.getAnimatedPosition(1);
      const scale = tile.getScale(1);
      const scaledSize = tileSize * scale;
      const offset = (tileSize - scaledSize) / 2;

      ctx.fillStyle = getTileColor(tile.value);
      ctx.beginPath();
      ctx.roundRect(
        position.x + offset,
        position.y + offset,
        scaledSize,
        scaledSize,
        6
      );
      ctx.fill();

      // 绘制数字
      if (tile.value !== 0) {
        ctx.fillStyle = getTextColor(tile.value);
        const fontSize = tile.value >= 1000 ? tileSize * 0.35 * scale : tileSize * 0.5 * scale;
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          tile.value,
          position.x + tileSize / 2,
          position.y + tileSize / 2
        );
      }
    });
  }

  // 动画绘制
  function drawAnimated(progress) {
    // 绘制背景
    ctx.fillStyle = CONFIG.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tileSize = (canvas.width - (CONFIG.gridSize + 1) * 10) / CONFIG.gridSize;

    // 绘制网格背景
    for (let i = 0; i < CONFIG.gridSize; i++) {
      for (let j = 0; j < CONFIG.gridSize; j++) {
        const x = 10 + j * (tileSize + 10);
        const y = 10 + i * (tileSize + 10);

        ctx.fillStyle = CONFIG.colors.empty;
        ctx.beginPath();
        ctx.roundRect(x, y, tileSize, tileSize, 6);
        ctx.fill();
      }
    }

    // 绘制方块
    tiles.forEach(tile => {
      const position = tile.getAnimatedPosition(progress);
      const scale = tile.getScale(progress);
      const scaledSize = tileSize * scale;
      const offset = (tileSize - scaledSize) / 2;

      ctx.fillStyle = getTileColor(tile.value);
      ctx.beginPath();
      ctx.roundRect(
        position.x + offset,
        position.y + offset,
        scaledSize,
        scaledSize,
        6
      );
      ctx.fill();

      // 绘制数字
      if (tile.value !== 0) {
        ctx.fillStyle = getTextColor(tile.value);
        const fontSize = tile.value >= 1000 ? tileSize * 0.35 * scale : tileSize * 0.5 * scale;
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          tile.value,
          position.x + tileSize / 2,
          position.y + tileSize / 2
        );
      }
    });
  }

  // 移动方块
  function move(direction) {
    if (isGameOver || isWon || isAnimating) return false;

    // 获取移动向量
    const getVector = (dir) => {
      const map = {
        'up': { x: 0, y: -1 },
        'right': { x: 1, y: 0 },
        'down': { x: 0, y: 1 },
        'left': { x: -1, y: 0 }
      };
      return map[dir];
    };

    // 获取遍历顺序
    const buildTraversals = (vector) => {
      const traversals = { x: [], y: [] };
      for (let pos = 0; pos < CONFIG.gridSize; pos++) {
        traversals.x.push(pos);
        traversals.y.push(pos);
      }
      // 总是从最远的格子开始遍历
      if (vector.x === 1) traversals.x = traversals.x.reverse();
      if (vector.y === 1) traversals.y = traversals.y.reverse();
      return traversals;
    };

    const vector = getVector(direction);
    const traversals = buildTraversals(vector);
    let moved = false;

    // 标记本轮合并过的位置，避免二次合并
    const mergedPositions = Array(CONFIG.gridSize).fill(null).map(() => Array(CONFIG.gridSize).fill(false));

    // 待生成的合并结果方块
    const pendingMerges = [];

    // 重置方块状态并保存当前位置作为动画起点
    tiles.forEach(tile => {
      tile.isNew = false;
      tile.isMerged = false;
      tile.mergedFrom = null;
      tile.toDelete = false;
      tile.savePosition(); // 关键修复：确保所有方块（包括未移动的）的动画起点都是当前位置
    });

    // 辅助函数：查找方块
    const getTileAt = (row, col) => {
      return tiles.find(t => t.row === row && t.col === col && !t.toDelete);
    };

    // 辅助函数：查找最远空位
    const findFarthestPosition = (cell, vector) => {
      let previous;
      // 这里的 cell 是 {x: col, y: row} 还是 {row, col}?
      // 统一使用 row, col. vector.x 对应 col (左右), vector.y 对应 row (上下)
      // cell 传入 {row, col}

      let currentRow = cell.row;
      let currentCol = cell.col;

      do {
        previous = { row: currentRow, col: currentCol };
        currentRow += vector.y;
        currentCol += vector.x;
      } while (
        currentRow >= 0 && currentRow < CONFIG.gridSize &&
        currentCol >= 0 && currentCol < CONFIG.gridSize &&
        board[currentRow][currentCol] === 0
      );

      return {
        farthest: previous,
        next: { row: currentRow, col: currentCol } // 可能是边界或障碍物
      };
    };

    // 遍历格子
    // traversals.y 对应 row, traversals.x 对应 col
    traversals.y.forEach(row => {
      traversals.x.forEach(col => {
        const tile = getTileAt(row, col);

        if (tile) {
          const positions = findFarthestPosition({ row, col }, vector);
          const next = getTileAt(positions.next.row, positions.next.col);

          // 检查是否合并
          if (
            next && next.value === tile.value &&
            !mergedPositions[positions.next.row][positions.next.col]
          ) {
            // 合并！
            const merged = new Tile(positions.next.row, positions.next.col, tile.value * 2);
            merged.mergedFrom = [tile, next];

            // 更新分数
            score += merged.value;
            if (merged.value === 2048 && !isWon) isWon = true;

            // 标记合并位置
            mergedPositions[positions.next.row][positions.next.col] = true;

            // 移动当前方块到目标
            tile.moveTo(positions.next.row, positions.next.col);

            // 标记待删除
            tile.toDelete = true;
            next.toDelete = true;

            // 记录待添加的新方块
            pendingMerges.push(merged);

            // 更新棋盘数据（立即更新，供后续方块判断）
            board[row][col] = 0;
            board[positions.next.row][positions.next.col] = merged.value;

            moved = true;
          } else {
            // 只是移动
            // positions.farthest 可能就是当前位置
            if (positions.farthest.row !== row || positions.farthest.col !== col) {
              tile.moveTo(positions.farthest.row, positions.farthest.col);

              board[row][col] = 0;
              board[positions.farthest.row][positions.farthest.col] = tile.value;

              moved = true;
            }
          }
        }
      });
    });

    if (moved) {
      // 开始动画
      isAnimating = true;
      const startTime = performance.now();

      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / CONFIG.animationDuration, 1);
        const easedProgress = easeOutCubic(progress);

        drawAnimated(easedProgress);

        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        } else {
          // 动画结束清理
          isAnimating = false;

          // 1. 移除被合并的方块
          tiles = tiles.filter(t => !t.toDelete);

          // 2. 添加合并产生的新方块
          pendingMerges.forEach(t => {
            t.isNew = false; // 避免出现动画，或者设为 mergedFrom 动画
            // 可以给 merged 方块一个特殊的弹跳效果
            t.mergedFrom = true; // 触发 getScale 中的弹跳
            tiles.push(t);
          });

          updateScore();
          addRandomTile();
          draw();

          if (isWon) {
            messageElement.innerHTML = `
              <div class="game-over">
                <h3>🎉 恭喜！</h3>
                <p>你达到了 2048！</p>
                <p>最终得分：${score}</p>
              </div>
            `;
          } else if (checkGameOver()) {
            isGameOver = true;
            messageElement.innerHTML = `
              <div class="game-over">
                <h3>游戏结束！</h3>
                <p>最终得分：${score}</p>
                <p>最高分：${highScore}</p>
              </div>
            `;
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    return moved;
  }

  // 检查游戏是否结束
  function checkGameOver() {
    // 检查是否有空位
    for (let i = 0; i < CONFIG.gridSize; i++) {
      for (let j = 0; j < CONFIG.gridSize; j++) {
        if (board[i][j] === 0) return false;
      }
    }

    // 检查是否可以合并
    for (let i = 0; i < CONFIG.gridSize; i++) {
      for (let j = 0; j < CONFIG.gridSize; j++) {
        const current = board[i][j];
        if (j < CONFIG.gridSize - 1 && current === board[i][j + 1]) return false;
        if (i < CONFIG.gridSize - 1 && current === board[i + 1][j]) return false;
      }
    }

    return true;
  }

  // 更新分数
  function updateScore() {
    scoreElement.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreElement.textContent = highScore;
    }
  }

  // 键盘控制
  function handleKeyDown(e) {
    const key = e.key.toLowerCase();

    if (!isGameOver && !isWon && !isAnimating) {
      let moved = false;
      switch (key) {
        case 'arrowleft':
        case 'a':
          e.preventDefault();
          moved = move('left');
          break;
        case 'arrowright':
        case 'd':
          e.preventDefault();
          moved = move('right');
          break;
        case 'arrowup':
        case 'w':
          e.preventDefault();
          moved = move('up');
          break;
        case 'arrowdown':
        case 's':
          e.preventDefault();
          moved = move('down');
          break;
      }
    }
  }

  // 触摸控制
  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (isGameOver || isWon || isAnimating) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    const minSwipeDistance = 30;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          move('right');
        } else {
          move('left');
        }
      }
    } else {
      if (Math.abs(diffY) > minSwipeDistance) {
        if (diffY > 0) {
          move('down');
        } else {
          move('up');
        }
      }
    }
  }

  // 事件监听
  startBtn.addEventListener('click', initGame);
  document.addEventListener('keydown', handleKeyDown);

  // 触摸事件配置：passive: false 允许调用 preventDefault 阻止页面滚动
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

  // 初始化
  initCanvas();
  initGame();
})();
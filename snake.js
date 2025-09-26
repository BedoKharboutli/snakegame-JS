const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const finalScoreElement = document.getElementById("finalScore");
const playAgainBtn = document.getElementById("playAgainBtn");

const box = 20;
const maxX = Math.floor(canvas.width / box) - 1;
const maxY = Math.floor(canvas.height / box) - 1;

let snake = [];
let food = {};
let score = 0;
let d;
let game;

function initGame() {
  snake = [];
  snake[0] = { x: 9 * box, y: 10 * box };
  
  food = {
    x: Math.floor(Math.random() * maxX + 1) * box,
    y: Math.floor(Math.random() * maxY + 1) * box,
  };
  
  score = 0;
  scoreElement.textContent = score;
  d = undefined;
  gameOverOverlay.style.display = 'none';
  
  if (game) clearInterval(game);
  game = setInterval(draw, 125);
}
document.addEventListener("keydown", direction);
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
  evt.preventDefault(); // Prevent scrolling
  const firstTouch = evt.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  evt.preventDefault(); // Prevent scrolling

  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  // Minimum swipe distance to register
  const minSwipeDistance = 30;
  
  if (Math.abs(xDiff) > minSwipeDistance || Math.abs(yDiff) > minSwipeDistance) {
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        /* left swipe */
        if (d != "RIGHT") {
          d = "LEFT";
        }
      } else {
        /* right swipe */
        if (d != "LEFT") {
          d = "RIGHT";
        }
      }
    } else {
      if (yDiff > 0) {
        /* up swipe */
        if (d != "DOWN") {
          d = "UP";
        }
      } else {
        /* down swipe */
        if (d != "UP") {
          d = "DOWN";
        }
      }
    }
    /* reset values */
    xDown = null;
    yDown = null;
  }
}

function direction(event) {
  if (event.keyCode == 37 && d != "RIGHT") {
    d = "LEFT";
  } else if (event.keyCode == 38 && d != "DOWN") {
    d = "UP";
  } else if (event.keyCode == 39 && d != "LEFT") {
    d = "RIGHT";
  } else if (event.keyCode == 40 && d != "UP") {
    d = "DOWN";
  }
}

function collision(newHead, array) {
  for (let i = 0; i < array.length; i++) {
    if (newHead.x == array[i].x && newHead.y == array[i].y) {
      return true;
    }
  }
  return false;
}

function drawFood(x, y) {
  // Create a glowing food effect
  const centerX = x + box / 2;
  const centerY = y + box / 2;
  const radius = box / 3;
  
  // Outer glow
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2);
  gradient.addColorStop(0, 'rgba(255, 100, 100, 0.8)');
  gradient.addColorStop(0.7, 'rgba(255, 50, 50, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Main food body
  ctx.fillStyle = '#ff4757';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner highlight
  ctx.fillStyle = '#ff6b7a';
  ctx.beginPath();
  ctx.arc(centerX - radius/3, centerY - radius/3, radius/2, 0, Math.PI * 2);
  ctx.fill();
}

function drawSnakeSegment(x, y, isHead = false) {
  const centerX = x + box / 2;
  const centerY = y + box / 2;
  const radius = box / 2.5;
  
  if (isHead) {
    // Head with glow effect
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5);
    gradient.addColorStop(0, '#00ff7f');
    gradient.addColorStop(0.7, '#00cc66');
    gradient.addColorStop(1, 'rgba(0, 255, 127, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Head body
    ctx.fillStyle = '#00ff7f';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(centerX - radius/3, centerY - radius/3, radius/6, 0, Math.PI * 2);
    ctx.arc(centerX + radius/3, centerY - radius/3, radius/6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Body segments with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, '#32ff7e');
    gradient.addColorStop(1, '#18d26e');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX - radius/3, centerY - radius/3, radius/3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function draw() {
  // Create a subtle grid background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw subtle grid lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= canvas.width; i += box) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i <= canvas.height; i += box) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    drawSnakeSegment(snake[i].x, snake[i].y, i === 0);
  }

  // Draw food
  drawFood(food.x, food.y);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  if (snakeX == food.x && snakeY == food.y) {
    score += 10;
    scoreElement.textContent = score;
    
    food = {
      x: Math.floor(Math.random() * maxX + 1) * box,
      y: Math.floor(Math.random() * maxY + 1) * box,
    };
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeX >= canvas.width ||
    snakeY < 0 ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    showGameOver();
  }

  snake.unshift(newHead);
}

function showGameOver() {
  finalScoreElement.textContent = score;
  gameOverOverlay.style.display = 'flex';
}

// Touch control buttons
function handleControlButton(direction) {
  if (direction === "UP" && d !== "DOWN") {
    d = "UP";
  } else if (direction === "DOWN" && d !== "UP") {
    d = "DOWN";
  } else if (direction === "LEFT" && d !== "RIGHT") {
    d = "LEFT";
  } else if (direction === "RIGHT" && d !== "LEFT") {
    d = "RIGHT";
  }
}

// Event listeners
playAgainBtn.addEventListener('click', initGame);

// Add touch control button listeners
document.querySelectorAll('.control-btn').forEach(btn => {
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const direction = btn.getAttribute('data-direction');
    handleControlButton(direction);
  });
  
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const direction = btn.getAttribute('data-direction');
    handleControlButton(direction);
  });
});

// Prevent zoom on double tap
document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

// Initialize the game
initGame();

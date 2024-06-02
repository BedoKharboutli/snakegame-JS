const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
  x: Math.floor(Math.random() * 29 + 1) * box,
  y: Math.floor(Math.random() * 19 + 1) * box,
};

let d;
document.addEventListener("keydown", direction);
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
  const firstTouch = evt.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

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

function drawDiamond(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + box / 2, y); // Top
  ctx.lineTo(x + box, y + box / 2); // Right
  ctx.lineTo(x + box / 2, y + box); // Bottom
  ctx.lineTo(x, y + box / 2); // Left
  ctx.closePath();
  ctx.fill();
}

function drawSnakeSegment(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + box * 0.1, y + box * 0.2);
  ctx.quadraticCurveTo(x + box / 2, y, x + box * 0.9, y + box * 0.2);
  ctx.quadraticCurveTo(x + box, y + box / 2, x + box * 0.9, y + box * 0.8);
  ctx.quadraticCurveTo(x + box / 2, y + box, x + box * 0.1, y + box * 0.8);
  ctx.quadraticCurveTo(x, y + box / 2, x + box * 0.1, y + box * 0.2);
  ctx.closePath();
  ctx.fill();
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    const color = i == 0 ? "green" : "lime";
    drawSnakeSegment(snake[i].x, snake[i].y, color);
  }

  drawDiamond(food.x, food.y, "red");

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  if (snakeX == food.x && snakeY == food.y) {
    food = {
      x: Math.floor(Math.random() * 29 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box,
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
    alert("Game Over");
    alert("Refresh the page to restart the game ");
  }

  snake.unshift(newHead);
}

let game = setInterval(draw, 125);

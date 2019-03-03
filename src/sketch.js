let pieceSize
let velX, velY;
let snakeParts = [];
let food;
let score;
let foodImg, bodyImg, headUpImg, headRightImg, headDownImg, headLeftImg;
let isGameOver;
let backgroundImgsoundtrack;
let startFlag;
let direction;

function preload() {
  soundFormats('mp3');
  soundtrack = loadSound('soundtrack.mp3');
  foodImg = loadImage('food.png');
  bodyImg = loadImage('body.png');
  headUpImg = loadImage('head_up.png');
  headRightImg = loadImage('head_right.png');
  headDownImg = loadImage('head_down.png');
  headLeftImg = loadImage('head_left.png');
  backgroundImg = loadImage('background.png');
}

function setup() {
  // Initialize game variables
  createCanvas(800, 800);
  pieceSize = 50;
  velX = 1;
  velY = 0;
  snakeParts[0] = new Piece(width/2, height/2, pieceSize, bodyImg, false);
  score = 0;
  isGameOver = false;
  startFlag = false;
  direction = "right";
  frameRate(6);
  fill(255);
}

/**
 * Main loop of the game.
 */
function draw() {
  if (!startFlag) {
    startScreen();
    if (keyIsPressed) {
      startFlag = true;
      startSequence();
    }
  } else {
    background(backgroundImg);
    if (isGameOver) {
      gameOverScreen();
    } else {
      update();
      render();
    }
  }
}

/**
 * Start screen
 */
function startScreen() {
  textAlign(CENTER, CENTER);
  background(0);
  textSize(60);
  text("Prepare for battle!", width / 2, height / 2);
  textSize(32);
  text("Press any key to start", width / 2, height / 2 + 60);

}

function startSequence() {
  soundtrack.setVolume(0.5);
  soundtrack.loop();
  background(backgroundImg);
  noStroke();
  generateFood();
  // Render because of blank screen before frameRate
  render();
}

/**
 * Game over sequence
 */
function gameOverScreen() {
  textAlign(CENTER, CENTER);
  textSize(60);
  text("Game Over!", width / 2, height / 2);
  textSize(32);
  text("Score: " + score, width / 2, height / 2 + 60);
  text("Press F5 to play again", width / 2, height / 2 + 110);
  text("Graphics by ITJohan 2019", width / 2, height / 2 + 160);
}

/**
 * Updates the game variables
 */
function update() {
  nextMove();
}

/**
 * Gets coords for next position.
 * If outside canvas the player dies, or else it adds food or updates tail and head.
 */
function nextMove() {
  let newX = snakeParts[0].x + velX * pieceSize;
  let newY = snakeParts[0].y + velY * pieceSize;

  if (isBodyHit(newX, newY) || isEdgeHit(newX, newY)) {
    isGameOver = true;
  } else if (newX === food.x && newY === food.y) {
    food.isImg = false;
    snakeParts.unshift(food);
    checkHeadDirection;
    generateFood();
    score++;
  } else {
    updateTail();
    updateHead(newX, newY);
  }
}

/**
 * Returns true if body is hit, false if not
 * @param {*} newX New x coordinate.
 * @param {*} newY New y coordinate.
 */
function isBodyHit(newX, newY) {
  // TODO: Hit on body should result in death
  for (let snakePart of snakeParts) {
    if (snakePart.x == newX && snakePart.y == newY) {
      return true;
    }
  }
  return false;
}

/**
 * Returns true if edge is hit, false if not
 * @param {*} newX New x coordinate.
 * @param {*} newY New y coordinate.
 */
function isEdgeHit(newX, newY) {
  return newX < 0 || newX > width - pieceSize || newY < 0 || newY > height - pieceSize;
}

/**
 * Updates the coordinates for the tail pieces.
 */
function updateTail() {
  for (let i = snakeParts.length - 1; i > 0; i--) {
    snakeParts[i].x = snakeParts[i - 1].x;
    snakeParts[i].y = snakeParts[i - 1].y;
  }
}

/**
 * Updates the coordinates for the head piece.
 * @param {*} newX New x coordinate.
 * @param {*} newY New y coordinate.
 */
function updateHead(newX, newY) {
  snakeParts[0].x = newX;
  snakeParts[0].y = newY;
  checkHeadDirection();
}

/**
 * Renders the game components
 */
function render() {
  for (let i = 0, n = snakeParts.length; i < n; i++) {
    snakeParts[i].render();
    snakeParts[i].isImg = false;
    snakeParts[i].img = bodyImg;
  }
  food.render();
  text("Score: " + score, width - 200, 50);
}

function checkHeadDirection() {
  snakeParts[0].isImg = true;
  if (direction == "up") {
    snakeParts[0].img = headUpImg;
  } else if (direction == "right") {
    snakeParts[0].img = headRightImg;
  } else if (direction == "down") {
    snakeParts[0].img = headDownImg;
  } else if (direction == "left") {
    snakeParts[0].img = headLeftImg;
  }
}

/**
 * Generates new food at random location
 */
function generateFood() {
  let foodX = Math.round(random(0, width / pieceSize - 1)) * pieceSize;
  let foodY = Math.round(random(0, width / pieceSize - 1)) * pieceSize;

  for (let i = 0, n = snakeParts.length; i < n; i++) {
    if (foodX === snakeParts[i].x && foodY === snakeParts[i].y) {
      generateFood();
      return;
    }
  }

  food = new Piece(foodX, foodY, pieceSize, foodImg, true);
}

/**
 * Changes the velocity according to key pressed
 */
function keyPressed() {
  if(keyCode === UP_ARROW && velY != 1) {
    velX = 0;
    velY = -1;
    direction = "up";
  }
  if(keyCode === RIGHT_ARROW && velX != -1) {
    velX = 1;
    velY = 0;
    direction = "right";
  }
  if(keyCode === DOWN_ARROW && velY != -1) {
    velX = 0;
    velY = 1;
    direction = "down";
  }
  if(keyCode === LEFT_ARROW && velX != 1) {
    velX = -1;
    velY = 0;
    direction = "left";
  }
}

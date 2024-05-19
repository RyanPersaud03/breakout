// Get necessary DOM elements
const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

// Define constants for block, ball, and board dimensions
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;

// Define initial direction for the ball
let xDirection = 2;
let yDirection = 2;

// Define initial positions for the user paddle and ball
const userStart = [230, 10];
let currentPosition = [...userStart];

const ballStart = [270, 40];
let ballCurrentPosition = [...ballStart];

// Declare variables for game state
let timerId;
let score = 0;
let level = 1;

// Block class to define the structure of a block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    this.topLeft = [xAxis, yAxis + blockHeight];
  }
}

// Array to hold all the block objects
let blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

// Function to add all blocks to the grid
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div');
    block.classList.add('block');
    block.style.left = blocks[i].bottomLeft[0] + 'px';
    block.style.bottom = blocks[i].bottomLeft[1] + 'px';
    grid.appendChild(block);
  }
}

// Call the function to draw the blocks
addBlocks();

// Create the user paddle element and add it to the grid
const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);

// Create the ball element and add it to the grid
const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

// Function to draw the user paddle at its current position
function drawUser() {
  user.style.left = currentPosition[0] + 'px';
  user.style.bottom = currentPosition[1] + 'px';
  user.style.width = blockWidth + 'px';
}

// Function to draw the ball at its current position
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px';
  ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// Function to move the user paddle based on key presses
function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawUser();
      }
      break;
    case 'ArrowRight':
      if (currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
        drawUser();
      }
      break;
  }
}

// Add event listener for user paddle movement
document.addEventListener('keydown', moveUser);

// Function to move the ball
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}

// Start game when start button is clicked
startButton.addEventListener('click', () => {
  resetGame();
  timerId = setInterval(moveBall, 30);
});

// Function to check for collisions between ball and blocks, walls, and paddle
function checkForCollisions() {
  // Check for block collisions
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll('.block'));
      allBlocks[i].classList.remove('block');
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;
      if (blocks.length === 0) {
        scoreDisplay.innerHTML = 'You Win!';
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);
        levelUp();
      }
    }
  }
  // Check for wall hits
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[0] <= 0 ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter
  ) {
    changeDirection();
  }
  // Check for paddle collision
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection();
  }
  // Game over if ball hits bottom
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = 'You lose!';
    document.removeEventListener('keydown', moveUser);
  }
}

// Function to change ball direction upon collision
function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}

// Function to level up the game
function levelUp() {
  level++;
  xDirection += 0.5;
  yDirection += 0.5;
  blockWidth -= 5;
  currentPosition = [...userStart];
  ballCurrentPosition = [...ballStart];
  addBlocks();
  drawUser();
  drawBall();
  if (timerId) {
    clearInterval(timerId);
  }
  timerId = setInterval(moveBall, 30 - level * 2);
}

// Function to reset the game state
function resetGame() {
  // Reset positions and directions
  currentPosition = [...userStart];
  ballCurrentPosition = [...ballStart];
  xDirection = 2;
  yDirection = 2;
  
  // Clear existing blocks and redraw them
  const allBlocks = document.querySelectorAll('.block');
  allBlocks.forEach(block => block.remove());
  blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210)
  ];
  addBlocks();
  
  // Reset score and level
  score = 0;
  level = 1;
  scoreDisplay.innerHTML = score;

  // Redraw user paddle and ball
  drawUser();
  drawBall();
  
  // Add event listener for user paddle movement
  document.addEventListener('keydown', moveUser);
}

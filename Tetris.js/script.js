let canvas;
let context;
let height = 20;
let width = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1;
let winOrLose = 'Playing';
let tetrisLogo;
let coordinateArray = [...Array(height)].map(e => Array(width).fill(0));
let stoppedShapeArray = [...Array(height)].map(e => Array(width).fill(0));
let currentTetromino = [[1,0], [0,1], [1,1], [2,1]];
let tetrominos = []; // stores all tetrominos
let tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];
let currentTetrominoColor;
let gameBoardArray = [...Array(height)].map(e => Array(width).fill(0));
let DIRECTION = {
 IDLE: 0,
 DOWN: 1,
 LEFT: 2,
 RIGHT: 3
};
let direction;


class Coordinates{
 constructor(x,y) {
  this.x = x;
  this.y = y;
 }
}

document.addEventListener('DOMContentLoaded',SetupCanvas);

//create the coordinate array with X Y pixel for each element
function createCoordinateArray() {
 let i = 0, j = 0;
 for(let y=9; y<=446; y+=23) {
  for(let x=11; x<=264; x+=23) {
   coordinateArray[i][j] = new Coordinates(x,y);
   i++;
  }
  j++;
  i = 0;
 }
}


function SetupCanvas() {
 canvas = document.getElementById('my-canvas');
 context = canvas.getContext('2d'); // working with 2d 
 canvas.width = 936;
 canvas.height = 956;

 context.scale(2,2);
 context.fillStyle = 'white';
 context.fillRect(0,0,canvas.width,canvas.height);

 context.strokeStyle = 'black';
 context.strokeRect(8,8,280,462);

 tetrisLogo = new Image(161,54);
 tetrisLogo.onload = DrawTetrisLogo;
 tetrisLogo.src = 'th.jpg';

 context.fillStyle = 'black';
 context.font = '21px Arial';
 context.fillText('SCORE', 300, 98);
 context.strokeRect(300,107,161,24);
 context.fillText(score.toString(), 310, 127);
 context.fillText('LEVEL', 300, 157);
 context.strokeRect(300,171,161,24);
 context.fillText(level.toString(), 310, 190);
 context.fillText('WIN / LOSE', 300, 221);
 context.fillText(winOrLose, 310, 261);
 context.strokeRect(300,232,161,95);
 context.fillText('CONTROLS', 300, 354);
 context.strokeRect(300,366,161,104);
 context.font = '19px Arial';
 context.fillText('A : Move Left', 310, 388);
 context.fillText('D : Move Right', 310, 413);
 context.fillText('S : Move Down', 310, 438);
 context.fillText('E : Rotate Right', 310, 463);


 document.addEventListener('keydown', handleKeyPress);
 createTetrominos();
 createTetromino();

 createCoordinateArray();

 DrawTetromino();
}

// draw tetromino
function DrawTetromino() {
 for(let i=0; i<currentTetromino.length; i++) {
  let x = currentTetromino[i][0] + startX;
  let y = currentTetromino[i][1] + startY;
  gameBoardArray[x][y] = 1; // array with 0 and 1 where 1 represents the square of the shape
  let coorX = coordinateArray[x][y].x; // coordinate x of pixel
  let coorY = coordinateArray[x][y].y; // coordinate y of pixel
  context.fillStyle = currentTetrominoColor; // fill the shape with the current color
  context.fillRect(coorX, coorY, 21, 21); // draw the square with X Y coordinates and 21 pixel width and height
 }
}

// handle key presses 
function handleKeyPress(key) {
 if(winOrLose != 'Game Over') {
   // 'A' key of the keyboard
  if(key.keyCode === 65) { 
   direction = DIRECTION.LEFT;
   if(!HittingTheWall() && !checkForHorizontalCollision()) {
   DeleteTetromino(); // delete original tetrinino/ shape
   startX--; // x position to the left
   DrawTetromino() // draw new tetromino
   }
  } else if(key.keyCode === 68) { // 'D' key of the keyboard
   direction = DIRECTION.RIGHT;
   if(!HittingTheWall() && !checkForHorizontalCollision()) {
   DeleteTetromino();
   startX++;
   DrawTetromino();
   }
  } else if(key.keyCode === 83) {// 'S' key of the keyboard
   moveTetrominoDown();
  } else if(key.keyCode === 69) {// 'E' key of the keyboard
   RotateTetromino();
  }
 }
}

function moveTetrominoDown() {
  direction = DIRECTION.DOWN;
  if(!checkForVerticalCollision()) {
   DeleteTetromino();
   startY++;
   DrawTetromino();
  }
}

window.setInterval(function() {
 if(winOrLose != 'Game Over') {
  moveTetrominoDown();
 }
}, 1000);

// delete tetrominos 
function DeleteTetromino() {
 for(let i=0; i<currentTetromino.length; i++) {
  let x = currentTetromino[i][0] + startX;
  let y = currentTetromino[i][1] + startY;
  gameBoardArray[x][y] = 0;
  let coorX = coordinateArray[x][y].x; // coordinate x of pixel
  let coorY = coordinateArray[x][y].y; // coordinate y of pixel
  context.fillStyle = 'white'; 
  context.fillRect(coorX, coorY, 21, 21);
 }
}


function createTetrominos() {
  // Push T
 tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
  // Push I
 tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
  // Push J
 tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
  // Push Square
 tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
  // Push L
 tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
  // Push S
 tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
  // Push Z
 tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function createTetromino() {
 let randomTetromino = Math.floor( Math.random() * tetrominos.length);
 currentTetromino = tetrominos[randomTetromino];
 currentTetrominoColor = tetrominoColors[randomTetromino];
}

function HittingTheWall() {
 for(let i = 0; i < currentTetromino.length; i++) {
  let newX = currentTetromino[i][0] + startX;
  if(newX <= 0 && direction === DIRECTION.LEFT) {
   return true;
  } else if(newX >= 11 && direction === DIRECTION.RIGHT) {
   return true;
  }
 }
 return false;
}


function DrawTetrisLogo() {
 context.drawImage(tetrisLogo, 300, 8, 161, 54)
}


function checkForVerticalCollision() {
 let tetrominoCopy = currentTetromino;
 let collision = false;
 for(let i = 0; i < tetrominoCopy.length; i++) {
  let square = tetrominoCopy[i];
  let x = square[0] + startX;
  let y = square[1] + startY;
  if(direction === DIRECTION.DOWN) {
   y++;
  }
   if(typeof stoppedShapeArray[x][y+1] === 'string') {
    DeleteTetromino();
     startY++;
     DrawTetromino();
     collision = true;
     break;
   }
   if(y >= 20) {
     collision = true;
     break;
   }
  }
  if(collision) {
   if(startY <= 2) {
    winOrLose = 'Game Over';
    context.fillStyle = 'white';
    context.fillRect(310, 242, 140, 30);
    context.fillStyle = 'black';
    context.fillText(winOrLose, 310, 261);
   } else {
    for(let i = 0; i < tetrominoCopy.length; i++) {
     let square = tetrominoCopy[i];
     let x = square[0] + startX;
     let y = square[1] + startY;
     stoppedShapeArray[x][y] = currentTetrominoColor;
    }
    checkForCompletedRows();
    createTetromino();
    direction = DIRECTION.IDLE;
    startX = 4;
    startY = 0;
    DrawTetromino();
   }
  }
 }


function checkForHorizontalCollision() {
 let tetrominoCopy = currentTetromino;
 let collision = false;
 for(let i = 0; i < tetrominoCopy.length; i++) {
  let square = tetrominoCopy[i];
  let x = square[0] + startX;
  let y = square[1] + startY;
  if(direction === DIRECTION.LEFT) {
   x--;
  } else if(direction === DIRECTION.RIGHT) {
   x++;
  }
  var stoppedShapeValue = stoppedShapeArray[x][y];
  if(typeof stoppedShapeValue === 'string') {
   collision = true;
   break;
  }
 }
 return collision;
}


function checkForCompletedRows() {
 let rowsToDelete = 0;
 let startOfDeletion = 0;
 for(let y = 0; y < height; y++) {
  let completed = true;
  for(let x = 0; x < width; x++) {
   let square = stoppedShapeArray[x][y];
   if(square === 0 || (typeof square === 'undefined')) {
    completed = false;
    break;
   }
  }
  if(completed) {
   if(startOfDeletion === 0) startOfDeletion = y;
   rowsToDelete++;
   for(let i = 0; i < width; i++) {
    stoppedShapeArray[i][y] = 0;
    gameBoardArray[i][y] = 0;
    let coorX = coordinateArray[i][y].x;
    let coorY = coordinateArray[i][y].y;
    context.fillStyle = 'white';
    context.fillRect(coorX, coorY, 21, 21);
   }
  }
 }
 if(rowsToDelete > 0) {
  score += 10;
  context.fillStyle = 'white';
  context.fillRect(310, 109, 140, 19);
  context.fillStyle = 'black';
  context.fillText(score.toString(), 310, 127);
  MoveAllRowsDown(rowsToDelete, startOfDeletion);
 }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
 for(var i = startOfDeletion -1; i >= 0; i--) { 
  for(var x = 0; x < width; x++) {
   var y2 = i + rowsToDelete;
   var square = stoppedShapeArray[x][i];
   var nextSquare = stoppedShapeArray[x][y2];
   if(typeof square === 'string') {
    nextSquare = square;
    gameBoardArray[x][y2] = 1;
    stoppedShapeArray[x][y2] = square;
    let coorX = coordinateArray[x][y2].x;
    let coorY = coordinateArray[x][y2].y;
    context.fillStyle = nextSquare;
    context.fillRect(coorX, coorY, 21, 21);
    square = 0;
    gameBoardArray[x][i] = 0;
    stoppedShapeArray[x][i] = 0;
    coorX = coordinateArray[x][i].x;
    coorY = coordinateArray[x][i].y;
    context.fillStyle = 'white';
    context.fillRect(coorX, coorY, 21, 21);
   }
  }
 }
}
 
function RotateTetromino() {
 let newRotation = new Array();
 let tetrominoCopy = currentTetromino;
 let tetrominoBackUp;
 for(let i = 0; i < tetrominoCopy.length; i++) {
  tetrominoBackUp = [...currentTetromino]; // copy with no reference to currentTetromino
  let x = tetrominoCopy[i][0];
  let y = tetrominoCopy[i][1];
  let newX = (getLastSquareX() - y);
  let newY = x;
  newRotation.push([newX, newY]);
 }
 DeleteTetromino();
 try {
  currentTetromino = newRotation
  DrawTetromino();
 } catch(e) {
  if(e instanceof TypeError) {
   currentTetromino = tetrominoBackUp;
   DeleteTetromino();
   DrawTetromino();
  }
 }
}


function getLastSquareX() {
  let lastX = 0;
  for(let i = 0; i < currentTetromino.length; i++) {
   let square = currentTetromino[i];
   if(square[0] > lastX) {
    lastX = square[0];
   }
  }
  return lastX;
}